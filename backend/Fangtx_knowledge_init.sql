-- 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
-- 文件：Fangtx_knowledge_init.sql
-- 说明：知识库（RAG）相关表：文件表与文本分块表，含测试数据。

USE webdesign;

-- 知识库文件表
CREATE TABLE IF NOT EXISTS Fangtx_knowledge_file (
  Fangtx_id INT AUTO_INCREMENT PRIMARY KEY,
  Fangtx_filename VARCHAR(255) NOT NULL COMMENT '原始文件名',
  Fangtx_stored_name VARCHAR(255) NOT NULL COMMENT '服务器存储文件名',
  Fangtx_file_type VARCHAR(20) NOT NULL COMMENT '文件类型: doc/docx/ppt/pptx/pdf/txt/md',
  Fangtx_file_size INT NOT NULL DEFAULT 0 COMMENT '文件大小(字节)',
  Fangtx_chunk_count INT NOT NULL DEFAULT 0 COMMENT '分块数量',
  Fangtx_status VARCHAR(20) NOT NULL DEFAULT 'ready' COMMENT '状态: ready/error',
  Fangtx_upload_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识库文件表';

-- 知识库文本分块表
CREATE TABLE IF NOT EXISTS Fangtx_knowledge_chunk (
  Fangtx_id INT AUTO_INCREMENT PRIMARY KEY,
  Fangtx_file_id INT NOT NULL COMMENT '所属文件ID',
  Fangtx_chunk_index INT NOT NULL COMMENT '分块序号',
  Fangtx_content TEXT NOT NULL COMMENT '分块文本内容',
  KEY Fangtx_idx_file (Fangtx_file_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识库文本分块表';

-- ============ 测试数据：8 个知识库文件 ============
INSERT INTO Fangtx_knowledge_file
(Fangtx_id, Fangtx_filename, Fangtx_stored_name, Fangtx_file_type, Fangtx_file_size, Fangtx_chunk_count, Fangtx_status, Fangtx_upload_time) VALUES
(1, '智能客服FAQ.docx', 'Fangtx_service_faq.docx', 'docx', 2708, 14, 'ready', '2026-11-23 10:00:00'),
(2, '项目介绍.pptx', 'Fangtx_project_intro.pptx', 'pptx', 5613, 5, 'ready', '2026-11-23 10:05:00'),
(3, '会员权益说明.txt', 'Fangtx_member_benefits.txt', 'txt', 1024, 4, 'ready', '2026-11-23 10:10:00'),
(4, '产品保修政策.docx', 'Fangtx_warranty_policy.docx', 'docx', 2048, 6, 'ready', '2026-11-23 10:15:00'),
(5, '退换货流程.txt', 'Fangtx_return_guide.txt', 'txt', 896, 3, 'ready', '2026-11-23 10:20:00'),
(6, '配送服务说明.pdf', 'Fangtx_delivery.pdf', 'pdf', 3584, 5, 'ready', '2026-11-23 10:25:00'),
(7, '账号安全指南.md', 'Fangtx_account_security.md', 'md', 1536, 4, 'ready', '2026-11-23 10:30:00'),
(8, '支付方式介绍.pptx', 'Fangtx_payment.pptx', 'pptx', 4096, 4, 'ready', '2026-11-23 10:35:00');

-- ============ 测试数据：知识分块（每个文件至少 1 条，共 20 条） ============
INSERT INTO Fangtx_knowledge_chunk (Fangtx_file_id, Fangtx_chunk_index, Fangtx_content) VALUES
(1, 0, '方天箫智能客服知识库。本文档包含常见问题的标准答复，用于自动客服系统检索。每条知识由问题与答案组成。'),
(1, 1, '问题1：你们的工作时间是什么时候？ 答案1：我们的在线客服工作时间为每周一至周日 09:00 至 21:00，节假日照常服务。非工作时间留言会在次日 10:00 前回复。'),
(1, 2, '问题2：如何联系人工客服？ 答案2：您可以在页面右下角点击"联系人工"按钮，或拨打客服热线 400-888-1234。高峰期建议优先使用在线客服，平均等待时间约 2 分钟。'),
(1, 3, '问题3：支持哪些支付方式？ 答案3：我们支持微信支付、支付宝、银联云闪付以及主流银行卡（Visa、MasterCard）。企业客户还可申请对公转账，到账后 1 个工作日内发货。'),
(1, 4, '问题4：退换货政策是怎样的？ 答案4：商品签收后 7 天内可无理由退货，15 天内可换货。商品需保持完好、配件齐全。定制类商品和生鲜类商品不支持无理由退货。退款原路返回，一般 3 至 5 个工作日到账。'),
(1, 5, '问题5：配送需要多久？ 答案5：一线城市（北上广深）次日达，其他城市 2 至 4 天，偏远地区 5 至 7 天。订单满 199 元包邮，不满则收取 12 元运费。'),
(1, 6, '问题6：会员有哪些权益？ 答案6：注册会员享受积分累积（消费 1 元得 1 积分）、生日当月 9 折券、专属客服通道、每月一次免运费券。累计消费满 5000 元升级为黄金会员，额外享受 95 折。'),
(1, 7, '问题7：如何修改账号密码？ 答案7：登录后在"个人中心—账号安全—修改密码"中操作，需验证原密码和手机验证码。如忘记密码，可在登录页点击"忘记密码"，通过注册手机号重置。'),
(1, 8, '问题8：产品保修期多长？ 答案8：大部分电子产品保修期为 1 年，主要部件保修 2 年。保修期内非人为损坏可免费维修，需提供购买凭证。人为损坏、进水、摔落不在保修范围内。'),
(2, 0, '知乎的模仿与制作 · 项目介绍。项目名称：知乎的模仿与制作（模仿）。开发者：方天箫，学号 24001010733。项目目标：模仿知乎的核心页面与交互，实践前后端分离开发。'),
(2, 1, '技术架构。前端：原生 HTML / CSS / JavaScript，不使用第三方库与 CDN。后端：Node.js + Express，RESTful 风格，端口 8733。数据库：MySQL，建表与字段统一使用 Fangtx_ 前缀。AI 能力：硅基流动 DeepSeek-V4-Flash 大模型。'),
(2, 2, '已实现页面功能。首页：Canvas 粒子背景动画 + 页面链接导航。数据库连接页：输入用户名密码测试 MySQL 连接。科技新闻页：展示 news 表数据与后端接口链接。图文精选页：本地 SVG 封面图 + 分类筛选。AI 聊天页：多轮对话，控制台输出收发数据。知识库页：文件上传解析与 RAG 问答。'),
(2, 3, '接口设计。所有接口以 /api/ 为前缀，统一返回 code、msg、data。POST /api/knowledge/upload 上传并解析知识库文件。POST /api/knowledge/ask 基于知识库检索增强问答。'),
(2, 4, '数据库设计。Fangtx_knowledge_file：知识库文件表，记录文件名、类型与分块数。Fangtx_knowledge_chunk：知识分块表，存储解析后的文本片段。每张表均插入至少 8 条有真实业务意义的测试数据。'),
(3, 0, '会员权益说明。注册会员享受积分累积，消费 1 元得 1 积分，积分可在积分商城兑换优惠券或实物礼品。'),
(3, 1, '生日当月可领取 9 折优惠券，每位会员每年限领一次，有效期为领取后 30 天。'),
(3, 2, '黄金会员：累计消费满 5000 元自动升级，享受全场 95 折、专属客服通道与优先发货。'),
(3, 3, '每月赠送一张免运费券，订单满 99 元即可使用，不可与其他优惠叠加。'),
(4, 0, '产品保修政策。大部分电子产品保修期为 1 年，主要部件保修 2 年，自购买之日起计算。'),
(4, 1, '保修期内非人为损坏可享受免费维修或更换服务，需提供有效购买凭证与保修卡。'),
(4, 2, '人为损坏、进液、摔落、自行拆机改装等情况不在免费保修范围内，可选择付费维修。'),
(5, 0, '退换货流程。商品签收后 7 天内可无理由退货，15 天内可换货，商品需保持完好且配件齐全。'),
(5, 1, '申请方式：在个人中心—我的订单中选择申请售后，填写原因后提交，客服将在 24 小时内审核。'),
(5, 2, '退款将原路返回至支付账户，一般 3 至 5 个工作日到账，具体时间以银行处理为准。'),
(6, 0, '配送服务说明。一线城市（北上广深）次日达，其他城市 2 至 4 天，偏远地区 5 至 7 天。'),
(6, 1, '订单满 199 元包邮，未满则收取 12 元运费，运费在下单时一并结算。'),
(6, 2, '发货后会通过短信通知快递单号，可在个人中心查询实时物流状态。'),
(7, 0, '账号安全指南。登录后在个人中心—账号安全—修改密码中操作，需验证原密码和手机验证码。'),
(7, 1, '忘记密码可在登录页点击忘记密码，通过注册手机号接收验证码后重置。'),
(7, 2, '建议开启登录二次验证，定期更换密码，不要与其他网站使用相同密码。'),
(8, 0, '支付方式介绍。支持微信支付、支付宝、银联云闪付以及主流银行卡。'),
(8, 1, '企业客户可申请对公转账，到账后 1 个工作日内安排发货。'),
(8, 2, '部分城市支持货到付款，需额外支付 15 元服务费，下单时地址在支持范围内会出现该选项。');
