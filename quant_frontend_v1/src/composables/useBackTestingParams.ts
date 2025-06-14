import { reactive } from 'vue'

export default function useBackTestingParams() {
    const backTestingParams = reactive({
        // 回测验证参数
        // enableBacktestValidation: false, // TODO：是否启用回测验证
        // inSampleRatio: 0.7, // TODO：样本内数据比例70%
        // outSampleRatio: 0.3, // TODO：样本外数据比例30%
        // rollingWindow: 252, // TODO：滚动窗口252个交易日(1年)
        // lookAheadCheck: true, // TODO：检查前瞻偏差
        // survivorshipBiasAdjustment: true, // TODO：幸存者偏差调整
        // performanceAttribution: false, // TODO：是否进行业绩归因分析
        // benchmarkComparison: true, // TODO：是否与基准对比
        // benchmark: { // TODO：表单-基准，设置默认基准为沪深300
        //   code: '',
        //   market: '',
        //   name: ''
        // },
    })

    return { backTestingParams }
}
