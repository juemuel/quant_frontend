import { createStore } from 'vuex'
import { SideBarModule } from './modules/sideBar';
import { UserInfoModule } from './modules/userInfo';

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    sidebarModule: SideBarModule,
    userInfoModule: UserInfoModule
  }
})
