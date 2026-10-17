import { z } from "@dsh-workbench/runtime";
export declare const unitsSchema: z.ZodEnum<{
    imperial: "imperial";
    metric: "metric";
}>;
export type Units = z.infer<typeof unitsSchema>;
export declare const placeSchema: z.ZodObject<{
    name: z.ZodString;
    admin1: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
    timezone: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodEnum<{
        default: "default";
        network: "network";
        search: "search";
    }>>;
}, z.core.$strip>;
export type Place = z.infer<typeof placeSchema>;
export declare const placeCandidateSchema: z.ZodObject<{
    name: z.ZodString;
    admin1: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
    timezone: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type PlaceCandidate = z.infer<typeof placeCandidateSchema>;
export declare const weatherConfigSchema: z.ZodObject<{
    place: z.ZodObject<{
        name: z.ZodString;
        admin1: z.ZodOptional<z.ZodString>;
        country: z.ZodOptional<z.ZodString>;
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
        timezone: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodEnum<{
            default: "default";
            network: "network";
            search: "search";
        }>>;
    }, z.core.$strip>;
    units: z.ZodEnum<{
        imperial: "imperial";
        metric: "metric";
    }>;
}, z.core.$strip>;
export type WeatherConfig = z.infer<typeof weatherConfigSchema>;
export declare const currentWeatherSchema: z.ZodObject<{
    time: z.ZodString;
    temperature: z.ZodNumber;
    apparent: z.ZodNumber;
    humidity: z.ZodNumber;
    code: z.ZodNumber;
    isDay: z.ZodBoolean;
    precipitation: z.ZodNumber;
    windSpeed: z.ZodNumber;
    windDirection: z.ZodNumber;
    windGust: z.ZodNumber;
    pressure: z.ZodNumber;
    cloudCover: z.ZodNumber;
}, z.core.$strip>;
export type CurrentWeather = z.infer<typeof currentWeatherSchema>;
export declare const hourPointSchema: z.ZodObject<{
    time: z.ZodString;
    temperature: z.ZodNumber;
    code: z.ZodNumber;
    precipProb: z.ZodNumber;
    isDay: z.ZodBoolean;
    windSpeed: z.ZodNumber;
}, z.core.$strip>;
export type HourPoint = z.infer<typeof hourPointSchema>;
export declare const dayPointSchema: z.ZodObject<{
    date: z.ZodString;
    code: z.ZodNumber;
    tMax: z.ZodNumber;
    tMin: z.ZodNumber;
    sunrise: z.ZodString;
    sunset: z.ZodString;
    uvMax: z.ZodNumber;
    precipProbMax: z.ZodNumber;
    windMax: z.ZodNumber;
}, z.core.$strip>;
export type DayPoint = z.infer<typeof dayPointSchema>;
declare const normalizedWeatherSchema: z.ZodObject<{
    timezone: z.ZodOptional<z.ZodString>;
    utcOffsetSeconds: z.ZodOptional<z.ZodNumber>;
    current: z.ZodObject<{
        time: z.ZodString;
        temperature: z.ZodNumber;
        apparent: z.ZodNumber;
        humidity: z.ZodNumber;
        code: z.ZodNumber;
        isDay: z.ZodBoolean;
        precipitation: z.ZodNumber;
        windSpeed: z.ZodNumber;
        windDirection: z.ZodNumber;
        windGust: z.ZodNumber;
        pressure: z.ZodNumber;
        cloudCover: z.ZodNumber;
    }, z.core.$strip>;
    hourly: z.ZodArray<z.ZodObject<{
        time: z.ZodString;
        temperature: z.ZodNumber;
        code: z.ZodNumber;
        precipProb: z.ZodNumber;
        isDay: z.ZodBoolean;
        windSpeed: z.ZodNumber;
    }, z.core.$strip>>;
    daily: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        code: z.ZodNumber;
        tMax: z.ZodNumber;
        tMin: z.ZodNumber;
        sunrise: z.ZodString;
        sunset: z.ZodString;
        uvMax: z.ZodNumber;
        precipProbMax: z.ZodNumber;
        windMax: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const weatherForecastSchema: z.ZodObject<{
    timezone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    utcOffsetSeconds: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    hourly: z.ZodOptional<z.ZodArray<z.ZodObject<{
        time: z.ZodString;
        temperature: z.ZodNumber;
        code: z.ZodNumber;
        precipProb: z.ZodNumber;
        isDay: z.ZodBoolean;
        windSpeed: z.ZodNumber;
    }, z.core.$strip>>>;
    daily: z.ZodOptional<z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        code: z.ZodNumber;
        tMax: z.ZodNumber;
        tMin: z.ZodNumber;
        sunrise: z.ZodString;
        sunset: z.ZodString;
        uvMax: z.ZodNumber;
        precipProbMax: z.ZodNumber;
        windMax: z.ZodNumber;
    }, z.core.$strip>>>;
    forecastFor: z.ZodOptional<z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
        units: z.ZodEnum<{
            imperial: "imperial";
            metric: "metric";
        }>;
    }, z.core.$strip>>;
    status: z.ZodEnum<{
        empty: "empty";
        error: "error";
        ok: "ok";
    }>;
    error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    fetchedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    current: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        time: z.ZodString;
        temperature: z.ZodNumber;
        apparent: z.ZodNumber;
        humidity: z.ZodNumber;
        code: z.ZodNumber;
        isDay: z.ZodBoolean;
        precipitation: z.ZodNumber;
        windSpeed: z.ZodNumber;
        windDirection: z.ZodNumber;
        windGust: z.ZodNumber;
        pressure: z.ZodNumber;
        cloudCover: z.ZodNumber;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type NormalizedWeather = z.infer<typeof normalizedWeatherSchema>;
export type WeatherForecast = z.infer<typeof weatherForecastSchema>;
/** Location and units are configuration; weather is a provider-backed query projection. */
export declare const note: import("@dsh-workbench/runtime").NoteModel<undefined, z.ZodObject<{
    place: z.ZodObject<{
        name: z.ZodString;
        admin1: z.ZodOptional<z.ZodString>;
        country: z.ZodOptional<z.ZodString>;
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
        timezone: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodEnum<{
            default: "default";
            network: "network";
            search: "search";
        }>>;
    }, z.core.$strip>;
    units: z.ZodEnum<{
        imperial: "imperial";
        metric: "metric";
    }>;
}, z.core.$strip>, {}>;
export {};
