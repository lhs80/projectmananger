<template>
    <section>
        <super-table v-if="projectInfo.nodes.length" :projectInfo="projectInfo" @updateData="updateData"
                     @updateOverData="updateOverData" @allowToNextPage="allowToNextPage"></super-table>
    </section>
</template>

<script>
	import superTable from '@/components/super-table'
	import {getStore} from '@/utils/store'

	export default {
		components: {
			superTable,
		},
		data() {
			return {
				projectId: this.$route.params.id,
				projectInfo: {
					nodes: [],
					updateFlag: false
				},
				isUpdateNode: false
			}
		},
		beforeRouteLeave(to, from, next) {
			if (this.isUpdateNode) {
				this.$confirm('离开页面数据将丢失，确定离开么？', '系统提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					cancelButtonClass: 'el-button--primary',
					confirmButtonClass: 'el-button--default',
					type: 'success'
				}).then(() => {
					next()
				}).catch(() => {

				});
			} else {
				next();
			}
		},
		mounted() {
			this.get_detail();
			let self = this;
			window.onbeforeunload = function (e) {
				if (self.$route.fullPath.indexOf('/admin/project/setting/') >= 0 && self.isUpdateNode) {
					e = e || window.event;
					// 兼容IE8和Firefox 4之前的版本
					if (e) {
						e.returnValue = '关闭提示';
					}
					return '关闭提示';
				} else {
					window.onbeforeunload = null
				}
			}
		},
		methods: {
			get_list() {
				this.$store.dispatch('nodes/QUERY_NODES', {projectId: this.projectId}).then(res => {
					this.projectInfo.nodes = res.data;
				}).catch(err => {
					this.$message.warning(err.msg)
				})
			},
			async get_detail() {
				await this.$store.dispatch('project/QUERY_PROJECT_DETAIL', {projectId: this.projectId}).then(res => {
					if (res.msg === '404') {
						// this.projectInfo = {
						// 	startTime: getStore({name: 'start'}),
						// 	endTime: getStore({name: 'end'}),
						// 	updateFlag: true,
						// 	nodes: this.get_list()
						// };
						this.projectInfo.startTime = getStore({name: 'start'});
						this.projectInfo.endTime = getStore({name: 'end'});
						this.projectInfo.updateFlag = true;
						this.get_list();
					} else {
						const {startTime, endTime, projectNodes, updateFlag} = res.data;
						this.projectInfo = {
							startTime,
							endTime,
							nodes: projectNodes,
							updateFlag: updateFlag !== 0
						};
						if (!projectNodes.length) {
							this.get_list();
						}
					}
				}).catch(err => {
						this.$message.warning(err.msg)
					}
				)
			},
			updateData() {
				this.isUpdateNode = true;
			},
			updateOverData(projectId) {
				this.isUpdateNode = false;
				this.$router.push(`/admin/project/detail/${projectId}`)
			},
			allowToNextPage() {
				this.canLeavePage = true;
			}
		}
	}
</script>
