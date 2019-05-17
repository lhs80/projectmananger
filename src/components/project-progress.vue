<template>
    <section class="text-center"
             :style="{width:maxWidth}"
             style="overflow:auto"
    >
        <el-table
                class="super-table"
                :data="projectNodes"
                border
                height="720px"
                id="nodes"
        >
            <!--节点名称-->
            <el-table-column
                    fixed
                    label="节点名称"
                    prop="name"
                    width="200"
            >
                <template slot-scope="scope">
                    <span class="h5 text-lightgrey">{{scope.row.name}}</span>
                    <el-tooltip class="item" effect="light" placement="right-start" v-if="scope.row.requirement">
                        <div slot="content" style="width:220px;letter-spacing: 2px;line-height:1.2">{{scope.row.requirement}}</div>
                        <img src="../assets/img/icon-tips.png" class="tips" alt="">
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="序号" width="50" align="center">
                <template slot-scope="scope">{{scope.$index+1}}</template>
            </el-table-column>
            <!--负责人-->
            <el-table-column
                    label="负责人"
                    width="80"
                    align="center"
            >
                <template slot-scope="scope">
                    <el-button v-if="!scope.row.principal" type="text" size="small" class="h3">
                        {{get_work_number(scope.row.principalName)}}
                    </el-button>
                    <el-tooltip v-else class="item" effect="light" placement="right-start">
                        <el-button type="text" size="small" class="h3">{{get_work_number(scope.row.principalName)}}
                        </el-button>
                        <div slot="content" v-if="scope.row.principal">
                            <table>
                                <tr v-for="(item,index) in get_work_member(scope.row.principalName)" :key="index" style="height:20px">
                                    <td>{{index+1}}</td>
                                    <td><span class="prl1">姓名：{{item[0]}}</span></td>
                                    <td>岗位：{{item[1]}}</td>
                                    <td><span class="prl1">电话：{{item[2]}}</span></td>
                                </tr>
                            </table>
                        </div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <!--异常-->
            <el-table-column
                    label="异常"
                    width="80"
                    align="center"
            >
                <template slot-scope="scope">
                    <img src="../assets/img/icon-warn.png" class="h3 mt1" alt="" v-if="scope.row.exception" width="24">
                </template>
            </el-table-column>
            <!--日期-->
            <el-table-column v-for="(item,index) in dateGroup" :key="index" align="center">
                <template slot="header">{{item.month}}</template>
                <el-table-column
                        width="66"
                        v-for="(date,index) in item.dates"
                        :key="index"
                        align="center"
                >
                    <template slot="header">
                        <span v-html="isToday(item.month,date)"></span>
                    </template>
                    <template slot-scope="scope">
                        <div
                                :class="{'active':isPlan(scope.row,item.month,date)}"
                                style="height:44px;width:100%"
                        >
                            <img src='../assets/img/icon-img.png' class="image" v-if="isHaveImage(scope.row,item.month,date)"
                                 @click.stop.prevent="checkImage(scope.row,item.month,date)" />
                            <img src="../assets/img/icon-gou.png" class="gou text-success h1" alt=""
                                 v-if="isActual(scope.row,item.month,date)">
                        </div>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
        <!--查看图片-->
        <el-dialog
                :title="`上传者：${this.uploader}`"
                :visible.sync="showImage"
                width="90%"
                center
                :modal-append-to-body="false"
                @close="closeCheckImage"
                top="5vh"
                class="cus-dialog"
        >
            <aside class="check-img-body text-center">
                <i class="el-icon-caret-left text-primary" @click="preImg"></i>
                <div class="img-content" :style="{backgroundImage:'url('+baseUrl+imgUrls[curImgIndex]+')'}"></div>
                <i class="el-icon-caret-right text-primary" @click="nextImg"></i>
            </aside>
        </el-dialog>
        <!--全景-->
        <el-dialog
                :visible.sync="showOverAllImage"
                width="90%"
                center
                :modal-append-to-body="false"
                @close="closeCheckImage"
        >
            <div v-if="overAllUrl" class="text-center">
                <img :src="overAllUrl" alt="" width="100%" class="mt2">
            </div>
            <div v-else class="text-center h3" style="min-height:500px">
                图片生成中...
            </div>
        </el-dialog>
    </section>
</template>

<script>
	import moment from 'moment'
	import {baseUrl} from '../common/evn';
	import domtoimage from 'dom-to-image'

	export default {
		props: ['projectNodes', 'start', 'end'],
		data() {
			return {
				maxWidth: '100%',
				curImgIndex: 0,
				uploader: '',
				overAllUrl: '',
				showImage: false,
				showOverAllImage: false,
				curNodeIndex: -1,
				imgUrls: '',
				baseUrl: baseUrl,
				dateGroup: [],//{month:'',dates:[]}
				workList: [],//节点负责人列表
			}
		},
		computed: {
			isToday() {
				return function (month, date) {
					let fullDate = month + '-' + date;
					return moment().diff(moment(fullDate), 'hours') < 24 && moment().diff(moment(fullDate), 'hours') > 0 ?
						'<b class="text-primary">今天</b>'
						:
						date;
				}
			},
			isPlan() {
				return function (node, month, date) {
					let fullDate = month + '-' + date;
					return moment(fullDate).valueOf() >= node.planStartTime && moment(fullDate) <= node.planEndTime;
				}
			},
			isActual() {
				return function (node, month, date) {
					if (!node.actualStartTime) return false;
					let fullDate = month + '-' + date;
					return moment(fullDate).valueOf() >= node.actualStartTime
						&& (moment(fullDate) <= node.actualEndTime || !node.actualEndTime)
						&& moment(fullDate).valueOf() <= moment().valueOf();
				}
			},
			isHaveImage() {
				return function (node, month, date) {
					let fullDate = month + '-' + date;
					return node.projectNodeItems.filter((item) => {
						return item.date === moment(fullDate).valueOf();
					}).length
				}
			}
		},
		mounted() {
			this.initDateGroup();
		},
		methods: {
			get_work_number(names) {
				if (names)
					return names.split(',').length;
				else
					return 0;
			},
			get_work_member(names) {
				if (!names) return false;
				let list = names.split(',');
				let newList = [];
				for (let i = 0; i < list.length; i++) {
					newList.push(list[i].split('|'));
				}
				return newList;
			},
			initDateGroup() {
				let startTime = moment(this.start);
				let endTime = moment(this.end);
				this.getMonthInDateGroup(startTime, endTime);
				this.getDateInDateGroup(startTime, endTime);
			},
			//计算出有几个月,放到dateGroup里
			getMonthInDateGroup(startTime, endTime) {
				const diffMonth = endTime.diff(startTime, 'month');
				for (let i = 0; i <= diffMonth; i++) {
					this.dateGroup.push({
						month: moment(startTime).add(i, 'month').format('YYYY-MM'),
						dates: []
					})
				}
			},
			//计算有多少天,放到dateGroup里
			getDateInDateGroup(startTime, endTime) {
				const diffDays = endTime.diff(startTime, 'days');
				for (let i = 0; i < this.dateGroup.length; i++) {
					for (let j = 0; j <= diffDays; j++) {
						const curDay = moment(startTime).add(j, 'd').format('YYYY-MM-DD');
						if (curDay.indexOf(this.dateGroup[i].month) >= 0) {
							const dates = this.dateGroup[i].dates;
							dates.push(moment(curDay).format('DD'));
							this.$set(this.dateGroup[i], 'dates', dates)
							// this.dateGroup[i].dates.push(moment(curDay).format('DD'))
						}
					}
				}
			},
			checkImage(node, month, date) {
				let fullDate = month + '-' + date;
				let index = node.projectNodeItems.findIndex((item) => {
					return item.date === moment(fullDate).valueOf();
				});

				this.imgUrls = node.projectNodeItems[index].imagePath.substring(0, node.projectNodeItems[index].imagePath.length - 1).split(',');
				this.uploader = node.projectNodeItems[index].uploader || '';
				this.showImage = true;

				const dialogEl = document.getElementsByClassName('el-dialog--center')[0];
				dialogEl.style.height = (document.documentElement.clientHeight - 100) + 'px';
			},
			preImg() {
				let newIndex = this.curImgIndex - 1;
				if (newIndex < 0)
					return false;
				else
					this.curImgIndex = newIndex;
			},
			nextImg() {
				let newIndex = this.curImgIndex + 1;
				if (newIndex > this.imgUrls.length - 1)
					return false;
				else
					this.curImgIndex = newIndex;
			},
			closeCheckImage() {
				this.curImgIndex = 0;
			},
			previewOverAll() {
				this.showOverAllImage = true;
				let node = document.getElementById('nodes');
				let table = document.getElementsByClassName('el-table__header')[0];
				this.maxWidth = parseInt(table.style.width.substring(0, table.style.width.length - 2)) + 10 + 'px';
				let self = this;
				setTimeout(() => {
					domtoimage.toPng(node)
						.then(function (dataUrl) {
							self.overAllUrl = dataUrl;
							self.maxWidth = '100%';
						})
						.catch(function (error) {

						});
				}, 0);

			}
		},
	}
</script>

<style lang="less" scoped>
    .select-manange {
        display: table;
        width: 100%;
        border-collapse: collapse;
        span {
            display: table-cell;
            padding: 6px 10px;
            border: solid 1px #EBEEF5
        }
    }

    .check-img-body {
        height: 100%;
        display: -webkit-box;
        -webkit-box-orient: horizontal;
        -webkit-box-align: center;
        -webkit-box-pack: center;
        i {
            font-size: 100px;
        }
        .img-content {
            -webkit-box-flex: 1;
            height: 100%;
            width: 100%;
            -webkit-background-size: contain;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center center;
        }
    }

    .el-icon-caret-left, .el-icon-caret-right {
        cursor: pointer;
        font-size: 40px;
    }
</style>
<style lang="less">
    .cus-dialog {
        .el-dialog__body {
            height: calc(100% - 122px);
        }
    }
</style>
