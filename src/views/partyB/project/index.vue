<template>
    <section>
        <aside>
            <el-row class="h4 text-secondgrey search-wrapper">
                <el-col :span="6">
                    <label>项目编号：</label>
                    <el-input placeholder="请输入内容" v-model="search.projectCode"></el-input>
                </el-col>
                <el-col :span="6">
                    <label>项目名称：</label>
                    <el-input placeholder="请输入内容" v-model="search.projectName"></el-input>
                </el-col>
                <el-col :span="6">
                    <label>所属甲方：</label>
                    <el-select v-model="search.dept" placeholder="请选择" value="">
                        <el-option
                                v-for="(item,index) in partyAList"
                                :key="index"
                                :label="item.deptName"
                                :value="item.deptName">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <label>项目状态：</label>
                    <el-select placeholder="请选择" value="-1" v-model="search.status">
                        <el-option value="1" label="待开工">待开工</el-option>
                        <el-option value="2" label="未开工">未开工</el-option>
                        <el-option value="3" label="进行中">进行中</el-option>
                        <el-option value="4" label="已完成">已完成</el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="h4 text-secondgrey mt2 search-wrapper">
                <el-col :span="6">
                    <label>预计开工：</label>
                    <el-date-picker v-model="search.startTime" type="date" placeholder="请输入预计开工时间"
                                    value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-col>
                <el-col :span="6">
                    <label>至：</label>
                    <el-date-picker v-model="search.endTime" type="date" placeholder="请输入预计开工结束时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-col>
                <el-col :span="6">
                    <label>预计完工：</label>
                    <el-date-picker v-model="search.overStartTime" type="date" placeholder="请输入预计完工时间"
                                    value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-col>
                <el-col :span="6">
                    <label>至：</label>
                    <el-date-picker v-model="search.overEndTime" type="date" placeholder="请输入预计完工结束时间"
                                    value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-col>
            </el-row>
            <el-row class="h4 text-secondgrey mt2 search-wrapper">
                <el-col :span="6">
                    <label>项目经理：</label>
                    <el-select v-model="search.principal" placeholder="请选择" value="">
                        <el-option
                                v-for="(item,index) in projectManager"
                                :key="index"
                                :label="item.showName"
                                :value="item.userId">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
        </aside>
        <aside class="text-center mt2 todo-button">
            <el-button type="primary" icon="el-icon-search" @click="get_list">搜索</el-button>
            <el-button type="info" icon="el-icon-delete" @click="clear">清空</el-button>
        </aside>
        <aside class="mt4">
            <el-table border :data="list" style="width: 100%">
                <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
                <el-table-column prop="projectCode" label="项目编号" width="160"></el-table-column>
                <el-table-column prop="projectName" label="项目名称"></el-table-column>
                <el-table-column prop="demandCode" label="需求编号" width="160" align="center"></el-table-column>
                <el-table-column prop="province" label="项目地址">
                    <template slot-scope="scope">
                        <span>{{scope.row.province}}{{scope.row.area}}{{scope.row.area}}{{scope.row.address}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="项目状态" width="120" align="center">
                    <template slot-scope="scope">
                        <span v-html="subjectStatus(scope.row.status)"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="startTime" label="预计开工日期" width="160" align="center">
                    <template slot-scope="scope">
                        {{timestampToTime(scope.row.startTime,'D')}}
                    </template>
                </el-table-column>
                <el-table-column prop="endTime" label="预计完工日期" width="160" align="center">
                    <template slot-scope="scope">
                        {{timestampToTime(scope.row.endTime,'D')}}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="项目异常" width="120" align="center">
                    <template slot-scope="scope">
                        {{scope.row.exception?'是':'--'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="80" align="center">
                    <template slot-scope="scope">
                        <router-link tag="a" :to="'/admin/project/detail/'+scope.row.projectId" class="text-primary">详情</router-link>
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
    </section>
</template>

<script>
	export default {
		data() {
			return {
				list: [],//项目列表
				partyAList: [],
				projectManager: [],
				search: {
					principal: '',
					projectName: '',
					projectCode: '',
					status: '',
					dept: '',
					startTime: '',
					endTime: '',
					overStartTime: '',
					overEndTime: ''
				},
				paginations: {
					page_index: 1, // 当前位于哪页
					total: 0, // 总条数`
					page_count: 0,//总页数
					page_size: 10, // 1页显示多少条
					pageSizes: [10, 25, 50], //每页显示多少条
					layout: 'total, sizes, prev, pager, next, jumper' // 翻页属性
				}
			}
		},
		mounted() {
			this.get_list();
			this.get_parta_list();
			this.get_projectmanager_list();
		},
		methods: {
			get_list() {
				let params = {
					...this.search,
					pageSize: this.paginations.page_size,
					start: this.paginations.page_index - 1,
				};
				this.$store.dispatch('project/QUERY_PROJECT_LIST', params).then(res => {
					if (res.result === 'error') {
						this.$message.warning(res.msg)
					} else {
						this.paginations.total = res.data.count;
						this.list = res.data.data;
					}
				})
			},
			//所属甲方
			get_parta_list() {
				this.$store.dispatch('employee/QUERY_PARTYA_LIST').then(res => {
					if (res.result === 'error') {
						this.$message.warning(res.msg)
					} else {
						this.partyAList = res.data;
					}
				})
			},
			//项目经理
			get_projectmanager_list() {
				this.$store.dispatch('employee/QUERY_WORK_LIST', {role: 3}).then(res => {
					if (res.result === 'error') {
						this.$message.warning(res.msg)
					} else {
						this.projectManager = res.data;
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
			}
		}
	}
</script>

<style scoped>
    label {
        display: inline-block;
        width: 80px;
    }
</style>
<style>
    .search-wrapper .el-input__inner {
        width: 250px
    }
</style>
