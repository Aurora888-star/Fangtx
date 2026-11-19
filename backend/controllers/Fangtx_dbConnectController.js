/**
 * 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 * 文件：controllers/Fangtx_dbConnectController.js
 * 说明：根据前端传入的用户名与密码测试 MySQL 连接，返回统一 { code, msg, data } 结构。
 *       连接主机与库名从 .env 读取，用户名/密码不从前端代码硬编码、不写入日志。
 */
const Fangtx_mysql = require('mysql2/promise');
require('dotenv').config();

const Fangtx_dbConnect = async (Fangtx_req, Fangtx_res) => {
  const Fangtx_username = (Fangtx_req.body && Fangtx_req.body.username || '').trim();
  const Fangtx_password = Fangtx_req.body && Fangtx_req.body.password || '';

  if (!Fangtx_username || !Fangtx_password) {
    console.error('[Fangtx] 数据库连接参数缺失');
    return Fangtx_res.json({ code: 4001, msg: '请输入用户名和密码', data: null });
  }

  const Fangtx_host = process.env.DB_HOST || 'localhost';
  const Fangtx_database = process.env.DB_NAME || 'webdesign';
  let Fangtx_connection = null;

  try {
    Fangtx_connection = await Fangtx_mysql.createConnection({
      host: Fangtx_host,
      user: Fangtx_username,
      password: Fangtx_password,
      database: Fangtx_database
    });

    const [Fangtx_rows] = await Fangtx_connection.query(
      'SELECT VERSION() AS Fangtx_version, DATABASE() AS Fangtx_databaseName'
    );

    console.log('[Fangtx] 数据库连接成功，用户:', Fangtx_username);
    Fangtx_res.json({
      code: 0,
      msg: '数据库连接成功',
      data: {
        host: Fangtx_host,
        user: Fangtx_username,
        database: Fangtx_database,
        mysqlVersion: Fangtx_rows[0].Fangtx_version,
        time: new Date().toISOString()
      }
    });
  } catch (Fangtx_err) {
    console.error('[Fangtx] 数据库连接失败:', Fangtx_err.message);
    Fangtx_res.json({
      code: 5002,
      msg: '数据库连接失败: ' + Fangtx_err.message,
      data: null
    });
  } finally {
    if (Fangtx_connection) {
      try {
        await Fangtx_connection.end();
      } catch (Fangtx_endErr) {
        console.error('[Fangtx] 关闭数据库连接出错:', Fangtx_endErr.message);
      }
    }
  }
};

module.exports = { Fangtx_dbConnect };
