<template>
    <section>
        <aside>
            <el-table
                    class="super-table"
                    :data="projectInfo.nodes"
                    border
                    height="700px"
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
                        <el-button type="text" size="small" @click="todoManage(scope.$index)">{{get_work_number(scope.$index)}}</el-button>
                    </template>
                </el-table-column>
                <!--排序-->
                <el-table-column
                        label="排序"
                        width="90"
                        align="center"
                >
                    <template slot-scope="scope">
                        <el-button type="text" size="small"
                                   @click="todoSort(scope.$index,'up')"
                                   :disabled="scope.$index===0"
                                   class="h5">上移
                        </el-button>
                        <el-button type="text" size="small" @click="todoSort(scope.$index,'down')"
                                   :disabled="scope.$index===projectInfo.nodes.length-1" class="h5">
                            下移
                        </el-button>
                    </template>
                </el-table-column>
                <!--删除-->
                <el-table-column
                        label="删除"
                        width="80"
                        align="center"
                >
                    <template slot-scope="scope">
                        <el-button type="text"
                                   @click="todoDel(scope.$index)"
                                   class="h5"
                                   :class="projectInfo.updateFlag?'text-danger':''"
                                   :disabled="!projectInfo.updateFlag">删除
                        </el-button>
                    </template>
                </el-table-column>
                <!--修改-->
                <el-table-column
                        label="修改"
                        width="80"
                        align="center"
                >
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="todoUpdate(scope.$index)" class="h5"
                                   :disabled="!projectInfo.updateFlag">修改
                        </el-button>
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
                        <template slot="header">{{date}}</template>
                        <template slot-scope="scope">
                            <div
                                    @mousedown="(e)=>onMouseDown(e,scope.$index,scope.row.name,item.month,date)"
                                    @mouseenter="onMouseEnter(scope.$index,scope.row.name,item.month,date)"
                                    @mouseup="onMouseUp"
                                    @click="onCellClick(scope.$index,scope.row.name,item.month,date)"
                                    :class="{'active': beSettingActiveGrid.indexOf(scope.row.name+'-'+item.month+'-'+date)>=0}"
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
        </aside>
        <aside class="text-center mt2 todo-button">
            <el-button type="primary" @click="showAddNodeName=true">增加施工节点</el-button>
            <el-button type="primary" @click="save">保存设置</el-button>
            <el-button type="primary" @click="$router.push(`/admin/project/detail/${$route.params.id}`)">取消</el-button>
        </aside>
        <!--修改节点名称-->
        <el-dialog
                title="节点重命名"
                :visible.sync="showEditName"
                width="600px"
                :modal-append-to-body="false"
                @close="dialogClose"
        >
            <el-form :model="newNodeInfo" :rules="rules" ref="newNodeInfo" label-width="180px" class="form-wrapper">
                <el-form-item label="节点新名称" prop="name">
                    <el-input type="text" v-model.trim="newNodeInfo.name" placeholder="请输入节点新名称"
                              autocomplete="off" min="8" max="20" style="width:350px"></el-input>
                </el-form-item>
                <el-form-item label="本节点的施工要求">
                    <el-input type="textarea" :rows="8" v-model.trim="newNodeInfo.remark" placeholder="请输入本节点的施工要求"
                              autocomplete="off" min="8" max="100" style="width:350px" resize="none"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="updateNodeName('newNodeInfo')">确定</el-button>
            <el-button @click="showEditName = false">取消</el-button>
          </span>
        </el-dialog>
        <!--删除节点-->
        <el-dialog
                title="删除节点提示"
                :visible.sync="showDelNode"
                width="500px"
                :modal-append-to-body="false"
        >
            <p>删除操作不可撤销，是否确定删除？</p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="delNode()">确定</el-button>
                <el-button @click="showDelNode = false">取消</el-button>
              </span>
        </el-dialog>
        <!--添加负责人-->
        <el-dialog
                title="配置节点负责人"
                :visible.sync="showProjectManage"
                width="600px"
                :modal-append-to-body="false"
                @close="selectProjectManageClose"
        >
            <aside style="height:600px;overflow-y:auto">
                <h3>已添加</h3>
                <el-table border :data="addWorker" style="width: 100%" :show-header="false" class="mt2">
                    <el-table-column prop="showName" width="150" align="center"></el-table-column>
                    <el-table-column prop="job" width="150" align="center"></el-table-column>
                    <el-table-column prop="linkMobile" width="150" align="center"></el-table-column>
                    <el-table-column align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="delProjectManager(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="ptb2">
                    <el-input placeholder="请输入工人姓名、手机号查询" style="width:460px;" v-model="workKeyWord"></el-input>
                    <el-button type="primary" @click="get_work_list" style="height:40px;margin-left:10px">查询</el-button>
                </div>
                <el-table border :data="workList" style="width: 100%" :show-header="false">
                    <el-table-column prop="showName" width="150" align="center"></el-table-column>
                    <el-table-column prop="job" width="150" align="center"></el-table-column>
                    <el-table-column prop="linkMobile" width="150" align="center"></el-table-column>
                    <el-table-column align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="setProjectManager(scope.row)"
                                       :disabled="filterWorker(scope.row)">添加
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="bg-white ptb2">
                    <el-pagination
                            :page-sizes="paginations.pageSizes"
                            :page-size="paginations.page_size"
                            :layout="paginations.layout"
                            :total="paginations.total"
                            :current-page="paginations.page_index"
                            @current-change="handleCurrentChange"
                            class="pull-right"
                    ></el-pagination>
                </div>
            </aside>
        </el-dialog>
        <!--增加施工节点-->
        <el-dialog
                title="增加施工节点"
                :visible.sync="showAddNodeName"
                width="600px"
                :modal-append-to-body="false"
                @close="dialogClose"
        >
            <el-form :model="newNodeInfo" :rules="rules" ref="newNodeInfo" label-width="180px" class="form-wrapper">
                <el-form-item label="节点名称" prop="name">
                    <el-input type="text" v-model.trim="newNodeInfo.name" placeholder="请输入节点新名称"
                              autocomplete="off" min="8" max="20" style="width:350px"></el-input>
                </el-form-item>
                <el-form-item label="本节点的施工要求">
                    <el-input type="textarea" :rows="8" v-model.trim="newNodeInfo.remark" placeholder="请输入本节点的施工要求"
                              autocomplete="off" min="8" max="100" style="width:350px" resize="none" class="h4"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addNode('newNodeInfo')">确定</el-button>
            <el-button @click="showAddNodeName = false">取消</el-button>
          </span>
        </el-dialog>
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
            <div class="check-img-body text-center">
                <i class="el-icon-caret-left text-primary" @click="preImg"></i>
                <div class="img-content" :style="{backgroundImage:'url('+baseUrl+imgUrls[curImgIndex]+')'}"></div>
                <i class="el-icon-caret-right text-primary" @click="nextImg"></i>
            </div>
        </el-dialog>
    </section>
</template>

<script>
	import moment from 'moment'
	import {baseUrl} from '../common/evn';

	export default {
		props: ['projectInfo'],
		data() {
			return {
				maxIndex: 0,
				uploader: '',
				imgUrls: '',
				curNodeIndex: -1,
				curImgIndex: 0,
				workKeyWord: '',
				isMouseDown: false,//鼠标是否按下
				showEditName: false,//显示修改节点名称弹框
				showDelNode: false,//显示删除节点名称弹框
				showAddNodeName: false,//显示增加施工节点弹框
				showProjectManage: false,//显示项目负责人弹框
				showImage: false,//查看图片
				baseUrl: baseUrl,
				beginSelectNode: {},//鼠标第一次按下左键的节点日期
				beSettingActiveGrid: [],//记录当前选中的日期
				dateGroup: [],//{month:'',dates:[]}
				newNodeInfo: {//修改节点名称时数据模型
					name: '',
					remark: ''
				},
				workList: [],//节点负责人列表
				addWorker: [],//新添加的节点负责人
				rules: {
					name: [
						{required: true, message: '请输入节点新名称', trigger: 'blur'},
						{max: 20, message: '节点新名称最多20个字', trigger: 'blur'},
					]
				},
				paginations: {
					page_index: 1, // 当前位于哪页
					total: 0, // 总条数`
					page_count: 0,//总页数
					page_size: 10, // 1页显示多少条
					layout: 'total, prev, pager, next, jumper' // 翻页属性
				}
			}
		},
		computed: {
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
					if (!node.projectNodeItems) return false;
					return node.projectNodeItems.filter((item) => {
						return item.date === moment(fullDate).valueOf();
					}).length
				}
			},
			//已添加的工人不显示在备选表格里
			filterWorker() {
				return function (work) {
					return this.addWorker.indexOf(work) >= 0
				}
			}
		},
		mounted() {
			this.maxIndex = this.projectInfo.nodes.length - 1;
			this.initDateGroup();
			this.get_work_list();
		},
		methods: {
			get_work_number(index) {
				if (this.projectInfo.nodes[index].principal) {
					return (this.projectInfo.nodes[index].principal.split(',')).length - 1;
				}
				else
					return 0
			},
			get_work_member() {
				if (this.curNodeIndex === -1) return [''];
				if (!this.projectInfo.nodes.length && this.projectInfo.nodes[this.curNodeIndex].principal)
					return (this.projectInfo.nodes[this.curNodeIndex].principal.split(','));
				else
					return ['']
			},
			//工人列表
			get_work_list() {
				let params = {
					keyword: this.workKeyWord,
					start: this.paginations.page_index - 1,
					pageSize: this.paginations.page_size
				};
				// this.$store.dispatch('employee/QUERY_WORK_LIST', {role: 4}).then(res => {
				this.$store.dispatch('employee/QUERY_WORK_BY_NODES', params).then(res => {
					if (res.result === 'success') {
						this.workList = res.data.data;
						this.paginations.total = res.data.count;
					} else {
						this.$message.warning(res.msg)
					}
				})
			},
			//初始化时间
			initDateGroup() {
				const {startTime, endTime} = this.projectInfo;
				let start = moment(startTime);
				let end = moment(endTime);
				this.getMonthInDateGroup(start, end);
				this.getDateInDateGroup(start, end);
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
							this.dateGroup[i].dates.push(moment(curDay).format('DD'));
							this.isPlan(curDay)
						}
					}
				}
			},
			//判断渲染的日期是不是在计划范围内，如果在加到预选的变量里。
			isPlan(date) {
				this.projectInfo.nodes.forEach((node, index) => {
					if (moment(date).valueOf() >= node.planStartTime && moment(date) <= node.planEndTime) {
						// this.beSettingActiveGrid.push(node.name + date)
						this.insertNodes(index, node.name, moment(date).format('YYYY-MM'), moment(date).format('DD'))
					}
				})
			},
			//鼠标左键按下
			onMouseDown(event, index, nodeName, month, date) {
				if (event.button === 2) return false;
				if (index <= this.maxIndex && !this.projectInfo.updateFlag) return false;
				//通知鼠标已按下，设置当前起始的节点名称，清空这个节点之前选中的日期；
				this.isMouseDown = true;
				this.$emit('updateData');
				this.beginSelectNode = {
					nodeName: nodeName
				};
				this.clearSelectDay(index, nodeName, month, date);
				this.insertNodes(index, nodeName, month, date)
			},
			//鼠标移入
			onMouseEnter(index, nodeName, month, date) {
				if (!this.isMouseDown || this.beginSelectNode.nodeName !== nodeName) return;
				//判断鼠标是否落下，判断当前节点的名称是否和开始选中的节点名称相同，相同的话可以选择，不相同不能选择
				if (this.isDayNextToNext(nodeName, month, date))
					this.insertNodes(index, nodeName, month, date)
			},
			//鼠标左键抬起
			onMouseUp() {
				this.isMouseDown = false;
				this.beSettingActiveGrid = this.beSettingActiveGrid.sort((a, b) => a - b);
			},
			//单元格单击取消选中
			onCellClick(index, nodeName, month, date) {
				if (this.isMouseDown) return false;
				if (!this.projectInfo.updateFlag) return false;
				let itemIndex = this.beSettingActiveGrid.indexOf(nodeName + date);
				//被单击的日期格子只能是开始或结束的格式，中间的格子不允许点击
				if (itemIndex === 0 || itemIndex === this.beSettingActiveGrid.length - 1) {
					const timeIndex = this.projectInfo.nodes[index].times.findIndex((item) => {
						return item === month + '-' + date;
					});
					this.beSettingActiveGrid.splice(itemIndex, 1);
					this.projectInfo.nodes[index].times.splice(timeIndex, 1)
				}
			},
			//判断日期是否连接
			isDayNextToNext(nodeName, month, date) {
				let grid = this.beSettingActiveGrid;
				if (grid.length) {
					const lastChild = grid[grid.length - 1];
					const lastDay = lastChild.substring(lastChild.length - 10, lastChild.length);
					return moment(month + '-' + date).diff(lastDay, 'days') === 1
				}
			},
			//插入新日期
			insertNodes(index, nodeName, month, date) {
				let grid = this.beSettingActiveGrid;
				const fullDate = month + '-' + date;
				let result = grid.filter(item => {
					return item === nodeName + date;
				}).length > 0;

				if (!result) {
					grid.push(nodeName + '-' + month + '-' + date);
					if (this.projectInfo.nodes[index].times)
						this.projectInfo.nodes[index].times.push(fullDate);
					else
						this.projectInfo.nodes[index].times = [fullDate];
				}
			},
			//相同节点中的日期鼠标左键再次按下时，如果这个日期曾经被选中过，什么也不做
			//如果这个日期之前没有被选中过，清除之前选中的节点，开始新的日期范围选择
			clearSelectDay(index, nodeName, month, date) {
				let grid = this.beSettingActiveGrid;
				if (grid.indexOf(nodeName + date) >= 0) return false;
				if (grid.length) {
					for (let i = grid.length - 1; i >= 0; i--) {
						if (grid[i].indexOf(nodeName + '-') >= 0)
							grid.splice(i, 1)
					}
					this.projectInfo.nodes[index].times = []
				}
			},
			//准备修改节点名称
			todoUpdate(index) {
				this.$emit('updateData');
				this.curNodeIndex = index;
				this.newNodeInfo.name = this.projectInfo.nodes[this.curNodeIndex].name;
				this.newNodeInfo.remark = this.projectInfo.nodes[this.curNodeIndex].requirement;
				this.showEditName = true;
			},
			//修改节点名称
			updateNodeName(formName) {
				let nodeLength = this.projectInfo.nodes.filter(item => {
					return item.name === this.newNodeInfo.name && item.id !== this.curNodeIndex + 1;
				}).length;

				if (nodeLength > 0) {
					this.$message.warning('节点已存在！')
				} else {
					this.$refs[formName].validate(valid => {
						if (valid) {
							if (this.curNodeIndex < 0) return false;
							this.projectInfo.nodes[this.curNodeIndex].name = this.newNodeInfo.name;
							this.projectInfo.nodes[this.curNodeIndex].requirement = this.newNodeInfo.remark;
							this.showEditName = false;
							this.curNodeIndex = -1;
							this.newNodeInfo = {
								name: '',
								remark: ''
							}
						}
					});
				}
			},
			//准备删除节点
			todoDel(index) {
				this.$emit('updateData');
				this.showDelNode = true;
				this.curNodeIndex = index;
			},
			//删除节点
			delNode() {
				if (this.curNodeIndex < 0) return false;
				let nodeId = this.projectInfo.nodes[this.curNodeIndex].nodeId;
				if (nodeId) {
					this.$store.dispatch('nodes/DELETE_NODE', {nodeId: nodeId}).then(res => {
						if (res.result === 'success') {
							this.projectInfo.nodes.splice(this.curNodeIndex, 1);
							this.showDelNode = false;
							this.curNodeIndex = -1;
						} else {
							this.$message(res.msg)
						}
					});
				} else {
					this.projectInfo.nodes.splice(this.curNodeIndex, 1);
					this.showDelNode = false;
					this.curNodeIndex = -1;
				}
			},
			//准备排序
			todoSort(index, type) {
				this.$emit('updateData');
				let {nodes} = this.projectInfo;
				if (type === 'up') {
					if (index === 0) return false;
					this.sort(nodes, index, index - 1)
				} else if (type === 'down') {
					if (index === nodes.length - 1) return false;
					this.sort(nodes, index, index + 1)
				}
			},
			//排序
			sort(arr, index1, index2) {
				let tempOrderIndex = arr[index1].orderIndex;
				arr[index1].orderIndex = arr[index2].orderIndex;
				arr[index2].orderIndex = tempOrderIndex;
				arr[index1] = arr.splice(index2, 1, arr[index1])[0];
			},
			//准备管理节点负责人
			todoManage(index) {
				this.showProjectManage = true;
				this.curNodeIndex = index;
				this.showHadWork();
			},
			showHadWork() {
				let workId = this.projectInfo.nodes[this.curNodeIndex].principal;
				this.addWorker = this.workList.filter((item) => {
					return workId.indexOf(item.userId) >= 0
				});
			},
			//管理节点负责人
			setProjectManager(worker) {
				this.$emit('updateData');
				this.addWorker.push(worker);

				let {principal} = this.projectInfo.nodes[this.curNodeIndex];
				if (principal) {
					//更新DOM
					this.$forceUpdate();
					this.projectInfo.nodes[this.curNodeIndex].principal = (principal += worker.userId + ',');
				}
				else
					this.projectInfo.nodes[this.curNodeIndex].principal = worker.userId + ',';
			},
			//删除节点负责人
			delProjectManager(worker) {
				this.$emit('updateData');
				this.addWorker.splice(worker, 1);
				this.$forceUpdate();
				let value = this.projectInfo.nodes[this.curNodeIndex].principal;
				this.$set(this.projectInfo.nodes[this.curNodeIndex], 'principal', value.replace(worker.userId + ',', ''));
			},
			//新增施工节点
			addNode(formName) {
				let isHave = this.projectInfo.nodes.filter(item => item.name === this.newNodeInfo.name).length;
				if (isHave > 0) {
					this.$message.warning('节点已存在！')
				} else {
					this.$refs[formName].validate(valid => {
						if (valid) {
							this.projectInfo.nodes.push({
								name: this.newNodeInfo.name,
								requirement: this.newNodeInfo.remark,
								planStartTime: '',
								planEndTime: '',
								orderIndex: this.projectInfo.nodes[this.projectInfo.nodes.length - 1].orderIndex + 1
							});
							this.$emit('updateData');
							this.showAddNodeName = false;
							this.newNodeInfo = {
								name: '',
								remark: ''
							}
						}
					});
				}
			},
			//关闭设置项目负责人弹框时要做的事情
			selectProjectManageClose() {
				this.addWorker = [];
			},
			//保存施工节点
			save() {
				this.$confirm('节点配置一旦提交不可修改，确定提交么？', '系统提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					cancelButtonClass: 'el-button--primary',
					confirmButtonClass: 'el-button--default',
					type: 'success'
				}).then(() => {
					let params = {
						projectId: this.$route.params.id,
						nodes: this.projectInfo.nodes
					};
					this.$store.dispatch('nodes/SAVE_NODES', params).then(res => {
						this.$emit('updateOverData', res.data);
					})
				}).catch(() => {

				});
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
			// 上下分页
			handleCurrentChange(page) {
				this.paginations.page_index = page;
				this.get_work_list();
			},
			dialogClose() {
				this.newNodeInfo = {
					name: '',
					remark: ''
				}
			}
		}
	}
</script>

<style lang="less">
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
