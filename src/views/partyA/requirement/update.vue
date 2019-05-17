<template>
    <section>
        <el-form :model="requireInfo" :rules="rules" ref="requireInfo" label-width="150px" class="mt4 form-wrapper">
            <el-form-item label="需求名称" prop="projectName">
                <el-input v-model="requireInfo.projectName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="建筑面积" prop="buildArea">
                <el-input v-model="requireInfo.buildArea" placeholder="请输入">
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
                <el-input type="text" v-model="requireInfo.address" placeholder="请再次输入密码"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="期望交付日期" prop="expectedDate">
                <el-date-picker v-model="requireInfo.expectedDate" type="date" placeholder="期望交付日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
            <el-form-item label="备注">
                <el-input type="textarea"
                          v-model="requireInfo.remark"
                          placeholder="请输入备注"
                          autocomplete="off"
                          resize="none"
                          style="width:510px"
                          :autosize="{ minRows: 5, maxRows: 8}"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="update('requireInfo')">提交</el-button>
                <el-button type="default" @click="$router.push('/require/list')" plain>取消</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
	import ChinaAddress from '@/common/china_address_v4.json'
	import {phoneNo, special, unzeronumber} from '@/common/regex';

	export default {
		data() {
			return {
				demandId: this.$route.params.id,
				province: Object.keys(ChinaAddress),
				city: [],
				county: [],
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
					remark: '',
					status: ''
				},
				rules: {
					projectName: [
						{required: true, message: '请输入项目名称', trigger: 'blur'},
						{pattern: special, message: '项目名称包含特殊字符', trigger: 'blur'}
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
					expectedDate: [
						{required: true, message: '请输入期望交付日期', trigger: 'change'}
					],
					contactName: [
						{required: true, message: '请输入甲方联系人', trigger: 'change'},
						{pattern: special, message: '甲方联系人包含特殊字符', trigger: 'blur'}
					],
					contactPhone: [
						{required: true, message: '请输入甲方联系电话', trigger: 'change'},
						{pattern: phoneNo, message: '格式：6-20 位，字母+数字+特殊字符', trigger: 'blur'}
					],
					joinName: [
						{pattern: special, message: '加盟方联系人包含特殊字符', trigger: 'blur'}
					],
					joinPhone: [
						{pattern: phoneNo, message: '格式：6-20 位，字母+数字+特殊字符', trigger: 'blur'}
					]
				}
			}
		},
		mounted() {
			this.get_detail();
		},
		methods: {
			get_detail() {
				this.$store.dispatch('requirement/REQUIRE_DETAIL', {demandId: this.demandId}).then(res => {
					if (res.result === 'success') {
						this.requireInfo = res.data;
					}
				})
			},
			update(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						this.$store.dispatch('requirement/UPDATE_CANCEL_REQUIRE', this.requireInfo).then(res => {
							if (res.result === 'success') {
								this.$confirm('需求提交成功！请等待对方确认', '系统提示', {
									confirmButtonText: '再来一条',
									cancelButtonText: '返回',
									type: 'success'
								}).then(() => {
									this.$refs[formName].resetFields()
								}).catch(() => {
									this.$router.push('/require/list')
								});
							}
						}).catch(error => {
							this.$store.commit('user/loginout');
							this.$router.push('/login')
						})
					} else {

					}
				})
			},
			provinceChange(value) {
				this.city = Object.keys(ChinaAddress[value]);
			},
			cityChange() {
				this.county = ChinaAddress[this.requireInfo.province][this.requireInfo.city];
			}
		}
	}
</script>

<style scoped>

</style>
