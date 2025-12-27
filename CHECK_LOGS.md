# 检查部署日志

## 📊 查看实时日志

访问这个页面查看函数运行日志：

```
https://vercel.com/liyans-projects-8282cc7f/investailiyan/logs
```

或者：

```
https://vercel.com/liyans-projects-8282cc7f/investailiyan/deployments
```

点击最新的部署 → **"Functions"** 标签 → 查看运行时日志

---

## 🔍 常见错误排查

### 错误1：KV_REST_API_URL is not defined

**原因**：KV 数据库环境变量未正确设置

**解决**：
1. 访问：https://vercel.com/dashboard/stores
2. 点击您的 KV 数据库
3. 确认 Connected Projects 包含 investailiyan
4. 重新部署

---

### 错误2：Connection timeout

**原因**：Redis 连接超时

**解决**：
1. 检查 Redis 数据库区域是否选择了 Hong Kong
2. 重新创建 KV 数据库，选择正确的区域

---

### 错误3：Authentication failed

**原因**：Redis 密钥不正确

**解决**：
1. 删除旧的连接
2. 重新连接 KV 数据库到项目

---

## ✅ 成功标志

如果看到以下日志，说明成功：

```
[GET] /api/profile - 200 (50ms)
[POST] /api/auth/login - 200 (120ms)
[GET] /api/projects - 200 (35ms)
```

响应时间应该在 100ms 以内！
