<template>
  <div class="feedback-config feedback">
    <el-breadcrumb class="page-title" separator="/">
      <el-breadcrumb-item :to="{ name: 'feedbackList', query: {
        platformHospitalId,
        token
      } }">反馈列表</el-breadcrumb-item>
      <el-breadcrumb-item>相关配置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="bgcolor-white paddingX20 padding20X">
      <section class="container-title">
        <div>
          <span class="main-title">相关配置</span>
        </div>
      </section>

      <section class="container-content">
        <el-form
          class="config-form"
          :model="configForm"
          ref="configForm"
          label-width="170px"
          :rules="rules">
          <el-form-item label="医院客服电话" prop="consumerHotline">
            <el-input v-model="configForm.consumerHotline" placeholder="请输入医院客服电话"></el-input>
            <span class="input-tip">用于接收用户电话反馈，若不填则界面不显示</span>
          </el-form-item>

          <el-form-item
            v-for="(item, index) of configForm.feedbackTypes"
            :key="index"
            :label="index === 0 ? '意见反馈类型' : ''"
            prop="feedbackTypes">
            <div class="align-center">
              <el-input
                v-model="configForm.feedbackTypes[index]"
                placeholder="请输入意见反馈类型"
                maxlength="6">
              </el-input>
              <span class="delete-btn span-btn" @click="deleteType(index)"></span>
              <span class="input-tip" v-if="index === 0">用户可选择的反馈类型，3-6个，6个字以内</span>
            </div>
          </el-form-item>

          <el-form-item>
            <div class="align-center">
              <span class="add-btn span-btn" @click="addType"></span>
            </div>
          </el-form-item>

          <el-form-item label="意见反馈输入框提示内容">
            <el-input
              v-model="configForm.promptMessage"
              placeholder="请输入意见反馈输入框提示内容"
              maxlength="15"></el-input>
            <span class="input-tip">输入框为空时的提示内容，15个字以内</span>
          </el-form-item>

          <el-form-item>
            <el-button @click="submitConfig" class="btn-2-letters" type="primary">提交</el-button>
            <el-button class="default-btn btn-2-letters" @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </section>
    </div>
  </div>
</template>

<script>
import { feedbackpost, feedbackget } from '@/service/feedback';
import { mapState } from 'vuex';
import { apiurl } from '@/service/api';

// const platformHospitalId = '37f7bdb2-6fcf-40dd-baf8-355868ba8702';

export default {
  data () {
    let phoneValidator = (rule, value, callback) => {
      let tel = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
      let phone = /^1[34578]\d{9}$/;
      if (!tel.test(value) && value.trim().length > 0) {
        if (!phone.test(value)) {
          callback(new Error('请输入有效的电话'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      configForm: {
        consumerHotline: '',
        feedbackTypes: [],
        promptMessage: ''
      },
      rules: {
        feedbackTypes: [
          { required: true }
        ],
        consumerHotline: [
          { validator: phoneValidator, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      platformHospitalId: state => state.base.platformHospitalId,
      token: state=> state.base.token
    })
  },
  async created () {
    await this.getFeedbackConfigInfo();
  },
  methods: {
    cancel () {
      this.$router.back();
    },
    //获取配置信息
    getFeedbackConfigInfo () {
      feedbackget(`${ apiurl.getFeedbackConfigInfo }?platformHospitalId=${ this.platformHospitalId }`).then(res => {
        this.configForm = Object.assign({}, res.data);
        this.configForm.consumerHotline = !res.data.consumerHotline ? '' : res.data.consumerHotline;
        this.configForm.promptMessage = res.data.promptMessage ? res.data.promptMessage : '请留下您的宝贵意见，非常感谢！';
      }).catch(err => {
        console.error(err);
      });
    },
    //新增类型
    addType () {
      if (this.configForm.feedbackTypes.length === 6) {
        this.$message.error('最多设置6项');
        return;
      }
      this.configForm.feedbackTypes.push('');
    },
    //删除类型
    deleteType (index) {
      if (this.configForm.feedbackTypes.length <= 3) {
        this.$message.error('最少设置3项');
        return;
      }
      this.configForm.feedbackTypes.splice(index, 1);
    },
    //提交
    submitConfig () {
      let temp = this.configForm.feedbackTypes.filter(item => {
        return item.length > 0;
      });
      let length = temp.length;
      if (length < 3) {
        for (let i = 0; i < (3 - length); i++) {
          temp.push('');
        }
        this.configForm.feedbackTypes = temp;
        this.$message.error('最少设置3项');
        return;
      } else {
        this.configForm.feedbackTypes = temp;
      }
      this.$refs['configForm'].validateField('consumerHotline', (errorMessage) => {
        if (!errorMessage) {
          feedbackpost(apiurl.postFeedbackConfigInfo, this.configForm).then(res => {
            if (typeof res.data === 'string') {
              this.$message.success('提交成功');
            } else {
              this.$message.error('提交失败');
            }
          }).catch(err => {
            console.error(err);
          });
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.config-form {
  width: 810px;
  margin: 16px auto 0;
}
.input-tip {
  font-size: 12px;
  color: #999;
  letter-spacing: 0.2px;
  margin-left: 10px;
}
.span-btn {
  display: inline-block;
  cursor: pointer;
}
.delete-btn {
  width: 34px;
  height: 34px;
  background: url('~@/assets/img/feedback/delete.png') no-repeat center;
  margin-left: 20px;
}
.add-btn {
  width: 36px;
  height: 36px;
  background: url('~@/assets/img/feedback/add.png') no-repeat center;
}
</style>

<style lang="scss">
@import '~@/assets/css/general';
.feedback-config {
  .el-input {
    width: 340px;
  }
}
</style>
