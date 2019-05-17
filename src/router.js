import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login.vue'
import Layout from './views/layout/';
import store from './store';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import {getStore} from '@/utils/store'

const _import = (file, path, resolve) => {
	if (!path) path = 'components';
	return require([`./${path}/${file}.vue`], resolve)
};

const setTitle = function (title) {
	title = title ? `${title}` : '普城建设施工项目管理平台';
	window.document.title = title;
};

NProgress.configure({
	showSpinner: false
});

Vue.use(Router);

const router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/login',
			name: '登录',
			component: Login
		},
		{
			path: '/home',
			name: '首页',
			component: Layout,
			redirect: to => {
				if (getStore({name: 'be'}).role === '1') {
					return '/admin/index'
				} else if (getStore({name: 'be'}).role === '2') {
					return '/index'
				}
			}
		},
		{
			path: '/',
			name: 'Layout',
			component: Layout,
			children: [{
				path: 'index',
				name: '首页',
				component(resolve) {
					_import('Home', 'views/partyA', resolve)
				}
			}, {
				path: 'require/list',
				name: '需求管理',
				component(resolve) {
					_import('index', 'views/partyA/requirement', resolve)
				}
			}, {
				path: 'require/add',
				name: '添加需求',
				component(resolve) {
					_import('add', 'views/partyA/requirement', resolve)
				}
			}, {
				path: 'require/detail/:id',
				name: '需求详情',
				component(resolve) {
					_import('detail', 'views/partyA/requirement', resolve)
				}
			}, {
				path: 'require/update/:id',
				name: '修改需求',
				component(resolve) {
					_import('update', 'views/partyA/requirement', resolve)
				}
			}, {
				path: 'project/list',
				name: '项目管理',
				component(resolve) {
					_import('index', 'views/partyA/project', resolve)
				}
			}, {
				path: 'project/detail/:id',
				name: '项目详情',
				component(resolve) {
					_import('detail', 'views/partyA/project', resolve)
				}
			},]
		},
		{
			path: '/admin',
			name: 'Layout',
			component: Layout,
			children: [{
				path: 'index',
				name: '首页',
				component(resolve) {
					_import('Home', 'views/partyB', resolve)
				}
			}, {
				path: 'require/list',
				name: '需求管理',
				component(resolve) {
					_import('index', 'views/partyB/requirement', resolve)
				}
			}, {
				path: 'require/confirm/:id',
				name: '确认需求',
				component(resolve) {
					_import('confirm', 'views/partyB/requirement', resolve)
				}
			}, {
				path: 'require/detail/:id',
				name: '需求详情',
				component(resolve) {
					_import('detail', 'views/partyB/requirement', resolve)
				}
			}, {
				path: 'require/setting/:id/:start/:end',
				name: '配置项目',
				component(resolve) {
					_import('setting', 'views/partyB/requirement', resolve)
				}
			}, {
				path: 'owner/list',
				name: '甲方业主管理',
				component(resolve) {
					_import('index', 'views/partyB/owner', resolve)
				}
			}, {
				path: 'owner/add',
				name: '添加甲方业主',
				component(resolve) {
					_import('add', 'views/partyB/owner', resolve)
				}
			}, {
				path: 'owner/update/:uname',
				name: '甲方业主查看详情',
				component(resolve) {
					_import('update', 'views/partyB/owner', resolve)
				}
			}, {
				path: 'projectmanage/list',
				name: '项目经理管理',
				component(resolve) {
					_import('index', 'views/partyB/project-manager', resolve)
				}
			}, {
				path: 'projectmanage/add',
				name: '添加项目经理',
				component(resolve) {
					_import('add', 'views/partyB/project-manager', resolve)
				}
			}, {
				path: 'work/list',
				name: '员工管理',
				component(resolve) {
					_import('index', 'views/partyB/work', resolve)
				}
			}, {
				path: 'work/add',
				name: '添加员工',
				component(resolve) {
					_import('add', 'views/partyB/work', resolve)
				}
			}, {
				path: 'project/list',
				name: '项目管理',
				component(resolve) {
					_import('index', 'views/partyB/project', resolve)
				}
			}, {
				path: 'project/detail/:id',
				name: '项目详情',
				component(resolve) {
					_import('detail', 'views/partyB/project', resolve)
				}
			}, {
				path: 'project/update/:id',
				name: '修改项目基本信息',
				component(resolve) {
					_import('update', 'views/partyB/project', resolve)
				}
			}, {
				path: 'project/setting/:id',
				name: '配置项目',
				component(resolve) {
					_import('setting', 'views/partyB/project', resolve)
				}
			}]
		},
	]
});

router.beforeEach((to, from, next) => {
	NProgress.start();
	const token = getStore({name: 'be'});
	if (token) {
		const value = to.query.src ? to.query.src : to.path;
		const label = to.query.name ? to.query.name : to.name;
		if (label !== '登录')
			store.commit('tags/ADD_TAG', {
				label: label,
				value: value,
				query: to.query
			});
		next();
	} else {
		if (to.path === '/login') {
			next()
		}
		next({
			path: '/login',
		})
	}
});

router.afterEach((to, from) => {
	NProgress.done();
	setTimeout(() => {
		if (to.path === '/login') {
			setTitle('登录');
		} else {
			const tag = store.getters['tags/GET_TAGS'];
			setTitle(tag.label);
			store.commit('tags/SET_TAG_CURRENT', findMenuParent(tag));
		}
	}, 0);
});


// 寻找子菜单的父类
function findMenuParent(tag) {
	let tagCurrent = [];
	const menu = store.getters.menu;
	tagCurrent.push(tag);
	return tagCurrent;
}


export default router;
