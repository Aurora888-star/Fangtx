/**
 * 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 * 文件：controllers/Fangtx_healthController.js
 * 说明：健康检查控制器，统一返回 { code, msg, data } 结构。
 */
const Fangtx_pool = require('../config/Fangtx_db');

const Fangtx_healthCheck = (req, res) => {
  const Fangtx_data = {
    service: 'Fangtx 知乎模仿项目后端',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  };
  console.log('[Fangtx] 健康检查接口被访问:', Fangtx_data);
  res.json({ code: 0, msg: '服务运行正常', data: Fangtx_data });
};

const Fangtx_dbCheck = async (req, res) => {
  try {
    const [rows] = await Fangtx_pool.query('SELECT 1 + 1 AS result');
    res.json({ code: 0, msg: '数据库连接正常', data: rows[0] });
  } catch (err) {
    console.error('[Fangtx] 数据库连接失败:', err.message);
    res.json({ code: 5001, msg: '数据库连接失败: ' + err.message, data: null });
  }
};

module.exports = { Fangtx_healthCheck, Fangtx_dbCheck };
