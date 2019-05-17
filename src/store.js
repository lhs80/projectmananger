import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import common from './modules/common'
import tags from './modules/tags'
import requirement from './modules/requirement'
import employee from './modules/employee'
import nodes from './modules/nodes'
import project from './modules/project'

Vue.use(Vuex);
const store = new Vuex.Store({
	modules: {
		user,
		common,
		tags,
		requirement,
		employee,
		nodes,
		project
	}
});

export default store
