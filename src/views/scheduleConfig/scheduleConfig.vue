<template>
  <div class="schedule-config number-source-setting">
    <div class="bgcolor-white paddingX20 padding20X">
      <section class="container-title align-center">
        <div class="align-center">
          <span class="main-title">排班设置</span><span class="cut-off"></span><span class="dep-title">{{ officeName }}</span>
        </div>
      </section>

      <section>
        <el-row class="schedule-title">
          <span>排班时间</span>
          <span>{{ weekDate[0] }}</span>
          <span>至</span>
          <span>{{ weekDate[6] }}</span>

          <el-button type="primary" @click="preWeek">上一周</el-button>
          <el-button type="primary" @click="currentWeek">当前周</el-button>
          <el-button type="primary" @click="nextWeek">下一周</el-button>
          <el-button class="default-btn" @click="copyCurrentWeek">复制本周排班</el-button>
        </el-row>
        
        <!-- 排班表 -->
        <el-table :data="tableData" border style="width: 100%" v-loading="loading">
          <el-table-column width="150" :render-header="renderTableSlashHeader">
            <template slot-scope="scope">
              <div class="table-cell time-column">{{ tableData[scope.$index]['time'] }}</div>
            </template>
          </el-table-column>

          <el-table-column v-for="i in 7" :key="i" min-width="190">
            <template slot="header" slot-scope="scope">
              <p class="week-title">{{ `星期${ weekDayMapping(i) }` }}</p>
              <p class="week-title">{{ weekDate[i- 1] }}</p>
            </template>
            <template slot-scope="scope">
              <div class="table-cell">
                <span
                  v-if="!tableData[scope.$index][weekDate[i - 1]]"
                  class="no-data-tip">
                  暂无排班
                </span>
                <span
                  class="tag"
                  :class="{ 'tag-hover': tagClass === `${ weekDate[i - 1] }-${ tableData[scope.$index]['time'] }-${ index }` ? true : false }"
                  v-for="(item, index) of tableData[scope.$index][weekDate[i - 1]]"
                  :key="index"
                  @mouseenter="enterTag(scope.row.time, weekDate[i - 1], index)"
                  @mouseleave="leaveTag">
                  <span >{{ `${ item.doctorName }（${ item.registrationType === '1' ? '普通' : '专家' }）` }}</span>
                  <span
                    v-if="new Date(weekDate[i - 1]) - new Date(today) >= 0"
                    class="delete-icon"
                    @click="deleteOneDoctor(scope.row[weekDate[i - 1]], weekDate[i - 1], scope.row['time'], index)">
                    <i
                      :class="{ 'icon-hover': tagClass === `${ weekDate[i - 1] }-${ tableData[scope.$index]['time'] }-${ index }` ? true : false }"
                      class="el-icon-close default-state">
                    </i>
                  </span>
                </span>
                <span
                  class="add-doctor-btn"
                  v-if="new Date(weekDate[i - 1]) - new Date(today) >= 0"
                  @click="addDoctors(scope.row, weekDate[i - 1])">
                  <i class="el-icon-plus"></i>
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </div>

    <!-- 添加排班 -->
    <el-dialog
      :title="`${ dialogTitle.date }  ${ dialogTitle.department }  ${ dialogTitle.time }`"
      :visible.sync="dialogVisible"
      width="800px">
      <section class="dialog-section-wrap dialog-config-wrap" v-if="false">
        <span>{{ officeName }}</span>
        <el-form :inline="true" class="doctor-config-form">
          <el-form-item label="普通号源数量">
            <el-input type="number" min="0" placeholder="请输入普通号源数量"></el-input>
          </el-form-item>

          <el-form-item label="号源价格">
            <el-input placeholder="请输入号源价格"></el-input>
          </el-form-item>
        </el-form>
      </section>

      <section class="dialog-section-wrap doctor-search-wrap">
        <el-input v-model="doctorSearchKey" placeholder="请输入医生工号或者姓名">
          <i
            slot="suffix"
            class="el-input__icon el-icon-search search-icon"
            @click="searchDoctor">
          </i>
        </el-input>
      </section>

      <section class="doctor-table-wrap">
        <el-scrollbar class="scrollbar">
          <el-table
            :data="doctorTable"
            style="width: 100%"
            :show-header="false"
            class="doctor-table"
            ref="doctorTable"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="30"></el-table-column>

            <el-table-column prop="doctorName" width="70"></el-table-column>

            <el-table-column prop="doctorNumber" width="70"></el-table-column>

            <el-table-column>
              <template slot-scope="scope">
                <div class="table-inline-column">
                  <span>号源类型</span>
                  <el-select v-model="scope.row.registrationType" placeholder="请选择">
                    <el-option label="普通" value="1"></el-option>
                    <el-option label="专家" value="2"></el-option>
                  </el-select>
                </div>
              </template>
            </el-table-column>

            <el-table-column>
              <template slot-scope="scope">
                <div class="table-inline-column">
                  <span>号源数量</span>
                  <el-input
                    class="input-number"
                    type="number"
                    min="0"
                    placeholder="请输入号源数量"
                    v-model="scope.row.registrationNumber">
                  </el-input>
                </div>
              </template>
            </el-table-column>

            <el-table-column>
              <template slot-scope="scope">
                <div class="table-inline-column">
                  <span>号源价格</span>
                  <el-input placeholder="请输入号源价格" v-model="scope.row.registrationFee"></el-input>
                  <span>元</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </section>
      <div slot="footer">
        <el-button type="primary" class="btn-2-letters" @click="confirmAddDoctors">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formatWeekDate, formatDate } from '@/util/date';
import { scheduleget, schedulepost } from '@/service/schedule';

// const branchId = 'b51752c6-578c-412b-ae9e-90ad748c5748';
// const officeId = '20167ac5-b44f-461e-8a42-08084ca423e1';
// const officeId = '9a5e5644-5240-43a1-a51a-030f39b863db';

export default {
  data () {
    return {
      officeName: '',
      branchId: '',
      officeId: '',

      weekDate: [],
      /**
       *    [{
       *      time: 上午/下午/晚上,
       *      日期: [医生列表],
       *      ...
       *    },
       *    ...]
       */
      tableData: [],
      dialogVisible: false,
      dialogTitle: {
        date: '',
        department: '',
        time: ''
      },

      loading: true,
      tagClass: '',

      doctorTable: [],//表格展示医生信息
      allDoctorInfo: [],//暂存所有医生信息
      doctorSearchKey: '',
      selectedDoctorList: [],//暂存选中医生信息

      today: formatDate(new Date(), 'yyyy-MM-dd')
    }
  },
  created () {
    this.officeName = this.$route.query.officeName;
    this.branchId = this.$route.query.branchId;
    this.officeId = this.$route.query.officeId;
    this.weekDate = formatWeekDate(new Date());
    this.getWeekSchedule(this.weekDate[0], this.weekDate[7]);
  },
  mounted () {
    this.$nextTick(() => {
      let canvas = document.querySelector('.slash');
      let width = canvas.width = 150,
          height = canvas.height = 100;
      let ctx = canvas.getContext('2d');
      ctx.strokeStyle = "#E6E6E6";
      ctx.moveTo(0, 0);
      ctx.lineTo(width, height);
      ctx.stroke();
      ctx.font = "bold 14px MicrosoftYaHei-Bold";
      ctx.fillText("星期", width / 3 * 1.8, height / 3);
      ctx.fillText("时间", width / 9, height / 5 * 4);
    });
  },
  methods: {
    //斜线表头渲染函数
    renderTableSlashHeader (h, row) {
      return h('canvas', { class: 'slash' });
    },
    //获取一周预览排班列表
    getWeekSchedule (startDate, endDate) {
      this.loading = true;
      scheduleget(`auth/schedule/${ this.branchId }/officeId/${ this.officeId }/scheduledate/${ startDate }/enddate/${ endDate }`).then(res => {
        if (res.hasOwnProperty('data')) {
          this.tableData = this.initTableData(res.data.list);
          this.loading = false;
        }
      }).catch(err => {
        console.error(err);
      });
    },
    //获取医生列表
    getDoctorList (date, time) {
      scheduleget(`auth/schedule/${ this.branchId }/officeId/${ this.officeId }/scheduledate/${ date }/${ time }`).then(res => {
        if (res.hasOwnProperty('data')) {
          this.doctorTable = this.initDoctorList(res.data.list);
          this.allDoctorInfo = this.doctorTable;
          this.doctorTable.forEach(item => {
            if (item.isChecked) {
              this.$nextTick(() => {
                this.$refs['doctorTable'].toggleRowSelection(item, true);
              });
            }
          });
        }
      }).catch(err => {
        console.error(err);
      });
    },
    //保存科室某天半天排班
    saveSchedule (postObj, date, time) {
      schedulepost(`auth/schedule/saveScheduleDate/${ this.branchId }/${ this.officeId }/scheduledate/${ date }/${ time }`, postObj).then(res => {
        this.dialogVisible = false;
        if (typeof res.data === 'string') {
          this.$message.success('设置成功');
          this.getWeekSchedule(this.weekDate[0], this.weekDate[7]);
        }
      }).catch(err => {
        console.error(err);
      });
    },
    //拷贝排班表
    copySchedule (currentDate, targetDate) {
      schedulepost(`auth/schedule/${ this.branchId }/officeId/${ this.officeId }/scheduledate/${ currentDate[0] }/enddate/${ currentDate[1] }/save/${ targetDate[0] }/${ targetDate[1] }`).then(res => {

      }).catch(err => {
        console.error(err);
      });
    },

    //初始化排班数据
    initTableData (list) {
      let tableData = [
        { time: '上午' },
        { time: '下午' },
        { time: '晚上' }
      ];
      if (list) {
        for (let item of list) {
          let date = formatDate(new Date(item.scheduleDate), 'yyyy-MM-dd');
          if (item.amSchedule) {
            tableData[0][date] = item.amSchedule;
          }
          if (item.pmSchedule) {
            tableData[1][date] = item.pmSchedule;
          }
          if (item.emSchedule) {
            tableData[2][date] = item.emSchedule;
          }
        }
      }
      return tableData;
    },
    //初始化医生列表数据
    initDoctorList (list) {
      list.forEach(item => {
        if (!item.registrationNumber) {
          item.registrationNumber = 0;
        }
        if (!item.registrationFee) {
          item.registrationFee = 0;
        }
        if (!item.registrationType) {
          item.registrationType = '1';
        }
      });
      return list;
    },

    //点击上一周
    preWeek () {
      let tempDate = new Date(this.weekDate[0]),
          lastWeek = formatWeekDate(new Date(tempDate.setDate(tempDate.getDate() - 1)));
      this.weekDate = lastWeek;
      this.getWeekSchedule(this.weekDate[0], this.weekDate[7]);
    },
    //点击当前周
    currentWeek () {
      this.weekDate = formatWeekDate(new Date(this.today));
      this.getWeekSchedule(this.weekDate[0], this.weekDate[7]);
    },
    //点击下一周
    nextWeek () {
      this.weekDate = formatWeekDate(new Date(this.weekDate[7]));
      this.getWeekSchedule(this.weekDate[0], this.weekDate[7]);
    },
    //点击复制本周排班
    copyCurrentWeek () {
      let nextWeek = formatWeekDate(new Date(this.weekDate[7]));
      let currentDate = [this.weekDate[0], this.weekDate[7]],
          targetDate = [nextWeek[0], nextWeek[7]];
      this.copySchedule(currentDate, targetDate);
    },
    //点击添加
    addDoctors (rowData, date) {
      this.dialogTitle.date = date;
      this.dialogTitle.department = this.officeName;
      this.dialogTitle.time = rowData.time;
      this.doctorSearchKey = '';
      if (this.$refs['doctorTable']) {
        this.$refs['doctorTable'].clearSelection();
      }
      this.getDoctorList(date, this.timeAmPmTypeMapping(rowData.time));
      this.dialogVisible = true;
    },
    //搜索医生
    searchDoctor () {
      if (this.doctorSearchKey.length > 0 && !/^[0-9a-zA-Z\u4e00-\u9fa5]+$/.test(this.doctorSearchKey)) {
        this.$message.warning('请检查关键字的格式，不允许输入特殊字符');
        return;
      }
      let result = [];
      for (let item of this.allDoctorInfo) {
        if (item.doctorName.indexOf(this.doctorSearchKey) >= 0) {
          result.push(item);
          continue;
        }
        if (item.doctorNumber.indexOf(this.doctorSearchKey) >= 0) {
          result.push(item);
        }
      }
      this.doctorTable = result;
      this.selectedDoctorList.forEach(item => {
        this.$nextTick(() => {
          this.$refs['doctorTable'].toggleRowSelection(item, true);
        });
      });
    },
    //点击确认添加按钮
    confirmAddDoctors () {
      let date = this.dialogTitle.date,
          time = this.timeAmPmTypeMapping(this.dialogTitle.time);
      let postObj = [],
          intRegExp = /^(0|\+?[1-9][0-9]*)$/,
          floatRegExp = /^(\d+|\d+\.\d{1,2})$/;
      for (let item of this.selectedDoctorList) {
        if (!floatRegExp.test(item.registrationFee) || !intRegExp.test(item.registrationNumber)) {
          this.$message.error('号源数量或号源价格输入有误，请修改后重试');
          return;
        }
        let temp = Object.assign({}, item);
        temp.isChecked = true;
        temp.officeId = this.officeId;
        temp.officeName = this.officeName;
        temp.scheduleCategory = time;
        temp.scheduleDate = null;
        temp.stopSign = '0';
        temp.registrationFee = Number(item.registrationFee);
        temp.registrationNumber = Number(item.registrationNumber);
        delete temp.doctorList;
        postObj.push(temp);
      }
      this.saveSchedule(postObj, date, time);
    },
    //表格内删除医生
    deleteOneDoctor (scheduleData, date, time, index) {
      let postObj = [];
      for (let i = 0; i < scheduleData.length; i++) {
        if (i === index) {
          continue;
        }
        let temp = Object.assign({}, scheduleData[i]);
        temp.scheduleDate = null;
        temp.isChecked = true;
        delete temp.doctorList;
        postObj.push(temp);
      }
      this.saveSchedule(postObj, date, this.timeAmPmTypeMapping(time));
    },

    //time-amPmType映射
    timeAmPmTypeMapping (time) {
      switch (time) {
        case '上午':
          return '1';
        case '下午':
          return '2';
        case '晚上':
          return '3';
      }
    },
    weekDayMapping (num) {
      switch (num) {
        case 1:
          return '一';
        case 2:
          return '二';
        case 3:
          return '三';
        case 4:
          return '四';
        case 5:
          return '五';
        case 6:
          return '六';
        case 7:
          return '日';
      }
    },
    enterTag (time, date, index) {
      this.tagClass = `${ date }-${ time }-${ index }`;
    },
    leaveTag () {
      this.tagClass = '';
    },
    //医生列表选中事件
    handleSelectionChange (row) {
      this.selectedDoctorList = row;
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/css/general';
@import './scheduleConfig.scss';
</style>
