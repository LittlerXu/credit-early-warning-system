//API统一管理

import axios from "axios";
import requests from "./request";
import mockRequests from "./mockAjax";

//登录
export const reqUserLogin = (data) => requests.post(`/admin/login`, data);

//获取学生列表
export const reqStudentList = (data) =>
  requests.post(`/admin/student-list`, data);
//获取级联选择器选项
export const reqCascaderOptions = () =>
  requests.post(`/admin/majors-grades-list`);
//添加/修改学生信息
export const updateStudentList = (data) => requests.post(`/admin/save`, data);
//删除学生
export const deleteStudentInfo = (data) =>
  requests.post(`/admin/deleteStudentInfo`, data);
//更新学生信息
export const changeStudentInfo = () =>
  requests.post(`/admin/changeStudentInfo`);

//获取选课列表
export const reqCourseSelectionList = (data) =>
  requests.post(`/admin/getStudentCourseInfoList`, data);

//CreditWaring
//获取期末学分未达标学生列表
export const reqCreditFailure = (data) =>
  requests.post(`/admin/creditFailure`, data);
//获取学生所修课程详情
export const reqCreditDetails = (data) =>
  requests.post(`/admin/creditDetails?studentId=${data.studentId}`);
//获取学分预警记录
export const reqCreditWarningRecord = (data, currentPage, pageSize) =>
  requests.post(`/admin/getAllCreditWarningList?studentId=${data}&pageNum=${currentPage}&pageSize=${pageSize}`);

//获取学分查看提醒记录
export const reqCreditRemindRecord = (data, currentPage, pageSize) =>
  requests.post(`/admin/getGraduationRemindList?studentId=${data}&pageNum=${currentPage}&pageSize=${pageSize}`);

//获取未达标的学生列表
export const reqQualificationFailure = (data) =>
  requests.post(`/admin/qualificationFailure`, data);
//获取已达标的学生列表
export const reqQualificationPassed = (data) =>
  requests.post(`/admin/qualificationPassed`, data);
//获取学生已修课程
export const reqCompletedCourse = (data) =>
  requests.post(`/admin/qualificationDetails`, data);
//发送毕业资格审核预警
export const sendQualificationWarning = (data) =>
  requests.post(`/admin/sentCreditWarning`, data);
//获取毕业预警记录
export const reqQualificationRecord = (data, currentPage, pageSize) =>
  requests.post(`/admin/getGraduationWarningList?studentId=${data}&pageNum=${currentPage}&pageSize=${pageSize}`);
//获取未点击确认按钮的学生列表
export const reqNotConfirmStudentList = (data) =>
  requests.post(`/admin/notConfirmStudentList`, data);
//获取已点击确认按钮的学生列表
export const reqIsConfirmStudentList = (data) =>
  requests.post(`/admin/isConfirmStudentList`, data);
//获取没有收到通知的学生列表
export const reqNotReceiveStudentList = (data) =>
  requests.post(`/admin/notReceiveStudentList`, data);
//一键提醒所有学生
export const checkQualificationWarning = (data) =>
  requests.post(`/admin/checkQualificationWarning`, data);

// export const reqUserLogin = data => requests.post(`/admin/login`, data)
// 培养方案API
// 获取Tag列表
export const reqTagList = (data) =>
  requests.post(`/admin/tagList?major=${data}`);
// 获取专业列表
export const reqProfessionalList = (data) =>
  requests.post(`/admin/majorList`, data);
// 获取年级列表
export const reqMajorsGradesList = (data) =>
  requests.post(`/admin/majors-grades-list`, data);
// 获取基础课程
export const reqBasicCourses = (data) =>
  requests.post(`/admin/base-course?courseName=${data}`, data);
// 增加培养方案的大类小类
export const reqAddClassification = (data) =>
  requests.post(`/trainingPlan/addClassification`, data);
// 拖拽课程确定培养方案
export const reqAddTrainingPlan = (data) =>
  requests.post(`/trainingPlan/addTrainingPlan`, data);
// 获取指定版本培养方案
export const reqTrainingPlanInfo = (data) =>
  requests.post(`/trainingPlan/getTrainingPlanInfo`, data);
// 获取所有培养方案或者某一方案
export const reqTagWithGrades = (data) =>
  requests.post(`/admin/getTagWithGrades`, data);
// 获取未分配培养方案的年级
export const reqUndistributedGrades = (data) =>
  requests.post(`/admin/getUndistributedGrades?major=${data}`);
// 设置培养方案给哪一级的学生用
export const reqSetTagWithGrades = (data) =>
  requests.post(`/admin/setTagWithGrades`, data);
// 获取未分配培养方案
export const reqUndistributedTags = (data) =>
  requests.post(`/admin/getUndistributedTags?major=${data}`);
// 删除某一版培养方案
export const reqDeleteOneTag = (data) =>
  requests.post(`/admin/deleteOneTag?major=${data.major}&tag=${data.tag}`);
// 删除年级和培养方案版本的关系
export const reqDeleteTagWithGrades = (data) =>
  requests.post(`/admin/deleteTagWithGrades?ids=${data}`);
// 导出培养方案
export const reqExcelToExportTrainingPlan = (major, tag) =>
  requests.get(`/admin/excelToExportTrainingPlan?major=${major}&tag=${tag}`);
// 新增课程
export const reqAddCourseBase = (data) =>
  requests.post('/admin/addBaseCourse', data)
// 删除基础课程 
export const reqDeleteBaseCourse = (data) => requests.post(`/admin/deleteBaseCourse?courseId=${data}`)
// 获取导入操作列表
export const reqImportExcelList = (data) => requests.get('/admin/importExcelList')
// 删除操作列表记录
export const reqDeleteInExcelName = (data) => requests.post('/admin/deleteInExcelName', data)
// 获取type==1的操作详情
export const reqSelectInExcelId1 = (data) => requests.post(`/admin/selectInExcelId1?excelId=${data}`)
// 获取type==2的操作详情
export const reqSelectInExcelId2 = (data) => requests.post(`/admin/selectInExcelId2?excelId=${data}`)
// 获取指定专业的培养方案
export const reqGetAllTags = (data) => requests.post(`/admin/getAllTags?major=${data}`)
// 获取学社工经过的学年
export const reqGetStudentYears = (data) => requests.post(`/admin/getStudentYears?studentId=${data}`)
// 一键更新学生信息前的提示请求
export const reqTipToChangeStudentInfo = () => requests.get(`/admin/tipToChangeStudentInfo`)
// 查看是否还有未进行学分预警的学生
export const reqCheckCreditFailure = () => requests.post(`/admin/checkCreditFailure`)
// 计算学分预警
export const reqCalculateCreditWarning = (data) => requests.post(`/admin/calculateCreditWarning`, data, { timeout: 300000 })
//学分预警过滤特殊学生
export const reqFilterStudents = (data) => requests.post(`/admin/filterStudents?studentId=${data}`)
// 管理端修改学生密码
export const reqChangeStudentPassword = (data) => requests.post(`/admin/changeStudentPassword`, data)
// 更改位置课程归属地
export const reqUpdateUnKnowCourse = (data) => requests.post(`/admin/updateUnKnowCourse`, data)
// 删除预警记录
export const reqDeleteWarningList = (data) => requests.post(`/admin/deleteWarningList?id=${data}`)