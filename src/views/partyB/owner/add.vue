<template>
    <section>
        <el-form :model="userInfo" :rules="rules" ref="userInfo" label-width="180px" class="mt4 form-wrapper">
            <el-form-item label="公司全称" prop="dept">
                <el-input v-model="userInfo.dept" placeholder="请输入公司全称"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="linkMan">
                <el-input v-model="userInfo.linkMan" placeholder="请输入联系人"></el-input>
            </el-form-item>
            <el-form-item label="联系人电话" prop="linkMobile">
                <el-input v-model="userInfo.linkMobile" placeholder="请输入联系人电话"></el-input>
            </el-form-item>
            <el-form-item label="登录用户名" prop="userName">
                <el-input type="text" v-model="userInfo.userName" placeholder="请输入登录用户名" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="显示姓名" prop="showName">
                <el-input type="text" v-model="userInfo.showName" placeholder="请输入显示姓名" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="登录密码" prop="password">
                <el-input type="password" v-model="userInfo.password" placeholder="请输入登录密码"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="再次输入登录密码" prop="confirmPassWord">
                <el-input type="password" v-model="userInfo.confirmPassWord" placeholder="请输入确认密码"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="add('userInfo')">提交</el-button>
                <el-button type="default" @click="$router.push('/admin/owner/list')" plain>取消</el-button>
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
					dept: '',
					userName: '',
					password: '',
					showName: '',
					linkMan: '',
					linkMobile: '',
					role: 2,
					confirmPassWord: '',
				},
				rules: {
					dept: [
						{required: true, message: '请输入公司全称', trigger: 'blur'},
						{pattern: special, message: '请输入正确的公司全称', trigger: 'blur'}
					],
					linkMobile: [
						{pattern: phoneNo, message: '请输入正确的联系电话', trigger: 'blur'}
					],
					userName: [
						{required: true, message: '请输入登录用户名', trigger: 'blur'},
						{pattern: special, message: '请输入正确的登录用户名', trigger: 'blur'}
					],
					showName: [
						{required: true, message: '请输入显示姓名', trigger: 'blur'},
						{pattern: special, message: '请输入正确的显示姓名', trigger: 'blur'}
					],
					password: [
						{required: true, message: '请输入登录密码', trigger: 'blur'},
						{min: 8, message: '密码长度8-15位', trigger: 'blur'},
						{max: 15, message: '密码长度8-15位', trigger: 'blur'},
					],
					confirmPassWord: [
						{required: true, message: '请输入确认密码', trigger: 'blur'},
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
							password: md5(this.userInfo.password)
						};
						this.$store.dispatch('employee/ADD_EMPLOYEE', params).then(res => {
							if (res.result === 'success') {
								this.$message.warning('保存成功');
								this.$router.push('/admin/owner/list')
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
