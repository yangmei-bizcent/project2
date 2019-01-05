<template>
  <div class="numberSourceSetting">
    <div class="helpContain">
      <div class="helpUpload">
        <div class="helpUploadTitle">
          今日排班
        </div>
        <div class="helpEdit">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="科室搜索">
              <el-input :maxlength="20" placeholder="请输入科室名称" v-model="infoSearch" class="input-with-select" @change="selectInfo()">
                <i class="el-icon-search el-input__icon" slot="suffix">
                </i>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <el-table ref="multipleTable" :data="comsList" tooltip-effect="dark" style="width: 100%" border
          :header-cell-class-name="handlemyclass">
          <el-table-column prop="officeName" header-cell-style="padding:0;" :render-header="renderTableSlashHeader"
            show-overflow-tooltip width="150">
          </el-table-column>
          <el-table-column prop="amSchedule" label="上午">
            <template slot-scope="scope">
              <section>
                <span v-for="n in scope.row.amSchedule" v-if="scope.row.amSchedule">{{n.doctorName}}</span>
                <span v-if="!scope.row.amSchedule" style="color:#999;">暂无排班</span>
              </section>
            </template>
          </el-table-column>
          <el-table-column prop="pmSchedule" label="下午">
            <template slot-scope="scope">
              <section>
                <span v-for="n in scope.row.pmSchedule" v-if="scope.row.pmSchedule">{{n.doctorName}}</span>
                <span v-if="!scope.row.pmSchedule" style="color:#999;">暂无排班</span>
              </section>
            </template>
          </el-table-column>
          <el-table-column prop="emSchedule" label="晚上">
            <template slot-scope="scope">
              <section>
                <span v-for="n in scope.row.emSchedule" v-if="scope.row.emSchedule">{{n.doctorName}}</span>
                <span v-if="!scope.row.emSchedule" style="color:#999;">暂无排班</span>
              </section>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize" :current-page.sync="currentPage" layout="total, sizes, prev, pager, next, jumper"
          :total="listNum?listNum:0">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    axiosget,
    axiospost,
    aixospatch
  } from "../../service/config.js"
  import {
    mapGetters,
    mapState,
    mapActions
  } from 'vuex'
  export default {
    data() {
      return {
        comsList: [],
        listNum: 0,
        currentPage: 1,
        infoSearch: '',
        pageSize: 5,
      };
    },
    async created() {
      //   this.hospitalBranchId = this.$route.query.branchId ? this.$route.query.branchId : this.hospitalBranchId;
      axiosget(
        `/schedule/auth/today/${this.$route.query.branchId ? this.$route.query.branchId : this.hospitalBranchId}`).then(
        res => {
          this.comsList = res.data.list;
          this.listNum = res.data.total;
        })
    },
    watch: {
      //输入框信息筛选
      infoSearch(val) {
        this.selectInfo();
      },
    },
    computed: {
      ...mapState({}),
      ...mapGetters({
        hospitalBranchId: 'hospitalBranchId',
      }),
    },
    mounted() {
      this.$nextTick(() => {
        let canvas = document.querySelector('.slash');
        let width = canvas.width = 150,
          height = canvas.height = 50;
        let ctx = canvas.getContext('2d');
        ctx.strokeStyle = "#E6E6E6";
        ctx.moveTo(0, 0);
        ctx.lineTo(width, height);
        ctx.stroke();
        ctx.font = "bold 14px MicrosoftYaHei-Bold";
        ctx.fillText("时间", width / 3 * 1.8, height / 3);
        ctx.fillText("门诊", width / 9, height / 5 * 4);
      });
    },
    methods: {
      ...mapActions(['set_hospitalBranchId']),
      handlemyclass: function (row, column, rowIndex, columnIndex) {
        return 'test'
      },
      //斜线表头渲染函数
      renderTableSlashHeader(h, row) {
        //console.log(row)
        return h('canvas', {
          class: 'slash'
        });
      },
      //科室筛选
      selectInfo() {
        if (this.infoSearch && !/^[a-zA-Z\u4e00-\u9fa5]+$/.test(this.infoSearch)) {
          this.$message.warning("请检查搜索关键字格式，限中文或字母");
          return;
        }
        this.pageSize = 5;
        this.currentPage = 1;
        axiosget(
          `/schedule/auth/today/${this.hospitalBranchId}?searchStr=${this.infoSearch}&pageNo=1&pageSize=${this.pageSize}`
        ).then(
          res => {
            this.comsList = res.data.list;
            this.listNum = res.data.total;
          })
      },
      //每页显示${val} 条
      handleSizeChange(val) {
        this.pageSize = val;
        this.currentPage = 1;
        axiosget(
          `/schedule/auth/today/${this.hospitalBranchId}?searchStr=${this.infoSearch}&pageNo=1&pageSize=${val}`
        ).then(
          res => {
            this.comsList = res.data.list;
            this.listNum = res.data.total;
          })
      },
      //当前页: ${val}
      handleCurrentChange(val) {
        axiosget(
          `/schedule/auth/today/${this.hospitalBranchId}?searchStr=${this.infoSearch}&pageNo=${val}&pageSize=${this.pageSize}`
        ).then(
          res => {
            this.comsList = res.data.list;
            this.listNum = res.data.total;
          })
      },
    }
  };

</script>

<style lang="scss" rel="stylesheet/stylus">
  @import "/numberSourceSetting.scss";

  .test:nth-child(1) {
    padding: 0;

    .cell {
      padding: 0 !important;
      line-height: 0;
    }
  }

  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #35b53f;
  }

  .el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: #35b53f;
  }

</style>
