<template>
    <div class="page-container page-departList bgcolor-white">
        <div class="page-title flex-align-justifystart">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>科室信息配置</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button 
                type="text"
                @click="showAppConfig">手机端展示配置&nbsp;&gt;</el-button>
        </div>
        <div class="paddingX20 padding20X">
            <header class="page-content-header">
                <div class="flex-align-justifystart">
                    <p class="fontsize10 color-333 bold moreLineEllipsis1">{{ pageTitle }}</p>
                    <div v-show="lookKSShow">
                        <el-button 
                            v-show="$route.query.fromType!=0 && showDepartEnter" 
                            type="text" 
                            @click="toDepartDetail">科室详情&gt;</el-button>
                    </div>
                </div>
            </header>
            <div class="wrap-search flex-align-justifybetween">
                <div class="marginbottom0">
                    <div class="flex-align-justifystart">
                        <div class="fontsize0 color-333 marginright20">医生搜索</div>
                        <el-input 
                            v-model="searchDoctorName" 
                            class="width300"
                            placeholder="请输入医生姓名"
                            @blur="searchDoctors"
                            @change="searchDoctors">
                            <!-- <el-button slot="suffix" icon="el-icon-search" @click="searchDoctors"></el-button> -->
                        </el-input>
                    </div>
                </div>
                <div class="operate-tool">
                    <span v-show="addDocBtnShow">
                        <el-button 
                        v-show="$route.query.fromType!=0" 
                        type="primary" 
                        @click="toAddDoctor">新增医生</el-button>
                    </span>
                    <el-button type="primary" plain @click="batchDeleteDoctors">批量删除</el-button>
                    <el-button plain @click="batchUploadDoctors">批量导入</el-button>
                    <el-button plain  @click="batchDownloadDoctors">批量导出</el-button>
                </div>
            </div>
            <el-table 
                v-loading="loading"
                :data="doctorsData"
                class="custom-table" 
                border 
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="position" label="职称"></el-table-column>
                <el-table-column prop="doctorContrastCode" label="工号"></el-table-column>
                <el-table-column prop="firstFacutyName" label="一级科室"></el-table-column>
                <el-table-column prop="secondFacultyName" label="二级科室"></el-table-column>
                <el-table-column label="排序" prop="mark">
                    <template slot-scope="scope">
                        <!-- <span>{{ scope.row.mark }}</span> -->
                        <el-input-number 
                            v-model="scope.row.mark" 
                            class="width110"
                            controls-position="right" 
                            :min="0"
                            placeholder="请输入序号"
                            @blur="editInputBlur(scope.$index, scope.row.id, scope.row.name, scope.row.mark)"
                            @change="editInputBlur(scope.$index, scope.row.id, scope.row.name, scope.row.mark)"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="createdon" label="添加时间"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div class="flex-align-justify">
                            <el-button 
                                class="widthAuto paddingX0"
                                type="text"
                                @click="editDoctor(scope.row)" v-show="lookYYShow">修改</el-button>
                            <el-button  
                                class="widthAuto paddingX0 marginleft20"
                                type="text"
                                @click="deleteDoctor(scope.row)" v-show="removeYYShow">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="margintop20 paddingbottom50" v-show="total>0">
                <div class="block floatRight">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[5, 10, 20, 30, 50]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <el-dialog title="批量导入规则" class="dlg-header-bottom-line" :visible.sync="uploadDlgVisible" width="613px">
            <div class="marginbottom30">
                <ul class="fontsize2 color-333 lineheight24">
                    <li>1、导入excel文件，可支持文件后缀名为xls以及xlsx格式的excel；</li>
                    <li>2、当导入文件存在与列表中医生（医生工号）相同的数据时，导入文件数据覆盖列表原有数据；</li>
                    <li>3、导入和导出要保证excel一致当导入文件中存在不符合示例模板的数据时，不允许导入；</li>
                    <li>4、请<el-button 
                                class="widthAuto paddingX0 downloadBtnText"
                                type="text"
                                @click="downloadExp">点击此处</el-button>下载示例模板，按照示例模板中的格式准备数据。</li>
                </ul>
            </div>
            <div class="width360">
                <el-upload
                    ref="uploadFile"
                    action=""
                    class="upload-demo"
                    :auto-upload="false"
                    :http-request="uploadFiles"
                    :on-remove="handleRemove"             
                    :on-progress="onUploadProcess"
                    :on-success="handlesuccess"
                    :before-upload="beforeAvatarUpload" 
                    accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    :limit="1"
                    :file-list="uploadFileList">
                    <el-button size="small" type="primary">选择文件</el-button>
                    <div slot="tip" class="el-upload__tip inlineBlock marginleft10 fontsize0 color-999">只能上传xls xlsx格式的excel</div>
                </el-upload>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmUpload">立即导入</el-button>
            </div>
        </el-dialog>
        <el-dialog title="手机端展示配置" class="dlg-header-bottom-line" :visible.sync="appConfigDlgVisible" width="613px">
            <div class="padding20X">
                <div class="flex-align-justifystart marginbottom20">
                    <p class="fontsize0 color-333 marginright20">展示二级科室列表</p>
                    <el-switch
                        v-model="appConfigInfo.deptClass"
                        active-color="#13ce66">
                    </el-switch>
                </div>
                <p class="fontsize0 color-999">（开启后手机端将展示两级科室列表，此时只展示选中的二级科室下医生列表）</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmAppConfig">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { 
    getDoctorsApi, 
    getAppConfigApi, 
    editAppConfigApi,
    deleteDoctorApi,
 } from '@/service/depart.js'

export default {
    data() {
        return {
            pageTitle: '',  // 表格上方标题
            fromType: '',
            branchId: '',
            departId: '',
            secondDepartId: '',
            showDepartEnter: true,  // 显示‘科室详情’按钮
            
            departIdParam: '',

            // 展示二级科室列表
            appConfigInfo: {
                deptClass: false,
            },
            appConfigDlgVisible: false, // 手机端展示配置弹窗显示

            loading: true,
            currentPage: 1,
            pageSize: 5,
            total: 0,

            uploadDlgVisible: false,
            // 批量导入数据
            uploadFileList: [
                
            ],
            // uploadurl: apiurl + 'PC/DischargedPatient/UploadDischargeRecordImg',
            uploadurl: '',
            uploadUrl:'',
            fileUrlarr: [],
            FileUrl:[],//提交保存时的图片链接
            FileTitle:[],//提交保存时的图片名字

            doctorsData: [],
            searchDoctorName: '',
            multipleSelection: [],
            //权限控制
            lookKSShow:false,
            addDocBtnShow:false,
            lookYYShow:false,
            removeYYShow:false
        }
    },
    computed: {
        ...mapGetters({
            token: 'token',
            platformHospitalId: 'platformHospitalId',
            currentDate: 'currentDate',
            hosAndDeparts: 'hosAndDeparts',
            Jurisdiction:'Jurisdiction',
            moduleper:'moduleper'
        }),
    },
    watch: {
        doctorsData(newVal, oldVal) {
            // console.log('新的数据', newVal);
        },
        hosAndDeparts() {
            // console.log('院区改变了', this.hosAndDeparts);
            this.pageTitle = this.hosAndDeparts[0].name;
            this.branchId = this.hosAndDeparts[0].hospitalBranchId;
            this.showDepartEnter = false;
        },
    },
    async mounted() {
        this.JurisdictionFun();//权限控制
        let self = this;
        if(self.$route.query.fromType != undefined) {
            self.fromType = self.$route.query.fromType;
            self.branchId = self.$route.query.branchId;
            self.departId = self.$route.query.departId;
            self.secondDepartId = self.$route.query.secondDepartId;
            switch(self.fromType) {
                case '1':
                    // 入口是一级科室
                    self.pageTitle = self.$route.query.departName;
                    break;
                case '2':
                    // 入口是二级科室
                    self.pageTitle = self.$route.query.secondDepartName;
                    break;
                default:
                    // 入口是院区
                    self.pageTitle = self.$route.query.branchName;
                    break;
            }
        }
        // console.log('医生列表页获取参数：', self.$route.query.fromType, ',',self.$route.query.branchId, ',', self.$route.query.departId, ',', self.$route.query.secondDepartId);
        await this.getDoctorList();
    },
    methods: {
        JurisdictionFun(){
        //权限控制
        if((this.moduleper!=undefined || this.moduleper!=null) && this.moduleper.length>0){
            this.moduleper.map(item=>{
                item.children.map(item2=>{
                    if(item2.feature_id==351063){//"查看科室详情信息"
                        this.lookKSShow=true;
                    }else if(item2.feature_id==351069){//"新增医生详细信息"
                        this.addDocBtnShow=true;
                    }else if(item2.feature_id==351068){//"查看医生详情信息"
                        this.lookYYShow=true;
                    }else if(item2.feature_id==351070){//"删除医生信息"
                        this.removeYYShow=true;
                    }
                })
                 
            })
        }
        
      },
      // 数组排序比较
        compare(property){
            return function(a,b){
                var value1 = a[property];
                var value2 = b[property];
                return value2 - value1;
            }
        },
        // 表格单元格双击
        cellDblClick(row, column, cell, event) {
            // console.log('row', row);
            // console.log('column', column);
            // console.log('cell', cell);
            // console.log('event', event);
            // console.log(this.$refs.editInput009);
            // console.log(row.doctorContrastCode, this.$refs['editInput'+row.doctorContrastCode]);
            
            this.$refs['markText'+row.doctorContrastCode].style.display = 'none';
            this.$refs['editInput'+row.doctorContrastCode].$refs.input.style.display = 'inline-block';
        },
        // 排序
        editInputBlur(rowIndex, id, name, newMark) {
            let self = this;
            //console.log('输入框失去焦点', rowIndex, id, newMark);
            self.$store.dispatch({
                type: 'editDoctorInfo',
                doctorId: id,
                doctorInfo: {mark: parseInt(newMark)},
            }).then((d) => {
                if(d && d.hasOwnProperty('data')) {
                    this.$message({
                        message: '医生 ['+name+'] 的排序更新成功',
                        type: 'success'
                    });
                }
            });
        },
        // 手机端展示配置
        showAppConfig() {
            this.appConfigDlgVisible = true;
            this.getAppConfig();    // 获取手机端配置
        },
        // 获取手机端配置
        async getAppConfig() {
            let self = this;
            //console.log('手机配置', self.$route.query.branchId);
            if(self.$route.query.branchId) {
                await getAppConfigApi(self.$route.query.branchId).then((d) => {
                        if(d && d.hasOwnProperty('data')) {
                        //console.log(d.data.deptClass);
                        self.appConfigInfo = d.data;
                        self.appConfigInfo.deptClass = d.data.deptClass=='1'?false:true;
                    }
                });
            }
        },
        // 提交手机端配置
        async confirmAppConfig() {
            let self = this;
            self.appConfigInfo.deptClass = self.appConfigInfo.deptClass==false?'1':'2';
            await editAppConfigApi(
                self.appConfigInfo.id,
                self.appConfigInfo
            ).then((d) => {
                if(d && d.hasOwnProperty('data')) {
                    this.$message({
                        message: d.data,
                        type: 'success'
                    });
                    // console.log('修改手机端配置回应');
                }
            });
            this.appConfigDlgVisible = false;
        },
        // 搜索医生
        searchDoctors() {
            this.currentPage = 1;
            this.pageSize = 5;
            setTimeout(this.getDoctorList(),1000);
        },
        // 获取医生列表数据
        async getDoctorList() {
            let self = this;
            self.doctorsData = [];
           // console.log('开始搜索');
            switch(self.fromType) {
                case '1':
                    // 入口是一级科室
                    self.departIdParam = self.departId;
                    break;
                case '2':
                    // 入口是二级科室
                    self.departIdParam = self.secondDepartId;
                    break;
                default:
                    // 入口是院区
                    self.departIdParam = '';
                    break;
            }
            try {
                let branchIdParam = self.$route.query.branchId==undefined?self.hosAndDeparts[0].hospitalBranchId:self.$route.query.branchId;
                //console.log('参数院区id是：', branchIdParam);
                getDoctorsApi(
                    branchIdParam,
                    self.departIdParam,
                    self.searchDoctorName,
                    self.currentPage,
                    self.pageSize
                ).then(d => {
                    self.loading = false;
                    if(d && d.hasOwnProperty('data')) {
                        self.total = d.data.total,
                        self.doctorsData = d.data.list;
                        self.doctorsData.sort(self.compare('mark'));
                        self.doctorsData.forEach((item, index) => {
                            if(item.facultyLevel != null) {
                                switch(item.facultyLevel) {
                                    case 1:
                                        item.firstFacutyName = item.facutyName;
                                        item.secondFacultyName = '';
                                        break;
                                    case 2:
                                        item.firstFacutyName = item.facultyPname;
                                        item.secondFacultyName = item.facutyName;
                                        break;
                                }
                            }
                        });
                        
                        //console.log('api医生列表：', d.data.list);
                    }
                })
            }catch(err) {
                self.loading = false;
            }
        },
        // START------分页
        handleSizeChange(val) {
            this.pageSize = val;
            this.getDoctorList();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getDoctorList();
        },
        // END--------分页
        // 新增医生
        toAddDoctor() {
            let self = this;
            self.$router.push({
                path: '/addDoctor',
                query: {
                    fromType: self.$route.query.fromType,
                    branchId: self.$route.query.branchId,
                    facultyId: self.$route.query.departId,
                    secondFacultyId: self.$route.query.secondDepartId,
                    branchName: self.$route.query.branchName,
                    departName: self.$route.query.departName,
                    secondDepartName: self.$route.query.secondDepartName,
                    doctorId: ''
                }
            });
            
        },
        // 跳转到科室详情
        toDepartDetail() {
            this.$router.push({
                path: '/departmentDetail',
                query:{
                    type: 'edit',
                    branchId: this.$route.query.branchId,
                    facultyId: this.$route.query.secondDepartId?this.$route.query.secondDepartId:this.$route.query.departId,
                }
            });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            // console.log('选中的医生是：', this.multipleSelection);
        },
        // 搜索医生
        searchDoctor() {
           // console.log('搜索');
        },
        // 修改医生
        editDoctor(row) {
            let self = this;
            self.$router.push({
                path: '/addDoctor',
                query:{
                    fromType: self.$route.query.fromType,
                    branchId: self.$route.query.branchId,
                    facultyId: self.$route.query.departId,
                    secondFacultyId: self.$route.query.secondDepartId,
                    branchName: self.$route.query.branchName,
                    departName: self.$route.query.departName,
                    secondDepartName: self.$route.query.secondDepartName,
                    doctorId: row.id
                }
            });
        },
        // 删除医生
        deleteDoctor(row) {
            let self = this;
            self.$confirm('确定删除“'+ row.name +'”医生?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                try {
                    deleteDoctorApi(row.id).then((d) => {
                        if(d && d.hasOwnProperty('data')) {
                            self.$message({
                                type: 'success',
                                message: d.data
                            });
                            self.currentPage = 1;
                            self.pageSize = 5;
                            self.getDoctorList();
                        }
                    });
                }catch(err) {
                    self.loading = false;
                }
            })
        },
        // 批量删除医生
        batchDeleteDoctors() {
            let self = this;
            if(self.multipleSelection.length > 0) {
                self.$confirm('确定删除批量删除选中的医生?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let selectedDoctors = [];
                    self.multipleSelection.forEach((item) => {
                        selectedDoctors.push(item.id);
                    });
                    //console.log('11111', selectedDoctors);
                    self.$store.dispatch({
                        type: 'batchDeleteDoctor',
                        doctorIds: selectedDoctors,
                    }).then((d) => {
                        if(d && d.hasOwnProperty('data')) {
                            //console.log('删除回应');
                            self.$message({
                                type: 'success',
                                message: d.data
                            });
                            self.currentPage = 1;
                            self.pageSize = 5;
                            self.getDoctorList();
                        }
                    });
                    
                })
            }else {
                self.$message({
                    message: '请选择要删除的医生',
                    type: 'warning'
                });
            }
        },
        // START--------导入
        //打开批量导入弹框
        batchUploadDoctors() {
            this.uploadDlgVisible = true;
        },
        // 立即导入
        confirmUpload() {
            this.$refs.uploadFile.submit();
        },
        // 上传文件
        uploadFiles(res) {
            let file = new FormData();
            file.append("file", res.file);
            this.$store.dispatch({
                type: 'batchUploadDoctor',
                branchId: this.$route.query.branchId,
                importType: 'addHospitalDept',
                file: file
            }).then((d) => {
                if(d && d.status==200 && d.hasOwnProperty('data')) {
                    if(d.data == '导入成功！'){
                         this.$message({
                        message: d.data,
                        type: 'success'
                        });
                    }
                   else{
                        this.$message({
                        message: d.data,
                        type: 'error'
                         });
                         //console.log(d.data)
                   }
                   this.uploadDlgVisible = false;
                    //console.log('弹框上传文件回应', d.data);
                }
            });
        },
        // 下载示例模板
        downloadExp() {
            window.open(URL_CONFIG.backendBaseUrl+'/hospital/auth/export/0');
        },
        beforeAvatarUpload(file) {
            const isExcel = (file.type == 'application/vnd.ms-excel' || file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            if (!isExcel) {
                this.$message.error('上传头像图片只能是 xls，xlsx 格式!');
            }
            return isExcel;
        },
        //上传中
        onUploadProcess() {
            // var self = this;
            // self.isUploadDisabled = true;
        },
        handlesuccess(file, fileList, res) {
            // var self = this;
            // self.isUploadDisabled = false;
            // self.fileUrlarr.push({name: fileList.name,url: file.extra.url,size: file.extra.size});
            // self.FileUrl.push(file.extra.url);
            // console.log(file)
            //console.log('uploadPC:'+self.FileUrlarr);
        },
        handleRemove(file, fileList) {
            //console.log(file, fileList);
        },
        // END-----------导出
        //批量导出
        batchDownloadDoctors() {
            //console.log(URL_CONFIG.backendBaseUrl+'/hospital/auth/export/'+this.$route.query.branchId);
            window.open(URL_CONFIG.backendBaseUrl+'/hospital/auth/export/'+this.$route.query.branchId);
        },
    },
}
</script>

<style lang="scss">
@import '@/assets/css/var.scss';
.page-departList {
    .editDiv {
        display: inline-block;
        height: 34px;
        line-height: 34px;
    }
    .width70 {
        width: 70px;
    }
    .width110 {
        width: 110px;
    }
    .width300 {
        width: 300px;
    }
    .width360 {
        width: 360px;
    }
    .widthAuto {
        width: auto;
        min-width: auto;
    }
    .lineheight24 {
        line-height: 24px;
    }
    .el-button--text {
        color: $color-3c9ef8;
        &:active, &:hover {
            color: $color-3c9ef8;
        }
        & + .el-button--text {
            margin-left: 20px;
        }
    }
    .wrap-search {
        height: 94px;
    }
    .custom-table {
        th {
            font-size: 16px;
            color: $color-333;
            font-weight: 400;
            background: #f2f2f2;
        }
        td {
            color: $color-666;
            height: 58px;
            border-left: none;
            border-right: none;
        }
        * {
            text-align: center;
        }
    }
    .dlg-header-bottom-line{
        .el-dialog__title {
            font-size: 16px;
            color: $color-333;
            font-weight: bold;
        }
        .el-dialog__header {
            padding-bottom: 24px;
        }
        .el-dialog__body {
            padding: 20px 24px;
            margin: 0 25px;
            border-top: 1px solid #e7e7e7;
        }
        .el-dialog__footer {
            padding-top: 16px;
            border-top: 1px solid #e7e7e7;
        }
    }
    .downloadBtnText {
        font-size: 16px;
        text-decoration: underline;
    }
    .el-input-group__append {
        min-width: 50px;
        padding: 0 5px;
        text-align: center;
        .el-button {
            min-width: initial;
        }
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


