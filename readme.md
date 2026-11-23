<!--
  姓名：FTX | 学号：24001010733 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
-->

# 知乎的模仿与制作（模仿）

- **姓名**：FTX
- **学号**：24001010733
- **项目类别**：模仿
- **项目名称**：知乎的模仿与制作

## 项目简介

本项目为「知乎」的模仿与制作。前端使用原生 HTML / CSS / JavaScript（不使用任何第三方库、框架、CDN），实现 Canvas 粒子背景动画与页面链接导航；后端使用 Node.js + Express 提供 RESTful 接口，并以 `express.static` 托管前端静态资源。数据库采用 MySQL，凭据存放于 `backend/.env`（已加入 `.gitignore`，不会提交到仓库）。

## 目录结构

```
Webdesign/
├── frontend/                前端（原生 HTML/CSS/JS，无第三方依赖）
│   ├── index.html           首页（Canvas 背景动画 + 页面导航）
│   ├── css/Fangtx_style.css 样式
│   ├── js/Fangtx_main.js    交互脚本
│   ├── fonts/               iconfont 图标文件（如有）
│   └── images/              图片资源
├── backend/                 后端（Node.js + Express + MySQL）
│   ├── server.js            服务入口（端口 8733）
│   ├── app.js               Express 应用配置
│   ├── config/              数据库配置
│   ├── controllers/         控制器
│   ├── routes/              路由
│   ├── .env                 数据库凭据与 API Key（已被 git 忽略）
│   ├── Fangtx_interface.md  接口记录
│   └── Fangtx_database.md   数据库记录
├── Fangtx_prompt.md         开发提示词记录
├── AGENTS.md                项目规则
└── readme.md                项目说明
```

## 启动方式

先创建数据库（SQL 见 `backend/Fangtx_database.md`），然后安装依赖并启动服务：

```bash
cd backend
cnpm i        # 优先使用 cnpm；失败或超时改用 npm i
npm start     # 固定监听端口 8733
```

前端由后端静态托管，启动后访问：<http://localhost:8733>

AI 聊天功能需在 `backend/.env` 中配置硅基流动密钥（该文件已被 git 忽略）：

```env
SILICONFLOW_API_KEY=你的密钥
SILICONFLOW_API_URL=https://api.siliconflow.cn/v1/chat/completions
SILICONFLOW_MODEL=deepseek-ai/DeepSeek-V4-Flash
```

## 接口一览

| 接口 | 方法 | 说明 |
| --- | --- | --- |
| `/api/health` | GET | 服务健康检查 |
| `/api/db/health` | GET | MySQL 连接健康检查 |
| `/api/db/connect` | POST | 按输入的用户名/密码测试 MySQL 连接 |
| `/api/news` | GET | 获取科技新闻列表（来自 Fangtx_tech_news 表） |
| `/api/gallery` | GET | 获取图文列表（来自 Fangtx_gallery 表） |
| `/api/chat` | POST | AI 聊天：转发消息至硅基流动 DeepSeek 大模型 |

所有接口以 `/api/` 为前缀；统一响应格式为 `{ "code": 0, "msg": "提示信息", "data": {...} }`，`code=0` 表示成功，非 0 表示失败。详细参数与响应示例见 `backend/Fangtx_interface.md`。

## 页面导航

| 页面 | 路径 | 说明 |
| --- | --- | --- |
| 首页 | frontend/index.html | 项目入口、个人信息、已完成页面链接、Canvas 动画 |
| 数据库连接 | frontend/database.html | MySQL 连接测试：输入用户名/密码，成功/错误提示 |
| 科技新闻 | frontend/news.html | 新闻列表：展示后端接口链接与数据库中的数据内容 |
| 图文精选 | frontend/gallery.html | 图文列表：本地 SVG 封面 + 分类筛选 + 接口数据展示 |
| AI 聊天 | frontend/chat.html | DeepSeek 多轮对话：收发数据在浏览器/服务端控制台输出 |

新建 HTML 页面后，请在 `frontend/index.html` 的 `.Fangtx_navGrid` 中追加对应的 `.Fangtx_navCard` 超链接（文件名含 `detail` 的页面除外）。
