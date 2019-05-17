<template>
    <section>
        <el-row class="h2">
            <el-col :span="12">
                项目基本信息
            </el-col>
            <el-col :span="12" class="text-right">
                <span class="prl1">期望交付日期：{{timestampToTime(detail.expectedDate,'D')}}</span>
                <el-button type="primary" v-if="detail.status!==4" ref="editBtn" @click="todoEdit">修改</el-button>
                <el-date-picker
                        ref="datepicker"
                        v-model="newDate"
                        type="date"
                        placeholder="选择日期"
                        style="height:0;width:0;overflow:hidden"
                        @change="changeExpectDate"
                        value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
            </el-col>
        </el-row>
        <table class="tb-baseInfo mt1">
            <tr>
                <td class="title">项目编号</td>
                <td class="content">{{detail.projectCode}}</td>
                <td class="title">项目名称</td>
                <td class="content">{{detail.projectName}}</td>
                <td class="title">建筑面积/m<sup>2</sup></td>
                <td class="content">{{detail.buildArea}}</td>
            </tr>
            <tr>
                <td class="title">项目状态</td>
                <td class="content"><span v-html="subjectStatus(detail.status)"></span></td>
                <td class="title">项目地址</td>
                <td class="content">{{detail.province}}{{detail.city}}{{detail.area}}{{detail.address}}</td>
                <td class="title">甲方联系人</td>
                <td class="content">{{detail.contactName}}</td>
            </tr>
            <tr>
                <td class="title">甲方联系电话</td>
                <td class="content">{{detail.contactPhone}}</td>
                <td class="title">加盟方联系人</td>
                <td class="content">{{detail.joinName}}</td>
                <td class="title">加盟方联系电话</td>
                <td class="content">{{detail.joinPhone}}</td>
            </tr>
        </table>
        <h2 class="ptb1">乙方配置信息</h2>
        <table class="tb-baseInfo">
            <tr>
                <td class="title">项目经理-电话</td>
                <td class="content">{{detail.showName}}/{{detail.linkMobile}}</td>
                <td class="title">预计开工日期</td>
                <td class="content">{{timestampToTime(detail.startTime,'D')}}</td>
                <td class="title">预计完工日期</td>
                <td class="content">{{timestampToTime(detail.endTime,'D')}}</td>
            </tr>
            <tr>
                <td class="title">实际开工日期</td>
                <td class="content">{{timestampToTime(detail.endTime)}}</td>
                <td class="title">实际完工日期</td>
                <td class="content">{{timestampToTime(detail.endTime)}}</td>
                <td class="title"></td>
                <td class="content"></td>
            </tr>
        </table>
        <aside style="position:relative">
            <div class="project-other-info">
                <h3 v-if="detail.status===1">距离开工还有 <span class="text-primary">{{detail.planDistanceDays}}</span>天</h3>
                <h3 v-if="detail.status===2||detail.status===3">
                    预计开工第 <span class="text-primary">{{detail.planDistanceDays}}</span>天，
                    实际开工第 <span class="text-primary">{{detail.actualDistanceDays}}</span>天
                </h3>
            </div>
            <el-tabs v-model="activeName" class="mt2 detail-tabs">
                <el-tab-pane name="first">
                    <h3 slot="label">项目施工进度</h3>
                    <project-progress
                            :projectNodes="detail.projectNodes"
                            :start="detail.startTime"
                            :end="detail.endTime"
                            v-if="detail.startTime"
                            ref="nodes"
                    ></project-progress>
                    <aside class="text-center mt2 todo-button">
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
                <el-tab-pane name="third" class="h0">
                    <h3 slot="label">相关资料附件</h3>
                    <file-list :projectId="projectId" :canUpload="false" :canDel="false"></file-list>
                </el-tab-pane>
            </el-tabs>
        </aside>
    </section>
</template>

<script>
	import noticBoard from '@/components/notic-board'
	import fileList from '@/components/file-list'
	import projectProgress from '@/components/project-progress'
	import moment from 'moment'

	export default {
		components: {noticBoard, fileList, projectProgress},
		data() {
			return {
				isEdit: false,
				newDate: '',
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
			todoEdit() {
				this.$refs.datepicker.focus();
			},
			changeExpectDate(value) {
				if (this.detail.expectedDate >= moment(value).valueOf()) {
					this.$message.warning('日期不能早于已设定的期望交付日期');
					return false;
				}
				this.$confirm('确定要修改期望交付日期吗？', '系统提示', {
					confirmButtonText: '取消',
					cancelButtonText: '修改',
					cancelButtonClass: 'el-button--primary',
					confirmButtonClass: 'el-button--default',
					type: 'warning'
				}).then(() => {

				}).catch(() => {
					let params = {
						endTime: moment(value).format('YYYY-MM-DD'),
						projectId: this.projectId
					};
					this.$store.dispatch('project/UPDATE_PROJECT_DATE', params).then(res => {
						if (res.result === 'success') {
							this.$message.success('修改成功！');
							this.get_detail();
						} else {
							this.$message.warning(res.msg)
						}
					})
				});
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
            width: 10%;
            height: 25px;
            color: #303133;
            background: #e8f3ff
        }
        .content {
            width: 23%;
        }
    }

    .project-other-info {
        position: absolute;
        top: 0;
        right: 0;
    }
</style>
