/**
 * 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
 * 文件：controllers/Fangtx_chatController.js
 * 说明：AI 聊天控制器，将前端消息转发至硅基流动（SiliconFlow）大模型接口。
 *       服务端控制台完整输出「发送给大模型的数据」与「从大模型接收到的数据」。
 *       API Key 仅从 .env 读取，不写入代码、不返回前端。
 */
require('dotenv').config();

const Fangtx_apiKey = process.env.SILICONFLOW_API_KEY || '';
const Fangtx_apiUrl = process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/chat/completions';
const Fangtx_model = process.env.SILICONFLOW_MODEL || 'deepseek-ai/DeepSeek-V4-Flash';
const Fangtx_systemPrompt = '你是一个有用的助手';

// POST /api/chat —— 与大模型对话
const Fangtx_chat = async (Fangtx_req, Fangtx_res) => {
  const Fangtx_messagesInput = Fangtx_req.body && Fangtx_req.body.messages;
  const Fangtx_inputText = Fangtx_req.body && Fangtx_req.body.message;

  // 兼容两种入参：messages 数组（多轮）或 message 字符串（单轮）
  let Fangtx_messages = [];
  if (Array.isArray(Fangtx_messagesInput) && Fangtx_messagesInput.length > 0) {
    Fangtx_messages = Fangtx_messagesInput
      .filter(function (Fangtx_m) {
        return Fangtx_m && (Fangtx_m.role === 'user' || Fangtx_m.role === 'assistant') &&
          typeof Fangtx_m.content === 'string' && Fangtx_m.content.trim();
      })
      .map(function (Fangtx_m) {
        return { role: Fangtx_m.role, content: Fangtx_m.content.trim() };
      });
  } else if (typeof Fangtx_inputText === 'string' && Fangtx_inputText.trim()) {
    Fangtx_messages = [{ role: 'user', content: Fangtx_inputText.trim() }];
  }

  if (Fangtx_messages.length === 0) {
    console.error('[Fangtx][Chat] 参数校验失败：消息内容为空');
    return Fangtx_res.json({ code: 4001, msg: '请输入消息内容', data: null });
  }

  if (!Fangtx_apiKey) {
    console.error('[Fangtx][Chat] 配置错误：SILICONFLOW_API_KEY 未设置');
    return Fangtx_res.json({ code: 5001, msg: '服务端未配置 API Key', data: null });
  }

  // 构造发送给大模型的完整请求体
  const Fangtx_payload = {
    model: Fangtx_model,
    messages: [
      { role: 'system', content: Fangtx_systemPrompt }
    ].concat(Fangtx_messages),
    max_tokens: 1024,
    temperature: 0.7
  };

  // ===== 控制台输出：发送给大模型的数据 =====
  console.log('========== [Fangtx] 发送给大模型的数据 ==========');
  console.log('请求地址:', Fangtx_apiUrl);
  console.log('请求方法: POST');
  console.log('请求头:', JSON.stringify({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + Fangtx_apiKey.slice(0, 6) + '***' + Fangtx_apiKey.slice(-4)
  }, null, 2));
  console.log('请求体:', JSON.stringify(Fangtx_payload, null, 2));
  console.log('====================================================');

  try {
    const Fangtx_response = await fetch(Fangtx_apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Fangtx_apiKey
      },
      body: JSON.stringify(Fangtx_payload)
    });

    const Fangtx_result = await Fangtx_response.json();

    // ===== 控制台输出：从大模型接收到的数据 =====
    console.log('========== [Fangtx] 从大模型接收到的数据 ==========');
    console.log('HTTP 状态:', Fangtx_response.status);
    console.log('响应体:', JSON.stringify(Fangtx_result, null, 2));
    console.log('======================================================');

    if (!Fangtx_response.ok) {
      const Fangtx_errorMsg = (Fangtx_result && Fangtx_result.error && Fangtx_result.error.message) ||
        ('大模型接口请求失败（HTTP ' + Fangtx_response.status + '）');
      console.error('[Fangtx][Chat] 大模型返回错误:', Fangtx_errorMsg);
      return Fangtx_res.json({ code: 5002, msg: '大模型请求失败: ' + Fangtx_errorMsg, data: null });
    }

    const Fangtx_choice = Fangtx_result && Fangtx_result.choices && Fangtx_result.choices[0];
    const Fangtx_reply = Fangtx_choice && Fangtx_choice.message && Fangtx_choice.message.content;

    if (!Fangtx_reply) {
      console.error('[Fangtx][Chat] 大模型响应中无有效回复内容');
      return Fangtx_res.json({ code: 5003, msg: '大模型未返回有效内容', data: null });
    }

    return Fangtx_res.json({
      code: 0,
      msg: '聊天回复成功',
      data: {
        reply: Fangtx_reply,
        model: Fangtx_result.model || Fangtx_model,
        usage: Fangtx_result.usage || null,
        requestPayload: Fangtx_payload,
        rawResponse: Fangtx_result
      }
    });
  } catch (Fangtx_err) {
    // ===== 控制台输出：请求异常 =====
    console.error('========== [Fangtx] 请求大模型异常 ==========');
    console.error('错误信息:', Fangtx_err.message);
    if (Fangtx_err.cause && Fangtx_err.cause.code) {
      console.error('错误代码:', Fangtx_err.cause.code);
    }
    console.error('==============================================');
    return Fangtx_res.json({
      code: 5004,
      msg: '请求大模型异常: ' + Fangtx_err.message,
      data: null
    });
  }
};

module.exports = { Fangtx_chat };
