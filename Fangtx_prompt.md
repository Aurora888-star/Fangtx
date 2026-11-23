# Fangtx_prompt.md · 开发提示词记录

> 记录规则：每次向 AI 发出开发指令后，追加记录：时间 | 提示词全文 | 大模型名称

---

## 2026-11-19 15:10:00

**大模型**：DeepSeek-V4.1-Flash

**提示词全文**：

```
请初始化本项目：
1、 git init + .gitignore（排除 node_modules、.env）+ 首次提交
2、按 AGENTS.md 规则创建前后端目录骨架、安装依赖、
3、创建前端首页index.html，包括姓名：方天箫、学号：24001010733、知乎的模仿与制作、项目类别（模仿），所有完成的html页面的超链接。有canvas背景动画。主体是页面链接导航。页面美观。
4、创建readme.md，在根目录下，包括学号、姓名。
```

---

## 2026-11-19 21:39:25

**大模型**：DeepSeek-V4.1-Flash

**提示词全文**：

```
请初始化本项目：
1、 git init + .gitignore（排除 node_modules、.env）+ 首次提交
2、按 AGENTS.md 规则创建前后端目录骨架、安装依赖、
3、创建前端首页index.html，包括姓名：方天箫**、学号：24001010733**、知乎的模仿与制作、项目类别（模仿），所有完成的html页面的超链接。有canvas背景动画。主体是页面链接导航。页面美观。
4、创建readme.md，在根目录下，包括学号、姓名。
```

---

## 2026-11-19 22:09:05

**大模型**：DeepSeek-V4.1-Flash

**提示词全文**：

```
创建database.html页面，输入用户名，密码，链接数据库，数据库使用mysql，成功和错误都有提示，用户名root，密码Hei434@ke53~。
```

---

## 2026-11-19 22:13:29

**大模型**：DeepSeek-V4.1-Flash

**提示词全文**：

```
完成科技新闻列表页面，新闻的数据存在数据库表里。网页显示后端接口链接和数据内容
```

---

## 2026-11-19 22:17:24

**大模型**：DeepSeek-V4.1-Flash

**提示词全文**：

```
完成图文列表，图片可以使用网络图片或创建图片，创建一个新的表，网页显示后端接口链接和数据内容
```

---

## 2026-11-19 23:05:53

**大模型**：DeepSeek-V4.1-Flash

**提示词全文**：

```
创建技能 skill：提交到 GitHub，将本项目提交 commit 并 push到https://gitee.com/fang-tianxiao/fangtx-web.git使用已设置公钥。
```

---

## 2026-11-19 23:16:34

**大模型**：DeepSeek-V4.1-Flash

**提示词全文**：

```
这个姓名可以帮我改成FTX吗
```

---

## 2026-11-23 14:00:54

**大模型**：DeepSeek-V4.1-Flash

**提示词全文**：

```
创建AI聊天页面。
Api-key：sk-bnwe***（已脱敏，完整密钥见 backend/.env）
curl --request POST \
--url https://api.siliconflow.cn/v1/chat/completions \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_API_KEY" \
-d '{
"model": "deepseek-ai/DeepSeek-V4-Flash",
"messages": [
{"role": "system", "content": "你是一个有用的助手"},
{"role": "user", "content": "你好，请介绍一下你自己"}
]
}'
在控制台里输出发送给大模型的数据和从大模型接收到的数据。
```

---

## 2026-11-23 14:22:56

**大模型**：DeepSeek-V4.1-Flash

**提示词全文**：

```
完成知识库文件上传功能，构建2个知识库文件，完成基于知识库的问答，支持doc和docx，ppt，完成知识库管理（RAG）：基于本地文件（如 PDF/TXT）上传、解析，构建专属自动客服或问答系统，包括知识库文件上传模块。在控制台输出发送给大模型的数据和接受自大模型的数据。
```

---

## 2026-11-23 14:33

**大模型**：Tencent Hunyuan Hy

**提示词全文**：

```
@image#1:Clipboard_Screenshot.png 这个不能聊天
（附图：浏览器以 file:///D:/Webdesign/frontend/chat.html 打开 AI 聊天页，发送消息后提示“抱歉，网络请求失败：Failed to fetch”）
```

---

## 2026-11-23 14:56

**大模型**：Tencent Hunyuan Hy

**提示词全文**：

```
Harness Engineering：如商业评论情感分类、实体抽取等，将自然语言转化为结构化 JSON 数据，先设计返回的JSON数据。
基于LLM API调用的自选题目（如ocr、图像识别、录音和语音识别）。
```

---

## 2026-11-23 17:30

**大模型**：Tencent Hunyuan Hy

**提示词全文**：

```
我之前已经完成以下步骤：创建技能 skill：提交到 GitHub，将本项目提交 commit 并 push到https://github.com/Aurora888-star/Fangtx.git使用已设置公钥。
但是现在我的代码更新了，请帮我更新的代码更新发到这个github上面
```

---
