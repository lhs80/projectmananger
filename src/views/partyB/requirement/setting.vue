<template>
    <section>
        <super-table :projectInfo="projectInfo" @updateData="updateData" @updateOverData="updateOverData"></super-table>
    </section>
</template>

<script>
	import superTable from '@/components/super-table'

	export default {
		components: {
			superTable,
		},
		data() {
			return {
				projectInfo: {
					projectId: this.$route.params.id,
					nodes: []
				},
				isUpdateNode: false
			}
		},
		mounted() {
			this.get_list();
			let self = this;
			window.onbeforeunload = function (e) {
				if (self.$route.fullPath.indexOf('/admin/require/setting/') >= 0 && self.isUpdateNode) {
					e = e || window.event;
					// 兼容IE8和Firefox 4之前的版本
					if (e) {
						e.returnValue = '关闭提示';
					}
					// Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
					return '关闭提示';
				} else {
					window.onbeforeunload = null
				}
			}
		},
		methods: {
			get_list() {
				this.$store.dispatch('nodes/QUERY_NODES', {projectId: this.projectInfo.projectId}).then(res => {
					if (res.result === 'success') {
						this.projectInfo.nodes = res.data;
					} else {
						this.$message.warning(res.msg)
					}
				})
			},
			get_detail() {
				this.$store.dispatch('project/QUERY_TEMP_PROJECT_DETAIL', {projectId: this.projectInfo.projectId}).then(res => {
					if (res.result === 'success') {
						const {startTime, endTime, projectNodes} = res.data;
						this.projectInfo = {
							startTime,
							endTime,
							nodes: projectNodes
						}
					} else {
						this.$message.warning(res.msg)
					}
				})
			},
			updateData() {
				this.isUpdateNode = true;
			},
			updateOverData() {
				this.isUpdateNode = false;
				this.$router.push(`/admin/project/${this.projectInfo.projectId}`)
			}
		}
	}
</script>

<style scoped>

</style>
