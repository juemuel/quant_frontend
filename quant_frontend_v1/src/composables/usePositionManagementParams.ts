import { reactive } from 'vue'

export default function usePositionManagementParams() {
    const positionParams = reactive({
        // 仓位管理相关
        enablePositionManagement: false, // 控制是否启用“仓位管理”模块
        maxPositionsNum: 20.0, // TODO：最大持仓，20只易管理
        // minPositionsNum: 1.0, // TODO：最小持仓
        // pyramiding: 1, // TODO：最大加仓次数，默认不加仓
        // maxIndividualWeight: 10.0, // TODO：单只标的最大权重
        // minIndividualWeight: 1.0, // TODO：单只标的最小权重
        // maxSectorWeight: 30.0, // TODO：单行业最大权重
        // cashReserveRatio: 5.0, // TODO：现金预留比例 (%)，是不是就是1-最大仓位？
        // leverageRatio: 1.0, // TODO：杠杆使用倍数（1-3），默认不使用1
        // positionAdjustmentThreshold: 0.05, // TODO：仓位调整阈值5%
        // rebalanceMethod: 'equal_weight', // TODO：再平衡方法(equal_weight/market_cap/risk_parity)
    })

    return { positionParams }
}
