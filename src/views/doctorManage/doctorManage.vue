<template>
  <div class="doctor-manage number-source-setting">
    <div class="bgcolor-white paddingX20 padding20X">
      <section class="container-title align-center">
        <div class="align-center">
          <span class="main-title">医生管理</span>
        </div>
      </section>
      <section>
        <el-form :inline="true" label-width="80px" class="search-form">
          <el-form-item label="医生搜索">
            <el-input v-model="key" placeholder="请输入医生姓名或工号">
              <i slot="suffix" class="el-input__icon el-icon-search search-icon" @click="search"></i>
            </el-input>
          </el-form-item>
          <el-form-item class="last-item">
            <el-button type="primary" class="btn-4-letters" @click="addOrEditDoctor(0)">新增医生</el-button>
          </el-form-item>
        </el-form>
        <!-- 表格 -->
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="doctorNumber" label="工号"></el-table-column>
          <el-table-column prop="doctorName" label="姓名"></el-table-column>
          <el-table-column prop="departments" label="所属科室"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrEditDoctor(1, scope.row.doctorId)" class="scope-btn">
                编辑
              </el-button>
              <el-button class="scope-btn" @click="deleteDoctor(scope.row.doctorId, scope.$index, tableData.length)"
                type="text">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination class="page" background @current-change="handleCurrentChange" :current-page.sync="currentPage"
          :page-size="pageSize" layout="->, prev, pager, next, jumper" :total="totalPage">
        </el-pagination>
      </section>
    </div>
    <!-- 新增&编辑弹窗 -->
    <el-dialog :title="`${ dialogFlag === 0 ? '新增' : '编辑' }医生`" :visible.sync="dialogVisible" width="612px">
      <div class="dialog-body-wrap">
        <el-scrollbar class="scrollbar">
          <el-form class="doctor-form" :model="doctorForm" ref="doctorForm" label-width="80px" :rules="rules">
            <el-form-item label="医生头像" prop="doctorPhoto">
              <el-upload action="" accept="image/*" :show-file-list="false" :before-upload="beforeUpload" :http-request="imgUrlRequest">
                <img class="head-img" slot="tip" :src="doctorForm.doctorPhoto || photoDoctor" />
                <el-button class="btn-upload">上传</el-button>
                <div slot="tip" class="tip-wrap">
                  <span>上传图片尺寸建议160*160，大小需要500kb以内，图片格式需为png，jpg，jpeg</span>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="工号" prop="doctorNumber">
              <el-input v-model="doctorForm.doctorNumber" placeholder="请输入工号"></el-input>
            </el-form-item>
            <el-form-item label="医生姓名" prop="doctorName">
              <el-input v-model="doctorForm.doctorName" placeholder="请输入医生姓名"></el-input>
            </el-form-item>
            <el-form-item label="医生职称" prop="doctorTitleCode">
              <el-select v-model="doctorForm.doctorTitleCode" placeholder="请选择医生职称">
                <el-option label="主任医师" value="231"></el-option>
                <el-option label="副主任医师" value="232"></el-option>
                <el-option label="主治医师" value="233"></el-option>
                <el-option label="住院医师" value="234"></el-option>
                <el-option label="执业医师" value="235"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="医生简介" prop="doctorIntro">
              <el-input type="textarea" placeholder="请输入医生简介" v-model="doctorForm.doctorIntro" resize="none" maxlength="800"
                :rows="6">
              </el-input>
            </el-form-item>
            <el-form-item label="所属科室" prop="officeIds">
              <dep-selector :model="doctorForm.officeIds" :list="departmentList" @change="changeDep">
              </dep-selector>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
      <div slot="footer">
        <el-button type="primary" class="btn-2-letters" @click="saveDoctorInfo('doctorForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import depSelector from '@/components/depSelector';
  import {
    scheduleget,
    schedulepost,
    scheduledel
  } from '@/service/schedule';
  import {
    applicationpost
  } from '@/service/application';
  import photoDoctor from '@/assets/img/numberSourceSetting/photo_doctor.png';
  // const branchId = 'b51752c6-578c-412b-ae9e-90ad748c5748';
  export default {
    components: {
      depSelector
    },
    data() {
      var checkdoctorNumber = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('工号不能为空'));
        }
        var regex = /^[\u4e00-\u9fa50-9A-Za-z]+$/;
        if (regex.test(value) == false) {
          callback(new Error('只能输入中英文和数字'));
        } else {
          if (value.length > 10) {
            callback(new Error('工号不能超过十位'));
          } else {
            callback();
          }
        }
      };
      var checkdoctorName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('医生姓名不能为空'));
        }
        if (value.length > 20) {
          callback(new Error('医生姓名不能超过二十字'));
        } else {
          callback();
        }
      };
      // var checkdoctorIntro = (rule, value, callback) => {
      //   if (value.length > 400) {
      //       callback(new Error('医生简介不能超过400字'));
      //   } else {
      //       callback();
      //   }
      // };
      return {
        branchId: '',
        photoDoctor,
        key: '', //搜索框绑定变量
        searchStr: '', //搜索关键词请求参数
        tableData: [],
        doctorForm: {
          doctorPhoto: '', //头像
          doctorNumber: '', //工号
          doctorName: '', //姓名
          doctorTitleCode: '', //职称
          doctorIntro: '', //简介
          officeIds: [], //所属科室ID
        },
        dialogFlag: -1, //弹框类型 0新增 1编辑
        departmentList: [],
        dialogVisible: false,
        pageSize: 10,
        totalPage: 0,
        currentPage: 1,
        rules: {
          doctorPhoto: [{
            required: true,
            message: '请上传医生头像',
            trigger: 'none'
          }],
          doctorNumber: [{
              required: true,
              message: '工号不能为空',
              trigger: 'blur'
            },
            {
              validator: checkdoctorNumber,
              trigger: 'blur'
            }
          ],
          doctorName: [{
              required: true,
              message: '医生姓名不能为空',
              trigger: 'blur'
            },
            {
              validator: checkdoctorName,
              trigger: 'blur'
            }
          ],
          doctorTitleCode: [{
            required: true,
            message: '请选择医生职称',
            trigger: 'change'
          }],
          // doctorIntro: [
          //   { validator: checkdoctorIntro,  trigger: 'blur' }
          // ],
          // officeIds: [
          //   { required: true, message: '请选择所属科室', trigger: 'none' }
          // ]
        }
      }
    },
    created() {
      this.branchId = this.$route.query.branchId;
      this.getDoctorList(1);
      this.getfacultyList();
    },
    methods: {
      //获取列表数据
      getDoctorList(currentPage) {
        scheduleget(
          `auth/doctor/${ this.branchId }/doctors?searchStr=${ this.searchStr }&pageNo=${ currentPage }&pageSize=${ this.pageSize }`
        ).then(res => {
          if (res.hasOwnProperty('data')) {
            this.totalPage = res.data.total;
            this.currentPage = currentPage;
            this.initTableData(res.data.list);
          }
        }).catch(err => {
          console.error(err);
        });
      },
      //获取科室列表 非树形结构
      getfacultyList() {
        scheduleget(`auth/office/${ this.branchId }/faculties/inline`).then(res => {
          if (res.hasOwnProperty('data')) {
            this.departmentList = res.data;
          }
        }).catch(err => {
          console.error(err);
        });
      },
      //获取医生信息
      getDoctorInfo(doctorId) {
        scheduleget(`auth/doctor/${ doctorId }`).then(res => {
          if (res.hasOwnProperty('data')) {
            this.doctorForm = this.initDoctorInfo(res.data);
          }
        }).catch(err => {
          console.error(err);
        });
      },
      //新增医生
      addDoctor(postObj) {
        schedulepost(`auth/doctor/${ this.branchId }/doctor`, postObj).then(res => {
          this.dialogVisible = false;
          if (typeof res.data === 'string') {
            this.$message.success('新增成功');
            this.getDoctorList(this.currentPage);
          }
        }).catch(err => {
          console.error(err);
        });
      },
      //编辑医生
      editDoctor(doctorId, postObj) {
        schedulepost(`auth/doctor/${ doctorId }/doctor/edit`, postObj).then(res => {
          if (typeof res.data === 'string') {
            this.$message.success('编辑成功');
            this.dialogVisible = false;
            this.getDoctorList(this.currentPage);
          }
        }).catch(err => {
          console.error(err);
        });
      },
      //删除医生
      deleteDoctor(doctorId, index, length) {
        this.$confirm('确定要删除该医生吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          scheduledel(`auth/doctor/${ doctorId }/doctor`).then(res => {
            if (typeof res.data === 'string') {
              this.$message.success('删除成功');
              if (index === 0 && length === 1) {
                this.getDoctorList(this.currentPage === 1 ? 1 : this.currentPage - 1);
              } else {
                this.getDoctorList(this.currentPage);
              }
            }
          }).catch(err => {
            console.error(err);
          });
        }).catch(() => {});
      },
      //初始化列表数据
      initTableData(list) {
        for (let item of list) {
          let temp = [];
          if (item.officeList) {
            for (let jItem of item.officeList) {
              temp.push(jItem.officeName);
            }
          }
          item.departments = temp.join('，');
        }
        this.tableData = list;
      },
      //初始化医生信息
      initDoctorInfo(data) {
        let temp = [];
        for (let item of data.officeList) {
          temp.push(item.officeId);
        }
        data.officeIds = temp;
        return data;
      },
      //点击搜索
      search() {
        if (this.key.length > 0 && !/^[0-9a-zA-Z\u4e00-\u9fa5]+$/.test(this.key)) {
          this.$message.warning('请检查关键字的格式，不允许输入特殊字符');
          return;
        }
        this.searchStr = this.key;
        this.getDoctorList(1);
      },
      //新增&编辑医生
      addOrEditDoctor(type, doctorId) {
        this.dialogFlag = type;
        if (this.$refs['doctorForm']) {
          this.$refs['doctorForm'].resetFields();
        }
        if (type === 0) {

        } else if (type === 1) {
          this.getDoctorInfo(doctorId);
        }
        this.dialogVisible = true;
      },
      //新增&编辑医生点击确认
      saveDoctorInfo(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.dialogFlag === 0) {
              this.addDoctor(this.doctorForm);
            } else if (this.dialogFlag === 1) {
              this.editDoctor(this.doctorForm.doctorId, this.doctorForm);
            }
          }
        });
      },
      //图片上传
      imgUrlRequest(e) {
        const file = new FormData();
        file.append('file', e.file);
        applicationpost('plat/auth/images/upload', file).then(res => {
          if (res.hasOwnProperty('data')) {
            this.doctorForm.doctorPhoto = res.data.url;
            this.$message.success('上传成功');
            this.$refs['doctorForm'].clearValidate(['doctorPhoto']);
          }
        }).catch(err => {
          console.error(err);
        });
      },
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpg';
        const isJPEG = file.type === 'image/jpeg';
        const isPng = file.type === 'image/png';
        const isLimit = file.size / 1024 / 1024 < 0.5;
        if (!isLimit) {
          this.$message.error(`上传的图片大小不能超过500kb`);
        }
        if (!isJPG && !isJPEG && !isPng) {
          this.$message.error('上传的图片格式只能为jpg或png或jpeg');
        }
        return (isJPG || isJPEG || isPng) && isLimit;
      },
      changeDep(val) {
        // this.$refs['doctorForm'].clearValidate(['officeIds']);
        this.doctorForm.officeIds = val;
      },
      handleCurrentChange(val) {
        this.getDoctorList(val);
      }
    }
  }

</script>

<style lang="scss">
  @import '~@/assets/css/general';
  @import './doctorManage.scss';

</style>
