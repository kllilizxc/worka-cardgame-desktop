# 天气便笺

在工作台桌面上显示当前天气：实况、未来 24 小时气温与降水概率曲线、7 天预报，以及切换城市与单位。

## 数据来源

- 天气与预报：[Open-Meteo](https://open-meteo.com/) —— 免费、**无需注册与 API Key**，非商业用途免费；
- 城市检索：Open-Meteo Geocoding API（同一家，同样免密钥）；
- 可选的网络定位：ipwho.is（免密钥）。出口 IP 可能与真实所在地不同，因此只在用户主动点击「按网络定位」时使用。

第三方依赖：界面组件使用已内置于便笺运行时的 HeroUI 3；天气图标是自绘 SVG，没有额外图标库依赖。

## 结构

- `actions.ts`：view、searchPlaces 是查询；setUnits、usePlace 修改配置，locateByNetwork 按用户操作定位。宿主天气适配器共享读取、新鲜度和失败恢复；便笺不创建刷新计划，也不持久保存预报副本。
- `view.tsx`：compact 是小部件构图（地点、温度、天气图形、未来 6 小时），expanded 展开为实况指标、24 小时曲线与 7 天预报。

## 配置与查询

`model.ts` 是配置 schema、默认值与更新检查的唯一来源；place、units 由 `ctx.config` 保存。便笺没有持久天气状态，status、error、current、hourly、daily 等属于 view 查询结果，读取时检查它们对应的地点和单位。`forecast.ts` 提供纯投影与地点匹配逻辑；React 通过 `useNote` 的 typed `useQuery` 订阅预报，表单草稿保留在 React 本地。

修改 `view.tsx` / `actions.ts` 后需要显式激活代码才会生效。
