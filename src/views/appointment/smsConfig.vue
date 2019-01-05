<template>
  <div class="sms-config sms">
    <div class="bgcolor-white paddingX20 padding20X container">
      <section class="container-title align-center">
        <div class="align-center">
          <span class="main-title">短信配置</span>
        </div>
      </section>

      <section class="form-group">
        <el-row :gutter="60">
          <el-col
            :span="12"
            v-for="(item, index) of resArray"
            :key="index"
            class="sms-config-cell">
            <el-form
              :model="item"
              class="demo-form-inline sms-el-form"
              size="mini"
              label-width="120px">
              <el-form-item class="sms-form">
                <label class="el-form-item__labe sms-lablel">推送消息</label>
                <span class="sms-span">{{ item.messageHeadDesc }}</span>
                <el-form-item class="sms-checkbox">
                  <el-checkbox-group v-model="item.pushAppTypeArray">
                    <el-checkbox label="APP"></el-checkbox>
                    <el-checkbox label="SMS"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-form-item>

              <el-form-item label="推送标题">
                <el-input v-model="item.messageTitle"></el-input>
              </el-form-item>

              <el-form-item label="推送内容">
                <el-input
                  rows="5"
                  type="textarea"
                  resize="none"
                  v-model="item.messageContent">
                </el-input>
              </el-form-item>

              <el-form-item label="微信模板ID">
                <el-input v-model="item.templateIdWeixin"></el-input>
              </el-form-item>

              <el-form-item label="微信模板配置">
                <el-input
                  type="textarea"
                  rows="5"
                  resize="none"
                  v-model="item.templateWeixin"></el-input>
              </el-form-item>

              <el-form-item label="支付宝模板">
                <el-input v-model="item.templateAlipay"></el-input>
              </el-form-item>

              <el-form-item label="支付宝模板配置">
                <el-input
                  type="textarea"
                  rows="5"
                  resize="none"
                  v-model="item.templateIdZhifubao"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </section>

      <div class="btn-wrap">
        <el-button type="primary" class="save-btn" @click="confirmSave">确认保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState, mapActions } from 'vuex';
  import { messageget, messagepost } from '@/service/message';
  import { apiurl } from '@/service/api';

  const platformHospitalId = 'dcf6855c-bc22-466c-bf0f-c53a5f65edb4';
  const applicationName = 'appointment';
  const reqMapping = {
    APP: 'chooseApp',
    SMS: 'chooseSms',
    HOME: 'chooseHome'
  };

  export default {
    data() {
      return {
        resArray: []
      }
    },
    created() {
      this.getSmsConfig();
    },
    methods: {
      //获取配置信息
      getSmsConfig() {
        messageget(`${ apiurl.getSmsConfig }?platformHospitalId=${ platformHospitalId }&applicationName=${ applicationName }`).then(res => {
          if (res.hasOwnProperty('data')) {
            this.initResData(res);
          }
        }).catch(err => {
          console.error(err);
        });
      },
      //提交配置信息
      postSmsConfig(obj) {
        messagepost(apiurl.postSmsConfig, obj).then(res => {
          if (res.hasOwnProperty('data')) {
            this.initResData(res);
            this.$message.success('保存成功');
          }
        }).catch(err => {
          console.error(err);
        });
      },
      //处理返回数据
      initResData(res) {
        let smsConfigTemplateList = res.data.smsConfigTemplateList;
        for (let i = 0; i < smsConfigTemplateList.length; i++) {
          let pushAppType = JSON.parse(smsConfigTemplateList[i].pushAppType),
            temp = [];
          for (let param in pushAppType) {
            if (pushAppType[param]) {
              temp.push(param.toLocaleUpperCase());
            }
          }
          smsConfigTemplateList[i].pushAppTypeArray = temp;
        }
        this.resArray = smsConfigTemplateList;
      },
      //点击保存按钮
      confirmSave() {
        let smsConfigTemplateList = [];
        for (let i = 0; i < this.resArray.length; i++) {
          let temp = Object.assign({}, this.resArray[i]);
          for (let param in reqMapping) {
            if (this.resArray[i].pushAppTypeArray.includes(param)) {
              temp[reqMapping[param]] = true;
            } else {
              temp[reqMapping[param]] = false;
            }
          }
          delete temp.pushAppTypeArray;
          temp.templateIdWeixin = temp.templateIdWeixin ? temp.templateIdWeixin : ' ';
          temp.templateIdZhifubao = temp.templateIdZhifubao ? temp.templateIdZhifubao : ' ';
          smsConfigTemplateList.push(temp);
        }
        let postObj = {
          messageType: applicationName,
          platformHospitalId,
          smsConfigTemplateList
        }
        this.postSmsConfig(postObj);
      }
    }
  }
</script>

<style lang="scss">
@import '~@/assets/css/general';
.sms-config {
  .container {
    min-width: 1397px;
  }

  .form-group {
    padding: 0 120px;
  }

  .el-textarea {
    width: 354px;
    height: 100px;
  }

  .el-input {
    width: 354px;
    height: 34px;
  }

  .sms-el-form {
    border: 1px solid #E7E7E7;
  }

  .sms-span {
    line-height: 63px;
    color: #666666;
  }

  .sms-form {
    // width: 578px;
    height: 63px;
    background-color: #F2F2F2;
    line-height: 63px;
  }

  .sms-lablel {
    line-height: 63px;
    position: absolute;
    left: -75px;
    font-size: 16px;
    font-weight: bolder;
  }

  .sms-checkbox {
    float: right;
    line-height: 63px;
    margin-right: 100px;
    margin-top: 15px;
  }

  .sms-config {
    background-color: #FFFFFF;
  }

  .sms-config-cell {
    // width: 580px;
    height: 614px;
    // margin-right: 50px;
    // margin-left: 50px;
    min-width: 580px;
    margin-top: 40px;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner {
    background: #35B53F;
    border-color: #35B53F;
  }

  .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #35B53F;
  }

  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #35B53F;
  }

  .el-checkbox__inner {
    background-color: #D8D8D8;
  }

  .btn-wrap {
    margin: 60px 0;
    display: flex;
    justify-content: center;
  }

  .save-btn {
    font-size: 16px;
    padding: 14px 167px;
  }
}
</style>
