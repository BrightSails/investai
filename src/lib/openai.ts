// OpenAI API 调用封装

export interface RecommendationRequest {
  userProfile: {
    riskPreference: string;
    investmentAmount: number;
    investmentPeriod: string;
    investmentGoal: string;
  };
  projects: Array<{
    id: number;
    name: string;
    type: string;
    riskLevel: number;
    expectedReturn: number;
    investmentThreshold: number;
    description?: string;
  }>;
}

export interface ProjectAllocation {
  projectId: number;
  projectName: string;
  allocationType: string;
  allocationRatio: number; // 百分比
  expectedReturnContribution: number;
  riskWarning: string;
}

export interface RecommendationResponse {
  overallExpectedReturn: number; // 综合预期收益率
  overallRiskLevel: number; // 整体风险等级 1-5
  matchScore: number; // 适配度 0-100
  projectAllocations: ProjectAllocation[];
  reasoning: string; // 推荐理由
}

export async function generateRecommendation(
  request: RecommendationRequest,
  apiKey: string,
  apiUrl: string = 'https://api.openai.com/v1/chat/completions'
): Promise<RecommendationResponse> {
  const { userProfile, projects } = request;

  // 根据风险偏好设定配置规则
  const riskRules = {
    '保守': '低风险项目（1-2星）占比≥70%，中风险项目（3星）≤30%，无高风险项目',
    '稳健': '低风险+中低风险项目占比≥60%，中风险项目占比30%，中高风险项目（4星）≤10%',
    '激进': '中高风险+高风险项目（4-5星）占比≥60%，中风险项目≤30%，低风险项目≤10%'
  };

  const systemPrompt = `你是一位专业的投资顾问。请根据用户的投资画像和可选项目库，生成个性化的投资配置方案。

**配置规则：**
${riskRules[userProfile.riskPreference as keyof typeof riskRules] || riskRules['稳健']}

**输出要求：**
1. 综合预期收益率（加权平均）
2. 整体风险等级（1-5，根据配置项目的风险加权计算）
3. 适配度评分（0-100，评估方案与用户需求的匹配程度）
4. 项目配置列表（每个项目的配置比例、预期收益贡献、风险提示）
5. 推荐理由（简要说明为何这样配置）

**重要约束：**
- 所有配置比例之和必须等于100%
- 单个项目投资额 = 用户投资金额 × 配置比例，必须≥项目投资门槛
- 如果某个项目的投资门槛过高，不应包含在配置中
- 严格遵守用户的风险偏好配置规则

请以JSON格式返回结果。`;

  const userPrompt = `
**用户投资画像：**
- 风险偏好：${userProfile.riskPreference}
- 投资金额：¥${userProfile.investmentAmount.toLocaleString()}
- 投资期限：${userProfile.investmentPeriod}
- 投资目标：${userProfile.investmentGoal}

**可选项目库：**
${projects.map(p => `
- 项目ID: ${p.id}
- 项目名称：${p.name}
- 项目类型：${p.type}
- 风险等级：${p.riskLevel}星
- 预期收益率：${p.expectedReturn}%
- 投资门槛：¥${p.investmentThreshold.toLocaleString()}
- 项目描述：${p.description || '无'}
`).join('\n')}

请生成投资配置方案，返回格式如下：
{
  "overallExpectedReturn": 5.2,
  "overallRiskLevel": 2,
  "matchScore": 92,
  "projectAllocations": [
    {
      "projectId": 1,
      "projectName": "项目名称",
      "allocationType": "债券",
      "allocationRatio": 40,
      "expectedReturnContribution": 2.0,
      "riskWarning": "低风险，本金安全性高"
    }
  ],
  "reasoning": "根据您的保守型风险偏好..."
}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API调用失败: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('API返回内容为空');
    }

    // 解析 JSON 响应
    const result = JSON.parse(content);

    // 验证结果
    if (!result.projectAllocations || result.projectAllocations.length === 0) {
      throw new Error('未生成有效的项目配置');
    }

    return result;
  } catch (error) {
    console.error('OpenAI API 调用错误:', error);
    throw error;
  }
}
