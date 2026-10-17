import type { WeatherConfig, WeatherForecast, NormalizedWeather, HourPoint, DayPoint } from "./model";

/** A response can only be displayed under the configuration that produced it. */
export function weatherMatches(forecast: WeatherForecast, config: Partial<WeatherConfig>): boolean {
  return !!config.place && forecast.forecastFor?.latitude === config.place.latitude && forecast.forecastFor.longitude === config.place.longitude && forecast.forecastFor.units === (config.units ?? 'metric');
}
export function weatherForConfig(forecast: WeatherForecast | undefined, config: Partial<WeatherConfig>): WeatherForecast {
  return forecast && weatherMatches(forecast, config) ? forecast : { status: 'empty', current: null, hourly: [], daily: [], fetchedAt: null };
}

export function num(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function normalize(payload: Record<string, unknown>): NormalizedWeather {
  const current = payload.current as Record<string, unknown> | undefined;
  const hourly = payload.hourly as Record<string, unknown[]> | undefined;
  const daily = payload.daily as Record<string, unknown[]> | undefined;
  if (!current || !hourly || !daily) throw new Error("天气服务没有返回完整数据");

  const times = (hourly.time ?? []) as unknown as string[];
  const hourKey = String(current.time ?? "").slice(0, 13);
  const found = times.findIndex((time) => time.slice(0, 13) >= hourKey);
  const start = found < 0 ? 0 : found;

  const points: HourPoint[] = [];
  for (let index = start; index < times.length && points.length < 24; index += 1) {
    points.push({
      time: times[index]!,
      temperature: num(hourly.temperature_2m?.[index]),
      code: num(hourly.weather_code?.[index]),
      precipProb: num(hourly.precipitation_probability?.[index]),
      isDay: num(hourly.is_day?.[index]) === 1,
      windSpeed: num(hourly.wind_speed_10m?.[index]),
    });
  }

  const dates = (daily.time ?? []) as unknown as string[];
  const days: DayPoint[] = dates.slice(0, 7).map((date, index) => ({
    date,
    code: num(daily.weather_code?.[index]),
    tMax: num(daily.temperature_2m_max?.[index]),
    tMin: num(daily.temperature_2m_min?.[index]),
    sunrise: String(daily.sunrise?.[index] ?? ""),
    sunset: String(daily.sunset?.[index] ?? ""),
    uvMax: num(daily.uv_index_max?.[index]),
    precipProbMax: num(daily.precipitation_probability_max?.[index]),
    windMax: num(daily.wind_speed_10m_max?.[index]),
  }));

  if (!points.length || !days.length) throw new Error("天气服务返回的预报为空");

  return {
    timezone: typeof payload.timezone === "string" ? payload.timezone : undefined,
    utcOffsetSeconds: typeof payload.utc_offset_seconds === "number" ? payload.utc_offset_seconds : undefined,
    current: {
      time: String(current.time ?? ""),
      temperature: num(current.temperature_2m),
      apparent: num(current.apparent_temperature),
      humidity: num(current.relative_humidity_2m),
      code: num(current.weather_code),
      isDay: num(current.is_day) === 1,
      precipitation: num(current.precipitation),
      windSpeed: num(current.wind_speed_10m),
      windDirection: num(current.wind_direction_10m),
      windGust: num(current.wind_gusts_10m),
      pressure: num(current.pressure_msl),
      cloudCover: num(current.cloud_cover),
    },
    hourly: points,
    daily: days,
  };
}
