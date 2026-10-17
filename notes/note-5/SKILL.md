---
name: worka-weather
description: 查看天气，设置地点与单位，搜索地点或刷新天气数据。
---

地点与单位属于本地配置，天气结果是按配置加载的资料。使用 `usePlace` 选择已确认地点，`setUnits` 切换单位；`locateByNetwork` 会请求网络定位，不将估算地点当作用户确认。

读取时检查结果对应的地点和单位，不能把旧地点数据当作当前结果。配置更改后资源自动更新。view 与 searchPlaces 是查询；需要最新预报时重新验证 view，不调用旧 refresh action。外部调用 setUnits 的 input 为 `{units:"metric"}` 或 `{units:"imperial"}`。
