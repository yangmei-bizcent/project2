<template>
    <div class="wrap-index-footer">
        <el-row type="flex" justify="center">
            <el-col :span="16">
                <!-- <div class="footer-top-line"></div> -->
            </el-col>
        </el-row>
        <footer>
            <div class="flex-align-justify-column fontsize0 color-a3a3a3 index-footer">
                <div class="flex-align-justify lineheight20">
                    <p>技术运营热线：400-848-1766</p>
                    <p class="marginleft60">服务时间：7*24h在线</p>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=3425578887&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:3425578887:51" alt="在线咨询" title="在线咨询"/></a>
                </div>
                <p class="margintop6 fontsize-2">Copyright © 2011-{{currentDate}}. 杭州卓健信息科技有限公司.浙B2-20110422-1</p>
            </div>
        </footer>
    </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'

export default {
    computed: {
      ...mapGetters(['currentDate']),
    },
    data() {
        return {

        }
    },
    async created() {
        // await this.$store.dispatch({type: 'currentDate'});
    }
}
</script>

<style lang="scss">
@import '@/assets/css/var.scss';
.wrap-index-footer {
    .margintop6 {
        margin-top: 6px;
    }
    .footer-top-line {
        margin: 0 40px;
        border-top: 1px solid $color-eaeaea;
    }
}
</style>


