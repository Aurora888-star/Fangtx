/*
 * 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 * 文件：js/Fangtx_main.js
 * 说明：首页 Canvas 粒子背景动画，纯原生 JavaScript 实现。
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

  // 粒子数量根据屏幕宽度自适应
  function Fangtx_particleCount() {
    var base = Math.floor((Fangtx_width * Fangtx_height) / 14000);
    return Math.max(40, Math.min(base, 140));
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
    var count = Fangtx_particleCount();
    for (var i = 0; i < count; i++) {
      Fangtx_particles.push({
        x: Math.random() * Fangtx_width,
        y: Math.random() * Fangtx_height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 1.8 + 0.8
      });
    }
  }

  // 绘制一帧
  function Fangtx_draw() {
    Fangtx_ctx.clearRect(0, 0, Fangtx_width, Fangtx_height);

    for (var i = 0; i < Fangtx_particles.length; i++) {
      var p = Fangtx_particles[i];

      // 位置更新
      p.x += p.vx;
      p.y += p.vy;

      // 边界反弹
      if (p.x < 0 || p.x > Fangtx_width) p.vx *= -1;
      if (p.y < 0 || p.y > Fangtx_height) p.vy *= -1;

      // 鼠标排斥效果
      if (Fangtx_mouse.x !== null) {
        var mdx = p.x - Fangtx_mouse.x;
        var mdy = p.y - Fangtx_mouse.y;
        var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < Fangtx_mouse.radius && mdist > 0) {
          var force = (Fangtx_mouse.radius - mdist) / Fangtx_mouse.radius;
          p.x += (mdx / mdist) * force * 2.2;
          p.y += (mdy / mdist) * force * 2.2;
        }
      }

      // 绘制粒子
      Fangtx_ctx.beginPath();
      Fangtx_ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      Fangtx_ctx.fillStyle = 'rgba(120, 180, 255, 0.85)';
      Fangtx_ctx.fill();

      // 粒子间连线
      for (var j = i + 1; j < Fangtx_particles.length; j++) {
        var q = Fangtx_particles[j];
        var dx = p.x - q.x;
        var dy = p.y - q.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < Fangtx_linkDist) {
          var alpha = (1 - dist / Fangtx_linkDist) * 0.5;
          Fangtx_ctx.beginPath();
          Fangtx_ctx.strokeStyle = 'rgba(23, 114, 246, ' + alpha + ')';
          Fangtx_ctx.lineWidth = 1;
          Fangtx_ctx.moveTo(p.x, p.y);
          Fangtx_ctx.lineTo(q.x, q.y);
          Fangtx_ctx.stroke();
        }
      }
    }

    requestAnimationFrame(Fangtx_draw);
  }

  // 鼠标事件
  window.addEventListener('mousemove', function (e) {
    Fangtx_mouse.x = e.clientX;
    Fangtx_mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', function () {
    Fangtx_mouse.x = null;
    Fangtx_mouse.y = null;
  });

  window.addEventListener('resize', Fangtx_resize);

  Fangtx_resize();
  Fangtx_draw();
  console.log('[Fangtx] 首页 Canvas 背景动画已启动');
})();
