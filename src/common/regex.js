/**
 * 当前文件为所有正则表达式
 */
// 手机号格式
const phoneNo = /^1(3|4|5|7|8)\d{9}$/;
// 邮箱格式
const email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// 只能5-8个英文字符或者数字
const userLoginName = /^[a-zA-Z0-9]{5,8}$/;
// 密码规则 6-20 位，字母+数字+特殊字符
const password = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*,.]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*.,]+$)(?![\d!@#$%^&*.,]+$)[a-zA-Z\d!@#$%^&*,.]{6,20}$/;
const unzeronumber = /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/;
const special = /^[\u0391-\uFFE5A-Za-z]+$/;
const kongge = /\s/;
export {phoneNo, email, userLoginName, password, unzeronumber, special,kongge};
