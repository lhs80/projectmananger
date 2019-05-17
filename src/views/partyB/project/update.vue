<template>
    <section>
        <el-form :model="projectInfo" :rules="rules" ref="projectInfo" label-width="150px">
            <el-form-item label="项目名称" prop="projectName">
                <el-input v-model="projectInfo.projectName" placeholder="请输入需求名称"></el-input>
            </el-form-item>
            <el-form-item label="建筑面积" prop="buildArea">
                <el-input v-model="projectInfo.buildArea" placeholder="请输入建筑面积">
                    <i slot="suffix">m<sup>2</sup></i>
                </el-input>
            </el-form-item>
            <el-form-item label="项目地址" prop="area">
                <el-select v-model="projectInfo.province" placeholder="请选择" @change="provinceChange" value="">
                    <el-option
                            v-for="(item,index) in province"
                            :key="index"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
                <el-select v-model="projectInfo.city" placeholder="请选择" @change="cityChange" value="">
                    <el-option
                            v-for="(item,index) in city"
                            :key="index"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
                <el-select v-model="projectInfo.area" placeholder="请选择" value="">
                    <el-option
                            v-for="item in county"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
                <el-input type="text" v-model="projectInfo.address" placeholder="请输入详细地址"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="期望交付日期">
                <span class="h3">{{timestampToTime(projectInfo.expectedDate,'D')}}</span>
            </el-form-item>
            <el-form-item label="甲方联系人" prop="contactName">
                <el-input type="text" v-model="projectInfo.contactName" placeholder="请输入甲方联系人"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="甲方联系电话" prop="contactPhone">
                <el-input type="text" v-model="projectInfo.contactPhone" placeholder="请输入甲方联系电话"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="加盟方联系人" prop="joinName">
                <el-input type="text" v-model="projectInfo.joinName" placeholder="请输入加盟方联系人"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="加盟方联系电话" prop="joinPhone">
                <el-input type="text" v-model="projectInfo.joinPhone" placeholder="请输入加盟方联系电话"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="项目经理" prop="principal">
                <el-select v-model="projectInfo.principal" placeholder="请选择" value="">
                    <el-option
                            v-for="item in managers"
                            :key="item.userId"
                            :label="item.showName"
                            :value="item.userId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="预计开工时间" prop="startTime">
                <el-date-picker v-model="projectInfo.startTime" type="date" placeholder="请输入预计开工时间" value-format="yyyy-MM-dd HH:mm:ss"
                                :disabled="projectInfo.updateFlag?false:true"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="预计完工时间" prop="endTime">
                <el-date-picker v-model="projectInfo.endTime" type="date" placeholder="请输入预计完工时间" value-format="yyyy-MM-dd HH:mm:ss"
                                :disabled="projectInfo.updateFlag?false:true"
                ></el-date-picker>
                <span class="prl1 h3">工期：{{getDiffDate}}天</span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="todoUpdate('projectInfo')">提交</el-button>
                <el-button type="default" @click="$router.push(`/admin/project/detail/${projectId}`)" plain>取消</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
	import ChinaAddress from '@/common/china_address_v4.json'
	import {phoneNo, special, unzeronumber} from '@/common/regex';
	import moment from 'moment'

	export default {
		data() {
			return {
				projectId: this.$route.params.id,
				province: Object.keys(ChinaAddress),
				city: [],
				county: [],
				managers: [],
				projectInfo: {
					demandCode: '',
					projectName: '',
					buildArea: '',
					province: '',
					city: '',
					area: '',
					expectedDate: '',
					contactName: '',
					contactPhone: '',
					joinName: '',
					joinPhone: '',
					startTime: '',
					endTime: '',
					principal: '',
					userId: '',
				},
				rules: {
					projectName: [
						{required: true, message: '请输入项目名称', trigger: 'blur'},
						{pattern: special, message: '请输入正确的项目名称', trigger: 'blur'}
					],
					buildArea: [
						{required: true, message: '请输入建筑面积', trigger: 'blur'},
						{pattern: unzeronumber, message: '请输入正确的建筑面积', trigger: 'blur'}
					],
					area: [
						{required: true, message: '请输入项目地址', trigger: 'blur'},
					],
					address: [
						{required: true, message: '请输入详细地址', trigger: 'blur'}
					],
					contactName: [
						{required: true, message: '请输入甲方联系人', trigger: 'change'},
						{pattern: special, message: '请输入正确的甲方联系人', trigger: 'blur'}
					],
					contactPhone: [
						{required: true, message: '请输入甲方联系电话', trigger: 'change'},
						{pattern: phoneNo, message: '格式：6-20 位，字母+数字+特殊字符', trigger: 'blur'}
					],
					joinName: [
						{pattern: special, message: '请输入正确的加盟方联系人', trigger: 'blur'},
					],
					joinPhone: [
						{pattern: phoneNo, message: '格式：6-20 位，字母+数字+特殊字符', trigger: 'blur'}
					],
					startTime: [
						{required: true, message: '请输入预计开工时间', trigger: 'blur'},
						{validator: this.checkStartDate, trigger: 'blur'}
					],
					endTime: [
						{required: true, message: '请输入预计完工时间', trigger: 'blur'},
						{validator: this.checkDate, trigger: 'blur'}
					],
					principal: [
						{required: true, message: '请选择项目经理', trigger: 'blur'},
					]
				}
			}
		},
		computed: {
			getDiffDate() {
				const {startTime, endTime} = this.projectInfo;
				if (moment(endTime).valueOf() <= moment(startTime).valueOf()) {
					return 0
				} else {
					return moment(this.projectInfo.endTime).diff(moment(this.projectInfo.startTime), 'd') + 1
				}
			}
		},
		mounted() {
			this.get_detail();
			this.get_works();
		},
		methods: {
			get_works() {
				this.$store.dispatch('employee/QUERY_WORK_LIST', {role: 3}).then(res => {
					if (res.result === 'success') {
						this.managers = res.data;
					} else {
						this.$message.warning(res.msg)
					}
				})
			},
			get_detail() {
				this.$store.dispatch('project/QUERY_PROJECT_DETAIL', {projectId: this.projectId}).then(res => {
					if (res.result === 'success') {
						this.projectInfo = res.data;
					} else {
						this.$message.warning(res.msg)
					}
				})
			},
			todoUpdate(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						const {nodePlanEndTime, endTime} = this.projectInfo;
						console.log((moment(endTime).valueOf() < nodePlanEndTime));
						if (nodePlanEndTime && (moment(endTime).valueOf() < nodePlanEndTime)) {
							this.$confirm('本次修改会影响部分节点的施工时间，是否确定保存？', '系统提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'success'
							}).then(() => {
								this.update();
							}).catch(() => {
								// this.$router.push('/require/list')
							});
						} else {
							this.update()
						}
					}
				})
			},
			update() {
				this.$store.dispatch('project/UPDATE_PROJECT_INFO', this.projectInfo).then(res => {
					if (res.result === 'success') {
						this.$message.success('修改成功！');
						this.$router.push(`/admin/project/detail/${this.projectId}`)
					} else {
						this.$message.warning(res.msg)
					}
				})
			},
			provinceChange(value) {
				this.city = Object.keys(ChinaAddress[value]);
			},
			cityChange() {
				this.county = ChinaAddress[this.projectInfo.province][this.projectInfo.city];
			},
			checkDate(rule, value, callback) {
				const {startTime, endTime, expectedDate} = this.projectInfo;
				if (moment(endTime).valueOf() <= moment(startTime).valueOf()) {
					callback(new Error('预计完工时间不能早于或等于开工时间!'));
				} else if (expectedDate < moment(endTime).valueOf()) {
					callback(new Error('预计完工时间不晚于能期望交付日期!'));
				} else {
					callback();
				}
			},
			checkStartDate(rule, value, callback) {
				const {startTime} = this.projectInfo;
				if (!this.projectInfo.updateFlag) callback();
				if (moment(startTime).valueOf() <= moment().valueOf()) {
					callback(new Error('不得早于当前日期!'));
				} else {
					callback();
				}
			},
		}
	}
</script>

<style scoped>

</style>
