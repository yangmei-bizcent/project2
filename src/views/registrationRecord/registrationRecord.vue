<template>
  <div class="registrationRecord">
    <span class="record">挂号记录</span>
    <el-button class="installExcel" @click="installExcel">下载Excel</el-button>
    <el-button class="installTxt" @click="installTxt">下载TXT</el-button>
    <div class="line"></div>
    <div class="search">
      <!-- 就诊状态 visitStatus -->
      <span class="status status1">状态</span>
      <el-select v-model="value" placeholder="预约成功" class="elInput" @change="changeData">
        <el-option v-for="item in visitStatus" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <!-- 就诊开始日期(startTime)+就诊结束日期(endTime) -->
      <span class="status">就诊时间</span>
      <el-date-picker v-model="time" type="daterange" align="left" unlink-panels range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期" class="elData" value-format="yyyy-MM-dd" @change="changeData">
      </el-date-picker>
      <span class="status">身份证号码</span>
      <!-- 身份证号码(idCard) -->
      <el-input class="elId" v-model="idCard" @change="changeData"></el-input>
      <span class="status">手机号码</span>
      <!-- 手机号码(phoneNum) -->
      <el-input class="elPhone" v-model="phoneNum" @change="changeData"></el-input>
      <div class="tab">
        <el-table :data="tableData" stripe style="margin:0 auto;color: #333333;">
          <el-table-column label="序号" width="50">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(currentPage-1)*6}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="deptName" label="科室" :show-overflow-tooltip="true" width="90">
          </el-table-column>
          <el-table-column prop="clinicTypeValue" label="类别" :show-overflow-tooltip="true" width="80">
          </el-table-column>
          <el-table-column prop="position" label="职称" :show-overflow-tooltip="true" width="85">
          </el-table-column>
          <el-table-column prop="week" label="星期" :show-overflow-tooltip="true" width="80">
          </el-table-column>
          <el-table-column label="时间段" :show-overflow-tooltip="true" width="80">
            <template slot-scope="scope">
              <span>
                {{day[scope.row.ampmType]}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="patientName" label="患者" :show-overflow-tooltip="true" width="85">
          </el-table-column>
          <el-table-column prop="phoneNumber" label="手机号码" :show-overflow-tooltip="true" width="120">
          </el-table-column>
          <el-table-column label="性别" :show-overflow-tooltip="true" width="50">
            <template slot-scope="scope">
              <span>{{sex[scope.row.gender]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="birthday" label="出生日期" :show-overflow-tooltip="true" width="105">
          </el-table-column>
          <el-table-column prop="voucherNo" label="预约码" :show-overflow-tooltip="true" min-width>
          </el-table-column>
          <el-table-column prop="idCard" label="身份证号码" :show-overflow-tooltip="true" min-width>
          </el-table-column>
          <el-table-column prop="medicalDate" label="就诊时间" :show-overflow-tooltip="true" width="110">
          </el-table-column>
          <el-table-column label="状态" :show-overflow-tooltip="true" width="100">
            <template slot-scope="scope">
              <span>
                {{mapping[scope.row.orderStatus]}}
                <span class="circle"></span>
              </span>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
          layout="prev, pager, next, jumper" :total="totalPage" background :page-size='6' v-show="page">
        </el-pagination>
      </div>

    </div>

  </div>
</template>
<script>
  import axios from 'axios';
  import {
    mapGetters
  } from 'vuex'
  import {
    axiosConfig
  } from '@/service/config';
  export default {
    data() {
      return {
        totalNum: '',
        visitStatus: [{
          value: '1',
          label: '预约中'
        }, {
          value: '2',
          label: '待就诊'
        }, {
          value: '3',
          label: '待评价'
        }, {
          value: '4',
          label: '就诊完成'
        }, {
          value: '5',
          label: '已取消'
        }, {
          value: '6',
          label: '过期失效'
        }, {
          value: '7',
          label: '预约成功'
        }, {
          value: '8',
          label: '预约失败'
        }, {
          value: '9',
          label: '停诊'
        }, {
          value: '10',
          label: '诊后待付费'
        }],
        value: '',
        time: [],
        idCard: '',
        phoneNum: '',
        noSeeking: '未就诊',
        tableData: [],
        currentPage: 1,
        totalPage: 0,
        mapping: {
          '1': '预约中',
          '2': '待就诊',
          '3': '待评价',
          '4': '就诊完成',
          '5': '已取消',
          '6': '过期失效',
          '7': '预约成功',
          '8': '预约失败',
          '9': '停诊',
          '10': '诊后待付费'
        },
        sex: {
          '1': '男',
          '2': '女'
        },
        day: {
          'A': '上午',
          'P': '下午',
          'F': '白天',
          'N': '夜间',
          'W':'全天',
          'M': '中午'
        },
        page: true,
      }
    },
    created() {
      this.getRecord();
      if (this.tableData === '') {
        this.page = false;
      }
    },
    computed: {
      ...mapGetters({
        platformHospitalId: 'platformHospitalId'
      }),
    },
    methods: {
      open4() {
        this.$message.error('暂无挂号记录');
      },
      changeData() {
        this.currentPage = 1;
        if (!this.time) {
          this.time = ['', ''];
        }
        this.getRecord();
      },
      handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        //console.log(`当前页: ${val}`);
        this.getRecord();
      },
      //下载EXCEL表格
      installExcel() {
        axios.get(
          `patientorder/record/ui/patientOrderVisit/exportVisitRecordToExl?&platformHospitalId=${this.platformHospitalId}${ this.value.length === 0 ?  '' : `&visitStatus=${this.value}`}&startTime=${this.time[0]||''}&endTime=${this.time[1]||''}${ this.idCard.length == 0 ?  '' : `&idCard=${this.idCard}`}${ this.phoneNum.length == 0 ?  '' : `&phoneNum=${this.phoneNum}`}`,
          Object.assign({
            responseType: 'arraybuffer'
          }, axiosConfig)).then(res => {
          if (this.tableData == '') {
            this.open4()
          } else {
            let blob = new Blob([res.data], {
              type: "application/vnd.ms-excel"
            });
            let a = document.createElement('a');
            let url = URL.createObjectURL(blob);
            // window.location.href = url;
            a.href = url;
            a.download = 'RegistrationRecord';
            a.click();
          }
        }).catch(err => {
          //console.log(err);
        });
      },
      //下载txt表格
      installTxt() {
        axios.get(
          `patientorder/record/ui/patientOrderVisit/exportVisitRecordToTxt?&platformHospitalId=${this.platformHospitalId}${ this.value.length === 0 ?  '' : `&visitStatus=${this.value}`}&startTime=${this.time[0]||''}&endTime=${this.time[1]||''}${ this.idCard.length === 0 ?  '' : `&idCard=${this.idCard}`}${ this.phoneNum.length === 0 ?  '' : `&phoneNum=${this.phoneNum}`}`,
          Object.assign({
            responseType: 'arraybuffer'
          }, axiosConfig)).then(res => {
          if (this.tableData == '') {
            this.open4()
          } else {
            let blob = new Blob([res.data], {
              type: "text/plain"
            });
            let a = document.createElement('a');
            let url = URL.createObjectURL(blob);
            // window.location.href = url;
            a.href = url;
            a.download = 'RegistrationRecord';
            a.click();
          }
        }).catch(err => {
          //console.log(err);
        });
      },
      getRecord() {
        axios.get(
            `patientorder/record/ui/patientOrderVisit/getPatientVisitRecordListByPage?&platformHospitalId=${this.platformHospitalId}&pageNo=${this.currentPage}${ this.value.length === 0 ?  '' : `&visitStatus=${this.value}`}&startTime=${this.time[0]||''}&endTime=${this.time[1]||''}${ this.idCard.length === 0 ?  '' : `&idCard=${this.idCard}`}${ this.phoneNum.length === 0 ?  '' : `&phoneNum=${this.phoneNum}`}`,
            axiosConfig)
          .then(response => {
            this.tableData = response.data.list;
            if (this.tableData == '') {
              this.page = false;
            } else {
              this.page = true;
            }
            //console.log(response)
            this.totalPage = response.data.total;
          })
          .catch(error => {
            //console.log(error);
          });
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import '@/assets/css/registrationRecord.scss';

</style>
<style lang="scss">
  @import '@/assets/css/registrationRecordElement.scss';

</style>
