/*
 * 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 * 文件：js/Fangtx_gallery.js
 * 说明：图文列表页脚本 —— 请求 /api/gallery，展示图片、文字、接口链接、分类筛选与原始 JSON。
 *       服务器返回的数据与错误信息统一输出到浏览器控制台。
 */
(function () {
  'use strict';

  var Fangtx_apiPath = '/api/gallery';
  var Fangtx_apiLink = document.getElementById('Fangtx_apiLink');
  var Fangtx_result = document.getElementById('Fangtx_result');
  var Fangtx_galleryGrid = document.getElementById('Fangtx_galleryGrid');
  var Fangtx_filterBar = document.getElementById('Fangtx_filterBar');
  var Fangtx_rawToggle = document.getElementById('Fangtx_rawToggle');
  var Fangtx_rawBox = document.getElementById('Fangtx_rawBox');
  var Fangtx_allData = [];

  Fangtx_apiLink.href = Fangtx_apiPath;

  function Fangtx_formatNumber(Fangtx_num) {
    return Number(Fangtx_num || 0).toLocaleString('zh-CN');
  }

  function Fangtx_formatDate(Fangtx_value) {
    if (!Fangtx_value) return '-';
    var Fangtx_date = new Date(Fangtx_value);
    if (isNaN(Fangtx_date.getTime())) return Fangtx_value;
    return Fangtx_date.getFullYear() + '-' +
      String(Fangtx_date.getMonth() + 1).padStart(2, '0') + '-' +
      String(Fangtx_date.getDate()).padStart(2, '0');
  }

  function Fangtx_showResult(Fangtx_isOk, Fangtx_message) {
    Fangtx_result.className = 'Fangtx_result ' + (Fangtx_isOk ? 'Fangtx_resultIsOk' : 'Fangtx_resultIsError');
    Fangtx_result.textContent = (Fangtx_isOk ? '✓ ' : '✕ ') + Fangtx_message;
  }

  // 渲染图文卡片
  function Fangtx_renderGallery(Fangtx_list) {
    Fangtx_galleryGrid.innerHTML = '';
    for (var Fangtx_i = 0; Fangtx_i < Fangtx_list.length; Fangtx_i++) {
      var Fangtx_item = Fangtx_list[Fangtx_i];

      var Fangtx_card = document.createElement('article');
      Fangtx_card.className = 'Fangtx_galleryCard';

      var Fangtx_imageWrap = document.createElement('div');
      Fangtx_imageWrap.className = 'Fangtx_cardImageWrap';
      var Fangtx_image = document.createElement('img');
      Fangtx_image.className = 'Fangtx_cardImage';
      Fangtx_image.src = Fangtx_item.Fangtx_image;
      Fangtx_image.alt = Fangtx_item.Fangtx_title;
      Fangtx_image.loading = 'lazy';
      Fangtx_image.onerror = function () {
        this.style.display = 'none';
      };
      var Fangtx_category = document.createElement('span');
      Fangtx_category.className = 'Fangtx_cardCategory';
      Fangtx_category.textContent = Fangtx_item.Fangtx_category;
      Fangtx_imageWrap.appendChild(Fangtx_image);
      Fangtx_imageWrap.appendChild(Fangtx_category);

      var Fangtx_body = document.createElement('div');
      Fangtx_body.className = 'Fangtx_cardBody';
      var Fangtx_title = document.createElement('h3');
      Fangtx_title.className = 'Fangtx_cardTitle';
      Fangtx_title.textContent = Fangtx_item.Fangtx_title;
      var Fangtx_desc = document.createElement('p');
      Fangtx_desc.className = 'Fangtx_cardDesc';
      Fangtx_desc.textContent = Fangtx_item.Fangtx_description;
      var Fangtx_meta = document.createElement('div');
      Fangtx_meta.className = 'Fangtx_cardMeta';
      var Fangtx_author = document.createElement('span');
      Fangtx_author.textContent = Fangtx_item.Fangtx_author + ' · ' + Fangtx_formatDate(Fangtx_item.Fangtx_publish_time);
      var Fangtx_likes = document.createElement('span');
      Fangtx_likes.className = 'Fangtx_cardLikes';
      Fangtx_likes.textContent = '♥ ' + Fangtx_formatNumber(Fangtx_item.Fangtx_likes);
      Fangtx_meta.appendChild(Fangtx_author);
      Fangtx_meta.appendChild(Fangtx_likes);

      Fangtx_body.appendChild(Fangtx_title);
      Fangtx_body.appendChild(Fangtx_desc);
      Fangtx_body.appendChild(Fangtx_meta);

      Fangtx_card.appendChild(Fangtx_imageWrap);
      Fangtx_card.appendChild(Fangtx_body);
      Fangtx_galleryGrid.appendChild(Fangtx_card);
    }
  }

  // 构建分类筛选按钮
  function Fangtx_buildFilter(Fangtx_list) {
    var Fangtx_categories = ['全部'];
    for (var Fangtx_i = 0; Fangtx_i < Fangtx_list.length; Fangtx_i++) {
      if (Fangtx_categories.indexOf(Fangtx_list[Fangtx_i].Fangtx_category) === -1) {
        Fangtx_categories.push(Fangtx_list[Fangtx_i].Fangtx_category);
      }
    }
    Fangtx_filterBar.innerHTML = '';
    for (var Fangtx_j = 0; Fangtx_j < Fangtx_categories.length; Fangtx_j++) {
      var Fangtx_btn = document.createElement('button');
      Fangtx_btn.type = 'button';
      Fangtx_btn.className = 'Fangtx_filterBtn' + (Fangtx_j === 0 ? ' Fangtx_filterActive' : '');
      Fangtx_btn.textContent = Fangtx_categories[Fangtx_j];
      Fangtx_btn.setAttribute('data-Fangtx-category', Fangtx_categories[Fangtx_j]);
      Fangtx_btn.addEventListener('click', function () {
        var Fangtx_btns = Fangtx_filterBar.querySelectorAll('.Fangtx_filterBtn');
        for (var Fangtx_k = 0; Fangtx_k < Fangtx_btns.length; Fangtx_k++) {
          Fangtx_btns[Fangtx_k].classList.remove('Fangtx_filterActive');
        }
        this.classList.add('Fangtx_filterActive');
        var Fangtx_cat = this.getAttribute('data-Fangtx-category');
        if (Fangtx_cat === '全部') {
          Fangtx_renderGallery(Fangtx_allData);
        } else {
          var Fangtx_filtered = Fangtx_allData.filter(function (Fangtx_item) {
            return Fangtx_item.Fangtx_category === Fangtx_cat;
          });
          Fangtx_renderGallery(Fangtx_filtered);
        }
      });
      Fangtx_filterBar.appendChild(Fangtx_btn);
    }
  }

  // 原始数据展开/折叠
  Fangtx_rawToggle.addEventListener('click', function () {
    var Fangtx_expanded = Fangtx_rawToggle.getAttribute('aria-expanded') === 'true';
    Fangtx_rawToggle.setAttribute('aria-expanded', String(!Fangtx_expanded));
    Fangtx_rawBox.hidden = Fangtx_expanded;
  });

  function Fangtx_loadGallery() {
    fetch(Fangtx_apiPath)
      .then(function (Fangtx_response) {
        return Fangtx_response.json();
      })
      .then(function (Fangtx_data) {
        console.log('[Fangtx] 服务器返回数据:', Fangtx_data);
        if (Fangtx_data.code === 0) {
          Fangtx_showResult(true, '接口 ' + Fangtx_apiPath + ' 请求成功，共返回 ' + Fangtx_data.data.total + ' 条图文数据');
          Fangtx_allData = Fangtx_data.data.list;
          Fangtx_renderGallery(Fangtx_allData);
          Fangtx_buildFilter(Fangtx_allData);
          Fangtx_rawBox.textContent = JSON.stringify(Fangtx_data, null, 2);
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
  console.log('[Fangtx] 图文列表页 Canvas 背景动画已启动');

  Fangtx_loadGallery();
})();
