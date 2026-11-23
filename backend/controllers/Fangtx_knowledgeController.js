/**
 * 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
 * 文件：controllers/Fangtx_knowledgeController.js
 * 说明：知识库（RAG）控制器：文件上传解析、知识库管理、基于检索增强的问答。
 *       服务端控制台完整输出「发送给大模型的数据」与「从大模型接收到的数据」。
 */
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Fangtx_pool = require('../config/Fangtx_db');
const Fangtx_docParser = require('../services/Fangtx_docParser');

require('dotenv').config();
const Fangtx_apiKey = process.env.SILICONFLOW_API_KEY || '';
const Fangtx_apiUrl = process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/chat/completions';
const Fangtx_model = process.env.SILICONFLOW_MODEL || 'deepseek-ai/DeepSeek-V4-Flash';

const Fangtx_uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(Fangtx_uploadDir)) fs.mkdirSync(Fangtx_uploadDir, { recursive: true });

const Fangtx_allowedExt = ['doc', 'docx', 'ppt', 'pptx', 'pdf', 'txt', 'md'];

// multer 上传配置：限制 10MB，文件名加时间戳前缀避免冲突
const Fangtx_storage = multer.diskStorage({
  destination: function (Fangtx_req, Fangtx_file, Fangtx_cb) {
    Fangtx_cb(null, Fangtx_uploadDir);
  },
  filename: function (Fangtx_req, Fangtx_file, Fangtx_cb) {
    const Fangtx_ext = path.extname(Fangtx_file.originalname).toLowerCase();
    const Fangtx_name = 'Fangtx_' + Date.now() + '_' + Math.floor(Math.random() * 1000) + Fangtx_ext;
    Fangtx_cb(null, Fangtx_name);
  }
});
const Fangtx_upload = multer({
  storage: Fangtx_storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// ============ 知识库文件列表 ============
const Fangtx_listFiles = async (Fangtx_req, Fangtx_res) => {
  try {
    const [Fangtx_rows] = await Fangtx_pool.query(
      'SELECT Fangtx_id, Fangtx_filename, Fangtx_file_type, Fangtx_file_size, ' +
      'Fangtx_chunk_count, Fangtx_status, Fangtx_upload_time ' +
      'FROM Fangtx_knowledge_file ORDER BY Fangtx_upload_time DESC'
    );
    console.log('[Fangtx][KB] 知识库文件列表查询成功，共', Fangtx_rows.length, '个文件');
    Fangtx_res.json({ code: 0, msg: '知识库文件列表获取成功', data: { total: Fangtx_rows.length, list: Fangtx_rows } });
  } catch (Fangtx_err) {
    console.error('[Fangtx][KB] 文件列表查询失败:', Fangtx_err.message);
    Fangtx_res.json({ code: 5005, msg: '文件列表查询失败: ' + Fangtx_err.message, data: null });
  }
};

// ============ 上传并解析文件 ============
const Fangtx_uploadFile = (Fangtx_req, Fangtx_res) => {
  Fangtx_upload.single('file')(Fangtx_req, Fangtx_res, async function (Fangtx_err) {
    if (Fangtx_err) {
      console.error('[Fangtx][KB] 文件上传失败:', Fangtx_err.message);
      return Fangtx_res.json({ code: 4002, msg: '文件上传失败: ' + Fangtx_err.message, data: null });
    }
    if (!Fangtx_req.file) {
      return Fangtx_res.json({ code: 4003, msg: '请选择要上传的文件', data: null });
    }

    const Fangtx_file = Fangtx_req.file;
    const Fangtx_originalName = Fangtx_file.originalname;
    const Fangtx_ext = path.extname(Fangtx_originalName).toLowerCase().replace('.', '');

    if (Fangtx_allowedExt.indexOf(Fangtx_ext) === -1) {
      fs.unlinkSync(Fangtx_file.path);
      return Fangtx_res.json({ code: 4004, msg: '不支持的文件格式，仅支持 doc/docx/ppt/pptx/pdf/txt/md', data: null });
    }

    let Fangtx_text = '';
    try {
      console.log('[Fangtx][KB] 开始解析文件:', Fangtx_originalName, '类型:', Fangtx_ext);
      Fangtx_text = await Fangtx_docParser.Fangtx_parseFile(Fangtx_file.path, Fangtx_originalName);
    } catch (Fangtx_parseErr) {
      console.error('[Fangtx][KB] 文件解析失败:', Fangtx_parseErr.message);
      // 解析失败仍保留文件记录，状态标记为 error
      await Fangtx_pool.query(
        'INSERT INTO Fangtx_knowledge_file (Fangtx_filename, Fangtx_stored_name, Fangtx_file_type, Fangtx_file_size, Fangtx_chunk_count, Fangtx_status) VALUES (?,?,?,?,0,?)',
        [Fangtx_originalName, Fangtx_file.filename, Fangtx_ext, Fangtx_file.size, 'error']
      );
      return Fangtx_res.json({ code: 5006, msg: '文件解析失败: ' + Fangtx_parseErr.message, data: null });
    }

    const Fangtx_chunks = Fangtx_docParser.Fangtx_splitChunks(Fangtx_text, 300);
    if (Fangtx_chunks.length === 0) {
      fs.unlinkSync(Fangtx_file.path);
      return Fangtx_res.json({ code: 5007, msg: '未从文件中提取到有效文本内容', data: null });
    }

    try {
      const Fangtx_conn = await Fangtx_pool.getConnection();
      try {
        await Fangtx_conn.beginTransaction();
        const [Fangtx_insert] = await Fangtx_conn.query(
          'INSERT INTO Fangtx_knowledge_file (Fangtx_filename, Fangtx_stored_name, Fangtx_file_type, Fangtx_file_size, Fangtx_chunk_count, Fangtx_status) VALUES (?,?,?,?,?,?)',
          [Fangtx_originalName, Fangtx_file.filename, Fangtx_ext, Fangtx_file.size, Fangtx_chunks.length, 'ready']
        );
        const Fangtx_fileId = Fangtx_insert.insertId;
        for (let Fangtx_i = 0; Fangtx_i < Fangtx_chunks.length; Fangtx_i++) {
          await Fangtx_conn.query(
            'INSERT INTO Fangtx_knowledge_chunk (Fangtx_file_id, Fangtx_chunk_index, Fangtx_content) VALUES (?,?,?)',
            [Fangtx_fileId, Fangtx_i, Fangtx_chunks[Fangtx_i]]
          );
        }
        await Fangtx_conn.commit();
        console.log('[Fangtx][KB] 文件入库成功:', Fangtx_originalName, '分块数:', Fangtx_chunks.length);

        Fangtx_res.json({
          code: 0,
          msg: '文件上传解析成功',
          data: {
            Fangtx_id: Fangtx_fileId,
            Fangtx_filename: Fangtx_originalName,
            Fangtx_file_type: Fangtx_ext,
            Fangtx_chunk_count: Fangtx_chunks.length,
            Fangtx_preview: Fangtx_text.slice(0, 200)
          }
        });
      } catch (Fangtx_dbErr) {
        await Fangtx_conn.rollback();
        throw Fangtx_dbErr;
      } finally {
        Fangtx_conn.release();
      }
    } catch (Fangtx_err) {
      console.error('[Fangtx][KB] 文件入库失败:', Fangtx_err.message);
      Fangtx_res.json({ code: 5008, msg: '文件入库失败: ' + Fangtx_err.message, data: null });
    }
  });
};

// ============ 删除知识库文件 ============
const Fangtx_deleteFile = async (Fangtx_req, Fangtx_res) => {
  const Fangtx_id = Fangtx_req.params.id;
  try {
    const [Fangtx_rows] = await Fangtx_pool.query(
      'SELECT Fangtx_stored_name FROM Fangtx_knowledge_file WHERE Fangtx_id = ?', [Fangtx_id]
    );
    if (Fangtx_rows.length === 0) {
      return Fangtx_res.json({ code: 4005, msg: '知识库文件不存在', data: null });
    }
    await Fangtx_pool.query('DELETE FROM Fangtx_knowledge_chunk WHERE Fangtx_file_id = ?', [Fangtx_id]);
    await Fangtx_pool.query('DELETE FROM Fangtx_knowledge_file WHERE Fangtx_id = ?', [Fangtx_id]);

    const Fangtx_storedPath = path.join(Fangtx_uploadDir, Fangtx_rows[0].Fangtx_stored_name);
    // 仅删除 uploads 目录下由本系统上传的文件；knowledge 目录下的示例文件保留
    if (fs.existsSync(Fangtx_storedPath) && Fangtx_rows[0].Fangtx_stored_name.indexOf('Fangtx_') === 0) {
      try { fs.unlinkSync(Fangtx_storedPath); } catch (Fangtx_e) { /* 忽略删除失败 */ }
    }
    console.log('[Fangtx][KB] 已删除知识库文件 ID:', Fangtx_id);
    Fangtx_res.json({ code: 0, msg: '知识库文件删除成功', data: { Fangtx_id: Number(Fangtx_id) } });
  } catch (Fangtx_err) {
    console.error('[Fangtx][KB] 删除失败:', Fangtx_err.message);
    Fangtx_res.json({ code: 5009, msg: '删除失败: ' + Fangtx_err.message, data: null });
  }
};

// ============ 检索相关分块（关键词匹配打分） ============
async function Fangtx_retrieveChunks(Fangtx_question, Fangtx_topK) {
  const [Fangtx_rows] = await Fangtx_pool.query(
    'SELECT c.Fangtx_id, c.Fangtx_file_id, c.Fangtx_chunk_index, c.Fangtx_content, f.Fangtx_filename ' +
    'FROM Fangtx_knowledge_chunk c JOIN Fangtx_knowledge_file f ON c.Fangtx_file_id = f.Fangtx_id ' +
    'WHERE f.Fangtx_status = ?', ['ready']
  );

  // 中文按 2 字词组切分作为检索关键词
  const Fangtx_clean = Fangtx_question.replace(/[\s，。？！、；：,.?!]/g, '');
  const Fangtx_keywords = [];
  for (let Fangtx_i = 0; Fangtx_i < Fangtx_clean.length - 1; Fangtx_i++) {
    Fangtx_keywords.push(Fangtx_clean.slice(Fangtx_i, Fangtx_i + 2));
  }

  const Fangtx_scored = Fangtx_rows.map(function (Fangtx_row) {
    let Fangtx_score = 0;
    Fangtx_keywords.forEach(function (Fangtx_kw) {
      if (Fangtx_row.Fangtx_content.indexOf(Fangtx_kw) !== -1) Fangtx_score += 1;
    });
    return Object.assign({}, Fangtx_row, { Fangtx_score: Fangtx_score });
  });

  Fangtx_scored.sort(function (Fangtx_a, Fangtx_b) { return Fangtx_b.Fangtx_score - Fangtx_a.Fangtx_score; });
  return Fangtx_scored.filter(function (Fangtx_r) { return Fangtx_r.Fangtx_score > 0; }).slice(0, Fangtx_topK || 4);
}

// ============ 基于知识库的问答（RAG） ============
const Fangtx_ask = async (Fangtx_req, Fangtx_res) => {
  const Fangtx_question = (Fangtx_req.body && Fangtx_req.body.question || '').toString().trim();
  if (!Fangtx_question) {
    return Fangtx_res.json({ code: 4001, msg: '请输入问题', data: null });
  }

  let Fangtx_retrieved = [];
  try {
    Fangtx_retrieved = await Fangtx_retrieveChunks(Fangtx_question, 4);
    console.log('[Fangtx][RAG] 问题:', Fangtx_question);
    console.log('[Fangtx][RAG] 检索到相关分块:', Fangtx_retrieved.length, '条');
  } catch (Fangtx_err) {
    console.error('[Fangtx][RAG] 检索失败:', Fangtx_err.message);
    return Fangtx_res.json({ code: 5010, msg: '知识库检索失败: ' + Fangtx_err.message, data: null });
  }

  const Fangtx_context = Fangtx_retrieved
    .map(function (Fangtx_r, Fangtx_i) {
      return '【资料' + (Fangtx_i + 1) + ' · 来源：' + Fangtx_r.Fangtx_filename + '】\n' + Fangtx_r.Fangtx_content;
    })
    .join('\n\n');

  const Fangtx_systemPrompt =
    '你是一个基于知识库的智能客服助手。请严格依据下面提供的知识库资料回答用户问题。' +
    '如果资料中有答案，请准确引用资料内容作答；如果资料中没有相关信息，请如实说明"知识库中未找到相关信息"，不要编造。' +
    '回答要简洁、友好。\n\n知识库资料：\n' + (Fangtx_context || '（暂无相关资料）');

  const Fangtx_payload = {
    model: Fangtx_model,
    messages: [
      { role: 'system', content: Fangtx_systemPrompt },
      { role: 'user', content: Fangtx_question }
    ],
    max_tokens: 1024,
    temperature: 0.5
  };

  // ===== 控制台输出：发送给大模型的数据 =====
  console.log('========== [Fangtx][RAG] 发送给大模型的数据 ==========');
  console.log('请求地址:', Fangtx_apiUrl);
  console.log('请求头:', JSON.stringify({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + (Fangtx_apiKey ? Fangtx_apiKey.slice(0, 6) + '***' + Fangtx_apiKey.slice(-4) : '(未配置)')
  }, null, 2));
  console.log('请求体:', JSON.stringify(Fangtx_payload, null, 2));
  console.log('=======================================================');

  if (!Fangtx_apiKey) {
    return Fangtx_res.json({ code: 5001, msg: '服务端未配置 API Key', data: null });
  }

  try {
    const Fangtx_response = await fetch(Fangtx_apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Fangtx_apiKey },
      body: JSON.stringify(Fangtx_payload)
    });
    const Fangtx_result = await Fangtx_response.json();

    // ===== 控制台输出：从大模型接收到的数据 =====
    console.log('========== [Fangtx][RAG] 从大模型接收到的数据 ==========');
    console.log('HTTP 状态:', Fangtx_response.status);
    console.log('响应体:', JSON.stringify(Fangtx_result, null, 2));
    console.log('=========================================================');

    if (!Fangtx_response.ok) {
      const Fangtx_errorMsg = (Fangtx_result && Fangtx_result.error && Fangtx_result.error.message) ||
        ('大模型接口请求失败（HTTP ' + Fangtx_response.status + '）');
      return Fangtx_res.json({ code: 5002, msg: '大模型请求失败: ' + Fangtx_errorMsg, data: null });
    }

    const Fangtx_choice = Fangtx_result && Fangtx_result.choices && Fangtx_result.choices[0];
    const Fangtx_reply = Fangtx_choice && Fangtx_choice.message && Fangtx_choice.message.content;
    if (!Fangtx_reply) {
      return Fangtx_res.json({ code: 5003, msg: '大模型未返回有效内容', data: null });
    }

    Fangtx_res.json({
      code: 0,
      msg: '知识库问答成功',
      data: {
        reply: Fangtx_reply,
        question: Fangtx_question,
        sources: Fangtx_retrieved.map(function (Fangtx_r) {
          return {
            Fangtx_filename: Fangtx_r.Fangtx_filename,
            Fangtx_chunk_index: Fangtx_r.Fangtx_chunk_index,
            Fangtx_score: Fangtx_r.Fangtx_score,
            Fangtx_content: Fangtx_r.Fangtx_content
          };
        }),
        usage: Fangtx_result.usage || null,
        requestPayload: Fangtx_payload,
        rawResponse: Fangtx_result
      }
    });
  } catch (Fangtx_err) {
    console.error('[Fangtx][RAG] 请求异常:', Fangtx_err.message);
    Fangtx_res.json({ code: 5004, msg: '请求大模型异常: ' + Fangtx_err.message, data: null });
  }
};

module.exports = {
  Fangtx_listFiles,
  Fangtx_uploadFile,
  Fangtx_deleteFile,
  Fangtx_ask
};
