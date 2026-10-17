import { z, type NoteActionContext } from "@dsh-workbench/runtime";
import { note, unitsSchema, placeSchema, placeCandidateSchema, weatherConfigSchema, weatherForecastSchema, type Units, type Place, type WeatherConfig } from "./model";
import { normalize, num } from "./forecast";
export { note } from "./model";

/**
 * 天气便笺的后台能力。
 *
 * 数据源：Open-Meteo（https://open-meteo.com）——免费、无需 API Key、
 * 非商业用途无需注册；其他用途请查看服务条款。地名检索使用同一家的 Geocoding API。
 * 框架适配器负责共享预报读取与新鲜度；便笺只保存城市配置并投影展示结果。
 */

const configSnapshotSchema = z.object({
  value:weatherConfigSchema.partial(), revision:z.string(), updatedAt:z.string().optional(),
  origin:z.object({chain:z.array(z.string()), deliveryId:z.string().optional()}).optional(),
});

export const queries = {
  view: note.query({description:"读取当前城市天气预报。",input:z.object({}).nullable(),output:weatherForecastSchema,visibility:'private',requiresConfig:false}, async (ctx, _input) => {
    const config = (await ctx.config.read()).value;
    if (!config.place) return { status: 'empty' as const, current: null, hourly: [], daily: [] };
    const units = config.units ?? 'metric';
    const forecastFor = { latitude: config.place.latitude, longitude: config.place.longitude, units };
    const forecast = await ctx.resources.read<Record<string, unknown>>({ name: 'extension.weather.forecast', input: forecastFor });
    if (forecast.error && !forecast.data) throw new Error(forecast.error);
    return { ...normalize(forecast.data!), forecastFor, status: forecast.error ? 'error' as const : 'ok' as const, error: forecast.error ?? null };
  }),
  searchPlaces: note.query({description:"按名称检索天气城市。",input:z.object({query:z.string()}),output:z.object({results:z.array(placeCandidateSchema)}),visibility:'private',requiresConfig:false}, async (ctx, input) => {
  const query = (input.query ?? "").trim();
  if (query.length < 1) return { results: [] };
  const snapshot = await ctx.resources.read<Record<string, unknown>>({name:'extension.weather.search',input:{query}});
  if (snapshot.error || !snapshot.data) throw new Error(snapshot.error ?? '城市检索失败');
  const payload = snapshot.data;
  const results = Array.isArray(payload.results) ? (payload.results as Record<string, unknown>[]) : [];
  return {
    results: results.map((item) => ({
      name: String(item.name ?? ""),
      admin1: item.admin1 ? String(item.admin1) : undefined,
      country: item.country ? String(item.country) : undefined,
      latitude: num(item.latitude),
      longitude: num(item.longitude),
      timezone: item.timezone ? String(item.timezone) : undefined,
    })),
  };
  }),
};

async function updateConfig(ctx: NoteActionContext<typeof note>, patch: Partial<WeatherConfig>) {
  return ctx.config.update((draft) => { Object.assign(draft, patch); });
}

/** 切换公制 / 英制单位并重新拉取。 */
export const setUnits = note.action({description:"切换天气显示单位。",input:z.object({units:unitsSchema}),output:configSnapshotSchema,visibility:'private',requiresConfig:false}, async (ctx, input) => {
  const units: Units = input.units === "imperial" ? "imperial" : "metric";
  return updateConfig(ctx, { units });
});

/** 使用检索结果里的城市，并立即刷新。 */
export const usePlace = note.action({description:"保存选中的天气城市。",input:z.object({place:placeSchema}),output:configSnapshotSchema,visibility:'private',requiresConfig:false}, async (ctx, input) => {
  const raw = input.place;
  if (!raw || typeof raw.latitude !== "number" || typeof raw.longitude !== "number") throw new Error("城市坐标无效");
  const place: Place = {
    name: String(raw.name ?? "未知地点"),
    admin1: raw.admin1 ? String(raw.admin1) : undefined,
    country: raw.country ? String(raw.country) : undefined,
    latitude: raw.latitude,
    longitude: raw.longitude,
    timezone: raw.timezone ? String(raw.timezone) : undefined,
    source: "search",
  };
  return updateConfig(ctx, { place });
});

/** 城市检索（Open-Meteo Geocoding，免费无需密钥）。 */


/**
 * 按网络出口位置定位（ipwho.is，免费无需密钥）。
 * 只作为可选操作：出口 IP 可能与真实所在地不同，所以不自动覆盖用户选择。
 */
export const locateByNetwork = note.action({description:"按网络出口位置设置天气城市。",input:z.object({reason:z.string().optional()}).default({}),output:configSnapshotSchema.extend({place:placeSchema}),visibility:'private',requiresConfig:false}, async (ctx, _input) => {
  const snapshot = await ctx.resources.revalidate<Record<string, unknown>>({name:'extension.weather.location',input:{}});
  if (snapshot.error || !snapshot.data) throw new Error(snapshot.error ?? '定位失败');
  const payload = snapshot.data;
  if (payload.success === false || typeof payload.latitude !== "number" || typeof payload.longitude !== "number") {
    throw new Error("网络定位未返回可用坐标");
  }
  const timezone = typeof payload.timezone === "object" && payload.timezone !== null
    ? (payload.timezone as Record<string, unknown>).id
    : payload.timezone;
  const place: Place = {
    name: String(payload.city ?? "网络位置"),
    admin1: payload.region ? String(payload.region) : undefined,
    country: payload.country ? String(payload.country) : undefined,
    latitude: payload.latitude,
    longitude: payload.longitude,
    timezone: typeof timezone === "string" ? timezone : undefined,
    source: "network",
  };
  const result = await updateConfig(ctx, { place });
  return { ...result, place };
});
