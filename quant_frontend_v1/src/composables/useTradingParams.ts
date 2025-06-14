import { reactive } from 'vue'

export default function useTradingParams() {
    const tradingParams = reactive({
        // 交易触发与执行参数
        signalConfirmationCandles: 1, // TODO：表单-信号确认期
        minHoldingPeriod: 1, // TODO:表单-最小持有期
        maxHoldingPeriod: 30, // TODO:表单-最大持有期，30天更合理
        rebalancePeriod: 20, // TODO:表单-调仓频率，不要过小，避免过拟合，减少交易成本
        tradingTimeWindow: '09:30-15:00', // TODO:表单-交易时间窗口
        buyThreshold: 1.02 as (number | string), // 表单-购买信号阈值
        sellThreshold: 0.98 as (number | string), // 表单-出售信号阈值
        multiSignalCombination: 'AND', // TODO:表单-信号组合方式（AND/OR）
        signalFilterConditions: [ // TODO：表单-信号过滤规则（通过同时满足过滤？）
            { type: 'AND', condition: 'volume > avg_volume_20' },
            { type: 'AND', condition: 'price > ma_50' }
        ],
        signalCooldown: 5 as (number | string), // TODO:表单-信号冷却时间，5天防止频繁交易
        volumeLimit: 0.2 as (number | string), // TODO:表单-交易量限制
        priceImpactLimit: 0.01 as (number | string), // TODO:表单-价格冲击控制阈值
        batchTrading: false, // TODO:表单-是否启用分批建仓，默认关闭
        entryBatches: 3, // TODO:表单-如果开启分批建仓，一般3比较合理
        // 交易成本与执行参数
        serviceCharge: 0.0003 as (number | string), // 表单-手续费，万分之3的佣金费率
        stampDutyRate: 0.001 as (number | string), // TODO：表单-印花税，千分之1印花税
        transferFeeRate: 0.00002 as (number | string), // TODO:表单-过户费，万分之0.2过户费
        slippageModel: 'fixed', // TODO:表单-滑点模型 (fixed/linear/sqrt)
        fixedSlippage: 0.001 as (number | string), // TODO表单-固定滑点（报单与实际交易的偏差）
        marketImpaceParams: { // TODO:表单-市场冲击参数
            temporary_impact: 0.01,
            permanent_impact: 0.005
        },
        executionAlgorithm: 'TWAP', // TODO:表单-执行算法（TWAP/VWAP/POV）
        minTradeAmount: 1000.0 as (number | string), // TODO：表单-最小交易金额
        orderType: 'market', // TODO:表单-订单类型（market/limit/stop）
    })

    return { tradingParams }
}
