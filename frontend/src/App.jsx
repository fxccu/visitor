import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import UserNoticeModal from './components/UserNoticeModal';
import logo from './assets/logo.png';

// 成功图标组件
const SuccessIcon = () => (
  <svg className="w-24 h-24 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

// 日期格式转换辅助函数
const formatDate = (date, language) => {
  if (!date) return '';
  try {
    const d = new Date(date);
    return d.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (e) {
    return date;
  }
};

const initialForm = {
  visitorName: '',
  phone: '',
  visitPurpose: '',
  hostName: '',
  hostPhone: '',
  idNumber: '',
  carNumber: ''
};

const REQUIRED_FIELDS = [
  'visitorName',
  'phone',
  'visitPurpose',
  'hostName',
  'hostPhone'
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/visitor';

export default function App() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showNotice, setShowNotice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const isZh = i18n.language === 'zh';

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'date') {
      // 对日期进行格式转换
      setForm(prev => ({
        ...prev,
        [name]: value ? formatDate(value, i18n.language) : ''
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const errs = {};
    REQUIRED_FIELDS.forEach((key) => {
      if (!form[key]) errs[key] = t('required');
    });
    // 电话校验
    if (form.phone && !/^1\d{10}$/.test(form.phone)) {
      errs.phone = t('invalidPhone');
    }
    // 被访人电话校验
    if (form.hostPhone && !/^1\d{10}$/.test(form.hostPhone)) {
      errs.hostPhone = t('invalidHostPhone');
    }
    // 身份证校验（15或18位数字，18位可带X）
    if (form.idNumber && !/^(\d{15}|\d{17}[\dXx])$/.test(form.idNumber)) {
      errs.idNumber = t('invalidIdNumber');
    }
    // 车牌号校验（简单常见格式）
    if (form.carNumber && !/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z0-9]{5,6}$/.test(form.carNumber)) {
      errs.carNumber = t('invalidCarNumber');
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    
    if (!agreedToTerms) {
      setShowNotice(true);
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSuccess(true);
        setForm(initialForm);
        setAgreedToTerms(false);
      } else {
        alert('Submit failed');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const switchLang = () => {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh');
  };

  const renderContent = () => {
    if (success) {
      return (
        <div className="text-center py-8">
          <SuccessIcon />
          <h2 className="text-2xl font-bold text-green-500 mb-2">{t('submitSuccess')}</h2>
          <p className="text-white text-lg">{t('submitSuccessDesc')}</p>
        </div>
      );
    }

    return (
      <form className="space-y-3.5" onSubmit={handleSubmit}>
        <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '10px' }} className="p-6">
          <Input label={t('visitorName')} name="visitorName" value={form.visitorName} onChange={handleChange} error={errors.visitorName} required dark placeholderSize="text-sm" />
          <Input label={t('phone')} name="phone" value={form.phone} onChange={handleChange} error={errors.phone} required dark placeholderSize="text-sm" />
          <Input label={t('visitPurpose')} name="visitPurpose" value={form.visitPurpose} onChange={handleChange} error={errors.visitPurpose} required dark placeholderSize="text-sm" />
          <Input label={t('hostName')} name="hostName" value={form.hostName} onChange={handleChange} error={errors.hostName} required dark placeholderSize="text-sm" />
          <Input label={t('hostPhone')} name="hostPhone" value={form.hostPhone} onChange={handleChange} error={errors.hostPhone} required dark placeholderSize="text-sm" />
          <Input label={t('idNumber')} name="idNumber" value={form.idNumber} onChange={handleChange} error={errors.idNumber} dark placeholderSize="text-sm" />
          <Input label={t('carNumber')} name="carNumber" value={form.carNumber} onChange={handleChange} error={errors.carNumber} dark placeholderSize="text-sm" />
          
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked);
                if (e.target.checked) {
                  setShowNotice(true);
                }
              }}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="terms" className="ml-2 text-sm font-medium text-white">
              {t('agreeTerms')}
            </label>
          </div>
          
          <button 
            type="submit" 
            className="w-full" 
            style={{
              backgroundColor: agreedToTerms ? 'rgb(34, 69, 127)' : 'rgb(156, 163, 175)', 
              color: 'white', 
              padding: '0.5rem', 
              borderRadius: '0.375rem', 
              marginTop: '0.5rem'
            }} 
            disabled={submitting || !agreedToTerms}
          >
            {t('submit')}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#22457F' }}>
      <div className="w-full max-w-md rounded-2xl shadow-lg p-8 relative" style={{ backgroundColor: '#1A2A44', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)' }}>
        <button onClick={switchLang} className="absolute top-6 right-8 text-blue-300 underline text-sm z-10">{t('switchLang')}</button>
        <div className="flex items-center mb-8">
          <img src={logo} alt="logo" className="w-20 h-20 mr-4" />
          <h1 className="text-2xl font-bold text-white whitespace-nowrap" style={{lineHeight: 1.1}}>{isZh ? 'oadev访客登记' : 'oadev Visitor Registration'}</h1>
        </div>
        {renderContent()}
      </div>
      {showNotice && <UserNoticeModal onClose={() => setShowNotice(false)} />}
    </div>
  );
}

function Input({ label, name, value, onChange, error, type = 'text', required, dark, placeholderSize }) {
  const { i18n } = useTranslation();
  
  if (type === 'date') {
    const locale = i18n.language === 'zh' ? zhCN : enUS;
    const dateFormat = 'yyyy-MM-dd';
    
    return (
      <div className="mb-3">
        <label className={`block text-sm font-medium mb-1 ${dark ? 'text-white' : ''}`}>
          {label} {required && <span className="text-red-300">*</span>}
        </label>
        <DatePicker
          selected={value ? new Date(value) : null}
          onChange={(date) => {
            onChange({
              target: {
                name,
                value: date ? format(date, 'yyyy-MM-dd') : '',
                type: 'date'
              }
            });
          }}
          locale={locale}
          dateFormat={dateFormat}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 bg-white text-[#22457F] border-gray-200 focus:ring-blue-200 placeholder-[#A0AEC0] text-sm ${placeholderSize || ''} ${error ? 'border-red-400' : ''}`}
          placeholderText={dateFormat}
          required={required}
        />
        {error && <div className="text-red-300 text-xs mt-1">{error}</div>}
      </div>
    );
  }

  return (
    <div className="mb-3">
      <label className={`block text-sm font-medium mb-1 ${dark ? 'text-white' : ''}`}>
        {label} {required && <span className="text-red-300">*</span>}
      </label>
      <input
        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 bg-white text-[#22457F] border-gray-200 focus:ring-blue-200 placeholder-[#A0AEC0] text-sm ${placeholderSize || ''} ${error ? 'border-red-400' : ''}`}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        required={required}
        placeholder={label}
        style={{ fontSize: '0.875rem' }}
      />
      {error && <div className="text-red-300 text-xs mt-1">{error}</div>}
    </div>
  );
}
