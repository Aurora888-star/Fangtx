# 知乎的模仿与制作（模仿）

- **姓名**：方天箫
- **学号**：24001010733
- **项目类别**：模仿
- **项目名称**：知乎的模仿与制作

## 项目简介

本项目为「知乎」的模仿与制作，前端使用原生 HTML / CSS / JavaScript（不使用任何第三方库、框架、CDN），后端使用 Node.js + Express 提供 RESTful 接口，并为前端静态资源提供托管。

## 目录结构

```
Webdesign/
├── frontend/              前端（原生 HTML/CSS/JS）
│   ├── index.html         首页（Canvas 背景动画 + 页面导航）
│   ├── css/               样式
│   ├── js/                脚本
│   ├── fonts/             iconfont 图标文件
│   └── images/            图片资源
├── backend/               后端（Node.js + Express + MySQL）
│   ├── server.js          服务入口（端口 8733）
│   ├── app.js             Express 应用配置
│   ├── config/            数据库配置
│   ├── controllers/       控制器
│   ├── routes/            路由
│   ├── .env               数据库凭据（已被 git 忽略）
│   ├── Fangtx_interface.md 接口记录
│   └── Fangtx_database.md  数据库记录
├── Fangtx_prompt.md       开发提示词记录
└── readme.md
```

## 启动方式

前端：由后端 `express.static` 托管，启动后端后访问 `http://localhost:8733`。

后端：

```bash
cd backend
cnpm i        # 依赖安装（失败可用 npm i）
npm start     # 启动服务，端口 8733
```

## 接口约定

- 所有接口以 `/api/` 为前缀
- 统一响应格式：`{ "code": 0, "msg": "提示信息", "data": {...} }`，`code=0` 表示成功，非 0 表示失败

## 页面导航

| 页面 | 路径 | 说明 |
| --- | --- | --- |
| 首页 | frontend/index.html | 项目入口、页面导航、Canvas 背景动画 |
