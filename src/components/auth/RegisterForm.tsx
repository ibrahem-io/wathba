import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await signUp(email, password, fullName);
      setSuccess(true);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError('فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center">
          <div className="bg-green-50 text-green-700 p-4 rounded-md mb-4">
            <h3 className="text-lg font-medium">تم إنشاء الحساب بنجاح!</h3>
            <p className="mt-2">يرجى تسجيل الدخول للمتابعة.</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-saudi-primary text-white py-2 px-4 rounded-md hover:bg-saudi-secondary transition duration-300"
          >
            العودة إلى تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">إنشاء حساب جديد</h2>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            الاسم الكامل
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-saudi-primary"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-saudi-primary"
            dir="ltr"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            كلمة المرور
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-saudi-primary"
            dir="ltr"
          />
          <p className="mt-1 text-xs text-gray-500">يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل</p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-saudi-primary text-white py-2 px-4 rounded-md hover:bg-saudi-secondary transition duration-300 disabled:opacity-50"
        >
          {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
        </button>
      </form>
    </div>
  );
}