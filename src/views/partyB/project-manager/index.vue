<template>
    <section>
        <aside>
            <el-row class="h4 text-secondgrey">
                <el-col :span="6">
                    <label>名称：</label>
                    <el-input placeholder="请输入内容" v-model="search.showName" label="项目名称"></el-input>
                </el-col>
                <el-col :span="6">
                    <label>手机号：</label>
                    <el-input placeholder="请输入内容" v-model="search.linkMobile"></el-input>
                </el-col>
            </el-row>
        </aside>
        <aside class="text-center mt4 todo-button">
            <el-button type="primary" icon="el-icon-search" @click="get_list">搜索</el-button>
            <el-button type="info" icon="el-icon-delete" @click="clear">清空</el-button>
        </aside>
        <aside class="mt4 todo-button">
            <el-button type="primary" icon="el-icon-plus" @click="$router.push('/admin/projectmanage/add')">添加项目经理</el-button>
        </aside>
        <aside class="mt4">
            <el-table :data="list" style="width: 100%" border="">
                <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
                <el-table-column prop="showName" label="姓名" align="center"></el-table-column>
                <el-table-column prop="linkMobile" label="手机号" align="center"></el-table-column>
                <el-table-column prop="num" label="负责的未完成的项目数量" align="center"></el-table-column>
                <el-table-column prop="createTime" label="添加时间" align="center">
                    <template slot-scope="scope">
                        {{timestampToTime(scope.row.createTime,'T')}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="toModify(scope.row.userId)">修改</el-button>
                        <el-button type="text" @click="toModifyPwd(scope.row.userId)">重置密码</el-button>
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
        <!--修改姓名-->
        <el-dialog
                title="提示"
                :visible.sync="showUpdateName"
                width="600px"
                :modal-append-to-body="false"
        >
            <el-form :model="userInfo" :rules="nameRules" ref="userInfo" label-width="150px" class="form-wrapper">
                <el-form-item label="姓名" prop="showName">
                    <el-input placeholder="请输入内容" v-model="userInfo.showName" style="width:300px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="update('name','userInfo')">确 定</el-button>
                <el-button @click="showUpdateName = false">取 消</el-button>
              </span>
        </el-dialog>
        <!--重置密码-->
        <el-dialog
                title="重置密码"
                :visible.sync="showUpdatePwd"
                width="600px"
                :modal-append-to-body="false"
        >
            <el-form :model="userInfo" :rules="rules" ref="userInfo" label-width="180px" class="form-wrapper">
                <el-form-item label="登录密码" prop="password">
                    <el-input type="password" v-model="userInfo.password" placeholder="请输入新密码"
                              autocomplete="off" min="8" max="15" style="width:300px"></el-input>
                </el-form-item>
                <el-form-item label="再次输入登录密码" prop="confirmPassWord">
                    <el-input type="password" v-model="userInfo.confirmPassWord" placeholder="请再次输入"
                              autocomplete="off" min="8" max="15" style="width:300px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="update('psw','userInfo')">确 定</el-button>
                <el-button @click="showUpdatePwd = false">取 消</el-button>
              </span>
        </el-dialog>
    </section>
</template>

<script>
	import {special} from '@/common/regex';
	import md5 from 'js-md5'

	export default {
		data() {
			return {
				showUpdateName: false,
				showUpdatePwd: false,
				curId: '',
				list: [],
				search: {
					showName: '',
					linkMobile: ''
				},
				paginations: {
					page_index: 1, // 当前位于哪页
					total: 0, // 总条数`
					page_count: 0,//总页数
					page_size: 10, // 1页显示多少条
					pageSizes: [10, 25, 50], //每页显示多少条
					layout: 'total, sizes, prev, pager, next, jumper' // 翻页属性
				},
				userInfo: {
					userId: '',
					showName: '',
					password: '',
					confirmPassWord: ''
				},
				rules: {

					password: [
						{required: true, message: '请输入登录密码', trigger: 'blur'},
						{min: 8, message: '密码长度8-15位', trigger: 'blur'},
						{max: 15, message: '密码长度8-15位', trigger: 'blur'},
					],
					confirmPassWord: [
						{required: true, message: '请输入确认密码', trigger: 'change'},
						{validator: this.validatePass, trigger: 'blur'},
						{min: 8, message: '密码长度8-15位', trigger: 'blur'},
						{max: 15, message: '密码长度8-15位', trigger: 'blur'},
					]
				},
				nameRules: {
					showName: [
						{required: true, message: '请输入姓名', trigger: 'blur'},
						{pattern: special, message: '请输入正确的姓名', trigger: 'blur'}
					],
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
					pageSize: this.paginations.page_size,
					start: this.paginations.page_index - 1,
					role: 3
				};
				this.$store.dispatch('employee/QUERY_PROJECTMANAGE_LIST', params).then(res => {
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
			validatePass(rule, value, callback) {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.userInfo.password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			},
			toModify(userId) {
				this.showUpdateName = true;
				this.userInfo.userId = userId
			},
			toModifyPwd(userId) {
				this.showUpdatePwd = true;
				this.userInfo.userId = userId
			},
			update(type, formName) {
				let params = {};
				this.$refs[formName].validate(valid => {
					if (valid) {
						if (type === 'name')
							params = {
								userId: this.userInfo.userId,
								showName: this.userInfo.showName
							};
						else {
							params = {
								userId: this.userInfo.userId,
								password: md5(this.userInfo.password)
							};
						}
						this.$store.dispatch('employee/MODIFY_USERINFO_DETAIL', params).then(res => {
							if (res.result === 'success') {
								this.get_list();
								this.showUpdateName = false;
								this.showUpdatePwd = false;
								this.$message.warning('更新成功');
								this.userInfo = {
									userId: '',
									showName: '',
									password: '',
									confirmPassWord: ''
								}
							} else {
								this.$message.warning(res.msg)
							}
						})
					}
				})
			}
		}
	}
</script>
