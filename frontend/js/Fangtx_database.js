/*
 * 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 * 文件：js/Fangtx_database.js
 * 说明：数据库连接测试页脚本 —— Canvas 背景动画 + 表单提交（纯原生 JavaScript）。
 *       服务器返回的数据与错误信息统一输出到浏览器控制台。
 */
(function () {
  'use strict';

  /* ---------- Canvas 背景动画 ---------- */
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
  console.log('[Fangtx] 数据库连接页 Canvas 背景动画已启动');

  /* ---------- 表单提交与结果提示 ---------- */
  var Fangtx_form = document.getElementById('Fangtx_dbForm');
  var Fangtx_username = document.getElementById('Fangtx_username');
  var Fangtx_password = document.getElementById('Fangtx_password');
  var Fangtx_submitBtn = document.getElementById('Fangtx_submitBtn');
  var Fangtx_result = document.getElementById('Fangtx_result');
  var Fangtx_infoBox = document.getElementById('Fangtx_infoBox');
  var Fangtx_infoList = document.getElementById('Fangtx_infoList');

  // 显示结果提示（成功 / 错误）
  function Fangtx_showResult(Fangtx_isOk, Fangtx_message) {
    Fangtx_result.className = 'Fangtx_result ' + (Fangtx_isOk ? 'Fangtx_resultIsOk' : 'Fangtx_resultIsError');
    Fangtx_result.textContent = (Fangtx_isOk ? '✓ ' : '✕ ') + Fangtx_message;
  }

  // 渲染连接信息
  function Fangtx_renderInfo(Fangtx_data) {
    var Fangtx_fields = [
      ['主机', Fangtx_data.host],
      ['用户名', Fangtx_data.user],
      ['数据库', Fangtx_data.database],
      ['MySQL 版本', Fangtx_data.mysqlVersion],
      ['连接时间', Fangtx_data.time]
    ];
    Fangtx_infoList.innerHTML = '';
    for (var Fangtx_i = 0; Fangtx_i < Fangtx_fields.length; Fangtx_i++) {
      var Fangtx_item = document.createElement('div');
      Fangtx_item.className = 'Fangtx_infoItem';
      var Fangtx_dt = document.createElement('dt');
      Fangtx_dt.textContent = Fangtx_fields[Fangtx_i][0];
      var Fangtx_dd = document.createElement('dd');
      Fangtx_dd.textContent = Fangtx_fields[Fangtx_i][1] || '-';
      Fangtx_item.appendChild(Fangtx_dt);
      Fangtx_item.appendChild(Fangtx_dd);
      Fangtx_infoList.appendChild(Fangtx_item);
    }
    Fangtx_infoBox.className = 'Fangtx_infoBox';
  }

  Fangtx_form.addEventListener('submit', function (Fangtx_event) {
    Fangtx_event.preventDefault();

    var Fangtx_name = Fangtx_username.value.trim();
    var Fangtx_pass = Fangtx_password.value;

    if (!Fangtx_name || !Fangtx_pass) {
      Fangtx_showResult(false, '请先输入用户名和密码');
      console.error('[Fangtx] 表单校验失败：用户名或密码为空');
      Fangtx_infoBox.className = 'Fangtx_infoBox Fangtx_infoHidden';
      return;
    }

    Fangtx_submitBtn.disabled = true;
    Fangtx_result.className = 'Fangtx_result Fangtx_resultHidden';
    Fangtx_infoBox.className = 'Fangtx_infoBox Fangtx_infoHidden';

    fetch('/api/db/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: Fangtx_name, password: Fangtx_pass })
    })
      .then(function (Fangtx_response) {
        return Fangtx_response.json();
      })
      .then(function (Fangtx_resultData) {
        console.log('[Fangtx] 服务器返回数据:', Fangtx_resultData);
        if (Fangtx_resultData.code === 0) {
          Fangtx_showResult(true, Fangtx_resultData.msg);
          Fangtx_renderInfo(Fangtx_resultData.data);
        } else {
          console.error('[Fangtx] 服务器返回错误:', Fangtx_resultData.msg);
          Fangtx_showResult(false, Fangtx_resultData.msg);
        }
      })
      .catch(function (Fangtx_error) {
        console.error('[Fangtx] 请求失败:', Fangtx_error);
        Fangtx_showResult(false, '请求失败：' + Fangtx_error.message);
      })
      .finally(function () {
        Fangtx_submitBtn.disabled = false;
      });
  });
})();
