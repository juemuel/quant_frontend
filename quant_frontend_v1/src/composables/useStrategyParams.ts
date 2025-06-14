import { reactive } from 'vue'

export default function useStrategyParams() {
  const strategyParams = reactive({
    ma: 20 as (number | string), // 表单-均线，20日均线是常用参数
    maType: 'SMA', // TODO:表单-均线类型
    maSlowInput: 20 as (number | string), // TODO:表单-慢线周期
    maFastInput: 5 as (number | string), // TODO:表单-快线周期
  })

  return { strategyParams }
}
