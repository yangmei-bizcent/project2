<template>
  <div class="deptManage">
    <div class="helpContain">
      <div class="helpUpload">
        <div class="helpUploadTitle">
          科室管理
        </div>
        <div class="helpEdit">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="科室搜索">
              <el-input :maxlength="20" placeholder="请输入科室名称" v-model="conSearch" class="input-with-select" @change="selectInfo()">
                <i class="el-icon-search el-input__icon" slot="suffix">
                </i>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <el-table ref="multipleTable" :data="firstDeptList" tooltip-effect="dark" style="float:left;width: 50%;border: 1px solid #E6E6E6;"
          height="388" highlight-current-row @row-click="openSecondDept">
          <el-table-column label="一级科室" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ `${ scope.row.officeSort }` }}
            </template>
          </el-table-column>
          <el-table-column prop="officeName" label="" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="" label="" align="right" width="250">
            <template slot="header" slot-scope="scope">
              <span @click="addDept()" style="cursor:pointer;color: #04730E;"><i class="el-icon-plus"></i> 新增一级科室</span>
            </template>
            <template slot-scope="scope">
              <section>
                <el-button type="text" @click="addDoc(scope.row)"><i class="el-icon-edit-outline"></i>添加医生</el-button>
                <el-button type="text" @click="addDept(scope.row)"><i class="el-icon-edit-outline"></i>编辑</el-button>
                <el-button type="text" @click="deleteDept(scope.row)"><i class="el-icon-delete"></i>删除</el-button>
              </section>
            </template>
          </el-table-column>
        </el-table>
        <el-table ref="multipleTableTwo" :data="secondDeptList" tooltip-effect="dark" style="float:left;width: 50%;border: 1px solid #E6E6E6;"
          height="388">
          <el-table-column label="二级科室" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ `${ scope.row.officeSort }` }}
            </template>
          </el-table-column>
          <el-table-column prop="officeName" label="" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="" label="" align="right" width="250">
            <template slot="header" slot-scope="scope">
              <span @click="addDept('second')" style="cursor:pointer;color: #04730E;"><i class="el-icon-plus"></i>
                新增二级科室</span>
            </template>
            <template slot-scope="scope">
              <section>
                <el-button type="text" @click="addDoc(scope.row)"><i class="el-icon-edit-outline"></i>添加医生</el-button>
                <el-button type="text" @click="addDept(scope.row)"><i class="el-icon-edit-outline"></i>编辑</el-button>
                <el-button type="text" @click="deleteDept(scope.row)"><i class="el-icon-delete"></i>删除</el-button>
              </section>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog custom-class="checkImg" title="新增科室" :visible.sync="dialogAddDept" width="600px">
      <el-form ref="form" :rules="rules" :model="form" label-width="100px" style="width:400px;">
        <el-form-item label="科室名称" prop="officeName">
          <el-input v-model="form.officeName" autocomplete="off" placeholder="请输入2-10字科室名称"></el-input>
        </el-form-item>
        <el-form-item label="科室ID" prop="officeCode">
          <el-input v-model="form.officeCode" autocomplete="off" placeholder="请输入科室ID"></el-input>
        </el-form-item>
        <el-form-item label="科室排序">
          <el-input v-model="form.officeSort" type="number" min="0" max="999999999" @change="sortComList(form.officeSort)"
            placeholder="请输入科室序号"></el-input>
        </el-form-item>
        <el-form-item label="科室介绍" prop="officeIntro">
          <el-input type="textarea" v-model="form.officeIntro" maxlength="800" :rows="4" placeholder="请输入800字以内科室介绍">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    axiosget,
    axiospost,
    aixospatch,
    axiosdel
  } from "../../service/config.js"
  import {
    mapGetters,
    mapState,
    mapActions
  } from 'vuex'
  export default {
    data() {
      var validateofficeName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("科室名称不能为空"));
        } else if (!/^[a-zA-Z\u4e00-\u9fa5]+$/.test(value) ||
          this.form.officeName.toString().length > 10 ||
          this.form.officeName.toString().length < 2
        ) {
          return callback(
            new Error("请检查科室名称格式，2-10位字符，限中文或字母")
          );
        }
        return callback();
      };
      var validateofficeCode = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("科室ID不能为空"));
        }
        return callback();
      };
      return {
        firstDeptList: [],
        secondDeptList: [],
        conSearch: '',
        officeId: '',
        dialogAddDept: false,
        firstDeptAdd: 0,
        form: {
          officeName: '',
          officeCode: '',
          officeSort: '',
          officeIntro: '',
        },
        rules: {
          officeName: [{
            validator: validateofficeName,
            trigger: "blur"
          }],
          officeCode: [{
            validator: validateofficeCode,
            trigger: 'blur'
          }],
        },
      };
    },
    async created() {
      this.hospitalBranchId = this.$route.query.branchId;
      axiosget(
        `/schedule/auth/office/${this.hospitalBranchId}/faculties`).then(res => {
        if (res.data.length != 0) {
          this.firstDeptList = res.data;
          this.secondDeptList = this.firstDeptList[0].officeList;
          this.officeId = this.firstDeptList[0].officeId;
        }
      })
    },
    watch: {
      //输入框信息筛选
      conSearch(val) {
        this.selectInfo();
      },
    },
    methods: {
      //打开二级科室列表
      async openSecondDept(row) {
        this.officeId = row.officeId;
        try {
          let secondDeptInfo = await axiosget(
            `/schedule/auth/office/${this.hospitalBranchId}/${row.officeId}/childs`)
          this.secondDeptList = secondDeptInfo.data;
        } catch (err) {
          this.$message.error(err.msg);
        }
      },
      //科室信息筛选
      async selectInfo() {
        if (this.conSearch && !/^[a-zA-Z\u4e00-\u9fa5]+$/.test(this.conSearch)) {
          this.$message.warning("请检查搜索关键字格式，限中文或字母");
          return;
        }
        try {
          let res = await axiosget(
            `/schedule/auth/office/${this.hospitalBranchId}/faculties?searchStr=${this.conSearch}`)
          this.firstDeptList = res.data;
          this.secondDeptList = this.firstDeptList[0].officeList;
        } catch (err) {
          this.$message.error(err.msg);
        }
      },
      //跳转添加医生页面
      addDoc(n) {
        this.$router.push({
          path: '/deptDocManage',
          query: {
            officeName: n.officeName,
            officeId: n.officeId,
            branchId: this.hospitalBranchId
          }
        })
      },
      //打开添加科室弹窗
      addDept(n) {
        if (this.$refs['form']) {
          this.$refs['form'].resetFields();
        }
        if (!n) {
          this.firstDeptAdd = 0;
          this.form.officeName = '';
          this.form.officeCode = '';
          this.form.officeSort = '';
          this.form.officeIntro = '';
        } else if (n == "second") {
          this.firstDeptAdd = 1;
          this.form.officeName = '';
          this.form.officeCode = '';
          this.form.officeSort = '';
          this.form.officeIntro = '';
        } else {
          this.firstDeptAdd = 2;
          this.officeId = n.officeId;
          this.form.officeName = n.officeName;
          this.form.officeCode = n.officeCode;
          this.form.officeSort = n.officeSort;
          this.form.officeIntro = n.officeIntro;
        }
        this.dialogAddDept = true;
      },
      //删除医生
      deleteDept(n) {
        this.$confirm('确认删除此科室？')
          .then(_ => {
            axiosdel(`/schedule/auth/office/${n.officeId}/factulty`).then(res => {
              if (res.status == 200 && res.data) {
                this.$message.success(res.data);
              };
              axiosget(
                `/schedule/auth/office/${this.hospitalBranchId}/faculties`).then(res => {
                this.firstDeptList = res.data;
                this.secondDeptList = this.firstDeptList[0].officeList;
                this.officeId = this.firstDeptList[0].officeId;
              })
            })
          })
      },
      //排序输入框修改
      sortComList(item) {
        if(item == ""){
          return
        }
        if (item < 0 || item > 999999999) {
          this.$message.warning("请输入0~999999999之间的正整数");
          this.form.officeSort = '';
          return;
        };
        if (!/^[+]{0,1}(\d+)$/.test(item)) {
          this.$message.warning("请输入正整数");
          this.form.officeSort = '';
          return;
        }
      },
      //编辑科室
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //添加一级科室
            if (this.firstDeptAdd == 0) {
              axiospost(`/schedule/auth/office/${this.hospitalBranchId}/0/factulty`, this.form).then(
                res => {
                  if (res.status == 200 && res.data) {
                    this.$message.success(res.data);
                  };
                  axiosget(
                    `/schedule/auth/office/${this.hospitalBranchId}/faculties`).then(res => {
                    this.firstDeptList = res.data;
                    this.secondDeptList = this.firstDeptList[0].officeList;
                    this.officeId = this.firstDeptList[0].officeId;
                  })
                }) //添加二级科室
            } else if (this.firstDeptAdd == 1) {
              axiospost(`/schedule/auth/office/${this.hospitalBranchId}/${this.officeId}/factulty`, this.form).then(
                res => {
                  if (res.status == 200 && res.data) {
                    this.$message.success(res.data);
                  };
                  axiosget(
                    `/schedule/auth/office/${this.hospitalBranchId}/faculties`).then(res => {
                    this.firstDeptList = res.data;
                    this.secondDeptList = this.firstDeptList[0].officeList;
                    this.officeId = this.firstDeptList[0].officeId;
                  })
                }) //编辑科室
            } else {
              axiospost(`/schedule/auth/office/${this.officeId}/factulty`, this.form).then(
                res => {
                  if (res.status == 200 && res.data) {
                    this.$message.success(res.data);
                  };
                  axiosget(
                    `/schedule/auth/office/${this.hospitalBranchId}/faculties`).then(res => {
                    this.firstDeptList = res.data;
                    this.secondDeptList = this.firstDeptList[0].officeList;
                    this.officeId = this.firstDeptList[0].officeId;
                  })
                })
            }
            this.dialogAddDept = false;
          } else {
            return false;
          }
        });
      },
    }
  };

</script>

<style lang="scss" rel="stylesheet/stylus">
  @import "/deptManage.scss";

</style>
