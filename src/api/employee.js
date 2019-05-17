import request from '@/api/axios'

export default {
	//商户登录接口
	login(data) {
		return request({
			url: '/login',
			method: 'post',
			data
		});
	},
	//工人或项目经理查询根据 role
	getWorkerOrManager(params) {
		return request({
			url: '/user/getUserByRole',
			method: 'get',
			params
		});
	},
	//甲方列表用于多选框，没有分页
	queryPartyAList() {
		return request({
			url: '/demand/getDept',
			method: 'get'
		});
	},
	//甲方业主列表和工人列表，有分页
	queryMulUserList(data) {
		return request({
			url: '/user/getUserPageByRole',
			method: 'post',
			data
		});
	},
	//甲方业主列表和工人列表，有分页
	queryProjectManageList(data) {
		return request({
			url: '/user/getManagerUserPage',
			method: 'post',
			data
		});
	},
	//用户详情
	adminQueryUserDetail(params) {
		return request({
			url: '/user/userInfo',
			method: 'get',
			params
		});
	},
	//修改用户详情
	adminModityUserDetail(data) {
		return request({
			url: '/user/modifyUser',
			method: 'post',
			data
		});
	},
	//注册用户 role(1:普城管理人员，2：甲方业主,3:项目经理，4：工人)
	addEmployee(data) {
		return request({
			url: '/user/register',
			method: 'post',
			data
		});
	}
}



