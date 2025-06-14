import { reactive } from 'vue'

// 策略参数配置接口
interface StrategyParamConfig {
    label: string;
    key: string;
    value: number | string;
    type: 'input' | 'select' | 'slider';
    options?: Array<{ label: string; value: any }>; // select类型时使用
    unit?: string; // 新增单位字段
}

// 策略模板接口
interface StrategyTemplate {
    [strategyKey: string]: StrategyParamConfig[];
}

// 默认策略模板配置
export const strategyTemplates: StrategyTemplate = {
    'ma_strategy': [
        {
            label: '均线周期 (MA)',
            key: 'ma',
            value: 20,
            type: 'select',
            unit: '日', // 添加单位
            options: [
                { label: '5日', value: 5 },
                { label: '10日', value: 10 },
                { label: '20日', value: 20 },
                { label: '50日', value: 50 },
                { label: '100日', value: 100 }
            ]
        },
        {
            label: '均线类型',
            key: 'maType',
            value: 'SMA',
            type: 'select',
            options: [
                { label: 'SMA', value: 'SMA' },
                { label: 'EMA', value: 'EMA' },
                { label: 'WMA', value: 'WMA' }
            ]
        },
        { label: '*慢线周期 (可选)', key: 'maSlowInput', value: 20, type: 'input', unit: '日' },
        { label: '*快线周期 (可选)', key: 'maFastInput', value: 5, type: 'input', unit: '日' }
    ],
    'rsi_strategy': [
        { label: 'RSI周期', key: 'rsiPeriod', value: 14, type: 'input', unit: '日' },
        { label: '超买阈值', key: 'overbought', value: 70, type: 'input', unit: '%' },
        { label: '超卖阈值', key: 'oversold', value: 30, type: 'input', unit: '%' }
    ],
    'bolling_band_strategy': [
        { label: '布林带周期', key: 'period', value: 20, type: 'input', unit: '日' },
        { label: '标准差倍数', key: 'stdDev', value: 2, type: 'input', unit: 'σ' }
    ],
    'macd_strategy': [
        { label: '快线周期', key: 'fastPeriod', value: 12, type: 'input', unit: '日' },
        { label: '慢线周期', key: 'slowPeriod', value: 26, type: 'input', unit: '日' },
        { label: '信号线周期', key: 'signalPeriod', value: 9, type: 'input', unit: '日' },
        {
            label: 'MACD类型',
            key: 'macdType',
            value: 'DIFF',
            type: 'select',
            options: [
                { label: 'DIFF', value: 'DIFF' },
                { label: 'DEA', value: 'DEA' },
                { label: 'MACD柱', value: 'MACD' }
            ]
        }
    ]
};

export default function useStrategyParams() {
    // 当前策略类型
    const currentStrategyType = reactive<{ value: string }>({ value: 'ma_strategy' });

    // tips：当前策略的参数配置列表（注意拷贝方式，不要把Templates污染）
    // 初始化时深拷贝模板数据
    const strategyParams = reactive<StrategyParamConfig[]>(
        JSON.parse(JSON.stringify(strategyTemplates.ma_strategy))
    );
    // 设置策略参数配置
    const setStrategyParams = (params: StrategyParamConfig[]) => {
        strategyParams.splice(0, strategyParams.length, ...params);
    };

    // 根据策略类型设置参数
    const setStrategyByType = (strategyType: string) => {
        if (strategyTemplates[strategyType]) {
            currentStrategyType.value = strategyType;
            // 深拷贝避免污染原始模板
            const newParams = JSON.parse(JSON.stringify(strategyTemplates[strategyType]));
            setStrategyParams(newParams);
        }
    };
    const resetToDefault = () => {
        const strategyKey = currentStrategyType.value;
        console.log('template', strategyTemplates[strategyKey])
        if (strategyTemplates[strategyKey]) {
            // 每次重置都深拷贝原始模板
            const newParams = JSON.parse(JSON.stringify(strategyTemplates[strategyKey]));
            setStrategyParams(newParams);
        } else {
            console.warn('未找到当前策略模板:', strategyKey);
        }
    };
    // 更新某个参数的值
    const updateParamValue = (key: string, value: any) => {
        const param = strategyParams.find(p => p.key === key);
        if (param) {
            param.value = value;
        }
    };

    // 获取参数键值对对象（如果需要传给后端）
    const getStrategyParamsObj = () => {
        return strategyParams.reduce((acc, param) => {
            acc[param.key] = param.value;
            return acc;
        }, {} as Record<string, any>);
    };

    return {
        strategyParams, //  当前策略的参数列表（带配置信息）
        setStrategyParams, // 设置当前策略的参数列表
        setStrategyByType, // 根据类型设置策略参数列表
        resetToDefault,
        updateParamValue,
        getStrategyParamsObj
    };
}
