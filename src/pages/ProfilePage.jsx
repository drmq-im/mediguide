import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronLeft, LogOut } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Card from '../components/ui/Card';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUserData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 font-bold mb-6 hover:text-blue-600 transition-colors">
            <ChevronLeft size={20}/> Quay lại Dashboard
        </button>

        <h1 className="text-3xl font-black text-gray-900 mb-8">Tài khoản</h1>

        <div className="space-y-6">
            <Card title="Thông tin cá nhân" icon={User}>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                        {user?.email?.[0]?.toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase">Email đăng nhập</p>
                        <p className="text-xl font-medium text-gray-900">{user?.email}</p>
                    </div>
                </div>
            </Card>

            <button 
                onClick={() => supabase.auth.signOut()} 
                className="w-full p-4 border border-red-200 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
                <LogOut size={20}/> Đăng xuất
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;