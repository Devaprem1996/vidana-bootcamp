
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AlertCircle, CheckCircle, RefreshCw, Database, UserX } from 'lucide-react';

const DebugAuth: React.FC = () => {
  const [status, setStatus] = useState<any>({ 
    loading: true, 
    authUser: null, 
    dbProfile: null, 
    error: null 
  });

  const checkStatus = async () => {
    setStatus(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // 1. Check Auth Session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setStatus({ loading: false, authUser: null, dbProfile: null, error: null });
        return;
      }

      // 2. Check Database Profile
      const { data: profile, error: dbError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setStatus({
        loading: false,
        authUser: session.user,
        dbProfile: profile,
        error: dbError ? dbError.message : null
      });

    } catch (err: any) {
      setStatus(prev => ({ ...prev, loading: false, error: err.message }));
    }
  };

  const forceCreateProfile = async () => {
    if (!status.authUser) return;
    
    try {
      const updates = {
        id: status.authUser.id,
        email: status.authUser.email,
        full_name: status.authUser.user_metadata?.full_name || status.authUser.email?.split('@')[0] || 'Forced User',
        role: 'intern',
        avatar_url: status.authUser.user_metadata?.avatar_url || '',
      };

      // We explicitly select the inserted row to confirm it worked
      const { data, error } = await supabase
        .from('profiles')
        .upsert(updates, { onConflict: 'id' })
        .select()
        .single();

      if (error) throw error;
      
      console.log("Force create success:", data);
      await checkStatus(); // Refresh status
      alert("Success! Profile created/updated in database.");
    } catch (err: any) {
      console.error("Force create failed:", err);
      alert("Error creating profile: " + err.message + "\n\nCheck browser console for details.");
    }
  };

  useEffect(() => {
    checkStatus();
    // Listen for auth changes to auto-refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
        checkStatus();
    });
    return () => subscription.unsubscribe();
  }, []);

  // RENDER LOGIC
  
  // State 1: Not Logged In
  if (!status.authUser) {
    return (
      <div className="fixed bottom-4 right-4 p-2 bg-gray-900/80 backdrop-blur text-gray-400 rounded-lg shadow-xl z-50 text-[10px] font-mono border border-gray-700 flex items-center">
        <UserX size={12} className="mr-2"/> No Active Session
      </div>
    );
  }

  // State 2: Logged In
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-gray-900 text-white rounded-xl shadow-2xl z-50 max-w-sm text-xs border border-gray-700 font-mono animate-in slide-in-from-bottom-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold flex items-center text-brand-400"><Database size={14} className="mr-2"/> DB Debugger</h3>
        <button onClick={checkStatus} className="p-1 hover:bg-gray-800 rounded transition-colors"><RefreshCw size={14}/></button>
      </div>

      {/* Auth Status */}
      <div className="mb-2">
        <span className="text-gray-500 block mb-1">Auth User (Supabase):</span>
        <div className="flex items-center text-green-400 bg-gray-800 p-1.5 rounded">
          <CheckCircle size={12} className="mr-2 shrink-0"/> 
          <span className="truncate">{status.authUser.email}</span>
        </div>
        <div className="text-[9px] text-gray-600 mt-1 font-mono truncate">{status.authUser.id}</div>
      </div>

      <div className="border-t border-gray-700 my-2"></div>

      {/* DB Status */}
      <div className="mb-1">
        <span className="text-gray-500 block mb-1">Public Profile Table:</span>
        {status.loading ? (
           <span className="text-yellow-500 animate-pulse">Checking...</span>
        ) : status.dbProfile ? (
          <div className="flex items-center text-green-400 bg-gray-800 p-1.5 rounded">
            <CheckCircle size={12} className="mr-2 shrink-0"/> 
            <span>Found: {status.dbProfile.full_name}</span>
          </div>
        ) : (
          <div className="space-y-3 bg-red-900/20 p-2 rounded border border-red-900/50">
            <div className="flex items-start text-red-400">
               <AlertCircle size={12} className="mr-2 mt-0.5 shrink-0"/> 
               <span>MISSING IN DB</span>
            </div>
            
            <p className="text-[10px] text-gray-400">
               User is authenticated but has no row in <code>public.profiles</code>.
            </p>

            {status.error && <div className="text-red-300 italic p-1 bg-black/20 rounded">{status.error}</div>}
            
            <button 
              onClick={forceCreateProfile}
              className="w-full py-2 bg-brand-600 hover:bg-brand-500 rounded text-white font-bold transition-colors shadow-lg"
            >
              Force Fix Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugAuth;
