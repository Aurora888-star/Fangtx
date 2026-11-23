/*
 * 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-23 | 大模型：Tencent Hunyuan Hy
 * 文件：js/Fangtx_api.js
 * 说明：统一拼接后端接口地址。通过 http://localhost:8733 访问时沿用相对路径；
 *       直接以 file:// 双击打开 HTML 时自动指向本地后端，避免 "Failed to fetch"。
 */
(function (Fangtx_global) {
  'use strict';

  var Fangtx_baseUrl = '';
  if (Fangtx_global.location && Fangtx_global.location.protocol === 'file:') {
    Fangtx_baseUrl = 'http://localhost:8733';
  }

  Fangtx_global.Fangtx_apiUrl = function Fangtx_apiUrl(Fangtx_path) {
    var Fangtx_apiPath = String(Fangtx_path || '');
    if (Fangtx_apiPath.charAt(0) !== '/') Fangtx_apiPath = '/' + Fangtx_apiPath;
    return Fangtx_baseUrl + Fangtx_apiPath;
  };

  if (Fangtx_global.location && Fangtx_global.location.protocol === 'file:') {
    console.warn('[Fangtx] 当前以 file:// 打开页面，接口已自动指向 http://localhost:8733，请确保后端服务已启动。');
  }
})(window);
