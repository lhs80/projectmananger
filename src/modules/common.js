/*引入storage方法*/
import {
  setStore,
  getStore
} from '@/utils/store'

/*网站配置信息 */
const website = {
  logo: "assets/img/logo.png",
  author: "中卅",
  whiteList: ["/login", "/404", "/401", "/lock"],
  login: {
    title: "施工项目管理平台登录"
  },
  top: {
    title: "普城建设施工项目管理平台",
  }
};

/*主状态管理信息*/
const common = {
  namespaced: true,
  state: {
    isRememberName: getStore({
      name: 'isRememberName'
    }) || false,
    website: website,
  },
  mutations: {
    SET_REMEMBERNAME: (state, result) => {
      state.isRememberName = result;
      setStore({name: "remembername", content: result});
    }
  },
  getters: {
    GET_WEBSITE: (state) => {
      return state.website
    }
  }
};
export default common
