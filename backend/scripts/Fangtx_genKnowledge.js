/**
 * 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
 * 文件：scripts/Fangtx_genKnowledge.js
 * 说明：生成两个真实格式的知识库示例文件（docx 与 pptx），用于知识库构建与问答测试。
 *       docx 采用 OOXML（word/document.xml），pptx 采用 OOXML（ppt/slides/）。
 */
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const Fangtx_knowledgeDir = path.join(__dirname, '..', 'knowledge');

if (!fs.existsSync(Fangtx_knowledgeDir)) {
  fs.mkdirSync(Fangtx_knowledgeDir, { recursive: true });
}

// ============ 知识内容：智能客服 FAQ（docx） ============
const Fangtx_faqItems = [
  { q: '你们的工作时间是什么时候？', a: '我们的在线客服工作时间为每周一至周日 09:00 至 21:00，节假日照常服务。非工作时间留言会在次日 10:00 前回复。' },
  { q: '如何联系人工客服？', a: '您可以在页面右下角点击"联系人工"按钮，或拨打客服热线 400-888-1234。高峰期建议优先使用在线客服，平均等待时间约 2 分钟。' },
  { q: '支持哪些支付方式？', a: '我们支持微信支付、支付宝、银联云闪付以及主流银行卡（Visa、MasterCard）。企业客户还可申请对公转账，到账后 1 个工作日内发货。' },
  { q: '退换货政策是怎样的？', a: '商品签收后 7 天内可无理由退货，15 天内可换货。商品需保持完好、配件齐全。定制类商品和生鲜类商品不支持无理由退货。退款原路返回，一般 3 至 5 个工作日到账。' },
  { q: '配送需要多久？', a: '一线城市（北上广深）次日达，其他城市 2 至 4 天，偏远地区 5 至 7 天。订单满 199 元包邮，不满则收取 12 元运费。' },
  { q: '会员有哪些权益？', a: '注册会员享受积分累积（消费 1 元得 1 积分）、生日当月 9 折券、专属客服通道、每月一次免运费券。累计消费满 5000 元升级为黄金会员，额外享受 95 折。' },
  { q: '如何修改账号密码？', a: '登录后在"个人中心—账号安全—修改密码"中操作，需验证原密码和手机验证码。如忘记密码，可在登录页点击"忘记密码"，通过注册手机号重置。' },
  { q: '产品保修期多长？', a: '大部分电子产品保修期为 1 年，主要部件保修 2 年。保修期内非人为损坏可免费维修，需提供购买凭证。人为损坏、进水、摔落不在保修范围内。' },
  { q: '可以开发票吗？', a: '可以。下单时在备注中填写发票抬头和税号，电子发票将在发货后 3 个工作日内发送至您的注册邮箱。纸质发票需额外支付 10 元快递费。' },
  { q: '如何查询订单状态？', a: '在"个人中心—我的订单"中查看实时状态。订单状态包括：待付款、待发货、已发货、运输中、已签收、已完成。发货后会短信通知快递单号。' },
  { q: '积分如何兑换？', a: '积分可在"积分商城"兑换优惠券或实物礼品，100 积分抵扣 10 元。积分有效期为获取后 12 个月，逾期自动清零，兑换后不可退回。' },
  { q: '支持货到付款吗？', a: '目前仅部分城市支持货到付款，下单时如地址在支持范围内会出现该选项。货到付款订单需额外支付 15 元服务费。' }
];

// 转义 XML 特殊字符
function Fangtx_escapeXml(Fangtx_text) {
  return Fangtx_text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ============ 生成 DOCX ============
function Fangtx_genDocx() {
  const Fangtx_paragraphs = [
    '<w:p><w:r><w:t xml:space="preserve">方天箫智能客服知识库</w:t></w:r></w:p>',
    '<w:p><w:r><w:t xml:space="preserve">本文档包含常见问题的标准答复，用于自动客服系统检索。每条知识由问题与答案组成。</w:t></w:r></w:p>'
  ];
  Fangtx_faqItems.forEach(function (Fangtx_item, Fangtx_i) {
    Fangtx_paragraphs.push(
      '<w:p><w:r><w:t xml:space="preserve">问题' + (Fangtx_i + 1) + '：' + Fangtx_escapeXml(Fangtx_item.q) + '</w:t></w:r></w:p>' +
      '<w:p><w:r><w:t xml:space="preserve">答案' + (Fangtx_i + 1) + '：' + Fangtx_escapeXml(Fangtx_item.a) + '</w:t></w:r></w:p>'
    );
  });

  const Fangtx_documentXml =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' +
    Fangtx_paragraphs.join('') +
    '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/></w:sectPr></w:body></w:document>';

  const Fangtx_contentTypes =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
    '</Types>';

  const Fangtx_rels =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
    '</Relationships>';

  const Fangtx_zip = new AdmZip();
  Fangtx_zip.addFile('[Content_Types].xml', Buffer.from(Fangtx_contentTypes, 'utf8'));
  Fangtx_zip.addFile('_rels/.rels', Buffer.from(Fangtx_rels, 'utf8'));
  Fangtx_zip.addFile('word/document.xml', Buffer.from(Fangtx_documentXml, 'utf8'));

  const Fangtx_file = path.join(Fangtx_knowledgeDir, 'Fangtx_service_faq.docx');
  Fangtx_zip.writeZip(Fangtx_file);
  console.log('[Fangtx] 已生成 docx 知识库:', Fangtx_file);
  return Fangtx_file;
}

// ============ 生成 PPTX ============
function Fangtx_genPptx() {
  const Fangtx_slides = [
    {
      title: '知乎的模仿与制作 · 项目介绍',
      lines: [
        '项目名称：知乎的模仿与制作（项目类别：模仿）',
        '开发者：方天箫，学号 24001010733',
        '项目目标：模仿知乎的核心页面与交互，实践前后端分离开发'
      ]
    },
    {
      title: '技术架构',
      lines: [
        '前端：原生 HTML / CSS / JavaScript，不使用第三方库与 CDN',
        '后端：Node.js + Express，RESTful 风格，端口 8733',
        '数据库：MySQL，建表与字段统一使用 Fangtx_ 前缀',
        'AI 能力：硅基流动 DeepSeek-V4-Flash 大模型'
      ]
    },
    {
      title: '已实现页面功能',
      lines: [
        '首页：Canvas 粒子背景动画 + 页面链接导航',
        '数据库连接页：输入用户名密码测试 MySQL 连接',
        '科技新闻页：展示 news 表数据与后端接口链接',
        '图文精选页：本地 SVG 封面图 + 分类筛选',
        'AI 聊天页：多轮对话，控制台输出收发数据',
        '知识库页：文件上传解析与 RAG 问答'
      ]
    },
    {
      title: '接口设计',
      lines: [
        '所有接口以 /api/ 为前缀，统一返回 code、msg、data',
        'GET /api/news 返回科技新闻列表',
        'GET /api/gallery 返回图文列表',
        'POST /api/chat 调用大模型对话',
        'POST /api/knowledge/upload 上传并解析知识库文件',
        'POST /api/knowledge/ask 基于知识库检索增强问答'
      ]
    },
    {
      title: '数据库设计',
      lines: [
        'Fangtx_tech_news：科技新闻表，存储新闻标题、来源、分类与摘要',
        'Fangtx_gallery：图文表，存储标题、图片路径、简介与作者',
        'Fangtx_knowledge_file：知识库文件表，记录文件名、类型与分块数',
        'Fangtx_knowledge_chunk：知识分块表，存储解析后的文本片段',
        '每张表均插入至少 8 条有真实业务意义的测试数据'
      ]
    }
  ];

  function Fangtx_slideXml(Fangtx_slide) {
    const Fangtx_shapes = [];
    // 标题
    Fangtx_shapes.push(
      '<p:sp><p:nvSpPr><p:cNvPr id="2" name="Title"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr/></p:nvSpPr>' +
      '<p:spPr><a:xfrm><a:off x="457200" y="274638"/><a:ext cx="8229600" cy="1143000"/></a:xfrm></p:spPr>' +
      '<p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="zh-CN" sz="2800" b="1"/><a:t>' + Fangtx_escapeXml(Fangtx_slide.title) + '</a:t></a:r></a:p></p:txBody></p:sp>'
    );
    // 内容
    const Fangtx_lines = Fangtx_slide.lines.map(function (Fangtx_line) {
      return '<a:p><a:r><a:rPr lang="zh-CN" sz="1800"/><a:t>' + Fangtx_escapeXml(Fangtx_line) + '</a:t></a:r></a:p>';
    }).join('');
    Fangtx_shapes.push(
      '<p:sp><p:nvSpPr><p:cNvPr id="3" name="Content"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr/></p:nvSpPr>' +
      '<p:spPr><a:xfrm><a:off x="457200" y="1600200"/><a:ext cx="8229600" cy="4350000"/></a:xfrm></p:spPr>' +
      '<p:txBody><a:bodyPr/><a:lstStyle/>' + Fangtx_lines + '</p:txBody></p:sp>'
    );
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" ' +
      'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' +
      'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree>' +
      '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>' +
      Fangtx_shapes.join('') + '</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>';
  }

  const Fangtx_zip = new AdmZip();
  const Fangtx_contentTypes =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>' +
    Fangtx_slides.map(function (Fangtx_s, Fangtx_i) {
      return '<Override PartName="/ppt/slides/slide' + (Fangtx_i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>';
    }).join('') +
    '</Types>';
  Fangtx_zip.addFile('[Content_Types].xml', Buffer.from(Fangtx_contentTypes, 'utf8'));
  Fangtx_zip.addFile('_rels/.rels', Buffer.from(
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>' +
    '</Relationships>', 'utf8'));

  let Fangtx_presRel = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';
  Fangtx_slides.forEach(function (Fangtx_s, Fangtx_i) {
    Fangtx_presRel += '<Relationship Id="rId' + (Fangtx_i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide' + (Fangtx_i + 1) + '.xml"/>';
    Fangtx_zip.addFile('ppt/slides/slide' + (Fangtx_i + 1) + '.xml', Buffer.from(Fangtx_slideXml(Fangtx_s), 'utf8'));
  });
  Fangtx_presRel += '</Relationships>';

  Fangtx_zip.addFile('ppt/presentation.xml', Buffer.from(
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" ' +
    'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' +
    'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">' +
    '<p:sldMasterIdLst/><p:sldIdLst>' +
    Fangtx_slides.map(function (Fangtx_s, Fangtx_i) {
      return '<p:sldId id="' + (256 + Fangtx_i) + '" r:id="rId' + (Fangtx_i + 1) + '"/>';
    }).join('') +
    '</p:sldIdLst><p:sldSz cx="9144000" cy="6858000"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>', 'utf8'));
  Fangtx_zip.addFile('ppt/_rels/presentation.xml.rels', Buffer.from(Fangtx_presRel, 'utf8'));

  const Fangtx_file = path.join(Fangtx_knowledgeDir, 'Fangtx_project_intro.pptx');
  Fangtx_zip.writeZip(Fangtx_file);
  console.log('[Fangtx] 已生成 pptx 知识库:', Fangtx_file);
  return Fangtx_file;
}

Fangtx_genDocx();
Fangtx_genPptx();
console.log('[Fangtx] 知识库示例文件生成完毕');
