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
