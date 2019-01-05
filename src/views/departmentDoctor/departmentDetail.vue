<template>
  <div class="page-container page-departdetail bgcolor-white">
    <div class="page-title flex-align-justifystart">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>科室信息配置</el-breadcrumb-item>
        <el-breadcrumb-item>{{$route.query.type=='add'?'新增科室':'科室详情'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="paddingX20 padding20X">
      <header class="page-content-header">
        <div class="flex-align-justifystart">
          <p class="fontsize10 color-333 bold">{{title}}</p>
        </div>
      </header>
      <section class="margintop30">
        <el-form ref="departDetailForm" :rules="rules" :model="departDetailForm" label-width="140px">
          <el-form-item label="科室名称" prop="name">
            <el-input v-model.trim="departDetailForm.name" class="width300" placeholder="请输入2-10字科室名称"></el-input>
          </el-form-item>
          <el-form-item label="科室编号/ID" prop="hosDeptId">
            <el-input v-model.trim="departDetailForm.hosDeptId" class="width300" placeholder="请输入10字以内科室编号/ID"></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="departDetailForm.seq" type="number" class="width300" min="0" max="999999999" @change="sortChange(departDetailForm.seq)"
              placeholder="请输入数字越大越靠前"></el-input>
            <!-- <el-input-number v-model="departDetailForm.seq" class="width300" controls-position="right" :min="0"
                  placeholder="请输入数字越大越靠前"></el-input-number> -->
            <!-- <el-input type="number" v-model.number="departDetailForm.seq" class="width300" min="0" placeholder="请输入数字越大越靠前"></el-input> -->
          </el-form-item>
          <el-form-item label="科室介绍图" :rules="[ { required: true, message: '图片必传'}]">
            <div class="flex-align-justifystart">
              <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false"
                :http-request="uploadFun" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
                :on-change="changeFun" accept="image/jpeg,image/png">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div class="flex-alignstart-justifybetween-column marginleft20 fontsize-2 upload-right-tool">
                <div class="lineheight0">
                  <!-- <el-button plain class="btn-upload fontsize-2" @click="uploadFun">上传</el-button> -->
                  <input type="text" v-model="departDetailForm.facultyImage" v-show="false">
                  <span @click="showUploadImgExp" class="depart-img-descript cursorPointer">点击了解什么是“科室介绍图”。</span>
                </div>
                <p class="color-666">上传图片尺寸建议750*270，大小需要500kb以内，图片格式需为png，jpg，jpeg</p>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="科室介绍" prop="content">
            <div style="max-width:819px;">
              <el-input v-model.trim="departDetailForm.content" type="textarea" rows="5" maxlength="800" placeholder="请输入科室相关介绍，800字以内，可从科室竞争力的介绍、科室医生资源、科室病区资源、科室擅长疾病、科室掌握的先进技术及仪器、科室研究课题等方面描述">
              </el-input>
              <span style="font-size: 14px;color: #999999;float:right;">{{ksjsnum}}/800</span>
            </div>

          </el-form-item>
          <el-form-item label="床位数">
            <el-input v-model="departDetailForm.beds" type="number" @input="changeBedFun" class="width300" min="0" max="100000"
              placeholder="请输入科室的床位数量"></el-input>
          </el-form-item>
          <el-form-item label="门诊地点">
            <div style="max-width:819px;">
              <el-input v-model.trim="departDetailForm.clinicLocale" type="textarea" rows="5" maxlength="50"
                placeholder="请输入科室门诊地点楼号及楼层，50字以内，若不填则界面不显示"></el-input>
              <span style="font-size: 14px;color: #999999;float:right;">{{mzddnum}}/50</span>
            </div>

          </el-form-item>
          <el-form-item label="病区地点">
            <div style="max-width:819px;">
              <el-input v-model.trim="departDetailForm.wardLocale" type="textarea" rows="5" maxlength="50" placeholder="请输入科室病区地点楼号及楼层，50字以内，若不填则界面不显示"></el-input>
              <span style="font-size: 14px;color: #999999;float:right;">{{bqddnum}}/50</span>
            </div>
          </el-form-item>
          <el-form-item label="科室电话">
            <div class="depList">
              <div class="flex-align-justifystart list" v-for="(item,index) in stringPhone" :key="index">
                <el-input v-model="item.val" class="width300" placeholder="请输入联系电话，固定电话请添加区号"></el-input>
                <el-input v-model="item.description" class="width300 marginleft20" placeholder="请输入10字内中文描述，若不填则界面不显示"></el-input>
                <div class="wrap-delete-icon">
                  <i @click="removePhone(index)" style="cursor: pointer;"></i>
                </div>
              </div>
            </div>

            <div class="wrap-add-icon margintop15">
              <i @click="addPhone" style="cursor: pointer;"></i>
            </div>
          </el-form-item>
          <el-form-item label="科室地址">
            <div style="max-width:819px;">
              <el-input v-model.trim="departDetailForm.location" type="textarea" rows="5" maxlength="50" placeholder="请输入科室提供的官方地址，50字以内，若不填则界面不显示"></el-input>
              <span style="font-size: 14px;color: #999999;float:right;">{{ksdznum}}/50</span>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveSubmitFun('departDetailForm')" :loading="isBtnloading" v-show="ediKSShow">保存</el-button>
            <!-- <el-button type="primary" plain>删除</el-button> -->
          </el-form-item>
        </el-form>
      </section>
    </div>
    <el-dialog title="范例" class="dlg-header-bottom-line" :visible.sync="departImgExpDlgVisible" width="800px">
      <img src="../../assets/img/department/depart-img-exp.png" class="width100">
    </el-dialog>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  export default {
    inject: ['reload'],
    data() {
      var validateNumber = (rule, value, callback) => {
        let reg = /^\d+$/
        if (value || value != '') {
          if (!reg.test(value)) {
            callback(new Error('请输入非负整数'))
          } else {
            callback()
          }
        }
      };
      return {
        imageUrl: '', // 科室介绍图
        departImgExpDlgVisible: false, // 科室介绍图范例
        departDetailForm: {
          seq: 0,
          phone: "",

        },
        stringPhone: [{
          val: "",
          description: ""
        }],
        imgfile: "",
        btnbool: false,
        ksjsnum: 0,
        mzddnum: 0,
        bqddnum: 0,
        ksdznum: 0,
        isBtnloading: false,
        title: "新增科室",
        rules: {
          name: [{
              required: true,
              message: '请输入科室名称'
            },
            {
              min: 2,
              max: 10,
              message: '请输入2-10字科室名称',
              trigger: 'blur'
            }
          ],
          seq: [{
            validator: validateNumber,
            trigger: "blur"
          }],
          hosDeptId: [{
              required: true,
              message: '科室编号/ID不能为空'
            },
            {
              max: 10,
              message: '请输入10字以内科室编号/ID',
              trigger: 'blur'
            }
          ],
          content: [{
            required: true,
            message: '科室介绍不能为空'
          }],
        },
        //权限控制
        ediKSShow: false,

      }
    },
    computed: {
      ...mapGetters({
        hosAndDeparts: 'hosAndDeparts',
        Jurisdiction: 'Jurisdiction',
        moduleper:'moduleper'
      }),
    },
    created() {
      this.JurisdictionFun();
      if (this.$route.query.type == 'edit') {
        this.$store.dispatch({
          type: 'getDepartInfo',
          // falcutyId:'661e61e9-65d4-4303-8339-1e40a1e6ab89'
          falcutyId: this.$route.query.facultyId
        }).then((res) => {
          if (res.status == 200) {
            this.departDetailForm = res.data;
            this.departDetailForm.facultyImage = res.data.facultyImage;
            this.imageUrl = res.data.facultyImage;
            this.title = res.data.name;
            if (res.data.phone) {
              this.stringPhone = JSON.parse(res.data.phone);
            }

          }

          //console.log(res)
        })
      }
    },
    methods: {
      JurisdictionFun() {
        //权限控制
        if((this.moduleper!=undefined || this.moduleper!=null) && this.moduleper.length>0){
            this.moduleper.map(item=>{
              item.children.map(item2=>{
                if (item2.feature_id == 351066) { //"新增/修改科室详情信息"
                  this.ediKSShow = true;
                }
              })
              
            })
        }
       
      },
      async saveSubmitFun(departDetailForm) { //保存
        let self = this;
        this.$refs[departDetailForm].validate((valid) => {
          if (valid) {
            if (this.departDetailForm.facultyImage == undefined) {
              this.$message.error("请上传科室图片");
              return false;
            }
            let bool = false;
            let stringPhonearr = [];
            stringPhonearr = this.stringPhone.filter((item) => {
              if (item.val != "") {
                return item;
              }
            })
            stringPhonearr.filter((item) => {
              if (item.val != "") {
                if (!((/^1[34578]\d{9}$/.test(item.val)) || /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(item.val))) {
                  bool = true;
                  this.$message.error("号码格式不正确");
                  return false;
                }
              }
              // else{
              //     if(this.$route.query.type=='edit'){
              //         this.editDateFun();
              //     }else{
              //         this.subDateFun();
              //     }
              // }
            })
            if (this.departDetailForm.beds < 0 || this.departDetailForm.beds > 100000) {
              bool = true;
              this.$message.error("床位数为0~100000区间");
              return false;
            }
            if (!bool) {
              this.departDetailForm.phone = JSON.stringify(stringPhonearr);
              if (this.$route.query.type == 'edit') {
                this.editDateFun();
              } else {
                this.subDateFun();
              }
            }
          } else {
            //console.log('error submit!!');
            return false;
          }
        });
      },
      //排序验证
      sortChange(seq) {
        if (seq < 0 || seq > 999999999) {
          this.$message.warning("请输入0~999999999之间的正整数");
          this.departDetailForm.seq = '';
          return;
        };
        if (!/^[+]{0,1}(\d+)$/.test(seq)) {
          this.$message.warning("请输入正整数");
          this.departDetailForm.seq = '';
          return;
        }
      },
      editDateFun() { //修改
        let self = this;
        self.$store.dispatch({
          type: 'editDepartInfo',
          falcutyId: this.$route.query.facultyId,
          tFaculty: self.departDetailForm
        }).then((res) => {
          this.isBtnloading = false;
          this.$message.success(res.data);
          self.$router.push({
            path: '/doctortList',
            query: {
              fromType: '0',
              branchId: self.hosAndDeparts[0].hospitalBranchId,
              departId: '',
              secondDepartId: '',
              branchName: self.hosAndDeparts[0].name,
              departName: '',
              secondDepartName: ''
            }
          });
          self.reload();
          //console.log(res);
        }).catch((err) => {
          this.isBtnloading = false;
          //console.log(err);
        })
      },
      subDateFun() { //添加
        let self = this;
        this.isBtnloading = true;
        //console.log('加载中', this.isBtnloading);
        self.$store.dispatch({
          type: 'addDepart',
          branchId: this.$route.query.branchId,
          falcutyId: this.$route.query.facultyId ? this.$route.query.facultyId : '0',
          tFaculty: self.departDetailForm
        }).then((res) => {
          this.isBtnloading = false;
          this.$message.success(res.data);
          self.$router.push({
            path: '/doctortList',
            query: {
              fromType: '0',
              branchId: self.hosAndDeparts[0].hospitalBranchId,
              departId: '',
              secondDepartId: '',
              branchName: self.hosAndDeparts[0].name,
              departName: '',
              secondDepartName: ''
            }
          });
          self.reload();
          //console.log(res);
        }).catch((err) => {
          this.isBtnloading = false;
          //console.log(err);
        })
      },
      removePhone(index) { //删除号码
        this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.stringPhone.splice(index, 1);
        }).catch(() => {

        });

      },
      addPhone() { //新增号码
        if (this.stringPhone.length > 4) {
          this.$message({
            type: 'info',
            message: '最多添加5个联系电话'
          });
          return;
        }
        this.stringPhone.push({
          val: "",
          description: ""
        });
      },
      changeFun(file, fileList) {
        const isJPG = file.raw.type === 'image/jpeg' || 'image/png';
        const isLt500kb = file.raw.size / 1024 / 1024 / 1024 < 500;
        if (!isJPG) {
          this.$message.error('上传图片只能是 png，jpg，jpeg 格式!');
          return;
        }
        if (!isLt500kb) {
          this.$message.error('上传图片大小不能超过 500kb!');
          return;
        }
        this.imageUrl = URL.createObjectURL(file.raw);
        this.imgfile = file.raw;

      },
      async uploadFun() { //图片上传
        try {
          let self = this;
          if (this.imgfile == "") {
            this.$message.error('请选择图片');
            return;
          }
          let file = new FormData();
          file.append("file", this.imgfile);
          if (!self.btnbool) {
            self.btnbool = true;
            let res = await self.$store.dispatch({
              type: 'uploadImg',
              file: file
            })
            if (res.status == 200) {
              self.btnbool = false;
              this.$message.success('上传成功');
              this.departDetailForm.facultyImage = res.data.url;
              //console.log(res);
            }
          }
        } catch (err) {
          //console.log(err)
        }




      },
      limitFontSize(newValue, type) {
        if (type == 1) {
          if (newValue.length <= 800) {
            this.ksjsnum = newValue.length;
          }
        } else if (type == 2) {
          if (newValue.length <= 50) {
            this.mzddnum = newValue.length;
          }
        } else if (type == 3) {
          if (newValue.length <= 50) {
            this.bqddnum = newValue.length;
          }
        } else if (type == 4) {
          if (newValue.length <= 50) {
            this.ksdznum = newValue.length;
          }
        }


      },
      // 点击了解什么是‘科室介绍图’
      showUploadImgExp() {
        this.departImgExpDlgVisible = true;
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        // const isJPG = file.type === 'image/jpeg';
        // const isLt2M = file.size / 1024 / 1024 < 2;
        // if (!isJPG) {
        //     this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        // if (!isLt2M) {
        //     this.$message.error('上传头像图片大小不能超过 2MB!');
        // }
        // return isJPG && isLt2M;
      },
      changeBedFun() {
        this.departDetailForm.beds = this.departDetailForm.beds.replace(/\D/g, '');
      }
    },
    watch: {
      'departDetailForm.content': {
        handler(newValue, oldValue) {
          this.limitFontSize(newValue, 1);
        },

      },
      'departDetailForm.clinicLocale': {
        handler(newValue, oldValue) {
          this.limitFontSize(newValue, 2);
        },

      },
      'departDetailForm.wardLocale': {
        handler(newValue, oldValue) {
          this.limitFontSize(newValue, 3);
        },

      },
      'departDetailForm.location': {
        handler(newValue, oldValue) {
          this.limitFontSize(newValue, 4);
        },

      }
    }
  }

</script>

<style lang="scss">
  @import '@/assets/css/var.scss';

  .page-departdetail {
    .width300 {
      width: 300px;
    }

    .el-textarea__inner {
      max-width: 819px;
      resize: none;
    }

    .lineheight0 {
      line-height: 0;
    }

    .avatar-uploader .el-upload {
      border: 1px dashed #ccc;
      border-radius: 4px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 200px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }

    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .upload-right-tool {
      height: 110px;
    }

    .btn-upload {
      width: 54px;
      min-width: auto;
      padding: 0;
      color: #999;
      height: 22px;
      line-height: 22px;
    }

    .depart-img-descript {
      color: $color-3c9ef8;
      text-decoration: underline;
      margin-left: 13px;
    }

    .wrap-delete-icon {
      width: 44px;
      height: 44px;
      margin-left: 20px;

      i {
        width: 44px;
        height: 44px;
        background: url('../../assets/img/department/delete-icon.png') center no-repeat;
        background-size: contain;
      }
    }

    .wrap-add-icon {
      i {
        width: 32px;
        height: 32px;
        background: url('../../assets/img/department/add-icon.png') center no-repeat;
        background-size: contain;
      }
    }

    .dlg-header-bottom-line {
      .el-dialog__title {
        font-size: 16px;
        color: $color-333;
        font-weight: bold;
      }

      .el-dialog__header {
        padding-bottom: 24px;
      }

      .el-dialog__body {
        padding: 30px 24px;
        border-top: 1px solid #e7e7e7;
      }
    }

    .list {
      &:first-child>.wrap-delete-icon {
        display: none;
      }
    }
  }

</style>
