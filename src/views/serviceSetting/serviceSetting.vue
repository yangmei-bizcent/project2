<template>
  <div class="serviceSetting">
    <div class="helpContain">
      <div v-loading="loadingConfig" class="seviceChoose fontsize0 color-666">
        <p>
          <span class="fontsize2 color-333 bold marginright10">号源数据设置</span>单选
        </p>
        <div class="dataChoose">
          <template v-for="(item, index) in sourceNumData">
            <div v-if="item.displayType=='110'" class="dcOne" :key="'1'+index">
              <el-checkbox 
                class="color-333 same-radio" 
                v-model="item.componentValue"
                @change="sameRadioChange(item.componentKey)">{{ item.headDesc }}</el-checkbox>
              <p>{{ item.componentDesc }}</p>
            </div>
          </template>
          <div v-if="sourceNumData.length==0" class="textAlignCenter">暂无数据</div>
        </div>
        <p>
          <span class="fontsize2 color-333 bold marginright10">停诊设置</span>可多选
        </p>
        <div class="dataChoose">
          <template v-for="(item, index) in suspendData">
            <div class="dcOne" :key="'2'+index">
              <el-checkbox 
                v-model="item.componentValue"
                :label="item.headDesc"
                class="color-333"></el-checkbox>
              <p>{{ item.componentDesc }}</p>
            </div>
          </template>
          <div v-if="suspendData.length==0" class="textAlignCenter">暂无数据</div>
        </div>
        <el-button class="fontsize2" type="primary" @click="configSubmit">确认修改</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
import { 
    getUcUiFlowByPhIdAndUseTypeApi, 
    getViewUiconfigListApi, 
    updateUiconfigDetailsApi,
 } from '@/service/pageConfig.js'
export default {
  data() {
    return {
      flowId: '',
      // 示例数据
      // hospitalId: "52cd0571-0d88-4606-abe1-7bcf3969438d",
      allConfigData: [],
      sourceNumData: [],  // 号源数据设置
      suspendData: [],  // 停诊设置
      loadingConfig: true,
    }
  },
  computed: {
    ...mapState({}),
    ...mapGetters({
      token: 'token',
      userName: 'userName',
      phone: 'phone',
      platformHospitalId: 'platformHospitalId',
    }),
  },
  async created() {
    
  },
  async mounted() {
    let self = this;
    getUcUiFlowByPhIdAndUseTypeApi(self.platformHospitalId, 'appointment').then((res) => {
      if(res && res.hasOwnProperty('data')) {
        self.flowId = res.data.ucUiFlowId;
        // console.log('flowId：', res.data.ucUiFlowId);
        self.getViewUiconfigList();
      }
    });
  },
  methods: {
    // 数组排序比较
    compare(property){
        return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    },
    // 用checkbox改写的radio改变时
    sameRadioChange(comptKey) {
      let self = this;
      switch(comptKey) {
          case 'enableTestFlow':
              self.sourceNumData.forEach((item) => {
                  if(item.componentKey == 'interface' || item.componentKey == 'customSource') {
                      item.componentValue = false;
                  }
              });
              break;
          case 'interface':
              self.sourceNumData.forEach((item) => {
                  if(item.componentKey == 'enableTestFlow' || item.componentKey == 'customSource') {
                      item.componentValue = false;
                  }
              });
              break;
          case 'customSource':
              self.sourceNumData.forEach((item) => {
                  if(item.componentKey == 'enableTestFlow' || item.componentKey == 'interface') {
                      item.componentValue = false;
                  }
              });
              break;
      }
    },
    // 获取页面配置
    getViewUiconfigList() {
      let self = this;
      getViewUiconfigListApi(self.flowId, 'appointment').then((res) => {
          self.loadingConfig = false;
          if(res && res.hasOwnProperty('data')) { 
              //console.log('配置数据：', res.data);
              res.data.sort(self.compare('seq'));
              self.allConfigData = res.data.filter((item) => {
                  return item.componentKey !='1-2-1' && item.componentKey !='1-6-1' && item.componentKey !='1-7-4' && item.componentKey !='1-9-5' && item.componentKey !='1-12-1' 
              });
              //console.log('1', self.allConfigData);
              self.allConfigData.forEach((item) => {
                item.componentValue = item.componentValue=='0'?false:true;
              });
              self.sourceNumData = self.allConfigData.filter((item) => {
                  return item.seq < 100
              });
              self.suspendData = self.allConfigData.filter((item) => {
                  return item.seq > 99
              });
              //console.log('1', self.sourceNumData);
              //console.log('2', self.suspendData);
              
          }
      });
    },
    // 保存配置
    // 配置保存
    configSubmit() {
        let self = this;
        self.$confirm('是否确认应用当前配置?', {
            confirmButtonText: '确定',
            type: 'warning'
        }).then(() => {
            self.loadingConfig = true;
            let confirmData = JSON.parse(JSON.stringify(self.allConfigData));
            confirmData.forEach((item) => {
              item.componentValue = item.componentValue==false?'0':'1';
            });
           // console.log('提交前数据：', confirmData);
            updateUiconfigDetailsApi(
                'appointment', 
                self.flowId, 
                self.platformHospitalId, 
                self.phone,
                confirmData
            ).then((res) => {
                self.loadingConfig = false;
                if(res && res.status == 200) {
                    self.$message({
                        type: 'success',
                        message: '配置保存成功'
                    });
                }
            });
        });
    },
  }
};
</script>

<style lang="scss" rel="stylesheet/stylus">
@import "/serviceSetting.scss";
</style>
