/**
 * 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 * 文件：server.js
 * 说明：后端服务入口，固定监听 8733 端口。
 */
require('dotenv').config();
const Fangtx_app = require('./app');

const Fangtx_PORT = 8733;

Fangtx_app.listen(Fangtx_PORT, () => {
  console.log('====================================================');
  console.log('[Fangtx] 知乎模仿项目后端服务已启动');
  console.log('[Fangtx] 访问地址: http://localhost:' + Fangtx_PORT);
  console.log('[Fangtx] 健康检查: http://localhost:' + Fangtx_PORT + '/api/health');
  console.log('====================================================');
});
