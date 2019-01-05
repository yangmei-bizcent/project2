<template>
    <div class="page-container page-appointconfig bgcolor-white">
        <pageTitleNoLeftmenu 
            :hasBottomLine="false" 
            :pageTitle="'挂号流程配置'">
        </pageTitleNoLeftmenu>
        <div class="flex-alignstart-justify-column relative width100 paddingX20 margin20X overflowXHidden">
            <!-- 更多流程 -->
            <transition>
                <div class="wrap-more-dlg color-333" :class="moreIsShow?'moreShow': 'hideShow'">
                    <div class="wrap-dlg-tool" @click="toggleMore">
                        <div class="tool-rrow" :class="{'openArrow': moreIsShow }"></div>
                        <div class="tool-arrow-text">更多流程</div>
                    </div>
                    <div class="textAlignCenter color-999 wrap-more-list">
                        <div class="flex-align-justify-column marginbottom20">
                            <p class="fontsize6 color-333">更多流程</p>
                            <div class="bottom-line"></div>
                        </div>
                        <template v-for="(item, index) in flowList">
                            <!-- 当前流程高亮 class设置wrap-active-more-item -->
                            <div 
                                :key="index"
                                :class="item.flowType==activeFlowType?'wrap-active-more-item':''"
                                class="floatLeft marginleft15 marginbottom10 flow-item">
                                <div class="relative">
                                    <!-- START 工具 -->
                                    <div  
                                        class="flex-align-justifyend-column absolute tool-bg-model">
                                        <div class="flex-align-justifybetween marginbottom10 fontsize-2 color-white">
                                            <div 
                                                class="cursorPointer text-underline"
                                                @click="previewFlowFn(item.flowType)">预览</div>
                                            <div 
                                                class="marginleft15 cursorPointer text-underline"
                                                @click="switchFlow(item.flowType)">应用</div>
                                        </div>
                                    </div>
                                    <!-- END 工具 -->
                                    <div class="flex-align-justify-column more-item">
                                        <i></i>
                                    </div>
                                    <p class="fontsize-2 margintop10">{{ item.flowName }}</p>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </transition>
            <div class="wrap-top-content width100">
                <table class="width100 minheight400" cellspacing="0" cellpadding="0">
                    <tr>
                        <td width="40%" class="border-right">
                            <div class="wrap-left-menu padding20X flex-align-justifystart-column height-per100">
                                <process 
                                    v-if="flow.length>0"
                                    :containerId="'processContainer'"
                                    :flow="flow"
                                    @nodeClick="nodeClick"></process>
                            </div>
                        </td>
                        <td>
                            <div v-loading="loadingConfig" class="wrap-right-content height-per100">
                                <div 
                                    :class="(activeType!='' && activeType!='1-2-1' && activeType!='1-7-4' && activeType!='1-6-1' && activeType!='1-9-3' && activeType!='1-9-5' && activeType!='1-12-1')?'':'displayNone'">
                                    <p class="textAlignCenter margintop100">此节点无需配置</p>
                                </div>
                                <div 
                                    :class="(activeType=='')?'':'displayNone'">
                                    <p class="textAlignCenter margintop100">点击左侧节点进行配置</p>
                                </div>
                                <!-- 预约挂号须知 -->
                                <div 
                                    :class="activeType=='1-2-1'?'':'displayNone'">
                                    <header class="width100 fontsize2 color-333 header-right">预约挂号须知</header>
                                    <el-form ref="form" label-width="24px">
                                        <template v-for="(item, index) in data_1_2_1">
                                            <el-form-item v-if="item.displayType=='1'" :key="'1'+index">
                                                <el-input 
                                                    type="textarea" 
                                                    rows="8"
                                                    class="width-per80"
                                                    v-model="item.componentDesc"
                                                    placeholder="请输入预约挂号须知"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-form>
                                </div>
                                <!-- 科室分两级 -->
                                <!-- <div class="displayNone">
                                    <header class="width100 fontsize2 color-333 marginbottom30 header-right">预约挂号类型配置</header>
                                    <el-form ref="form" label-width="24px">
                                        <el-form-item>
                                            <p class="marginbottom10">1、预约类型提示内容</p>
                                            <div id="appointTypeNoticeContainer" class="edit-container"></div>
                                        </el-form-item>
                                        <el-form-item>
                                            <p class="marginbottom10">2、可预约时间</p>
                                            <div class="flex-alignstart-justifystart marginbottom15">
                                                <p class="marginright20">上午</p>
                                                <el-time-picker
                                                    is-range
                                                    v-model="timeRange1"
                                                    @change="timeChange"
                                                    value-format="HH:mm:ss"
                                                    range-separator="至"
                                                    start-placeholder="起始时间"
                                                    end-placeholder="结束时间"
                                                    placeholder="选择时间范围">
                                                </el-time-picker>
                                            </div>
                                            <div class="flex-alignstart-justifystart">
                                                <p class="marginright20">下午</p>
                                                <el-time-picker
                                                    is-range
                                                    v-model="timeRange2"
                                                    range-separator="至"
                                                    start-placeholder="起始时间"
                                                    end-placeholder="结束时间"
                                                    placeholder="选择时间范围">
                                                </el-time-picker>
                                            </div>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" @click="confirmAppointTypeConfig">确定</el-button>
                                        </el-form-item>
                                    </el-form>
                                </div> -->
                                <!-- 选医生无头像版 -->
                                <div :class="activeType=='1-7-4'?'':'displayNone'">
                                    <header class="width100 fontsize2 color-333 marginbottom30 header-right">选医生配置页</header>
                                    <el-form ref="form" label-width="24px">
                                        <template v-for="(item, index) in data_1_7_4">
                                            <el-form-item v-if="item.displayType=='1'" :key="'2'+index">
                                                <p class="marginbottom10">{{ item.headDesc }}</p>
                                                <el-input
                                                    type="textarea" 
                                                    rows="5" 
                                                    class="width-per80"
                                                    maxlength="100"
                                                    v-model="item.componentDesc"
                                                    @keyup.native="textareaChange_1_7_4(item.componentDesc)"></el-input>
                                                <div class="fontsize0 color-999 width-per80 textAlignRight">{{ num_1_7_4 }}/100</div>
                                            </el-form-item>
                                        </template>
                                        <!-- <el-form-item>
                                            <el-button type="primary" @click="confirmConfig_1_7_4">确定</el-button>
                                        </el-form-item> -->
                                    </el-form>
                                </div>
                                <!-- 日期列表 -->
                                <div :class="activeType=='1-6-1'?'':'displayNone'">
                                    <header class="width100 fontsize2 color-333 marginbottom30 header-right">选日期配置</header>
                                    <el-form ref="form" label-width="24px">
                                        <template v-for="(item, index) in data_1_6_1">
                                            <el-form-item v-if="item.displayType=='0'" :key="'3'+index">
                                                <el-checkbox  
                                                    v-model="item.componentValue"
                                                    class="color-333">1、医生简介默认展开</el-checkbox>
                                            </el-form-item>
                                        </template>
                                        <!-- <el-form-item>
                                            <el-button type="primary" @click="confirmConfig_1_6_1">确定</el-button>
                                        </el-form-item> -->
                                    </el-form>
                                </div>
                                <!-- 线上强制支付+能添加就诊人 -->
                                <div :class="activeType=='1-9-3'?'':'displayNone'">
                                    <header class="width100 fontsize2 color-333 marginbottom30 header-right">挂号确认界面</header>
                                    <el-form ref="form" label-width="24px">
                                        <template v-for="(item, index) in data_1_9_3">
                                            <el-form-item 
                                                v-if="item.displayType=='1'"
                                                class="marginbottom0" 
                                                :key="'4'+index">
                                                <p class="marginbottom10">{{ item.headDesc }}</p>
                                                <el-input 
                                                    type="textarea" 
                                                    rows="5" 
                                                    class="width-per80"
                                                    maxlength="100"
                                                    v-model="item.componentDesc"
                                                    @keyup.native="textareaChange_1_9_3(item.componentDesc)"></el-input>
                                                <div class="fontsize0 color-999 width-per80 textAlignRight">{{ num_1_9_3 }}/100</div>
                                            </el-form-item>
                                            <el-form-item 
                                                v-if="item.displayType=='0'"
                                                class="marginbottom0" 
                                                :key="'5'+index">
                                                <el-checkbox  
                                                    v-model="item.componentValue"
                                                    class="color-333">{{ item.headDesc }}</el-checkbox>
                                            </el-form-item>
                                        </template>
                                        <!-- <el-form-item>
                                            <el-button type="primary" @click="confirmConfig_1_9_5">确定</el-button>
                                        </el-form-item> -->
                                    </el-form>
                                </div>
                                <!-- 预约结果线下支付+能添加就诊人 -->
                                <div :class="activeType=='1-9-5'?'':'displayNone'">
                                    <header class="width100 fontsize2 color-333 marginbottom30 header-right">挂号确认界面</header>
                                    <el-form ref="form" label-width="24px">
                                        <template v-for="(item, index) in data_1_9_5">
                                            <el-form-item 
                                                v-if="item.displayType=='1'"
                                                class="marginbottom0" 
                                                :key="'6'+index">
                                                <p class="marginbottom10">{{ item.headDesc }}</p>
                                                <el-input 
                                                    type="textarea" 
                                                    rows="5" 
                                                    class="width-per80"
                                                    maxlength="100"
                                                    v-model="item.componentDesc"
                                                    @keyup.native="textareaChange_1_9_5(item.componentDesc)"></el-input>
                                                <div class="fontsize0 color-999 width-per80 textAlignRight">{{ num_1_9_5 }}/100</div>
                                            </el-form-item>
                                            <el-form-item 
                                                v-if="item.displayType=='0'"
                                                class="marginbottom0" 
                                                :key="'7'+index">
                                                <el-checkbox  
                                                    v-model="item.componentValue"
                                                    class="color-333">{{ item.headDesc }}</el-checkbox>
                                            </el-form-item>
                                        </template>
                                        <!-- <el-form-item>
                                            <el-button type="primary" @click="confirmConfig_1_9_5">确定</el-button>
                                        </el-form-item> -->
                                    </el-form>
                                </div>
                                <!-- 线下支付+能添加就诊人 -->
                                <div :class="activeType=='1-12-1'?'':'displayNone'">
                                    <header class="width100 fontsize2 color-333 marginbottom30 header-right">预约结果配置</header>
                                    <el-form ref="form" label-width="24px">
                                        <template v-for="(item, index) in data_1_12_1">
                                            <el-form-item v-if="item.displayType=='1'" :key="'8'+index">
                                                <p class="marginbottom10">{{ item.headDesc }}</p>
                                                <el-input 
                                                    type="textarea"
                                                    rows="5"
                                                    class="width-per80"
                                                    maxlength="100" 
                                                    v-model="item.componentDesc"
                                                    @keyup.native="textareaChange_1_12_1(item.componentDesc)"></el-input>
                                                <div class="fontsize0 color-999 width-per80 textAlignRight">{{ num_1_12_1 }}/100</div>
                                            </el-form-item>
                                            <el-form-item v-if="item.displayType=='150'" :key="'9'+index">
                                                <p class="marginbottom10">{{ item.headDesc }}</p>
                                                <div 
                                                    v-for="(rItem, rIndex) in resultData" 
                                                    :key="rIndex"
                                                    class="flex-alignstart-justifystart marginbottom15">
                                                    <el-input 
                                                        v-model="rItem.key"
                                                        placeholder="key"
                                                        class="max-width182"></el-input>
                                                    <el-input 
                                                        v-model="rItem.value"
                                                        placeholder="value"
                                                        class="max-width182 marginleft10"></el-input>
                                                    <div 
                                                        @click="deleteResultItem(rIndex)"
                                                        class="wrap-delete-icon cursorPointer">
                                                        <i></i>
                                                    </div>
                                                </div>
                                                <div 
                                                    @click="addResultItem" 
                                                    class="wrap-add-icon cursorPointer margintop15">
                                                    <i></i>
                                                </div>
                                            </el-form-item> 
                                        </template>
                                        <!-- <el-form-item>
                                            <el-button type="primary" @click="confirmConfig_1_12_1">确定</el-button>
                                        </el-form-item> -->
                                    </el-form>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="wrap-bottom-tool width100">
                <el-button 
                    type="primary" 
                    plain 
                    @click="configSubmit">保存并应用配置</el-button>
            </div>
        </div>
        <div class="paddingtop20"></div>
        <!-- 预览流程弹出框 -->
        <el-dialog title="流程展示" class="dlg-header-bottom-line" :visible.sync="previewFlowDlgVisible" width="613px">
            <div v-loading="loadingPreviewConfig" class="marginbottom30">
                <process 
                    v-if="previewFlow.length>0"
                    :containerId="'previewProcessContainer'"
                    :flow="previewFlow"></process>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import pageTitleNoLeftmenu from '../../components/pageTitleNoLeftmenu'
import process from '../../components/process'
import Editor from 'wangeditor';
import { 
    getUcUiFlowByPhIdAndUseTypeApi, 
    getViewUiconfigListApi, 
    updateMultiPageUiConfigDetailApi,
    getRegFlowApi,
    switchRegFlowApi,
 } from '@/service/pageConfig.js'
export default {
    data() {
        return {
            loadingConfig: false,
            loadingPreviewConfig: false,
            saveLoading: false,
            flowId: '',
            // 示例数据
            hospitalId: "52cd0571-0d88-4606-abe1-7bcf3969438d",
            value: '',
            activeFlowType: '', // 当前流程
            previewFlowDlgVisible: false,   // 流程展示弹窗显示
            flowList: [],   // 流程列表
            allConfigData: [],
            resultData: [],
            activeType: '',    // 当前显示的表单编号
            // timeRange1: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
            // timeRange2: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],

            selectTypeData: [], //  数据类型
            data_1_2_1: [],
            data_1_7_4: [],
            data_1_6_1: [],
            data_1_9_3: [],
            data_1_9_5: [],
            data_1_12_1: [],

            num_1_7_4: 0,
            num_1_9_3: 0,
            num_1_9_5: 0,
            num_1_12_1: 0,
            
            moreIsShow: false,  //更多流程

            processData: [],
            // nodeDataArray: [ 
            //     // {key:"3", name: "二级节点2" },
            //     // {key:"4", name: "三级节点" },
            //     // {key:"1", name: "一级节点" },
            //     // {key:"2", name: "二级节点1" },
            //     // {key:"5", name: "四级节点" },
            //     // {key:"6", name: "五级节点" },
            //     // {key:"7", name: "六级节点" },
            // ],
            // linkDataArray: [
            //     // {from:"1",to:"2"},
            //     // {from:"1",to:"3"},
            //     // {from:"2",to:"4"},
            //     // {from:"5",to:"6"},
            //     // {from:"3",to:"6"},
            //     // {from:"4",to:"5"},
            //     // {from:"6",to:"7"},
            // ],
            flow: [],
            previewFlow: [],
            saveNodeArr: [],   // 以vId记录，比如F_1-2-1
        }
    },
    computed: {
      ...mapGetters({
        token: 'token',
        userName: 'userName',
        phone: 'phone',
        platformHospitalId: 'platformHospitalId',
      }),
    },
    components: {
        pageTitleNoLeftmenu,
        process,
    },
    mounted() {
        let self = this;
        self.getRegFlow();  // 获取流程列表
        self.getFowConfig();    // 获取流程配置
    },
    methods: {
        // 获取流程
        getFowConfig() {
            let self = this;
            self.flow = [];
            self.loadingConfig = true;
            getUcUiFlowByPhIdAndUseTypeApi(self.platformHospitalId, 'appointment').then((res) => {
                self.loadingConfig = false;
                if(res && res.hasOwnProperty('data')) {
                    self.flowId = res.data.ucUiFlowId;
                    self.activeFlowType = res.data.flowType;
                    //console.log('流程数据：', res.data);
                    self.flow = JSON.parse(res.data.definitionJSON);
                    if(self.flow.length > 0) {
                        self.setProcessComptData();
                        self.initFirstNodeForm();
                    }
                }
            });
        },
        // 获取右侧流程列表
        getRegFlow() {
            let self = this;
            getRegFlowApi('').then((res) => {
                if(res && res.hasOwnProperty('data')) {
                    res.data.sort(self.compare('seq'));
                    self.flowList = res.data;
                    //console.log('流程列表：', self.flowList);
                }
            });
        },
        // 切换流程
        switchFlow(flowType) {
            let self = this;
            self.$confirm('<i class="icon-switchflow-warn"></i><br><p class="fontsize0 color-333">应用流程后，<br>将会导致原有流程无法使用，确定操作？</p>', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true,
                center: true
            }).then(() => {
                self.loadingConfig = true;
                switchRegFlowApi(
                    self.platformHospitalId, 
                    self.phone, 
                    flowType
                ).then((res) => {
                    self.loadingConfig = false;
                    if(res && res.status==200) {
                        self.getFowConfig();    // 切换流程后，重新获取一遍流程配置数据
                        self.saveNodeArr = [];  // 清掉已保存配置数据类型
                        self.data_1_2_1 = [];
                        self.data_1_7_4 = [];
                        self.data_1_6_1 = [];
                        self.data_1_9_3 = [];
                        self.data_1_9_5 = [];
                        self.data_1_12_1 = [];
                        self.$message({
                            type: 'success',
                            message: '流程切换成功!'
                        });
                    }
                }).catch((err) => {
                    self.loadingConfig = false;
                });
            })
        },
        // 预览流程
        previewFlowFn(flowType) {
            let self = this;
            self.previewFlowDlgVisible = true;
            self.previewFlow = [];
            self.loadingPreviewConfig = true;
            getRegFlowApi(flowType).then((res) => {
                self.loadingPreviewConfig = false;
                if(res && res.hasOwnProperty('data')) {
                    //console.log('预览流程数据：', JSON.parse(res.data[0].definitionJSON));
                    self.previewFlow = JSON.parse(res.data[0].definitionJSON);
                }
            }).catch((err) => {
                self.loadingPreviewConfig = false;
            });
        },
        // 设置流程插件数据
        setProcessComptData() {
            let self = this;
            self.nodeDataArray = [];
            self.linkDataArray = [];
            self.processData.forEach((item, index) => {
                self.nodeDataArray.push({
                    key: item.id+'',
                    name: item.name,
                    vId: item.vId
                });
                if(item.connectors.length > 0) {
                    item.connectors.forEach((cItem, cIndex) => {
                        self.nodeDataArray[index]['on'+cIndex] = cItem.on;
                        self.linkDataArray.push({
                            from: item.id+'',
                            to: cItem.idOfTo,
                            fromPort:"R", 
                            toPort:"L"
                        });
                    });
                }
            });
            //console.log('设置流程逻辑数据1：', JSON.stringify(self.nodeDataArray));
           // console.log('设置流程逻辑数据2：', JSON.stringify(self.linkDataArray));
        },
        initFirstNodeForm() {
            let self = this;
            let firstNode = self.processData.filter((item, index) => {
                return item.startNode == true
            });
            if(self.flowId != '' && firstNode.length > 0) {
                if(firstNode[0].vId != 'F_1-1-1' && firstNode[0].vId != 'F_1-5-4' && firstNode[0].vId != 'F_1-8-1') {
                    self.getViewUiconfigList(firstNode[0].vId);
                }
                else {
                    self.loadingConfig = false;
                }
                // self.activeType = firstNode[0].vId.slice(2);
            }
        },
        // 节点点击事件
        nodeClick(payload) {
            let self = this;
            // console.log('点击返回的节点vId：', payload.vId);
            // 节点点击时，切换显示右侧对应表单
            self.showConfig(payload.vId, payload.vId.slice(2));
        },
        // 数组排序比较
        compare(property){
            return function(a,b){
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        },
        // 数据类型切换
        typeSameRadioChange(comptKey) {
            let self = this;
            switch(comptKey) {
                case 'interface':
                    self.selectTypeData.forEach((item) => {
                        if(item.componentKey == 'customSource' || item.componentKey == 'enableTestFlow') {
                            item.componentValue = false;
                        }
                    });
                    break;
                case 'customSource':
                    self.selectTypeData.forEach((item) => {
                        if(item.componentKey == 'interface' || item.componentKey == 'enableTestFlow') {
                            item.componentValue = false;
                        }
                    });
                    break;
                case 'enableTestFlow':
                    self.selectTypeData.forEach((item) => {
                        if(item.componentKey == 'interface' || item.componentKey == 'customSource') {
                            item.componentValue = false;
                        }
                    });
                    break;
            }
        },
        //限制textarea最多输入100 
        textareaChange_1_7_4(value) {
            // console.log('改变了');
            if(value.length <= 100) {
                this.num_1_7_4 = value.length;
            }else {
                this.data_1_7_4.forEach((item, index) => {
                    if(item.displayType=='1') {
                        item.componentDesc = value.slice(0, 100);
                        this.num_1_7_4 = 100;
                    }
                });
            }
        },
        //限制textarea最多输入100 
        textareaChange_1_9_3(value) {
            // console.log('改变了');
            if(value.length <= 100) {
                this.num_1_9_3 = value.length;
            }else {
                this.data_1_9_3.forEach((item, index) => {
                    if(item.displayType=='1') {
                        item.componentDesc = value.slice(0, 100);
                        this.num_1_9_3 = 100;
                    }
                });
            }
        },
        //限制textarea最多输入100 
        textareaChange_1_9_5(value) {
            // console.log('改变了');
            if(value.length <= 100) {
                this.num_1_9_5 = value.length;
            }else {
                this.data_1_9_5.forEach((item, index) => {
                    if(item.displayType=='1') {
                        item.componentDesc = value.slice(0, 100);
                        this.num_1_9_5 = 100;
                    }
                });
            }
        },
        //限制textarea最多输入100 
        textareaChange_1_12_1(value) {
            // console.log('改变了');
            if(value.length <= 100) {
                this.num_1_12_1 = value.length;
            }else {
                this.data_1_12_1.forEach((item, index) => {
                    if(item.displayType=='1') {
                        item.componentDesc = value.slice(0, 100);
                        this.num_1_12_1 = 100;
                    }
                });
            }
        },
        toggleMore() {
            this.moreIsShow = !this.moreIsShow;
        },
        // 新增预约结果提示
        addResultItem() {
            let self = this;
            self.resultData.push({
                key: '',
                value: '',
                $$hashKey: '',
            });
        },
        // 删除预约结果提示
        deleteResultItem(rIndex) {
            let self = this;
            self.resultData.splice(rIndex, 1);
        },
        // 点击左侧菜单，右侧显示相应的配置表单页面
        showConfig(vId, type) {
            let self = this;
            self.activeType = type;
            if(type != '1-1-1' && type != '1-5-4' && type != '1-8-1') {
                // 是否已记录节点
                let isHas = self.saveNodeArr.filter((item) => {
                    return item == vId
                });
                if(isHas.length > 0) {
                    // 是
                    // console.log('重复了', isHas);
                }
                else {
                    // 否
                    self.saveNodeArr.push(vId);
                    // console.log('已保存节点：', self.saveNodeArr);
                    self.getViewUiconfigList(vId);
                }
            }
        },
        // 获取页面配置
        getViewUiconfigList(stepId) {
            let self = this;
            getViewUiconfigListApi(self.flowId, stepId).then((res) => {
                self.loadingConfig = false;
                if(res && res.hasOwnProperty('data')) {
                    res.data.sort(self.compare('seq'));
                    // console.log('1111', self.allConfigData);
                    res.data.forEach((item) => {
                        switch(item.displayType) {
                            case '0':
                                item.componentValue = item.componentValue=='0'?false:true;
                                break;
                            case '1':
                                switch(stepId) {
                                    case 'F_1-7-4':
                                        self.num_1_7_4 = item.componentDesc.length;
                                        break;
                                    case 'F_1-9-3':
                                        self.num_1_9_3 = item.componentDesc.length;
                                        break;
                                    case 'F_1-9-5':
                                        self.num_1_9_5 = item.componentDesc.length;
                                        break;
                                    case 'F_1-12-1':
                                        self.num_1_12_1 = item.componentDesc.length;
                                        break;
                                }
                                break;
                            case '110':
                                item.componentValue = item.componentValue=='0'?false:true;
                                break;
                            case '150':
                                if(item.componentDesc != '') {
                                    self.resultData = JSON.parse(item.componentDesc);
                                }else {
                                    self.resultData = [{key:"",value:"",$$hashKey:"object:167"}];
                                }
                                break;
                        }
                    });
                    switch(stepId) {
                        case 'F_1-2-1': 
                            self.data_1_2_1 = res.data;
                            //console.log('1', self.data_1_2_1);
                            break;
                        case 'F_1-7-4': 
                            self.data_1_7_4 = res.data;
                            //console.log('2', self.data_1_7_4);
                            break;
                        case 'F_1-6-1': 
                            self.data_1_6_1 = res.data;
                            //console.log('3', self.data_1_6_1);
                            break;
                        case 'F_1-9-3': 
                            self.data_1_9_3 = res.data;
                             //console.log('4', self.data_1_9_3);
                            break;
                        case 'F_1-9-5': 
                            self.data_1_9_5 = res.data;
                             //console.log('4', self.data_1_9_5);
                            break;
                        case 'F_1-12-1': 
                            self.data_1_12_1 = res.data;
                            //console.log('5', self.data_1_12_1);
                            break;
                    }
                }
            }).catch((err) => {
                self.loadingConfig = false;
            });
        },
        // 保存配置
        configSubmit() {
            let self = this;
            self.$confirm('是否确认应用当前配置?', {
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                self.loadingConfig = true;
                self.saveLoading = true;
                self.allConfigData = [];
                self.saveNodeArr.map((ele) => {
                    //console.log(ele);
                    switch(ele) {
                        case 'F_1-2-1': 
                            self.allConfigData.push({
                                stepId: ele,
                                tuiConfigDetails: self.data_1_2_1
                            });
                            break;
                        case 'F_1-7-4': 
                            self.allConfigData.push({
                                stepId: ele,
                                tuiConfigDetails: self.data_1_7_4
                            });
                            break;
                        case 'F_1-6-1': 
                            self.allConfigData.push({
                                stepId: ele,
                                tuiConfigDetails: self.data_1_6_1
                            });
                            break;
                        case 'F_1-9-3': 
                            self.allConfigData.push({
                                stepId: ele,
                                tuiConfigDetails: self.data_1_9_3
                            });
                            break;
                        case 'F_1-9-5': 
                            self.allConfigData.push({
                                stepId: ele,
                                tuiConfigDetails: self.data_1_9_5
                            });
                            break;
                        case 'F_1-12-1': 
                            self.allConfigData.push({
                                stepId: ele,
                                tuiConfigDetails: self.data_1_12_1
                            });
                            break;
                    }
                });
                let confirmData = JSON.parse(JSON.stringify(self.allConfigData));
                confirmData.forEach((item) => {
                    item.tuiConfigDetails.forEach((dItem, dIndex) => {
                        switch(dItem.displayType) {
                            case '0':
                                dItem.componentValue = !dItem.componentValue?'0':'1';
                                break;
                            case '110':
                                dItem.componentValue = !dItem.componentValue?'0':'1';
                                break;
                            case '150':
                                let rData = JSON.parse(JSON.stringify(self.resultData));
                                rData.forEach((item, index) => {
                                    if(item.key =='' && item.value =='' ) {
                                        rData.splice(index, 1);
                                    }
                                });
                                dItem.componentDesc = JSON.stringify(rData);
                                break;
                        } 
                    });
                });
                //console.log('提交前数据：', confirmData);
                updateMultiPageUiConfigDetailApi(
                    self.flowId, 
                    self.platformHospitalId,
                    // self.hospitalId, 
                    self.phone,
                    confirmData
                ).then((res) => {
                    self.loadingConfig = false;
                    self.saveLoading = false;
                    if(res && res.status == 200) {
                        self.$message({
                            type: 'success',
                            message: '配置保存成功'
                        });
                    }
                }).catch((err) => {
                    self.loadingConfig = false;
                    self.saveLoading = false;
                });
            });
        },
    },
}
</script>

<style lang="scss">
@import '@/assets/css/appointProcessConfig.scss';
</style>

