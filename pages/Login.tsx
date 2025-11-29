
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as ReactRouterDOM from 'react-router-dom';
import { BookOpen, AlertCircle, Mail, Lock, User as UserIcon, ArrowRight, Eye, EyeOff, CheckCircle, Github, ArrowLeft } from 'lucide-react';
import Login3DScene from '../components/Login3DScene';

const { Navigate, Link } = ReactRouterDOM as any;

const Login: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, signupWithEmail, resetPassword, user, isLoading } = useAuth();
  
  // UI State
  const [activeField, setActiveField] = useState<'email' | 'password' | null>(null);
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showPassword, setShowPassword] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  
  // Logic State
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (isLoading) return null; // Or a sleek loader
  if (user) return <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'} />;

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setFormState('error');
    setShakeError(true);
    setTimeout(() => {
        setShakeError(false);
        setFormState('idle');
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setFormState('loading');

    try {
      if (isForgotPassword) {
        await resetPassword(email);
        setFormState('success'); // Stays success to show message
      } else if (isSignUp) {
        await signupWithEmail(email, password, fullName);
        // If successful, try to auto-login or prompt for confirmation
        try {
            await loginWithEmail(email, password);
            // Redirect happens automatically via AuthContext user state change
        } catch (err) {
            // Likely email confirmation required
            setFormState('success'); 
            setErrorMsg("Account created! Please check your email to confirm.");
        }
      } else {
        await loginWithEmail(email, password);
        setFormState('success');
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message || "An unexpected error occurred.";
      if (msg.includes('Invalid login')) msg = "Incorrect email or password.";
      if (msg.includes('already registered')) msg = "User already exists. Try signing in.";
      triggerError(msg);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setIsForgotPassword(false);
    setErrorMsg(null);
    setFormState('idle');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0C0E14] text-gray-900 dark:text-white font-sans overflow-hidden flex relative transition-colors duration-500">
      
      {/* --- LEFT SIDE: 3D HERO (Desktop) / BACKGROUND (Mobile) --- */}
      <div className="absolute inset-0 lg:relative lg:w-[55%] lg:flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-100 to-white dark:from-[#0C0E14] dark:to-[#1a1c29] transition-colors duration-500">
        
        {/* Animated Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand-600/10 dark:bg-brand-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 dark:bg-accent/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>

        {/* 3D Scene Component */}
        <div className="absolute inset-0 z-0 opacity-100 transition-opacity duration-1000">
            <Login3DScene activeField={activeField} formState={formState} />
        </div>

        {/* Desktop Hero Text overlaying 3D */}
        <div className="hidden lg:block relative z-10 px-12 pointer-events-none">
             <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 p-6 rounded-2xl inline-block mb-8 transform -rotate-1 shadow-xl dark:shadow-2xl">
                <div className="flex items-center space-x-3 mb-2">
                   <BookOpen className="text-brand-600 dark:text-brand-400 w-8 h-8" />
                   <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">Vdana Bootcamp</h1>
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">The portal to your future career.</p>
             </div>
        </div>
      </div>


      {/* --- RIGHT SIDE: LOGIN CARD --- */}
      <div className="relative w-full lg:w-[45%] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 z-20">
        
        {/* Back Link */}
        <Link to="/" className="absolute top-6 left-6 lg:top-8 lg:left-12 flex items-center text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-white transition-colors text-sm font-medium">
           <ArrowLeft size={16} className="mr-2" /> Back to Home
        </Link>

        {/* GLASS CARD */}
        <div className={`w-full max-w-md bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-2xl transition-all duration-300 mt-12 lg:mt-0 ${shakeError ? 'translate-x-[-6px]' : 'translate-x-0'}`}>
            
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-600/30">
                        <BookOpen size={18} />
                    </div>
                    <span className="font-heading font-bold text-lg tracking-tight text-gray-900 dark:text-white">Vdana Bootcamp</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                    {isForgotPassword ? 'Reset Password' : (isSignUp ? 'Create Account' : 'Welcome back')}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                    {isForgotPassword ? "We'll send you a link to reset it." : "Sign in to continue your learning journey."}
                </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 dark:bg-red-500/10 dark:border-red-500/20 rounded-xl flex items-start text-red-600 dark:text-red-200 text-sm animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={18} className="mr-3 shrink-0 mt-0.5 text-red-500 dark:text-red-400" />
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* Success Message */}
            {formState === 'success' && !user && (
                 <div className="mb-6 p-4 bg-green-50 border border-green-100 dark:bg-green-500/10 dark:border-green-500/20 rounded-xl flex items-start text-green-700 dark:text-green-200 text-sm animate-in fade-in">
                    <CheckCircle size={18} className="mr-3 shrink-0 mt-0.5 text-green-500 dark:text-green-400" />
                    <span>
                        {isForgotPassword ? "Reset link sent! Check your inbox." : "Success! Check your email to confirm."}
                    </span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Full Name (Sign Up Only) */}
                {isSignUp && !isForgotPassword && (
                    <div className="space-y-1.5 animate-in slide-in-from-top-2 fade-in">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative group">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-brand-500 dark:group-focus-within:text-brand-400 transition-colors" size={18} />
                            <input 
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                                placeholder="Jane Doe"
                                required
                            />
                        </div>
                    </div>
                )}

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Email</label>
                    <div className="relative group">
                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${activeField === 'email' ? 'text-accent' : 'text-gray-400 dark:text-gray-500'}`} size={18} />
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setActiveField('email')}
                            onBlur={() => setActiveField(null)}
                            className={`w-full bg-white dark:bg-gray-900/50 border rounded-xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-1 transition-all ${activeField === 'email' ? 'border-accent ring-accent' : 'border-gray-200 dark:border-gray-700'}`}
                            placeholder="you@domain.com"
                            required
                        />
                    </div>
                </div>

                {/* Password */}
                {!isForgotPassword && (
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Password</label>
                            {!isSignUp && (
                                <button 
                                    type="button" 
                                    onClick={() => { setIsForgotPassword(true); setErrorMsg(null); }}
                                    className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
                                >
                                    Forgot password?
                                </button>
                            )}
                        </div>
                        <div className="relative group">
                            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${activeField === 'password' ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500'}`} size={18} />
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setActiveField('password')}
                                onBlur={() => setActiveField(null)}
                                className={`w-full bg-white dark:bg-gray-900/50 border rounded-xl py-3.5 pl-12 pr-12 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-1 transition-all ${activeField === 'password' ? 'border-brand-500 ring-brand-500' : 'border-gray-200 dark:border-gray-700'}`}
                                placeholder="••••••••"
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button 
                    type="submit"
                    disabled={formState === 'loading'}
                    className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:to-brand-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-600/20 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center relative overflow-hidden group"
                >
                    {formState === 'loading' ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <span>{isForgotPassword ? 'Send Reset Link' : (isSignUp ? 'Create Account' : 'Sign In')}</span>
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                        </>
                    )}
                    
                    {/* Button Shine Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
                </button>

            </form>

            {/* Social / Divider */}
            {!isForgotPassword && (
                <>
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white/50 dark:bg-[#13151c] px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={async () => { try { await loginWithGoogle(); } catch(e:any) { triggerError(e.message); } }}
                            className="flex items-center justify-center py-3 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl transition-all hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                            <span className="text-sm font-medium text-gray-700 dark:text-white">Google</span>
                        </button>
                        <button className="flex items-center justify-center py-3 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl transition-all hover:-translate-y-0.5">
                            <Github className="w-5 h-5 mr-2 text-gray-900 dark:text-white" />
                            <span className="text-sm font-medium text-gray-700 dark:text-white">GitHub</span>
                        </button>
                    </div>
                </>
            )}

            {/* Footer Text */}
            <div className="mt-8 text-center">
                {isForgotPassword ? (
                     <button onClick={() => { setIsForgotPassword(false); setErrorMsg(null); }} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm transition-colors">
                        Back to sign in
                     </button>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {isSignUp ? "Already have an account?" : "New to Vdana?"}{' '}
                        <button onClick={toggleMode} className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-bold transition-colors ml-1">
                            {isSignUp ? "Sign In" : "Create Account"}
                        </button>
                    </p>
                )}
            </div>

        </div>
        
        <div className="mt-8 text-xs text-gray-400 dark:text-gray-600">
            Protected by reCAPTCHA and subject to the Privacy Policy.
        </div>
      </div>
    </div>
  );
};

export default Login;
