/**
 * 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 * 文件：routes/Fangtx_apiRoutes.js
 * 说明：所有 /api 接口的路由汇总。
 */
const Fangtx_express = require('express');
const Fangtx_router = Fangtx_express.Router();
const { Fangtx_healthCheck, Fangtx_dbCheck } = require('../controllers/Fangtx_healthController');
const { Fangtx_dbConnect } = require('../controllers/Fangtx_dbConnectController');
const { Fangtx_getNewsList } = require('../controllers/Fangtx_newsController');

Fangtx_router.get('/health', Fangtx_healthCheck);
Fangtx_router.get('/db/health', Fangtx_dbCheck);
Fangtx_router.post('/db/connect', Fangtx_dbConnect);
Fangtx_router.get('/news', Fangtx_getNewsList);

module.exports = Fangtx_router;
