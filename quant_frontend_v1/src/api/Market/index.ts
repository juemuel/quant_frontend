import http from '../http'

// 获取股票列表
export async function getStockList(params: any): Promise<any>{
  const url = process.env.VUE_APP_BASE_URL + '/api/market/stocks'
  return await http.get(url, params, {})
}

// 获取行业分类列表
export async function getIndustryList(): Promise<any>{
  const url = process.env.VUE_APP_BASE_URL + '/api/market/industries'
  return await http.get(url, {}, {})
}

// 获取市场类型列表
export async function getMarketList(): Promise<any>{
  const url = process.env.VUE_APP_BASE_URL + '/api/market/markets'
  return await http.get(url, {}, {})
}

// 获取股票详情
export async function getStockDetail(code: string): Promise<any>{
  const url = process.env.VUE_APP_BASE_URL + `/api/market/stocks/${code}`
  return await http.get(url, {}, {})
}