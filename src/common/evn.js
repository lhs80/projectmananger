let baseUrl = '';
let iconUrl = '//at.alicdn.com/t/font_1139150_7l1mmn0wa3.js';
if (process.env.NODE_ENV === 'development') {
	baseUrl = 'http://192.168.199.240/project-api/';
	// baseUrl = 'http://47.101.71.9/project-api/';
} else if (process.env.NODE_ENV === 'production') {
	baseUrl = 'http://192.168.199.240/project-api/';
	// baseUrl = 'http://47.101.71.9/project-api/';
}

export {
	baseUrl,
	iconUrl
}
