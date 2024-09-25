import http from '../http'
import qs from 'qs'

export default {
  getIndexes: async function (params: any): Promise<any> {
    console.log('GET BASE', process.env)
    const url = process.env.VUE_APP_BASE_URL + '/index-codes/getCodes'
    return await http.get(url, params, {})
  },
  simulateTest: async function (params: any): Promise<any> {
    const url = process.env.VUE_APP_BASE_URL + '/backtest/simulate' + params.url
    return await http.get(url, {}, {})
  }
  // saveUserActionData: async function (params: any, headerData: any): Promise<any> {
  //   const url = process.env.VUE_APP_JUE_API + '/cup/userAction/save'
  //   return await http.post(url, qs.stringify(params), headerData)
  // },
}
