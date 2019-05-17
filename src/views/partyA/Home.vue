<template>
    <section>
        <el-row>
            <el-col :span="12">
                <div id="myChart" :style="{width: '600px', height: '350px'}"></div>
            </el-col>
            <el-col :span="12">
                <div id="statusChart" :style="{width: '600px', height: '350px'}"></div>
            </el-col>
        </el-row>
        <aside>
            <div class="h0">
                <span>项目进度总览</span>
                <span class="prl1"><el-checkbox v-model="checked" class="h1" size="medium" @change="checkDoing">仅进行中的</el-checkbox></span>
            </div>
            <el-table border :data="detail.percentList" class="mt1" style="width: 100%">
                <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
                <el-table-column prop="projectName" label="项目名称" align="center">
                    <template slot-scope="scope">
                        <router-link tag="a" :to="`/project/detail/${scope.row.projectId}`" class="text-primary">{{scope.row.projectName}}
                        </router-link>
                        <!--<router-link>{{scope.row.projectName}}</router-link>-->
                    </template>
                </el-table-column>
                <el-table-column prop="exception" label="项目状态" align="center" width="200">
                    <template slot-scope="scope">
                        {{scope.row.exception?'异常':'正常'}}
                    </template>
                </el-table-column>
                <el-table-column prop="linkMobile" label="项目进度" align="center">
                    <template slot-scope="scope">
                        <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.percent*100"></el-progress>
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
				status: 0,
				checked: false,
				detail: {},
				paginations: {
					page_index: 1, // 当前位于哪页
					total: 0, // 总条数`
					page_count: 0,//总页数
					page_size: 10, // 1页显示多少条
					pageSizes: [10, 25, 50], //每页显示多少条
					layout: 'total, sizes, prev, pager, next, jumper' // 翻页属性
				},
			}
		},
		mounted() {
			this.get_detail();
		},
		methods: {
			get_detail() {
				let params = {
					pageNum: this.paginations.page_index,
					pageSize: this.paginations.page_size,
					status: Number(this.status)
				};
				this.$store.dispatch('user/QUERY_HOME_DATA', params).then(res => {
					if (res.result === 'success') {
						this.paginations.total = res.data.totalPage;
						this.detail = res.data;
						this.drawDemand();
						this.drawStatus();
					} else {
						this.$message.warning(res.msg)
					}
				})
			},
			drawDemand() {
				let myChart = this.$echarts.init(document.getElementById('myChart'));
				let data = JSON.parse(JSON.stringify(this.detail.demandList).replace(/percent/g, 'value').replace(/statusName/g, 'name'));
				myChart.setOption({
					title: {
						text: `需求状态分布(共${this.detail.demandCount}个)`,
						'textStyle': {
							'fontSize': 24
						}
					},
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b} : {d}%',
						'textStyle': {
							'fontSize': 18
						}
					},
					color: ['#FF9F7F', '#BDD15A', '#ffbb5b', '#409EFF'],
					series: [
						{
							name: '需求状态分布',
							type: 'pie',
							radius: ['20%', '50%'],
							center: ['60%', '45%'],
							data: data,
							itemStyle: {
								emphasis: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								},
								normal: {
									label: {
										show: true,
										formatter: ' {d}% \n {b} ',
										'fontSize': 16
									}
								}
							},
						}
					]
				})
			},
			drawStatus() {
				let myChart = this.$echarts.init(document.getElementById('statusChart'));
				let data = JSON.parse(JSON.stringify(this.detail.projectList).replace(/percent/g, 'value').replace(/statusName/g, 'name'));
				myChart.setOption({
					itemStyle: {
						normal: {
							label: {
								show: true,
								formatter: '{d}%\n{b}'
								// formatter: '10\n5'
							}
						}
					},
					title: {
						text: `项目状态分布(共${this.detail.projectCount}个)`,
						'textStyle': {
							'fontSize': 24
						}
					},
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b} : {d}%',
						'textStyle': {
							'fontSize': 18
						}
					},
					color: ['#ffbb5b', '#FF9F7F', '#409EFF', '#BDD15A',],
					series: [
						{
							name: '需求状态分布',
							type: 'pie',
							radius: ['20%', '50%'],
							center: ['55%', '45%'],
							data: data,
							itemStyle: {
								emphasis: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								},
								normal: {
									label: {
										show: true,
										formatter: ' {d}% \n {b} ',
										'fontSize': 16
									}
								}
							}
						}
					]
				})
			},
			// 每页多少条切换
			handleSizeChange(page_size) {
				this.paginations.page_size = page_size;
				this.get_detail()
			},
			// 上下分页
			handleCurrentChange(page) {
				this.paginations.page_index = page;
				this.get_detail();
			},
			checkDoing() {
				if (this.checked) {
					this.status = 3;
				} else {
					this.status = 0;
				}
				this.get_detail();
			}
		}
	}
</script>
