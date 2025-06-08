import http from './http'
import qs from 'qs'

export default {
    login: async function (params: any): Promise<any> {
        const url = process.env.VUE_APP_BASE_URL + '/common/login'
        return await http.post(url, params, {})
    },
    // 创建分组
    createGroup: async function (params: any): Promise<any> {
        const url = process.env.VUE_APP_BASE_URL + '/common-api/group/create';
        return await http.post(url, params, {});
    },
    // 删除分组
    deleteGroup: async function (params: any): Promise<any> {
        const url = process.env.VUE_APP_BASE_URL + '/common-api/group/delete';
        return await http.post(url, params, {});
    },
    // 更新分组
    updateGroup: async function (params: any): Promise<any> {
        const url = process.env.VUE_APP_BASE_URL + '/common-api/group/update';
        return await http.post(url, params, {});
    },
    // 获取分组列表（含分组项）
    getGroupList: async function (params: any): Promise<any> {
        const url = process.env.VUE_APP_BASE_URL + '/common-api/group/list';
        return await http.get(url, params, {});
    },

    // 添加分组项到某个分组
    addGroupItem: async function (params: any): Promise<any> {
        const url = process.env.VUE_APP_BASE_URL + '/common-api/group/item/add';
        return await http.post(url, params, {});
    },

    // 删除分组项
    deleteGroupItem: async function (params: any): Promise<any> {
        const url = process.env.VUE_APP_BASE_URL + '/common-api/group/item/delete';
        return await http.post(url, params, {});
    },
    // 更新分组项
    updateGroupItem: async function (params: any): Promise<any> {
        const url = process.env.VUE_APP_BASE_URL + '/common-api/group/item/update';
        return await http.post(url, params, {});
    },
    // 根据关键词搜索分组内元素
    searchGroupItems: async function (params: { groupId: number; keyword: string }): Promise<any> {
        const url = process.env.VUE_APP_BASE_URL + '/common-api/group/item/search';
        return await http.get(url, params, {});
    }
}
