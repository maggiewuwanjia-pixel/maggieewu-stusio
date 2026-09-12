# 个人网站项目交接

更新日期：2026-09-12。本文是对话上下文摘要，不是完整聊天记录。接手时先检查代码和运行结果；下述部署状态是最后一次观察，不代表服务器实时状态。

## 项目目标与用户要求

为邬宛珈（Wanjia Wu / Maggie）制作个人作品网站，最终公开展示。用户明确希望清新绿色、有创意的拼贴视觉，并强调真实的滚动动效、产品功能演示，不接受只有静态文字卡片的普通页面。

页面顺序：目录 → NorthStar AI 产品 → PlateForge AI 产品 → 建筑作品动态展览（3–4屏）→ 个人介绍/简历 → NIVEA 项目（1–2屏，以 briefing 为主）。

- NorthStar：使用用户提供的绿色办公、森林电脑等图片作背景和动态图元，展示真实产品 UI。
- PlateForge：使用绿色食材、餐桌、咖啡等图片，展示真实产品 UI。
- 建筑：从用户作品集 PDF 提取图版，可将多张图缩小、整齐编排，支持点击放大。
- 简历：依据 CV，不编造经历；NIVEA 依据源 PDF，不能把预测模型说成已实现业绩。
- 原始视觉参考为 Shopify Renaissance 风格：叠层拼贴、滚动过渡、粒子光环，以及“大背景图 + 产品 UI + prompt 条 + 功能说明”的演示区。
- 用户最近明确要求删除 PlateForge 米色手机外框；重点是产品截图本身只占框左上角、右侧和底部有大量空白，不是单纯移动端宽度问题。

## 仓库与新电脑启动

GitHub： https://github.com/maggiewuwanjia-pixel/maggieewu-stusio

仓库拼写是 `stusio`，请不要自行改为 `studio`。本仓库是完整个人作品网站，不是原 PlateForge 产品仓库。

安装 Node.js 22.13+（22.x），执行：

```bash
git clone https://github.com/maggiewuwanjia-pixel/maggieewu-stusio.git
cd maggieewu-stusio
npm ci
npm run dev
```

打开终端实际显示的地址，通常是 http://localhost:3000/ 。必须保持开发进程运行；不能在未启动服务时直接给用户 localhost 链接。

原电脑 checkout 为 `outputs/northstar-renaissance`，位于用户 Documents/Codex 的此任务目录。原电脑 Git 中 `github` 指向上述仓库，`origin` 指向 Sites 内部仓库；新电脑 clone 后通常只有 GitHub `origin`，推送前检查远程。

用户已于 2026-09-12 成功推送 main。最后的产品代码提交是 `1bd02aa`，此前为 `0c9fefc`，更早的 Sites 已发布版本代码为 `332ffaf`。

## 代码结构

- `app/page.tsx`：主页所有章节、滚动 Motion 包装器、产品切换文字、建筑图版、简历、NIVEA、原生 dialog 放大。
- `app/globals.css`：主体布局和响应式、sticky 区块、主展示 `.phone` 外框。
- `app/showcase.tsx`：Portal 粒子转场和 FeatureShowcase 功能演示。
- `app/showcase.css`：背景图、功能卡片、演示动画；文件末尾有几轮修复覆盖规则，需要审查优先级。
- `app/layout.tsx`：全局样式引入、页面标题与 metadata。
- `public/portfolio/`：实际使用的产品截图、背景、透明图元、建筑和 NIVEA 图版。
- `app/scene.tsx` 与 `public/scenes/`、`public/decoders/`：早期 Three.js 场景遗留，当前主页面未使用该组件；不要未经检查直接删除。
- `package.json`：Vinext + React 19 + Vite 8。`npm run build` 是 vinext build，但 `npm start` 是 Wrangler dev，不能当成通用 Ubuntu 生产启动命令。
- `.openai/hosting.json`：既有 Sites 项目关联；保留，不要创建替代 Sites 项目。

## 已有功能与素材

首屏创意花园、固定目录、NorthStar/PlateForge 拼贴主展示、产品说明 tabs、各两个功能演示卡片、粒子光环转场、四组建筑展览、简历、NIVEA 案例、图版放大。

功能卡片是预设流程演示，未接后端 AI，不要宣称实时生成。PlateForge 两张卡片使用同一配置截图，不能假称已有独立 Pantry 实拍。

产品地址：NorthStar http://northstar-copilot.com/ ，PlateForge http://106.53.42.148:3000/ 。部署个人站点时不能占用或破坏原产品服务。

建筑图版 `arch-01.jpg` 至 `arch-25.jpg` 源于用户 PDF：

| 作品 | 使用页码 |
| --- | --- |
| 聚场：当代戏剧博物馆，独立设计，2020秋 | 5、7、8、9 |
| 拼贴之家：为汉诺赫·列文而作，独立设计，2021春 | 14、12、13、10 |
| 胡同里的手艺人，合作设计，2021春 | 19、16、17、18 |
| 生长的街区：Wallacei，合作设计，CAAD 2020夏 | 23、21、22、20 |

NIVEA 使用 `nivea-031/035/041/046.jpg` 的诊断，以及 `048/049/051` briefing/SOP 图版。源 PDF 有部分内嵌缺图标记，需区分源文件内容与网页图片加载失败。

`forest-office.jpg` 为森林办公背景；`food-background.jpg` 为蔬菜购物袋；`green-gallery.jpg` 为草地走廊；`building-background.jpg` 为漂浮建筑；`portal-background.jpg` 为圆形草地天空。`office-island.png` 和 `food-sculpture.png` 是已生成的透明拼贴素材。

简历要点：清华经管管理学硕士 2024–2027、ESADE CEMS 交换 2026、清华建筑本科 2018–2024；腾讯 IEG Data & AI 产品、快手战略投资/Kling、字节本地生活策略经历；25万+粉丝、100+直播、10个月30万+收入来自用户 CV。详细表述优先对照原 CV。不要自动公开额外个人信息。

## 未解决或尚未验收的 UI 问题（优先处理）

此前多次仅修改 CSS 后就声称修复，未充分截图验收，用户多次反馈“没改”。不能把历史答复当作已验证事实。

1. **PlateForge 截图本身带空白。** `public/portfolio/plateforge-ui.png` 是约 430×710 的截图，但真实 UI 仅在左上约 215×500。之前把整个图放进米色设备壳，导致双重留白。最近 CSS 对主 `.plate .phone` 和 `.meal/.pantry .feature-device` 去掉边框、标题栏、底色，用 `aspect-ratio:215/500`、图片 `width:200%` 与平移裁出真实 UI。尚未浏览器视觉确认，必须在桌面和手机宽度检查主展示、功能卡片及放大图。放大仍可能显示原始带空白截图。
2. **整屏空白。** 用户在 PlateForge 区域看到大块纯绿色。曾新增 `html,body{overflow-x:hidden}`，可能影响 sticky 容器；最新改为 `overflow-x:clip`。这是修复假设，尚未确认根因和结果。检查滚动全程、Portal 覆盖层、sticky 高度和定位，不要只检查首页 HTTP 200。
3. **卡片与提示条溢出。** `.feature-grid` 已改 minmax(0,1fr)，并恢复小屏单列规则；不同宽度仍需验收。
4. **建筑图片。** 曾在线上不显示；本地 25 张图都在。早先把 401/403 归因于私有权限过于武断，应该分别检查图片状态码、MIME、实际加载与部署内容。

验收需打开实际页面，滚动到对应章节，检查宽屏和约390px小屏、全部图片加载、prompt 演示和图版放大。区分本地、Sites 和腾讯云三个版本，明确告诉用户改的是哪个。

## Sites 与腾讯云部署状态

Sites 地址： https://northstar-product-showcase-20260911.maggiewuwanjia.chatgpt.site/

Sites 最后成功发布版本为第4版（2026-09-11）；2026-09-12 后续 CSS 修复只在本地/GitHub，未证实同步到 Sites。用户已明确授权并完成 public 访问模式切换，但部分浏览器仍出现安全拦截页。一次无凭证首页 curl 返回200并不能证明用户端或图片全部正常。

用户现在希望用腾讯云和自己的域名，已授权部署。域名以用户后来明确写出的 **maggieewu-studio.com** 为准；历史助手多次写错，实际配置前核实 DNS 与域名控制台。

腾讯云服务器在广州，Ubuntu。SSH 绑定后曾成功连接。私钥必须单独安全迁移，不在仓库；不要把私钥、Token 或完整聊天中的凭证放入交接文档。

已尝试的部署：

- 源码上传到服务器 `/home/ubuntu/maggiewu-studio/`（目录名称与域名不同）。服务器副本早于最终 UI 修复。
- Nginx 已存在，现有配置尚未完整盘点，不能覆盖默认配置或其他站点。
- apt 安装了 Node18/npm，后来发现用户原有 nvm Node22.23.2；加载 nvm 后构建成功。非交互 SSH 若没载入 nvm 仍会调用 Node18。
- 缺少 rolldown Linux 原生依赖曾通过重新安装 optional dependencies 解决；保留锁文件，避免随意升级。
- `npm start` 实际运行 Wrangler，在服务器运行出错；随后尝试 `vinext start --port 3001`，探测返回404，但没有确认3001由哪个进程监听，所以不能认定404来自本项目。
- 曾观察到既有 PlateForge `/opt/plateforge/web` 的 Vinext 进程使用3002。服务器已有别的项目，下一步必须先检查端口、进程、Nginx，再选独立服务配置。
- **腾讯云正式部署未完成**：未确认个人站点生产服务可用、未配置可靠进程守护、未验证域名和 HTTPS。不要声称已上线。
- 广州服务器对公网域名的备案/接入条件尚未核实；正式开放前查腾讯云当前要求及用户备案状态，不要假设注册域名或 DNS“正常”意味着可正式访问。

## 原始资料迁移

原电脑 Downloads/000CV 中：`CV_WANJIA_WU_2026_MKT.pdf`、`作品集-邬宛珈（电子版）.pdf`、`Nivea —— Accelerate TikTok Shop growth.pdf`。

原电脑 Downloads/ref 中有用户参考 JPG。编译后的原视觉参考目录为 Downloads/renaissance-frontend 2。以上原始目录未随本仓库上传；已提取并用于网页的素材在 public/portfolio 中。如需重新提取 PDF 或替换参考图，需用户安全迁移原文件。

完整对话未同步到 GitHub；新设备应先读本文再检查实际代码。不要沿用原电脑绝对路径、假设 localhost 服务存在，或把尚未验证的修改视为完成。

## 接手建议

先启动本地，验收并修复 PlateForge 截图和空白滚动段；再审查生产启动配置，独立部署腾讯云并保护现有产品服务。每次完成修改后提交到当前 GitHub 仓库，确认远程提交存在。用户不希望反复被问是否继续，已授权范围内直接推进，但涉及密码/Token 输入需由用户在安全登录提示中完成。
