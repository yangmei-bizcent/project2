<template>
  <el-container class="page-container page-layout layout_minWidth">
    <el-header height="70px" class="layout-header width100 fixed flex-align-justifybetween">
      <div class="flex-align-justifystart">
        <img src="../assets/img/layout/rubikt-logo-white.png" alt="logo" class="marginleft40 layout-logo" style="cursor: pointer;">
      </div>
    </el-header>
    <el-container class="margintop70">
      <el-aside width="310px" class="paddingbottom50" v-if="ifShow">
        <div style="width:250px;margin:0 auto;">
          <div class="paddingleft20 marginbottom7">
            <div class="flex-align-justifystart left-menu-container-title">
              <span class="fontsize2 color-333 bold">医院科室管理</span>
              <el-tooltip class="item" effect="dark" content="若需修改院区，请到医院信息配置修改" placement="right">
                <i class="left-menu-help cursorPointer"></i>
              </el-tooltip>
            </div>
            <div class="title-bottom-line"></div>
          </div>
          <el-menu
            active-text-color="#04730e" 
            :default-active="$route.query.branchId"
            class="el-menu-vertical-demo bgcolor-f6f8f9">
              <el-menu-item 
                v-for="(hosItem, hosIndex) in departsArr"
                :key="hosIndex"
                :index="hosItem.hospitalBranchId"
                class="first-grade-menu"
                @click.native.stop="checkoutBranch(hosItem.hospitalBranchId)">
                <i class="icon_tab icon-menu-file"></i>
                <span class="menu-title-text">{{ hosItem.name }}</span>
              </el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      <el-main class="index-main">
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
import axios from 'axios';
import indexFooter from '@/components/indexFooter';
import { applicationget } from '@/service/application';
import { mapState } from 'vuex';

export default {
  data () {
    return {
      ifShow: false,
      showMenuRouteNameList: ['positionConfig', 'doctorManage', 'scheduleConfig'],
      departsArr: []
    }
  },
  computed: {
    ...mapState({
      platformHospitalId: state => state.base.platformHospitalId,
      token: state => state.base.token
    }),
    //解决路由query变化数据不刷新的问题
    key () {
      return this.$route.name !== undefined ? this.$route.name + new Date() : this.$route + new Date()
    }
  },
  async created () {
    this.menuShowControl(this.$route.name);
    await this.getHospitalList();
  },
  methods: {
    //获取院区列表
    getHospitalList () {
      applicationget(`branch/client/getSimpleHospitalBranchByHospitalId?platformHospitalId=${ this.platformHospitalId }`).then(res => {
        this.departsArr = res.data;
      }).catch(err => {
        console.error(err);
      });
    },
    //点击菜单项
    checkoutBranch (branchId) {
      this.$router.push({
        name: 'positionConfig',
        query: {
          platformHospitalId: this.platformHospitalId,
          token: this.token,
          branchId: branchId
        }
      });
    },
    //控制菜单显隐
    menuShowControl (routeName) {
      if (this.showMenuRouteNameList.includes(routeName)) {
        this.ifShow = true;
      } else {
        this.ifShow = false;
      }
    }
  },
  watch: {
    $route (val) {
      this.menuShowControl(val.name);
    }
  },
  components: { indexFooter }
}
</script>

<style lang="scss">
@import '@/assets/css/var.scss';

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

  .page-layout {
    .bgcolor-f6f8f9 {
      background: #f6f8f9;
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
      -webkit-transition:background-image .1s linear;
      transition:background-image .1s linear;
    }
    .el-menu-item.is-active {
      .icon-menu-file {
        background-image: url('../assets/img/layout/left_mainmenu_open_icon.png');
        background-size: contain;
        -webkit-transition:background-image .1s linear;
        transition:background-image .1s linear;
      }
    }
  }
</style>
