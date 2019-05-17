import {setStore, getStore, removeStore} from '@/utils/store'

const tagObj = {
	label: '',
	value: '',
	query: '',
	num: '',
	close: true,
};

const tagWel = getStore({name: 'be'}) ?
	getStore({name: 'be'}).role === 1 ?
		{
			label: '首页',
			value: '/admin/home'
		}
		:
		{
			label: '首页',
			value: '/home'
		}
	:
	{
		label: '首页',
		value: '/admin/home'
	}


function setFistTag(list) {
	if (list.length == 1) {
		list[0].close = false;
	} else {
		list.some(a => {
			a.close = true
		})
	}
	return list;
}

const navs = {
	namespaced: true,
	state: {
		tagList: getStore({name: 'tagList'}) || [],
		tag: getStore({name: 'tag'}) || tagObj,
		tagWel: {
			label: '首页',
			value: '/home',
			close: false
		},//setTagWel(),
		tagCurrent: getStore({name: 'tagCurrent'}) || [],
	},
	actions: {},
	mutations: {
		ADD_TAG: (state, action) => {
			state.tag = action;
			setStore({name: 'tag', content: state.tag, type: 'session'});
			if (state.tagList.some(a => a.value === action.value)) return;
			state.tagList.push({
				label: action.label,
				value: action.value,
				query: action.query,
			});
			state.tagList = setFistTag(state.tagList);
			setStore({name: 'tagList', content: state.tagList, type: 'session'})
		},
		SET_TAG_CURRENT: (state, tagCurrent) => {
			state.tagCurrent = tagCurrent;
			setStore({name: 'tagCurrent', content: state.tagCurrent, type: 'session'})
		},
		SET_TAG: (state, value) => {
			state.tagList.forEach((ele, num) => {
				if (ele.value === value) {
					state.tag = state.tagList[num];
					setStore({name: 'tag', content: state.tag, type: 'session'})
				}
			});
		},
		DEL_ALL_TAG: (state, action) => {
			state.tag = tagObj;
			state.tagList = [];
			// state.tagList.push(state.tagWel);
			removeStore({name: 'tag'});
			removeStore({name: 'tagList'});
			removeStore({name: 'tagCurrent'});
		},
		DEL_TAG_OTHER: (state, action) => {
			state.tagList.forEach((ele, num) => {
				if (ele.value === state.tag.value) {
					state.tagList = state.tagList.slice(num, num + 1)
					state.tag = state.tagList[0];
					state.tagList[0].close = false;
					setStore({name: 'tag', content: state.tag, type: 'session'})
					setStore({name: 'tagList', content: state.tagList, type: 'session'})
				}
			})

		},
		DEL_TAG: (state, action) => {
			state.tagList.forEach((ele, num) => {
				if (ele.value === action.value) {
					state.tagList.splice(num, 1);
					state.tagList = setFistTag(state.tagList);
					setStore({name: 'tag', content: state.tag, type: 'session'});
					setStore({name: 'tagList', content: state.tagList, type: 'session'})
				}
			})
		},
	},
	getters: {
		GET_TAGWEL: (state) => {
			return state.tagWel
		},
		GET_TAGS: (state) => {
			return state.tag
		},
		GET_TAGLIST: (state) => {
			return state.tagList
		}
	}
};
export default navs
