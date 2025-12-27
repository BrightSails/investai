import { z } from 'zod'

// 注册表单验证
export const registerSchema = z.object({
  username: z.string()
    .min(3, '用户名至少3个字符')
    .max(20, '用户名最多20个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
  password: z.string()
    .min(6, '密码至少6个字符')
    .max(50, '密码最多50个字符'),
})

// 登录表单验证
export const loginSchema = z.object({
  username: z.string().min(1, '请输入用户名'),
  password: z.string().min(1, '请输入密码'),
})

// 投资画像验证
export const profileSchema = z.object({
  riskPreference: z.enum(['保守', '稳健', '激进'], {
    message: '请选择风险偏好'
  }),
  investmentAmount: z.number()
    .min(0, '投资金额不能为负数')
    .max(100000000, '投资金额过大'),
  investmentPeriod: z.enum(['1年以内', '1-3年', '3-5年', '5年以上'], {
    message: '请选择投资期限'
  }),
  investmentGoal: z.enum(['保本增值', '稳健收益', '高收益增长'], {
    message: '请选择投资目标'
  }),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ProfileInput = z.infer<typeof profileSchema>

// 投资项目验证
export const projectSchema = z.object({
  name: z.string()
    .min(1, '项目名称不能为空')
    .max(50, '项目名称最多50个字符'),
  type: z.enum(['债券', '基金', '股票', '理财产品', '其他'], {
    message: '请选择项目类型'
  }),
  riskLevel: z.number()
    .int('风险等级必须是整数')
    .min(1, '风险等级最低1星')
    .max(5, '风险等级最高5星'),
  expectedReturn: z.number()
    .min(0, '预期收益率不能为负数')
    .max(100, '预期收益率不能超过100%'),
  investmentThreshold: z.number()
    .min(0, '投资门槛不能为负数')
    .max(100000000, '投资门槛过大'),
  description: z.string().optional(),
})

export type ProjectInput = z.infer<typeof projectSchema>
