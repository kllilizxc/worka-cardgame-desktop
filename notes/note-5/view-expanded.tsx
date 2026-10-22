import {MutationNotice} from './mutation-notice';
import {useMutation,useViewState,useNote, useLocale} from '@dsh-workbench/react';
import {ui} from './messages';
import {withNotePrerequisites} from '@dsh-workbench/react';
import { weatherForConfig } from "./forecast";
import { useId, useMemo, useRef, useState } from "react";
import { Button, Label, SearchField } from "@heroui/react";
import "@heroui/styles/css";
import type { DayPoint, HourPoint, PlaceCandidate } from "./model";

/* ------------------------------------------------------------------ *
 * WMO 天气代码 → 中文描述 + 视觉分组
 * ------------------------------------------------------------------ */

type Group = "clear" | "partly" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "thunder";

const CONDITIONS: Record<number, { label: string; group: Group }> = {
  0: { get label() { return ui("晴"); }, group: "clear" },
  1: { get label() { return ui("晴间多云"); }, group: "partly" },
  2: { get label() { return ui("多云"); }, group: "partly" },
  3: { get label() { return ui("阴"); }, group: "cloudy" },
  45: { get label() { return ui("有雾"); }, group: "fog" },
  48: { get label() { return ui("冻雾"); }, group: "fog" },
  51: { get label() { return ui("毛毛雨"); }, group: "drizzle" },
  53: { get label() { return ui("毛毛雨"); }, group: "drizzle" },
  55: { get label() { return ui("浓毛毛雨"); }, group: "drizzle" },
  56: { get label() { return ui("冻毛毛雨"); }, group: "drizzle" },
  57: { get label() { return ui("浓冻毛毛雨"); }, group: "drizzle" },
  61: { get label() { return ui("小雨"); }, group: "rain" },
  63: { get label() { return ui("中雨"); }, group: "rain" },
  65: { get label() { return ui("大雨"); }, group: "rain" },
  66: { get label() { return ui("冻雨"); }, group: "rain" },
  67: { get label() { return ui("强冻雨"); }, group: "rain" },
  71: { get label() { return ui("小雪"); }, group: "snow" },
  73: { get label() { return ui("中雪"); }, group: "snow" },
  75: { get label() { return ui("大雪"); }, group: "snow" },
  77: { get label() { return ui("米雪"); }, group: "snow" },
  80: { get label() { return ui("阵雨"); }, group: "rain" },
  81: { get label() { return ui("强阵雨"); }, group: "rain" },
  82: { get label() { return ui("暴雨"); }, group: "rain" },
  85: { get label() { return ui("阵雪"); }, group: "snow" },
  86: { get label() { return ui("强阵雪"); }, group: "snow" },
  95: { get label() { return ui("雷阵雨"); }, group: "thunder" },
  96: { get label() { return ui("雷阵雨伴冰雹"); }, group: "thunder" },
  99: { get label() { return ui("强雷雨伴冰雹"); }, group: "thunder" },
};

function conditionOf(code: number | undefined): { label: string; group: Group } {
  return CONDITIONS[code ?? -1] ?? { label: ui("天气未知"), group: "cloudy" };
}

/**
 * 每类天气一套天空色：底色统一压到深色区间，使白色正文在小字号下也够对比，
 * 明亮的一侧交给天气图形背后的光晕，而不是靠整片浅色背景。
 */
const SKY: Record<Group, { day: string; night: string }> = {
  clear: {
    day: "radial-gradient(circle at 86% 26%,rgba(255,201,105,.5) 0%,rgba(255,201,105,0) 58%),linear-gradient(158deg,#16589b 0%,#2867a5 58%,#3374ae 100%)",
    night: "radial-gradient(circle at 86% 26%,rgba(146,176,255,.22) 0%,rgba(146,176,255,0) 62%),linear-gradient(158deg,#070c22 0%,#161f42 58%,#2b3763 100%)",
  },
  partly: {
    day: "radial-gradient(circle at 86% 26%,rgba(255,214,150,.42) 0%,rgba(255,214,150,0) 56%),linear-gradient(158deg,#144f7d 0%,#245f8d 58%,#2f6e97 100%)",
    night: "radial-gradient(circle at 86% 26%,rgba(140,170,235,.18) 0%,rgba(140,170,235,0) 58%),linear-gradient(158deg,#0b1229 0%,#1c2647 58%,#334066 100%)",
  },
  cloudy: {
    day: "radial-gradient(circle at 86% 26%,rgba(255,255,255,.16) 0%,rgba(255,255,255,0) 58%),linear-gradient(158deg,#2f3c48 0%,#3f4d5c 58%,#4c5b6a 100%)",
    night: "linear-gradient(158deg,#141a24 0%,#29313d 58%,#3f4854 100%)",
  },
  fog: {
    day: "radial-gradient(circle at 86% 26%,rgba(255,255,255,.18) 0%,rgba(255,255,255,0) 58%),linear-gradient(158deg,#3f4952 0%,#4d5760 58%,#5a646d 100%)",
    night: "linear-gradient(158deg,#1c2229 0%,#333a42 58%,#4b535c 100%)",
  },
  drizzle: {
    day: "radial-gradient(circle at 86% 26%,rgba(184,222,255,.18) 0%,rgba(184,222,255,0) 58%),linear-gradient(158deg,#1f3a53 0%,#2c4b68 58%,#37597a 100%)",
    night: "linear-gradient(158deg,#0d1622 0%,#1f2e40 58%,#33475c 100%)",
  },
  rain: {
    day: "radial-gradient(circle at 86% 26%,rgba(184,222,255,.18) 0%,rgba(184,222,255,0) 58%),linear-gradient(158deg,#182f47 0%,#24405e 58%,#2e5075 100%)",
    night: "linear-gradient(158deg,#0a1220 0%,#1a2a3d 58%,#2c4157 100%)",
  },
  snow: {
    day: "radial-gradient(circle at 86% 26%,rgba(255,255,255,.24) 0%,rgba(255,255,255,0) 58%),linear-gradient(158deg,#2a4a6b 0%,#38587c 58%,#44678c 100%)",
    night: "linear-gradient(158deg,#101a2c 0%,#223252 58%,#37496b 100%)",
  },
  thunder: {
    day: "radial-gradient(circle at 86% 26%,rgba(255,225,150,.18) 0%,rgba(255,225,150,0) 58%),linear-gradient(158deg,#161c29 0%,#262f42 58%,#364056 100%)",
    night: "linear-gradient(158deg,#05070f 0%,#161c2c 58%,#2b3346 100%)",
  },
};

function skyOf(group: Group, isDay: boolean): string {
  return (SKY[group] ?? SKY.cloudy)[isDay ? "day" : "night"];
}

/* ------------------------------------------------------------------ *
 * 自绘天气图形（不依赖图标库，日/夜与明暗底色都能保持清晰）
 * ------------------------------------------------------------------ */

type Ink = { sun: string; sunCore: string; cloud: string; cloudBack: string; rain: string; snow: string; bolt: string; moon: string };

const INK: Record<"glass" | "paper", Ink> = {
  glass: {
    sun: "#ffd166",
    sunCore: "#ffb01f",
    cloud: "rgba(255,255,255,0.96)",
    cloudBack: "rgba(255,255,255,0.62)",
    rain: "#c6e4fb",
    snow: "#f4faff",
    bolt: "#ffe066",
    moon: "#eef3ff",
  },
  paper: {
    sun: "#f8c74f",
    sunCore: "#efa92a",
    cloud: "#bfd0e2",
    cloudBack: "#d9e3ee",
    rain: "#7cb4de",
    snow: "#b6d1e8",
    bolt: "#f2b73c",
    moon: "#c3d2e8",
  },
};

function SunShape({ ink, cx, cy, r, rays = true }: { ink: Ink; cx: number; cy: number; r: number; rays?: boolean }) {
  useLocale();
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {rays ? (
        <g stroke={ink.sun} strokeWidth="3" strokeLinecap="round">
          {Array.from({ length: 8 }, (_, index) => {
            const angle = (index * 45 * Math.PI) / 180;
            return (
              <line
                key={index}
                x1={Math.cos(angle) * (r + 6)}
                y1={Math.sin(angle) * (r + 6)}
                x2={Math.cos(angle) * (r + 12)}
                y2={Math.sin(angle) * (r + 12)}
              />
            );
          })}
        </g>
      ) : null}
      <circle r={r} fill={ink.sunCore} />
      <circle r={r * 0.62} fill={ink.sun} />
    </g>
  );
}

function MoonShape({ ink, cx, cy, r }: { ink: Ink; cx: number; cy: number; r: number }) {
  useLocale();
  const maskId = `wx-moon-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <g>
      <mask id={maskId}>
        <rect x="0" y="0" width="72" height="72" fill="black" />
        <circle cx={cx} cy={cy} r={r} fill="white" />
        <circle cx={cx + r * 0.62} cy={cy - r * 0.42} r={r * 0.92} fill="black" />
      </mask>
      <circle cx={cx} cy={cy} r={r} fill={ink.moon} mask={`url(#${maskId})`} />
    </g>
  );
}

function CloudShape({ ink, x, y, scale, back = false }: { ink: Ink; x: number; y: number; scale: number; back?: boolean }) {
  useLocale();
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={back ? ink.cloudBack : ink.cloud}>
      <circle cx="20" cy="30" r="10" />
      <circle cx="33" cy="23" r="13.5" />
      <circle cx="46" cy="30" r="10" />
      <rect x="18" y="29" width="30" height="11.5" rx="5.75" />
    </g>
  );
}

function WeatherGlyph({ code, isDay, size = 46, tone = "glass" }: { code: number | undefined; isDay: boolean; size?: number; tone?: "glass" | "paper" }) {
  useLocale();
  const { group } = conditionOf(code);
  const ink = INK[tone];
  const night = !isDay;
  const drops = (y: number, length: number) => (
    <g stroke={ink.rain} strokeWidth="3.2" strokeLinecap="round">
      <line x1="24" y1={y} x2={22} y2={y + length} />
      <line x1="36" y1={y} x2="34" y2={y + length} />
      <line x1="48" y1={y} x2="46" y2={y + length} />
    </g>
  );
  const flakes = (
    <g fill={ink.snow}>
      <circle cx="24" cy="47" r="2.6" />
      <circle cx="36" cy="47" r="2.6" />
      <circle cx="48" cy="47" r="2.6" />
      <circle cx="30" cy="56" r="2.6" />
      <circle cx="42" cy="56" r="2.6" />
    </g>
  );
  return (
    <svg viewBox="0 0 72 72" width={size} height={size} className="wx-glyph" aria-hidden="true" focusable="false">
      {group === "clear" ? (night ? <MoonShape ink={ink} cx={36} cy={36} r={15} /> : <SunShape ink={ink} cx={36} cy={36} r={14} />) : null}

      {group === "partly" ? (
        <>
          {night ? <MoonShape ink={ink} cx={26} cy={25} r={11} /> : <SunShape ink={ink} cx={26} cy={25} r={10} />}
          <CloudShape ink={ink} x={6} y={10} scale={0.95} />
        </>
      ) : null}

      {group === "cloudy" ? (
        <>
          <CloudShape ink={ink} x={-5} y={-6} scale={0.78} back />
          <CloudShape ink={ink} x={9} y={9} scale={0.95} />
        </>
      ) : null}

      {group === "fog" ? (
        <>
          <CloudShape ink={ink} x={6} y={-6} scale={0.95} />
          <g stroke={ink.cloud} strokeWidth="3" strokeLinecap="round" opacity="0.85">
            <line x1="12" y1="45" x2="60" y2="45" />
            <line x1="18" y1="54" x2="54" y2="54" />
            <line x1="25" y1="63" x2="47" y2="63" />
          </g>
        </>
      ) : null}

      {group === "drizzle" ? (
        <>
          <CloudShape ink={ink} x={6} y={-6} scale={0.95} />
          <g stroke={ink.rain} strokeWidth="3.2" strokeLinecap="round">
            <line x1="26" y1="44" x2="24" y2="50" />
            <line x1="38" y1="44" x2="36" y2="50" />
            <line x1="50" y1="44" x2="48" y2="50" />
          </g>
        </>
      ) : null}

      {group === "rain" ? (
        <>
          <CloudShape ink={ink} x={6} y={-6} scale={0.95} />
          {drops(43, 12)}
        </>
      ) : null}

      {group === "snow" ? (
        <>
          <CloudShape ink={ink} x={6} y={-6} scale={0.95} />
          {flakes}
        </>
      ) : null}

      {group === "thunder" ? (
        <>
          <CloudShape ink={ink} x={6} y={-8} scale={0.95} />
          <path d="M38 40 L26 58 L35 58 L31 69 L45 49 L36 49 Z" fill={ink.bolt} />
        </>
      ) : null}
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * 文本与数值格式化
 * ------------------------------------------------------------------ */

const WEEKDAYS = () => [ui("周日"), ui("周一"), ui("周二"), ui("周三"), ui("周四"), ui("周五"), ui("周六")];
const COMPASS = () => [ui("北"), ui("东北"), ui("东"), ui("东南"), ui("南"), ui("西南"), ui("西"), ui("西北")];

function hourLabel(iso: string): string {
  const match = /T(\d{2})/.exec(iso);
  return match ? ui("{p0}时", { p0: Number(match[1]) }) : "";
}

function clockLabel(iso: string): string {
  const match = /T(\d{2}:\d{2})/.exec(iso);
  return match?.[1] ?? "—";
}

function dayLabel(date: string, index: number): string {
  if (index === 0) return ui("今天");
  if (index === 1) return ui("明天");
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? date : WEEKDAYS()[parsed.getUTCDay()] ?? date;
}

function compass(degrees: number): string {
  return COMPASS()[Math.round(degrees / 45) % 8] ?? ui("北");
}

function round(value: number | undefined): string {
  return Number.isFinite(value) ? String(Math.round(value as number)) : "—";
}

/* ------------------------------------------------------------------ *
 * 骨架：图标按钮 / 状态点
 * ------------------------------------------------------------------ */

function RefreshButton({ busy, onPress, label = ui("刷新") }: { busy: boolean; onPress: () => void; label?: string }) {
  useLocale();
  return (
    <button type="button" className={`wx-iconbtn${busy ? " is-busy" : ""}`} onClick={onPress} disabled={busy} aria-label={label} title={label}>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" />
        <path d="M20.6 4.2v5h-5" />
      </svg>
    </button>
  );
}

function Dots() {
  useLocale();
  return (
    <span className="wx-dots" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * 视图
 * ------------------------------------------------------------------ */

function View() {
  useLocale();
  const { config, actions, useQuery, mode, metadata, host } = useNote<typeof import("./actions")>();
  const forecast = useQuery('view', {});
  const data = { ...weatherForConfig(forecast.data, config), ...config };
  const refresh = forecast.refresh;
  const commands={place:useMutation(actions.usePlace,{query:forecast}),locate:useMutation(actions.locateByNetwork,{query:forecast}),units:useMutation(actions.setUnits,{query:forecast})};
  const [reading,setBusy]=useState(false);
  const busy=reading||Object.values(commands).some(command=>command.status==='pending'||command.status==='unknown');
  const commandNotices=<>{Object.entries(commands).map(([name,mutation])=><MutationNotice key={name} mutation={mutation}/>)}</>;
  const [query,setQuery]=useViewState("weather:search","");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const placeSearch = useQuery('searchPlaces', { query: submittedQuery }, { enabled: !!submittedQuery });
  const results = placeSearch.data?.results ?? [];
  const searching = placeSearch.loading;
  const [panelOpen, setPanelOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const current = data.current ?? null;
  const hourly = useMemo(() => (data.hourly ?? []).slice(0, 24), [data.hourly]);
  const daily = data.daily ?? [];
  const condition = conditionOf(current?.code ?? daily[0]?.code);
  const sky = skyOf(condition.group, current?.isDay ?? true);
  const stale = data.status === "error" || !!forecast.error;
  const metric = (data.units ?? "metric") !== "imperial";
  const tempUnit = metric ? "°C" : "°F";
  const speedUnit = metric ? "km/h" : "mph";
  const precipUnit = metric ? "mm" : "in";

  const run = async (work: () => Promise<unknown>) => {
    if (busy) return;
    setBusy(true);
    setMessage(null);
    try {
      await work();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  };

  const runSearch = () => {
    const trimmed = query.trim();
    if (!trimmed || busy) return;
    setMessage(null);
    if (trimmed === submittedQuery) void run(placeSearch.refresh);
    else setSubmittedQuery(trimmed);
  };
  const searchMessage = placeSearch.error?.message ?? (
    submittedQuery && !searching && placeSearch.data?.results.length === 0 ? ui("没有找到匹配的城市") : null
  );

  const choose=(place:PlaceCandidate)=>commands.place.mutate({place});
  const locate=()=>commands.locate.mutate({});
  const selectUnits=(units:'metric'|'imperial')=>{if(units===(metric?'metric':'imperial'))return;return commands.units.mutate({units});};

  const updated = data.current?.time ? ui("观测时间 {p0}", { p0: data.current.time.replace('T', ' ') }) : ui("尚无观测数据");
  const placeName = data.place?.name ?? ui("未设置城市");
  const region = [data.place?.admin1, data.place?.country]
    .filter((item): item is string => Boolean(item) && !item!.includes(placeName) && !placeName.includes(item!))
    .join(" · ");
  const placeLine = region ? `${placeName} · ${region}` : placeName;

  const searchPanel = (
    <section className="wx-search">{commandNotices}
      <div className="wx-search-row">
        <SearchField value={query} onChange={setQuery} onSubmit={() => void runSearch()} className="wx-search-field" fullWidth>
          <Label>{data.place ? ui("切换城市") : ui("选择城市")}</Label>
          <SearchField.Group><SearchField.SearchIcon /><SearchField.Input placeholder={ui("输入城市名，例如 杭州 / Tokyo")} /><SearchField.ClearButton aria-label={ui("清空搜索")} /></SearchField.Group>
        </SearchField>
        <Button size="sm" variant={data.place ? "secondary" : "primary"} isDisabled={busy || searching || !query.trim()} onPress={() => void runSearch()}>
          {searching ? ui("搜索中…") : ui("搜索")}
        </Button>
        <Button size="sm" variant={data.place ? "ghost" : "secondary"} isDisabled={busy} onPress={() => void locate()}>
          {ui.rich("按网络定位")}</Button>
      </div>
      {results.length ? (
        <ul className="wx-results">
          {results.map((item, index) => (
            <li key={`${item.name}-${item.latitude}-${index}`}>
              <span className="wx-result-name">{item.name}</span>
              <span className="wx-result-area">{[item.admin1, item.country].filter(Boolean).join(" · ")}</span>
              <Button size="sm" variant="ghost" onPress={() => void choose(item)}>
                {ui.rich("使用")}</Button>
            </li>
          ))}
        </ul>
      ) : null}
      {message || searchMessage ? <p className="wx-message">{message ?? searchMessage}</p> : null}
    </section>
  );

  /* ----------------------------- compact ----------------------------- */

  if (mode === "compact") {
    return (
      <section className="wx wx-compact" style={{ background: `linear-gradient(var(--wx-theme-shade, transparent), var(--wx-theme-shade, transparent)), ${sky}` }}>
        <style>{styles}</style>
        <header className="wx-top">
          <span className="wx-place">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
              <circle cx="12" cy="10" r="2.6" />
            </svg>
            {placeLine}
          </span>
          <RefreshButton busy={busy} onPress={() => void run(() => refresh())} />
        </header>

        {current ? (
          <>
            <div className="wx-hero">
              <div className="wx-hero-text">
                <div className="wx-temp">
                  {round(current.temperature)}
                  <sup>°</sup>
                </div>
                <div className="wx-cond">{condition.label}</div>
                <div className="wx-sub">
                  {ui.rich("体感 {p0}° · 最高 {p1}° 最低 {p2}°", { p0: round(current.apparent), p1: round(daily[0]?.tMax), p2: round(daily[0]?.tMin) })}</div>
              </div>
              <WeatherGlyph code={current.code} isDay={current.isDay} size={62} />
            </div>

            {hourly.length >= 4 ? (
              <div className="wx-strip">
                {hourly.slice(0, 6).map((point: HourPoint, index: number) => (
                  <div className="wx-strip-cell" key={point.time}>
                    <span>{index === 0 ? ui("现在") : hourLabel(point.time)}</span>
                    <WeatherGlyph code={point.code} isDay={point.isDay} size={22} />
                    <b>{round(point.temperature)}°</b>
                  </div>
                ))}
              </div>
            ) : null}

            <footer className="wx-foot">
              <span className={stale ? "wx-warn" : undefined}>{stale ? ui("更新失败，显示旧数据") : updated}</span>
              <span>Open-Meteo</span>
            </footer>
          </>
        ) : (
          <div className="wx-placeholder">
            <WeatherGlyph code={3} isDay size={44} />
            <p>{busy ? ui("正在获取天气…") : (data.error ?? (data.place ? ui("还没有天气数据") : ui("选择城市，查看当地天气")))}</p>
            <Button size="sm" variant="secondary" className="wx-sky-btn" onPress={() => void run(() => data.place ? refresh() : host.openNote(metadata.id))} isDisabled={busy}>
              {busy ? <>{ui.rich("获取中")}<Dots /></> : data.place ? ui("立即获取") : ui("选择城市")}
            </Button>
          </div>
        )}
      </section>
    );
  }

  /* ----------------------------- expanded ---------------------------- */

  if (!data.place) {
    return <section className="wx wx-expanded wx-setup">
      <style>{styles}</style>
      <div className="wx-setup-content">
        <WeatherGlyph code={1} isDay size={88} tone="paper" />
        <h2>{ui.rich("从你的城市开始")}</h2>
        <p>{ui.rich("选择城市，查看实时天气、逐小时预报和未来几天的变化。")}</p>
        {searchPanel}
        <small>{ui.rich("之后随时可以更换城市。")}</small>
      </div>
    </section>;
  }

  const temps = hourly.map((point) => point.temperature);
  const minTemp = temps.length ? Math.min(...temps) : 0;
  const maxTemp = temps.length ? Math.max(...temps) : 1;
  const span = Math.max(1, maxTemp - minTemp);
  const chart = { left: 28, right: 692, top: 20, bottom: 104 };
  const xAt = (index: number) => chart.left + (index * (chart.right - chart.left)) / Math.max(1, temps.length - 1);
  const yAt = (value: number) => chart.bottom - ((value - minTemp) / span) * (chart.bottom - chart.top);
  const points = temps.map((value, index) => ({ x: xAt(index), y: yAt(value), value }));
  const linePath = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
    const previous = points[index - 1]!;
    const midX = ((previous.x + point.x) / 2).toFixed(1);
    return `${path} C ${midX} ${previous.y.toFixed(1)}, ${midX} ${point.y.toFixed(1)}, ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
  }, "");
  const areaPath = points.length ? `${linePath} L ${points[points.length - 1]!.x.toFixed(1)} 118 L ${points[0]!.x.toFixed(1)} 118 Z` : "";
  const peak = temps.length ? temps.indexOf(maxTemp) : -1;
  const trough = temps.length ? temps.indexOf(minTemp) : -1;
  const rainPeak = hourly.reduce((best, point) => (point.precipProb > best ? point.precipProb : best), 0);
  const rainHour = hourly.find((point) => point.precipProb === rainPeak);
  const dayMin = daily.length ? Math.min(...daily.map((day) => day.tMin)) : 0;
  const dayMax = daily.length ? Math.max(...daily.map((day) => day.tMax)) : 1;
  const daySpan = Math.max(1, dayMax - dayMin);

  return (
    <section className="wx wx-expanded">
      <style>{styles}</style>

      <div className="wx-band" style={{ background: `linear-gradient(var(--wx-theme-shade, transparent), var(--wx-theme-shade, transparent)), ${sky}` }}>
        <header className="wx-top">
          <span className="wx-place">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
              <circle cx="12" cy="10" r="2.6" />
            </svg>
            {placeLine}
          </span>
          <div className="wx-top-actions">
            <button type="button" className="wx-glassbtn" onClick={() => setPanelOpen((open) => !open)}>
              {panelOpen ? ui("收起") : ui("切换城市")}
            </button>
            <RefreshButton busy={busy} onPress={() => void run(() => refresh())} />
          </div>
        </header>

        {current ? (
          <>
            <div className="wx-band-main">
              <div className="wx-band-temp">
                <div className="wx-temp">
                  {round(current.temperature)}
                  <sup>°</sup>
                </div>
                <div className="wx-cond">{condition.label}</div>
                <div className="wx-sub">
                  {ui.rich("体感 {p0}° · 最高 {p1}° / 最低 {p2}°", { p0: round(current.apparent), p1: round(daily[0]?.tMax), p2: round(daily[0]?.tMin) })}</div>
              </div>
              <WeatherGlyph code={current.code} isDay={current.isDay} size={92} />
            </div>
            <div className="wx-facts">
              <div>
                <span>{ui.rich("湿度")}</span>
                <b>{round(current.humidity)}%</b>
              </div>
              <div>
                <span>{ui.rich("风")}</span>
                <b>
                  {compass(current.windDirection)} {round(current.windSpeed)}
                  <small>{speedUnit}</small>
                </b>
              </div>
              <div>
                <span>{ui.rich("气压")}</span>
                <b>
                  {round(current.pressure)}
                  <small>hPa</small>
                </b>
              </div>
              <div>
                <span>{ui.rich("降水")}</span>
                <b>
                  {current.precipitation > 0 ? `${current.precipitation.toFixed(1)}${precipUnit}` : ui("无")}
                </b>
              </div>
              <div>
                <span>{ui.rich("紫外线")}</span>
                <b>{round(daily[0]?.uvMax)}</b>
              </div>
              <div>
                <span>{ui.rich("日出 / 日落")}</span>
                <b>
                  {clockLabel(daily[0]?.sunrise ?? "")} / {clockLabel(daily[0]?.sunset ?? "")}
                </b>
              </div>
            </div>
          </>
        ) : (
          <div className="wx-placeholder wx-placeholder-wide">
            <WeatherGlyph code={3} isDay size={56} />
            <p>{busy ? ui("正在获取天气…") : (data.error ?? ui("还没有天气数据，先选择一个城市"))}</p>
            <button type="button" className="wx-glassbtn" onClick={() => void run(() => refresh())} disabled={busy}>
              {busy ? ui("获取中…") : ui("立即获取")}
            </button>
          </div>
        )}
      </div>

      <div className="wx-body">
        {panelOpen ? searchPanel : null}

        {current ? (
          <>
            <section className="wx-panel">
              <div className="wx-panel-head">
                <h3>{ui.rich("未来 24 小时")}</h3>
                <span>
                  {rainPeak >= 20 ? ui("降水概率最高 {p0}%{p1}", { p0: rainPeak, p1: rainHour ? `（${hourLabel(rainHour.time)}）` : "" }) : ui("未来 24 小时基本无降水")}
                </span>
              </div>
              <svg viewBox="0 0 720 170" className="wx-chart" role="img" aria-label={ui("未来 24 小时气温与降水概率")}>
                <defs>
                  <linearGradient id="wxArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f9ae0" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#4f9ae0" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1={chart.left} y1={chart.bottom} x2={chart.right} y2={chart.bottom} stroke="var(--wb-line-soft)" strokeWidth="1" />
                <path d={areaPath} fill="url(#wxArea)" />
                <path d={linePath} fill="none" stroke="#3d84c6" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
                {points.map((point, index) =>
                  index % 4 === 0 ? <circle key={`dot-${index}`} cx={point.x} cy={point.y} r="3" fill="#fff" stroke="#3d84c6" strokeWidth="2" /> : null,
                )}
                {peak >= 0 ? (
                  <text x={points[peak]!.x} y={points[peak]!.y - 10} textAnchor="middle" className="wx-chart-temp">
                    {round(maxTemp)}°
                  </text>
                ) : null}
                {trough >= 0 && trough !== peak ? (
                  <text x={points[trough]!.x} y={points[trough]!.y + 17} textAnchor="middle" className="wx-chart-temp is-cool">
                    {round(minTemp)}°
                  </text>
                ) : null}
                {hourly.map((point, index) =>
                  index % 4 === 0 ? (
                    <text key={`hour-${index}`} x={xAt(index)} y="126" textAnchor="middle" className="wx-chart-label">
                      {index === 0 ? ui("现在") : hourLabel(point.time)}
                    </text>
                  ) : null,
                )}
                {hourly.map((point, index) => {
                  const height = Math.max(0, (point.precipProb / 100) * 26);
                  return <rect key={`rain-${index}`} x={xAt(index) - 2.5} y={152 - height} width="5" height={height} rx="2.5" fill="#8fc0e8" opacity="0.55" />;
                })}
                <text x={chart.left} y="168" className="wx-chart-label">
                  {ui.rich("降水概率")}</text>
              </svg>
            </section>

            <section className="wx-panel">
              <div className="wx-panel-head">
                <h3>{ui.rich("7 天预报")}</h3>
                <span>
                  {ui.rich("今天 {p0}° ~ {p1}°", { p0: round(daily[0]?.tMin), p1: round(daily[0]?.tMax) })}</span>
              </div>
              <div className="wx-days">
                {daily.map((day: DayPoint, index: number) => {
                  const left = ((day.tMin - dayMin) / daySpan) * 100;
                  const width = Math.max(6, ((day.tMax - day.tMin) / daySpan) * 100);
                  return (
                    <div className="wx-day" key={day.date}>
                      <span className="wx-day-name">{dayLabel(day.date, index)}</span>
                      <WeatherGlyph code={day.code} isDay size={28} tone="paper" />
                      <span className="wx-day-cond">{conditionOf(day.code).label}</span>
                      <span className="wx-day-pop">{day.precipProbMax >= 20 ? `${day.precipProbMax}%` : ""}</span>
                      <span className="wx-day-min">{round(day.tMin)}°</span>
                      <span className="wx-day-track">
                        <i style={{ left: `${left}%`, width: `${width}%` }} />
                      </span>
                      <span className="wx-day-max">{round(day.tMax)}°</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <footer className="wx-footer">
              <span className={stale ? "wx-warn" : undefined}>
                {stale ? ui("更新失败（{p0}），显示 {p1}", { p0: data.error ?? ui("网络异常"), p1: updated.replace(ui("更新"), ui("前的数据")) }) : updated}
              </span>
              <span className="wx-units">
                <button type="button" className={metric ? "is-on" : undefined} aria-pressed={metric} onClick={() => void selectUnits("metric")} disabled={busy}>
                  °C
                </button>
                <button type="button" className={metric ? undefined : "is-on"} aria-pressed={!metric} onClick={() => void selectUnits("imperial")} disabled={busy}>
                  °F
                </button>
              </span>
              <span className="wx-source">{ui.rich("数据来源 Open-Meteo · 免费、无需 API Key · 每 30 分钟自动刷新（{p0}）", { p0: tempUnit })}</span>
            </footer>
          </>
        ) : null}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * 样式
 * ------------------------------------------------------------------ */

const styles = `
.wx{box-sizing:border-box;width:100%;margin-inline:auto;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:13px;line-height:1.5;border-radius:18px;overflow:hidden;text-shadow:0 1px 3px rgba(4,12,24,.34)}
[data-theme="dark"] .wx{--wx-theme-shade:color-mix(in srgb,var(--wb-surface) 45%,transparent)}
.wx *{box-sizing:border-box}
.wx h3,.wx p,.wx ul{margin:0;padding:0}
.wx sup{font-size:20px;font-weight:400;margin-top:8px;opacity:.8}
.wx-glyph{display:block;filter:drop-shadow(0 3px 7px rgba(6,18,36,.16))}
.wx-top{display:flex;align-items:center;justify-content:space-between;gap:12px}
.wx-place{display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:600;letter-spacing:.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wx-top-actions{display:flex;align-items:center;gap:8px}
.wx-iconbtn{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:0;border-radius:50%;background:rgba(255,255,255,.2);color:#fff;cursor:pointer;transition:background .15s,transform .15s;text-shadow:none}
.wx-iconbtn:hover{background:rgba(255,255,255,.32)}
.wx-iconbtn:active{transform:scale(.94)}
.wx-iconbtn:disabled{opacity:.6;cursor:default}
.wx-iconbtn.is-busy svg{animation:wx-spin 1s linear infinite}
@keyframes wx-spin{to{transform:rotate(360deg)}}
.wx-glassbtn{padding:5px 11px;border-radius:999px;border:1px solid rgba(255,255,255,.34);background:rgba(255,255,255,.16);color:#fff;font-size:11.5px;font-family:inherit;cursor:pointer;transition:background .15s;text-shadow:none}
.wx-glassbtn:hover{background:rgba(255,255,255,.28)}
.wx-glassbtn:disabled{opacity:.6;cursor:default}
.wx-temp{display:flex;align-items:flex-start;font-size:64px;font-weight:250;line-height:.98;letter-spacing:-.055em;font-variant-numeric:tabular-nums}
.wx-cond{font-size:15px;font-weight:600;margin-top:8px}
.wx-sub{font-size:11.5px;opacity:.86;margin-top:5px}

/* compact */
.wx-compact{min-height:100dvh;box-sizing:border-box;padding:16px 18px 13px;display:flex;flex-direction:column}
.wx-compact .wx-hero{flex:1}
.wx-compact .wx-placeholder{flex:1;align-content:center;padding-block:20px}
.wx-hero{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px}
.wx-hero-text{min-width:0}
.wx-strip{display:grid;grid-template-columns:repeat(6,1fr);gap:2px;margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,.24)}
.wx-strip-cell{display:grid;justify-items:center;gap:5px;font-size:10px}
.wx-strip-cell span{opacity:.84;white-space:nowrap}
.wx-strip-cell b{font-size:13px;font-weight:600;font-variant-numeric:tabular-nums}
.wx-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:12px;font-size:10px;opacity:.88}
.wx-placeholder{display:grid;justify-items:center;gap:10px;padding:18px 0 6px;text-align:center}
.wx-placeholder p{font-size:12px;opacity:.85;max-width:80%}
.wx-placeholder-wide{padding:26px 0 20px}
/* On the sky the call to action is frosted glass in the sky's own ink, not the palette accent. */
.wx-sky-btn{color:#fff!important;background:rgba(255,255,255,.2)!important;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-weight:600}
.wx-sky-btn:hover{background:rgba(255,255,255,.3)!important}

/* expanded */
.wx-expanded{background:var(--wb-paper);color:var(--wb-ink);text-shadow:none;border-radius:18px}
.wx-setup{min-height:100dvh;display:grid;place-items:center;padding:32px 24px}
.wx-setup-content{width:100%;max-width:540px;text-align:center}
.wx-setup-content>.wx-glyph{margin:0 auto 20px}
.wx-setup h2{font-size:24px;font-weight:600;letter-spacing:-.03em}
.wx-setup-content>p{margin:12px 0 28px;color:var(--wb-muted);line-height:1.8}
.wx-setup .wx-search{text-align:left;border:0;padding:0;background:transparent}
.wx-setup .wx-search-field{flex-basis:100%;min-width:0}
.wx-setup .wx-search-row{justify-content:center;row-gap:14px}
.wx-setup-content>small{display:block;margin-top:4px;color:var(--wb-muted);font-size:12px}
.wx-band{padding:20px 26px 22px;color:#fff;text-shadow:0 1px 3px rgba(4,12,24,.34)}
.wx-band-main{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:12px}
.wx-band .wx-temp{font-size:74px}
.wx-band-temp{min-width:0}
.wx-facts{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:14px;margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,.24)}
.wx-facts>div{min-width:0}
.wx-facts span{display:block;font-size:10.5px;opacity:.86;margin-bottom:4px}
.wx-facts b{font-size:14px;font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap}
.wx-facts b small{font-size:10px;font-weight:400;opacity:.82;margin-left:2px}
.wx-body{padding:20px 26px 22px;background:var(--wb-paper)}
.wx-panel+.wx-panel{margin-top:22px}
.wx-panel-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:10px}
.wx-panel-head h3{font-size:13.5px;font-weight:650;color:var(--wb-ink)}
.wx-panel-head span{font-size:11px;color:var(--wb-muted)}
.wx-chart{display:block;width:100%;height:auto}
.wx-chart-temp{font-size:12px;font-weight:600;fill:var(--wb-accent);font-family:inherit}
.wx-chart-temp.is-cool{fill:var(--wb-muted)}
.wx-chart-label{font-size:11px;fill:var(--wb-muted);font-family:inherit}
.wx-days{display:grid;gap:2px}
.wx-day{display:grid;grid-template-columns:48px 30px 1fr 42px 38px 132px 38px;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--wb-line-soft)}
.wx-day:last-child{border-bottom:0}
.wx-day-name{font-size:12.5px;color:var(--wb-ink-soft);font-weight:600}
.wx-day-cond{font-size:12px;color:var(--wb-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wx-day-pop{font-size:11px;color:#6aa8dd;text-align:right;font-variant-numeric:tabular-nums}
.wx-day-min{font-size:12px;color:var(--wb-muted);text-align:right;font-variant-numeric:tabular-nums}
.wx-day-max{font-size:12.5px;color:var(--wb-ink-soft);font-weight:600;text-align:right;font-variant-numeric:tabular-nums}
.wx-day-track{position:relative;display:block;height:5px;border-radius:999px;background:var(--wb-line-soft)}
.wx-day-track i{position:absolute;top:0;height:5px;border-radius:999px;background:linear-gradient(90deg,#7cb4de,#f2b73c)}
.wx-search{margin-bottom:20px;padding:14px 16px;border:1px solid var(--wb-line);border-radius:14px;background:var(--wb-surface)}
.wx-search-row{display:flex;align-items:flex-end;gap:10px;flex-wrap:wrap}
.wx-search-field{flex:1;min-width:200px}
.wx-results{list-style:none;margin-top:12px!important;display:grid;gap:2px}
.wx-results li{display:flex;align-items:center;gap:10px;padding:7px 2px;border-top:1px solid var(--wb-line-soft)}
.wx-result-name{font-size:12.5px;font-weight:600;color:var(--wb-ink-soft)}
.wx-result-area{flex:1;font-size:11px;color:var(--wb-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wx-message{margin-top:10px!important;font-size:11.5px;color:var(--wb-warning)}
.wx-footer{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:22px;padding-top:14px;border-top:1px solid var(--wb-line-soft);font-size:10.5px;color:var(--wb-muted)}
.wx-units{display:inline-flex;border:1px solid var(--wb-line);border-radius:999px;overflow:hidden}
.wx-units button{padding:3px 10px;border:0;background:transparent;color:var(--wb-muted);font-size:11px;font-family:inherit;cursor:pointer}
.wx-units button.is-on{background:var(--wb-ink-soft);color:var(--wb-paper)}
.wx-source{margin-left:auto;text-align:right}
.wx-warn{color:#ffd9c7}
.wx-body .wx-warn{color:var(--wb-warning)}
.wx-dots{display:inline-flex;gap:4px;margin-left:6px;vertical-align:middle}
.wx-dots i{width:4px;height:4px;border-radius:50%;background:currentColor;opacity:.5;animation:wx-blink 1.1s infinite}
.wx-dots i:nth-child(2){animation-delay:.18s}
.wx-dots i:nth-child(3){animation-delay:.36s}
@keyframes wx-blink{0%,80%,100%{opacity:.25}40%{opacity:.9}}
@media(max-width:640px){
  .wx-band{padding:18px 18px 20px}
  .wx-body{padding:14px}
  .wx-search-field{min-width:0;flex-basis:100%}
  .wx input{font-size:16px}
  .wx-glassbtn,.wx-units button{min-height:36px}
  .wx-day>span{min-width:0;overflow-wrap:anywhere}
  .wx-facts{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
  .wx-day{grid-template-columns:40px 24px minmax(0,1fr) 30px 56px 30px;gap:5px}
  .wx-day-pop{display:none}
  .wx-band .wx-temp{font-size:62px}
  .wx-source{margin-left:0;text-align:left}
}
`;

export default withNotePrerequisites(View, {configurationInView:true});
