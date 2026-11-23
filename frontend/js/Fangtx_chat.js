/*
 * 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
 * 文件：js/Fangtx_chat.js
 * 说明：AI 聊天页脚本 —— 通过 /api/chat 与大模型对话，渲染消息气泡。
 *       发送给后端的数据与从后端接收的数据统一输出到浏览器控制台。
 */
(function () {
  'use strict';

  var Fangtx_apiPath = '/api/chat';
  var Fangtx_messagesEl = document.getElementById('Fangtx_messages');
  var Fangtx_emptyEl = document.getElementById('Fangtx_empty');
  var Fangtx_form = document.getElementById('Fangtx_form');
  var Fangtx_input = document.getElementById('Fangtx_input');
  var Fangtx_sendBtn = document.getElementById('Fangtx_sendBtn');
  var Fangtx_clearBtn = document.getElementById('Fangtx_clearBtn');
  var Fangtx_status = document.getElementById('Fangtx_chatStatus');
  var Fangtx_rawToggle = document.getElementById('Fangtx_rawToggle');
  var Fangtx_rawBox = document.getElementById('Fangtx_rawBox');

  // 多轮对话历史（不含 system，system 由后端注入）
  var Fangtx_history = [];
  var Fangtx_isSending = false;

  // 时间格式化
  function Fangtx_now() {
    var Fangtx_d = new Date();
    return String(Fangtx_d.getHours()).padStart(2, '0') + ':' +
      String(Fangtx_d.getMinutes()).padStart(2, '0');
  }

  // 滚动到底部
  function Fangtx_scrollBottom() {
    Fangtx_messagesEl.scrollTop = Fangtx_messagesEl.scrollHeight;
  }

  // 追加一条消息气泡
  function Fangtx_appendMessage(Fangtx_role, Fangtx_text, Fangtx_isError) {
    if (Fangtx_emptyEl && Fangtx_emptyEl.parentNode) {
      Fangtx_emptyEl.parentNode.removeChild(Fangtx_emptyEl);
    }

    var Fangtx_isUser = Fangtx_role === 'user';
    var Fangtx_row = document.createElement('div');
    Fangtx_row.className = 'Fangtx_msgRow ' + (Fangtx_isUser ? 'Fangtx_msgRowUser' : 'Fangtx_msgRowAi');

    var Fangtx_avatar = document.createElement('div');
    Fangtx_avatar.className = 'Fangtx_msgAvatar';
    Fangtx_avatar.textContent = Fangtx_isUser ? '我' : 'AI';

    var Fangtx_body = document.createElement('div');
    Fangtx_body.className = 'Fangtx_msgBody';

    var Fangtx_bubble = document.createElement('div');
    Fangtx_bubble.className = 'Fangtx_msgBubble' + (Fangtx_isError ? ' Fangtx_msgBubbleError' : '');
    Fangtx_bubble.textContent = Fangtx_text;

    var Fangtx_meta = document.createElement('div');
    Fangtx_meta.className = 'Fangtx_msgMeta';
    Fangtx_meta.textContent = (Fangtx_isUser ? '我' : 'DeepSeek') + ' · ' + Fangtx_now();

    Fangtx_body.appendChild(Fangtx_bubble);
    Fangtx_body.appendChild(Fangtx_meta);
    Fangtx_row.appendChild(Fangtx_avatar);
    Fangtx_row.appendChild(Fangtx_body);
    Fangtx_messagesEl.appendChild(Fangtx_row);
    Fangtx_scrollBottom();
    return Fangtx_bubble;
  }

  // 追加"思考中"占位
  function Fangtx_appendThinking() {
    var Fangtx_row = document.createElement('div');
    Fangtx_row.className = 'Fangtx_msgRow Fangtx_msgRowAi';
    Fangtx_row.id = 'Fangtx_thinkingRow';

    var Fangtx_avatar = document.createElement('div');
    Fangtx_avatar.className = 'Fangtx_msgAvatar';
    Fangtx_avatar.textContent = 'AI';

    var Fangtx_thinking = document.createElement('div');
    Fangtx_thinking.className = 'Fangtx_msgThinking';
    Fangtx_thinking.textContent = '正在思考';

    Fangtx_row.appendChild(Fangtx_avatar);
    Fangtx_row.appendChild(Fangtx_thinking);
    Fangtx_messagesEl.appendChild(Fangtx_row);
    Fangtx_scrollBottom();
    return Fangtx_row;
  }

  // 更新原始数据显示区
  function Fangtx_renderRaw(Fangtx_payload, Fangtx_response) {
    Fangtx_rawBox.textContent =
      '===== 发送给大模型的数据（请求）=====\n' +
      JSON.stringify(Fangtx_payload, null, 2) +
      '\n\n===== 从大模型接收到的数据（响应）=====\n' +
      JSON.stringify(Fangtx_response, null, 2);
  }

  // 发送消息
  function Fangtx_sendMessage() {
    if (Fangtx_isSending) return;

    var Fangtx_text = Fangtx_input.value.trim();
    if (!Fangtx_text) {
      console.warn('[Fangtx] 消息为空，未发送');
      return;
    }

    Fangtx_isSending = true;
    Fangtx_sendBtn.disabled = true;
    Fangtx_status.textContent = '正在回复…';

    Fangtx_appendMessage('user', Fangtx_text);
    Fangtx_input.value = '';
    Fangtx_input.style.height = 'auto';

    // 构造发送给后端的消息历史
    var Fangtx_outgoing = Fangtx_history.concat([{ role: 'user', content: Fangtx_text }]);
    var Fangtx_body = { messages: Fangtx_outgoing };

    // ===== 浏览器控制台输出：发送给后端的数据 =====
    console.log('========== [Fangtx] 发送给大模型的数据（经 /api/chat）==========');
    console.log('请求地址:', Fangtx_apiPath);
    console.log('请求方法: POST');
    console.log('请求体:', JSON.stringify(Fangtx_body, null, 2));
    console.log('====================================================================');

    var Fangtx_thinking = Fangtx_appendThinking();

    fetch(Fangtx_apiPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Fangtx_body)
    })
      .then(function (Fangtx_response) {
        return Fangtx_response.json();
      })
      .then(function (Fangtx_data) {
        // ===== 浏览器控制台输出：从后端接收的数据 =====
        console.log('========== [Fangtx] 从大模型接收到的数据（经 /api/chat）==========');
        console.log(JSON.stringify(Fangtx_data, null, 2));
        console.log('======================================================================');

        if (Fangtx_thinking && Fangtx_thinking.parentNode) {
          Fangtx_thinking.parentNode.removeChild(Fangtx_thinking);
        }

        if (Fangtx_data.code === 0) {
          var Fangtx_reply = Fangtx_data.data.reply;
          Fangtx_appendMessage('assistant', Fangtx_reply);

          // 更新对话历史（保留最近 20 条，避免请求体过大）
          Fangtx_history = Fangtx_outgoing.concat([{ role: 'assistant', content: Fangtx_reply }]);
          if (Fangtx_history.length > 20) Fangtx_history = Fangtx_history.slice(-20);

          Fangtx_renderRaw(Fangtx_data.data.requestPayload, Fangtx_data.data.rawResponse);
          Fangtx_status.textContent = '在线 · 已回复（' + Fangtx_now() + '）';
        } else {
          console.error('[Fangtx] 服务器返回错误:', Fangtx_data.msg);
          Fangtx_appendMessage('assistant', '抱歉，请求失败：' + Fangtx_data.msg, true);
          Fangtx_status.textContent = '在线 · 请求失败';
        }
      })
      .catch(function (Fangtx_error) {
        console.error('========== [Fangtx] 请求异常 ==========');
        console.error(Fangtx_error);

        if (Fangtx_thinking && Fangtx_thinking.parentNode) {
          Fangtx_thinking.parentNode.removeChild(Fangtx_thinking);
        }
        Fangtx_appendMessage('assistant', '抱歉，网络请求失败：' + Fangtx_error.message, true);
        Fangtx_status.textContent = '在线 · 网络异常';
      })
      .finally(function () {
        Fangtx_isSending = false;
        Fangtx_sendBtn.disabled = false;
        Fangtx_input.focus();
      });
  }

  // 事件绑定
  Fangtx_form.addEventListener('submit', function (Fangtx_event) {
    Fangtx_event.preventDefault();
    Fangtx_sendMessage();
  });

  Fangtx_input.addEventListener('keydown', function (Fangtx_event) {
    if (Fangtx_event.key === 'Enter' && !Fangtx_event.shiftKey) {
      Fangtx_event.preventDefault();
      Fangtx_sendMessage();
    }
  });

  Fangtx_input.addEventListener('input', function () {
    Fangtx_input.style.height = 'auto';
    Fangtx_input.style.height = Math.min(Fangtx_input.scrollHeight, 140) + 'px';
  });

  Fangtx_clearBtn.addEventListener('click', function () {
    Fangtx_history = [];
    Fangtx_messagesEl.innerHTML = '';
    var Fangtx_empty = document.createElement('div');
    Fangtx_empty.className = 'Fangtx_empty';
    Fangtx_empty.innerHTML = '<div class="Fangtx_emptyIcon">✦</div><p>开始一段对话吧</p><span>试试问：「你好，请介绍一下你自己」</span>';
    Fangtx_messagesEl.appendChild(Fangtx_empty);
    Fangtx_emptyEl = Fangtx_empty;
    Fangtx_rawBox.textContent = '';
    Fangtx_status.textContent = '在线 · 等待你的消息';
    console.log('[Fangtx] 对话已清空');
  });

  Fangtx_rawToggle.addEventListener('click', function () {
    var Fangtx_expanded = Fangtx_rawToggle.getAttribute('aria-expanded') === 'true';
    Fangtx_rawToggle.setAttribute('aria-expanded', String(!Fangtx_expanded));
    Fangtx_rawBox.hidden = Fangtx_expanded;
  });

  // Canvas 背景动画
  var Fangtx_canvas = document.getElementById('Fangtx_bgCanvas');
  var Fangtx_ctx = Fangtx_canvas.getContext('2d');
  var Fangtx_dpr = Math.min(window.devicePixelRatio || 1, 2);
  var Fangtx_width = 0;
  var Fangtx_height = 0;
  var Fangtx_particles = [];
  var Fangtx_linkDist = 130;

  function Fangtx_particleCount() {
    var Fangtx_base = Math.floor((Fangtx_width * Fangtx_height) / 16000);
    return Math.max(30, Math.min(Fangtx_base, 90));
  }

  function Fangtx_resize() {
    Fangtx_width = window.innerWidth;
    Fangtx_height = window.innerHeight;
    Fangtx_canvas.width = Fangtx_width * Fangtx_dpr;
    Fangtx_canvas.height = Fangtx_height * Fangtx_dpr;
    Fangtx_canvas.style.width = Fangtx_width + 'px';
    Fangtx_canvas.style.height = Fangtx_height + 'px';
    Fangtx_ctx.setTransform(Fangtx_dpr, 0, 0, Fangtx_dpr, 0, 0);
    Fangtx_createParticles();
  }

  function Fangtx_createParticles() {
    Fangtx_particles = [];
    var Fangtx_count = Fangtx_particleCount();
    for (var Fangtx_i = 0; Fangtx_i < Fangtx_count; Fangtx_i++) {
      Fangtx_particles.push({
        x: Math.random() * Fangtx_width,
        y: Math.random() * Fangtx_height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 1.6 + 0.8
      });
    }
  }

  function Fangtx_draw() {
    Fangtx_ctx.clearRect(0, 0, Fangtx_width, Fangtx_height);
    for (var Fangtx_i = 0; Fangtx_i < Fangtx_particles.length; Fangtx_i++) {
      var Fangtx_particle = Fangtx_particles[Fangtx_i];
      Fangtx_particle.x += Fangtx_particle.vx;
      Fangtx_particle.y += Fangtx_particle.vy;
      if (Fangtx_particle.x < 0 || Fangtx_particle.x > Fangtx_width) Fangtx_particle.vx *= -1;
      if (Fangtx_particle.y < 0 || Fangtx_particle.y > Fangtx_height) Fangtx_particle.vy *= -1;

      Fangtx_ctx.beginPath();
      Fangtx_ctx.arc(Fangtx_particle.x, Fangtx_particle.y, Fangtx_particle.r, 0, Math.PI * 2);
      Fangtx_ctx.fillStyle = 'rgba(140, 190, 255, 0.8)';
      Fangtx_ctx.fill();

      for (var Fangtx_j = Fangtx_i + 1; Fangtx_j < Fangtx_particles.length; Fangtx_j++) {
        var Fangtx_other = Fangtx_particles[Fangtx_j];
        var Fangtx_dx = Fangtx_particle.x - Fangtx_other.x;
        var Fangtx_dy = Fangtx_particle.y - Fangtx_other.y;
        var Fangtx_dist = Math.sqrt(Fangtx_dx * Fangtx_dx + Fangtx_dy * Fangtx_dy);
        if (Fangtx_dist < Fangtx_linkDist) {
          var Fangtx_alpha = (1 - Fangtx_dist / Fangtx_linkDist) * 0.42;
          Fangtx_ctx.beginPath();
          Fangtx_ctx.strokeStyle = 'rgba(106, 168, 255, ' + Fangtx_alpha + ')';
          Fangtx_ctx.lineWidth = 1;
          Fangtx_ctx.moveTo(Fangtx_particle.x, Fangtx_particle.y);
          Fangtx_ctx.lineTo(Fangtx_other.x, Fangtx_other.y);
          Fangtx_ctx.stroke();
        }
      }
    }
    requestAnimationFrame(Fangtx_draw);
  }

  window.addEventListener('resize', Fangtx_resize);
  Fangtx_resize();
  Fangtx_draw();
  console.log('[Fangtx] AI 聊天页 Canvas 背景动画已启动');
  Fangtx_input.focus();
})();
