# 创建并连接 KV 数据库

## 步骤1：创建 KV 数据库

1. 访问：https://vercel.com/dashboard/stores

2. 点击 **"Create Database"** 按钮

3. 选择 **"KV"** (带有 Redis 图标)

4. 填写信息：
   - **Name**: `investai-kv`
   - **Region**: `Hong Kong (hkg1)`

5. 点击 **"Create"** 按钮

---

## 步骤2：连接到项目

创建成功后，在弹出页面：

1. 点击 **"Connect Project"** 按钮

2. 选择项目：**investailiyan**

3. 选择环境（全选）：
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. 点击 **"Connect"** 按钮

---

## 步骤3：验证环境变量

访问：https://vercel.com/liyans-projects-8282cc7f/investailiyan/settings/environment-variables

**应该看到 3 个新变量：**
- ✅ KV_REST_API_URL
- ✅ KV_REST_API_TOKEN
- ✅ KV_REST_API_READ_ONLY_TOKEN

---

## 步骤4：重新部署

环境变量添加后，双击运行：
```
REDEPLOY.bat
```

或执行：
```bash
vercel --prod --force
```

---

完成这 4 步后，网站就能正常访问了！
