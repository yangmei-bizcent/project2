<template>
  <div class="feedback-detail feedback">
    <el-breadcrumb class="page-title" separator="/">
      <el-breadcrumb-item :to="{ name: 'feedbackList', query: {
        platformHospitalId,
        token
      } }">反馈列表</el-breadcrumb-item>
      <el-breadcrumb-item>查看</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="bgcolor-white paddingX20 padding20X">
      <section class="container-title">
        <div>
          <span class="main-title">反馈意见详情</span>
        </div>
      </section>

      <section class="container-content">
        <el-form
          :model="detailInfo"
          class="data-form"
          label-width="85px">
          <el-form-item label="意见类型">
            <p class="info-content">{{ detailInfo.problemType }}</p>
          </el-form-item>

          <el-form-item label="反馈内容">
            <div>
              <p class="info-content">{{ detailInfo.problem }}</p>
            </div>
          </el-form-item>

          <el-form-item label="相关图片">
            <p class="info-content" v-if="detailInfo.imageElements.length === 0">无</p>
            <span
              class="info-img-wrap info-img-item"
              v-for="(item, index) of detailInfo.imageElements"
              :key="index">
              <img :src="item.url" @mouseenter="showModal(index)">
              <span
                v-show="modalFlag === index"
                class="info-img-modal info-img-item"
                @mouseleave="hideModal"
                @click="viewBigImg(index)">
                <i class="el-icon-zoom-in"></i>
              </span>
            </span>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="btn-2-letters" @click="backList">确定</el-button>
          </el-form-item>
        </el-form>
      </section>

      <section class="container-footer">
        <div class="footer-wrap align-center">
          <div>
            <div class="footer-row">首次查看时间<span>{{ detailInfo.readDate }}</span></div>
            <div class="footer-row">医院名称<span>{{ detailInfo.campusName }}</span></div>
          </div>
          <div>
            <div class="footer-row">用户提交时间<span>{{ detailInfo.quizDate }}</span></div>
            <div class="footer-row">用户联系方式<span>{{ detailInfo.phone || detailInfo.email }}</span></div>
          </div>
        </div>
      </section>
    </div>

    <el-dialog title="查看大图" :visible.sync="imgVisible">
      <div class="big-img-wrap">
        <img class="big-img" :src="viewImgUrl"/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { feedbackpost, feedbackget } from '@/service/feedback';
import { mapState } from 'vuex';
import { apiurl } from '@/service/api';

// const platformHospitalId = '37f7bdb2-6fcf-40dd-baf8-355868ba8702';

export default {
  data () {
    return {
      feedbackId: null,
      detailInfo: {
        problemType: '',
        problem: '',
        imageElements: [],
        readDate: '',
        quizDate: '',
        campusName: '',
        phone: '',
        email: ''
      },
      modalFlag: -1,
      imgVisible: false,
      viewImgUrl: ''
    }
  },
  computed: {
    ...mapState({
      platformHospitalId: state => state.base.platformHospitalId,
      token: state=> state.base.token
    })
  },
  async created () {
    this.feedbackId = sessionStorage.getItem('feedbackId');
    if (!this.feedbackId) {
      this.$router.back();
    }
    await this.getFeedbackDetail();
  },
  methods: {
    //获取反馈详情信息
    getFeedbackDetail () {
      feedbackget(`${ apiurl.getFeedbackDetail }?platformHospitalId=${ this.platformHospitalId }&problemId=${ this.feedbackId }`).then(res => {
        this.detailInfo = res.data;
      }).catch(err => {
        console.error(err);
      });
    },
    showModal (index) {
      this.modalFlag = index;
    },
    hideModal () {
      this.modalFlag = -1;
    },
    viewBigImg (index) {
      this.viewImgUrl = this.detailInfo.imageElements[index].url;
      this.imgVisible = true;
    },
    backList () {
      this.$router.back();
    }
  }
}
</script>

<style lang="scss" scoped>
$container-inner-width: 600px;
.container-content {
  border-bottom: 1px solid #E6E6E6;
  margin-bottom: 20px;
}
.data-form {
  width: $container-inner-width;
  margin: 24px auto 0;
}
.info-content {
  line-height: 18px;
  font-size: 16px;
  color: #333;
  letter-spacing: 0;
}
.info-img-item {
  width: 110px;
  height: 110px;
}
.info-img-wrap {
  display: inline-block;
  position: relative;
  margin-right: 22px;
  img {
    width: 100%;
    height: 100%;
  }
}
.info-img-modal {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  i {
    color: #FFF;
    font-size: 20px;
  }
}
.footer-wrap {
  width: $container-inner-width;
  margin: 0 auto;
  justify-content: space-between;
  font-size: 16px;
  color: #999;
  letter-spacing: 0;
  margin-bottom: 48px;
  span {
    margin-left: 20px;
  }
}
.footer-row {
  margin: 20px 0;
}
.big-img-wrap {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 30px 20px;
}
.big-img {
  max-width: 100%;
}
</style>

<style lang="scss">
@import '~@/assets/css/general';
.feedback-detail {
  .el-form-item__label {
    font-size: 16px;
    color: #666;
    letter-spacing: 0;
    line-height: 18px;
    padding-right: 20px;
  }
}
</style>
