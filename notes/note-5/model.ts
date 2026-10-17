import { defineNote, z } from "@dsh-workbench/runtime";
import { normalize } from "./forecast";

export const unitsSchema = z.enum(['metric', 'imperial']);
export type Units = z.infer<typeof unitsSchema>;
export const placeSchema = z.object({
  name: z.string(), admin1: z.string().optional(), country: z.string().optional(),
  latitude: z.number(), longitude: z.number(), timezone: z.string().optional(),
  source: z.enum(['default', 'search', 'network']).optional(),
});
export type Place = z.infer<typeof placeSchema>;
export const placeCandidateSchema = placeSchema.omit({ source: true });
export type PlaceCandidate = z.infer<typeof placeCandidateSchema>;
export const weatherConfigSchema = z.object({ place: placeSchema, units: unitsSchema });
export type WeatherConfig = z.infer<typeof weatherConfigSchema>;

export const currentWeatherSchema = z.object({
  time: z.string(), temperature: z.number(), apparent: z.number(), humidity: z.number(),
  code: z.number(), isDay: z.boolean(), precipitation: z.number(), windSpeed: z.number(),
  windDirection: z.number(), windGust: z.number(), pressure: z.number(), cloudCover: z.number(),
});
export type CurrentWeather = z.infer<typeof currentWeatherSchema>;
export const hourPointSchema = z.object({
  time: z.string(), temperature: z.number(), code: z.number(), precipProb: z.number(), isDay: z.boolean(), windSpeed: z.number(),
});
export type HourPoint = z.infer<typeof hourPointSchema>;
export const dayPointSchema = z.object({
  date: z.string(), code: z.number(), tMax: z.number(), tMin: z.number(), sunrise: z.string(),
  sunset: z.string(), uvMax: z.number(), precipProbMax: z.number(), windMax: z.number(),
});
export type DayPoint = z.infer<typeof dayPointSchema>;
const normalizedWeatherSchema = z.object({
  timezone: z.string().optional(), utcOffsetSeconds: z.number().optional(),
  current: currentWeatherSchema, hourly: z.array(hourPointSchema), daily: z.array(dayPointSchema),
});
export const weatherForecastSchema = normalizedWeatherSchema.partial().extend({
  forecastFor: z.object({ latitude: z.number(), longitude: z.number(), units: unitsSchema }).optional(),
  status: z.enum(['empty', 'ok', 'error']), error: z.string().nullable().optional(), fetchedAt: z.string().nullable().optional(),
  current: currentWeatherSchema.nullable().optional(),
});
export type NormalizedWeather = z.infer<typeof normalizedWeatherSchema>;
export type WeatherForecast = z.infer<typeof weatherForecastSchema>;

/** Location and units are configuration; weather is a provider-backed query projection. */
export const note = defineNote({
  config: { schema: weatherConfigSchema, defaults: { units: 'metric' } },
  update: {
    dataVersion: 'weather-note@2',
    compatibleFrom: ['weather-note@2'],
    async migrate(ctx) {
      const config = weatherConfigSchema.partial().parse((await ctx.config.read()).value);
      const legacy = z.record(z.string(), z.unknown()).parse((await ctx.state.read()).value ?? {});
      if (config.place === undefined && legacy.place !== undefined) config.place = placeSchema.parse(legacy.place);
      if (config.units === undefined && legacy.units !== undefined) config.units = unitsSchema.parse(legacy.units);
      config.units ??= 'metric';
      await ctx.config.set(config);
      // Forecasts belong to the provider cache, never the note's persistent model.
      await ctx.state.set({});
    },
    checks: [{
      name: '关键能力与稳定身份',
      run() {
        const value = normalize({ current: { time: '2026-01-01T12:00', temperature_2m: 21, is_day: 1 }, hourly: { time: ['2026-01-01T12:00'], temperature_2m: [22] }, daily: { time: ['2026-01-01'], temperature_2m_max: [23], temperature_2m_min: [10] } });
        return value.current.temperature === 21 && value.current.isDay && value.hourly[0]?.temperature === 22 && value.daily[0]?.tMax === 23;
      },
    }],
  },
});
