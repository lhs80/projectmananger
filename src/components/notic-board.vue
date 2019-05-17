<template>
    <section>
        <h4 class="text-primary" @click="showTipsMan=true">
            <el-button type="text">
                <i class="el-icon-circle-plus h2" style="vertical-align:middle"></i>
                <span class="h4">添加要提醒的人</span>
            </el-button>
            <div>
                <el-tag
                        v-for="user in toUserObj"
                        :key="user.userId"
                        closable
                        style="margin-right:10px"
                        @close="removeToUser(user)"
                >
                    {{user.showName}}
                </el-tag>
            </div>
        </h4>
        <el-input type="textarea" rows="2" class="mt1" v-model="noticInfo.content"></el-input>
        <div class="text-center mt2  todo-button">
            <el-button size="small" type="primary" @click="add_notic" :disabled="!noticInfo.content">
                <i class="iconfont iconfasong h5"></i><span class="prl1 h5">发送</span>
            </el-button>
        </div>
        <aside class="mt2" style="height:600px;overflow-y:auto">
            <div v-for="(item,index) in notic" :key="index" :class="index===0?'':'mt2'">
                <h4 :class="isMySend(item.createId)?'text-success':'text-primary'">{{item.createUser}}：</h4>
                <div class="ptb1 prl3 border-radius" :class="isMySend(item.createId)?'board-wrapper-green':'board-wrapper-blue'">
                    <h5 class="text-grey">{{item.content}}</h5>
                    <h6 :class="isAntMe(item.toUser)" v-if="item.toUser">提到了{{item.toUser}}</h6>
                    <h6 class="text-secondgrey">{{timestampToTime(item.createTime,'T')}}</h6>
                </div>
            </div>
        </aside>
        <el-dialog
                title="选择要提醒的人(可多选)"
                :visible.sync="showTipsMan"
                width="500px"
                :modal-append-to-body="false"
        >
            <el-checkbox-group v-model="toUser">
                <el-checkbox :label="item.userId"
                             v-for="(item,index) in toTipManList"
                             :key="index"
                             @change="(value)=>change(value,item)"
                >
                    {{item.job+item.showName}}
                </el-checkbox>
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="completeSelect">确 定</el-button>
                <el-button @click="showTipsMan = false">取 消</el-button>
              </span>
        </el-dialog>
    </section>
</template>

<script>
	import {mapGetters} from 'vuex'

	export default {
		props: ['projectId'],
		data() {
			return {
				showTipsMan: false,
				notic: [],//公告列表
				toTipManList: [],//要提醒的人列表
				toUser: [],//用户选择的要提醒的人
				toUserObj: [],//用于显示在页面上的要提醒的人
				noticInfo: {
					projectId: this.projectId,
					content: '',
				}
			}
		},
		computed: {
			...mapGetters('user', ['GET_USERINFO']),
			//是不是我发送的消息
			isMySend() {
				return function (userId) {
					return this.GET_USERINFO.userId === userId
				}
			},
			isAntMe() {
				return function (name) {
					return name.indexOf(this.GET_USERINFO.name) >= 0 ? 'text-warning' : '';
				}
			}
		},
		mounted() {
			this.get_notic();
			this.query_notic_mane();
		},
		methods: {
			get_notic() {
				this.$store.dispatch('project/QUERY_PROJECT_NOTIC', {projectId: this.projectId}).then(res => {
					if (res.result === 'success') {
						this.notic = res.data;
					} else {
						this.$message.warning(res.msg)
					}
				})
			},
			add_notic() {
				let params = {
					...this.noticInfo,
					toUser: this.toUser.toString(),
					createUser: this.GET_USERINFO.userId
				};
				this.$store.dispatch('project/ADD_NOTIC', params).then(res => {
					if (res.result === 'success') {
						this.get_notic();
						this.noticInfo.content = '';
						this.toUser = [];
						this.toUserObj = []
					} else {
						this.$message.warning(res.msg)
					}
				})
			},
			query_notic_mane() {
				this.$store.dispatch('project/QUERY_NOTIC_MAN', {projectId: this.projectId}).then(res => {
					if (res.result === 'success') {
						this.toTipManList = res.data;
					} else {
						this.$message.warning(res.msg)
					}
				})
			},
			//完成选择要通知的人
			completeSelect() {
				this.showTipsMan = false;

			},
			change(value, item) {
				if (value) {
					this.toUserObj.push({
						showName: item.showName,
						userId: item.userId
					});
				} else {
					this.removeToUser(item)
				}
			},
			removeToUser(item) {
				this.toUserObj.splice(this.toUserObj.indexOf(item), 1);
				this.toUser.splice(this.toUser.indexOf(item.userId), 1);
			}
		}
	}
</script>

<style lang="less" scoped>
    .board-wrapper-blue {
        border: 1px solid rgba(206, 230, 255, 1);
        background: #ecf6ff
    }

    .board-wrapper-green {
        border: 1px solid rgba(215, 239, 206, 1);
        background: #eff9ec
    }
</style>
