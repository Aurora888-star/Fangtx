-- 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
-- 科技新闻表初始化脚本（字段名均以 Fangtx_ 开头）

CREATE TABLE IF NOT EXISTS Fangtx_tech_news (
  Fangtx_id INT AUTO_INCREMENT PRIMARY KEY,
  Fangtx_title VARCHAR(200) NOT NULL COMMENT '新闻标题',
  Fangtx_source VARCHAR(100) NOT NULL COMMENT '新闻来源',
  Fangtx_category VARCHAR(50) NOT NULL COMMENT '新闻分类',
  Fangtx_summary TEXT NOT NULL COMMENT '新闻摘要',
  Fangtx_publish_time DATETIME NOT NULL COMMENT '发布时间',
  Fangtx_link VARCHAR(500) NOT NULL COMMENT '原文链接',
  Fangtx_views INT NOT NULL DEFAULT 0 COMMENT '阅读量'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO Fangtx_tech_news
  (Fangtx_title, Fangtx_source, Fangtx_category, Fangtx_summary, Fangtx_publish_time, Fangtx_link, Fangtx_views)
VALUES
  ('OpenAI 发布 GPT-5 模型，多模态推理能力显著提升', '科技日报', '人工智能',
   'OpenAI 正式推出新一代大模型 GPT-5，在文本、图像与语音的多模态理解上取得突破，推理速度较上一代提升约 2 倍。',
   '2026-11-18 09:30:00', 'https://example.com/news/gpt5-release', 15820),
  ('华为 Mate 80 系列正式开售，搭载自研麒麟芯片', '华为官网', '智能手机',
   '华为 Mate 80 系列面向全球开售，全系搭载新一代自研麒麟处理器，影像系统与卫星通信能力同步升级。',
   '2026-11-17 10:00:00', 'https://example.com/news/huawei-mate80', 23410),
  ('特斯拉 FSD 自动驾驶系统获得中国道路测试许可', '路透社', '自动驾驶',
   '特斯拉 FSD 完全自动驾驶系统获批在中国开展公开道路测试，标志其智能驾驶技术进入新的验证阶段。',
   '2026-11-16 14:20:00', 'https://example.com/news/tesla-fsd-china', 18960),
  ('英伟达发布新一代 Blackwell Ultra GPU，算力提升 40%', '英伟达官网', '硬件芯片',
   '英伟达推出 Blackwell Ultra 架构 GPU，面向数据中心与 AI 训练场景，单卡算力较前代提升约 40%。',
   '2026-11-15 11:00:00', 'https://example.com/news/nvidia-blackwell-ultra', 31250),
  ('中国空间站完成新一轮科学实验设备部署', '新华社', '航天科技',
   '中国空间站顺利完成后续科学实验柜的在轨部署，涵盖生命科学、材料科学等多个前沿研究方向。',
   '2026-11-14 08:45:00', 'https://example.com/news/space-station-lab', 12740),
  ('字节跳动推出豆包大模型 2.0，代码生成能力开源', '36氪', '人工智能',
   '字节跳动发布豆包大模型 2.0 版本，并开源其代码生成专项模型，在多项编程基准测试中表现优异。',
   '2026-11-13 16:10:00', 'https://example.com/news/doubao-2', 20180),
  ('苹果 Vision Pro 头显 2026 年出货量突破百万台', '彭博社', '消费电子',
   '市场研究数据显示，苹果 Vision Pro 空间计算头显累计出货量已突破一百万台，超出此前市场预期。',
   '2026-11-12 13:05:00', 'https://example.com/news/vision-pro-sales', 14320),
  ('比亚迪刀片电池 2.0 发布，能量密度提升 25%', '比亚迪官网', '新能源',
   '比亚迪发布第二代刀片电池技术，能量密度提升 25%，并支持更快的充电速度与更长的使用寿命。',
   '2026-11-11 09:15:00', 'https://example.com/news/byd-blade-battery-2', 17650),
  ('微软 Azure 云业务营收创新高，AI 服务贡献显著', '微软财报', '云计算',
   '微软最新季度财报显示 Azure 云业务营收创历史新高，其中 AI 相关服务成为主要增长驱动力。',
   '2026-11-10 15:40:00', 'https://example.com/news/azure-revenue', 11980),
  ('小米汽车新车型开启预售，续航里程达 1200 公里', '小米官网', '智能汽车',
   '小米汽车全新车型正式开启预售，搭载新一代电池包与电驱系统，CLTC 综合续航里程达到 1200 公里。',
   '2026-11-09 10:20:00', 'https://example.com/news/xiaomi-ev-new', 26540);
