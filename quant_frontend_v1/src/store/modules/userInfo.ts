export const UserInfoModule = {
  namespaced: true,
  state: () => ({
    userName: window.localStorage.getItem('userName') ? window.localStorage.getItem('userName') : '',
    Authorization: window.localStorage.getItem('Authorization') ? window.localStorage.getItem('Authorization') : '',
    signTime: window.localStorage.getItem('signTime') ? window.localStorage.getItem('signTime') : ''
  }),
  mutations: {
    loginChange (state: { userName: string; Authorization: string; signTime: string; }, user: { userName: any; Authorization: any; signTime: any; }) {
      console.log('[store]', user)
      const { userName, Authorization, signTime } = user;
      state.userName = userName;
      state.Authorization = Authorization;
      state.signTime = signTime;
      // 持久化处理
      localStorage.setItem("userName", state.userName);
      localStorage.setItem("Authorization", state.Authorization);
      localStorage.setItem("signTime", state.signTime);
    }
  }
};
