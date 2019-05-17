import request from '@/api/axios'

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


//普城确认需求
export function adminConfirmRequire(data) {
	return request({
		url: '/project/confirmDemand',
		method: 'post',
		data
	});
}
