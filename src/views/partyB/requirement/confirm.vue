<template>
    <section>
        <el-form :model="requireInfo" :rules="rules" ref="requireInfo" label-width="150px" class="mt4 form-wrapper">
            <el-form-item label="项目名称" prop="projectName">
                <el-input v-model="requireInfo.projectName" placeholder="请输入需求名称"></el-input>
            </el-form-item>
            <el-form-item label="建筑面积" prop="buildArea">
                <el-input v-model="requireInfo.buildArea" placeholder="请输入建筑面积">
                    <i slot="suffix">m<sup>2</sup></i>
                </el-input>
            </el-form-item>
            <el-form-item label="项目地址" prop="area">
                <el-select v-model="requireInfo.province" placeholder="请选择" @change="provinceChange" value="">
                    <el-option
                            v-for="(item,index) in province"
                            :key="index"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
                <el-select v-model="requireInfo.city" placeholder="请选择" @change="cityChange" value="">
                    <el-option
                            v-for="(item,index) in city"
                            :key="index"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
                <el-select v-model="requireInfo.area" placeholder="请选择" value="">
                    <el-option
                            v-for="item in county"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
                <el-input type="text" v-model="requireInfo.address" placeholder="请输入详细地址"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="期望交付日期">
                <span class="h3">{{timestampToTime(requireInfo.expectedDate,'D')}}</span>
            </el-form-item>
            <el-form-item label="甲方联系人" prop="contactName">
                <el-input type="text" v-model="requireInfo.contactName" placeholder="请输入甲方联系人"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="甲方联系电话" prop="contactPhone">
                <el-input type="text" v-model="requireInfo.contactPhone" placeholder="请输入甲方联系电话"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="加盟方联系人" prop="joinName">
                <el-input type="text" v-model="requireInfo.joinName" placeholder="请输入加盟方联系人"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="加盟方联系电话" prop="joinPhone">
                <el-input type="text" v-model="requireInfo.joinPhone" placeholder="请输入加盟方联系电话"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="项目经理" prop="principal">
                <el-select v-model="requireInfo.principal" placeholder="请选择" value="">
                    <el-option
                            v-for="item in managers"
                            :key="item.userId"
                            :label="item.showName"
                            :value="item.userId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="预计开工时间" prop="startTime">
                <el-date-picker v-model="requireInfo.startTime" type="date" placeholder="请输入预计开工时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
            <el-form-item label="预计完工时间" prop="endTime">
                <el-date-picker v-model="requireInfo.endTime" type="date" placeholder="请输入预计完工时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                <span class="prl1 h3">工期：{{getDiffDate}}天</span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="add('requireInfo')">提交</el-button>
                <el-button type="default" @click="$router.push('/admin/require/list')" plain>取消</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
	import ChinaAddress from '@/common/china_address_v4.json'
	import {phoneNo, special, unzeronumber} from '@/common/regex';
	import {setStore} from '@/utils/store'
	import moment from 'moment'

	export default {
		data() {
			return {
				demandId: this.$route.params.id,
				province: Object.keys(ChinaAddress),
				city: [],
				county: [],
				managers: [],
				requireInfo: {
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
				const {startTime, endTime} = this.requireInfo;
				if (moment(endTime).valueOf() <= moment(startTime).valueOf()) {
					return 0
				} else {
					return moment(endTime).diff(moment(startTime), 'd') + 1
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
				this.$store.dispatch('requirement/REQUIRE_DETAIL', {demandId: this.demandId}).then(res => {
					if (res.result === 'success') {
						this.requireInfo = res.data;
					}
				})
			},
			add(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						this.$store.dispatch('requirement/CONFIRM_REQUIRE', this.requireInfo).then(res => {
							if (res.result === 'success') {
								// this.$confirm('需求确认成功！是否立即前往配置项目', '系统提示', {
								// 	confirmButtonText: '晚点再说',
								// 	cancelButtonText: '去配置',
								// 	cancelButtonClass: 'el-button--primary',
								// 	confirmButtonClass: 'el-button--default',
								// 	type: 'success'
								// }).then(() => {
								// 	this.$router.push('/admin/require/list')
								// }).catch(() => {
								setStore({name: 'start', content: this.requireInfo.startTime, type: 'session'})
								setStore({name: 'end', content: this.requireInfo.endTime, type: 'session'})
								this.$router.push(`/admin/project/setting/${res.data}`)
								// });
							} else {
								this.$message.warning(res.msg)
							}
						})
					}
				})
			},
			provinceChange(value) {
				this.city = Object.keys(ChinaAddress[value]);
			},
			cityChange() {
				this.county = ChinaAddress[this.requireInfo.province][this.requireInfo.city];
			},
			checkDate(rule, value, callback) {
				const {startTime, endTime, expectedDate} = this.requireInfo;
				if (moment(endTime).valueOf() <= moment(startTime).valueOf()) {
					callback(new Error('预计完工时间不能早于或等于开工时间!'));
				} else if (expectedDate < moment(endTime).valueOf()) {
					callback(new Error('预计完工时间不晚于能期望交付日期!'));
				} else {
					callback();
				}
			},
			checkStartDate(rule, value, callback) {
				const {startTime} = this.requireInfo;
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
