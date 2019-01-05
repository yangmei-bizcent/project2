<template>
    <div class="page-container page-reportsearch bgcolor-white">
        <pageTitleNoLeftmenu 
            :hasBottomLine="true" 
            :pageTitle="'报告单查询配置'">
        </pageTitleNoLeftmenu>
        <div v-loading="loadingConfig" class="flex-alignstart-justify paddingX20 padding20X paddingtop40">
            <el-form class="width-per50" label-position="right">
                <div class="flex-align-justifystart">
                    <template v-for="(item, index) in selectTypeData">
                        <div
                            v-if="item.displayType=='110'" 
                            class="marginbottom40 marginright50"
                            :key="'0'+index">
                            <el-checkbox 
                                class="color-333 same-radio" 
                                v-model="item.componentValue"
                                @change="typeSameRadioChange(item.componentKey)">{{ item.headDesc }}</el-checkbox>
                        </div>
                    </template>
                </div>
                <h3 class="fontsize4 color-333 bold marginbottom15">选择就诊人页面配置</h3>
                <template v-for="(item, index) in selectPatientData">
                    <el-form-item
                        v-if="item.displayType=='1'" 
                        class="marginbottom40"
                        :key="'1'+index">
                        <div class="marginbottom10 marginleft30">{{ (index+1)+'、'+item.headDesc }}</div>
                        <el-input 
                            v-model="item.componentDesc"
                            type="textarea"
                            :rows="3"
                            maxlength="50"
                            placeholder="请输入内容">
                        </el-input>
                    </el-form-item>
                </template>
                <div 
                    v-if="selectPatientData.length==0" 
                    class="fontsize0 color-666 textAlignCenter marginbottom30">暂无数据</div>
                <h3 class="fontsize4 color-333 bold marginbottom15">单张报告查询配置项</h3>
                <template v-for="(item, index) in oneReportSearchConfigData">
                    <el-form-item
                        v-if="item.displayType=='1'" 
                        class="marginbottom40"
                        :key="'2'+index">
                        <div class="marginbottom10 marginleft30">{{ (selectPatientData.length+index+1)+'、'+ item.headDesc }}</div>
                        <el-input 
                            v-model="item.componentDesc"
                            type="textarea"
                            :rows="3"
                            maxlength="50"
                            placeholder="请输入内容">
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        v-if="item.displayType=='0'" 
                        class="marginbottom30"
                        :key="'2'+index">
                        <el-checkbox 
                            v-model="item.componentValue" 
                            class="color-333">{{ (selectPatientData.length+index+1)+'、'+  item.headDesc }}</el-checkbox>
                    </el-form-item>
                </template>
                <div 
                    v-if="oneReportSearchConfigData.length==0" 
                    class="fontsize0 color-666 textAlignCenter marginbottom30">暂无数据</div>
                <h3 class="fontsize4 color-333 bold marginbottom15 margintop40">报告单列表页面</h3>
                <template v-for="(item, index) in reportListData">
                    <el-form-item
                        v-if="item.displayType=='110'" 
                        class="marginbottom10"
                        :class="item.componentKey=='typeRadio'?'margintop30':''"
                        :key="'3'+index">
                        <el-checkbox 
                            class="color-333 same-radio" 
                            v-model="item.componentValue"
                            @change="sameRadioChange(item.componentKey)">{{ item.headDesc }}</el-checkbox>
                    </el-form-item>
                    <span
                        v-if="item.displayType=='0'"
                        class="marginleft28"
                        :key="'3'+index">
                        <el-checkbox 
                            v-if="item.formKey=='reportList'"
                            class="color-333" 
                            v-model="item.componentValue"
                            @change="reportListCheckChange(item.formKey, item.componentValue)"
                            :disabled="item.componentKey=='7300' || (timeCheckLen==4 && item.componentValue==false)">{{ item.headDesc }}</el-checkbox>
                        <el-checkbox 
                            v-if="item.formKey=='reportType'"
                            class="color-333" 
                            v-model="item.componentValue"
                            @change="reportListCheckChange(item.formKey, item.componentValue)"
                            :disabled="item.componentKey=='0' || (typeCheckLen==4 && item.componentValue==false)">{{ item.headDesc }}</el-checkbox>
                    </span>
                </template>
                <div 
                    v-if="reportListData.length==0" 
                    class="fontsize0 color-666 textAlignCenter marginbottom30">暂无数据</div>
                <el-form-item>
                    <el-button type="primary" class="margintop60 width120" @click="configSubmit">确认保存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import pageTitleNoLeftmenu from '../components/pageTitleNoLeftmenu'
import {mapState, mapGetters} from 'vuex'
import { 
    getUcUiFlowByPhIdAndUseTypeApi, 
    getViewUiconfigListApi, 
    updateUiconfigDetailsApi,
 } from '@/service/pageConfig.js'
export default {
    data() {
        return {
            loadingConfig: true,
            flowId: '',
            // 示例数据
            // hospitalId: 'eba33ee3-dedc-4bb9-8805-ca86b15eea75',
            allConfigData: [],
            selectTypeData: [], //数据类型
            selectPatientData: [],  // 选就诊人页面配置项
            oneReportSearchConfigData: [],  // 单张报告查询配置项
            reportListData: [], // 报告单列表页面
            timeCheckLen: 1,    //报告单列表按时间分类的checkbox选中个数
            typeCheckLen: 1,    //报告单列表按报告类型分类的checkbox选中个数
        }
    },
    components: {
        pageTitleNoLeftmenu,
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
    mounted() {
        let self = this;
        getUcUiFlowByPhIdAndUseTypeApi(self.platformHospitalId, 'report').then((res) => {
        // getUcUiFlowByPhIdAndUseTypeApi(self.hospitalId, 'report').then((res) => {
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
        reportListCheckChange(formKey, componentValue) {
            let self = this;
            switch(formKey) {
                case 'reportList':
                    if(componentValue==true) {
                        self.timeCheckLen = self.timeCheckLen + 1;
                    }
                    else {
                        self.timeCheckLen = self.timeCheckLen - 1;
                    }
                    break;
                case 'reportType':
                    if(componentValue==true) {
                        self.typeCheckLen = self.typeCheckLen + 1;
                    }
                    else {
                        self.typeCheckLen = self.typeCheckLen - 1;
                    }
                    break;
            }
        },
        // 获取页面配置
        getViewUiconfigList() {
            let self = this;
            getViewUiconfigListApi(self.flowId, 'report').then((res) => {
                self.loadingConfig = false;
                if(res && res.hasOwnProperty('data')) {
                   // console.log('配置数据11：', res.data);
                    res.data.sort(self.compare('seq'));
                    self.allConfigData = res.data;
                    self.allConfigData.forEach((item) => {
                        if(item.displayType == '0' || item.displayType == '110') {
                            item.componentValue = item.componentValue=='0'?false:true;
                        }
                    });
                    self.selectTypeData  = res.data.filter((item) => {
                        return item.seq < 100
                    });
                    self.selectPatientData = res.data.filter((item) => {
                        return item.seq > 99 && item.seq < 200
                    });
                    self.oneReportSearchConfigData = res.data.filter((item) => {
                        return item.seq > 199 && item.seq < 300
                    });
                    self.reportListData = res.data.filter((item) => {
                        return item.seq > 299
                    });
                    let timeCheckData = res.data.filter((item) => {
                        return item.formKey == 'reportList' && item.componentValue==true
                    });
                    self.timeCheckLen = timeCheckData.length;

                    let typeCheckData = res.data.filter((item) => {
                        return item.formKey == 'reportType' && item.componentValue==true
                    });
                    self.typeCheckLen = typeCheckData.length;

                    // console.log('1', self.selectPatientData);
                    // console.log('2', self.oneReportSearchConfigData);
                    // console.log('3', self.reportListData);
                    // console.log(self.typeCheckLen);
                    
                }
            });
        },
        sameRadioChange(comptKey) {
            let self = this;
            switch(comptKey) {
                case 'timeRadio':
                    self.reportListData.forEach((item) => {
                        if(item.componentKey == 'typeRadio') {
                            item.componentValue = false;
                        }
                    });
                    break;
                case 'typeRadio':
                    self.reportListData.forEach((item) => {
                        if(item.componentKey == 'timeRadio') {
                            item.componentValue = false;
                        }
                    });
                    break;
            }
        },
        // 数据类型切换
        typeSameRadioChange(comptKey) {
            let self = this;
            switch(comptKey) {
                case 'interface':
                    self.selectTypeData.forEach((item) => {
                        if(item.componentKey == 'enableTestFlow') {
                            item.componentValue = false;
                        }
                    });
                    break;
                case 'enableTestFlow':
                    self.selectTypeData.forEach((item) => {
                        if(item.componentKey == 'interface') {
                            item.componentValue = false;
                        }
                    });
                    break;
            }
        },
        // 配置保存
        configSubmit() {
            let self = this;
            let timeRadioVal = self.allConfigData.filter((item, index) => {
                return item.componentKey == 'timeRadio'
            })
            let typeRadioVal = self.allConfigData.filter((item, index) => {
                return item.componentKey == 'typeRadio'
            })
            if(timeRadioVal.length > 0 && typeRadioVal.length > 0) {
                if(!timeRadioVal[0].componentValue && !typeRadioVal[0].componentValue) {
                    self.$alert('请选择报告单列表类型', '提示');
                    return false;
                }
            }
            self.$confirm('是否确认应用当前配置?', {
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                self.loadingConfig = true;
                let confirmData = JSON.parse(JSON.stringify(self.allConfigData));
                confirmData.forEach((item) => {
                    if(item.displayType == '0' || item.displayType == '110') {
                        item.componentValue = item.componentValue==false?'0':'1';
                    }
                });
               // console.log('提交前数据：', confirmData);
                updateUiconfigDetailsApi(
                    'report', 
                    self.flowId, 
                    self.platformHospitalId, 
                    self.phone,
                    confirmData
                ).then((res) => {
                    self.loadingConfig = false;
                    if(res && res.status == 200) {
                        self.$message({
                            type: 'success',
                            message: '报告单查询配置保存成功'
                        });
                    }
                });
            });
        },
    },
}
</script>

<style lang="scss">
.page-reportsearch {
    width: 84%;
    min-width: 1200px;
    max-width: 1600px;
    margin: 30px auto;
    margin-bottom: 190px;
    background: #fff;
    .width-per50 {
        width: 50%;
    }
    .width120 {
        width: 120px;
    }
    .marginleft28 {
        margin-left: 28px;
    }
    .el-textarea__inner {
        color: #333;
        resize: none;
    }
}
</style>


