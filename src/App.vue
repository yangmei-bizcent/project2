<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  import '@/assets/css/global.scss'
  import '@/assets/css/theme.scss'
  import '@/assets/css/layout.scss'
  import '@/assets/css/common.scss'
  import { mapGetters, mapActions } from 'vuex'
  import axios from 'axios';
  import { apiurl } from '@/service/api';
  import {axiosConfig} from '@/service/config.js';
  export default {
    provide () {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        isRouterAlive: true,
      }
    },
    computed: {
      ...mapGetters({
        token: 'token',
        phone: 'phone',
        userName: 'userName',
        platformHospitalId: 'platformHospitalId',
        platformHospitalName: 'platformHospitalName',
        hosAndDeparts: 'hosAndDeparts',
        Jurisdiction:'Jurisdiction'
      })
    },
    created() {
      this.getParams();
    },
    async mounted() {
    },
    methods: {
      ...mapActions([
        'set_token', 
        'set_phone',
        'set_platformHospitalId', 
        'set_currentDate', 
        'set_hosAndDeparts',
        'set_userName',
        'set_platformHospitalName',
        'set_Jurisdiction',
        'set_moduleper'
      ]),
      reload() {
        this.isRouterAlive = false;
        this.$nextTick(() => {
          this.isRouterAlive = true;
        });
      },
      UrlSearch() {
        var name, value;
        var str = location.href; //取得整个地址栏
        var num = str.indexOf("?")
        str = str.substr(num + 1); //取得所有参数 stringvar.substr(start [, length ]

        var arr = str.split("&"); //各个参数放到数组里
        for(var i = 0; i < arr.length; i++) {
            num = arr[i].indexOf("=");
            if(num > 0) {
                name = arr[i].substring(0, num);
                value = arr[i].substr(num + 1);
                this[name] = value;
            }
        }
      },
      getFeatures(){//获取各模块权限
          axios.get(apiurl.getuserFeatures,axiosConfig).then((res)=>{
            if(res.data){
              this.set_moduleper(res.data);
            }
              // console.log('各模块权限',res)
          })
      },
      getParams() {
        let Request = new this.UrlSearch(); //实例化
        if(Request.token != undefined) {
          this.getFeatures();
          this.set_token(Request.token);
          this.set_phone(Request.phone)
          this.set_userName(decodeURI(Request.userName,"utf-8"));
          this.set_platformHospitalId(Request.platformHospitalId);
          this.set_platformHospitalName(decodeURI(Request.platformHospitalName,"utf-8"));
          this.set_currentDate(Request.currentDate);
          
        }
      },
    },
  }
</script>

<style lang="scss">
html,
  body {
    margin: 0px;
    font-family: 'PingFang SC','MicrosoftYaHei';
    font-size: 16px;
    user-select: none;
    background-color: #f6f8f9;
    * {
      box-sizing: border-box;
    }
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0px;
  }

  i {
    display: inline-block;
  }

  a {
    text-decoration: none;
  }

  ul,
  p {
    padding: 0;
    margin: 0;
  }

  ul li {
    list-style: none;
  }

  .el-tooltip__popper {
    max-width: 40%;
  }
</style>
