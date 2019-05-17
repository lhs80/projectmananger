<template>
    <section>
        <div class="h1">
            项目基本信息
            <span v-html="subjectStatus(detail.status,'K')"></span>
        </div>
        <table class="tb-baseInfo mt1">
            <tr>
                <td class="title">项目编号</td>
                <td>{{detail.projectCode}}</td>
                <td class="title">项目名称</td>
                <td>{{detail.projectName}}</td>
                <td class="title">建筑面积/m<sup>2</sup></td>
                <td>{{detail.buildArea}}</td>
            </tr>
            <tr>
                <td class="title">期望交付日期</td>
                <td>{{timestampToTime(detail.expectedDate,'D')}}</td>
                <td class="title">项目地址</td>
                <td>{{detail.province}}{{detail.city}}{{detail.area}}{{detail.address}}</td>
                <td class="title">甲方联系人</td>
                <td>{{detail.contactName}}</td>
            </tr>
            <tr>
                <td class="title">甲方联系电话</td>
                <td>{{detail.contactPhone}}</td>
                <td class="title">加盟方联系人</td>
                <td>{{detail.joinName||'无'}}</td>
                <td class="title">加盟方联系电话</td>
                <td>{{detail.joinPhone||'无'}}</td>
            </tr>
            <tr>
                <td class="title">项目经理-电话</td>
                <td>{{detail.showName}}/{{detail.linkMobile}}</td>
                <td class="title">预计开工日期</td>
                <td>{{timestampToTime(detail.startTime,'D')}}</td>
                <td class="title">预计完工日期</td>
                <td>{{timestampToTime(detail.endTime,'D')}}</td>
            </tr>
            <tr>
                <td class="title">实际开工日期</td>
                <td>{{timestampToTime(detail.endTime) || '--'}}</td>
                <td class="title">实际完工日期</td>
                <td>{{timestampToTime(detail.endTime) || '--'}}</td>
                <td class="title"></td>
                <td></td>
            </tr>
        </table>
        <aside style="position:relative">
            <div class="project-other-info">
                <h3 v-if="detail.status===1">距离开工还有<span class="text-primary prl1">{{detail.planDistanceDays}}</span>天</h3>
                <h3 v-if="detail.status===2||detail.status===3">
                    预计开工第<span class="text-primary prl1">{{detail.planDistanceDays}}</span>天，
                    实际开工第<span class="text-primary prl1">{{detail.actualDistanceDays}}</span>天
                </h3>
            </div>
            <el-tabs v-model="activeName" class="mt2 detail-tabs">
                <el-tab-pane name="first">
                    <h3 slot="label">项目施工进度</h3>
                    <project-progress
                            :projectNodes="detail.projectNodes"
                            :start="detail.startTime"
                            :end="detail.endTime"
                            v-if="detail.projectNodes"
                            ref="nodes"
                    ></project-progress>
                    <aside class="text-center mt2 todo-button">
                        <el-button type="primary" v-if="detail.status!==4" @click="$router.push('/admin/project/update/'+projectId)">
                            修改基本信息
                        </el-button>
                        <el-button type="primary"
                                   v-if="detail.status!==4"
                                   @click="$router.push(`/admin/project/setting/${projectId}`)">
                            配置项目
                        </el-button>
                        <el-button type="primary" @click="showAllView">
                            全屏预览
                        </el-button>
                    </aside>
                </el-tab-pane>
                <!--项目公告板-->
                <el-tab-pane name="second">
                    <h3 slot="label">项目公告板</h3>
                    <notic-board :projectId="projectId"></notic-board>
                </el-tab-pane>
                <!--项目附件-->
                <el-tab-pane name="third">
                    <h3 slot="label">相关资料附件</h3>
                    <file-list :projectId="projectId" canUpload="true" canDel="true"></file-list>
                </el-tab-pane>
            </el-tabs>
        </aside>
    </section>
</template>

<script>
	import noticBoard from '@/components/notic-board'
	import fileList from '@/components/file-list'
	import projectProgress from '@/components/project-progress'

	export default {
		components: {noticBoard, fileList, projectProgress},
		data() {
			return {
				activeName: 'first',
				projectId: this.$route.params.id,
				detail: {},
			}
		},
		mounted() {
			this.get_detail();
		},
		methods: {
			get_detail() {
				this.$store.dispatch('project/QUERY_PROJECT_DETAIL', {projectId: this.projectId}).then(res => {
					if (res.result === 'success') {
						this.detail = res.data;
					} else {
						this.$message.warning(res.msg)
					}
				})
			},
			showAllView() {
				this.$refs.nodes.previewOverAll();
			}
		}
	}
</script>

<style lang="less" scoped>
    .tb-baseInfo {
        width: 100%;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        font-size: 15px;
        text-align: center;
        border-collapse: collapse;
        td {
            color: #909399;
            border: solid 1px #dcdfe6;
        }
        .title {
            width: 150px;
            height: 25px;
            color: #303133;
            background: #e8f3ff
        }
    }

    .project-other-info {
        position: absolute;
        top: 0;
        right: 0;
    }
</style>
