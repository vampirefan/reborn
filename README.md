# 轮回 · Reborn

> 一款基于真实历史的文字冒险转生游戏 — A text-based historical adventure game of reincarnation

[English](#english) | [中文](#中文)

---

## 中文

### 项目简介

**轮回（Reborn）** 是一款基于 Nuxt 4 构建的文字冒险类网页游戏。玩家将随机转生到人类历史长河中的某个时代与地点，扮演不同社会阶层的角色，亲历真实发生过的历史事件，与历史名人擦肩而过，直至生命终结后再度转生。

游戏核心循环：**出生 → 在时代中生存 → 死亡 → 转生**。每一段人生都是一次跨越时空的历史漫游。

### 核心特色

- **真实历史背景**：10 个精心打磨的预置剧本，覆盖盛唐长安、古埃及拉美西斯王朝、雅典黄金时代、秦始皇统一、庞贝维苏威火山喷发、维京时代、阿兹特克帝国陨落、江户元禄时代、法国大革命、二战华沙等历史时空
- **历史名人邂逅**：李白、杜甫、苏格拉底、伯里克利、蒙特祖马二世、罗伯斯庇尔、丹东等真实人物作为 NPC 出现在剧情中
- **属性驱动叙事**：四维属性系统（体魄 / 心智 / 魅力 / 气运），范围 1-20，由出身阶层决定基础值，被选择影响成长，反过来又影响后续剧情走向
- **历史百科面板**：游戏过程中可随时打开右侧百科抽屉，查阅当前剧情节点的真实历史背景、查看自己的人生时间线
- **AVG 视觉小说美感**：全屏沉浸式背景图、玻璃拟态 UI、毛玻璃模糊层、金色（#c8a45c）点缀
- **双语支持**：完整中英文界面，所有剧情、百科条目均提供双语版本
- **离线可玩**：内置完整的预置剧本系统，无需 API Key 即可游玩；亦支持接入大语言模型生成式叙事

### 游戏玩法

#### 1. 转生
点击 "开始新人生" 后，系统将随机选择一个剧本，为你分配：
- 姓名、出生年份、所处时代与地点
- 社会阶层（贵族 / 武士 / 商人 / 工匠 / 农民 / 学者等）
- 起始性格特质与初始属性

#### 2. 生存
- **叙事页面** 展示当前情境的文字描述与场景背景图
- **状态 HUD** 显示当前年龄、年份、地点、健康、四维属性
- **选择面板** 提供 2-4 个分支选项，每个选择会推进时间、改变属性、解锁新事件
- **历史百科按钮**（📖）打开右侧抽屉，查阅当前节点的真实历史背景或回顾完整时间线

#### 3. 死亡与转生
- 健康归零、时代终结或剧情节点判定即触发死亡
- 死亡画面展示这一生的总结：在世年限、关键选择、际遇的历史人物
- 一次点击进入下一段人生 — 完全不同的时代、地点与故事

### 已收录剧本

| 剧本 | 时代 | 地点 | 关键事件 |
|------|------|------|---------|
| `tang-poet` | 盛唐 | 长安 | 开元盛世、安史之乱 |
| `egypt-scribe` | 公元前 13 世纪 | 底比斯 | 拉美西斯二世、卡迭石战役 |
| `athens-citizen` | 公元前 5 世纪 | 雅典 | 伯里克利时代、伯罗奔尼撒战争、雅典大瘟疫 |
| `qin-peasant` | 战国末期 | 关中 | 秦灭六国、长城修建、焚书坑儒 |
| `pompeii-merchant` | 公元 1 世纪 | 庞贝 | 尼禄统治、62 年大地震、维苏威火山爆发 |
| `viking-trader` | 9 世纪 | 挪威 / 君士坦丁堡 | 维京扩张、瓦良格卫队、东方贸易路线 |
| `aztec-noble` | 15-16 世纪 | 特诺奇提特兰 | 阿兹特克鼎盛、科尔特斯入侵 |
| `edo-ronin` | 17-18 世纪 | 江户 | 元禄文化、赤穗浪士、兰学兴起 |
| `revolution-paris` | 18 世纪末 | 巴黎 | 攻占巴士底狱、雅各宾俱乐部、恐怖统治 |
| `wwii-civilian` | 20 世纪 40 年代 | 华沙 | 德军入侵、华沙犹太区起义、波兰家乡军 |

### 技术栈

- **框架**：Nuxt 4.4.6（Vue 3.5、Vue Router 5）
- **状态管理**：Pinia 3.0（gameStore / historyStore / settingsStore）
- **国际化**：@nuxtjs/i18n 10.4
- **工具集**：@vueuse/nuxt 14.3
- **构建工具**：Vite 7
- **运行时**：Nitro（Node Server 预设）

### 项目结构

```
reborn/
├── app/
│   ├── pages/                # 页面（index 主游戏 / settings 设置 / history 历史）
│   ├── components/game/      # 游戏组件（场景、叙事、选项、HUD、百科面板、转场等）
│   ├── composables/          # 组合式函数（游戏引擎、叙事、图像、持久化、知识面板）
│   ├── stores/               # Pinia 状态（游戏状态 / 历史档案 / 用户设置）
│   ├── data/
│   │   ├── scenarios/        # 10 个预置剧本（节点图结构）
│   │   └── types.ts          # 剧本与游戏数据类型定义
│   └── assets/css/           # 主样式 / 排版 / 转场动画
├── server/
│   ├── api/narrative/        # 大模型叙事生成接口（可选）
│   ├── api/image/            # 场景图像生成接口（可选）
│   └── utils/prompts.ts      # AI Prompt 模板
├── shared/types/             # 跨前后端的类型定义（Player / GameEvent 等）
├── locales/                  # 中英文国际化资源
└── nuxt.config.ts
```

### 快速开始

#### 安装依赖

```bash
npm install
# 或 pnpm install / yarn install / bun install
```

#### 开发模式

启动开发服务器（http://localhost:3000）：

```bash
npm run dev
```

#### 生产构建

```bash
npm run build       # 构建
npm run preview     # 本地预览生产构建
```

#### 静态生成

```bash
npm run generate
```

### 配置说明

游戏开箱即用，**无需任何 API Key 即可完整体验**。如需启用 AI 生成式叙事：

1. 进入设置页面 (`/settings`)
2. 配置大语言模型 API（可选）
3. 配置图像生成 API（可选）

未配置时，系统自动使用内置的 10 个预置剧本，所有剧情节点、属性变化、历史背景百科均完整可用。

---

## English

### Overview

**Reborn** is a text-based historical adventure web game built with Nuxt 4. Players are randomly reborn into different eras and places throughout human history, experiencing the lives of people from various social classes, witnessing real historical events, and crossing paths with figures from the past — until death and rebirth begin a new journey.

Core gameplay loop: **Birth → Living through the era → Death → Rebirth**. Each life is a journey across time.

### Key Features

- **Authentic historical settings**: 10 carefully crafted scenarios spanning Tang Chang'an, Ramesside Egypt, Golden Age Athens, Qin unification China, Pompeii under Vesuvius, the Viking Age, the fall of the Aztec Empire, Genroku-era Edo, the French Revolution, and WWII Warsaw
- **Encounters with historical figures**: Li Bai, Du Fu, Socrates, Pericles, Montezuma II, Robespierre, Danton and other real figures appear as NPCs
- **Stat-driven narrative**: Four core attributes (Body / Mind / Charisma / Luck), range 1-20, initialized by birth status, modified by choices, and influencing branching outcomes
- **Historical Knowledge Panel**: A side drawer accessible at any time provides authentic historical background for the current narrative node and a complete timeline of your life
- **AVG visual novel aesthetics**: Full-screen immersive backgrounds, glass-morphism UI, frosted blur layers, gold (#c8a45c) accents
- **Bilingual**: Full Chinese/English UI; every scenario node and encyclopedia entry is bilingual
- **Plays offline**: Ships with a complete pre-built scenario system — no API key required. Optionally connects to LLMs for generative narrative

### Gameplay

#### 1. Rebirth
Click "Start a new life" and the system randomly picks a scenario, assigning you:
- Name, birth year, era, and location
- Social class (noble / samurai / merchant / artisan / peasant / scholar...)
- Starting traits and initial stats

#### 2. Living
- **Narrative view** displays the current situation with a scene backdrop
- **Status HUD** shows age, year, location, health, and the four stats
- **Choice panel** offers 2-4 branches; each choice advances time, mutates stats, and unlocks new events
- **Knowledge button** (📖) opens the right-side drawer with real historical background and a full life timeline

#### 3. Death and Rebirth
- Triggered by zero health, the era's end, or a narrative endpoint
- The death screen summarizes your life: years lived, key choices, historical figures encountered
- One click to begin the next life — a completely different era, place, and story

### Available Scenarios

| Scenario | Era | Location | Key Events |
|----------|-----|----------|------------|
| `tang-poet` | Tang Dynasty | Chang'an | Kaiyuan prosperity, An Lushan Rebellion |
| `egypt-scribe` | 13th c. BCE | Thebes | Ramesses II, Battle of Kadesh |
| `athens-citizen` | 5th c. BCE | Athens | Pericles' age, Peloponnesian War, Plague of Athens |
| `qin-peasant` | Late Warring States | Guanzhong | Qin unification, Great Wall, book burning |
| `pompeii-merchant` | 1st c. CE | Pompeii | Nero's reign, 62 CE earthquake, Vesuvius eruption |
| `viking-trader` | 9th c. | Norway / Constantinople | Viking expansion, Varangian Guard, eastern trade |
| `aztec-noble` | 15-16th c. | Tenochtitlan | Aztec zenith, Cortes' invasion |
| `edo-ronin` | 17-18th c. | Edo | Genroku culture, the 47 Ronin, rise of Rangaku |
| `revolution-paris` | Late 18th c. | Paris | Storming of the Bastille, Jacobin Club, Reign of Terror |
| `wwii-civilian` | 1940s | Warsaw | German invasion, Warsaw Ghetto Uprising, Polish Home Army |

### Tech Stack

- **Framework**: Nuxt 4.4.6 (Vue 3.5, Vue Router 5)
- **State management**: Pinia 3.0 (gameStore / historyStore / settingsStore)
- **i18n**: @nuxtjs/i18n 10.4
- **Utilities**: @vueuse/nuxt 14.3
- **Build**: Vite 7
- **Runtime**: Nitro (node-server preset)

### Project Structure

```
reborn/
├── app/
│   ├── pages/                # Pages (index / settings / history)
│   ├── components/game/      # Game components (scene, narrative, choices, HUD, knowledge panel, transitions)
│   ├── composables/          # Composables (game engine, narrative, image gen, persistence, knowledge panel)
│   ├── stores/               # Pinia stores (game / history / settings)
│   ├── data/
│   │   ├── scenarios/        # 10 pre-built scenarios (node graphs)
│   │   └── types.ts          # Scenario and game data types
│   └── assets/css/           # Main styles / typography / transitions
├── server/
│   ├── api/narrative/        # LLM narrative generation endpoint (optional)
│   ├── api/image/            # Scene image generation endpoint (optional)
│   └── utils/prompts.ts      # AI prompt templates
├── shared/types/             # Cross-stack type definitions (Player / GameEvent...)
├── locales/                  # Chinese/English i18n resources
└── nuxt.config.ts
```

### Quick Start

#### Install dependencies

```bash
npm install
# or pnpm install / yarn install / bun install
```

#### Development

Start the dev server at http://localhost:3000:

```bash
npm run dev
```

#### Production build

```bash
npm run build       # build
npm run preview     # preview production build locally
```

#### Static generation

```bash
npm run generate
```

### Configuration

The game runs **out of the box with no API keys required**. To enable AI-generated narrative:

1. Open the settings page (`/settings`)
2. Configure your LLM API (optional)
3. Configure your image generation API (optional)

Without configuration, the 10 pre-built scenarios provide the full experience — every narrative node, stat change, and encyclopedia entry works offline.

---

## License

Private project. All historical content is for educational and entertainment purposes.
