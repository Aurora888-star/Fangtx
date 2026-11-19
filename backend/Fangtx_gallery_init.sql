-- 姓名：方天箫 | 学号：24001010733 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
-- 图文列表表初始化脚本（字段名均以 Fangtx_ 开头）

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

INSERT INTO Fangtx_gallery
  (Fangtx_title, Fangtx_image, Fangtx_category, Fangtx_description, Fangtx_author, Fangtx_publish_time, Fangtx_likes)
VALUES
  ('当人工智能走进日常生活', 'images/Fangtx_pic_01.svg', '人工智能',
   '从智能音箱到自动驾驶，人工智能正在悄然改变我们的每一天。本文带你梳理那些已经落地的应用。', '林知远', '2026-11-18 09:00:00', 2340),
  ('一个人的远方：城市漫游指南', 'images/Fangtx_pic_02.svg', '旅行',
   '不必远行千里，城市街巷里也藏着惊喜。收下这份漫游指南，重新发现熟悉的城市。', '苏念', '2026-11-17 11:30:00', 1820),
  ('手冲咖啡的味觉哲学', 'images/Fangtx_pic_03.svg', '生活',
   '一杯好咖啡，是水温、研磨与时间的精准配合。走进手冲咖啡的世界，感受慢下来的美好。', '陈默', '2026-11-16 14:15:00', 1560),
  ('用镜头捕捉城市的光影', 'images/Fangtx_pic_04.svg', '摄影',
   '晨昏交替之间，光线赋予城市不同的情绪。分享几个实用的光影摄影构图技巧。', '顾青', '2026-11-15 08:40:00', 2980),
  ('音乐是如何影响情绪的', 'images/Fangtx_pic_05.svg', '音乐',
   '为什么有些旋律能让人瞬间落泪？从心理学角度解读音乐与情绪之间的奇妙联系。', '周音', '2026-11-14 16:20:00', 3210),
  ('在书香中安放心灵', 'images/Fangtx_pic_06.svg', '阅读',
   '碎片化时代，深度阅读显得愈发珍贵。推荐几本值得反复品读的好书。', '许文', '2026-11-13 10:05:00', 1420),
  ('坚持运动的第一个月', 'images/Fangtx_pic_07.svg', '健身',
   '从零开始的健身记录，分享新手最容易坚持的训练方式与饮食心得。', '李燃', '2026-11-12 07:30:00', 2760),
  ('数码好物提升幸福感', 'images/Fangtx_pic_08.svg', '科技',
   '盘点那些真正提升生活品质的数码设备，让科技服务于日常而非制造负担。', '吴极', '2026-11-11 13:45:00', 2090),
  ('去山野间寻找自然的声音', 'images/Fangtx_pic_09.svg', '自然',
   '远离喧嚣，走进山林。一次徒步带来的不仅是风景，更是内心的平静。', '沈野', '2026-11-10 09:50:00', 1880),
  ('人间烟火，最抚凡人心', 'images/Fangtx_pic_10.svg', '美食',
   '从街边小馆到家常味道，用味蕾记录那些温暖而真实的生活瞬间。', '何味', '2026-11-09 18:10:00', 3540);
