<template>
  <div class="suspend-manage number-source-setting">
    <div class="bgcolor-white paddingX20 padding20X">
      <section class="container-title align-center">
        <div class="align-center">
          <span class="main-title">停诊管理</span>
        </div>
      </section>

      <section>
        <div class="search-form-wrap">
          <el-form
            :inline="true"
            label-width="60px"
            :model="suspendForm">
            <el-form-item label="科室">
              <el-select v-model="suspendForm.officeId" placeholder="全部">
                <el-option value="" label="全部"></el-option>

                <el-option
                  v-for="(item, index) of departmentList"
                  :key="index"
                  :value="item.officeId"
                  :label="item.officeName">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-input v-model="suspendForm.key" placeholder="请输入医生姓名或者工号">
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search search-icon"
                  @click="searchDep"></i>
              </el-input>
            </el-form-item>
          </el-form>

          <el-button
            type="primary"
            class="last-item"
            @click="addClosedDoc">添加停诊医生
          </el-button>
        </div>

        <!-- 表格 -->
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="doctorNumber" label="工号"></el-table-column>
          <el-table-column prop="doctorName" label="姓名"></el-table-column>
          <el-table-column prop="officeName" label="所属科室"></el-table-column>
          <el-table-column prop="scheduleDate" label="停诊时间">
            <template slot-scope="scope">
              {{ `${ scope.row.scheduleDate }  ${ amPmTypeTimeMapping(scope.row.scheduleCategory) }` }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                class="scope-btn"
                type="text"
                @click="cancelSuspend(scope.row.scheduleId, scope.$index, tableData.length)">
                取消
              </el-button>
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

    <!-- 添加停诊医生 -->
    <el-dialog title="添加停诊医生" :visible.sync="dialogVisible" width="600px">
      <el-form
        class="add-suspend-form"
        label-width="100px">
        <el-form-item label="选择医生">
          <el-input v-model="doctorKey" placeholder="请输入医生工号或者姓名">
            <i
              slot="suffix"
              class="el-input__icon el-icon-search search-icon"
              @click="searchDoctor">
            </i>
          </el-input>
        </el-form-item>

        <el-form-item label="医生排班">
          <div class="checkbox-wrap" v-loading="loading">
            <el-scrollbar class="scrollbar">
              <p class="no-data-tip" v-show="scheduleRecord">暂无该医生排班记录</p>
              <el-checkbox-group
                v-model="selectedList"
                class="checkbox-group">
                <el-checkbox
                  v-for="(item, index) of scheduleList"
                  :key="index"
                  :label="item.scheduleId">
                  {{ `停诊 ${ item.doctorName } ${ item.scheduleDate } ${ amPmTypeTimeMapping(item.scheduleCategory) } ${ item.officeName }` }}
                </el-checkbox>
              </el-checkbox-group>
            </el-scrollbar>
          </div>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button
          type="primary"
          class="btn-2-letters" @click="confirmSuspend">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { scheduleget, schedulepost, scheduledel } from '@/service/schedule';

// const branchId = 'b51752c6-578c-412b-ae9e-90ad748c5748';

export default {
  data () {
    return {
      branchId: '',
      suspendForm: {
        officeId: '',
        key: ''
      },
      suspendKey: '',
      officeId: '',
      departmentList: [],
      dialogVisible: false,
      loading: true,
      doctorKey: '',
      scheduleList: [],
      selectedList: [],
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalPage: 0,
      scheduleRecord: false
    }
  },
  created () {
    this.branchId = this.$route.query.branchId;
    this.getSuspendList(this.currentPage);
    this.getfacultyList();
  },
  methods: {
    //获取停诊列表
    getSuspendList (currentPage) {
      scheduleget(`auth/suspend/${ this.branchId }/suspends?searchStr=${ this.suspendKey }&officeId=${ this.officeId }&pageNo=${ currentPage }&pageSize=${ this.pageSize }`).then(res => {
        if (res.hasOwnProperty('data')) {
          this.tableData = res.data.list;
          this.totalPage = res.data.total;
        }
      }).catch(err => {
        console.error(err);
      });
    },
    //获取科室列表 非树形结构
    getfacultyList () {
      scheduleget(`auth/office/${ this.branchId }/faculties/inline`).then(res => {
        if (res.hasOwnProperty('data')) {
          this.departmentList = res.data;
        }
      }).catch(err => {
        console.error(err);
      });
    },
    //查找医生
    getDoctorList () {
      return scheduleget(`auth/suspend/${ this.branchId }/doctors?searchStr=${ this.doctorKey }`);
    },
    //获取某医生排班信息
    getScheduleInfo (doctorId) {
      return scheduleget(`auth/suspend/${ this.branchId }/${ doctorId }/schedules`);
    },
    //点击确定添加停诊医生
    confirmSuspend () {
      if (this.selectedList.length === 0) {
        this.$message.warning('请选择排班信息');
        return;
      }
      schedulepost(`auth/suspend/add`, this.selectedList).then(res => {
        this.dialogVisible = false;
        if (typeof res.data === 'string') {
          this.getSuspendList(this.currentPage);
          this.$message.success('添加成功');
        }
      }).catch(err => {
        console.error(err);
      });
    },
    //取消停诊
    deleteSuspend (scheduleId, index, length) {
      scheduledel(`auth/suspend/${ scheduleId }/cancel`).then(res => {
        if (typeof res.data === 'string') {
          this.$message.success('取消成功');
          if (index === 0 && length === 1) {
            this.getSuspendList(this.currentPage === 1 ? 1 : this.currentPage - 1);
          } else {
            this.getSuspendList(this.currentPage);
          }
        }
      }).catch(err => {
        console.error(err);
      });
    },

    //点击搜索科室
    searchDep () {
      if (this.suspendForm.key.length > 0 && !/^[0-9a-zA-Z\u4e00-\u9fa5]+$/.test(this.suspendForm.key)) {
        this.$message.warning('请检查关键字的格式，不允许输入特殊字符');
        return;
      }
      this.suspendKey = this.suspendForm.key;
      this.officeId = this.suspendForm.officeId;
      this.getSuspendList(1);
    },
    //点击搜索医生
    async searchDoctor () {
      if (this.doctorKey.length > 0 && !/^[0-9a-zA-Z\u4e00-\u9fa5]+$/.test(this.doctorKey)) {
        this.$message.warning('请检查关键字的格式，不允许输入特殊字符');
        return;
      }
      this.scheduleList = [];
      this.scheduleRecord = false;
      this.loading = true;
      let temp = [];
      let doctorList = await this.getDoctorList();
      if (doctorList.hasOwnProperty('data')) {
        for (let item of doctorList.data) {
          let schedule = await this.getScheduleInfo(item.doctorId);
          if (schedule.hasOwnProperty('data')) {
            schedule.data.forEach(jItem => {
              temp.push(jItem);
            });
          }
        }
      }
      this.scheduleList = temp;
      if (this.scheduleList.length === 0) {
        this.scheduleRecord = true;
      }
      this.loading = false;
    },
    //点击添加停诊医生
    addClosedDoc () {
      this.selectedList = [];
      this.doctorKey = '';
      this.searchDoctor();
      this.scheduleRecord = false;
      this.dialogVisible = true;
    },
    //点击取消停诊
    cancelSuspend (scheduleId, index, length) {
      this.$confirm('确定要取消吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteSuspend(scheduleId, index, length);
      }).catch(() => {});
    },

    //amPmType-time映射
    amPmTypeTimeMapping (time) {
      switch (time) {
        case '1':
          return '上午';
        case '2':
          return '下午';
        case '3':
          return '晚上';
      }
    },
    handleCurrentChange (val) {
      this.currentPage = val;
      this.getSuspendList(val);
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/css/general';
@import './suspendManage.scss';
</style>
