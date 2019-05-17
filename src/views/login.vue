<template>
    <div class="login-container pull-height" @keyup.enter.native="handleLogin">
        <div class="login-main  animated fadeInRight">
            <h1 class="login-title"> {{GET_WEBSITE.login.title}}</h1>
            <el-form
                    class="login-form"
                    status-icon
                    :rules="loginRules"
                    ref="loginForm"
                    :model="loginForm"
                    label-width="0"
            >
                <el-form-item prop="userName" style="margin-bottom:29px">
                    <el-input
                            class="block"
                            @keyup.enter.native="handleLogin"
                            v-model="loginForm.userName"
                            auto-complete="off"
                            placeholder="请输入用户名"
                    >
                        <i slot="prefix" class="iconfont iconyonghuming"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password" style="margin-bottom:19px">
                    <el-input
                            class="block"
                            @keyup.enter.native="handleLogin"
                            :type="passwordType"
                            v-model="loginForm.password"
                            auto-complete="off"
                            placeholder="请输入密码"

                    >
                        <i class="el-icon-view el-input__icon h3" slot="suffix" @click="showPassword" v-if="passwordType==='password'"></i>
                        <i class="iconbukejian iconfont h3" slot="suffix" @click="showPassword" v-if="passwordType==='text'"></i>
                        <i slot="prefix" class="iconfont iconmima1"></i>
                    </el-input>
                </el-form-item>
                <el-form-item style="margin-bottom:0;margin-left:14px">
                    <el-checkbox v-model="checked"><span class="h6 text-primary">记住用户名</span>
                    </el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-button
                            type="primary"
                            @click.native.prevent="handleLogin('admin')"
                            style="width:100%"
                            class="h3"
                    >登录
                    </el-button>
                    <h6 class="text-muted text-center" style="line-height:1;margin-top:17px">如忘记密码，请联系普城工作人员重置</h6>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
	import {mapGetters} from 'vuex';
	import {getStore} from '@/utils/store';
	import md5 from 'js-md5'

	export default {
		name: 'login',
		data() {
			return {
				checked: getStore({name: 'remembername'}) || false,
				passwordType: 'password',
				loginForm: {
					userName: getStore({name: 'name'}) || '',
					password: ''
				},
				loginRules: {
					userName: [
						{required: true, message: '请输入用户名', trigger: 'blur'},
					],
					password: [
						{required: true, message: '请输入密码', trigger: 'blur'}
					]
				},
			};
		},
		computed: {
			...mapGetters('common', ['GET_WEBSITE']),
			...mapGetters('user', ['GET_USERINFO']),
		},
		methods: {
			showPassword() {
				this.passwordType === 'password'
					? this.passwordType = 'text'
					: this.passwordType = 'password';
			},
			handleLogin() {
				this.$refs.loginForm.validate(valid => {
					if (valid) {
						let params = {
							userName: this.loginForm.userName,
							password: md5(this.loginForm.password),
						};
						this.$store.dispatch('user/login', params).then(res => {
							if (res.result === 'error') {
								this.$message({
									showClose: true,
									message: res.msg,
									type: 'warning'
								})
							} else {
								if (this.GET_USERINFO.role === '3' || this.GET_USERINFO.role === '4') {
									this.$message({
										showClose: true,
										message: '您没有登录权限',
										type: 'warning'
									});
									return false;
								} else {
									this.$store.commit('common/SET_REMEMBERNAME', this.checked);
									this.$store.commit('user/setUserName', this.checked ? this.loginForm.userName : '');
									// if (this.GET_USERINFO.role === '2')
									this.$router.push('/home');
									// if (this.GET_USERINFO.role === '1')
									// 	this.$router.push('/admin/home')
								}
							}
						})
					}
				});
			}
		}
	};
</script>
<style lang="less" scoped>
    .login-container {
        display: flex;
        align-items: center;
        justify-content: space-around;
        background: rgba(0, 0, 0, 0.3);
        position: relative;
        &::before {
            z-index: -999;
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: url("../assets/img/bg-login.jpg");
            background-size: cover;
        }
    }

    .login-main {
        width: 440px;
        height: 440px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        background: #fff;
        padding: 56px;
        border-radius: 10px;
        box-shadow: 1px 1px 2px rgba(0, 0, 0, .2);
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        .login-form {
            height: 260px;
        }
        .login-title {
            text-align: center;
            color: #409EFF;
            letter-spacing: 3px;
            line-height: 1;
            margin-bottom: 50px;
        }
    }
</style>
<style lang="less">
    .login-form {
        .el-input__inner {
            height: 50px;
            padding-left: 44px;
            -webkit-box-shadow: 0 0 12px rgba(0, 0, 0, .12);
            -moz-box-shadow: 0 0 12px rgba(0, 0, 0, .12);
            box-shadow: 0 0 12px rgba(0, 0, 0, .12);
        }
        .el-input__prefix {
            left: 13px;
            i {
                font-size: 18px !important;
            }
        }
        .el-button {
            height: 48px;
        }
    }
</style>
