import type { WeatherConfig, WeatherForecast, NormalizedWeather } from "./model";
/** A response can only be displayed under the configuration that produced it. */
export declare function weatherMatches(forecast: WeatherForecast, config: Partial<WeatherConfig>): boolean;
export declare function weatherForConfig(forecast: WeatherForecast | undefined, config: Partial<WeatherConfig>): WeatherForecast;
export declare function num(value: unknown, fallback?: number): number;
export declare function normalize(payload: Record<string, unknown>): NormalizedWeather;
