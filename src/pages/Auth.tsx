import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import saudiLogo from '../assets/saudi-logo.svg';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4" dir="rtl">
      <div className="w-full max-w-md mb-8 flex flex-col items-center">
        <img src={saudiLogo} alt="Saudi GCA Logo" className="h-16 mb-4" />
        <h1 className="text-2xl font-bold text-center text-gray-900">
          منصة المراجعة الرقمية (شامل)
        </h1>
        <p className="text-sm text-gray-600">
          الديوان العام للمحاسبة - Digital Audit Platform (Shamel)
        </p>
      </div>
      
      {isLogin ? <LoginForm /> : <RegisterForm />}
      
      <div className="mt-6 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-saudi-primary hover:text-saudi-secondary transition duration-300"
        >
          {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول بحساب موجود'}
        </button>
      </div>
    </div>
  );
}