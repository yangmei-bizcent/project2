<template>
  <div class="deptManage">
    <div class="helpContain">
      <div class="helpUpload">
        <div class="helpUploadTitle">
          科室管理 | <span>{{officeName}}</span>
        </div>
        <div class="helpEdit">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="医生搜索">
              <el-input :maxlength="20" placeholder="请输入医生姓名或工号" v-model="infoSearch" class="input-with-select" @change="selectInfo()">
                <i class="el-icon-search el-input__icon" slot="suffix">
                </i>
              </el-input>
            </el-form-item>
            <el-form-item label="" style="float:right;">
              <el-button type="primary" @click="addDoc()">添加医生</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table ref="multipleTable" :data="docList" tooltip-effect="dark" style="width: 100%" border>
          <el-table-column prop="doctorNumber" label="工号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="doctorName" label="姓名" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="officeList" label="所属科室" show-overflow-tooltip>
            <template slot-scope="scope">
              <section>
                <span v-for="(n, index) in scope.row.officeList">{{n.officeName}}{{
                  index==scope.row.officeList.length-1?'':'、'}}</span>
              </section>
            </template>
          </el-table-column>
          <el-table-column prop="operation" label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <section>
                <el-button type="text" @click="docEdit(scope.row)"><i class="
                        el-icon-edit-outline"></i>修改</el-button>
                <el-button type="text" @click="deleteDoc(scope.row)"><i class="el-icon-delete"></i>删除</el-button>
              </section>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :page-size="10" background layout="prev, pager, next, jumper"
          :total="listNum?listNum:0">
        </el-pagination>
      </div>
    </div>
    <el-dialog custom-class="docSelect" title="添加医生" :visible.sync="dialogAddDoc" width="600px">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="">
          <el-input :maxlength="20" placeholder="请输入医生姓名或工号" v-model="docInfoSearch" class="input-with-select" @change="selectDocInfo()">
            <i class="el-icon-search el-input__icon" slot="suffix">
            </i>
          </el-input>
        </el-form-item>
      </el-form>
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="n in deptDocList" :key="n.doctorId" :label="n.doctorId">{{n.doctorName}} {{n.doctorNumber}}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addDeptDoc()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog custom-class="editDocInfo" title="编辑医生" :visible.sync="dialogEditDoc" width="600px">
      <el-form :model="docEditForm" :rules="rules" ref="docEditForm" label-width="120px">
        <el-form-item label="医生头像" prop="docHead">
          <el-upload action="" :file-list="docHeader" :limit="1" :on-exceed="limitFile" :on-remove="handleRemove"
            list-type="picture" :http-request="imgurlRequest" :before-upload="beforeAvatarUpload">
            <el-button size="mini" plain>点击上传</el-button>
            <div slot="tip" class="el-upload__tip">上传图片尺寸建议160*160，大小需要500kb以内，图片格式需为png，jpg，jpeg(文件大小不超过1M)
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="工号" prop="doctorNumber">
          <el-input v-model="docEditForm.doctorNumber" placeholder="请输入工号" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="医生姓名" prop="doctorName">
          <el-input v-model="docEditForm.doctorName" placeholder="请输入姓名" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="医生职称" prop="doctorTitle">
          <el-select v-model="docEditForm.doctorTitle" placeholder="请选择">
            <el-option :key="231" label="主任医师" value="231"></el-option>
            <el-option :key="232" label="副主任医师" value="232"></el-option>
            <el-option :key="233" label="主治医师" value="233"></el-option>
            <el-option :key="234" label="住院医师" value="234"></el-option>
            <el-option :key="235" label="执业医师" value="235"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医生简介" prop="doctorIntro">
          <el-input type="textarea" :rows="2" placeholder="请输入400字内的医生简介" v-model="docEditForm.doctorIntro" maxlength="400">
          </el-input>
        </el-form-item>
        <el-form-item label="所属科室" prop="licenceNumber">
          <dep-selector :model="docEditForm.officeIds" :list="departmentList" @change="changeDep">
          </dep-selector>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditDoc = false">取 消</el-button>
        <el-button type="primary" @click="uploadDocInfo('docEditForm')">确 定</el-button>
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
  import depSelector from '../../components/depSelector.vue'
  export default {
    data() {
      var validatedoctorNumber = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("工号不能为空"));
        } else if (!/^[0-9a-zA-Z\u4e00-\u9fa5]+$/.test(value) ||
          this.docEditForm.doctorNumber.toString().length > 10 ||
          this.docEditForm.doctorNumber.toString().length < 2
        ) {
          return callback(
            new Error("请检查工号格式，2-10位字符，限中文、字母或数字")
          );
        }
        return callback();
      };
      var validatedoctorName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("医生姓名不能为空"));
        } else if (!/^[a-zA-Z\u4e00-\u9fa5]+$/.test(value) ||
          this.docEditForm.doctorName.toString().length > 20 ||
          this.docEditForm.doctorName.toString().length < 2
        ) {
          return callback(
            new Error("请检查医生姓名格式，2-20位字符，限中文或字母")
          );
        }
        return callback();
      };
      return {
        officeName: '',
        officeId: '',
        docList: [],
        docHeader: [],
        dialogAddDoc: false,
        dialogEditDoc: false,
        deptDocList: [],
        departmentList: [],
        listNum: 0,
        infoSearch: '',
        docInfoSearch: '',
        doctorId: '',
        checkList: [],
        docEditForm: {
          doctorNumber: '',
          doctorName: '',
          doctorTitle: '',
          doctorIntro: '',
        },
        rules: {
          doctorNumber: [{
            validator: validatedoctorNumber,
            trigger: "blur"
          }],
          doctorName: [{
            validator: validatedoctorName,
            trigger: "blur"
          }]
        },
      };
    },
    async created() {
      this.officeName = this.$route.query.officeName;
      this.hospitalBranchId = this.$route.query.branchId ? this.$route.query.branchId : this.hospitalBranchId;
      this.officeId = this.$route.query.officeId;
      axiosget(
        `/schedule/auth/doctor/${this.hospitalBranchId}/doctors?officeId=${this.officeId}`).then(res => {
        this.docList = res.data.list;
        this.listNum = res.data.total;
      })
    },
    watch: {
      //输入框医生信息筛选
      infoSearch(val) {
        this.selectInfo();
      },
      //输入框医生筛选
      docInfoSearch(val) {
        this.selectDocInfo();
      },
    },
    components: {
      depSelector
    },
    methods: {
      //信息筛选
      async selectInfo() {
        if (this.infoSearch && !/^[0-9a-zA-Z\u4e00-\u9fa5]+$/.test(this.infoSearch)) {
          this.$message.warning("请检查搜索关键字格式，限中文、字母或数字");
          return;
        }
        let res = await axiosget(
          `/schedule/auth/doctor/${this.hospitalBranchId}/doctors?officeId=${this.officeId}&searchStr=${this.infoSearch}`
        )
        this.docList = res.data.list;
        this.listNum = res.data.total;
      },
      //添加医生
      async addDoc() {
        this.checkList = [];
        this.deptDocList = [];
        this.docInfoSearch = '';
        let docListData = await axiosget(
          `/schedule/auth/doctor/${this.hospitalBranchId}/${this.officeId}/faculty/doctors/`
        )
        //在科室内医生不显示
        docListData.data.forEach((item, index) => {
          if (!item.isInOffice) {
            this.deptDocList.push(item)
          }
        });
        //在科室内的医生默认选中
        // this.deptDocList = docListData.data;
        // this.deptDocList.forEach((item, index) => {
        //   if (item.isInOffice) {
        //     this.checkList.push(item.doctorId)
        //   }
        // });
        this.dialogAddDoc = true;
      },
      //医生筛选
      async selectDocInfo() {
        if (this.docInfoSearch && !/^[0-9a-zA-Z\u4e00-\u9fa5]+$/.test(this.docInfoSearch)) {
          this.$message.warning("请检查搜索关键字格式，限中文、字母或数字");
          return;
        }
        let res = await axiosget(
          `/schedule/auth/doctor/${this.hospitalBranchId}/${this.officeId}/faculty/doctors/?searchStr=${this.docInfoSearch}`
        )
        this.deptDocList = res.data;
      },
      //添加科室医生
      async addDeptDoc() {
        let addMsg = await axiospost(
          `/schedule/auth/office/${this.officeId}/factulty/doctors`, this.checkList
        );
        if (addMsg.status == 200 && addMsg.data) {
          this.$message.success(addMsg.data);
        };
        let res = await axiosget(
          `/schedule/auth/doctor/${this.hospitalBranchId}/doctors?officeId=${this.officeId}&searchStr=${this.infoSearch}`
        )
        this.docList = res.data.list;
        this.listNum = res.data.total;
        this.dialogAddDoc = false;
      },
      //编辑医生信息
      async docEdit(n) {
        this.doctorId = n.doctorId;
        let res = await axiosget(
          `/schedule/auth/doctor/${n.doctorId}`
        )
        this.docEditForm = res.data;
        if (res.data.doctorPhoto) {
          this.docHeader[0] = {
            name: res.data.doctorName,
            url: res.data.doctorPhoto
          };
        } else {
          this.docHeader = [];
        }
        this.getfacultyList();
        this.dialogEditDoc = true;
      },
      //获取科室列表 非树形结构
      getfacultyList() {
        axiosget(`/schedule/auth/office/${this.hospitalBranchId}/faculties/inline`).then(res => {
          if (res.hasOwnProperty('data')) {
            this.departmentList = res.data;
          }
        }).catch(err => {
          console.error(err);
        });
      },
      //图片验证
      beforeAvatarUpload(file) {
        const isType = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg');
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isType) {
          this.$message.error('上传图片只能是 JPG/PNG/JPEG 格式!');
        }
        if (!isLt1M) {
          this.$message.error('上传图片大小不能超过 1M!');
        }
        return isType && isLt1M;
      },
      //上传图片
      async imgurlRequest(item) {
        let form = new FormData();
        form.append("file", item.file);
        await axiospost(`/application/plat/auth/images/upload`, form).then(
          res => {
            this.docHeader[0] = {
              name: item.file.name,
              url: res.data.url
            };
            this.$message.success("图片上传成功");
          }).catch(err => {
          this.$message.error("图片上传失败");
        });
      },
      //图片超出数量提醒
      limitFile(file, fileList) {
        this.$message.error("上传的图片最多一张，请删除之后再重新上传");
      },
      //删除图片
      handleRemove(file, fileList) {
        this.docHeader = fileList;
      },
      //弹窗添加科室
      changeDep(val) {
        this.$refs['docEditForm'].clearValidate(['officeIds']);
        this.docEditForm.officeIds = val;
      },
      //删除医生
      deleteDoc(n) {
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axiosdel(`/schedule/auth/office/${this.officeId}/${n.doctorId}/factulty`).then(res => {
            if (res.status == 200 && res.data) {
              this.$message.success(res.data);
            };
            axiosget(
              `/schedule/auth/doctor/${this.hospitalBranchId}/doctors?officeId=${this.officeId}&searchStr=${this.infoSearch}`
            ).then(
              res => {
                this.docList = res.data.list;
                this.listNum = res.data.total;
              })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //当前页: ${val}
      handleCurrentChange(val) {
        axiosget(
          `/schedule/auth/doctor/${this.hospitalBranchId}/doctors?officeId=${this.officeId}&searchStr=${this.infoSearch}&pageNo=${val}`
        ).then(
          res => {
            this.docList = res.data.list;
            this.listNum = res.data.total;
          })
      },
      //修改医生信息
      uploadDocInfo(formName) {
        if (this.docHeader.length == 0) {
          this.$message.error('请上传医生头像!');
          return false;
        }
        this.docEditForm.doctorPhoto = this.docHeader[0].url;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axiospost(`/schedule/auth/doctor/${this.doctorId}/doctor/edit`, this.docEditForm).then(
              res => {
                if (res.status == 200 && res.data) {
                  this.$message.success(res.data);
                };
                axiosget(
                  `/schedule/auth/doctor/${this.hospitalBranchId}/doctors?officeId=${this.officeId}`).then(res => {
                  this.docList = res.data.list;
                  this.listNum = res.data.total;
                })
              })
            this.dialogEditDoc = false;
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
