<template>
    <section>
        <div class="h1">
            基本信息
            <span v-html="projectStatus(detail.status,'K')"></span>
        </div>
        <el-row class="h3 text-center base-info confirm" v-if="detail.status===1">
            <el-col :span="4" class="bg-info">需求编号</el-col>
            <el-col :span="8" class="text-secondgrey">{{detail.demandCode}}</el-col>
            <el-col :span="4" class="bg-info">添加日期</el-col>
            <el-col :span="8" class="text-secondgrey">{{timestampToTime(detail.createTime,'D')}}</el-col>
        </el-row>
        <el-row class="h3 text-center base-info confirm" v-if="detail.status===2">
            <el-col :span="4" class="bg-info">需求编号</el-col>
            <el-col :span="8" class="text-secondgrey">{{detail.demandCode}}</el-col>
            <el-col :span="4" class="bg-info">添加日期</el-col>
            <el-col :span="8" class="text-secondgrey">{{timestampToTime(detail.createTime,'D')}}</el-col>
        </el-row>
        <el-row class="h3 text-center base-info confirm" v-if="detail.status===2">
            <el-col :span="4" class="bg-info">确认日期</el-col>
            <el-col :span="8" class="text-secondgrey">{{timestampToTime(detail.confirmTime,'D')}}</el-col>
            <el-col :span="4" class="bg-info">项目编号</el-col>
            <el-col :span="8" class="text-secondgrey">{{detail.projectCode}}</el-col>
        </el-row>
        <el-row class="h3 text-center base-info" v-if="detail.status===0">
            <el-col :span="2" class="bg-info">需求编号</el-col>
            <el-col :span="6" class="text-secondgrey">{{detail.demandCode}}</el-col>
            <el-col :span="2" class="bg-info">添加日期</el-col>
            <el-col :span="6" class="text-secondgrey">{{timestampToTime(detail.createTime,'D')}}</el-col>
            <el-col :span="2" class="bg-info">取消日期</el-col>
            <el-col :span="6" class="text-secondgrey">{{timestampToTime(detail.cancelTime,'D')}}</el-col>
        </el-row>
        <div class="h1">详细信息</div>
        <aside class="content">
            <div><span class="text-grey title">需求名称：</span><span class="text-secondgrey">{{detail.projectName}}</span>
            </div>
            <div>
                <span class="text-grey title">建筑面积：</span>
                <span class="text-secondgrey">{{detail.buildArea}} m<sup>2</sup></span>
            </div>
            <div>
                <span class="text-grey title">项目地址：</span>
                <span class="text-secondgrey">{{detail.province}}{{detail.city}}{{detail.area}}</span>
            </div>
            <div><span class="text-grey title">详细地址：</span><span class="text-secondgrey">{{detail.address}}</span></div>
            <div><span class="text-grey title">期望交付日期：</span><span
                    class="text-secondgrey">{{timestampToTime(detail.expectedDate,'D')}}</span>
            </div>
            <div><span class="text-grey title">甲方联系人：</span><span class="text-secondgrey">{{detail.contactName}}</span>
            </div>
            <div><span class="text-grey title">甲方联系电话：</span><span
                    class="text-secondgrey">{{detail.contactPhone}}</span>
            </div>
            <div><span class="text-grey title">加盟方联系人：</span><span
                    class="text-secondgrey">{{detail.joinName||'无'}}</span>
            </div>
            <div><span class="text-grey title">加盟方联系电话：</span><span
                    class="text-secondgrey">{{detail.joinPhone||'无'}}</span>
            </div>
            <div><span class="text-grey title">备注：</span> <span class="text-secondgrey">{{detail.remark||'无'}}</span>
            </div>
        </aside>
        <aside class="text-center mt2 todo-button">
            <el-button type="primary" v-if="detail.status===1"
                       @click="$router.push('/admin/require/confirm/'+demandId)">
                确认需求
            </el-button>
            <el-button type="primary" v-if="detail.status===2" @click="$router.push('/admin/project/detail/'+detail.projectId)">查看对应项目</el-button>
        </aside>
    </section>
</template>

<script>
	export default {
		data() {
			return {
				demandId: this.$route.params.id,
				detail: {}
			}
		},
		mounted() {
			this.get_detail();
		},
		methods: {
			get_detail() {
				this.$store.dispatch('requirement/REQUIRE_DETAIL', {demandId: this.demandId}).then(res => {
					if (res.result === 'success') {
						this.detail = res.data;
					}
				})
			},
			cancel() {
				let params = {
					demandId: this.demandId,
					status: 0
				};
				this.$store.dispatch('requirement/UPDATE_CANCEL_REQUIRE', params).then(res => {
					if (res.result === 'success') {
						this.get_detail()
					} else {
						this.$message.error(res.msg);
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
    .title {
        display: inline-block;
        width: 128px;
        margin-right: 40px;
        text-align: right;
    }

    .base-info {
        &.confirm {
            width: 1000px;
        }
        & + .base-info {
            margin-top: -57px;
        }
        height: 46px;
        border: solid 1px #dcdfe6;
        margin: 24px 0 56px 0;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        .el-col {
            height: 44px;
            line-height: 44px;
            &:not(:last-child) {
                border-right: solid 1px #dcdfe6;
            }
        }
    }

    .content {
        border: solid 1px #dcdfe6;
        margin-top: 24px;
        padding: 50px 0 50px 527px;
        font-size: 15px;
        div {
            margin: 10px auto;
        }
    }
</style>
