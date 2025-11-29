
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle, Code, Workflow, Zap, LayoutDashboard, Cpu, MessageSquare, ChevronDown, ChevronRight, User, Star, Menu, X, Globe, Terminal } from 'lucide-react';
import Background3D from '../components/Background3D';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const Landing: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dashboardLink = user?.role === 'admin' ? '/admin-dashboard' : '/dashboard';

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSocialClick = (platform: string) => {
      showToast(`${platform} profile coming soon!`, 'info');
  };

  const curriculum = [
    { title: 'Foundation: n8n Automation', weeks: 'Weeks 1-2', desc: 'Master the canvas. Build your first complex workflows integrating Slack, Email, and Google Sheets.' },
    { title: 'Advanced: AI Agents & Logic', weeks: 'Weeks 3-4', desc: 'Learn decision trees, error handling, and integrating OpenAI nodes for intelligent automation.' },
    { title: 'Vibe Coding with Cursor', weeks: 'Week 5', desc: 'Step into the future of coding. Build React components and API connectors using natural language prompts.' },
    { title: 'Prompt Engineering Mastery', weeks: 'Week 6', desc: 'Control LLMs precisely. Learn Chain-of-Thought, System Prompting, and formatting outputs for production.' },
  ];

  const mentors = [
    { name: 'Sarah Lin', role: 'Automation Architect', company: 'Ex-Stripe', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
    { name: 'David Chen', role: 'AI Engineer', company: 'OpenAI Contributor', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
    { name: 'Elena Rodriguez', role: 'Product Lead', company: 'Vercel', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
  ];

  return (
    <div className="relative min-h-screen font-sans bg-gray-50/30 dark:bg-[#050505] text-gray-900 dark:text-white overflow-x-hidden selection:bg-primary-500 selection:text-white transition-colors duration-500">
      {/* 1. Global 3D Background */}
      <Background3D />

      {/* 2. Floating Navbar (Glassmorphism) - WIDER */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 md:py-6 transition-all duration-300">
        <div className="max-w-[1800px] mx-auto bg-white/70 dark:bg-[#151515]/60 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl px-6 md:px-8 py-3 md:py-4 flex justify-between items-center shadow-xl shadow-black/5">
           <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="bg-primary-600 p-2 rounded-xl text-white shadow-neon group-hover:scale-105 transition-transform">
                 <BookOpen size={20} />
              </div>
              <span className="text-xl md:text-2xl font-heading font-bold tracking-tight text-gray-900 dark:text-white">
                Vidana<span className="text-primary-600 dark:text-primary-400">Bootcamp</span>
              </span>
           </div>
           
           {/* Desktop Nav */}
           <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={toggleTheme} 
                className="text-sm font-ui font-bold text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-white transition-colors"
              >
                 {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
              <button onClick={() => scrollToSection('curriculum')} className="text-sm font-ui font-bold text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-white transition-colors">
                Syllabus
              </button>
              {user ? (
                 <Link to={dashboardLink} className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-ui font-bold transition-all shadow-lg hover:shadow-primary-500/30 border border-primary-500/50 hover:-translate-y-0.5">
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                 </Link>
              ) : (
                 <Link to="/login" className="px-7 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl text-sm font-ui font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-lg hover:-translate-y-0.5">
                    Log In
                 </Link>
              )}
           </div>

           {/* Mobile Menu Toggle */}
           <div className="md:hidden">
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600 dark:text-gray-300">
               {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
           </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-4 flex flex-col space-y-4 md:hidden animate-in slide-in-from-top-2 z-50">
              <button onClick={() => { scrollToSection('curriculum'); setMobileMenuOpen(false); }} className="text-left px-4 py-2 font-medium text-gray-700 dark:text-gray-200">
                Syllabus
              </button>
              <button onClick={toggleTheme} className="text-left px-4 py-2 font-medium text-gray-700 dark:text-gray-200">
                 {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              </button>
              {user ? (
                 <Link to={dashboardLink} className="w-full text-center px-5 py-3 bg-primary-600 text-white rounded-xl font-bold">
                    Go to Dashboard
                 </Link>
              ) : (
                 <Link to="/login" className="w-full text-center px-5 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold">
                    Log In
                 </Link>
              )}
          </div>
        )}
      </nav>

      {/* 3. Hero Section - FULL WIDTH & IMMERSIVE */}
      <main className="relative z-10 pt-32 md:pt-40 pb-20 md:pb-24 px-4 md:px-12 lg:px-20 overflow-hidden">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left: Text Content */}
            <div className="text-left space-y-8 md:space-y-10 animate-in slide-in-from-bottom-8 fade-in duration-1000 z-20">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-primary-200 dark:border-primary-500/30 bg-white/50 dark:bg-primary-500/10 backdrop-blur-md shadow-sm">
                    <span className="relative flex h-2.5 w-2.5 mr-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
                    </span>
                    <span className="text-xs font-heading font-bold text-primary-700 dark:text-primary-300 tracking-wide uppercase">New Cohort Enrolling Now</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-9xl font-heading font-bold leading-[0.95] md:leading-[0.9] tracking-tight text-gray-900 dark:text-white">
                    Become a <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-600 to-primary-600 dark:from-primary-400 dark:via-accent dark:to-primary-400 bg-300% animate-gradient">Modern Dev</span>
                    <br/> — Fast.
                </h1>

                <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 font-sans leading-relaxed max-w-2xl">
                    Skip the fluff. Master <strong>n8n automation</strong>, <strong>AI-assisted coding</strong>, and <strong>Prompt Engineering</strong> in a high-intensity 1.5 week sprint.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 md:gap-5 pt-4 md:pt-6">
                    {user ? (
                        <Link 
                            to={dashboardLink} 
                            className="px-8 md:px-10 py-4 md:py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-ui font-bold text-base md:text-lg shadow-xl shadow-primary-600/20 transition-all hover:scale-105 flex items-center justify-center border-t border-white/20"
                        >
                            Continue Learning <ArrowRight size={20} className="ml-2"/>
                        </Link>
                    ) : (
                        <Link 
                            to="/login" 
                            className="px-8 md:px-10 py-4 md:py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-ui font-bold text-base md:text-lg shadow-xl shadow-primary-600/20 transition-all hover:scale-105 flex items-center justify-center border-t border-white/20"
                        >
                            Start Free Trial <ArrowRight size={20} className="ml-2"/>
                        </Link>
                    )}
                    <button 
                      onClick={() => scrollToSection('curriculum')}
                      className="px-8 md:px-10 py-4 md:py-5 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-white/10 rounded-2xl font-ui font-bold text-base md:text-lg transition-all flex items-center justify-center shadow-lg"
                    >
                        View Syllabus
                    </button>
                </div>

                <div className="flex items-center space-x-6 pt-4 md:pt-6">
                    <div className="flex -space-x-4">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 dark:bg-gray-800 border-4 border-white dark:border-[#0a0a0a] overflow-hidden shadow-lg">
                                <img src={`https://i.pravatar.cc/150?img=${i + 15}`} alt="Student" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="flex text-yellow-500 mb-1">
                            {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor"/>)}
                        </div>
                        <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-bold">Joined by 400+ developers</span>
                    </div>
                </div>
            </div>

            {/* Right: Visual - Hidden on mobile, shown on larger screens */}
            <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000 delay-200 h-full min-h-[600px] flex items-center justify-center">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/20 dark:bg-primary-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="relative w-full max-w-xl">
                    <div className="absolute top-12 -right-12 w-full h-full bg-gray-200/50 dark:bg-white/5 backdrop-blur-sm border border-white/20 rounded-[2.5rem] transform rotate-6 z-0"></div>

                    <div className="relative bg-white/80 dark:bg-[#121212]/70 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-10 shadow-2xl z-10 hover:scale-[1.01] transition-transform duration-500 group">
                        <div className="flex justify-between items-center mb-10 border-b border-gray-100 dark:border-white/5 pb-6">
                            <div className="flex space-x-3">
                                <div className="w-3.5 h-3.5 rounded-full bg-red-500/80"></div>
                                <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3.5 h-3.5 rounded-full bg-green-500/80"></div>
                            </div>
                            <div className="text-xs font-mono text-gray-400 flex items-center">
                                <Terminal size={12} className="mr-2"/> auto_deploy.ts
                            </div>
                        </div>
                        
                        <div className="space-y-8 relative">
                            <div className="absolute left-[26px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-gray-200 via-primary-500 to-gray-200 dark:from-gray-800 dark:via-primary-500 dark:to-gray-800 z-0"></div>

                            <div className="relative z-10 flex items-center space-x-6 p-4 rounded-2xl bg-white dark:bg-black/40 border border-gray-100 dark:border-white/5 shadow-sm">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 flex items-center justify-center border border-yellow-200 dark:border-yellow-700/30 text-yellow-600 dark:text-yellow-500">
                                   <Zap size={26} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Trigger</div>
                                    <div className="font-bold text-gray-900 dark:text-white">Webhook Received</div>
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center space-x-6 p-4 rounded-2xl bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-500/30 shadow-lg shadow-primary-500/5">
                                <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center border border-primary-400 text-white shadow-lg shadow-primary-600/30 animate-pulse">
                                   <Cpu size={26} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">Processing</div>
                                    <div className="font-bold text-gray-900 dark:text-white">AI Analysis & Transform</div>
                                </div>
                                <div className="ml-auto px-3 py-1 bg-white/50 dark:bg-black/30 rounded-full text-[10px] font-mono text-primary-600 dark:text-primary-300">
                                    running...
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center space-x-6 p-4 rounded-2xl bg-white dark:bg-black/40 border border-gray-100 dark:border-white/5 shadow-sm">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center border border-green-200 dark:border-green-700/30 text-green-600 dark:text-green-500">
                                   <MessageSquare size={26} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Action</div>
                                    <div className="font-bold text-gray-900 dark:text-white">Send Slack Notification</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 bg-gray-900 rounded-xl p-5 font-mono text-xs text-gray-300 border border-gray-800 shadow-inner">
                            <div className="flex space-x-2 mb-2 opacity-50">
                                <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                            </div>
                            <span className="text-primary-400">const</span> result = <span className="text-purple-400">await</span> agent.<span className="text-blue-400">execute</span>(<span className="text-green-400">payload</span>);<br/>
                            <span className="text-gray-500">// Returns: "Optimized successfully"</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>

      {/* 4. What You Will Learn (Features) */}
      <section className="py-20 md:py-32 px-4 md:px-12 relative z-10 bg-white/80 dark:bg-[#080808]/80 backdrop-blur-sm transition-colors border-y border-gray-100 dark:border-white/5">
        <div className="max-w-[1600px] mx-auto">
            <div className="text-center mb-16 md:mb-24">
                <h2 className="text-3xl md:text-6xl font-heading font-bold mb-4 md:mb-6 text-gray-900 dark:text-white">The Modern Stack</h2>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">We don't teach legacy tools. We teach the stack that powers the next generation of startups.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                {[
                    { title: 'Workflow Automation', icon: Workflow, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-dark-bg', border: 'hover:border-orange-500/50', desc: 'Build backend logic visually without managing servers. Connect 100+ apps instantly.' },
                    { title: 'Vibe Coding', icon: Code, color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-dark-bg', border: 'hover:border-primary-500/50', desc: 'Use AI copilots to write React & Node.js code 10x faster. The new way to engineer.' },
                    { title: 'Prompt Engineering', icon: MessageSquare, color: 'text-green-500 dark:text-green-400', bg: 'bg-green-50 dark:bg-dark-bg', border: 'hover:border-green-500/50', desc: 'Structure inputs to get production-grade outputs from LLMs. Zero hallucinations.' },
                    { title: 'AI Tools Suite', icon: Cpu, color: 'text-cyan-500 dark:text-accent', bg: 'bg-cyan-50 dark:bg-dark-bg', border: 'hover:border-cyan-500/50', desc: 'Master Midjourney, Perplexity, and ElevenLabs. Generate assets at scale.' },
                    { title: 'System Design', icon: LayoutDashboard, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-dark-bg', border: 'hover:border-purple-500/50', desc: 'Architect scalable solutions that connect API endpoints securely and efficiently.' },
                    { title: 'Production Deploy', icon: Zap, color: 'text-yellow-500 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-dark-bg', border: 'hover:border-yellow-500/50', desc: 'Ship your micro-apps to real users instantly using Vercel and Supabase.' },
                ].map((item, i) => (
                    <div key={i} className={`group p-8 md:p-10 bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 rounded-[2.5rem] hover:shadow-2xl dark:hover:shadow-none hover:-translate-y-2 transition-all duration-300 relative overflow-hidden ${item.border}`}>
                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-3xl ${item.bg} border border-gray-100 dark:border-white/10 flex items-center justify-center mb-6 md:mb-8 ${item.color} group-hover:scale-110 transition-transform shadow-sm`}>
                            <item.icon size={28} className="md:w-8 md:h-8" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl md:text-2xl font-heading font-bold mb-3 md:mb-4 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-white transition-colors">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base font-ui">{item.desc}</p>
                        
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 5. Mentors */}
      <section className="py-20 md:py-32 px-4 md:px-12 relative z-10 bg-gray-50/50 dark:bg-[#0a0a0a] transition-colors">
          <div className="max-w-[1600px] mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16">
                  <div>
                    <h2 className="text-3xl md:text-6xl font-heading font-bold mb-4 text-gray-900 dark:text-white">Learn from Builders</h2>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">Direct feedback from engineers shipping real product.</p>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                  {mentors.map((mentor, i) => (
                      <div key={i} className="relative p-1 rounded-[2.5rem] bg-gradient-to-b from-white dark:from-white/10 to-transparent hover:from-primary-200 dark:hover:from-primary-500/30 transition-colors group shadow-sm hover:shadow-2xl duration-500">
                          <div className="bg-white dark:bg-[#151515] rounded-[2.3rem] p-8 md:p-10 h-full flex flex-col items-center text-center relative overflow-hidden border border-gray-100 dark:border-none">
                              <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-primary-50 dark:from-primary-900/10 to-transparent"></div>
                              
                              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[6px] border-white dark:border-[#151515] shadow-2xl mb-6 relative z-10 p-1 bg-gradient-to-br from-primary-500 to-purple-500">
                                  <img src={mentor.img} alt={mentor.name} className="w-full h-full rounded-full object-cover border-2 border-white dark:border-dark-card" />
                              </div>
                              
                              <h3 className="text-xl md:text-2xl font-bold font-heading text-gray-900 dark:text-white mb-1">{mentor.name}</h3>
                              <p className="text-primary-600 dark:text-primary-400 font-bold text-sm mb-2">{mentor.role}</p>
                              <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-black/30 rounded-lg text-xs font-bold text-gray-500 tracking-widest uppercase mb-6">{mentor.company}</div>
                              
                              <div className="mt-auto flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                                  <button onClick={() => handleSocialClick('Website')} className="p-3 bg-gray-50 dark:bg-black/50 rounded-full text-gray-400 hover:text-white hover:bg-primary-600 transition-colors"><Globe size={18}/></button>
                                  <button onClick={() => handleSocialClick('Chat')} className="p-3 bg-gray-50 dark:bg-black/50 rounded-full text-gray-400 hover:text-white hover:bg-primary-600 transition-colors"><MessageSquare size={18}/></button>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 6. Syllabus Accordion */}
      <section id="curriculum" className="py-20 md:py-32 px-4 md:px-12 bg-white dark:bg-[#050505] border-y border-gray-200 dark:border-white/5 relative z-10 transition-colors">
          <div className="max-w-6xl mx-auto">
             <div className="text-center mb-16 md:mb-20">
                 <h2 className="text-3xl md:text-6xl font-heading font-bold mb-4 md:mb-6 text-gray-900 dark:text-white">The Syllabus</h2>
                 <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">1.5 weeks of intensity. <br/><span className="text-primary-600 dark:text-primary-400">Zero fluff.</span></p>
             </div>

             <div className="space-y-4 md:space-y-6">
                 {curriculum.map((item, index) => {
                     const isOpen = activeAccordion === index;
                     return (
                         <div 
                            key={index} 
                            onClick={() => setActiveAccordion(isOpen ? null : index)}
                            className={`group border rounded-[2rem] transition-all duration-300 cursor-pointer overflow-hidden ${
                                isOpen 
                                ? 'bg-white dark:bg-[#121212] border-primary-500 shadow-2xl dark:shadow-neon ring-1 ring-primary-500 dark:ring-0 transform scale-[1.02]' 
                                : 'bg-gray-50 dark:bg-[#121212]/50 border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10'
                            }`}
                         >
                             <div className="p-6 md:p-10 flex justify-between items-center">
                                 <div className="flex items-center space-x-4 md:space-x-8">
                                     <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-bold text-lg md:text-xl transition-colors shrink-0 ${
                                         isOpen ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-white dark:bg-[#0a0a0a] text-gray-400 border border-gray-200 dark:border-white/10'
                                     }`}>
                                         {index + 1}
                                     </div>
                                     <div>
                                         <p className={`text-xs md:text-sm font-bold uppercase tracking-wider mb-1 md:mb-2 ${isOpen ? 'text-primary-600 dark:text-accent' : 'text-gray-500'}`}>{item.weeks}</p>
                                         <h3 className="text-lg md:text-3xl font-heading font-bold text-gray-900 dark:text-white leading-tight">{item.title}</h3>
                                     </div>
                                 </div>
                                 <div className={`p-2 md:p-3 rounded-full transition-transform duration-300 ${isOpen ? 'rotate-180 bg-gray-100 dark:bg-white/10' : ''}`}>
                                     <ChevronDown size={20} className={`md:w-7 md:h-7 ${isOpen ? 'text-primary-600 dark:text-white' : 'text-gray-400'}`} />
                                 </div>
                             </div>
                             
                             <div className={`px-6 md:px-8 md:pl-[8.5rem] md:pr-12 text-gray-600 dark:text-gray-300 font-ui text-base md:text-lg leading-relaxed transition-all duration-300 ease-in-out ${isOpen ? 'max-h-60 pb-8 md:pb-10 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                 {item.desc}
                             </div>
                         </div>
                     );
                 })}
             </div>
          </div>
      </section>

      {/* 7. Final CTA Section */}
      <section className="py-20 md:py-32 px-4 md:px-12 relative z-10 bg-gray-50 dark:bg-black transition-colors">
          <div className="max-w-[1400px] mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 via-purple-500 to-primary-400 opacity-20 dark:opacity-30 blur-[150px] rounded-full"></div>
              
              <div className="relative bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-[3rem] p-10 md:p-32 text-center overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500"></div>
                  
                  <h2 className="text-4xl md:text-7xl font-heading font-bold mb-6 md:mb-8 text-gray-900 dark:text-white">Ready to ship?</h2>
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto font-light">Join the next cohort of Vidana Bootcamp and transform your career in less than 2 weeks.</p>
                  
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                      <Link 
                        to="/login"
                        className="px-10 py-5 md:px-12 md:py-6 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-200 rounded-3xl font-bold text-lg md:text-xl shadow-2xl hover:scale-105 transition-transform flex items-center"
                      >
                         Start Your Journey <Zap size={24} className="ml-3 text-yellow-400 dark:text-primary-600 fill-current"/>
                      </Link>
                  </div>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 md:py-16 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#050505] text-center transition-colors">
         <div className="flex items-center justify-center space-x-3 mb-6 opacity-80">
             <div className="bg-primary-600 p-1.5 rounded-lg text-white">
                <BookOpen size={18} />
             </div>
             <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">Vidana Bootcamp</span>
         </div>
         <div className="flex justify-center space-x-8 mb-8 text-sm text-gray-500 font-medium">
            <button onClick={() => scrollToSection('curriculum')} className="hover:text-primary-600 transition-colors">Curriculum</button>
            <Link to="/login" className="hover:text-primary-600 transition-colors">Login</Link>
         </div>
         <p className="text-sm text-gray-400 dark:text-gray-600">© {new Date().getFullYear()} Vidana Bootcamp. Built for the future of code.</p>
      </footer>
    </div>
  );
};

export default Landing;
