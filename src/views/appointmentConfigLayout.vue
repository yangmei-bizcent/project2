<template>
  <div class="sms-config sms">
    <el-button type="primary" @click="goSmsConfig">to smsConfig</el-button>
    <router-view></router-view>
  </div>
</template>
<script>
  import {mapGetters, mapState, mapActions} from 'vuex'
  import indexFooter from '../components/indexFooter'

  export default {
    data() {
      return {

      }
    },
    computed: {},
    components: {},
    created() {
    },
    async mounted() {
    },
    methods: {
      goSmsConfig() {
        let self = this;
        self.$router.push({
          path: '/smsConfig'
        })
      }
    }
  }
</script>
