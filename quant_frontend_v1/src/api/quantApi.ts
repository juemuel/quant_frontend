import http from './http'
import qs from 'qs'

export default {
  getIndexes: async function (params: any): Promise<any> {
    const url = process.env.VUE_APP_BASE_URL + '/data/getCodes'
    return await http.get(url, params, {})
  },
  simulateTest: async function (params: any): Promise<any> {
    const url = process.env.VUE_APP_BASE_URL + '/quant/simulate' + params.url
    return await http.get(url, {}, {})
  }
}
