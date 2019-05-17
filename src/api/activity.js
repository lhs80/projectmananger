import request from '@/api/axios'
import Vue from 'vue'
import echarts from 'echarts'

Vue.prototype.$echarts = echarts;

//商户登录接口
export function login(data) {
	return request({
		url: '/login',
		method: 'post',
		data
	});
}

//首页
export function home(params) {
	return request({
		url: '/index/indexStatistics',
		method: 'get',
		params
	});
}

//需求列表
export function requirementList(data) {
	return request({
		url: '/demand/queryAll',
		method: 'post',
		data
	});
}

//添加需求
export function addRequirement(data) {
	return request({
		url: '/demand/addDemand',
		method: 'post',
		data
	});
}

//需求详情
export function requirementDetail(data) {
	return request({
		url: '/demand/detail',
		method: 'post',
		data
	});
}

//取消或修改需求
export function cancelOrUpdateRequire(data) {
	return request({
		url: '/demand/updateDemand',
		method: 'post',
		data
	});
}

//普城需求管理
export function adminRequireList(data) {
	return request({
		url: '/demand/selectAllListMore',
		method: 'post',
		data
	});
}

//工人或项目经理查询根据 role
export function getWorkerOrManager(params) {
	return request({
		url: '/user/getUserByRole',
		method: 'get',
		params
	});
}

//甲方列表用于多选框，没有分页
export function queryPartyAList() {
	return request({
		url: '/demand/getDept',
		method: 'get'
	});
}

//甲方业主列表和工人列表，有分页
export function queryMulUserList(data) {
	return request({
		url: '/user/getUserPageByRole',
		method: 'post',
		data
	});
}

//工人列表-节点配置负责人使用
export function queryWorkByNodes(data) {
	return request({
		url: '/user/getWorker',
		method: 'post',
		data
	});
}

//甲方业主列表和工人列表，有分页
export function queryProjectManageList(data) {
	return request({
		url: '/user/getManagerUserPage',
		method: 'post',
		data
	});
}

//用户详情
export function adminQueryUserDetail(params) {
	return request({
		url: '/user/userInfo',
		method: 'get',
		params
	});
}

//用户详情
export function adminModityUserDetail(data) {
	return request({
		url: '/user/modifyUser',
		method: 'post',
		data
	});
}

//普城确认需求
export function adminConfirmRequire(data) {
	return request({
		url: '/project/confirmDemand',
		method: 'post',
		data
	});
}

//注册用户 role(1:普城管理人员，2：甲方业主,3:项目经理，4：工人)
export function addEmployee(data) {
	return request({
		url: '/user/register',
		method: 'post',
		data
	});
}


//获取节点
export function getNodesList(params) {
	return request({
		url: '/projectNode/queryNode',
		method: 'get',
		params
	});
}

//保存节点
export function saveNodes(data) {
	return request({
		url: '/projectNode/setNode',
		method: 'post',
		data
	});
}

//项目管理列表
export function queryProjectList(data) {
	return request({
		url: 'project/queryAll',
		method: 'post',
		data
	});
}

//项目详情
export function queryProjectDetail(params) {
	return request({
		url: '/project/selectInfoByProjectId',
		method: 'get',
		params
	});
}

//临时项目详情
export function queryTempProjectDetail(params) {
	return request({
		url: '/project/selectTempInfoByProjectId',
		method: 'get',
		params
	});
}

//项目附件上传
export function imgUpdate(data) {
	return request({
		url: '/projectfile/fileUpload',
		method: 'post',
		data
	});
}

//项目附件列表查询
export function queryProjectFile(params) {
	return request({
		url: '/projectfile/queryFileList',
		method: 'get',
		params
	});
}

//项目附件列表删除
export function delProjectFile(params) {
	return request({
		url: '/projectfile/delProjectFile',
		method: 'get',
		params
	});
}

//项目基本信息修改
export function updateProjectInfo(data) {
	return request({
		url: '/project/updateProject',
		method: 'post',
		data
	});
}

//项目公告列表
export function queryProjectNotic(params) {
	return request({
		url: '/projectboard/selectBoardByProjectId',
		method: 'get',
		params
	});
}

//添加公告
export function addNotic(data) {
	return request({
		url: '/projectboard/addBoard',
		method: 'post',
		data
	});
}

//要提醒的人列表
export function queryTipManList(params) {
	return request({
		url: '/projectboard/getaddBoardUser',
		method: 'get',
		params
	});
}

//甲方修改项目期望交付日期
export function updateExceptDate(data) {
	return request({
		url: '/project/updateFlag',
		method: 'post',
		data
	});
}

//删除节点
export function delNode(params) {
	return request({
		url: '/projectNode/delNode',
		method: 'get',
		params
	});
}



Vue.prototype.timestampToTime = (timestamp, type) => {
	let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	let Y = date.getFullYear() + '-';
	let M = (date.getMonth() + 1).toString().padStart(2, '0') + '-';
	let D = date.getDate().toString().padStart(2, '0') + ' ';
	let h = date.getHours().toString().padStart(2, '0') + ':';
	let m = date.getMinutes().toString().padStart(2, '0');
	// let s = date.getSeconds();
	if (type === 'D') {
		return Y + M + D;
	} else if (type === 'T') {
		return Y + M + D + h + m;
	}
};

Vue.prototype.projectStatus = (status, type) => {
	switch (status) {
		case 1:
			return type === 'K' ? '<span class="text-warning prl1">（待确认）</span>' : '<span class="text-warning prl1">待确认</span>';
		case 2:
			return type === 'K' ? '<span class="text-success prl1">（已确认）</span>' : '<span class="text-success prl1">已确认</span>';
		case 0:
			return type === 'K' ? '<span class="text-danger prl1">（已取消）</span>' : '<span class="text-danger prl1">已取消</span>';
	}
};

Vue.prototype.subjectStatus = (status, type) => {
	switch (status) {
		case 1:
			return type === 'K' ? '<span class="text-warning prl1">（待开工）</span>' : '<span class="text-warning prl1">待开工</span>';
		case 2:
			return type === 'K' ? '<span class="text-danger prl1">（未开工）</span>' : '<span class="text-danger prl1">未开工</span>';
		case 3:
			return type === 'K' ? '<span class="text-info prl1">（进行中）</span>' : '<span class="text-info prl1">进行中</span>';
		case 4:
			return type === 'K' ? '<span class="text-success prl1">（已完成）</span>' : '<span class="text-success prl1">已完成</span>';
	}
};
