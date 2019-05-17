import {
	getWorkerOrManager,
	queryPartyAList,
	addEmployee,
	queryMulUserList,
	queryProjectManageList,
	adminQueryUserDetail,
	adminModityUserDetail,
	queryWorkByNodes
} from '@/api/activity'

const state = {};
const mutations = {};
const actions = {
	QUERY_WORK_LIST({commit}, params) {
		return new Promise((resolve, reject) => {
			getWorkerOrManager(params).then(response => {
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},
	QUERY_MulWORK_LIST({commit}, params) {
		return new Promise((resolve, reject) => {
			queryMulUserList(params).then(response => {
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},
	QUERY_PARTYA_LIST({commit}, params) {
		return new Promise((resolve, reject) => {
			queryPartyAList(params).then(response => {
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},
	ADD_EMPLOYEE({commit}, params) {
		return new Promise((resolve, reject) => {
			addEmployee(params).then(response => {
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},
	QUERY_PROJECTMANAGE_LIST({commit}, params) {
		return new Promise((resolve, reject) => {
			queryProjectManageList(params).then(response => {
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},
	QUERY_USERINFO_DETAIL({commit}, params) {
		return new Promise((resolve, reject) => {
			adminQueryUserDetail(params).then(response => {
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},
	MODIFY_USERINFO_DETAIL({commit}, params) {
		return new Promise((resolve, reject) => {
			adminModityUserDetail(params).then(response => {
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},
	QUERY_WORK_BY_NODES({commit}, params) {
		return new Promise((resolve, reject) => {
			queryWorkByNodes(params).then(response => {
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	}
};
const getters = {};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}
