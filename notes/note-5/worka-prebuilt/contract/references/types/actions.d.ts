import { z, type NoteActionContext } from "@dsh-workbench/runtime";
export { note } from "./model";
export declare const queries: {
    view: import("@dsh-workbench/runtime").NoteOperation<z.ZodNullable<z.ZodObject<{}, z.core.$strip>>, z.ZodObject<{
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
    }, z.core.$strip>, import("@dsh-workbench/runtime").NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<undefined, z.ZodObject<{
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
    }, z.core.$strip>, {}>>>;
    searchPlaces: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
        query: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        results: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            admin1: z.ZodOptional<z.ZodString>;
            country: z.ZodOptional<z.ZodString>;
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
            timezone: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>, import("@dsh-workbench/runtime").NoteQueryContext<import("@dsh-workbench/runtime").NoteModel<undefined, z.ZodObject<{
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
    }, z.core.$strip>, {}>>>;
};
/** 切换公制 / 英制单位并重新拉取。 */
export declare const setUnits: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
    units: z.ZodEnum<{
        imperial: "imperial";
        metric: "metric";
    }>;
}, z.core.$strip>, z.ZodObject<{
    value: z.ZodObject<{
        place: z.ZodOptional<z.ZodObject<{
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
        }, z.core.$strip>>;
        units: z.ZodOptional<z.ZodEnum<{
            imperial: "imperial";
            metric: "metric";
        }>>;
    }, z.core.$strip>;
    revision: z.ZodString;
    updatedAt: z.ZodOptional<z.ZodString>;
    origin: z.ZodOptional<z.ZodObject<{
        chain: z.ZodArray<z.ZodString>;
        deliveryId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<undefined, z.ZodObject<{
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
}, z.core.$strip>, {}>>>;
/** 使用检索结果里的城市，并立即刷新。 */
export declare const usePlace: import("@dsh-workbench/runtime").NoteOperation<z.ZodObject<{
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
}, z.core.$strip>, z.ZodObject<{
    value: z.ZodObject<{
        place: z.ZodOptional<z.ZodObject<{
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
        }, z.core.$strip>>;
        units: z.ZodOptional<z.ZodEnum<{
            imperial: "imperial";
            metric: "metric";
        }>>;
    }, z.core.$strip>;
    revision: z.ZodString;
    updatedAt: z.ZodOptional<z.ZodString>;
    origin: z.ZodOptional<z.ZodObject<{
        chain: z.ZodArray<z.ZodString>;
        deliveryId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<undefined, z.ZodObject<{
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
}, z.core.$strip>, {}>>>;
/** 城市检索（Open-Meteo Geocoding，免费无需密钥）。 */
/**
 * 按网络出口位置定位（ipwho.is，免费无需密钥）。
 * 只作为可选操作：出口 IP 可能与真实所在地不同，所以不自动覆盖用户选择。
 */
export declare const locateByNetwork: import("@dsh-workbench/runtime").NoteOperation<z.ZodDefault<z.ZodObject<{
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>, z.ZodObject<{
    value: z.ZodObject<{
        place: z.ZodOptional<z.ZodObject<{
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
        }, z.core.$strip>>;
        units: z.ZodOptional<z.ZodEnum<{
            imperial: "imperial";
            metric: "metric";
        }>>;
    }, z.core.$strip>;
    revision: z.ZodString;
    updatedAt: z.ZodOptional<z.ZodString>;
    origin: z.ZodOptional<z.ZodObject<{
        chain: z.ZodArray<z.ZodString>;
        deliveryId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
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
}, z.core.$strip>, NoteActionContext<import("@dsh-workbench/runtime").NoteModel<undefined, z.ZodObject<{
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
}, z.core.$strip>, {}>>>;
