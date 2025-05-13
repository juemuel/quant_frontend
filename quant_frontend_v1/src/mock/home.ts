// 今日市场数据
export const todayMarkets = {
    stock: {
        title: '今日股票',
        data: [
            { name: '宁德时代', code: '300750', price: '198.56', change: 5.67 },
            { name: '恒瑞医药', code: '600276', price: '32.45', change: -4.56 },
            { name: '比亚迪', code: '002594', price: '245.89', change: 4.23 },
            { name: '隆基股份', code: '601012', price: '45.67', change: -3.89 },
            { name: '中国平安', code: '601318', price: '45.23', change: 5.86 },
            { name: '药明康德', code: '603259', price: '78.34', change: -3.43 },
            { name: '贵州茅台', code: '600519', price: '1689.00', change: 3.35 },
            { name: '五方控股', code: '300093', price: '18.76', change: -3.12 },
            { name: '招商银行', code: '600036', price: '35.68', change: 2.98 },
            { name: '迈瑞医疗', code: '300760', price: '289.45', change: -2.87 },
        ],
        updateTime: '2023-07-04 15:30:00'
    },
    index: {
        title: '今日指数',
        data: [
            { name: '新能源指数', code: '399989', price: '2345.67', change: 3.45 },
            { name: '房地产指数', code: '399393', price: '1234.56', change: 3.21 },
            { name: '半导体指数', code: '399678', price: '3456.78', change: 2.89 },
            { name: '银行指数', code: '399986', price: '2345.67', change: -2.87 },
            { name: '医药指数', code: '399989', price: '4567.89', change: 2.34 },
            { name: '房地指数', code: '399989', price: '3456.78', change: 2.45 },
            { name: '消费指数', code: '399997', price: '5678.90', change: -2.12 },
            { name: '保安指数', code: '399998', price: '4567.89', change: 2.12 },
            { name: '科技指数', code: '399906', price: '6789.01', change: 1.98 },
            { name: '创业指数', code: '399987', price: '5678.90', change: -1.98 },
        ],
        updateTime: '2023-07-04 15:30:00'
    },
    futures: {
        title: '今日期货',
        data: [
            { name: '沪金主力', code: 'AU2312', price: '389.25', change: 4.56 },
            { name: '螺纹主力', code: '(RB2312', price: '3756.00', change: -3.43 },
            { name: '沪铜主力', code: 'CU2312', price: '678.90', change: 3.89 },
            { name: '热卷主力', code: 'HC2312', price: '4567.89', change: -3.12 },
            { name: '沪铝主力', code: 'AL2312', price: '567.89', change: 3.45 },
            { name: '焦炭主力', code: 'J2312', price: '2345.67', change: -2.87 },
            { name: '沪锡主力', code: 'NI2312', price: '156.78', change: 3.13 },
            { name: '焦煤主力', code: 'JM2312', price: '1678.90', change: -2.45 },
            { name: '沪镍主力', code: 'SN2312', price: '234.56', change: 2.87 },
            { name: '铁矿主力', code: 'I2312', price: '890.12', change: -2.12 },
        ],
        updateTime: '2023-07-04 15:30:00'
    }
}
// 自选市场数据
export const favoriteMarkets = {
    stock: {
        title: '自选股票',
        data: [
            { name: '腾讯控股', code: '00700', price: 340.2, change: 2.15 },
            { name: '美团-W', code: '03690', price: 145.5, change: -1.52 },
            { name: '恒瑞医药', code: '600276', price: '32.45', change: -1.36 },
            { name: '比亚迪', code: '002594', price: '245.89', change: 2.23 },
            { name: '隆基股份', code: '601012', price: '45.67', change: -3.89 },
            { name: '中国平安', code: '601318', price: '45.23', change: 1.86 },
            { name: '药明康德', code: '603259', price: '78.34', change: -2.43 },
            { name: '贵州茅台', code: '600519', price: '1689.00', change: 5.35 },
            { name: '五方控股', code: '300093', price: '18.76', change: -3.12 },
            { name: '招商银行', code: '600036', price: '35.68', change: 2.98 },
        ],
        updateTime: '2023-07-04 15:30:00'
    },
    index: {
        title: '自选指数',
        data: [
            { name: '新能源指数', code: '399989', price: '2345.67', change: 3.45 },
            { name: '房地产指数', code: '399393', price: '1234.56', change: 3.51 },
            { name: '半导体指数', code: '399678', price: '3456.78', change: 2.39 },
            { name: '银行指数', code: '399986', price: '2345.67', change: -2.27 },
            { name: '医药指数', code: '399989', price: '4567.89', change: 2.34 },
            { name: '房地指数', code: '399989', price: '3456.78', change: 1.41 },
            { name: '消费指数', code: '399997', price: '5678.90', change: -1.12 },
            { name: '保安指数', code: '399998', price: '4567.89', change: 3.12 },
            { name: '科技指数', code: '399906', price: '6789.01', change: 4.98 },
            { name: '创业指数', code: '399987', price: '5678.90', change: -2.98 },
        ],
        updateTime: '2023-07-04 15:30:00'
    },
    futures: {
        title: '自选期货',
        data: [
            { name: '沪金主力', code: 'AU2312', price: '389.25', change: 3.89 },
            { name: '螺纹主力', code: '(RB2312', price: '3756.00', change: -5.43 },
            { name: '沪铜主力', code: 'CU2312', price: '678.90', change: 3.21 },
            { name: '热卷主力', code: 'HC2312', price: '4567.89', change: -2.12 },
            { name: '沪铝主力', code: 'AL2312', price: '567.89', change: 5.45 },
            { name: '焦炭主力', code: 'J2312', price: '2345.67', change: -1.87 },
            { name: '沪锡主力', code: 'NI2312', price: '156.78', change: 3.13 },
            { name: '焦煤主力', code: 'JM2312', price: '1678.90', change: -3.45 },
            { name: '沪镍主力', code: 'SN2312', price: '234.56', change: 4.17 },
            { name: '铁矿主力', code: 'I2312', price: '890.12', change: -2.32 },
        ],
        updateTime: '2023-07-04 15:30:00'
    }
}
