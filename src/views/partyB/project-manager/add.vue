<template>
    <section>
        <el-form :model="userInfo" :rules="rules" ref="userInfo" label-width="180px" class="form-wrapper mt4">
            <el-form-item label="姓名" prop="showName">
                <el-input type="text" v-model="userInfo.showName" placeholder="请输入姓名" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="linkMobile">
                <el-input type="text" v-model="userInfo.linkMobile" placeholder="请输入手机号" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="登录密码" prop="password">
                <el-input type="password" v-model="userInfo.password" placeholder="请输入登录密码"
                          autocomplete="off" min="8" max="15"></el-input>
            </el-form-item>
            <el-form-item label="再次输入登录密码" prop="confirmPassWord">
                <el-input type="password" v-model="userInfo.confirmPassWord" placeholder="请输入确认密码"
                          autocomplete="off" min="8" max="15"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="add('userInfo')">提交</el-button>
                <el-button type="default" @click="$router.push('/admin/projectmanage/list')" plain>取消</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
	import {phoneNo, special} from '@/common/regex';
	import md5 from 'js-md5'

	export default {
		data() {
			return {
				userInfo: {
					showName: '',
					password: '',
					role: 3,
					confirmPassWord: '',
				},
				rules: {
					linkMobile: [
						{required: true, message: '请输入手机号', trigger: 'blur'},
						{pattern: phoneNo, message: '请输入正确的手机号', trigger: 'blur'}
					],
					showName: [
						{required: true, message: '请输入登录用户名', trigger: 'blur'},
						{pattern: special, message: '请输入正确的登录用户名', trigger: 'blur'}
					],
					password: [
						{required: true, message: '请输入登录密码', trigger: 'change'},
						{min: 8, message: '密码长度8-15位', trigger: 'blur'},
						{max: 15, message: '密码长度8-15位', trigger: 'blur'},
					],
					confirmPassWord: [
						{required: true, message: '请输入确认密码', trigger: 'change'},
						{validator: this.validatePass, trigger: 'blur'},
						{min: 8, message: '密码长度8-15位', trigger: 'blur'},
						{max: 15, message: '密码长度8-15位', trigger: 'blur'},
					]
				}
			}
		},
		methods: {
			add(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						let params = {
							...this.userInfo,
							userName: this.userInfo.linkMobile,
							password: md5(this.userInfo.password)
						};
						this.$store.dispatch('employee/ADD_EMPLOYEE', params).then(res => {
							if (res.result === 'success') {
								this.$message.warning('保存成功');
								this.$router.push('/admin/projectmanage/list')
							} else {
								this.$message.warning(res.msg)
							}
						})
					}
				})
			},
			validatePass(rule, value, callback) {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.userInfo.password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			},
		}
	}
</script>

<style scoped>

</style>
