/**
 * 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 * 文件：controllers/Fangtx_galleryController.js
 * 说明：图文列表控制器，从 Fangtx_gallery 表读取图文数据，返回统一 { code, msg, data } 结构。
 */
const Fangtx_pool = require('../config/Fangtx_db');

// GET /api/gallery —— 查询全部图文（按发布时间倒序）
const Fangtx_getGalleryList = async (Fangtx_req, Fangtx_res) => {
  const Fangtx_sql =
    'SELECT Fangtx_id, Fangtx_title, Fangtx_image, Fangtx_category, ' +
    'Fangtx_description, Fangtx_author, Fangtx_publish_time, Fangtx_likes ' +
    'FROM Fangtx_gallery ORDER BY Fangtx_publish_time DESC';

  try {
    const [Fangtx_rows] = await Fangtx_pool.query(Fangtx_sql);
    console.log('[Fangtx] 图文列表查询成功，共', Fangtx_rows.length, '条');
    Fangtx_res.json({
      code: 0,
      msg: '图文列表获取成功',
      data: {
        total: Fangtx_rows.length,
        list: Fangtx_rows
      }
    });
  } catch (Fangtx_err) {
    console.error('[Fangtx] 图文列表查询失败:', Fangtx_err.message);
    Fangtx_res.json({
      code: 5004,
      msg: '图文列表查询失败: ' + Fangtx_err.message,
      data: null
    });
  }
};

module.exports = { Fangtx_getGalleryList };
