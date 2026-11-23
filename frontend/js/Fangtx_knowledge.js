/*
 * 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
 * 文件：js/Fangtx_knowledge.js
 * 说明：知识库管理页脚本 —— 文件上传、文件列表管理、基于知识库的 RAG 问答。
 *       发送给后端的数据与从后端接收的数据统一输出到浏览器控制台。
 */
(function () {
  'use strict';

  var Fangtx_fileList = document.getElementById('Fangtx_fileList');
  var Fangtx_fileCount = document.getElementById('Fangtx_fileCount');
  var Fangtx_uploadBox = document.getElementById('Fangtx_uploadBox');
  var Fangtx_fileInput = document.getElementById('Fangtx_fileInput');
  var Fangtx_uploadStatus = document.getElementById('Fangtx_uploadStatus');
  var Fangtx_messages = document.getElementById('Fangtx_messages');
  var Fangtx_empty = document.getElementById('Fangtx_empty');
  var Fangtx_form = document.getElementById('Fangtx_form');
  var Fangtx_input = document.getElementById('Fangtx_input');
  var Fangtx_sendBtn = document.getElementById('Fangtx_sendBtn');
  var Fangtx_rawToggle = document.getElementById('Fangtx_rawToggle');
  var Fangtx_rawBox = document.getElementById('Fangtx_rawBox');

  var Fangtx_sending = false;
  var Fangtx_extColors = {
    doc: '#3b7bd8', docx: '#2b5fc0', ppt: '#d8843b',
    pptx: '#c95a2b', pdf: '#d84b4b', txt: '#6b8fa8', md: '#7b5cff'
  };

  function Fangtx_now() {
    var Fangtx_d = new Date();
    return String(Fangtx_d.getHours()).padStart(2, '0') + ':' + String(Fangtx_d.getMinutes()).padStart(2, '0');
  }

  function Fangtx_scrollBottom() { Fangtx_messages.scrollTop = Fangtx_messages.scrollHeight; }

  function Fangtx_formatSize(Fangtx_bytes) {
    var Fangtx_n = Number(Fangtx_bytes || 0);
    return Fangtx_n >= 1024 ? (Fangtx_n / 1024).toFixed(1) + ' KB' : Fangtx_n + ' B';
  }

  // ============ 知识库文件列表 ============
  function Fangtx_loadFiles() {
    fetch(Fangtx_apiUrl('/api/knowledge/files'))
      .then(function (Fangtx_r) { return Fangtx_r.json(); })
      .then(function (Fangtx_data) {
        console.log('[Fangtx] 知识库文件列表:', Fangtx_data);
        if (Fangtx_data.code !== 0) {
          console.error('[Fangtx] 文件列表获取失败:', Fangtx_data.msg);
          Fangtx_fileList.innerHTML = '<div class="Fangtx_loading">加载失败：' + Fangtx_data.msg + '</div>';
          return;
        }
        Fangtx_renderFiles(Fangtx_data.data.list);
      })
      .catch(function (Fangtx_err) {
        console.error('[Fangtx] 文件列表请求失败:', Fangtx_err);
        Fangtx_fileList.innerHTML = '<div class="Fangtx_loading">请求失败</div>';
      });
  }

  function Fangtx_renderFiles(Fangtx_list) {
    Fangtx_fileList.innerHTML = '';
    Fangtx_fileCount.textContent = Fangtx_list.length + ' 个文件';
    if (!Fangtx_list.length) {
      Fangtx_fileList.innerHTML = '<div class="Fangtx_loading">知识库为空，请上传文件</div>';
      return;
    }
    Fangtx_list.forEach(function (Fangtx_file) {
      var Fangtx_item = document.createElement('div');
      Fangtx_item.className = 'Fangtx_fileItem';

      var Fangtx_icon = document.createElement('div');
      Fangtx_icon.className = 'Fangtx_fileIcon';
      Fangtx_icon.textContent = (Fangtx_file.Fangtx_file_type || 'file').toUpperCase().slice(0, 4);
      Fangtx_icon.style.background = 'linear-gradient(135deg, ' +
        (Fangtx_extColors[Fangtx_file.Fangtx_file_type] || '#1772f6') + ', #7b5cff)';

      var Fangtx_info = document.createElement('div');
      Fangtx_info.className = 'Fangtx_fileInfo';
      var Fangtx_name = document.createElement('div');
      Fangtx_name.className = 'Fangtx_fileName';
      Fangtx_name.textContent = Fangtx_file.Fangtx_filename;
      Fangtx_name.title = Fangtx_file.Fangtx_filename;
      var Fangtx_meta = document.createElement('div');
      Fangtx_meta.className = 'Fangtx_fileMeta';
      Fangtx_meta.textContent = Fangtx_file.Fangtx_chunk_count + ' 个分块 · ' +
        Fangtx_formatSize(Fangtx_file.Fangtx_file_size) + ' · ' + Fangtx_file.Fangtx_status;
      Fangtx_info.appendChild(Fangtx_name);
      Fangtx_info.appendChild(Fangtx_meta);

      var Fangtx_del = document.createElement('button');
      Fangtx_del.className = 'Fangtx_fileDelete';
      Fangtx_del.type = 'button';
      Fangtx_del.textContent = '×';
      Fangtx_del.title = '删除该文件';
      Fangtx_del.addEventListener('click', function () {
        if (!window.confirm('确定删除知识库文件「' + Fangtx_file.Fangtx_filename + '」吗？')) return;
        fetch(Fangtx_apiUrl('/api/knowledge/file/' + Fangtx_file.Fangtx_id), { method: 'DELETE' })
          .then(function (Fangtx_r) { return Fangtx_r.json(); })
          .then(function (Fangtx_data) {
            console.log('[Fangtx] 删除文件响应:', Fangtx_data);
            if (Fangtx_data.code === 0) Fangtx_loadFiles();
            else window.alert('删除失败：' + Fangtx_data.msg);
          })
          .catch(function (Fangtx_err) {
            console.error('[Fangtx] 删除请求失败:', Fangtx_err);
            window.alert('删除请求失败');
          });
      });

      Fangtx_item.appendChild(Fangtx_icon);
      Fangtx_item.appendChild(Fangtx_info);
      Fangtx_item.appendChild(Fangtx_del);
      Fangtx_fileList.appendChild(Fangtx_item);
    });
  }

  // ============ 文件上传 ============
  Fangtx_uploadBox.addEventListener('click', function () { Fangtx_fileInput.click(); });
  Fangtx_uploadBox.addEventListener('dragover', function (Fangtx_e) {
    Fangtx_e.preventDefault(); Fangtx_uploadBox.classList.add('Fangtx_dragOver');
  });
  Fangtx_uploadBox.addEventListener('dragleave', function () {
    Fangtx_uploadBox.classList.remove('Fangtx_dragOver');
  });
  Fangtx_uploadBox.addEventListener('drop', function (Fangtx_e) {
    Fangtx_e.preventDefault();
    Fangtx_uploadBox.classList.remove('Fangtx_dragOver');
    if (Fangtx_e.dataTransfer.files.length) Fangtx_uploadFile(Fangtx_e.dataTransfer.files[0]);
  });
  Fangtx_fileInput.addEventListener('change', function () {
    if (Fangtx_fileInput.files.length) Fangtx_uploadFile(Fangtx_fileInput.files[0]);
  });

  function Fangtx_showUploadStatus(Fangtx_ok, Fangtx_msg) {
    Fangtx_uploadStatus.classList.remove('Fangtx_hidden');
    Fangtx_uploadStatus.className = 'Fangtx_uploadStatus ' + (Fangtx_ok ? 'Fangtx_ok' : 'Fangtx_err');
    Fangtx_uploadStatus.textContent = (Fangtx_ok ? '✓ ' : '✕ ') + Fangtx_msg;
  }

  function Fangtx_uploadFile(Fangtx_file) {
    var Fangtx_formData = new FormData();
    Fangtx_formData.append('file', Fangtx_file);
    Fangtx_showUploadStatus(true, '正在上传并解析「' + Fangtx_file.name + '」…');
    console.log('[Fangtx] 上传文件:', Fangtx_file.name, '大小:', Fangtx_file.size);

    fetch(Fangtx_apiUrl('/api/knowledge/upload'), { method: 'POST', body: Fangtx_formData })
      .then(function (Fangtx_r) { return Fangtx_r.json(); })
      .then(function (Fangtx_data) {
        console.log('[Fangtx] 上传响应:', Fangtx_data);
        if (Fangtx_data.code === 0) {
          Fangtx_showUploadStatus(true, '上传成功：' + Fangtx_data.data.Fangtx_filename +
            '，解析出 ' + Fangtx_data.data.Fangtx_chunk_count + ' 个分块');
          Fangtx_loadFiles();
        } else {
          console.error('[Fangtx] 上传失败:', Fangtx_data.msg);
          Fangtx_showUploadStatus(false, '上传失败：' + Fangtx_data.msg);
        }
      })
      .catch(function (Fangtx_err) {
        console.error('[Fangtx] 上传请求失败:', Fangtx_err);
        Fangtx_showUploadStatus(false, '上传请求失败：' + Fangtx_err.message);
      });
  }

  // ============ 消息渲染 ============
  function Fangtx_appendMessage(Fangtx_role, Fangtx_text, Fangtx_isError, Fangtx_sources) {
    if (Fangtx_empty && Fangtx_empty.parentNode) Fangtx_empty.parentNode.removeChild(Fangtx_empty);
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

    if (Fangtx_sources && Fangtx_sources.length) {
      var Fangtx_srcBox = document.createElement('div');
      Fangtx_srcBox.className = 'Fangtx_sources';
      Fangtx_sources.forEach(function (Fangtx_src) {
        var Fangtx_tag = document.createElement('span');
        Fangtx_tag.className = 'Fangtx_sourceTag';
        Fangtx_tag.textContent = '📄 ' + Fangtx_src.Fangtx_filename + ' (#' + Fangtx_src.Fangtx_chunk_index + ')';
        Fangtx_tag.title = Fangtx_src.Fangtx_content;
        Fangtx_srcBox.appendChild(Fangtx_tag);
      });
      Fangtx_bubble.appendChild(Fangtx_srcBox);
    }

    var Fangtx_meta = document.createElement('div');
    Fangtx_meta.className = 'Fangtx_msgMeta';
    Fangtx_meta.textContent = (Fangtx_isUser ? '我' : '知识库助手') + ' · ' + Fangtx_now();
    Fangtx_body.appendChild(Fangtx_bubble);
    Fangtx_body.appendChild(Fangtx_meta);
    Fangtx_row.appendChild(Fangtx_avatar);
    Fangtx_row.appendChild(Fangtx_body);
    Fangtx_messages.appendChild(Fangtx_row);
    Fangtx_scrollBottom();
  }

  function Fangtx_appendThinking() {
    var Fangtx_row = document.createElement('div');
    Fangtx_row.className = 'Fangtx_msgRow Fangtx_msgRowAi';
    var Fangtx_avatar = document.createElement('div');
    Fangtx_avatar.className = 'Fangtx_msgAvatar';
    Fangtx_avatar.textContent = 'AI';
    var Fangtx_thinking = document.createElement('div');
    Fangtx_thinking.className = 'Fangtx_msgThinking';
    Fangtx_thinking.textContent = '正在检索知识库并思考';
    Fangtx_row.appendChild(Fangtx_avatar);
    Fangtx_row.appendChild(Fangtx_thinking);
    Fangtx_messages.appendChild(Fangtx_row);
    Fangtx_scrollBottom();
    return Fangtx_row;
  }

  function Fangtx_renderRaw(Fangtx_payload, Fangtx_response) {
    Fangtx_rawBox.textContent =
      '===== 发送给大模型的数据（请求）=====\n' +
      JSON.stringify(Fangtx_payload, null, 2) +
      '\n\n===== 从大模型接收到的数据（响应）=====\n' +
      JSON.stringify(Fangtx_response, null, 2);
  }

  // ============ RAG 问答 ============
  Fangtx_form.addEventListener('submit', function (Fangtx_e) {
    Fangtx_e.preventDefault();
    if (Fangtx_sending) return;
    var Fangtx_question = Fangtx_input.value.trim();
    if (!Fangtx_question) { console.warn('[Fangtx] 问题为空，未发送'); return; }

    Fangtx_sending = true;
    Fangtx_sendBtn.disabled = true;
    Fangtx_appendMessage('user', Fangtx_question);
    Fangtx_input.value = '';
    Fangtx_input.style.height = 'auto';

    // 浏览器控制台输出：发送给后端的数据
    console.log('========== [Fangtx][RAG] 发送给大模型的数据 ==========');
    console.log('请求地址: /api/knowledge/ask');
    console.log('请求体:', JSON.stringify({ question: Fangtx_question }, null, 2));
    console.log('=======================================================');

    var Fangtx_thinking = Fangtx_appendThinking();

    fetch(Fangtx_apiUrl('/api/knowledge/ask'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: Fangtx_question })
    })
      .then(function (Fangtx_r) { return Fangtx_r.json(); })
      .then(function (Fangtx_data) {
        // 浏览器控制台输出：从后端接收的数据
        console.log('========== [Fangtx][RAG] 从大模型接收到的数据 ==========');
        console.log(JSON.stringify(Fangtx_data, null, 2));
        console.log('=========================================================');

        if (Fangtx_thinking && Fangtx_thinking.parentNode) Fangtx_thinking.parentNode.removeChild(Fangtx_thinking);
        if (Fangtx_data.code === 0) {
          Fangtx_appendMessage('assistant', Fangtx_data.data.reply, false, Fangtx_data.data.sources);
          Fangtx_renderRaw(Fangtx_data.data.requestPayload, Fangtx_data.data.rawResponse);
        } else {
          console.error('[Fangtx] 问答失败:', Fangtx_data.msg);
          Fangtx_appendMessage('assistant', '抱歉，回答失败：' + Fangtx_data.msg, true);
        }
      })
      .catch(function (Fangtx_err) {
        console.error('[Fangtx] 问答请求异常:', Fangtx_err);
        if (Fangtx_thinking && Fangtx_thinking.parentNode) Fangtx_thinking.parentNode.removeChild(Fangtx_thinking);
        Fangtx_appendMessage('assistant', '抱歉，网络请求失败：' + Fangtx_err.message, true);
      })
      .finally(function () {
        Fangtx_sending = false;
        Fangtx_sendBtn.disabled = false;
        Fangtx_input.focus();
      });
  });

  Fangtx_input.addEventListener('keydown', function (Fangtx_e) {
    if (Fangtx_e.key === 'Enter' && !Fangtx_e.shiftKey) {
      Fangtx_e.preventDefault();
      Fangtx_form.dispatchEvent(new Event('submit'));
    }
  });
  Fangtx_input.addEventListener('input', function () {
    Fangtx_input.style.height = 'auto';
    Fangtx_input.style.height = Math.min(Fangtx_input.scrollHeight, 140) + 'px';
  });
  Fangtx_rawToggle.addEventListener('click', function () {
    var Fangtx_expanded = Fangtx_rawToggle.getAttribute('aria-expanded') === 'true';
    Fangtx_rawToggle.setAttribute('aria-expanded', String(!Fangtx_expanded));
    Fangtx_rawBox.hidden = Fangtx_expanded;
  });

  // ============ Canvas 背景动画 ============
  var Fangtx_canvas = document.getElementById('Fangtx_bgCanvas');
  var Fangtx_ctx = Fangtx_canvas.getContext('2d');
  var Fangtx_dpr = Math.min(window.devicePixelRatio || 1, 2);
  var Fangtx_width = 0, Fangtx_height = 0, Fangtx_particles = [], Fangtx_linkDist = 130;

  function Fangtx_resize() {
    Fangtx_width = window.innerWidth; Fangtx_height = window.innerHeight;
    Fangtx_canvas.width = Fangtx_width * Fangtx_dpr; Fangtx_canvas.height = Fangtx_height * Fangtx_dpr;
    Fangtx_canvas.style.width = Fangtx_width + 'px'; Fangtx_canvas.style.height = Fangtx_height + 'px';
    Fangtx_ctx.setTransform(Fangtx_dpr, 0, 0, Fangtx_dpr, 0, 0);
    Fangtx_particles = [];
    var Fangtx_count = Math.max(30, Math.min(Math.floor(Fangtx_width * Fangtx_height / 16000), 90));
    for (var Fangtx_i = 0; Fangtx_i < Fangtx_count; Fangtx_i++) {
      Fangtx_particles.push({
        x: Math.random() * Fangtx_width, y: Math.random() * Fangtx_height,
        vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 1.6 + 0.8
      });
    }
  }

  function Fangtx_draw() {
    Fangtx_ctx.clearRect(0, 0, Fangtx_width, Fangtx_height);
    for (var Fangtx_i = 0; Fangtx_i < Fangtx_particles.length; Fangtx_i++) {
      var Fangtx_p = Fangtx_particles[Fangtx_i];
      Fangtx_p.x += Fangtx_p.vx; Fangtx_p.y += Fangtx_p.vy;
      if (Fangtx_p.x < 0 || Fangtx_p.x > Fangtx_width) Fangtx_p.vx *= -1;
      if (Fangtx_p.y < 0 || Fangtx_p.y > Fangtx_height) Fangtx_p.vy *= -1;
      Fangtx_ctx.beginPath(); Fangtx_ctx.arc(Fangtx_p.x, Fangtx_p.y, Fangtx_p.r, 0, Math.PI * 2);
      Fangtx_ctx.fillStyle = 'rgba(140, 190, 255, 0.8)'; Fangtx_ctx.fill();
      for (var Fangtx_j = Fangtx_i + 1; Fangtx_j < Fangtx_particles.length; Fangtx_j++) {
        var Fangtx_o = Fangtx_particles[Fangtx_j];
        var Fangtx_dx = Fangtx_p.x - Fangtx_o.x, Fangtx_dy = Fangtx_p.y - Fangtx_o.y;
        var Fangtx_dist = Math.sqrt(Fangtx_dx * Fangtx_dx + Fangtx_dy * Fangtx_dy);
        if (Fangtx_dist < Fangtx_linkDist) {
          var Fangtx_alpha = (1 - Fangtx_dist / Fangtx_linkDist) * 0.42;
          Fangtx_ctx.beginPath(); Fangtx_ctx.strokeStyle = 'rgba(106, 168, 255, ' + Fangtx_alpha + ')';
          Fangtx_ctx.lineWidth = 1; Fangtx_ctx.moveTo(Fangtx_p.x, Fangtx_p.y); Fangtx_ctx.lineTo(Fangtx_o.x, Fangtx_o.y);
          Fangtx_ctx.stroke();
        }
      }
    }
    requestAnimationFrame(Fangtx_draw);
  }
  window.addEventListener('resize', Fangtx_resize);
  Fangtx_resize(); Fangtx_draw();
  console.log('[Fangtx] 知识库页 Canvas 背景动画已启动');

  Fangtx_loadFiles();
})();
