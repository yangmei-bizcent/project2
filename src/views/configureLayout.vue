<template>
  <el-container class="page-container page-layout layout_minWidth">
    <el-header height="70px" class="layout-header width100 fixed flex-align-justifybetween">
      <div class="flex-align-justifystart">
        <img src="../assets/img/layout/rubikt-logo-white.png" alt="logo" class="marginleft40 layout-logo" style="cursor: pointer;">
        <el-tabs v-model="activeTopMenu" @tab-click="layoutHeaderTabClick" class="layout-header-tabs" v-show="tabShow">
          <el-tab-pane label="业务配置" name="service"></el-tab-pane>
          <el-tab-pane label="挂号流程配置" name="appointProcessConfig"></el-tab-pane>
          <el-tab-pane label="号源数据配置" name="numberSource"></el-tab-pane>
          <el-tab-pane label="挂号记录" name="registerHistory"></el-tab-pane>
          <el-tab-pane label="短信配置" name="message"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="flex-align-justifystart fontsize0 marginright87">
        <div class="flex-align-justifystart header-tag">
          <img src="../assets/img/person_icon.png" />
          <p class="moreLineEllipsis1 marginleft5">{{ platformHospitalName }}</p>
        </div>
        <div>{{ userName }}</div>
      </div>
    </el-header>
    <el-container class="margintop70">
      <el-aside width="310px" v-if="leftTabShow" class="paddingbottom50">
        <div style="width:250px;margin:0 auto;">
          <div class="paddingleft20 marginbottom7">
            <div class="left-menu-container-title">
              <span class="fontsize2 color-333 bold">业务配置</span>
            </div>
            <div class="title-bottom-line"></div>
          </div>
          <el-menu v-loading="menuLoading" v-if="hospList.length>0" active-text-color="#04730e" :default-active="$route.path"
            :default-openeds="activeArr" class="el-menu-vertical-demo bgcolor-f6f8f9">
            <el-submenu v-for="(hosItem, hosIndex) in hospList" :key="hosIndex" class="first-grade-menu" :index="`${hosIndex}`">
              <template slot="title">
                <i class="icon_tab icon-menu-file"></i>
                <span slot="title" class="menu-title-text">{{ hosItem.name }}</span>
              </template>
              <el-menu-item-group class="bgcolor-f6f8f9">
                <el-menu-item class="second-grade-menu" :index="`${hosIndex}-1`" @click.native.stop="todayOrder(hosItem.hospitalBranchId)"><span
                    slot="title" class="menu-title-text">今日排班</span></el-menu-item>
                <el-menu-item class="second-grade-menu" :index="`${hosIndex}-2`" @click.native.stop="docManage(hosItem.hospitalBranchId)"><span
                    slot="title" class="menu-title-text">医生管理</span></el-menu-item>
                <el-menu-item class="second-grade-menu" :index="`${hosIndex}-3`" @click.native.stop="deptManage(hosItem.hospitalBranchId)"><span
                    slot="title" class="menu-title-text">科室管理</span></el-menu-item>
                <el-menu-item class="second-grade-menu" :index="`${hosIndex}-4`" @click.native.stop="orderSetting(hosItem.hospitalBranchId)"><span
                    slot="title" class="menu-title-text">排班设置</span></el-menu-item>
                <el-menu-item class="second-grade-menu" :index="`${hosIndex}-5`" @click.native.stop="stopOrderManage(hosItem.hospitalBranchId)"><span
                    slot="title" class="menu-title-text">停诊管理</span></el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </div>
      </el-aside>
      <el-main class="index-main" :class="{ 'special-main': $route.name === 'smsConfig' ? true : false }">
        <!-- <header class="layout-page-title fontsize10 color-333">
          页面标题
        </header> -->
        <section class="layout-page-content" style="height:100%;">
          <router-view :key="key"></router-view>
        </section>
      </el-main>
    </el-container>
    <!-- FOOTER -->
    <indexFooter style="padding:60px 0 20px;"></indexFooter>
  </el-container>
</template>
<script>
  import {
    axiosget,
    axiospost,
    aixospatch
  } from "../service/config.js"
  import {
    mapGetters,
    mapState,
    mapActions
  } from 'vuex'
  import indexFooter from '../components/indexFooter'
  export default {
    inject: ['reload'],
    data() {
      return {
        leftTabShow: false,
        hospList: [],
        activeTopMenu: 'service',
        tabShow: true, //顶部导航是否显示
        menuLoading: true,
        activeArr: ['0'],
        leftMenuData: [], // 左侧菜单数据
        preActiveToolRef: '', //上一个打开的工具框，新增科室、删除的框
        departsDatas: [], //科室数据，一级二级
      }
    },
    computed: {
      ...mapState({}),
      ...mapGetters({
        token: 'token',
        platformHospitalId: 'platformHospitalId',
        currentDate: 'currentDate',
        hosAndDeparts: 'hosAndDeparts',
        platformHospitalName: 'platformHospitalName',
        userName: 'userName',
        hospitalBranchId: 'hospitalBranchId'
      }),
      //解决路由query变化数据不刷新的问题
      key() {
        return this.$route.name !== undefined ? this.$route.name + new Date() : this.$route + new Date()
      }
    },
    components: {
      indexFooter,
    },
    created() {
      this.activeTopMenu = this.setTab(this.$router.history.current.name); //控制顶部导航样式状态
      this.userInfo = this.$store.getters.chooseOrgInfo;
      axiosget(
        `/application/branch/admin/getSimpleHospitalBranchByHospitalId?platformHospitalId=${this.platformHospitalId}`
      ).then(
        res => {
          this.hospList = res.data;
          this.menuLoading = false;
          this.set_hospitalBranchId(res.data[0].hospitalBranchId)
          //console.log('aaaaa', this.hospitalBranchId);
          //console.log(res.data[0].hospitalBranchId)
        })
      // 获取左侧菜单院区列表
      this.leftPathRouter(this.$route);
    },
    watch: {
      $route(to, from) {
        this.leftPathRouter(to);
      }
    },
    async mounted() {},
    methods: {
      ...mapActions(['set_hospitalBranchId']),
      layoutHeaderTabClick(tab, event) {
        let tabArr = ['service', 'numberSource', 'appointProcessConfig', 'registerHistory', 'message'];
        let tabLink = ['serviceSetting', 'numberSourceSetting', 'appointProcessConfig', 'registrationRecord',
          'smsConfig'
        ];
        if (tab.name == 'service' || tab.name == 'numberSource' || tab.name == 'appointProcessConfig' || tab.name ==
          'registerHistory' || tab.name == 'message') {
          tabArr.forEach((value, index) => {
            if (value == tab.name) {
              this.$router.push({
                name: tabLink[index]
              });
            }
          })
        } else {
          this.$notify.info({
            title: '消息',
            message: '此页面正在飞速搭建中，如有疑问请联系在线客服'
          });
        }
      },
      leftPathRouter(to) { //是否显示左边菜单
        //需要显示arrPath
        let arrPath = ['numberSourceSetting', 'deptManage', 'deptDocManage', 'doctorManage', 'depOfSchedule',
          'scheduleConfig', 'suspendManage'
        ];
        this.leftTabShow = false;
        arrPath.filter((item) => {
          if (item == to.name) {
            if (to.params.type != 1) { //某些页面需要有菜单有些不需要，根据路由来判断，1代表不需要菜单。
              return this.leftTabShow = true;
            }
          }
        })
      },
      todayOrder(id) {
        this.$router.push({
          path: '/numberSourceSetting',
          query: {
            branchId: id
          }
        })
      },
      docManage(id) {
        this.$router.push({
          path: '/doctorManage',
          query: {
            branchId: id
          }
        })
      },
      deptManage(id) {
        this.$router.push({
          path: '/deptManage',
          query: {
            branchId: id
          }
        })
      },
      orderSetting(id) {
        this.$router.push({
          path: '/depOfSchedule',
          query: {
            branchId: id
          }
        })
      },
      stopOrderManage(id) {
        this.$router.push({
          path: '/suspendManage',
          query: {
            branchId: id
          }
        })
      }
    },
  }

</script>
<style lang="scss">
  @import '@/assets/css/var.scss';

  .el-container .layout-header-tabs .el-tabs__active-bar {
    height: 4px;
    border-radius: 4px;
    background-color: #fff;
  }

  // 页面内容区上方的标题
  .page-title {
    font-size: 14px;
    color: #666;
    height: 59px;
    line-height: 59px;
    background-color: $color-f6f8f9;
    margin-top: -7px;
  }

  .el-menu-item:focus,
  .el-menu-item:hover {
    background: transparent;

    .menu-title-text {
      color: #368F3E;
    }
  }

  .el-submenu__title:hover {
    background: transparent;

    .menu-title-text {
      color: #368F3E;
    }
  }

  .menu-title-text {
    color: #333;

    &.paddingleft95 {
      padding-left: 95px !important;
    }
  }

  .el-menu {
    border: none;
  }

  li.el-dropdown-menu__item:hover {
    color: rgb(4, 115, 14) !important;
    background: rgb(230, 241, 231) !important;
  }

  .page-layout {
    .bgcolor-f6f8f9 {
      background: #f6f8f9;
    }

    .header-tag {
      max-width: 130px;
      border-radius: 100px;
      padding: 6px 16px;
      background: rgba(255, 255, 255, 0.12);
      margin-right: 12px;
    }

    .height31 {
      height: 31px;
      line-height: 31px;
    }

    .marginbottom7 {
      margin-bottom: 7px;
    }

    .left-menu-container-title {
      margin: 34px 0 20px 0;

      .left-menu-help {
        width: 12px;
        height: 12px;
        background: url('../assets/img/layout/left_menu_titile_icon.png') center no-repeat;
        background-size: contain;
        margin-left: 10px;
      }
    }

    .title-bottom-line {
      width: 108px;
      height: 0;
      border-bottom: 1px solid #e4e8eb;
    }

    .icon_tab {
      display: inline-block;
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }

    .icon-menu-file {
      background-image: url('../assets/img/layout/left_mainmenu_close_icon.png');
      background-size: contain;
      -webkit-transition: background-image .1s linear;
      transition: background-image .1s linear;
    }

    .is-opened {
      .icon-menu-file {
        background-image: url('../assets/img/layout/left_mainmenu_open_icon.png');
        background-size: contain;
        -webkit-transition: background-image .1s linear;
        transition: background-image .1s linear;
      }
    }

    .wrap-addmenu-icon {
      display: inline-block;
      width: 30px;
      position: relative;
      display: none;

      .wrap-addsec-tools {
        display: none;
      }
    }

    .el-icon-circle-plus-outline {
      font-size: 14px;
      color: #666;
    }

    .el-submenu__icon-arrow {
      display: none;
    }

    .el-menu-item-group {
      .el-icon-caret-right {
        font-size: 13px;
        color: #666;
        margin-right: 0;
        transform: rotate(0);
        -webkit-transform: rotate(0);
        -webkit-transition: -webkit-transform .15s linear;
        transition: transform .15s linear;
      }

      .is-opened {
        .el-icon-caret-right {
          transform: rotate(90deg);
          -webkit-transform: rotate(90deg);
          -webkit-transition: -webkit-transform .15s linear;
          transition: transform .15s linear;
        }
      }
    }

    .first-grade-menu {
      &.el-menu-item {
        height: 45px;
        line-height: 45px;

        &:hover {
          .wrap-addmenu-icon {
            display: inline-block;
          }
        }
      }

      &.el-submenu {
        &>.el-submenu__title {
          height: 45px;
          line-height: 45px;

          &:hover {
            .wrap-addmenu-icon {
              display: inline-block;
            }
          }
        }
      }
    }

    .second-grade-menu {
      &>.el-submenu__title {
        height: 41px;
        line-height: 41px;

        &:hover {
          .wrap-addmenu-icon {
            display: inline-block;
          }
        }
      }

      &.el-menu-item {
        height: 41px;
        line-height: 41px;

        &:hover {
          .wrap-addmenu-icon {
            display: inline-block;
          }
        }

        .wrap-addmenu-icon {
          bottom: 3px;
        }
      }
    }

    .three-grade-menu {
      &.el-menu-item {
        height: 31px;
        line-height: 31px;

        &:hover {
          .wrap-addmenu-icon {
            display: inline-block;
          }
        }

        .wrap-addmenu-icon {
          bottom: 3px;
        }
      }
    }

    .wrap-addsec-tools {
      width: 130px;
      height: 92px;
      top: 35px;
      left: 5px;
      z-index: 2000;
      display: none;

      .el-card__body {
        padding: 0;

        .el-button--text {
          color: #333;

          &:hover {
            color: $color-04730e;
          }
        }
      }
    }

    .special-main {
      overflow: visible;
    }
  }

</style>
