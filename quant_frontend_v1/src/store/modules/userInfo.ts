export const UserInfoModule = {
  namespaced: true,
  state: () => ({
    userName: window.localStorage.getItem('userName') ? window.localStorage.getItem('userName') : '',
    role: window.localStorage.getItem('role') ? window.localStorage.getItem('role') : '',
    Authorization: window.localStorage.getItem('Authorization') ? window.localStorage.getItem('Authorization') : '',
    signTime: window.localStorage.getItem('signTime') ? window.localStorage.getItem('signTime') : '',
    id: window.localStorage.getItem('id') ? window.localStorage.getItem('id') : ''
  }),
  mutations: {
    loginChange (state: { userName: string; Authorization: string; signTime: string; role: string; id: string; },
      user: { userName: any; Authorization: any; signTime: any; role: string; id: string; }) {
      console.log('[store]', user)
      const { userName, Authorization, signTime, role, id } = user;
      state.userName = userName;
      state.Authorization = Authorization;
      state.signTime = signTime;
      state.role = role;
      state.id = id;
      // 持久化处理
      localStorage.setItem("userName", state.userName);
      localStorage.setItem("Authorization", state.Authorization);
      localStorage.setItem("signTime", state.signTime);
      localStorage.setItem("role", state.role);
      localStorage.setItem("id", state.id);
    }
  }
};
