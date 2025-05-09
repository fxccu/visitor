import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      visitorName: 'Visitor Name',
      phone: 'Phone Number',
      visitDate: 'Visit Date',
      visitPurpose: 'Purpose of Visit',
      hostName: 'Host Name',
      hostPhone: 'Host Phone',
      idNumber: 'ID Number (optional)',
      carNumber: 'Car Plate Number (optional)',
      submit: 'Submit',
      visitorNotice: 'Visitor Notice',
      close: 'Close',
      switchLang: '中文',
      required: 'This field is required',
      invalidPhone: 'Please enter a valid phone number',
      invalidHostPhone: 'Please enter a valid host phone number',
      invalidIdNumber: 'Please enter a valid ID number',
      invalidCarNumber: 'Please enter a valid car plate number',
      agreeTerms: 'I acknowledge and agree to comply with the relevant regulations',
      noticePlaceholder: 'This is a placeholder for the visitor notice. Please scroll to the end to close.',
      submitSuccess: 'Registration Successful',
      submitSuccessDesc: 'Your visitor registration has been submitted successfully!'
    }
  },
  zh: {
    translation: {
      visitorName: '访客姓名',
      phone: '联系电话',
      visitDate: '来访日期',
      visitPurpose: '来访目的',
      hostName: '被访人姓名',
      hostPhone: '被访人联系方式',
      idNumber: '身份证号码（选填）',
      carNumber: '车牌号（选填）',
      submit: '提交',
      visitorNotice: '访客须知',
      close: '关闭',
      switchLang: 'EN',
      required: '此项为必填项',
      invalidPhone: '请输入有效的手机号码',
      invalidHostPhone: '请输入有效的手机号码',
      invalidIdNumber: '请输入有效的身份证号码',
      invalidCarNumber: '请输入有效的车牌号',
      agreeTerms: '我已知晓，并愿意遵守相关规定',
      noticePlaceholder: '这里是访客须知占位内容，请滚动到末尾后关闭。',
      submitSuccess: '登记成功',
      submitSuccessDesc: '您的访客登记信息已提交成功！'
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'zh',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
