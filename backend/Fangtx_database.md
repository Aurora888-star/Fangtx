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

> 目前尚未创建任何业务数据表。后续每次建表 / 改表 / 插入测试数据后，将按执行顺序在此追加 SQL。
