
import React, { useEffect, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Play, ArrowRight, Workflow, Code, MessageSquare, Cpu, CheckCircle, MoreHorizontal, Clock, Star, Zap } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Topic } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
// Fallback data
import { TOPICS as MOCK_TOPICS } from '../store/mockData';

const { Link } = ReactRouterDOM as any;

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  // Soft UI Colors for Charts
  const COLORS = ['#F472B6', '#38BDF8', '#A78BFA', '#34D399'];
  const EMPTY_COLOR = '#F3F4F6';

  const handleFeatureClick = (feature: string) => {
      showToast(`${feature} module coming soon!`, 'info');
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const { data: topicsData } = await supabase.from('topics').select('*');
        const { data: progressData } = await supabase.from('user_progress').select('*').eq('user_id', user.id);

        const mergedTopics = (topicsData && topicsData.length > 0 ? topicsData : MOCK_TOPICS).map((t: any) => {
          const userProg = progressData?.find(p => p.topic_slug === t.slug);
          const completedCount = userProg?.completed_days?.length || 0;
          const total = t.total_modules || 1;
          const percentage = Math.round((completedCount / total) * 100);

          return {
            id: t.id,
            slug: t.slug,
            title: t.title,
            description: t.description,
            icon: t.icon,
            totalModules: total,
            completedModules: completedCount,
            progress: percentage
          };
        });

        // Sort: In Progress first, then Not Started, then Completed
        mergedTopics.sort((a, b) => {
            if (a.progress > 0 && a.progress < 100) return -1;
            if (b.progress > 0 && b.progress < 100) return 1;
            return 0;
        });

        setTimeout(() => {
             setTopics(mergedTopics);
             setLoading(false);
        }, 500);

      } catch (error) {
        console.error('Error loading dashboard:', error);
        setTopics(MOCK_TOPICS);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getIcon = (slug: string) => {
    switch(slug) {
      case 'n8n': return Workflow;
      case 'vibe-coding': return Code;
      case 'prompt-engineering': return MessageSquare;
      default: return Cpu;
    }
  };

  const getTopicColor = (slug: string) => {
    switch(slug) {
      case 'n8n': return 'bg-orange-100 text-orange-600';
      case 'vibe-coding': return 'bg-purple-100 text-purple-600';
      case 'prompt-engineering': return 'bg-pink-100 text-pink-600';
      default: return 'bg-blue-100 text-blue-600';
    }
  };

  const overallProgress = Math.round(topics.reduce((acc, t) => acc + t.progress, 0) / Math.max(topics.length, 1));
  const activeTasks = topics.filter(t => t.progress > 0 && t.progress < 100);

  // Skeleton Loader for Cards
  const CardLoader = () => (
     <div className="bg-white dark:bg-[#1A1D24] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse flex items-center justify-between">
         <div className="flex items-center space-x-4">
             <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
             <div>
                 <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                 <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
             </div>
         </div>
         <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
     </div>
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      
      {/* LEFT COLUMN (Main Content) */}
      <div className="xl:col-span-2 space-y-8">
        
        {/* Welcome Banner - Soft UI */}
        <div className="bg-white dark:bg-[#1A1D24] rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-bl-[100%] -mr-10 -mt-10 opacity-60 group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="relative z-10 max-w-lg">
                <div className="flex items-center space-x-2 mb-3">
                   <span className="bg-red-50 dark:bg-red-900/30 text-red-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Edit Mode</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white mb-3">
                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Vidana!</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-6 leading-relaxed">
                    Ready to accelerate your career? You have <span className="font-bold text-gray-800 dark:text-gray-200">{activeTasks.length} active modules</span> prioritized for today.
                </p>
                <div className="flex space-x-4">
                    <button onClick={() => handleFeatureClick('Schedule')} className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                        View Schedule
                    </button>
                    <button onClick={() => handleFeatureClick('Preferences')} className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Edit Preferences
                    </button>
                </div>
            </div>
            
            {/* Illustration Placeholder (Right Side) */}
            <div className="hidden md:block absolute bottom-8 right-8">
                <div className="w-24 h-24 bg-white dark:bg-gray-700 rounded-2xl shadow-xl rotate-12 flex items-center justify-center text-4xl transform group-hover:rotate-6 transition-transform">
                   🚀
                </div>
                 <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/40 rounded-2xl shadow-lg -rotate-12 absolute -top-10 -left-10 flex items-center justify-center text-2xl transform group-hover:-rotate-6 transition-transform">
                   ✨
                </div>
            </div>
        </div>

        {/* Task List (Learning Paths) */}
        <div>
           <div className="flex justify-between items-end mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Learning Modules</h2>
              <div className="flex space-x-2 text-sm font-medium text-gray-400">
                  <span className="text-gray-800 dark:text-white cursor-pointer border-b-2 border-brand-500 pb-1">Overview</span>
                  <span className="hover:text-gray-600 cursor-pointer pb-1">Active</span>
                  <span className="hover:text-gray-600 cursor-pointer pb-1">Completed</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {loading ? (
                 <>
                   <CardLoader />
                   <CardLoader />
                   <CardLoader />
                   <CardLoader />
                 </>
              ) : (
                 topics.map((topic, idx) => {
                     const Icon = getIcon(topic.slug);
                     const colorClass = getTopicColor(topic.slug);
                     const isStarted = topic.progress > 0;
                     const isCompleted = topic.progress === 100;
                     
                     return (
                         <div key={topic.id} className="bg-white dark:bg-[#1A1D24] p-6 rounded-[1.5rem] shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all duration-300 group flex flex-col justify-between h-48 relative overflow-hidden">
                             
                             {/* Top Row */}
                             <div className="flex justify-between items-start mb-4 relative z-10">
                                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass}`}>
                                     <Icon size={22} strokeWidth={2.5}/>
                                 </div>
                                 <button onClick={() => handleFeatureClick('Module Settings')} className="text-gray-300 hover:text-gray-500 transition-colors">
                                     <MoreHorizontal size={20}/>
                                 </button>
                             </div>

                             {/* Content */}
                             <div className="relative z-10">
                                 <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1 group-hover:text-brand-600 transition-colors">{topic.title}</h3>
                                 <div className="flex items-center text-xs text-gray-400 font-medium mb-4">
                                     <Clock size={12} className="mr-1"/> 
                                     <span>{topic.completedModules} / {topic.totalModules} Modules</span>
                                 </div>

                                 {/* Status Pill */}
                                 <div className="flex justify-between items-center">
                                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                         isCompleted ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                         isStarted ? 'bg-pink-50 text-pink-500 dark:bg-pink-900/30 dark:text-pink-400' :
                                         'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                     }`}>
                                         {isCompleted ? 'Completed' : isStarted ? 'In Progress' : 'Not Started'}
                                     </span>
                                     
                                     <Link to={`/topic/${topic.slug}`} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-brand-600 hover:text-white transition-all transform group-hover:rotate-45">
                                         <ArrowRight size={14} />
                                     </Link>
                                 </div>
                             </div>

                             {/* Background Progress Bar (Subtle) */}
                             <div className="absolute bottom-0 left-0 h-1.5 bg-gray-50 dark:bg-gray-800 w-full">
                                 <div className="h-full bg-gradient-to-r from-brand-400 to-purple-400 opacity-50" style={{ width: `${topic.progress}%` }}></div>
                             </div>
                         </div>
                     );
                 })
              )}
           </div>
        </div>

      </div>

      {/* RIGHT COLUMN (Stats & Profile) */}
      <div className="xl:col-span-1 space-y-8">
         
         {/* Profile Card */}
         <div className="bg-white dark:bg-[#1A1D24] rounded-[2rem] p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800">
             <div className="relative inline-block mb-4">
                 <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-pink-500 to-brand-500">
                    <img 
                        src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} 
                        alt="Profile" 
                        className="w-full h-full rounded-full border-4 border-white dark:border-gray-800 object-cover"
                    />
                 </div>
                 <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-gray-800"></div>
             </div>
             <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Good morning, {user?.name?.split(' ')[0]}!</h2>
             <p className="text-gray-400 text-sm mb-6">{user?.email}</p>
             
             <div className="flex justify-center space-x-8 border-t border-gray-100 dark:border-gray-800 pt-6">
                 <div>
                     <span className="block text-2xl font-bold text-gray-800 dark:text-white">{topics.reduce((acc, t) => acc + t.completedModules, 0)}</span>
                     <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Modules</span>
                 </div>
             </div>
         </div>

         {/* Circular Stats */}
         <div className="bg-white dark:bg-[#1A1D24] rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800">
             <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Your Progress</h3>
             
             {/* Stat 1: Overall */}
             <div className="flex items-center justify-between mb-6">
                 <div className="relative w-20 h-20">
                     <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                             <Pie
                                data={[{ value: overallProgress }, { value: 100 - overallProgress }]}
                                innerRadius={28}
                                outerRadius={38}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                                stroke="none"
                             >
                                 <Cell fill="#F472B6" />
                                 <Cell fill={EMPTY_COLOR} />
                             </Pie>
                         </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                         {overallProgress}%
                     </div>
                 </div>
                 <div className="flex-1 ml-4">
                     <h4 className="font-bold text-gray-800 dark:text-white">Total Completion</h4>
                     <p className="text-xs text-gray-400 mt-1">Across all learning paths</p>
                 </div>
             </div>

             {/* Stat 2: Active */}
             <div className="flex items-center justify-between">
                 <div className="relative w-20 h-20">
                     <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                             <Pie
                                data={[{ value: (activeTasks.length / Math.max(topics.length, 1)) * 100 }, { value: 100 - (activeTasks.length / Math.max(topics.length, 1)) * 100 }]}
                                innerRadius={28}
                                outerRadius={38}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                                stroke="none"
                             >
                                 <Cell fill="#38BDF8" />
                                 <Cell fill={EMPTY_COLOR} />
                             </Pie>
                         </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                         {activeTasks.length}
                     </div>
                 </div>
                 <div className="flex-1 ml-4">
                     <h4 className="font-bold text-gray-800 dark:text-white">Active Modules</h4>
                     <p className="text-xs text-gray-400 mt-1">Courses currently in progress</p>
                 </div>
             </div>

         </div>
         
         {/* Mini Promo Card */}
         <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-[2rem] p-8 text-white shadow-lg relative overflow-hidden">
             <div className="relative z-10">
                 <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                     <Star fill="currentColor" className="text-yellow-300" size={20}/>
                 </div>
                 <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
                 <p className="text-purple-100 text-sm mb-4">Complete 3 modules this week to earn the "Fast Learner" badge.</p>
                 <button onClick={() => handleFeatureClick('Badges')} className="text-xs font-bold bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors">
                     View Badges
                 </button>
             </div>
             <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
         </div>

      </div>
    </div>
  );
};

export default Dashboard;
