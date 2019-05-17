import {getNodesList, saveNodes, delNode} from '@/api/activity'

const state = {
	node: []
};
const mutations = {
	SET_NODES(state, node) {
		state.node = node
	}
};
const actions = {
	QUERY_NODES({commit}, params) {
		return new Promise((resolve, reject) => {
			getNodesList(params).then(response => {
				if (response.result === 'success') {
					resolve(response)
				} else {
					reject(response)
				}
			})
		})
	},
	SAVE_NODES({commit}, params) {
		return new Promise((resolve, reject) => {
			saveNodes(params).then(response => {
				if (response.result === 'success') {
					resolve(response)
				} else {
					reject(response)
				}
			})
		})
	},
	DELETE_NODE({commit}, params) {
		return new Promise((resolve, reject) => {
			delNode(params).then(response => {
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
