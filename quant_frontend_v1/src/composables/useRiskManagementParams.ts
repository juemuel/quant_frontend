import { reactive } from 'vue'

export default function useRiskManagementParams() {
    const riskParams = reactive({
        // 风险管理相关
        enableRiskManagement: false, // 控制是否启用“风险管理”模块
        stopLoss: 0.08 as (number | string), // TODO：个股止损阈值 (0.0-1.0)，8%避免频繁止损
        takeProfit: 0.15 as (number | string), // TODO：个股止盈阈值 (0.0-1.0)，15%让利润奔跑
        // maxDrawdown: 0.15 as (number | string), // TODO：最大回撤限制 (0.0-1.0)，15%更保守
        // dailyLossLimit: 0.02, // TODO：单日最大损失 (2%)
        // positionRisk: 0.005, // TODO:单笔交易风险 (0.5%)
        // varLimit: 0.05 as (number | string), // TODO：组合风险限制 (0.0-1.0)
        // volatilityLimit: 0.20 as (number | string), // TODO：组合波动限制 (0.0-1.0)，20%更现实
        // betaLimit: 1.5 as (number | string), // TODO：组合beta限制 (0.0-1.0)
        // minSharpeRatio: 0.5 as (number | string), // TODO：单日最小夏普比 (0.0-1.0)
        // maxConsecutiveLosses: 3, // TODO：单日最大连续亏损次数
        // riskBudget: 50000.0, // TODO：总风险预算 (元)
    })

    return { riskParams }
}
