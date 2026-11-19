/**
 * 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 * 文件：app.js
 * 说明：Express 应用配置，注册跨域、静态托管（frontend/）与 /api 路由。
 */
const Fangtx_path = require('path');
const Fangtx_express = require('express');
const Fangtx_cors = require('cors');
const Fangtx_apiRoutes = require('./routes/Fangtx_apiRoutes');

const Fangtx_app = Fangtx_express();

// 支持所有跨域访问
Fangtx_app.use(Fangtx_cors());
Fangtx_app.use(Fangtx_express.json());
Fangtx_app.use(Fangtx_express.urlencoded({ extended: true }));

// 以 express.static 托管 frontend/ 目录
const Fangtx_frontendPath = Fangtx_path.join(__dirname, '..', 'frontend');
Fangtx_app.use(Fangtx_express.static(Fangtx_frontendPath));

// 所有接口统一以 /api 为前缀
Fangtx_app.use('/api', Fangtx_apiRoutes);

// 404 兜底：接口未匹配时返回统一结构
Fangtx_app.use('/api', (Fangtx_req, Fangtx_res) => {
  Fangtx_res.status(404).json({ code: 4004, msg: '接口不存在: ' + Fangtx_req.originalUrl, data: null });
});

// 全局错误处理
Fangtx_app.use((Fangtx_err, Fangtx_req, Fangtx_res, Fangtx_next) => {
  console.error('[Fangtx] 服务器错误:', Fangtx_err.message);
  Fangtx_res.status(500).json({ code: 5000, msg: '服务器内部错误: ' + Fangtx_err.message, data: null });
});

module.exports = Fangtx_app;
