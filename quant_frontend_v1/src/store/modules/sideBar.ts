export const SideBarModule = {
  namespaced: true,
  state: () => ({
    defaultActive: "/home", // 当前激活菜单的第一项
    navName: "" // 面包屑导航名称
  }),
  mutations: {
    // 处理侧边栏激活项
    set_sidebar_active (state: { defaultActive: any; }, data: { index: any; path: any; }) {
      console.log('[store]', data)
      const { index, path } = data;
      state.defaultActive = index;
      // 持久化处理
      localStorage.setItem("defaultActive", index);
      localStorage.setItem("defaultOpened", JSON.stringify([path[0]]));
    },
    // 处理面包屑导航
    set_nav_name (state: { navName: any; }, name: string) {
      console.log('[store]', name)
      state.navName = name;
      localStorage.setItem("navName", name);
    }
  }
};
