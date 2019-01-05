<template>
    <div class="page-container page-visitRecord bgcolor-white">
        <pageTitleNoLeftmenu 
            :hasBottomLine="true" 
            :pageTitle="'就诊记录配置'">
        </pageTitleNoLeftmenu>
        <div v-loading="loadingConfig" class="flex-alignstart-justify paddingX20 padding20X paddingtop40">
            <el-form class="width-per50" label-position="right">
                <template v-for="(item, index) in visitRecordConfigData">
                    <el-form-item
                        v-if="item.displayType=='0' && item.componentKey!='#cancelOrder'" 
                        :key="index">
                        <el-checkbox 
                            v-model="item.componentValue" 
                            class="color-333">{{ (index+1)+'、'+  item.headDesc }}</el-checkbox>
                    </el-form-item>
                    <el-form-item
                        v-if="item.displayType=='0' && item.componentKey=='#cancelOrder'"
                        :key="index">
                        <el-checkbox 
                            v-model="item.componentValue" 
                            @change="surportCancelCheckboxChange(item.componentValue)"
                            class="color-333">{{ (index+1)+'、'+  item.headDesc }}</el-checkbox>
                    </el-form-item>
                    <el-form-item
                        v-if="item.displayType=='1'" 
                        :key="index">
                        <div class="marginbottom10 marginleft30">{{ (index+1)+'、'+ item.headDesc }}</div>
                        <el-input 
                            v-model="item.componentDesc"
                            type="textarea"
                            :rows="3"
                            maxlength="50"
                            placeholder="请输入内容">
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        :key="index" 
                        v-if="item.displayType=='120' && item.componentKey=='A' && ifSurportCancelOrder" 
                        class="marginbottom0 top-border-container">
                        <div class="marginbottom10 bold">{{ item.headDesc }}</div>
                        <el-radio-group v-model="item.componentValue">
                            <el-radio label="A">A.是，支付完成就不允许取消，未支付允许取消挂号</el-radio>
                            <br>
                            <el-radio label="B" class="margintop15">B.否，不管是否支付，都可以取消</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item
                        :key="index" 
                        v-if="item.displayType=='120' && item.componentKey=='E' && ifSurportCancelOrder" 
                        class="bottom-border-container">
                        <div class="marginbottom10 bold">{{ item.headDesc }}</div>
                        <div class="">
                            <el-checkbox 
                                class="color-333 same-radio" 
                                v-model="periodCancelTimeVal"
                                @change="cancelTimeSameRadioChange('period')">时段模式</el-checkbox>
                            <br>
                            <div 
                                v-show="periodCancelTimeVal" 
                                class="marginleft50 margintop15 marginbottom15">
                                <label>时间：</label>
                                <el-input-number 
                                    v-model="cancelTimeAllVal.value" 
                                    controls-position="right" 
                                    :min="-100" :max="100"></el-input-number>
                                <!-- <el-input 
                                    type="number"
                                    class="width100" 
                                    min="-100"
                                    max="100"
                                    v-model.trim="cancelTimeAllVal.value">
                                </el-input> -->
                                <br>
                                <el-radio-group v-model="cancelTimeAllVal.unit" class="margintop10">
                                    <el-radio label="mm">分钟</el-radio>
                                    <br>
                                    <el-radio label="hh" class="margintop15">小时</el-radio>
                                </el-radio-group>
                                <p class="margintop10">（-3小时表示最晚在就诊前3小时取消， 3小时表示最晚在就诊后3小时取消）</p>
                            </div>
                        </div>
                        <div class="">
                            <el-checkbox 
                                class="color-333 same-radio" 
                                v-model="timeCancelTimeVal"
                                @change="cancelTimeSameRadioChange('time')">时间点模式</el-checkbox>
                            <br>
                            <div 
                                v-show="timeCancelTimeVal"
                                class="marginleft50 margintop15 marginbottom15">
                                <label>T</label>
                                <el-input-number 
                                    v-model="cancelTimeAllVal.day" 
                                    controls-position="right" 
                                    :min="-10" :max="10"></el-input-number>
                                <!-- <el-input
                                    type="number" 
                                    class="width100" 
                                    v-model.trim="cancelTimeAllVal.day"
                                    min="-10"
                                    max="10"></el-input> -->
                                <label>天</label>
                                <el-input-number 
                                    v-model="cancelTimeAllVal.hour" 
                                    controls-position="right" 
                                    :min="0" :max="23"></el-input-number>
                                <!-- <el-input 
                                    type="number"
                                    class="width100" 
                                    v-model.trim="cancelTimeAllVal.hour"
                                    min="0"
                                    max="23"></el-input> -->
                                <label>时</label>
                                <el-input-number 
                                    v-model="cancelTimeAllVal.min" 
                                    controls-position="right" 
                                    :min="0" :max="59"></el-input-number>
                                <!-- <el-input 
                                    type="number"
                                    class="width100" 
                                    v-model.trim="cancelTimeAllVal.min"
                                    min="0"
                                    max="59"></el-input> -->
                                <label>分</label>
                                <br>
                                <p class="margintop10">（T-1&nbsp;12:30&nbsp;表示最晚在就诊前一天12点30分之前取消预约）&nbsp;ps:&nbsp;天数为负数，例如就诊前两天取消，填-2</p>
                            </div>
                        </div>
                    </el-form-item>
                </template>
                <div 
                    v-if="visitRecordConfigData.length==0" 
                    class="fontsize0 color-666 textAlignCenter marginbottom30">暂无数据</div>
                <el-form-item>
                    <el-button type="primary" class="margintop60 width120" @click="configSubmit">确认保存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import pageTitleNoLeftmenu from '../../components/pageTitleNoLeftmenu'
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
            periodCancelTimeVal: true,
            timeCancelTimeVal: false,
            ifSurportCancelOrder: false,    //支持取消预约挂号
            // 取消预约时间整体的componentDesc值
            cancelTimeAllVal: {
                unit: 'mm',
                value: 0,
                day: 0,
                hour: 0,
                min: 0,
            },
            visitRecordConfigData: [], // 报告单列表页面
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
        getUcUiFlowByPhIdAndUseTypeApi(self.platformHospitalId, 'record').then((res) => {
        // getUcUiFlowByPhIdAndUseTypeApi(self.hospitalId, 'record').then((res) => {
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
        // 取消预约时间窗，模式checkbox点击
        cancelTimeSameRadioChange(type) {
            let self = this;
            switch(type) {
                case 'period':
                    self.timeCancelTimeVal = false;
                    self.visitRecordConfigData.forEach((item, index) => {
                        if(item.componentKey == 'E') {
                            item.componentValue = 'period';
                        }
                    });
                    break;
                case 'time':
                    self.periodCancelTimeVal = false;
                    self.visitRecordConfigData.forEach((item, index) => {
                        if(item.componentKey == 'E') {
                            item.componentValue = 'time';
                        }
                    });
                    break;
            }
        },
        surportCancelCheckboxChange(comptVal) {
            this.ifSurportCancelOrder = comptVal?true:false;
        },
        // 获取页面配置
        getViewUiconfigList() {
            let self = this;
            getViewUiconfigListApi(self.flowId, 'record').then((res) => {
                self.loadingConfig = false;
                if(res && res.hasOwnProperty('data')) {
                    // console.log('配置数据11：', res.data);
                    res.data.sort(self.compare('seq'));
                    self.visitRecordConfigData  = res.data.filter((item) => {
                        return item.componentKey != 'enableTestFlow' && item.componentKey !='interface' && item.componentKey !='customSource'
                    });
                    self.visitRecordConfigData.forEach((item) => {
                        if(item.displayType == '0' || item.displayType == '110') {
                            item.componentValue = item.componentValue=='0'?false:true;
                        }
                        switch(item.componentKey) {
                            case 'E':
                                let val = JSON.parse(item.componentDesc);
                                self.cancelTimeAllVal.unit = val.unit;
                                self.cancelTimeAllVal.value = parseInt(val.value);
                                self.cancelTimeAllVal.day = parseInt(val.day);
                                self.cancelTimeAllVal.hour = parseInt(val.hour);
                                self.cancelTimeAllVal.min = parseInt(val.min);
                                //console.log('aaaaa', self.cancelTimeAllVal);
                                switch(item.componentValue) {
                                    case 'period':
                                        self.periodCancelTimeVal = true;
                                        self.timeCancelTimeVal = false;
                                        break;
                                    case 'time':
                                        self.periodCancelTimeVal = false;
                                        self.timeCancelTimeVal = true;
                                        break;
                                }
                                break;
                            case '#cancelOrder': // 支持取消预约挂号
                                self.ifSurportCancelOrder = item.componentValue?true:false;
                                break;
                        }
                    });
                    //console.log('1', self.visitRecordConfigData);
                }
            });
        },
        // 配置保存
        configSubmit() {
            let self = this;
            let cancelArr = self.visitRecordConfigData.filter((item, index) => {
                return item.displayType=='120' && item.componentKey=='A'
            });
            let cancelDlgArr = self.visitRecordConfigData.filter((item, index) => {
                return item.displayType=='120' && item.componentKey=='E'
            });
            if(self.ifSurportCancelOrder && (cancelArr[0].componentValue==0 || !cancelArr[0].componentValue || cancelArr[0].componentValue == '')) {
                self.$alert(`请选择“${cancelArr[0].headDesc}”`, '提示', );
                return false;
            }
            if(self.ifSurportCancelOrder && self.periodCancelTimeVal=='' && self.timeCancelTimeVal == '') {
                self.$alert(`请选择“${cancelDlgArr[0].headDesc}”`, '提示', );
                return false;
            }
            self.$confirm('是否确认应用当前配置?', {
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                self.loadingConfig = true;
                let confirmData = JSON.parse(JSON.stringify(self.visitRecordConfigData));
                confirmData.forEach((item) => {
                    if(item.displayType == '0' || item.displayType == '110') {
                        item.componentValue = item.componentValue==false?'0':'1';
                    }
                    if(item.displayType== '120' && item.componentKey == 'E') {
                        self.cancelTimeAllVal.day = !self.cancelTimeAllVal.day?0:self.cancelTimeAllVal.day;
                        self.cancelTimeAllVal.hour = !self.cancelTimeAllVal.hour?0:self.cancelTimeAllVal.hour;
                        self.cancelTimeAllVal.min = !self.cancelTimeAllVal.min?0:self.cancelTimeAllVal.min;
                        self.cancelTimeAllVal.value = !self.cancelTimeAllVal.value?0:self.cancelTimeAllVal.value;
                        item.componentDesc = JSON.stringify(self.cancelTimeAllVal);
                    }
                });
                //console.log('对象：', self.cancelTimeAllVal);
                
                // let arr = confirmData.filter((item, index) => {
                //     return item.componentKey == 'E'
                // });
               // console.log('提交前数据：', confirmData);
                updateUiconfigDetailsApi(
                    'record', 
                    self.flowId, 
                    self.platformHospitalId, 
                    self.phone,
                    confirmData
                ).then((res) => {
                    self.loadingConfig = false;
                    if(res && res.status == 200) {
                        self.$message({
                            type: 'success',
                            message: '就诊记录配置保存成功'
                        });
                    }
                }).catch((err) => {
                    self.loadingConfig = false;
                });
            });
        },
    },
}
</script>

<style lang="scss">
@import '@/assets/css/var.scss';
.page-visitRecord {
    width: 84%;
    min-width: 1200px;
    max-width: 1600px;
    margin: 30px auto;
    margin-bottom: 190px;
    background: #fff;
    .width-per50 {
        width: 50%;
    }
    .width100 {
        width: 100px;
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
    .top-border-container {
        border: 1px solid $color-cccccc;
        background: $color-fafafa;
        padding: 20px;
        border-bottom: 0;
    }
    .bottom-border-container {
        border: 1px solid $color-cccccc;
        background: $color-fafafa;
        padding: 20px;
        margin-bottom: 30px;
    }
    .el-input-number.is-controls-right .el-input-number__decrease, .el-input-number.is-controls-right .el-input-number__increase {
        line-height: 15px;
    }
    .el-input-number.is-controls-right .el-input-number__increase {
        top: 5px;
    }
    .el-input-number.is-controls-right .el-input-number__decrease {
        bottom: 5px;
    }
}
</style>


