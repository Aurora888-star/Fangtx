/**
 * 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 * 文件：config/Fangtx_db.js
 * 说明：MySQL 数据库连接池配置，凭据统一从 .env 读取。
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

const Fangtx_pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'webdesign',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = Fangtx_pool;
