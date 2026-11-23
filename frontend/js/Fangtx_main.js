/*
 * 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 * 文件：js/Fangtx_main.js
 * 说明：首页 Canvas 粒子背景动画 + 页面计数 + 后端健康检查（纯原生 JavaScript）。
 */
(function () {
  'use strict';

  var Fangtx_canvas = document.getElementById('Fangtx_bgCanvas');
  var Fangtx_ctx = Fangtx_canvas.getContext('2d');
  var Fangtx_dpr = Math.min(window.devicePixelRatio || 1, 2);
  var Fangtx_width = 0;
  var Fangtx_height = 0;
  var Fangtx_particles = [];
  var Fangtx_linkDist = 130;
  var Fangtx_mouse = { x: null, y: null, radius: 150 };

  // 粒子数量随屏幕面积自适应
  function Fangtx_particleCount() {
    var Fangtx_base = Math.floor((Fangtx_width * Fangtx_height) / 14000);
    return Math.max(40, Math.min(Fangtx_base, 140));
  }

  // 初始化画布尺寸
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

  // 生成粒子
  function Fangtx_createParticles() {
    Fangtx_particles = [];
    var Fangtx_count = Fangtx_particleCount();
    for (var Fangtx_index = 0; Fangtx_index < Fangtx_count; Fangtx_index++) {
      Fangtx_particles.push({
        x: Math.random() * Fangtx_width,
        y: Math.random() * Fangtx_height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 1.8 + 0.8
      });
    }
  }

  // 绘制一帧粒子与连线
  function Fangtx_draw() {
    Fangtx_ctx.clearRect(0, 0, Fangtx_width, Fangtx_height);

    for (var Fangtx_i = 0; Fangtx_i < Fangtx_particles.length; Fangtx_i++) {
      var Fangtx_particle = Fangtx_particles[Fangtx_i];

      Fangtx_particle.x += Fangtx_particle.vx;
      Fangtx_particle.y += Fangtx_particle.vy;

      // 边界反弹
      if (Fangtx_particle.x < 0 || Fangtx_particle.x > Fangtx_width) Fangtx_particle.vx *= -1;
      if (Fangtx_particle.y < 0 || Fangtx_particle.y > Fangtx_height) Fangtx_particle.vy *= -1;

      // 鼠标排斥交互
      if (Fangtx_mouse.x !== null) {
        var Fangtx_mouseDx = Fangtx_particle.x - Fangtx_mouse.x;
        var Fangtx_mouseDy = Fangtx_particle.y - Fangtx_mouse.y;
        var Fangtx_mouseDist = Math.sqrt(Fangtx_mouseDx * Fangtx_mouseDx + Fangtx_mouseDy * Fangtx_mouseDy);
        if (Fangtx_mouseDist < Fangtx_mouse.radius && Fangtx_mouseDist > 0) {
          var Fangtx_force = (Fangtx_mouse.radius - Fangtx_mouseDist) / Fangtx_mouse.radius;
          Fangtx_particle.x += (Fangtx_mouseDx / Fangtx_mouseDist) * Fangtx_force * 2.2;
          Fangtx_particle.y += (Fangtx_mouseDy / Fangtx_mouseDist) * Fangtx_force * 2.2;
        }
      }

      // 绘制粒子
      Fangtx_ctx.beginPath();
      Fangtx_ctx.arc(Fangtx_particle.x, Fangtx_particle.y, Fangtx_particle.r, 0, Math.PI * 2);
      Fangtx_ctx.fillStyle = 'rgba(140, 190, 255, 0.85)';
      Fangtx_ctx.fill();

      // 近距离粒子连线
      for (var Fangtx_j = Fangtx_i + 1; Fangtx_j < Fangtx_particles.length; Fangtx_j++) {
        var Fangtx_other = Fangtx_particles[Fangtx_j];
        var Fangtx_dx = Fangtx_particle.x - Fangtx_other.x;
        var Fangtx_dy = Fangtx_particle.y - Fangtx_other.y;
        var Fangtx_dist = Math.sqrt(Fangtx_dx * Fangtx_dx + Fangtx_dy * Fangtx_dy);
        if (Fangtx_dist < Fangtx_linkDist) {
          var Fangtx_alpha = (1 - Fangtx_dist / Fangtx_linkDist) * 0.45;
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

  // 统计已完成页面数量（文件名含 detail 的页面不计入导航）
  function Fangtx_countPages() {
    var Fangtx_links = document.querySelectorAll('#Fangtx_navGrid .Fangtx_navCard');
    var Fangtx_label = document.getElementById('Fangtx_pageCount');
    if (Fangtx_label) {
      Fangtx_label.textContent = Fangtx_links.length + ' 个页面';
    }
    console.log('[Fangtx] 已完成页面数量:', Fangtx_links.length);
  }

  // 健康检查：服务器返回数据与错误均输出到浏览器控制台
  function Fangtx_checkServer() {
    var Fangtx_text = document.getElementById('Fangtx_serverStatus');
    var Fangtx_dot = document.getElementById('Fangtx_statusDot');

    if (typeof fetch !== 'function') {
      console.error('[Fangtx] 当前浏览器不支持 fetch，跳过健康检查');
      return;
    }

    fetch(Fangtx_apiUrl('/api/health'))
      .then(function (Fangtx_response) {
        return Fangtx_response.json();
      })
      .then(function (Fangtx_result) {
        console.log('[Fangtx] 服务器返回数据:', Fangtx_result);
        if (Fangtx_text) Fangtx_text.textContent = Fangtx_result.code === 0 ? '服务在线' : '服务异常';
        if (Fangtx_dot) Fangtx_dot.className = 'Fangtx_statusDot ' + (Fangtx_result.code === 0 ? 'Fangtx_isOnline' : 'Fangtx_isOffline');
      })
      .catch(function (Fangtx_error) {
        console.error('[Fangtx] 服务器请求失败:', Fangtx_error);
        if (Fangtx_text) Fangtx_text.textContent = '服务离线';
        if (Fangtx_dot) Fangtx_dot.className = 'Fangtx_statusDot Fangtx_isOffline';
      });
  }

  window.addEventListener('mousemove', function (Fangtx_event) {
    Fangtx_mouse.x = Fangtx_event.clientX;
    Fangtx_mouse.y = Fangtx_event.clientY;
  });

  window.addEventListener('mouseout', function () {
    Fangtx_mouse.x = null;
    Fangtx_mouse.y = null;
  });

  window.addEventListener('resize', Fangtx_resize);

  Fangtx_resize();
  Fangtx_draw();
  Fangtx_countPages();
  Fangtx_checkServer();
  console.log('[Fangtx] 首页 Canvas 背景动画已启动');
})();
