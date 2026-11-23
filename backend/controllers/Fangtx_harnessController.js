/**
 * 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-23 | 大模型：Tencent Hunyuan Hy
 * 文件：controllers/Fangtx_harnessController.js
 * 说明：Harness Engineering 结构化抽取控制器。通过受约束 Prompt + JSON 模式调用硅基流动 LLM，
 *       将商业评论文本或图片 OCR 结果转换为统一设计的 JSON 结构（情感分类、方面情感、实体抽取等）。
 *       服务端控制台完整打印「发送给大模型的数据」与「从大模型接收到的数据」。
 */
require('dotenv').config();

const Fangtx_apiKey = process.env.SILICONFLOW_API_KEY || '';
const Fangtx_apiUrl = process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/chat/completions';
const Fangtx_textModel = process.env.SILICONFLOW_MODEL || 'deepseek-ai/DeepSeek-V4-Flash';
const Fangtx_visionModel = process.env.SILICONFLOW_VISION_MODEL || 'Qwen/Qwen2.5-VL-72B-Instruct';
const Fangtx_promptVersion = 'Fangtx_harness_v1';
const Fangtx_maxImageBytes = 4 * 1024 * 1024;

const Fangtx_allowedSentiments = ['positive', 'negative', 'neutral', 'mixed'];
const Fangtx_allowedIntents = ['praise', 'complaint', 'suggestion', 'question', 'other'];
const Fangtx_allowedEntityTypes = ['人物', '品牌', '产品', '地点', '其他'];

// 统一输出结构（用于 Prompt 约束与服务端兜底）
const Fangtx_outputSchema = {
  task: 'text_extract | image_ocr',
  source: '原始文本或图片文件名',
  schemaVersion: 'Fangtx_harness_v1',
  result: {
    overall: {
      sentiment: 'positive | negative | neutral | mixed',
      score: '0~1 数值，越大越正面',
      confidence: '0~1 数值',
      summary: '一句话整体评价'
    },
    aspects: [
      { target: '方面名称', category: '分类', sentiment: 'positive|negative|neutral|mixed', score: '0~1', evidence: '必须引用原文片段' }
    ],
    entities: [
      { name: '实体名称', type: '人物|品牌|产品|地点|其他', sentiment: 'positive|negative|neutral|mixed', mentions: '出现次数，整数' }
    ],
    keywords: ['关键词数组，最多 8 个'],
    intent: 'praise | complaint | suggestion | question | other',
    suggestions: ['可执行建议，最多 3 条']
  },
  ocr: { text: '图片中识别出的完整文字', language: 'zh-CN', image: { fileName: '文件名', mimeType: 'MIME 类型', size: '字节数' } },
  meta: { model: '模型名', promptVersion: 'Fangtx_harness_v1', createdAt: 'ISO 时间', usage: 'token 用量', rawResponse: '原始响应' }
};

function Fangtx_buildSystemPrompt(Fangtx_mode) {
  const Fangtx_modeText = Fangtx_mode === 'image_ocr'
    ? '输入是一张图片。请先做 OCR 逐字识别，把识别出的完整文字放入 ocr.text，再基于该文字完成情感与实体抽取；不得编造图片中不存在的内容。'
    : '输入是一段商业评论文本，请直接从文本中抽取信息；aspects[].evidence 必须逐字引用原文片段，不得编造。';

  return '你是一个严格的信息抽取引擎，只输出 JSON，不输出任何解释、Markdown 或额外文字。\n' +
    Fangtx_modeText + '\n' +
    '任务：完成整体情感分类（sentiment/score/confidence/summary）、方面情感抽取（aspects）、' +
    '实体抽取（entities）、关键词（keywords）、用户意图（intent）与建议（suggestions）。\n' +
    '字段规则：\n' +
    '- sentiment 只能是 positive、negative、neutral、mixed 之一；score 和 confidence 为 0~1 的数字。\n' +
    '- intent 只能是 praise、complaint、suggestion、question、other 之一。\n' +
    '- entities[].type 只能是 人物、品牌、产品、地点、其他 之一；mentions 为整数。\n' +
    '- aspects 最多 8 条，entities 最多 10 条，keywords 最多 8 条，suggestions 最多 3 条。\n' +
    '- 你返回的 JSON 必须只包含 result 对象（键名为 overall/aspects/entities/keywords/intent/suggestions），' +
    '不要返回 task/source/schemaVersion/ocr/meta，这些字段由服务端补齐。\n' +
    '输出 JSON 结构示例：' + JSON.stringify(Fangtx_outputSchema.result) + '\n' +
    '再次强调：回复必须是可被 JSON.parse 直接解析的单个 JSON 对象，不要包裹 ```json```。';
}

// 从模型文本中提取严格 JSON
function Fangtx_parseJson(Fangtx_text) {
  if (!Fangtx_text || typeof Fangtx_text !== 'string') {
    throw new Error('大模型未返回文本内容');
  }

  let Fangtx_candidate = Fangtx_text.trim();
  try {
    return JSON.parse(Fangtx_candidate);
  } catch (Fangtx_e) {
    // 兼容模型偶发输出 Markdown 代码块的情况
    const Fangtx_fence = Fangtx_candidate.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (Fangtx_fence) Fangtx_candidate = Fangtx_fence[1].trim();
    const Fangtx_start = Fangtx_candidate.indexOf('{');
    const Fangtx_end = Fangtx_candidate.lastIndexOf('}');
    if (Fangtx_start !== -1 && Fangtx_end > Fangtx_start) {
      Fangtx_candidate = Fangtx_candidate.slice(Fangtx_start, Fangtx_end + 1);
    }
    return JSON.parse(Fangtx_candidate);
  }
}

function Fangtx_clampScore(Fangtx_value, Fangtx_fallback) {
  const Fangtx_num = Number(Fangtx_value);
  if (!Number.isFinite(Fangtx_num)) return Fangtx_fallback;
  return Math.max(0, Math.min(1, Fangtx_num));
}

function Fangtx_toStringArray(Fangtx_value, Fangtx_limit) {
  if (!Array.isArray(Fangtx_value)) return [];
  return Fangtx_value
    .filter(function (Fangtx_item) { return typeof Fangtx_item === 'string' && Fangtx_item.trim(); })
    .map(function (Fangtx_item) { return Fangtx_item.trim().slice(0, 120); })
    .slice(0, Fangtx_limit);
}

function Fangtx_pickSentiment(Fangtx_value) {
  return Fangtx_allowedSentiments.indexOf(Fangtx_value) !== -1 ? Fangtx_value : 'neutral';
}

// 服务端兜底归一化，保证返回 JSON 永远符合设计结构
function Fangtx_normalize(Fangtx_parsed, Fangtx_task, Fangtx_source, Fangtx_ocr, Fangtx_meta) {
  const Fangtx_raw = Fangtx_parsed && typeof Fangtx_parsed === 'object' ? Fangtx_parsed : {};
  const Fangtx_resultRaw = Fangtx_raw.result && typeof Fangtx_raw.result === 'object' ? Fangtx_raw.result : Fangtx_raw;
  const Fangtx_overallRaw = Fangtx_resultRaw.overall && typeof Fangtx_resultRaw.overall === 'object' ? Fangtx_resultRaw.overall : {};

  const Fangtx_overall = {
    sentiment: Fangtx_pickSentiment(Fangtx_overallRaw.sentiment),
    score: Fangtx_clampScore(Fangtx_overallRaw.score, 0.5),
    confidence: Fangtx_clampScore(Fangtx_overallRaw.confidence, 0.7),
    summary: String(Fangtx_overallRaw.summary || '').trim().slice(0, 300)
  };

  const Fangtx_aspects = (Array.isArray(Fangtx_resultRaw.aspects) ? Fangtx_resultRaw.aspects : [])
    .filter(function (Fangtx_item) { return Fangtx_item && typeof Fangtx_item === 'object'; })
    .slice(0, 8)
    .map(function (Fangtx_item) {
      return {
        target: String(Fangtx_item.target || '').trim().slice(0, 60),
        category: String(Fangtx_item.category || '其他').trim().slice(0, 40),
        sentiment: Fangtx_pickSentiment(Fangtx_item.sentiment),
        score: Fangtx_clampScore(Fangtx_item.score, 0.5),
        evidence: String(Fangtx_item.evidence || '').trim().slice(0, 200)
      };
    });

  const Fangtx_entities = (Array.isArray(Fangtx_resultRaw.entities) ? Fangtx_resultRaw.entities : [])
    .filter(function (Fangtx_item) { return Fangtx_item && typeof Fangtx_item === 'object'; })
    .slice(0, 10)
    .map(function (Fangtx_item) {
      return {
        name: String(Fangtx_item.name || '').trim().slice(0, 60),
        type: Fangtx_allowedEntityTypes.indexOf(Fangtx_item.type) !== -1 ? Fangtx_item.type : '其他',
        sentiment: Fangtx_pickSentiment(Fangtx_item.sentiment),
        mentions: Math.max(1, parseInt(Fangtx_item.mentions, 10) || 1)
      };
    })
    .filter(function (Fangtx_item) { return Fangtx_item.name; });

  const Fangtx_result = {
    overall: Fangtx_overall,
    aspects: Fangtx_aspects,
    entities: Fangtx_entities,
    keywords: Fangtx_toStringArray(Fangtx_resultRaw.keywords, 8),
    intent: Fangtx_allowedIntents.indexOf(Fangtx_resultRaw.intent) !== -1 ? Fangtx_resultRaw.intent : 'other',
    suggestions: Fangtx_toStringArray(Fangtx_resultRaw.suggestions, 3)
  };

  return {
    task: Fangtx_task,
    source: Fangtx_source,
    schemaVersion: Fangtx_promptVersion,
    result: Fangtx_result,
    ocr: Fangtx_ocr || null,
    meta: {
      model: Fangtx_meta.model,
      promptVersion: Fangtx_promptVersion,
      createdAt: new Date().toISOString(),
      usage: Fangtx_meta.usage || null,
      rawResponse: Fangtx_meta.rawResponse || null
    }
  };
}

// 调用硅基流动 LLM，返回解析后的对象与原始响应信息
async function Fangtx_callLLM(Fangtx_messages, Fangtx_model) {
  const Fangtx_payload = {
    model: Fangtx_model,
    messages: Fangtx_messages,
    temperature: 0.1,
    max_tokens: 2048,
    response_format: { type: 'json_object' }
  };

  console.log('========== [Fangtx][Harness] 发送给大模型的数据 ==========');
  console.log('请求地址:', Fangtx_apiUrl);
  console.log('请求方法: POST');
  console.log('请求头:', JSON.stringify({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + Fangtx_apiKey.slice(0, 6) + '***' + Fangtx_apiKey.slice(-4)
  }, null, 2));
  console.log('请求体:', JSON.stringify(Fangtx_payload, null, 2));
  console.log('==========================================================');

  const Fangtx_response = await fetch(Fangtx_apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + Fangtx_apiKey
    },
    body: JSON.stringify(Fangtx_payload)
  });

  const Fangtx_result = await Fangtx_response.json();

  console.log('========== [Fangtx][Harness] 从大模型接收到的数据 ==========');
  console.log('HTTP 状态:', Fangtx_response.status);
  console.log('响应体:', JSON.stringify(Fangtx_result, null, 2));
  console.log('============================================================');

  if (!Fangtx_response.ok) {
    const Fangtx_errorMsg = (Fangtx_result && Fangtx_result.error && Fangtx_result.error.message) ||
      ('大模型接口请求失败（HTTP ' + Fangtx_response.status + '）');
    const Fangtx_error = new Error(Fangtx_errorMsg);
    Fangtx_error.Fangtx_code = 5002;
    throw Fangtx_error;
  }

  const Fangtx_content = Fangtx_result && Fangtx_result.choices && Fangtx_result.choices[0] &&
    Fangtx_result.choices[0].message && Fangtx_result.choices[0].message.content;

  if (!Fangtx_content) {
    const Fangtx_error = new Error('大模型未返回有效内容');
    Fangtx_error.Fangtx_code = 5003;
    throw Fangtx_error;
  }

  return {
    parsed: Fangtx_parseJson(Fangtx_content),
    meta: {
      model: Fangtx_result.model || Fangtx_model,
      usage: Fangtx_result.usage || null,
      rawResponse: Fangtx_result
    }
  };
}

// POST /api/harness/extract —— 商业评论文本 → 结构化 JSON
const Fangtx_extract = async function Fangtx_extract(Fangtx_req, Fangtx_res) {
  const Fangtx_text = Fangtx_req.body && typeof Fangtx_req.body.text === 'string' ? Fangtx_req.body.text.trim() : '';

  console.log('========== [Fangtx][Harness] 收到文本抽取请求 ==========');
  console.log(JSON.stringify(Fangtx_req.body || {}, null, 2));
  console.log('========================================================');

  if (!Fangtx_text) {
    console.error('[Fangtx][Harness] 参数校验失败：评论文本为空');
    return Fangtx_res.json({ code: 4001, msg: '请输入评论文本', data: null });
  }
  if (Fangtx_text.length > 4000) {
    return Fangtx_res.json({ code: 4002, msg: '评论文本不能超过 4000 字', data: null });
  }
  if (!Fangtx_apiKey) {
    console.error('[Fangtx][Harness] 配置错误：SILICONFLOW_API_KEY 未设置');
    return Fangtx_res.json({ code: 5001, msg: '服务端未配置 API Key', data: null });
  }

  try {
    const Fangtx_messages = [
      { role: 'system', content: Fangtx_buildSystemPrompt('text_extract') },
      { role: 'user', content: '请抽取以下商业评论：\n' + Fangtx_text }
    ];
    const Fangtx_llm = await Fangtx_callLLM(Fangtx_messages, Fangtx_textModel);
    const Fangtx_data = Fangtx_normalize(Fangtx_llm.parsed, 'text_extract', Fangtx_text, null, Fangtx_llm.meta);
    return Fangtx_res.json({ code: 0, msg: '结构化抽取成功', data: Fangtx_data });
  } catch (Fangtx_err) {
    console.error('[Fangtx][Harness] 文本抽取异常:', Fangtx_err.message);
    return Fangtx_res.json({
      code: Fangtx_err.Fangtx_code || 5004,
      msg: '结构化抽取失败: ' + Fangtx_err.message,
      data: null
    });
  }
};

// POST /api/harness/ocr —— 图片 OCR/识别 → 结构化 JSON
const Fangtx_ocr = async function Fangtx_ocr(Fangtx_req, Fangtx_res) {
  const Fangtx_image = Fangtx_req.body && typeof Fangtx_req.body.image === 'string' ? Fangtx_req.body.image : '';
  const Fangtx_fileName = String(Fangtx_req.body && Fangtx_req.body.fileName ? Fangtx_req.body.fileName : 'upload.png').slice(0, 120);
  const Fangtx_mimeType = String(Fangtx_req.body && Fangtx_req.body.mimeType ? Fangtx_req.body.mimeType : 'image/png').slice(0, 60);
  const Fangtx_size = parseInt(Fangtx_req.body && Fangtx_req.body.size, 10) || 0;

  console.log('========== [Fangtx][Harness] 收到图片识别请求 ==========');
  console.log(JSON.stringify({
    fileName: Fangtx_fileName,
    mimeType: Fangtx_mimeType,
    size: Fangtx_size,
    imagePrefix: Fangtx_image.slice(0, 40)
  }, null, 2));
  console.log('========================================================');

  if (!/^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(Fangtx_image)) {
    console.error('[Fangtx][Harness] 参数校验失败：图片格式不正确');
    return Fangtx_res.json({ code: 4001, msg: '请上传 PNG/JPEG/WebP/GIF 格式的图片', data: null });
  }
  if (Fangtx_image.length > Fangtx_maxImageBytes * 1.4) {
    return Fangtx_res.json({ code: 4002, msg: '图片不能超过 4MB', data: null });
  }
  if (!Fangtx_apiKey) {
    return Fangtx_res.json({ code: 5001, msg: '服务端未配置 API Key', data: null });
  }

  try {
    const Fangtx_messages = [
      { role: 'system', content: Fangtx_buildSystemPrompt('image_ocr') },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: Fangtx_image, detail: 'high' }
          },
          {
            type: 'text',
            text: '请先 OCR 识别图片中的全部文字，再做情感与实体抽取。只返回包含 result 对象的 JSON。'
          }
        ]
      }
    ];
    const Fangtx_llm = await Fangtx_callLLM(Fangtx_messages, Fangtx_visionModel);
    const Fangtx_ocrInfo = {
      text: String(Fangtx_llm.parsed.ocr && Fangtx_llm.parsed.ocr.text ||
        Fangtx_llm.parsed.text || '').trim().slice(0, 4000),
      language: String(Fangtx_llm.parsed.ocr && Fangtx_llm.parsed.ocr.language || 'zh-CN').slice(0, 20),
      image: { fileName: Fangtx_fileName, mimeType: Fangtx_mimeType, size: Fangtx_size }
    };
    const Fangtx_source = Fangtx_ocrInfo.text || Fangtx_fileName;
    const Fangtx_data = Fangtx_normalize(Fangtx_llm.parsed, 'image_ocr', Fangtx_source, Fangtx_ocrInfo, Fangtx_llm.meta);
    return Fangtx_res.json({ code: 0, msg: '图片识别与结构化抽取成功', data: Fangtx_data });
  } catch (Fangtx_err) {
    console.error('[Fangtx][Harness] 图片识别异常:', Fangtx_err.message);
    return Fangtx_res.json({
      code: Fangtx_err.Fangtx_code || 5004,
      msg: '图片识别失败: ' + Fangtx_err.message,
      data: null
    });
  }
};

module.exports = {
  Fangtx_extract: Fangtx_extract,
  Fangtx_ocr: Fangtx_ocr,
  Fangtx_outputSchema: Fangtx_outputSchema
};
