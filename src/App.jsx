import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { LanguageProvider } from './contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

// Import Layout Mới
import MainLayout from './components/layouts/MainLayout';

// Import Pages
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import RecordEditor from './pages/RecordEditor';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">MediGuide Loading...</p>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* Chưa đăng nhập -> AuthPage */}
          <Route path="/auth" element={!session ? <AuthPage /> : <Navigate to="/" />} />

          {/* Đã đăng nhập -> Dùng MainLayout bọc lấy Page con */}
          <Route 
            path="/" 
            element={session ? (
              <MainLayout session={session} onLogout={() => supabase.auth.signOut()}>
                <DashboardPage />
              </MainLayout>
            ) : <Navigate to="/auth" />} 
          />

          <Route 
            path="/record/new" 
            element={session ? (
              <MainLayout session={session} onLogout={() => supabase.auth.signOut()}>
                <RecordEditor session={session} />
              </MainLayout>
            ) : <Navigate to="/auth" />} 
          />

          <Route 
            path="/record/:id" 
            element={session ? (
              <MainLayout session={session} onLogout={() => supabase.auth.signOut()}>
                <RecordEditor session={session} />
              </MainLayout>
            ) : <Navigate to="/auth" />} 
          />

          <Route 
            path="/profile" 
            element={session ? (
              <MainLayout session={session} onLogout={() => supabase.auth.signOut()}>
                <ProfilePage />
              </MainLayout>
            ) : <Navigate to="/auth" />} 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;