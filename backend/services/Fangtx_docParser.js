/**
 * 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
 * 文件：services/Fangtx_docParser.js
 * 说明：文档解析与分块服务。支持 doc / docx / ppt / pptx / pdf / txt / md，
 *       提取纯文本后按段落切分为适合检索的文本块。
 */
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const AdmZip = require('adm-zip');
const pdfParse = require('pdf-parse');
const WordExtractor = require('word-extractor');

// 根据扩展名解析文档为纯文本
async function Fangtx_parseFile(Fangtx_filePath, Fangtx_originalName) {
  const Fangtx_ext = path.extname(Fangtx_originalName).toLowerCase().replace('.', '');

  switch (Fangtx_ext) {
    case 'docx':
      return await Fangtx_parseDocx(Fangtx_filePath);
    case 'doc':
      return await Fangtx_parseDoc(Fangtx_filePath);
    case 'pptx':
      return await Fangtx_parsePptx(Fangtx_filePath);
    case 'ppt':
      return await Fangtx_parsePpt(Fangtx_filePath);
    case 'pdf':
      return await Fangtx_parsePdf(Fangtx_filePath);
    case 'txt':
    case 'md':
      return Fangtx_parseText(Fangtx_filePath);
    default:
      throw new Error('不支持的文件类型: .' + Fangtx_ext);
  }
}

// docx：mammoth 提取
async function Fangtx_parseDocx(Fangtx_filePath) {
  const Fangtx_result = await mammoth.extractRawText({ path: Fangtx_filePath });
  return Fangtx_result.value || '';
}

// doc：word-extractor 提取（老式二进制格式）
async function Fangtx_parseDoc(Fangtx_filePath) {
  const Fangtx_extractor = new WordExtractor();
  const Fangtx_doc = await Fangtx_extractor.extract(Fangtx_filePath);
  return Fangtx_doc.getBody() || '';
}

// pptx：解压后读取 ppt/slides/slideN.xml 中的 <a:t> 文本
function Fangtx_parsePptx(Fangtx_filePath) {
  const Fangtx_zip = new AdmZip(Fangtx_filePath);
  const Fangtx_entries = Fangtx_zip.getEntries()
    .filter(function (Fangtx_e) {
      return /^ppt\/slides\/slide\d+\.xml$/.test(Fangtx_e.entryName);
    })
    .sort(function (Fangtx_a, Fangtx_b) {
      const Fangtx_na = parseInt((Fangtx_a.entryName.match(/slide(\d+)/) || [])[1], 10);
      const Fangtx_nb = parseInt((Fangtx_b.entryName.match(/slide(\d+)/) || [])[1], 10);
      return Fangtx_na - Fangtx_nb;
    });

  const Fangtx_lines = [];
  Fangtx_entries.forEach(function (Fangtx_entry) {
    const Fangtx_xml = Fangtx_entry.getData().toString('utf8');
    const Fangtx_texts = Fangtx_xml.match(/<a:t>([\s\S]*?)<\/a:t>/g) || [];
    Fangtx_texts.forEach(function (Fangtx_t) {
      const Fangtx_content = Fangtx_t.replace(/<\/?a:t>/g, '')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>').trim();
      if (Fangtx_content) Fangtx_lines.push(Fangtx_content);
    });
  });
  return Fangtx_lines.join('\n');
}

// ppt：老式二进制格式，尝试从二进制中提取可读文本（UTF-16LE 片段）
function Fangtx_parsePpt(Fangtx_filePath) {
  const Fangtx_buf = fs.readFileSync(Fangtx_filePath);
  let Fangtx_text = '';
  // 尝试 UTF-16LE 解码并提取连续可打印片段
  const Fangtx_utf16 = Fangtx_buf.toString('utf16le');
  Fangtx_text += Fangtx_utf16;
  // 提取中文和 ASCII 可读片段
  const Fangtx_matches = Fangtx_text.match(/[\u4e00-\u9fa5A-Za-z0-9，。：；、（）()\-\s]{4,}/g) || [];
  const Fangtx_result = Fangtx_matches
    .map(function (Fangtx_m) { return Fangtx_m.trim(); })
    .filter(function (Fangtx_m) { return Fangtx_m.length >= 4; })
    .join('\n');
  if (!Fangtx_result) {
    throw new Error('无法从 .ppt 文件中提取文本，建议另存为 .pptx 格式后上传');
  }
  return Fangtx_result;
}

// pdf：pdf-parse 提取
async function Fangtx_parsePdf(Fangtx_filePath) {
  const Fangtx_buffer = fs.readFileSync(Fangtx_filePath);
  const Fangtx_data = await pdfParse(Fangtx_buffer);
  return Fangtx_data.text || '';
}

// txt / md：直接读取
function Fangtx_parseText(Fangtx_filePath) {
  return fs.readFileSync(Fangtx_filePath, 'utf8');
}

// 将文本切分为分块：优先按空行分段，长段落再按长度切分
function Fangtx_splitChunks(Fangtx_text, Fangtx_maxLen) {
  const Fangtx_limit = Fangtx_maxLen || 300;
  const Fangtx_paragraphs = Fangtx_text
    .replace(/\r\n/g, '\n')
    .split(/\n+/)
    .map(function (Fangtx_p) { return Fangtx_p.trim(); })
    .filter(function (Fangtx_p) { return Fangtx_p.length > 0; });

  const Fangtx_chunks = [];
  Fangtx_paragraphs.forEach(function (Fangtx_para) {
    if (Fangtx_para.length <= Fangtx_limit) {
      Fangtx_chunks.push(Fangtx_para);
      return;
    }
    let Fangtx_start = 0;
    while (Fangtx_start < Fangtx_para.length) {
      Fangtx_chunks.push(Fangtx_para.slice(Fangtx_start, Fangtx_start + Fangtx_limit));
      Fangtx_start += Fangtx_limit;
    }
  });
  return Fangtx_chunks;
}

module.exports = {
  Fangtx_parseFile,
  Fangtx_splitChunks
};
