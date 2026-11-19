/*
 * 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 * 文件：js/Fangtx_news.js
 * 说明：科技新闻列表页脚本 —— 请求 /api/news，展示接口链接、数据内容与原始 JSON。
 *       服务器返回的数据与错误信息统一输出到浏览器控制台。
 */
(function () {
  'use strict';

  var Fangtx_apiPath = '/api/news';
  var Fangtx_apiLink = document.getElementById('Fangtx_apiLink');
  var Fangtx_result = document.getElementById('Fangtx_result');
  var Fangtx_newsList = document.getElementById('Fangtx_newsList');
  var Fangtx_totalNum = document.getElementById('Fangtx_totalNum');
  var Fangtx_categoryNum = document.getElementById('Fangtx_categoryNum');
  var Fangtx_viewsSum = document.getElementById('Fangtx_viewsSum');
  var Fangtx_rawToggle = document.getElementById('Fangtx_rawToggle');
  var Fangtx_rawBox = document.getElementById('Fangtx_rawBox');

  // 接口链接使用绝对地址，便于点击在新窗口打开
  Fangtx_apiLink.href = Fangtx_apiPath;

  // 工具：格式化数字（千分位）
  function Fangtx_formatNumber(Fangtx_num) {
    return Number(Fangtx_num || 0).toLocaleString('zh-CN');
  }

  // 工具：格式化日期
  function Fangtx_formatDate(Fangtx_value) {
    if (!Fangtx_value) return '-';
    var Fangtx_date = new Date(Fangtx_value);
    if (isNaN(Fangtx_date.getTime())) return Fangtx_value;
    return Fangtx_date.getFullYear() + '-' +
      String(Fangtx_date.getMonth() + 1).padStart(2, '0') + '-' +
      String(Fangtx_date.getDate()).padStart(2, '0') + ' ' +
      String(Fangtx_date.getHours()).padStart(2, '0') + ':' +
      String(Fangtx_date.getMinutes()).padStart(2, '0');
  }

  // 显示状态提示
  function Fangtx_showResult(Fangtx_isOk, Fangtx_message) {
    Fangtx_result.className = 'Fangtx_result ' + (Fangtx_isOk ? 'Fangtx_resultIsOk' : 'Fangtx_resultIsError');
    Fangtx_result.textContent = (Fangtx_isOk ? '✓ ' : '✕ ') + Fangtx_message;
  }

  // 渲染概览统计
  function Fangtx_renderOverview(Fangtx_list) {
    var Fangtx_categories = {};
    var Fangtx_totalViews = 0;
    for (var Fangtx_i = 0; Fangtx_i < Fangtx_list.length; Fangtx_i++) {
      Fangtx_categories[Fangtx_list[Fangtx_i].Fangtx_category] = true;
      Fangtx_totalViews += Number(Fangtx_list[Fangtx_i].Fangtx_views || 0);
    }
    Fangtx_totalNum.textContent = Fangtx_list.length;
    Fangtx_categoryNum.textContent = Object.keys(Fangtx_categories).length;
    Fangtx_viewsSum.textContent = Fangtx_formatNumber(Fangtx_totalViews);
  }

  // 渲染新闻列表
  function Fangtx_renderNews(Fangtx_list) {
    Fangtx_newsList.innerHTML = '';
    for (var Fangtx_i = 0; Fangtx_i < Fangtx_list.length; Fangtx_i++) {
      var Fangtx_item = Fangtx_list[Fangtx_i];

      var Fangtx_card = document.createElement('a');
      Fangtx_card.className = 'Fangtx_newsCard';
      Fangtx_card.href = Fangtx_item.Fangtx_link;
      Fangtx_card.target = '_blank';
      Fangtx_card.rel = 'noopener';

      var Fangtx_top = document.createElement('div');
      Fangtx_top.className = 'Fangtx_newsCardTop';
      var Fangtx_category = document.createElement('span');
      Fangtx_category.className = 'Fangtx_newsCategory';
      Fangtx_category.textContent = Fangtx_item.Fangtx_category;
      var Fangtx_id = document.createElement('span');
      Fangtx_id.className = 'Fangtx_newsId';
      Fangtx_id.textContent = '#' + Fangtx_item.Fangtx_id;
      Fangtx_top.appendChild(Fangtx_category);
      Fangtx_top.appendChild(Fangtx_id);

      var Fangtx_title = document.createElement('h3');
      Fangtx_title.className = 'Fangtx_newsTitle';
      Fangtx_title.textContent = Fangtx_item.Fangtx_title;

      var Fangtx_summary = document.createElement('p');
      Fangtx_summary.className = 'Fangtx_newsSummary';
      Fangtx_summary.textContent = Fangtx_item.Fangtx_summary;

      var Fangtx_meta = document.createElement('div');
      Fangtx_meta.className = 'Fangtx_newsMeta';
      var Fangtx_source = document.createElement('span');
      Fangtx_source.textContent = Fangtx_item.Fangtx_source + ' · ' + Fangtx_formatDate(Fangtx_item.Fangtx_publish_time);
      var Fangtx_views = document.createElement('span');
      Fangtx_views.className = 'Fangtx_newsViews';
      Fangtx_views.textContent = '阅读 ' + Fangtx_formatNumber(Fangtx_item.Fangtx_views);
      Fangtx_meta.appendChild(Fangtx_source);
      Fangtx_meta.appendChild(Fangtx_views);

      Fangtx_card.appendChild(Fangtx_top);
      Fangtx_card.appendChild(Fangtx_title);
      Fangtx_card.appendChild(Fangtx_summary);
      Fangtx_card.appendChild(Fangtx_meta);
      Fangtx_newsList.appendChild(Fangtx_card);
    }
  }

  // 渲染原始 JSON 数据
  function Fangtx_renderRaw(Fangtx_data) {
    Fangtx_rawBox.textContent = JSON.stringify(Fangtx_data, null, 2);
  }

  // 原始数据展开/折叠
  Fangtx_rawToggle.addEventListener('click', function () {
    var Fangtx_expanded = Fangtx_rawToggle.getAttribute('aria-expanded') === 'true';
    Fangtx_rawToggle.setAttribute('aria-expanded', String(!Fangtx_expanded));
    Fangtx_rawBox.hidden = Fangtx_expanded;
  });

  // 请求接口并渲染
  function Fangtx_loadNews() {
    fetch(Fangtx_apiPath)
      .then(function (Fangtx_response) {
        return Fangtx_response.json();
      })
      .then(function (Fangtx_data) {
        console.log('[Fangtx] 服务器返回数据:', Fangtx_data);
        if (Fangtx_data.code === 0) {
          Fangtx_showResult(true, '接口 ' + Fangtx_apiPath + ' 请求成功，共返回 ' + Fangtx_data.data.total + ' 条新闻数据');
          Fangtx_renderOverview(Fangtx_data.data.list);
          Fangtx_renderNews(Fangtx_data.data.list);
          Fangtx_renderRaw(Fangtx_data);
        } else {
          console.error('[Fangtx] 服务器返回错误:', Fangtx_data.msg);
          Fangtx_showResult(false, Fangtx_data.msg);
        }
      })
      .catch(function (Fangtx_error) {
        console.error('[Fangtx] 请求失败:', Fangtx_error);
        Fangtx_showResult(false, '请求失败：' + Fangtx_error.message);
      });
  }

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
  console.log('[Fangtx] 科技新闻页 Canvas 背景动画已启动');

  Fangtx_loadNews();
})();
