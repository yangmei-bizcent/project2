<template>
    <div class="page-container page-adddoctor bgcolor-white">
        <div class="page-title flex-align-justifystart">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>科室信息配置</el-breadcrumb-item>
                <el-breadcrumb-item>{{ $route.query.doctorId == ''?'新增医生':'编辑医生' }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="paddingX20 padding20X">
            <header class="page-content-header">
                <div class="flex-align-justifystart">
                    <p class="fontsize10 color-333 bold">{{ $route.query.doctorId == ''?'新增医生':'编辑医生' }}</p>
                </div>
            </header>
            <section class="margintop30">
                <el-form ref="doctorForm" :rules="rules" :model="doctorForm" label-width="140px">
                    <el-form-item label="医生姓名" prop="name">
                        <el-input 
                            v-model="doctorForm.name" 
                            class="width300"
                            placeholder="请输入2-6字医生名称"></el-input>
                    </el-form-item>
                    <el-form-item label="一级科室" prop="firstFacutyId">
                        <el-select 
                            v-model="doctorForm.firstFacutyId"
                            @change="firstGradeChange(doctorForm.firstFacutyId)"
                            class="width300" 
                            placeholder="请选择">
                            <el-option
                                v-for="item in firstGradeDepartList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-show="showSecondDepartSelect" label="二级科室" prop="secondFacultyId">
                        <el-select 
                            v-model="doctorForm.secondFacultyId" 
                            @change="secondGradeChange(doctorForm.secondFacultyId)"
                            class="width300"
                            placeholder="请选择">
                            <el-option
                                v-for="item in secondGradeDepartList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="医生头像" prop="imageUrl" :rules="[ { required: true, message: '图片必传'}]">
                        <div class="flex-align-justifystart">
                            <el-upload
                                action=""
                                class="avatar-uploader"
                                :http-request="uploadPhoto"
                                :show-file-list="false"
                                :on-change="imgChange"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload"
                                accept="image/jpeg,image/png">
                                <img v-if="doctorForm.imageUrl" :src="doctorForm.imageUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <div class="flex-alignstart-justifybetween-column marginleft20 fontsize-2 upload-right-tool">
                                <!-- <div class="lineheight0">
                                    <el-button 
                                        @click="confirmUploadPhoto"
                                        plain 
                                        class="btn-upload fontsize-2">上传</el-button>
                                </div> -->
                                <p class="color-666">上传图片尺寸建议160*160，大小需要500kb以内，图片格式需为png，jpg，jpeg</p>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="医生工号/ID" prop="doctorContrastCode">
                        <el-input 
                            v-model="doctorForm.doctorContrastCode" 
                            class="width300"
                            placeholder="请输入10字以内医生工号/ID"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-radio-group v-model="doctorForm.sex">
                            <el-radio label="男"></el-radio>
                            <el-radio label="女"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="职称" prop="position">
                        <el-select 
                            v-model="doctorForm.position" 
                            @change="positionChange"
                            class="width300"
                            placeholder="请选择">
                            <el-option label="主任医生" value="主任医生"></el-option>
                            <el-option label="副主任医生" value="副主任医生"></el-option>
                            <el-option label="住院医生" value="住院医生"></el-option>
                            <el-option label="进修医生" value="进修医生"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="医生擅长" prop="especialSkill">
                        <div style="max-width:819px;">
                            <el-input 
                                v-model="doctorForm.especialSkill" 
                                type="textarea"
                                rows="5"
                                maxlength="1000"
                                placeholder="请输入医生所擅长治疗的疾病，1000字以内，可从擅长的疾病、擅长的手术等方面描述"></el-input>
                            <span class="fontsize0 color-999 floatRight">{{especialSkillNum}}/1000</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="医生简介" prop="doctDisplay">
                        <div style="max-width:819px;">
                            <el-input 
                                v-model="doctorForm.doctDisplay" 
                                type="textarea"
                                rows="5"
                                maxlength="1000"
                                placeholder="请输入医生相关介绍，1000字以内，可从毕业院校、专业、职称、从医年长、获得的奖励等方面描述"></el-input>
                            <span class="fontsize0 color-999 floatRight">{{doctDisplayNum}}/1000</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="医学背景" prop="medicalBg">
                        <div style="max-width:819px;">
                            <el-input 
                                v-model="doctorForm.medicalBg" 
                                type="textarea"
                                rows="5"
                                maxlength="1000"
                                placeholder="请输入医生的医学背景，1000字以内，可从医学相关教育背景、医学相关工作背景、医学相关研究背景等方面描述"></el-input>
                            <span class="fontsize0 color-999 floatRight">{{medicalBgNum}}/1000</span>
                        </div>
                    </el-form-item>
                    <div class="flex-alignstart-justifystart width-per85">
                        <el-form-item label="门诊时间" prop="ordinaryRegisterTime" class="width-per35">
                            <el-input 
                                v-model="doctorForm.ordinaryRegisterTime" 
                                placeholder="请请输入门诊时间，如周一上午/每周二下午，20字内"
                                maxlength="200"></el-input>
                        </el-form-item>
                        <el-form-item label="门诊地点" prop="ordinaryPlace" class="width-per35">
                            <el-input 
                                v-model="doctorForm.ordinaryPlace" 
                                placeholder="请输入门诊楼号、楼层及诊室号"
                                maxlength="200"></el-input>
                        </el-form-item>
                        <el-form-item label="挂号费" label-width="90px" prop="ordinaryRegisterFee" class="width-per20">
                            <div class="flex-align-justifystart">
                                <el-input 
                                    @keyup.native="numberOrdinaryAmount()"
                                    v-model="doctorForm.ordinaryRegisterFee" 
                                    class="maxWidth70"></el-input>
                                <div class="paddingleft15">元</div>
                            </div>
                        </el-form-item>
                    </div>
                    <div class="flex-alignstart-justifystart width-per85">
                        <el-form-item label="专家门诊时间" class="width-per35">
                            <el-input 
                                v-model="doctorForm.expertRegisterTime" 
                                placeholder="请请输入门诊时间，如周一上午/每周二下午，20字内"
                                maxlength="200"></el-input>
                        </el-form-item>
                        <el-form-item label="专家门诊地点" class="width-per35">
                            <el-input 
                                v-model="doctorForm.expertPlace" 
                                placeholder="请输入门诊楼号、楼层及诊室号"
                                maxlength="200"></el-input>
                        </el-form-item>
                        <el-form-item label="挂号费" label-width="90px" class="width-per20" prop="expertRegisterFee">
                            <div class="flex-align-justifystart">
                                <el-input 
                                    @keyup.native="numberExpertAmount()"
                                    v-model="doctorForm.expertRegisterFee" 
                                    class="maxWidth70" ></el-input>
                                <div class="paddingleft15">元</div>
                            </div>
                        </el-form-item>
                    </div>
                    <div class="flex-alignstart-justifystart width-per85">
                        <el-form-item label="特需门诊时间" class="width-per35">
                            <el-input 
                                v-model="doctorForm.specialRegisterTime" 
                                placeholder="请请输入门诊时间，如周一上午/每周二下午，20字内"
                                maxlength="200"></el-input>
                        </el-form-item>
                        <el-form-item label="特需门诊地点" class="width-per35">
                            <el-input 
                                v-model="doctorForm.specialPlace" 
                                placeholder="请输入门诊楼号、楼层及诊室号"
                                maxlength="200"></el-input>
                        </el-form-item>
                        <el-form-item label="挂号费" label-width="90px" class="width-per20" prop="specialRegisterFee">
                            <div class="flex-align-justifystart">
                                <el-input 
                                    @keyup.native="numberSpecialAmount()"
                                    v-model="doctorForm.specialRegisterFee" 
                                    class="maxWidth70"></el-input>
                                <div class="paddingleft15">元</div>
                            </div>
                        </el-form-item>
                    </div>
                    
                    <el-form-item class="margintop10">
                        <el-button 
                            type="primary" 
                            @click="submitForm('doctorForm')" 
                            v-show="ediYYShow">保存</el-button>
                        <!-- <el-button type="primary" plain>删除</el-button> -->
                    </el-form-item>
                </el-form>
            </section>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { 
    getSecondGradeDepartApi,
 } from '@/service/depart.js'
export default {
    inject: ['reload'],
    data() {
        var validateNumber = (rule, value, callback) => {
            let reg = /^(([1-9][0-9]*(\.\d{1,2}))|(0\.\d{1,2}))+$/
            if(value && !reg.test(value)) {
                callback(new Error('请输入非负数，小数的话精确到两位'))
            } else {
                callback()
            }
        };
        return {
            saveLoading: false,
            uploadUrl: '',
            hosAndDepartsData: [],
            firstGradeDepartList: [],   // 一级科室下拉列表值
            secondGradeDepartList: [],   // 二级科室下拉列表值
            showSecondDepartSelect: true,   // 是否显示二级科室下拉
            especialSkillNum: 0,
            doctDisplayNum: 0,
            medicalBgNum: 0,
            doctorForm: {
                // 暂存
                imageUrl: '',
                firstFacutyId: '',  // 一级科室下拉值
                firstFacutyName: '',  // 一级科室下拉值
                secondFacultyId: '',  // 二级科室下拉值
                secondFacultyName: '',  // 二级科室下拉值

                branchId: '',
                content: '',
                doctDisplay: '',    // 医生简介
                doctListSpec: '',
                doctorContrastCode: '', // 工号
                especialSkill:  '',
                expertPlace: '',
                expertRegisterFee: '',
                expertRegisterTime: '',
                
                facultyId: '',  // 当前所在科室id
                facultyLevel: 0,   // 当前所在科室等级
                facultyPid: '', // 父科室id，若当前科室是一级科室的话，父科室没值
                facultyPname: '',
                facutyName: '',

                hospitalId: '',
                id: '',
                mark: 0,
                medicalBg: '',  // 医学背景
                name: '',
                ordinaryPlace: '',
                ordinaryRegisterFee: '',
                ordinaryRegisterTime: '',
                photo: '',
                place: '',
                position: '',   // 职称
                regiestTime: '',
                registerFee: '',
                sex: '男',
                specialPlace: '',
                specialRegisterFee: '',
                specialRegisterTime: '',
            },
            rules: {
                name: [
                    { required: true, message: '请填写医生姓名', trigger: 'blur' },
                    { min: 2, max: 6, message: "请输入2-6字医生姓名", trigger: "blur" },
                ],
                firstFacutyId: [
                    { required: true, message: '请选择一级科室', trigger: 'blur' }
                ],
                // secondFacultyId: [
                //     { required: true, message: '请选择二级科室', trigger: 'blur' }
                // ],
                doctorContrastCode: [
                    { required: true, message: '请填写医生工号/ID', trigger: 'blur' },
                    { max: 10, message: "请输入10字以内医生工号/ID", trigger: "blur" },
                ],
                sex: [
                    { required: true, message: '请选择性别', trigger: 'blur' }
                ],
                position: [
                    { required: true, message: '请选择职称', trigger: 'blur' }
                ],
                especialSkill: [
                    { required: true, message: '请填写医生擅长', trigger: 'blur' },
                    { max: 1000, message: '医生擅长不能超过1000字', trigger: 'blur' }
                ],
                doctDisplay: [
                    { required: true, message: '请填写医生简介', trigger: 'blur' },
                    { max: 1000, message: '医生简介不能超过1000字', trigger: 'blur' }
                ],
                medicalBg: [
                    { required: true, message: '请填写医学背景', trigger: 'blur' },
                    { max: 1000, message: '医学背景不能超过1000字', trigger: 'blur' }
                ],
                ordinaryRegisterTime: [
                    { required: true, message: '请填写门诊时间', trigger: 'blur' }
                ],
                ordinaryPlace: [
                    { required: true, message: '请填写门诊地点', trigger: 'blur' }
                ],
                ordinaryRegisterFee: [
                    { required: true, message: '请填写门诊挂号费', trigger: 'blur' },
                    // { validator: validateNumber, trigger: "blur" }
                ],
                // expertRegisterFee: [
                //     { validator: validateNumber, trigger: "blur" }
                // ],
                // specialRegisterFee: [
                //     { validator: validateNumber, trigger: "blur" }
                // ],
            },
            //权限控制
            ediYYShow:false
        }
    },
    computed: {
        ...mapGetters({
            hosAndDeparts: 'hosAndDeparts',
            Jurisdiction:'Jurisdiction',
            moduleper:'moduleper'
        }),
    },
    watch: {
        'doctorForm.firstFacutyId': {
            handler(newValue, oldValue) {
                this.getSecondDepartList(newValue);
    　　　　},
        },
        'doctorForm.especialSkill': {
            handler(newValue, oldValue) {
                if(newValue.length<=1000){
                    this.especialSkillNum = newValue.length;
                }
    　　　　},
        },
        'doctorForm.doctDisplay': {
            handler(newValue, oldValue) {
                if(newValue.length<=1000){
                    this.doctDisplayNum = newValue.length;
                }
    　　　　},
        },
        'doctorForm.medicalBg': {
            handler(newValue, oldValue) {
                if(newValue.length<=1000){
                    this.medicalBgNum = newValue.length;
                }
    　　　　},
        }
    },
    created() {
        this.JurisdictionFun();
        // console.log('新增传递的院区、科室、医生：', this.$route.query.branchId, ',', this.$route.query.facultyId, ',', this.$route.query.doctorId);
    },
    async mounted() {
        let self = this;
        self.doctorForm.branchId = self.$route.query.branchId;
        await self.getDeparts();
        if(self.$route.query.doctorId != '') {
            self.$route.meta.title = '编辑医生-互联网医院应用管理后台';
            self.getDoctorInfo();
        }
        else {
            self.$route.meta.title = '新增医生-互联网医院应用管理后台';
            self.doctorForm.firstFacutyId = self.$route.query.facultyId;
            self.firstGradeChange(self.doctorForm.firstFacutyId);
            self.doctorForm.secondFacultyId = self.$route.query.secondFacultyId?self.$route.query.secondFacultyId:'';
            self.secondGradeChange(self.doctorForm.secondFacultyId);
        }
    },
    methods: {
        JurisdictionFun(){
        //权限控制
        if((this.moduleper!=undefined || this.moduleper!=null) && this.moduleper.length>0){
            this.moduleper.map(item=>{
                item.children.map(item2=>{
                    if(item2.feature_id==351071){//"修改医生信息"
                        this.ediYYShow=true;
                    }
                })
            })
        }
        
      },
        getDoctorInfo() {
            let self = this;
            self.$store.dispatch({
                type: 'getDoctorInfo',
                doctorId: self.$route.query.doctorId,
            }).then((d) => {
                if(d && d.hasOwnProperty('data')) {
                    //console.log('医生详情：', d.data);
                    self.doctorForm = Object.assign(self.doctorForm,d.data);
                    //console.log('处理：', self.doctorForm);
                    self.doctorForm.imageUrl = self.doctorForm.photo;
                    self.doctorForm.sex = self.doctorForm.sex==1?'男':'女';
                    // 判断当前所在科室等级，然后科室赋值
                    switch(self.doctorForm.facultyLevel) {
                        case 1:
                            // 当前在一级科室
                            self.doctorForm.firstFacutyId = self.doctorForm.facultyId;
                            self.firstGradeChange(self.doctorForm.firstFacutyId);
                            self.showSecondDepartSelect = false;
                            break;
                        case 2:
                            // 当前在二级科室
                            self.doctorForm.firstFacutyId = self.doctorForm.facultyPid;
                            self.firstGradeChange(self.doctorForm.firstFacutyId);
                            self.showSecondDepartSelect = true;
                            self.doctorForm.secondFacultyId = self.doctorForm.facultyId?self.doctorForm.facultyId:'';
                            self.secondGradeChange(self.doctorForm.facultyId);
                            break;
                    }
                }
            });
        },
        // 获取科室
        getDeparts() {
            let self = this;
            self.$store.dispatch({
                type: 'getDepart',
                branchId: self.$route.query.branchId,
            }).then((d) => {
                if(d && d.hasOwnProperty('data')) {
                    //console.log('新增页面，科室列表：', d.data.facultyList);
                    self.firstGradeDepartList = d.data.facultyList;

                    switch(self.$route.query.fromType) {
                        case '1':
                            // 入口：一级科室
                            self.doctorForm.firstFacutyId = self.$route.query.facultyId;
                            break;
                        case '2':
                            // 入口：二级科室
                            self.doctorForm.firstFacutyId = self.$route.query.facultyId;
                            self.firstGradeChange(self.doctorForm.firstFacutyId);
                            self.doctorForm.secondFacultyId = self.$route.query.secondFacultyId;
                            self.secondGradeChange(self.doctorForm.secondFacultyId);
                            break;
                    }
                }
            });
        },
        // 一级科室更改选项，更新二级科室列表数据
        firstGradeChange(firstDepartId) {
            let self = this;
            self.doctorForm.secondFacultyId = '';
            if(self.firstGradeDepartList.length > 0) {
                self.secondGradeDepartList = [];
                self.firstGradeDepartList.forEach((item, index) => {
                    if(item.id == firstDepartId) {
                        // console.log('一级科室筛选出数据：', item);
                        self.doctorForm.firstFacutyName = item.name;
                        self.doctorForm.facutyName = item.name;
                        self.getSecondDepartList(item.id);
                    }
                });
            }
        },
        // 一级科室改变时，获取二级科室的下拉列表
        getSecondDepartList(falcutyId) {
            let self = this;
            getSecondGradeDepartApi(falcutyId).then((d) => {
                if(d && d.hasOwnProperty('data')) {
                    if(d.data.facultyList.length > 0) {
                        self.secondGradeDepartList = d.data.facultyList;
                        self.showSecondDepartSelect = true;
                    }
                    else {
                        self.showSecondDepartSelect = false;
                    }
                }
            });
        },
        // 二级科室更改
        secondGradeChange(secondFacultyId) {
            let self = this;
            // self.doctorForm.secondFacultyId="";
            //console.log('二级科室：', secondFacultyId, self.secondGradeDepartList);
            if(self.secondGradeDepartList.length > 0) {
                self.secondGradeDepartList.forEach((item, index) => {
                    if(item.id == secondFacultyId) {
                        self.doctorForm.secondFacultyName = item.name;
                    }
                });
                //console.log('选中的二级科室是：', secondFacultyId+'，'+self.doctorForm.secondFacultyName);
            }
        },
        // 上传医生头像
        uploadPhoto(res) {
            if(res.file==""){
                this.$message.error('请选择图片');
                return;
            }
            let file = new FormData();
            file.append("file", res.file);
            this.$store.dispatch({
                type: 'uploadImg',
                file: file
            }).then((d) => {
                if(d && d.status == 200) {
                    this.$message.success('上传成功');
                    this.doctorForm.photo = d.data.url;
                }
            });
        },
        imgChange(file) {
            this.doctorForm.imageUrl = URL.createObjectURL(file.raw);
        },
        handleAvatarSuccess(res, file) {
            this.doctorForm.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            let isImageArr = file.name.split('.');
            let isImage = isImageArr[isImageArr.length-1];
            //console.log(isImage);
            const isJPG = (isImage == 'PNG' || isImage == 'png' || isImage == 'jpg' || isImage == 'jpeg');
            const isLt500kb = file.size / 1024/1024/1024 < 500;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 png，jpg，jpeg 格式!');
            }
            if (!isLt500kb) {
                this.$message.error('上传头像图片大小不能超过 500kb!');
            }
            return isJPG && isLt500kb;
        },
        // 职称修改
        positionChange() {

        },
        submitForm(formName) {
            let self = this;
            if(self.doctorForm.photo == '' ) {
                self.$alert('请上传医生头像', '提示', {
                    confirmButtonText: '确定',
                });
                return false;
            }
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    if(self.doctorForm.secondFacultyId=='') {
                        // 当前在一级科室
                        self.doctorForm.facultyLevel = 1;
                        self.doctorForm.facultyId = self.doctorForm.firstFacutyId;
                        self.doctorForm.facutyName = self.doctorForm.firstFacutyName;
                        self.doctorForm.facultyPid = '';
                        self.doctorForm.facultyPname = '';
                        
                       // console.log('提交前科室是', self.doctorForm.facutyName);
                    }
                    else {
                        // 当前在二级科室
                        self.doctorForm.facultyLevel = 2;
                        self.doctorForm.facultyPid = self.doctorForm.firstFacutyId;
                        self.doctorForm.facultyPname = self.doctorForm.firstFacutyName;
                        self.doctorForm.facultyId = self.doctorForm.secondFacultyId;
                        self.doctorForm.facutyName = self.doctorForm.secondFacultyName;
                    }
                    // 暂存保存的一级和二级科室，做跳转列表时，传参
                    let firstFacutyId = self.doctorForm.firstFacutyId;
                    let firstFacutyName = self.doctorForm.firstFacutyName;
                    let secondFacultyId = self.doctorForm.secondFacultyId;
                    let secondFacultyName = self.doctorForm.secondFacultyName;


                    let formData = JSON.parse(JSON.stringify(self.doctorForm));
                    
                    delete formData.imageUrl;
                    formData.sex = formData.sex=='男'?'1':'2';
                    delete formData.firstFacutyId;
                    delete formData.firstFacutyName;
                    delete formData.secondFacultyId;
                    delete formData.secondFacultyName;

                    //console.log('提交表单内容：', formData);
                    self.saveLoading = true;
                    switch(self.$route.query.doctorId) {
                        case '':
                            // 新增
                            self.$store.dispatch({
                                type: 'addDoctor',
                                branchId: self.$route.query.branchId,
                                facultyId: self.doctorForm.facultyId,
                                doctorInfo: formData,
                            }).then((d) => {
                                self.saveLoading = false;
                                if(d && d.hasOwnProperty('data')) {
                                    this.$message({
                                        message: d.data,
                                        type: 'success'
                                    });
                                    self.$router.push({
                                        path: '/doctortList',
                                        query: {
                                            fromType: '0',
                                            branchId: self.hosAndDeparts[0].hospitalBranchId,
                                            departId: '',
                                            secondDepartId: '',
                                            branchName: self.hosAndDeparts[0].name,
                                            departName: '',
                                            secondDepartName: ''
                                        }
                                    });
                                    self.reload();
                                }
                            }).catch((err) => {
                                self.saveLoading = false;
                            });
                            break;
                        default:
                            // 编辑
                            self.$store.dispatch({
                                type: 'editDoctorInfo',
                                doctorId: self.$route.query.doctorId,
                                doctorInfo: formData,
                            }).then((d) => {
                                self.saveLoading = false;
                                if(d && d.hasOwnProperty('data')) {
                                    this.$message({
                                        message: d.data,
                                        type: 'success'
                                    });
                                    self.$router.push({
                                        path: '/doctortList',
                                        query: {
                                            fromType: '0',
                                            branchId: self.hosAndDeparts[0].hospitalBranchId,
                                            departId: '',
                                            secondDepartId: '',
                                            branchName: self.hosAndDeparts[0].name,
                                            departName: '',
                                            secondDepartName: ''
                                        }
                                    });
                                    self.reload();
                                }
                            }).catch((err) => {
                                self.saveLoading = false;
                            });
                            break;
                    }
                    
                } else {
                    //console.log('error submit!!');
                    return false;
                }
            });
        },
        // 门诊挂号费处理
        numberOrdinaryAmount(){
            this.doctorForm.ordinaryRegisterFee = this.doctorForm.ordinaryRegisterFee.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符    
            this.doctorForm.ordinaryRegisterFee = this.doctorForm.ordinaryRegisterFee.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的   
            this.doctorForm.ordinaryRegisterFee = this.doctorForm.ordinaryRegisterFee.replace(".","$#$").replace(/\./g,"").replace("$#$",".");  
            this.doctorForm.ordinaryRegisterFee = this.doctorForm.ordinaryRegisterFee.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数   
            //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
            if(this.doctorForm.ordinaryRegisterFee.indexOf(".")< 0 && this.doctorForm.ordinaryRegisterFee !=""){ 
                this.doctorForm.ordinaryRegisterFee = parseFloat(this.doctorForm.ordinaryRegisterFee);  
                this.doctorForm.ordinaryRegisterFee = ''+this.doctorForm.ordinaryRegisterFee;
            }
        },
        // 专家门诊挂号费处理
        numberExpertAmount() {
            this.doctorForm.expertRegisterFee = this.doctorForm.expertRegisterFee.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符    
            this.doctorForm.expertRegisterFee = this.doctorForm.expertRegisterFee.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的   
            this.doctorForm.expertRegisterFee = this.doctorForm.expertRegisterFee.replace(".","$#$").replace(/\./g,"").replace("$#$",".");  
            this.doctorForm.expertRegisterFee = this.doctorForm.expertRegisterFee.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数   
            //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
            if(this.doctorForm.expertRegisterFee.indexOf(".")< 0 && this.doctorForm.expertRegisterFee !=""){ 
                this.doctorForm.expertRegisterFee = parseFloat(this.doctorForm.expertRegisterFee);  
                this.doctorForm.expertRegisterFee = ''+this.doctorForm.expertRegisterFee;
            }
        },
        // 特需门诊挂号费处理
        numberSpecialAmount() {
            this.doctorForm.specialRegisterFee = this.doctorForm.specialRegisterFee.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符    
            this.doctorForm.specialRegisterFee = this.doctorForm.specialRegisterFee.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的   
            this.doctorForm.specialRegisterFee = this.doctorForm.specialRegisterFee.replace(".","$#$").replace(/\./g,"").replace("$#$",".");  
            this.doctorForm.specialRegisterFee = this.doctorForm.specialRegisterFee.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数   
            //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
            if(this.doctorForm.specialRegisterFee.indexOf(".")< 0 && this.doctorForm.specialRegisterFee !=""){ 
                this.doctorForm.specialRegisterFee = parseFloat(this.doctorForm.specialRegisterFee);  
                this.doctorForm.specialRegisterFee = ''+this.doctorForm.specialRegisterFee;
            }
        },
    },
}
</script>

<style lang="scss">
@import '@/assets/css/var.scss';
.page-adddoctor {
    .width70 {
        width: 70px;
    }
    .width300 {
        width: 300px;
    }
    .width-per20 {
        width: 20%;
    }
    .width-per35 {
        width: 35%;
    }
    .width-per45 {
        width: 45%;
    }
    .width-per80 {
        width: 80%;
    }
    .maxWidth70 {
        max-width: 70px;
        .el-input__inner {
            max-width: 70px;
        }
    }
    .el-textarea__inner {
        max-width: 819px;
        resize: none;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #ccc;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 80px;
        height: 80px;
        line-height: 80px;
        text-align: center;
    }
    .avatar {
        width: 80px;
        height: 80px;
        display: block;
    }
    .upload-right-tool {
        height: 110px;
    }
    .btn-upload {
        width: 54px;
        min-width: auto;
        padding: 0;
        color: #999;
        height: 22px;
        line-height: 22px;
    }
}
</style>


