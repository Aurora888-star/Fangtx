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
