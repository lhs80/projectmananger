<template>
    <section class="menu-wrapper">
        <div v-for="(item,index) in menu">
            <el-menu-item v-if="item.children.length===0 " :index="filterPath(item.path,index)" @click="open(item)"
                          :key="item.name">
                <i :class="item.icon"></i>
                <span slot="title">{{item.name}}</span>
            </el-menu-item>
            <el-submenu v-else :index="filterPath(item.name,index)" :key="item.id">
                <template slot="title">
                    <i :class="item.icon"></i>
                    <span slot="title" :class="{'el-menu--display':isCollapse}">{{item.name}}</span>
                </template>
                <template v-for="(child,cindex) in item.children">
                    <el-menu-item :index="filterPath(child.path,cindex)" @click="open(child)"
                                  v-if="child.children.length==0" :key="cindex">
                        <i :class="child.icon"></i>
                        <span slot="title">{{child.name}}</span>
                    </el-menu-item>
                    <sidebar-item v-else :menu="[child]" :key="cindex" :isCollapse="isCollapse"></sidebar-item>
                </template>
            </el-submenu>
        </div>
    </section>
</template>
<script>
	import {resolveUrlPath} from '@/utils/util';

	export default {
		name: 'SidebarItem',
		props: {
			menu: {
				type: Array
			},
			isCollapse: {
				type: Boolean
			}
		},
		methods: {
			filterPath(path, index) {
				return path == null ? index + '' : path;
			},
			open(item) {
				this.$router.push({
					path: resolveUrlPath(item.path, item.name),
					query: item.query
				});
			}
		}
	};
</script>
<style lang="less" scoped>
    .el-menu-item {
        height: 80px;
        line-height: 80px;
        color: #303133;
        font-size: 18px;
        padding-left: 32px !important;
        .iconfont {
            margin-right: 5px;
            width: 24px;
            text-align: center;
            font-size: 18px;
            vertical-align: -2px;
        }
        &.is-active {
            color: #409EFF;
            background: #e8f3ff;
            span {
                font-weight: bold;
            }
            &:after {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                right: 0;
                width: 5px;
                height: 100%;
                background: #1890ff
            }
        }
    }
</style>

