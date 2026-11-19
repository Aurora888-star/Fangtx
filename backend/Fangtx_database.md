# Fangtx_database.md · 数据库记录

> 记录规则：每次建表、改表或插入数据后，按执行顺序追加对应 SQL 语句（含测试数据的 INSERT）。
> 要求仅凭此文件即可在新机器上完整重建数据库。

数据库：MySQL
- 用户名：root
- 数据库名：见 backend/.env 的 DB_NAME

---

## 初始化

```sql
-- 创建数据库（名称与 backend/.env 中 DB_NAME 保持一致）
CREATE DATABASE IF NOT EXISTS webdesign
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;
```

## 科技新闻表 Fangtx_tech_news（2026-11-19 22:12:00）

```sql
-- 建表：科技新闻表，字段名均以 Fangtx_ 开头
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

-- 插入 10 条真实业务意义的测试数据
INSERT INTO Fangtx_tech_news
  (Fangtx_title, Fangtx_source, Fangtx_category, Fangtx_summary, Fangtx_publish_time, Fangtx_link, Fangtx_views)
VALUES
  ('OpenAI 发布 GPT-5 模型，多模态推理能力显著提升', '科技日报', '人工智能', 'OpenAI 正式推出新一代大模型 GPT-5，在文本、图像与语音的多模态理解上取得突破，推理速度较上一代提升约 2 倍。', '2026-11-18 09:30:00', 'https://example.com/news/gpt5-release', 15820),
  ('华为 Mate 80 系列正式开售，搭载自研麒麟芯片', '华为官网', '智能手机', '华为 Mate 80 系列面向全球开售，全系搭载新一代自研麒麟处理器，影像系统与卫星通信能力同步升级。', '2026-11-17 10:00:00', 'https://example.com/news/huawei-mate80', 23410),
  ('特斯拉 FSD 自动驾驶系统获得中国道路测试许可', '路透社', '自动驾驶', '特斯拉 FSD 完全自动驾驶系统获批在中国开展公开道路测试，标志其智能驾驶技术进入新的验证阶段。', '2026-11-16 14:20:00', 'https://example.com/news/tesla-fsd-china', 18960),
  ('英伟达发布新一代 Blackwell Ultra GPU，算力提升 40%', '英伟达官网', '硬件芯片', '英伟达推出 Blackwell Ultra 架构 GPU，面向数据中心与 AI 训练场景，单卡算力较前代提升约 40%。', '2026-11-15 11:00:00', 'https://example.com/news/nvidia-blackwell-ultra', 31250),
  ('中国空间站完成新一轮科学实验设备部署', '新华社', '航天科技', '中国空间站顺利完成后续科学实验柜的在轨部署，涵盖生命科学、材料科学等多个前沿研究方向。', '2026-11-14 08:45:00', 'https://example.com/news/space-station-lab', 12740),
  ('字节跳动推出豆包大模型 2.0，代码生成能力开源', '36氪', '人工智能', '字节跳动发布豆包大模型 2.0 版本，并开源其代码生成专项模型，在多项编程基准测试中表现优异。', '2026-11-13 16:10:00', 'https://example.com/news/doubao-2', 20180),
  ('苹果 Vision Pro 头显 2026 年出货量突破百万台', '彭博社', '消费电子', '市场研究数据显示，苹果 Vision Pro 空间计算头显累计出货量已突破一百万台，超出此前市场预期。', '2026-11-12 13:05:00', 'https://example.com/news/vision-pro-sales', 14320),
  ('比亚迪刀片电池 2.0 发布，能量密度提升 25%', '比亚迪官网', '新能源', '比亚迪发布第二代刀片电池技术，能量密度提升 25%，并支持更快的充电速度与更长的使用寿命。', '2026-11-11 09:15:00', 'https://example.com/news/byd-blade-battery-2', 17650),
  ('微软 Azure 云业务营收创新高，AI 服务贡献显著', '微软财报', '云计算', '微软最新季度财报显示 Azure 云业务营收创历史新高，其中 AI 相关服务成为主要增长驱动力。', '2026-11-10 15:40:00', 'https://example.com/news/azure-revenue', 11980),
  ('小米汽车新车型开启预售，续航里程达 1200 公里', '小米官网', '智能汽车', '小米汽车全新车型正式开启预售，搭载新一代电池包与电驱系统，CLTC 综合续航里程达到 1200 公里。', '2026-11-09 10:20:00', 'https://example.com/news/xiaomi-ev-new', 26540);
```

## 图文列表表 Fangtx_gallery（2026-11-19 22:17:00）

```sql
-- 建表：图文列表表，字段名均以 Fangtx_ 开头
CREATE TABLE IF NOT EXISTS Fangtx_gallery (
  Fangtx_id INT AUTO_INCREMENT PRIMARY KEY,
  Fangtx_title VARCHAR(200) NOT NULL COMMENT '图文标题',
  Fangtx_image VARCHAR(300) NOT NULL COMMENT '封面图片路径',
  Fangtx_category VARCHAR(50) NOT NULL COMMENT '图文分类',
  Fangtx_description TEXT NOT NULL COMMENT '图文简介',
  Fangtx_author VARCHAR(100) NOT NULL COMMENT '作者',
  Fangtx_publish_time DATETIME NOT NULL COMMENT '发布时间',
  Fangtx_likes INT NOT NULL DEFAULT 0 COMMENT '点赞数'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 插入 10 条真实业务意义的测试数据（封面图片为 frontend/images/ 下的原生 SVG）
INSERT INTO Fangtx_gallery
  (Fangtx_title, Fangtx_image, Fangtx_category, Fangtx_description, Fangtx_author, Fangtx_publish_time, Fangtx_likes)
VALUES
  ('当人工智能走进日常生活', 'images/Fangtx_pic_01.svg', '人工智能', '从智能音箱到自动驾驶，人工智能正在悄然改变我们的每一天。本文带你梳理那些已经落地的应用。', '林知远', '2026-11-18 09:00:00', 2340),
  ('一个人的远方：城市漫游指南', 'images/Fangtx_pic_02.svg', '旅行', '不必远行千里，城市街巷里也藏着惊喜。收下这份漫游指南，重新发现熟悉的城市。', '苏念', '2026-11-17 11:30:00', 1820),
  ('手冲咖啡的味觉哲学', 'images/Fangtx_pic_03.svg', '生活', '一杯好咖啡，是水温、研磨与时间的精准配合。走进手冲咖啡的世界，感受慢下来的美好。', '陈默', '2026-11-16 14:15:00', 1560),
  ('用镜头捕捉城市的光影', 'images/Fangtx_pic_04.svg', '摄影', '晨昏交替之间，光线赋予城市不同的情绪。分享几个实用的光影摄影构图技巧。', '顾青', '2026-11-15 08:40:00', 2980),
  ('音乐是如何影响情绪的', 'images/Fangtx_pic_05.svg', '音乐', '为什么有些旋律能让人瞬间落泪？从心理学角度解读音乐与情绪之间的奇妙联系。', '周音', '2026-11-14 16:20:00', 3210),
  ('在书香中安放心灵', 'images/Fangtx_pic_06.svg', '阅读', '碎片化时代，深度阅读显得愈发珍贵。推荐几本值得反复品读的好书。', '许文', '2026-11-13 10:05:00', 1420),
  ('坚持运动的第一个月', 'images/Fangtx_pic_07.svg', '健身', '从零开始的健身记录，分享新手最容易坚持的训练方式与饮食心得。', '李燃', '2026-11-12 07:30:00', 2760),
  ('数码好物提升幸福感', 'images/Fangtx_pic_08.svg', '科技', '盘点那些真正提升生活品质的数码设备，让科技服务于日常而非制造负担。', '吴极', '2026-11-11 13:45:00', 2090),
  ('去山野间寻找自然的声音', 'images/Fangtx_pic_09.svg', '自然', '远离喧嚣，走进山林。一次徒步带来的不仅是风景，更是内心的平静。', '沈野', '2026-11-10 09:50:00', 1880),
  ('人间烟火，最抚凡人心', 'images/Fangtx_pic_10.svg', '美食', '从街边小馆到家常味道，用味蕾记录那些温暖而真实的生活瞬间。', '何味', '2026-11-09 18:10:00', 3540);
```

> 后续每次建表 / 改表 / 插入测试数据后，将继续按执行顺序在此追加 SQL。
