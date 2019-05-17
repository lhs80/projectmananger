import {setStore, getStore, removeStore} from '@/utils/store'
import {login, home} from '@/api/activity'
import {mapMutations} from 'vuex'

const userInfo = getStore({name: 'be'}) || {
	name: '',
	sessionId: '',
	role: 0,
	usrId: ''
};

const state = {
	userInfo: userInfo
};

const mutations = {
	setUserInfo(state, userInfo) {
		state.userInfo = userInfo;
		setStore({name: 'be', content: userInfo});
	},
	setUserName(state, userName) {
		setStore({name: 'name', content: userName})
	},
	loginout() {
		removeStore({name: 'be'});
	},
};

const actions = {
	login({commit}, user) {
		return new Promise((resolve, reject) => {
			login(user).then(response => {
				if (response.result === 'success') {
					commit('setUserInfo', response.data);
					// _this.$store.commit("SET_LOGINTYPE", "sh-send");
					// _this.$store.commit("SET_LOGINTYPE", "sh");
				}
				resolve(response);
			}).catch(error => {
				reject(error)
			})
		})
	},
	QUERY_HOME_DATA({commit}, params) {
		return new Promise((resolve, reject) => {
			home(params).then(response => {
				if (response.result === 'success') {
					resolve(response);
				}
			}).catch(error => {
				reject(error)
			})
		})
	}
};

const getters = {
	GET_USERINFO: (state) => {
		return state.userInfo
	},
	GET_SESSIONID: (state) => {
		return state.userInfo.sessionId
	},
	GetMenu(state) {
		let partAMenu = [
			{
				icon: 'iconfont iconleimupinleifenleileibie',
				name: '需求管理',
				path: '/require/list',
				children: []
			}, {
				icon: 'iconfont iconchaxun',
				name: '项目查询',
				path: '/project/list',
				children: []
			}, {
				icon: 'iconfont iconxinjian',
				name: '添加需求',
				path: '/require/add',
				children: []
			}
		];
		let partBMenu = [
			{
				icon: 'iconfont iconyuangong3',
				name: '甲方业主管理',
				path: '/admin/owner/list',
				children: []
			}, {
				icon: 'iconfont iconleimupinleifenleileibie',
				name: '需求管理',
				path: '/admin/require/list',
				children: []
			}, {
				icon: 'iconfont iconchaxun',
				name: '项目管理',
				path: '/admin/project/list',
				children: []
			}, {
				icon: 'iconfont iconyuangongguanli',
				name: '员工管理',
				path: '/admin/work/list',
				children: []
			}, {
				icon: 'iconfont iconyuangong1',
				name: '项目经理管理',
				path: '/admin/projectmanage/list',
				children: []
			}
		];
		if (state.userInfo.role === '1')
			return partBMenu;
		else
			return partAMenu;
	}
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}
