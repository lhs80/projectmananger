<template>
    <section>
        <aside>
            <el-row class="h4 text-secondgrey">
                <el-col :span="6">
                    <label>需求编号：</label>
                    <el-input placeholder="请输入内容" v-model="search.demandCode"></el-input>
                </el-col>
                <el-col :span="6">
                    <label>需求名称：</label>
                    <el-input placeholder="请输入内容" v-model="search.projectName"></el-input>
                </el-col>
                <el-col :span="6">
                    <label>所属甲方：</label>
                    <el-select v-model="search.deptId" placeholder="请选择" value="">
                        <el-option
                                v-for="(item,index) in partyAList"
                                :key="index"
                                :label="item.deptName"
                                :value="item.deptName">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <label>需求状态：</label>
                    <el-select placeholder="请选择" value="-1" v-model="search.status">
                        <el-option value="1" label="待确认">待确认</el-option>
                        <el-option value="2" label="已确认">已确认</el-option>
                        <el-option value="0" label="已取消">已取消</el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="h4 text-secondgrey mt2">
                <el-col :span="6">
                    <label>项目编号：</label>
                    <el-input placeholder="请输入内容" v-model="search.projectCode"></el-input>
                </el-col>
            </el-row>
        </aside>
        <aside class="text-center mt2 todo-button">
            <el-button type="primary" icon="el-icon-search" @click="get_list">搜索</el-button>
            <el-button type="info" icon="el-icon-delete" @click="clear">清空</el-button>
        </aside>
        <aside class="mt4">
            <el-table border :data="list" style="width: 100%">
                <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
                <el-table-column prop="demandCode" label="需求编号" width="180" align="center"></el-table-column>
                <el-table-column prop="projectName" label="需求名称" align="center"></el-table-column>
                <el-table-column prop="projectCode" label="项目编号" width="180" align="center">
                    <template slot-scope="scope">
                        <router-link tag="a" to="">{{scope.row.projectCode||'--'}}</router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="deptName" label="所属甲方" align="center"></el-table-column>
                <el-table-column prop="status" label="需求状态" align="center">
                    <template slot-scope="scope">
                        <span v-html="projectStatus(scope.row.status)"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="添加时间" align="center">
                    <template slot-scope="scope">
                        {{timestampToTime(scope.row.createTime,"D")}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="80" align="center">
                    <template slot-scope="scope">
                        {{scope.demandId}}
                        <router-link tag="a" :to="'/admin/require/detail/'+scope.row.demandId" class="text-primary">详情
                        </router-link>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    :page-sizes="paginations.pageSizes"
                    :page-size="paginations.page_size"
                    :layout="paginations.layout"
                    :total="paginations.total"
                    :current-page="paginations.page_index"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    class="mt4 pull-right"
            ></el-pagination>
        </aside>
    </section>
</template>

<script>
  export default {
    data() {
      return {
        list: [],
        partyAList: [],
        search: {
          projectName: "",
          demandCode: '',
          projectCode: '',
          status: '',
          deptId: ''
        },
        paginations: {
          page_index: 1, // 当前位于哪页
          total: 0, // 总条数`
          page_count: 0,//总页数
          page_size: 10, // 1页显示多少条
          pageSizes: [10, 25, 50], //每页显示多少条
          layout: 'total, sizes, prev, pager, next, jumper' // 翻页属性
        }
      }
    },
    mounted() {
      this.get_list();
      this.get_parta_list();
    },
    methods: {
      get_list() {
        let params = {
          ...this.search,
          pageSize: this.paginations.page_size,
          start: this.paginations.page_index - 1,
        };
        this.$store.dispatch('requirement/QUERY_ADMIN_LIST', params).then(res => {
          if (res.result === "error") {
            this.$message.warning(res.msg)
          } else {
            this.paginations.total = res.data.count;
            this.list = res.data.data;
          }
        })
      },
      get_parta_list() {
        this.$store.dispatch('employee/QUERY_PARTYA_LIST').then(res => {
          if (res.result === "error") {
            this.$message.warning(res.msg)
          } else {

            this.partyAList = res.data;
          }
        })
      },
      clear() {
        this.search = {
          projectName: "",
          demandCode: '',
          projectCode: '',
          status: '',
        };
        this.get_list();
      },
      // 每页多少条切换
      handleSizeChange(page_size) {
        this.paginations.page_size = page_size;
        this.get_list()
      },
      // 上下分页
      handleCurrentChange(page) {
        this.paginations.page_index = page;
        this.get_list();
      }
    }
  }
</script>

<style scoped>

</style>
