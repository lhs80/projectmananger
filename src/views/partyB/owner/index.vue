<template>
    <section>
        <aside>
            <el-row class="h4 text-secondgrey">
                <el-col :span="6">
                    <label>公司名称：</label>
                    <el-input placeholder="请输入内容" v-model="search.dept" label="项目名称"></el-input>
                </el-col>
                <el-col :span="6">
                    <label>显示姓名：</label>
                    <el-input placeholder="请输入内容" v-model="search.showName"></el-input>
                </el-col>
                <el-col :span="6">
                    <label>联系人：</label>
                    <el-input placeholder="请输入内容" v-model="search.linkMan"></el-input>
                </el-col>
                <el-col :span="6">
                    <label>联系电话：</label>
                    <el-input placeholder="请输入内容" v-model="search.linkMobile"></el-input>
                </el-col>
            </el-row>
        </aside>
        <aside class="text-center mt4 todo-button">
            <el-button type="primary" icon="el-icon-search" @click="get_list">搜索</el-button>
            <el-button type="info" icon="el-icon-delete" @click="clear">清空</el-button>
        </aside>
        <aside class="mt4 todo-button">
            <el-button type="primary" icon="el-icon-plus" @click="$router.push('/admin/owner/add')">添加甲方业主</el-button>
        </aside>
        <aside class="mt4">
            <el-table border :data="list" style="width: 100%">
                <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
                <el-table-column prop="dept" label="公司名称" width="350" align="center"></el-table-column>
                <el-table-column prop="showName" label="显示姓名" width="180" align="center"></el-table-column>
                <el-table-column prop="linkMan" label="联系人" align="center"></el-table-column>
                <el-table-column prop="linkMobile" label="联系电话" align="center"></el-table-column>
                <el-table-column prop="createTime" label="添加时间" align="center">
                    <template slot-scope="scope">
                        {{timestampToTime(scope.row.createTime,'D')}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="$router.push('/admin/owner/update/'+scope.row.userName)">查看
                        </el-button>
                        <el-button type="text" @click="toModityPwd(scope.row.userId)">重置密码</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    :page-sizes="paginations.pageSizes"
                    :page-size="paginations.page_size"
                    :layout="paginations.layout"
                    :total="paginations.total"
                    :current-page="paginations.page_index"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    class="mt4 pull-right"
            ></el-pagination>
        </aside>
        <el-dialog
                title="重置密码"
                :visible.sync="showUpdatePwd"
                width="30%"
                :modal-append-to-body="false"
        >
            <el-form :model="userInfo" :rules="rules" ref="userInfo" label-width="150px">
                <el-form-item label="登录密码" prop="password">
                    <el-input type="password" v-model="userInfo.password" placeholder="请输入新密码"
                              autocomplete="off" min="8" max="15"></el-input>
                </el-form-item>
                <el-form-item label="再次输入登录密码" prop="confirmPassWord">
                    <el-input type="password" v-model="userInfo.confirmPassWord" placeholder="请再次输入"
                              autocomplete="off" min="8" max="15"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="update('userInfo')">确定</el-button>
                <el-button @click="showUpdatePwd = false">取消</el-button>
              </span>
        </el-dialog>
    </section>
</template>

<script>
	import md5 from 'js-md5'

	export default {
		data() {
			return {
				showUpdatePwd: false,
				list: [],
				userInfo: {
					userId: '',
					password: '',
					confirmPassWord: ''
				},
				search: {
					showName: '',
					dept: '',
					linkMan: '',
					linkMobile: '',
				},
				paginations: {
					page_index: 1, // 当前位于哪页
					total: 0, // 总条数`
					page_count: 0,//总页数
					page_size: 10, // 1页显示多少条
					pageSizes: [10, 25, 50], //每页显示多少条
					layout: 'total, sizes, prev, pager, next, jumper' // 翻页属性
				},
				rules: {
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
		mounted() {
			this.get_list();
		},
		methods: {
			get_list() {
				let params = {
					...this.search,
					role: 2,
					start: this.paginations.page_index - 1,
					pageSize: this.paginations.page_size
				};
				this.$store.dispatch('employee/QUERY_MulWORK_LIST', params).then(res => {
					if (res.result === 'error') {
						this.$message.warning(res.msg)
					} else {
						this.paginations.total = res.data.count;
						this.list = res.data.data;
					}
				})
			},
			clear() {
				this.search = {
					projectName: '',
					demandCode: '',
					projectCode: '',
					status: '',
				};
				this.get_list();
			},
			// 每页多少条切换
			handleSizeChange(page_size) {
				this.paginations.page_size = page_size;
				this.get_list()
			},
			// 上下分页
			handleCurrentChange(page) {
				this.paginations.page_index = page;
				this.get_list();
			},
			toModityPwd(userName) {
				this.showUpdatePwd = true;
				this.userInfo.userId = userName;
			},
			update(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						let params = {
							...this.userInfo,
							password: md5(this.userInfo.password),
							confirmPassWord: md5(this.userInfo.confirmPassWord)
						};
						this.$store.dispatch('employee/MODIFY_USERINFO_DETAIL', params).then(res => {
							if (res.result === 'success') {
								this.get_list();
								this.showUpdatePwd = false;
								this.$message.warning('更新成功')
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
