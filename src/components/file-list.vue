<template>
    <section>
        <el-upload
                class="upload-demo"
                :action="baseUrl+'/projectfile/fileUpload'"
                :data="imgType"
                multiple
                :limit="3"
                :show-file-list="false"
                :headers="headers"
                :on-success="success"
                v-if="canUpload"
        >
            <el-button size="small" type="primary"><i class="iconfont iconshangchuan h5"></i><span class="prl1 h5">点击上传</span></el-button>
            <span slot="tip" class="el-upload__tip h5 text-secondgrey prl1">仅支持pdf、word、excel、jpg、png、zip等格式文件。CAD图纸请先生成PDF文件再上传</span>
        </el-upload>
        <el-table border :data="fileList" style="width: 100%" class="mt1">
            <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
            <el-table-column prop="fileName" label="文件名" align="center"></el-table-column>
            <el-table-column prop="uploadTime" label="上传时间" align="center">
                <template slot-scope="scope">
                    {{timestampToTime(scope.row.uploadTime,'D')}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <a :href="scope.row.filePath" class="text-primary">下载</a>
                    <el-button type="text" class="text-danger" style="margin-left:10px" @click="del_file(scope.row.fileId)" v-if="canDel">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </section>
</template>

<script>
	import {getStore} from '@/utils/store';
	import {baseUrl} from '@/common/evn'

	export default {
		props: ['projectId', 'canUpload', 'canDel'],
		data() {
			return {
				baseUrl: baseUrl,
				headers: {token: getStore({name: 'be'}) ? getStore({name: 'be'}).sessionId : ''},
				imgType: {projectId: this.projectId},
				fileList: []
			}
		},
		mounted() {
			this.get_file_list();
		},
		methods: {
			get_file_list() {
				this.$store.dispatch('project/QUERY_PROJECT_File', {projectId: this.projectId}).then(res => {
					if (res.result === 'success') {
						this.fileList = res.data;
					} else {
						this.$message.warning(res.msg)
					}
				})
			},
			del_file(fileId) {
				this.$store.dispatch('project/DEL_PROJECT_File', {fileId: fileId}).then(res => {
					if (res.result === 'success') {
						this.get_file_list();
					} else {
						this.$message.warning(res.msg)
					}
				})
			},
			success() {
				this.get_file_list();
			}
		}
	}
</script>

<style scoped>

</style>
