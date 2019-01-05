<template>
  <div class="feedback-list feedback">
    <div class="page-title"></div>
    <div class="bgcolor-white paddingX20 padding20X">
      <section class="container-title align-center">
        <div class="align-center">
          <span class="main-title">反馈列表</span><span class="vice-title">查看用户意见反馈内容</span>
        </div>

        <div>
          <el-button class="btn-4-letters" type="primary" @click="exportProblem">导出列表</el-button>
          <el-button class="btn-4-letters default-btn" type="default" @click="configure">相关配置</el-button>
        </div>
      </section>

      <section class="container-content">
        <!-- 搜索表单 -->
        <el-form class="filter-form" :inline="true" :model="searchForm">
          <el-form-item label="意见类型">
            <el-select
              v-model="searchForm.feedbackType"
              placeholder="全部"
              :clearable="true"
              @change="changeCondition">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="(item, index) of feedbackTypes"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select
              v-model="searchForm.status"
              placeholder="全部"
              :clearable="true"
              @change="changeCondition">
              <el-option label="全部" value=""></el-option>
              <el-option label="已查看" value="1"></el-option>
              <el-option label="未查看" value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="医院名称">
            <el-select
              v-model="searchForm.hospitalName"
              placeholder="全部"
              :clearable="true"
              @change="changeCondition">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="(item, index) of hospitalList"
                :key="index"
                :label="item.name"
                :value="item.hospitalBranchId">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="提交时间">
            <el-date-picker
              v-model="searchForm.submitDaterange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="changeCondition">
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-input v-model="searchForm.key" placeholder="请输入反馈描述/电话/邮箱">
              <i slot="suffix" class="el-input__icon el-icon-search search-icon" @click="search"></i>
            </el-input>
          </el-form-item>
        </el-form>

        <!-- 表格 -->
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column :show-overflow-tooltip="true" prop="problemType" label="意见类型"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="campusName" label="医院名称"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="problem" label="反馈内容"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="contactInformation" label="电话/邮箱"></el-table-column>
          <el-table-column prop="quizDate" label="用户提交时间"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <div class="align-center status-wrap">
                {{ scope.row.readStatus === '未读' ? '未查看' : '已查看' }}<span class="sign" :class="scope.row.readStatus === '未读' ? 'noChecked' : 'hasChecked'"></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="checkDetail(scope.row.id)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          class="page"
          background
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="->, prev, pager, next, jumper"
          :total="totalPage">
        </el-pagination>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { feedbackpost, feedbackget } from '@/service/feedback';
import { applicationget } from '@/service/application';
import { mapState } from 'vuex';
import { axiosConfig } from '@/service/config';
import { apiurl } from '@/service/api';

// const platformHospitalId = '37f7bdb2-6fcf-40dd-baf8-355868ba8702';

export default {
  data () {
    return {
      searchForm: {
        feedbackType: '',//意见类型
        status: '',//状态
        hospitalName: '',//医院名称
        submitDaterange: [],//提交时间
        key: ''
      },
      tableData: [],
      feedbackTypes: [],
      hospitalList: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      pageFlag: false//分页调用接口区分 false使用搜索接口 true使用筛选接口
    }
  },
  computed: {
    ...mapState({
      platformHospitalId: state => state.base.platformHospitalId,
      token: state=> state.base.token
    })
  },
  async created () {
    await Promise.all([this.getHospitalList(), this.getTableData(), this.getFeedbackTypes()]).catch(err => {
      console.error(err);
    });
  },
  methods: {
    //获取院区列表
    getHospitalList () {
      applicationget(`${ apiurl.getHospitalList }?platformHospitalId=${ this.platformHospitalId }`, axiosConfig).then(res => {
        this.hospitalList = res.data;
      }).catch(err => {
        console.error(err);
      });
    },
    //获取意见类型
    getFeedbackTypes () {
      feedbackget(`${ apiurl.getFeedbackConfigInfo }?platformHospitalId=${ this.platformHospitalId }`).then(res => {
        this.feedbackTypes = res.data.feedbackTypes;
      }).catch(err => {
        console.error(err);
      });
    },
    //获取表格数据
    getTableData () {
      this.pageFlag = false;
      this.searchForm.feedbackType = '';
      this.searchForm.status = '';
      this.searchForm.hospitalName = '';
      this.searchForm.submitDaterange = [];
      feedbackget(`${ apiurl.getFeedbackList }?platformHospitalId=${ this.platformHospitalId }&pageNo=${ this.currentPage }&pageSize=${ this.pageSize }&searchText=${ this.searchForm.key }`).then(res => {
        this.tableData = res.data.list;
        this.totalPage = res.data.total;
      }).catch(err => {
        console.error(err);
      });
    },
    //导出列表
    exportProblem () {
      let postObj = {
        campusId: this.searchForm.hospitalName,
        feedbackType: this.searchForm.feedbackType,
        readStatus: this.searchForm.status,
        submitBegin: this.searchForm.submitDaterange ? this.searchForm.submitDaterange[0] ||'' : '',
        submitEnd: this.searchForm.submitDaterange ? this.searchForm.submitDaterange[1] ||'' : ''
      };
      axios.post(`${ apiurl.exportFeedbackList }?platformHospitalId=${ this.platformHospitalId }`, postObj, Object.assign({ responseType: 'arraybuffer' }, axiosConfig)).then(res => {
        let blob = new Blob([res.data], {
          type: "application/vnd.ms-excel"
        });
        let a = document.createElement('a');
        let url = URL.createObjectURL(blob);
        // window.location.href = url;
        a.href = url;
        a.download = 'FeedbackList';
        a.click();
      }).catch(err => {
        //console.log(err);
      });
    },
    //筛选列表
    changeCondition () {
      let postObj = {
        campusId: this.searchForm.hospitalName,
        feedbackType: this.searchForm.feedbackType,
        readStatus: this.searchForm.status,
        submitBegin: this.searchForm.submitDaterange ? this.searchForm.submitDaterange[0] ||'' : '',
        submitEnd: this.searchForm.submitDaterange ? this.searchForm.submitDaterange[1] ||'' : ''
      };
      this.pageFlag = true;
      this.searchForm.key= '';
      feedbackpost(`${ apiurl.filterFeedbackList }?platformHospitalId=${ this.platformHospitalId }&pageNo=${ this.currentPage }&pageSize=${ this.pageSize }`, postObj).then(res => {
        this.tableData = res.data.list;
        this.totalPage = res.data.total;
      }).catch(err => {
        console.error(err);
      });
    },
    //相关配置
    configure () {
      this.$router.push({
        name: 'feedbackConfig',
        query: {
          platformHospitalId: this.platformHospitalId,
          token: this.token
        }
      });
    },
    //搜索
    search () {
      this.getTableData();
    },
    //查看详情
    checkDetail (id) {
      sessionStorage.setItem('feedbackId', id);
      this.$router.push({
        name: 'feedbackDetail',
        query: {
          platformHospitalId: this.platformHospitalId,
          token: this.token
        }
      });
    },
    handleCurrentChange (val) {
      this.currentPage = val;
      if (this.pageFlag) {
        this.changeCondition();
      } else {
        this.getTableData();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-form {
  margin: 16px 0 8px;
}
.status-wrap {
  justify-content: center;
}
.sign {
  display: inline-block;
  height: 6px;
  width: 6px;
  border-radius: 50%;
  margin-left: 10px;
}
.noChecked {
  background: #DB524B;
}
.hasChecked {
  background: #58B957;
}
.page {
  margin-top: 36px;
}
</style>

<style lang="scss">
@import '~@/assets/css/general';
.feedback-list {
  .el-table--border td, .el-table--border th{
    text-align: center;
  }
  .el-table--border th {
    font-size: 16px;
    color: #333;
    font-weight: 400;
  }
}
</style>
