<template>
    <section>
        <el-form :model="userInfo" :rules="rules" ref="userInfo" label-width="150px" class=" mt4 form-wrapper">
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
            <el-form-item>
                <el-button type="primary" @click="add('userInfo')">提交</el-button>
                <el-button type="default" @click="$router.push('/admin/owner/list')" plain>取消</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
	import {phoneNo, special} from '@/common/regex';

	export default {
		data() {
			return {
				queryName: this.$route.params.uname,
				userInfo: {
					dept: '',
					userName: '',
					showName: '',
					linkMan: '',
					linkMobile: '',
					role: 2,
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
					]
				}
			}
		},
		mounted() {
			this.get_detail();
		},
		methods: {
			add(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						this.$store.dispatch('employee/MODIFY_USERINFO_DETAIL', this.userInfo).then(res => {
							if (res.result === 'success') {
								this.$message.warning('更新成功');
								this.$router.push('/admin/owner/list')
							} else {
								this.$message.warning(res.msg)
							}
						})
					}
				})
			},
			get_detail() {
				this.$store.dispatch('employee/QUERY_USERINFO_DETAIL', {userName: this.queryName}).then(res => {
					if (res.result === 'success') {
						this.userInfo = res.data;
					} else {
						this.$message.warning(res.msg);
					}
				})
			},
		}
	}
</script>

<style scoped>

</style>
