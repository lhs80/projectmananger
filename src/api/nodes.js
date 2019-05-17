import request from '@/api/axios'

//获取节点
export function getNodesList(params) {
	return request({
		url: '/projectNode/queryNode',
		method: 'get',
		params
	});
}
