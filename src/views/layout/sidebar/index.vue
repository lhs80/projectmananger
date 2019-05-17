<!--左侧列表内容   -->
<template>
    <div class="sidebar-container bg-white">
        <el-menu unique-opened :default-active="nowTagValue" class="el-menu-vertical-demo" mode="vertical"
                 :show-timeout="200">
            <sidebar-item :menu="GetMenu"></sidebar-item>
        </el-menu>
        <div class="calendars">
            <h3 class="month text-grey">{{numberConvertToUppercase(now.getMonth()+1)}}月</h3>
            <h1 class="date">{{now.getDate()}}</h1>
            <h5 class="year">{{now.getFullYear()}}</h5>
        </div>
    </div>
</template>

<script>
  import {setUrlPath} from "@/utils/util";
  import {mapGetters} from "vuex";
  import SidebarItem from "./sidebarItem";

  export default {
    name: "sidebar",
    components: {SidebarItem},
    data() {
      return {
        now: new Date()
      }
    },
    computed: {
      ...mapGetters("user", ["GetMenu"]),
      nowTagValue: function () {
        return setUrlPath(this.$route);
      }
    },
    methods: {
      numberConvertToUppercase(num) {
        const upperNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '亿']
        const length = String(num).length;
        if (length === 1) {
          return upperNumbers[num]
        } else if (length === 2) {
          if (num === 10) {
            return upperNumbers[num]
          } else if (num > 10 && num < 20) {
            const index = String(num);
            return '十' + upperNumbers[index.charAt(1)]
          } else {
            const index = String(num);
            return upperNumbers[index.charAt(0)] + '十' + upperNumbers[index.charAt(1)].replace('零', '')
          }
        } else {
          // TODO: 超出99暂不考虑
          return ''
        }
      }
    }
  };
</script>
<style lang="less" scoped>
    .el-menu {
        border-right: none
    }

    .calendars {
        width: 160px;
        height: 154px;
        margin: 92px auto 0 auto;
        text-align: center;
        background: url("../../../assets/img/bg-calendar.png");
        .date {
            height: 40px;
            color: #FFAE00;
            font-size: 54px;
            line-height: 1;
            margin: 18px 0 30px 0;
            font-weight: bold;
        }
        .month{
            margin-top:13px;
            font-weight: bold;
        }
        .year {
            height: 20px;
            line-height: 20px;
            color: white;
            background: #303133;
            -webkit-border-radius: 100px;
            -moz-border-radius: 100px;
            border-radius: 100px;
            margin: 0 10px;
        }
    }
</style>
