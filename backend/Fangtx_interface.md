# Fangtx_interface.md · 接口记录

> 记录规则：每次创建或修改接口后，追加：接口路径 | HTTP 方法 | 请求参数（含示例）| 响应格式（含 JSON 示例）| 修改时间
> 统一响应格式：`{ "code": 0, "msg": "提示信息", "data": {...} }`，code=0 表示成功，非 0 表示失败。

---

## 接口：健康检查

- **接口路径**：`/api/health`
- **HTTP 方法**：GET
- **请求参数**：无

请求示例：

```
GET http://localhost:8733/api/health
```

- **响应格式**：

```json
{
  "code": 0,
  "msg": "服务运行正常",
  "data": {
    "service": "Fangtx 知乎模仿项目后端",
    "version": "1.0.0",
    "status": "running",
    "timestamp": "2026-11-19T07:10:00.000Z"
  }
}
```

- **修改时间**：2026-11-19 15:10:00

---

## 接口：数据库健康检查

- **接口路径**：`/api/db/health`
- **HTTP 方法**：GET
- **请求参数**：无

请求示例：

```
GET http://localhost:8733/api/db/health
```

- **响应格式（成功）**：

```json
{
  "code": 0,
  "msg": "数据库连接正常",
  "data": { "result": 2 }
}
```

- **响应格式（失败）**：

```json
{
  "code": 5001,
  "msg": "数据库连接失败: connect ECONNREFUSED 127.0.0.1:3306",
  "data": null
}
```

- **修改时间**：2026-11-19 15:10:00

---

## 接口：数据库连接测试

- **接口路径**：`/api/db/connect`
- **HTTP 方法**：POST
- **请求参数**：JSON

请求示例：

```
POST http://localhost:8733/api/db/connect
Content-Type: application/json

{ "username": "root", "password": "见 backend/.env 的 DB_PASSWORD" }
```

- **响应格式（成功）**：

```json
{
  "code": 0,
  "msg": "数据库连接成功",
  "data": {
    "host": "localhost",
    "user": "root",
    "database": "webdesign",
    "mysqlVersion": "8.0.30",
    "time": "2026-11-19T14:10:00.000Z"
  }
}
```

- **响应格式（失败 - 凭据错误）**：

```json
{
  "code": 5002,
  "msg": "数据库连接失败: Access denied for user 'root'@'localhost' (using password: YES)",
  "data": null
}
```

- **响应格式（失败 - 参数缺失）**：

```json
{
  "code": 4001,
  "msg": "请输入用户名和密码",
  "data": null
}
```

- **修改时间**：2026-11-19 22:10:00

---

## 接口：科技新闻列表

- **接口路径**：`/api/news`
- **HTTP 方法**：GET
- **请求参数**：无

请求示例：

```
GET http://localhost:8733/api/news
```

- **响应格式（成功）**：

```json
{
  "code": 0,
  "msg": "新闻列表获取成功",
  "data": {
    "total": 10,
    "list": [
      {
        "Fangtx_id": 1,
        "Fangtx_title": "OpenAI 发布 GPT-5 模型，多模态推理能力显著提升",
        "Fangtx_source": "科技日报",
        "Fangtx_category": "人工智能",
        "Fangtx_summary": "OpenAI 正式推出新一代大模型 GPT-5...",
        "Fangtx_publish_time": "2026-11-18T09:30:00.000Z",
        "Fangtx_link": "https://example.com/news/gpt5-release",
        "Fangtx_views": 15820
      }
    ]
  }
}
```

- **响应格式（失败）**：

```json
{
  "code": 5003,
  "msg": "新闻列表查询失败: ...",
  "data": null
}
```

- **修改时间**：2026-11-19 22:12:00

---

## 接口：图文列表

- **接口路径**：`/api/gallery`
- **HTTP 方法**：GET
- **请求参数**：无

请求示例：

```
GET http://localhost:8733/api/gallery
```

- **响应格式（成功）**：

```json
{
  "code": 0,
  "msg": "图文列表获取成功",
  "data": {
    "total": 10,
    "list": [
      {
        "Fangtx_id": 1,
        "Fangtx_title": "当人工智能走进日常生活",
        "Fangtx_image": "images/Fangtx_pic_01.svg",
        "Fangtx_category": "人工智能",
        "Fangtx_description": "从智能音箱到自动驾驶...",
        "Fangtx_author": "林知远",
        "Fangtx_publish_time": "2026-11-18T01:00:00.000Z",
        "Fangtx_likes": 2340
      }
    ]
  }
}
```

- **响应格式（失败）**：

```json
{
  "code": 5004,
  "msg": "图文列表查询失败: ...",
  "data": null
}
```

- **修改时间**：2026-11-19 22:17:00

---

## 接口：AI 聊天

- **接口路径**：`/api/chat`
- **HTTP 方法**：POST
- **请求参数**（二选一）：
  - `messages`：数组，多轮对话，每项 `{ role: "user"|"assistant", content: string }`
  - `message`：字符串，单轮对话内容

请求示例（多轮）：

```
POST http://localhost:8733/api/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "你好，请介绍一下你自己" }
  ]
}
```

请求示例（单轮）：

```json
{ "message": "你好" }
```

后端自动注入 system 提示「你是一个有用的助手」，调用硅基流动 `deepseek-ai/DeepSeek-V4-Flash` 模型；API Key 从 `.env` 读取。服务端控制台会完整打印发送给大模型的数据与从大模型接收到的数据。

- **响应格式（成功）**：

```json
{
  "code": 0,
  "msg": "聊天回复成功",
  "data": {
    "reply": "你好！我是 DeepSeek，一个由深度求索公司创造的AI助手...",
    "model": "deepseek-ai/DeepSeek-V4-Flash",
    "usage": { "prompt_tokens": 14, "completion_tokens": 165, "total_tokens": 179 },
    "requestPayload": { "model": "deepseek-ai/DeepSeek-V4-Flash", "messages": [] },
    "rawResponse": {}
  }
}
```

- **响应格式（失败）**：

```json
{
  "code": 5002,
  "msg": "大模型请求失败: ...",
  "data": null
}
```

- **修改时间**：2026-11-23 14:00:54

---

## 接口：知识库文件列表

- **接口路径**：`/api/knowledge/files`
- **HTTP 方法**：GET
- **请求参数**：无

请求示例：

```
GET http://localhost:8733/api/knowledge/files
```

- **响应格式（成功）**：

```json
{
  "code": 0,
  "msg": "知识库文件列表获取成功",
  "data": {
    "total": 8,
    "list": [
      {
        "Fangtx_id": 1,
        "Fangtx_filename": "智能客服FAQ.docx",
        "Fangtx_file_type": "docx",
        "Fangtx_file_size": 2708,
        "Fangtx_chunk_count": 14,
        "Fangtx_status": "ready",
        "Fangtx_upload_time": "2026-11-23T02:00:00.000Z"
      }
    ]
  }
}
```

- **修改时间**：2026-11-23 14:22:56

---

## 接口：上传并解析知识库文件

- **接口路径**：`/api/knowledge/upload`
- **HTTP 方法**：POST（multipart/form-data）
- **请求参数**：`file` —— 上传的文件，支持 doc/docx/ppt/pptx/pdf/txt/md，最大 10MB

请求示例：

```
POST http://localhost:8733/api/knowledge/upload
Content-Type: multipart/form-data

file=@智能客服FAQ.docx
```

- **响应格式（成功）**：

```json
{
  "code": 0,
  "msg": "文件上传解析成功",
  "data": {
    "Fangtx_id": 9,
    "Fangtx_filename": "智能客服FAQ.docx",
    "Fangtx_file_type": "docx",
    "Fangtx_chunk_count": 26,
    "Fangtx_preview": "方天箫智能客服知识库..."
  }
}
```

- **响应格式（失败）**：`{ "code": 4004, "msg": "不支持的文件格式...", "data": null }`

- **修改时间**：2026-11-23 14:22:56

---

## 接口：删除知识库文件

- **接口路径**：`/api/knowledge/file/:id`
- **HTTP 方法**：DELETE
- **请求参数**：路径参数 `id` —— 文件 ID

请求示例：

```
DELETE http://localhost:8733/api/knowledge/file/9
```

- **响应格式（成功）**：`{ "code": 0, "msg": "知识库文件删除成功", "data": { "Fangtx_id": 9 } }`

- **修改时间**：2026-11-23 14:22:56

---

## 接口：基于知识库的问答（RAG）

- **接口路径**：`/api/knowledge/ask`
- **HTTP 方法**：POST
- **请求参数**：`question` —— 用户问题（字符串）

请求示例：

```json
{ "question": "客服的工作时间是什么时候？" }
```

后端先从 `Fangtx_knowledge_chunk` 表按关键词匹配检索相关分块，拼接为上下文注入 system 提示，再调用硅基流动大模型；控制台完整打印发送给大模型与从大模型接收到的数据。

- **响应格式（成功）**：

```json
{
  "code": 0,
  "msg": "知识库问答成功",
  "data": {
    "reply": "我们的在线客服工作时间为每周一至周日 09:00 至 21:00...",
    "question": "客服的工作时间是什么时候？",
    "sources": [
      {
        "Fangtx_filename": "智能客服FAQ.docx",
        "Fangtx_chunk_index": 1,
        "Fangtx_score": 10,
        "Fangtx_content": "问题1：你们的工作时间是什么时候？..."
      }
    ],
    "usage": {},
    "requestPayload": {},
    "rawResponse": {}
  }
}
```

- **响应格式（失败）**：`{ "code": 4001, "msg": "请输入问题", "data": null }`

- **修改时间**：2026-11-23 14:22:56

---

## Harness Engineering 结构化抽取 —— 返回 JSON 数据设计（先设计，后实现）

设计目标：把自然语言（商业评论）或图片 OCR 识别出的文字，通过受约束的 Prompt + JSON 模式输出，转换为稳定可解析的结构化数据。统一响应包仍为 `{ code, msg, data }`，`data` 结构如下。

### data 字段设计

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `task` | string | `text_extract` 文本抽取 / `image_ocr` 图片识别抽取 |
| `source` | string | 原始评论文本，或图片文件名 |
| `schemaVersion` | string | 固定 `Fangtx_harness_v1`，便于后续兼容 |
| `result` | object | 结构化抽取核心结果 |
| `result.overall` | object | 整体情感：`sentiment`（positive/negative/neutral/mixed）、`score`（0~1）、`confidence`（0~1）、`summary` |
| `result.aspects` | array | 方面情感：`target`、`category`、`sentiment`、`score`、`evidence`（必须引用原文片段） |
| `result.entities` | array | 实体抽取：`name`、`type`（人物/品牌/产品/地点/其他）、`sentiment`、`mentions` |
| `result.keywords` | array | 关键词数组，最多 8 个 |
| `result.intent` | string | `praise`/`complaint`/`suggestion`/`question`/`other` |
| `result.suggestions` | array | 针对评论的可执行建议，最多 3 条 |
| `ocr` | object\|null | 图片模式专有：`text`（OCR 全文）、`language`、`image`（fileName/mimeType/size）；文本模式为 `null` |
| `meta` | object | `model`、`promptVersion`、`createdAt`、`usage`、`rawResponse`（大模型原始响应） |

### 成功响应示例（文本模式）

```json
{
  "code": 0,
  "msg": "结构化抽取成功",
  "data": {
    "task": "text_extract",
    "source": "手机轻薄手感很好，电池续航一整天，就是拍照夜景噪点太多，客服回复很慢。",
    "schemaVersion": "Fangtx_harness_v1",
    "result": {
      "overall": {
        "sentiment": "mixed",
        "score": 0.55,
        "confidence": 0.9,
        "summary": "用户对轻薄与续航满意，但夜景拍照和客服响应存在明显不满。"
      },
      "aspects": [
        { "target": "外观手感", "category": "设计", "sentiment": "positive", "score": 0.92, "evidence": "轻薄手感很好" },
        { "target": "电池续航", "category": "性能", "sentiment": "positive", "score": 0.88, "evidence": "电池续航一整天" },
        { "target": "夜景拍照", "category": "影像", "sentiment": "negative", "score": 0.2, "evidence": "拍照夜景噪点太多" },
        { "target": "客服响应", "category": "服务", "sentiment": "negative", "score": 0.25, "evidence": "客服回复很慢" }
      ],
      "entities": [
        { "name": "客服", "type": "其他", "sentiment": "negative", "mentions": 1 }
      ],
      "keywords": ["轻薄", "续航", "夜景噪点", "客服回复慢"],
      "intent": "complaint",
      "suggestions": ["优化夜景降噪算法", "缩短客服首响时间"]
    },
    "ocr": null,
    "meta": {
      "model": "deepseek-ai/DeepSeek-V4-Flash",
      "promptVersion": "Fangtx_harness_v1",
      "createdAt": "2026-11-23T14:56:00.000Z",
      "usage": {},
      "rawResponse": {}
    }
  }
}
```

### 失败响应示例

```json
{ "code": 4001, "msg": "请输入评论文本", "data": null }
```

- **修改时间**：2026-11-23 14:56

---
