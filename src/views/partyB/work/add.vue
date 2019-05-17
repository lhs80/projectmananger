<template>
    <section>
        <el-form :model="userInfo" :rules="rules" ref="userInfo" label-width="180px" class="mt4 form-wrapper">
            <el-form-item label="姓名" prop="showName">
                <el-input type="text" v-model="userInfo.showName" placeholder="请输入姓名" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="岗位" prop="job">
                <el-select placeholder="请选择" value="-1" v-model="userInfo.job" style="width:510px">
                    <el-option value="设计师" label="设计师">设计师</el-option>
                    <el-option value="采购员" label="采购员">采购员</el-option>
                    <el-option value="预算员" label="预算员">预算员</el-option>
                    <el-option value="工人" label="工人">工人</el-option>
                    <el-option value="木工" label="木工">木工</el-option>
                    <el-option value="瓦工" label="瓦工">瓦工</el-option>
                    <el-option value="拆墙工" label="拆墙工">拆墙工</el-option>
                    <el-option value="油漆工" label="油漆工">油漆工</el-option>
                    <el-option value="安装工" label="安装工">安装工</el-option>
                    <el-option value="水电工" label="水电工">水电工</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="手机号" prop="userName">
                <el-input type="text" v-model="userInfo.userName" placeholder="请输入手机号" autocomplete="off"></el-input>
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
                <el-button type="default" @click="$router.push('/admin/work/list')" plain>取消</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
	import {phoneNo, special} from '@/common/regex';

	export default {
		data() {
			return {
				userInfo: {
					userName: '',
					password: '',
					showName: '',
					role: 4,
					confirmPassWord: '',
				},
				rules: {
					userName: [
						{required: true, message: '请输入手机号码', trigger: 'blur'},
						{pattern: phoneNo, message: '请输入正确的手机号码', trigger: 'blur'}
					],
					showName: [
						{required: true, message: '请输入姓名', trigger: 'change'},
						{pattern: special, message: '请输入正确的姓名', trigger: 'blur'}
					],
					job: [
						{required: true, message: '请选择岗位', trigger: 'change'}
					],
					password: [
						{required: true, message: '请输入登录密码', trigger: 'change'},
						{min: 8, message: '密码长度8-15位', trigger: 'blur'},
						{max: 15, message: '密码长度8-15位', trigger: 'blur'},
					],
					confirmPassWord: [
						{required: true, message: '请输入确认密码', trigger: 'change'},
						{min: 8, message: '密码长度8-15位', trigger: 'blur'},
						{max: 15, message: '密码长度8-15位', trigger: 'blur'},
						{validator: this.validatePass, trigger: 'blur'},
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
							linkMobile: this.userInfo.userName,
						};
						this.$store.dispatch('employee/ADD_EMPLOYEE', params).then(res => {
							if (res.result === 'success') {
								this.$message.warning('保存成功');
								this.$router.push('/admin/work/list')
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
