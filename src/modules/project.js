import {
	queryProjectList,
	queryProjectDetail,
	queryTempProjectDetail,
	queryProjectFile,
	delProjectFile,
	queryProjectNotic,
	addNotic,
	queryTipManList,
	updateProjectInfo,
	updateExceptDate
} from '@/api/activity'

const state = {
	node: []
};
const mutations = {
	SET_NODES(state, node) {
		state.node = node
	}
};
const actions = {
	QUERY_PROJECT_LIST({commit}, params) {
		return new Promise((resolve, reject) => {
			queryProjectList(params).then(response => {
				if (response.result === 'success') {
					resolve(response)
				} else {
					reject(response)
				}
			})
		})
	},
	QUERY_PROJECT_DETAIL({commit}, params) {
		return new Promise((resolve, reject) => {
			queryProjectDetail(params).then(response => {
				if (response.result === 'success') {
					resolve(response)
				} else {
					reject(response)
				}
			})
		})
	},
	QUERY_TEMP_PROJECT_DETAIL({commit}, params) {
		return new Promise((resolve, reject) => {
			queryTempProjectDetail(params).then(response => {
				if (response.result === 'success') {
					resolve(response)
				} else {
					reject(response)
				}
			})
		})
	},
	QUERY_PROJECT_File({commit}, params) {
		return new Promise((resolve, reject) => {
			queryProjectFile(params).then(response => {
				if (response.result === 'success') {
					resolve(response)
				} else {
					reject(response)
				}
			})
		})
	},
	DEL_PROJECT_File({commit}, params) {
		return new Promise((resolve, reject) => {
			delProjectFile(params).then(response => {
				if (response.result === 'success') {
					resolve(response)
				} else {
					reject(response)
				}
			})
		})
	},
	QUERY_PROJECT_NOTIC({commit}, params) {
		return new Promise((resolve, reject) => {
			queryProjectNotic(params).then(response => {
				if (response.result === 'success') {
					resolve(response)
				} else {
					reject(response)
				}
			})
		})
	},
	ADD_NOTIC({commit}, params) {
		return new Promise((resolve, reject) => {
			addNotic(params).then(response => {
				if (response.result === 'success') {
					resolve(response)
				} else {
					reject(response)
				}
			})
		})
	},
	QUERY_NOTIC_MAN({commit}, params) {
		return new Promise((resolve, reject) => {
			queryTipManList(params).then(response => {
				if (response.result === 'success') {
					resolve(response)
				} else {
					reject(response)
				}
			})
		})
	},
	UPDATE_PROJECT_INFO({commit}, params) {
		return new Promise((resolve, reject) => {
			updateProjectInfo(params).then(response => {
				if (response.result === 'success') {
					resolve(response)
				} else {
					reject(response)
				}
			})
		})
	},
	UPDATE_PROJECT_DATE({commit}, params) {
		return new Promise((resolve, reject) => {
			updateExceptDate(params).then(response => {
				if (response.result === 'success') {
					resolve(response)
				} else {
					reject(response)
				}
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
