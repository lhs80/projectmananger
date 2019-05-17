<template>
    <el-container>
        <el-header class="head">
            <el-row type="flex" align="middle" style="height:100%">
                <el-col :span="12" class="h0 text-grey">
                    <span class="logo">
                        <img src="../../assets/img/logo.png" alt="" width="40" style="vertical-align: middle">
                    </span>
                    <span>{{GET_WEBSITE.top.title}}</span>
                </el-col>
                <el-col :span="12" class="text-right h2 text-lightgrey">
                    <a href="" class="username">
                        <img src="../../assets/img/icon-header.png" alt="用户头像" width="38"
                             style="vertical-align: middle"
                             class="border-circle">
                        <i>{{GET_USERINFO.name}}</i>
                    </a>
                    <a><i class="iconfont icontuichu1 h0"></i><i @click="loginOut">退出</i></a>
                </el-col>
            </el-row>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <sidebar></sidebar>
            </el-aside>
            <el-main>
                <!--<tags></tags>-->
                <div class="router">
                    <keep-alive>
                        <router-view v-if="$route.meta.keepAlive"></router-view>
                    </keep-alive>
                    <router-view v-if="!$route.meta.keepAlive"></router-view>
                </div>
            </el-main>
        </el-container>
        <el-footer>
            <span>Copyright © 中卅建筑设计工程（苏州）有限公司</span>
            <a className='h3' href="http://www.miitbeian.gov.cn" target="_blank">苏ICP备18007312号-3</a>
        </el-footer>
    </el-container>
</template>

<script>
	import tags from './tags'
	import sidebar from './sidebar/'
	import {mapGetters} from 'vuex';

	export default {
		name: 'index',
		components: {
			tags,
			sidebar
		},
		computed: {
			...mapGetters('common', ['GET_WEBSITE']),
			...mapGetters('user', ['GET_USERINFO'])
		},
		methods: {
			loginOut() {
				this.$confirm('确定退出？', '系统提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					cancelButtonClass: 'el-button--primary',
					confirmButtonClass: 'el-button--default',
					type: 'warning'
				}).then(() => {
					this.$store.commit('user/loginout');
					this.$store.commit('tags/DEL_ALL_TAG');
					// this.$store.commit('tags/DEL_TAG_OTHER');
					// this.$store.commit('tags/DEL_TAG');
					this.$router.push('/login')
				}).catch(() => {

				});
			}
		}
	}
</script>

<style lang="less" scoped>
    .head {
        height: 72px !important;
        padding: 0 60px;
        -webkit-box-shadow: 0 2px 5px rgba(0, 0, 0, .12);
        -moz-box-shadow: 0 2px 5px rgba(0, 0, 0, .12);
        box-shadow: 0 2px 5px rgba(0, 0, 0, .12);
        .logo {
            margin-right: 30px;
        }
        .username {
            margin-right: 80px;
            img {
                margin-right: 12px
            }
        }
        .iconfont {
            margin-right: 12px
        }
    }

    .el-container, .el-aside {
        height: 100%;
        overflow: hidden
    }

    .el-aside {
        margin-top: 40px
    }

    .el-main {
        display: -webkit-box;
        display: -moz-box;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        position: relative;
        margin-top: 20px;
        padding: 0;
        overflow: hidden;
        &:after {
            content: "";
            display: block;
            position: absolute;
            top:20px;
            left: 0;
            width: 1px;
            height: 100%;
            background: #E4E7ED;
        }
    }

    .el-footer {
        height: 40px !important;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        border-top: solid 1px #5f5f5f;
    }

    .router {
        position: relative;
        z-index: 100;
        -webkit-box-flex: 1;
        padding: 20px 30px;
        overflow-y: auto
    }
</style>
