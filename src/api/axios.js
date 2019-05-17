import axios from 'axios';
import {Message} from 'element-ui';
import errorCode from '@/common/errorCode';
import {baseUrl} from '@/common/evn';
import {getStore} from '@/utils/store';
import router from '@/router'

//请求拦截
axios.interceptors.request.use(config => {
		config.baseURL = baseUrl;
		config.timeout = 5000;
		config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
		config.headers = {
			token: getStore({name: 'be'}) ? getStore({name: 'be'}).sessionId : ''
		};
		return config;
	},
	(error) => {
		return Promise.reject(error);
	});

//响应拦截
axios.interceptors.response.use((response) => {
	if (response.status && response.status === 200) {
		return response.data;
	}
}, (error) => {
	if (error.response) {
		if (error.response.status === 504 || error.response.status === 404) {
			Message(errorCode['404']);
		} else if (error.response.status === 403 || error.response.status === 401) {
			router.push('/login');
		}
	}
	return Promise.resolve(error);
});

export default axios;
