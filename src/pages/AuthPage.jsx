import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';
import { Activity, Mail, Lock, Loader2 } from 'lucide-react';
import Toast from '../components/ui/Toast';

const AuthPage = () => {
  const { t } = useLanguage(); // Lấy từ điển ngôn ngữ hiện tại
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // True: Đăng nhập, False: Đăng ký
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      let result;
      if (isLogin) {
        // Đăng nhập
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        // Đăng ký
        result = await supabase.auth.signUp({ email, password });
      }

      if (result.error) throw result.error;
      
      // Nếu đăng ký thành công mà cần xác thực email (tùy setting Supabase)
      if (!isLogin && result.data?.user && !result.data.session) {
         setToast({ message: "Vui lòng kiểm tra email để xác thực!", type: "success" });
      }

    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 md:p-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* LOGO & TITLE */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mx-auto mb-4">
            <Activity size={32} strokeWidth={3} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">MediGuide Pro</h1>
          <p className="text-slate-500 font-medium mt-1">
            {isLogin ? t.welcome_back : t.create_account}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleAuth} className="space-y-5">
          
          {/* Email Input */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block pl-1">
              {t.email} <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:font-normal placeholder:text-slate-400"
                placeholder={t.ph_email}
              />
              <Mail className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block pl-1">
              {t.password} <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:font-normal placeholder:text-slate-400"
                placeholder={t.ph_password}
              />
              <Lock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            </div>
            {isLogin && (
              <div className="flex justify-end mt-2">
                <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">
                  {t.forgotPass}
                </button>
              </div>
            )}
          </div>

          {/* Main Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={20} /> {isLogin ? t.loggingIn : t.signingUp}</>
            ) : (
              isLogin ? t.signIn : t.signUp
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-slate-400 font-bold uppercase tracking-wider">
              {t.or}
            </span>
          </div>
        </div>

        {/* Toggle Login/Signup */}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
        >
          {isLogin ? (
            <span className="font-normal text-slate-500">{t.noAccount} <span className="text-blue-600 font-bold">{t.toggleSignup}</span></span>
          ) : (
             <span className="font-normal text-slate-500">{t.haveAccount} <span className="text-blue-600 font-bold">{t.toggleLogin}</span></span>
          )}
        </button>

      </div>
      
      {/* Footer Info */}
      <div className="fixed bottom-4 text-center w-full text-[10px] text-slate-400 font-medium">
        MediGuide Pro v1.0 • Secure EMR System
      </div>
    </div>
  );
};

export default AuthPage;