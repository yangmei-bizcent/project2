<template>
  <div class="position-config position">
    <div class="page-title">方位介绍信息配置</div>
    <div class="bgcolor-white paddingX20 padding20X">
      <section class="container-title">
        <div>
          <span class="main-title">{{ positionInfo.name }}</span>
        </div>
      </section>

      <section>
        <el-form
          class="position-info"
          :model="positionInfo"
          :rules="rules"
          ref="positionInfo"
          label-width="130px">
          <el-form-item class="text-label" label="医院名称">
            <p class="info-content">{{ positionInfo.name }}</p>
          </el-form-item>

          <el-form-item class="text-label" label="医院等级">
            <p class="info-content">{{ positionInfo.level || '无' }}</p>
          </el-form-item>

          <el-form-item label="医院风采图">
            <p v-if="positionInfo.imgurls.length === 0" class="img-wrap color-999">无</p>
            <div class="img-wrap">
              <img
                v-for="(item, index) of positionInfo.imgurls"
                :key="index"
                :src="item.url"/>
            </div>
          </el-form-item>

          <el-form-item class="text-label" label="医院地址">
            <p class="info-content">{{ positionInfo.address || '无' }}</p>
          </el-form-item>

          <el-form-item class="inline-item" label="医院经纬度" prop="latitude">
            <el-input
              class="narrow-input"
              v-model="positionInfo.latitude"
              placeholder="请输入纬度">
            </el-input>&nbsp;&nbsp;&nbsp;,&nbsp;&nbsp;
          </el-form-item>

          <el-form-item class="inline-item no-margin-left" prop="longitude">
            <el-input
              class="narrow-input"
              v-model="positionInfo.longitude"
              placeholder="请输入经度">
            </el-input>
          </el-form-item>

          <el-button class="text-btn" type="text" @click="howToGetPoint">如何获取经纬度？</el-button>

          <el-form-item label="来院交通" prop="traffic">
            <el-input
              type="textarea"
              v-model="positionInfo.traffic"
              :rows="5"
              resize="none"
              maxlength="1000"
              placeholder="请输入常规车站来院公交指引，若医院有不同大门请分开编写，1000字"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class="btn-2-letters" type="primary" @click="saveConfigInfo">保存</el-button>
          </el-form-item>
        </el-form>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { applicationpost, applicationget } from '@/service/application';
import { mapState } from 'vuex';
import { apiurl } from '@/service/api';

// const platformHospitalId = '37f7bdb2-6fcf-40dd-baf8-355868ba8702';

export default {
  data () {
    let validateFloat = (rule, value, callback) => {
      let regExp = /^\d+(\.\d+)?$/;
      if (!regExp.test(value)) {
        callback(new Error('请输入有效的经纬度'));
      } else {
        callback();
      }
    };
    return {
      branchId: '',
      positionInfo: {
        name: '',
        traffic: '',
        latitude: '',
        longitude: '',
        level: '',
        address: '',
        imgurls: [
          {
            name: '',
            url: ''
          }
        ]
      },
      rules: {
        traffic: [
          { required: true, message: '请输入来院交通', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: '请输入经度', trigger: 'blur' },
          { validator: validateFloat, trigger: 'blur' }
        ],
        latitude: [
          { required: true, message: '请输入纬度', trigger: 'blur' },
          { validator: validateFloat, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      platformHospitalId: state => state.base.platformHospitalId,
      token: state => state.base.token
    })
  },
  created () {
    this.branchId = this.$route.query.branchId;
    if (this.branchId) {
      this.getPositionInfo();
    } else {
      new Promise((resolve, reject) => {
        this.getHospitalList(resolve);
      }).then((d) => {
        this.$router.replace({
          name: 'positionConfig',
          query: {
            platformHospitalId: this.platformHospitalId,
            token: this.token,
            branchId: d
          }
        });
      }).catch(err => {
        console.error(err);
      });
    }
  },
  methods: {
    //获取院区列表
    getHospitalList (resolve) {
      applicationget(`${ apiurl.getHospitalList }?platformHospitalId=${ this.platformHospitalId }`).then(res => {
        resolve(res.data[0].hospitalBranchId);
      }).catch(err => {
        console.error(err);
      });
    },
    //获取院区信息
    getPositionInfo () {
      applicationget(`${ apiurl.getPositionInfo }?branchId=${ this.branchId }`).then(res => {
        this.positionInfo = res.data;
      }).catch(err => {
        console.error(err);
      });
    },
    //保存方位配置
    saveConfigInfo () {
      this.$refs['positionInfo'].validate(valid => {
        if (valid) {
          applicationpost(apiurl.postPositionInfo, Object.assign({ hospitalBranchId: this.branchId }, this.positionInfo)).then(res => {
            if (typeof res.data === 'string') {
              this.$message.success('保存成功');
            }
          }).catch(err => {
            console.error(err);
          });
        } else {
          return false;
        }
      });
    },
    howToGetPoint () {
      window.open('http://api.map.baidu.com/lbsapi/getpoint/index.html');
    }
  },
  watch: {
    $route (val) {
      this.branchId = val.query.branchId;
      this.getPositionInfo();
    }
  }
}
</script>

<style lang="scss" scoped>
.color-999 {
  color: #999;
}
.position-info {
  width: 930px;
  margin-top: 37.5px;
}
.info-content {
  font-size: 14px;
  line-height: 18px;
  color: #999;
  letter-spacing: 0;
}
.img-wrap {
  display: flex;
  align-items: flex-start;
  img {
    max-height: 135px;
    margin-right: 20px;
  }
}
.text-btn {
  font-size: 12px;
  color: #3C9EF8;
  letter-spacing: 0.2px;
  text-decoration: underline;
}
.narrow-input {
  width: 150px;
}
.inline-item {
  display: inline-block;
}
</style>

<style lang="scss">
@import '~@/assets/css/general';
.position-config {
  .el-form-item__label {
    font-size: 14px;
    color: #333;
    letter-spacing: 0;
    padding-right: 20px;
  }
  .text-label .el-form-item__label {
    line-height: 18px;
  }
  .no-margin-left .el-form-item__content {
    margin-left: 0 !important;
  }
}
</style>
