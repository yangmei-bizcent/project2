<template>
  <el-container class="page-container page-layout layout_minWidth">
    <el-header height="70px" class="layout-header width100 fixed flex-align-justifybetween">
      <div class="flex-align-justifystart">
        <img src="../assets/img/layout/rubikt-logo-white.png" alt="logo" class="marginleft40 layout-logo" style="cursor: pointer;">
      </div>
    </el-header>
    <el-container class="margintop70">
      <el-aside width="310px" class="paddingbottom50">
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
            v-loading="loading"
            v-if="leftMenuData.length>0"
            active-text-color="#04730e" 
            :default-active="$route.path" 
            :default-openeds="activeArr"
            class="el-menu-vertical-demo bgcolor-f6f8f9">
            <template v-for="(hosItem, hosIndex) in leftMenuData">
              <el-menu-item 
                :key="hosIndex"
                v-if="!hosItem.departsArr"
                :index="`${hosIndex}`"
                @click.native.stop="menuClick('0', hosItem.hospitalBranchId, '0', '0')"
                class="first-grade-menu">
                <i class="icon_tab icon-menu-file"></i>
                <span class="menu-title-text">111{{ hosItem.name }}</span>
                <div class="wrap-addmenu-icon" @click="showAddSectionTools">
                  <i class="el-icon-circle-plus-outline"></i>
                  <div class="wrap-addsec-tools absolute">
                    <el-card class="box-card">
                        <el-button type="text" class="fontsize-2">新增一级科室</el-button>
                        <br>
                        <el-button type="text" class="fontsize-2">新增二级科室</el-button>
                    </el-card>
                  </div>
                </div>
              </el-menu-item>
              <el-submenu 
                :key="hosIndex"
                v-else
                class="first-grade-menu" 
                :index="`${hosIndex}`"
                @click.native.stop="menuClick('0', hosItem.hospitalBranchId, '0', '0')">
                <template slot="title">
                  <i class="icon_tab icon-menu-file"></i>
                  <span slot="title" class="menu-title-text">222{{ hosItem.name }}</span>
                  <div class="wrap-addmenu-icon">
                    <i class="el-icon-circle-plus-outline"></i>
                  </div>
                </template>
                <el-menu-item-group class="bgcolor-f6f8f9">
                  <template v-for="(departItem, departIndex) in hosItem.departsArr">
                    <el-submenu 
                      :key="departIndex"
                      v-if="departItem.childListLen>0"
                      class="second-grade-menu"
                      :index="`${hosIndex}-${departIndex}`"
                      @click.native.stop="menuClick('1', hosItem.hospitalBranchId, departItem.id, '0')">
                      <template slot="title">
                        <i class="el-icon-caret-right"></i>
                        <span slot="title" class="menu-title-text">{{ departItem.name }}</span>
                        <div class="wrap-addmenu-icon">
                          <i class="el-icon-circle-plus-outline"></i>
                        </div>
                      </template>
                      <el-menu-item-group v-if="departItem.childList && departItem.childList.length>0" class="bgcolor-f6f8f9">
                        <el-menu-item 
                          v-for="(childItem, childIndex) in departItem.childList"
                          :key="childIndex"
                          :index="`${hosIndex}-${departIndex}-${childIndex}`"
                          @click.native.stop="menuClick('2', hosItem.hospitalBranchId, departItem.id, childItem.id)"
                          class="menu-title-text three-grade-menu paddingleft95">{{ childItem.name }}</el-menu-item>
                      </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item
                      :key="departIndex"
                      v-else 
                      :index="`${hosIndex}-${departIndex}`"
                      @click.native.stop="menuClick('1', hosItem.hospitalBranchId, departItem.id, '0')" 
                      class="menu-title-text second-grade-menu">
                      {{ departItem.name }}
                      <div class="wrap-addmenu-icon">
                        <i class="el-icon-circle-plus-outline"></i>
                      </div>
                    </el-menu-item>
                  </template>
                </el-menu-item-group>
              </el-submenu>
            </template>
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
import { mapGetters, mapState, mapActions } from 'vuex'
import indexFooter from '../components/indexFooter'
export default {
    data() {
      return {
        loading: true,
        // activeArr: ['2', '3', '4'],
        activeArr: ['0'],
        leftMenuData: [], // 左侧菜单数据
      }
    },
    computed: {
      ...mapState({}),
      ...mapGetters({
        token: 'token',
        platformHospitalId: 'platformHospitalId',
        hosAndDeparts: 'hosAndDeparts'
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
      // 获取左侧菜单院区列表
      // this.leftPathRouter(this.$route);
    },
    async mounted() {
      await this.getSimpleHospitals();
      
    },
    methods: {
      ...mapActions(['set_hosAndDeparts']),
      
      // 数组排序比较
      compare(property){
          return function(a,b){
              var value1 = a[property];
              var value2 = b[property];
              return value2 - value1;
          }
      },
      menuClick(fromType, branchId, departId, secondDepartId) {
        this.$router.push({
          path: '/doctortList',
          query: {
            fromType: fromType,
            branchId: branchId,
            departId: departId,
            secondDepartId: secondDepartId
          }
        });
      },
      // 获取左侧菜单数据，医院、一级科室、二级科室
      getSimpleHospitals() {
        let self = this;
        //console.log('机构ID：', self.platformHospitalId);
        self.$store.dispatch({
            type: 'getSimpleHospitalBranchByHospitalId',
            platformHospitalId: self.platformHospitalId,
        }).then((d) => {
          //console.log('获取的院区：', d.data);
            if(d && d.hasOwnProperty('data')) {
                
                self.leftMenuData = d.data;
                self.leftMenuData.sort(self.compare('seq'));
                self.leftMenuData.forEach((item, index) => {
                  self.getDepart(item.hospitalBranchId, index);
                });
                self.set_hosAndDeparts(self.leftMenuData);
                // console.log('菜单数据：', self.hosAndDeparts);
            }
        })
      },
      // 获取一级、二级科室
      getDepart(branchId, hosIndex) {
        let self = this;
        let departs = [];
        self.$store.dispatch({
            type: 'getDepart',
            branchId: branchId,
        }).then((d) => {
            self.loading = false;
            if(d && d.hasOwnProperty('data')) {
              // console.log('排序前科室：', d.data.facultyList);
              let departs = d.data.facultyList;
              
              if(departs.length > 1) {
               // console.log('科室：', departs);
                departs.sort(self.compare('seq'));    // 科室按照seq字段排序，越大越靠前
                departs.forEach((item, index) => {
                  item.childListLen = 0;
                  if(item.hasOwnProperty('childList')) {
                    if(item.childList.length > 1) {
                      item.childList.sort(self.compare('seq'));
                      item.childListLen = item.childList.length;
                    }
                  }
                });
              }
              self.leftMenuData.forEach((item, index) => {
                  if(index == hosIndex) {
                    item.departsArr = departs;  // 将院区数据和院区下的科室数据，合为一个整体
                    item.departsArrLen = departs.length;  //当前院区下一级科室个数
                  }
              });
            }
        });
      },
      openLink(path) {
        window.open(path);
      },
      // leftPathRouter(to) { //是否显示左边菜单
      //   //需要显示arrPath
      //   let arrPath = [
      //     'doctortList', 'departmentDetail', 'addDoctor'
      //   ];
      //   this.leftTabShow = false;
      //   arrPath.filter((item) => {
      //     if (item == to.name) {
      //       if (to.params.type != 1) { //某些页面需要有菜单有些不需要，根据路由来判断，1代表不需要菜单。
      //         return this.leftTabShow = true;
      //       }
      //     }
      //   })
      // },
      // 左侧菜单点击加号弹出‘添加一级/二级科室’菜单
      showAddSectionTools() {

      },
    },
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

  li.el-dropdown-menu__item:hover {
    color: rgb(4, 115, 14) !important;
    background: rgb(230, 241, 231) !important;
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
    .is-opened {
      .icon-menu-file {
        background-image: url('../assets/img/layout/left_mainmenu_open_icon.png');
        background-size: contain;
        -webkit-transition:background-image .1s linear;
        transition:background-image .1s linear;
      }
    }
    .wrap-addmenu-icon {
      display: inline-block;
      width: 30px;
      position: relative;
      // display: none;
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
          transform:rotate(0);
          -webkit-transform:rotate(0);
          -webkit-transition:-webkit-transform .15s linear;
          transition:transform .15s linear;
        }
      .is-opened {
        .el-icon-caret-right {
          transform:rotate(90deg);
          -webkit-transform:rotate(90deg); 
          -webkit-transition:-webkit-transform .15s linear;
          transition:transform .15s linear;
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
      }
    }
    .wrap-addsec-tools {
      width: 130px;
      height: 92px;
      top: 35px;
      left: 5px;
      z-index: 2000;
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
  }
</style>
