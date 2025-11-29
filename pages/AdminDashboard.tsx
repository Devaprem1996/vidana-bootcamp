
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Users, RefreshCw, Clock, CheckCircle, Database, X, BookOpen, CheckSquare, Search, Circle, ChevronRight, Zap, Target, Award, MoreHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// Helper for Slide-over Panel (Student Inspector)
const StudentInspector: React.FC<{ 
  student: any; 
  topics: any[]; 
  modules: any[]; 
  onClose: () => void; 
}> = ({ student, topics, modules, onClose }) => {
  const [activeTopicSlug, setActiveTopicSlug] = useState(topics[0]?.slug || 'n8n');
  
  const topicProgress = student.progressDetails?.[activeTopicSlug] || {};
  const notes = topicProgress.notes || {};
  const completedDays = topicProgress.completed_days || [];
  
  const checklist = Array.isArray(notes['_capstone_checklist']) ? notes['_capstone_checklist'] : [];
  const dailyNoteKeys = Object.keys(notes).filter(k => !k.startsWith('_')).sort((a,b) => parseInt(a) - parseInt(b));
  
  const currentModules = modules
    .filter(m => m.topic_slug === activeTopicSlug)
    .sort((a, b) => a.day_number - b.day_number);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full md:max-w-2xl bg-[#F3F4F6] dark:bg-[#151921] shadow-2xl h-full overflow-y-auto animate-in slide-in-from-right duration-300 border-l border-white/20">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-[#1A1D24]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4 md:p-6 flex justify-between items-start">
           <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{student.studentName}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
              <div className="mt-2 flex items-center space-x-2">
                 <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${student.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'}`}>{student.role}</span>
                 <span className="text-xs text-gray-400">• Last Active: {student.lastActive}</span>
              </div>
           </div>
           <button onClick={onClose} className="p-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors shadow-sm">
              <X size={20} className="text-gray-500" />
           </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-8">
           
           {/* Topic Selector */}
           <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
              {topics.map(t => (
                 <button
                    key={t.slug}
                    onClick={() => setActiveTopicSlug(t.slug)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                       activeTopicSlug === t.slug 
                       ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 scale-105' 
                       : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                 >
                    {t.title}
                 </button>
              ))}
           </div>

           {/* Stats Summary */}
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-[#1A1D24] p-5 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
                 <div className="text-xs text-gray-400 uppercase font-bold mb-1">Completion</div>
                 <div className="text-3xl font-bold text-brand-600 dark:text-brand-400">{student[activeTopicSlug]}%</div>
              </div>
              <div className="bg-white dark:bg-[#1A1D24] p-5 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
                 <div className="text-xs text-gray-400 uppercase font-bold mb-1">Notes Written</div>
                 <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{dailyNoteKeys.length}</div>
              </div>
           </div>

            {/* Module Progress Tracker */}
           <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                 <CheckCircle className="mr-2 text-brand-500" size={20}/> Module Progress
              </h3>
              
              <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-gray-800 rounded-[1.5rem] overflow-hidden shadow-sm">
                  {currentModules.length > 0 ? (
                      <div className="divide-y divide-gray-100 dark:divide-gray-800">
                          {currentModules.map((module) => {
                              const isCompleted = completedDays.includes(module.day_number);
                              return (
                                  <div key={module.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                      <div className="flex items-center space-x-3">
                                          <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                                              isCompleted 
                                              ? 'bg-green-100 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' 
                                              : 'bg-gray-50 border-gray-200 text-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-600'
                                          }`}>
                                              {isCompleted ? <CheckCircle size={16} /> : <Circle size={16} />}
                                          </div>
                                          <div>
                                              <p className={`text-sm font-bold ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                                  Day {module.day_number}: {module.title}
                                              </p>
                                          </div>
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  ) : (
                      <div className="p-6 text-center text-gray-400 text-sm">
                          No modules found. Please run the seed script.
                      </div>
                  )}
              </div>
           </div>

           {/* Capstone Checklist */}
           <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                 <CheckSquare className="mr-2 text-purple-500" size={20}/> Capstone
              </h3>
              {checklist.length > 0 ? (
                 <div className="bg-white dark:bg-[#1A1D24] rounded-[1.5rem] p-5 border border-gray-100 dark:border-gray-800 space-y-3 shadow-sm">
                    {checklist.map((item: string, i: number) => (
                       <div key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 mr-3 shrink-0">
                              <CheckCircle size={12} />
                          </div>
                          <span className="line-through opacity-75">{item}</span>
                       </div>
                    ))}
                 </div>
              ) : (
                 <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-400 italic">No capstone tasks checked off yet.</p>
                 </div>
              )}
           </div>

           {/* Daily Notes */}
           <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                 <BookOpen className="mr-2 text-blue-500" size={20}/> Workbook Log
              </h3>
              
              <div className="space-y-4">
                 {dailyNoteKeys.length > 0 ? (
                    dailyNoteKeys.map((day) => (
                       <div key={day} className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-gray-800 rounded-[1.5rem] overflow-hidden shadow-sm">
                          <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                             <span className="font-bold text-sm text-gray-800 dark:text-gray-200">Day {day}</span>
                             {completedDays.includes(parseInt(day)) && (
                                <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-bold uppercase">Done</span>
                             )}
                          </div>
                          <div className="p-5 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                             {notes[day]}
                          </div>
                       </div>
                    ))
                 ) : (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                       <p className="text-gray-400 text-sm">No notes recorded.</p>
                    </div>
                 )}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [debugMsg, setDebugMsg] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const fetchStudentData = async () => {
    setLoading(true);
    setDebugMsg("Starting fetch...");
    try {
      const { data: topicsData } = await supabase.from('topics').select('*').order('slug');
      setTopics(topicsData || []);

      const { data: modulesData } = await supabase.from('modules').select('*');
      setModules(modulesData || []);

      const topicTotals: Record<string, number> = {};
      topicsData?.forEach((t: any) => { topicTotals[t.slug] = t.total_modules || 1; });

      const { data: profiles } = await supabase.from('profiles').select('*').neq('role', 'admin'); 
      const { data: progress } = await supabase.from('user_progress').select('*');

      if (!progress || progress.length === 0) {
          setDebugMsg("Warning: 0 progress records found. RLS Policy might be blocking access.");
      }

      const mergedData = profiles?.map(student => {
        const studentRow: any = {
          studentName: student.full_name || student.email,
          studentId: student.id,
          email: student.email,
          role: student.role,
          avatar: student.avatar_url,
          lastActiveRaw: null,
          progressDetails: {} 
        };

        let totalProgressPercent = 0;
        let activeTopicsCount = 0;

        topicsData?.forEach((topic: any) => {
          const p = progress?.find(prog => prog.user_id === student.id && prog.topic_slug === topic.slug);
          studentRow.progressDetails[topic.slug] = p || { completed_days: [], notes: {} };

          const completedCount = p?.completed_days?.length || 0;
          const total = topicTotals[topic.slug] || 10; 
          const percent = Math.round((completedCount / total) * 100);

          studentRow[topic.slug] = percent; 
          
          if (percent > 0) activeTopicsCount++;
          totalProgressPercent += percent;

          if (p?.last_active) {
             const date = new Date(p.last_active);
             if (!studentRow.lastActiveRaw || date > studentRow.lastActiveRaw) {
               studentRow.lastActiveRaw = date;
             }
          }
        });

        if (studentRow.lastActiveRaw) {
           const now = new Date();
           const diffMs = now.getTime() - studentRow.lastActiveRaw.getTime();
           const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
           const diffDays = Math.floor(diffHours / 24);

           if (diffHours < 1) studentRow.lastActive = "Just now";
           else if (diffHours < 24) studentRow.lastActive = `${diffHours}h ago`;
           else studentRow.lastActive = `${diffDays}d ago`;
        } else {
           studentRow.lastActive = "Never";
        }

        studentRow.averageProgress = activeTopicsCount > 0 ? Math.round(totalProgressPercent / topicsData!.length) : 0;
        return studentRow;
      });

      setStudents(mergedData || []);

    } catch (err: any) {
      console.error("Admin fetch error:", err);
      setDebugMsg(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (students.length === 0) return;
    const headers = ['Name', 'Email', 'Role', 'Last Active'];
    topics.forEach(t => headers.push(t.title));
    headers.push('Average Progress');
    const csvRows = students.map(student => {
      const row = [
        `"${student.studentName}"`,
        `"${student.email}"`,
        student.role,
        `"${student.lastActive}"`
      ];
      topics.forEach(t => row.push(student[t.slug] || 0));
      row.push(student.averageProgress);
      return row.join(',');
    });
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `vidana_cohort_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const filteredStudents = students.filter(s => 
     s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
     s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeStudents = students.filter(s => s.lastActive !== 'Never').length;
  const avgCompletion = students.length > 0 ? Math.round(students.reduce((acc, s) => acc + s.averageProgress, 0) / students.length) : 0;

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 dark:border-brand-400 mb-4"></div>
       <p className="text-gray-500 dark:text-gray-400 animate-pulse">Accessing mainframe...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative pb-20">
      
      {/* Student Inspector Modal */}
      {selectedStudent && (
        <StudentInspector 
            student={selectedStudent} 
            topics={topics} 
            modules={modules}
            onClose={() => setSelectedStudent(null)} 
        />
      )}

      {/* 1. Welcome Banner */}
      <div className="bg-white dark:bg-[#1A1D24] rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-100 to-purple-100 dark:from-brand-900/20 dark:to-purple-900/20 rounded-bl-[100%] -mr-10 -mt-10 opacity-60"></div>
         
         <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div>
               <div className="flex items-center space-x-2 mb-3">
                   <span className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center">
                     <Target size={12} className="mr-1"/> Admin Console
                   </span>
               </div>
               <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                   Cohort Overview
               </h1>
               <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg">
                   Manage intern progress, review workbooks, and export data.
               </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
               <button onClick={fetchStudentData} className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors shadow-sm flex justify-center items-center">
                   <RefreshCw size={20}/>
                   <span className="sm:hidden ml-2 font-bold">Refresh</span>
               </button>
               <button onClick={downloadCSV} className="flex items-center justify-center px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-lg shadow-brand-500/20 transition-all">
                   <Download size={18} className="mr-2"/> Export CSV
               </button>
            </div>
         </div>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white dark:bg-[#1A1D24] p-6 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group hover:border-brand-200 dark:hover:border-brand-800 transition-all">
             <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Interns</p>
                <h3 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">{students.length}</h3>
             </div>
             <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users size={24}/>
             </div>
         </div>
         <div className="bg-white dark:bg-[#1A1D24] p-6 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group hover:border-green-200 dark:hover:border-green-800 transition-all">
             <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Active This Week</p>
                <h3 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">{activeStudents}</h3>
             </div>
             <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap size={24}/>
             </div>
         </div>
         <div className="bg-white dark:bg-[#1A1D24] p-6 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group hover:border-purple-200 dark:hover:border-purple-800 transition-all">
             <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Avg Completion</p>
                <h3 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">{avgCompletion}%</h3>
             </div>
             <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award size={24}/>
             </div>
         </div>
      </div>

      {debugMsg && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl text-xs font-mono text-blue-800 dark:text-blue-300 flex items-center">
            <Database size={14} className="mr-2"/>
            Debug Log: {debugMsg}
        </div>
      )}

      {/* 3. Main Chart */}
      <div className="bg-white dark:bg-[#1A1D24] p-6 md:p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hidden md:block">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Topic Mastery by Intern</h3>
        <div className="h-96 w-full">
          {students.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={students} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis 
                    dataKey="studentName" 
                    stroke="#9CA3AF" 
                    tick={{fill: '#6B7280', fontSize: 12}} 
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis 
                    stroke="#9CA3AF" 
                    tick={{fill: '#6B7280', fontSize: 12}} 
                    tickLine={false} 
                    axisLine={false}
                    unit="%"
                />
                <Tooltip 
                  cursor={{fill: 'rgba(0,0,0,0.05)'}}
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: '#fff' }}
                />
                <Legend iconType="circle" />
                {topics.map((topic, index) => (
                    <Bar 
                        key={topic.slug} 
                        dataKey={topic.slug} 
                        name={topic.title} 
                        fill={['#6C5CE7', '#00D1B2', '#F472B6', '#FBBF24'][index % 4]} 
                        radius={[4, 4, 0, 0]} 
                        stackId="a" 
                        barSize={20}
                    />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Users size={48} className="mb-4 opacity-20"/>
                <p>No intern data available yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Student List */}
      <div className="bg-white dark:bg-[#1A1D24] rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
           <h3 className="text-lg font-bold text-gray-900 dark:text-white">Performance Log</h3>
           <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
              <input 
                 type="text" 
                 placeholder="Search by name or email..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm transition-all"
              />
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-6 py-5 font-bold tracking-wider">Intern</th>
                <th className="px-6 py-5 font-bold tracking-wider">Status</th>
                <th className="px-6 py-5 font-bold tracking-wider">Last Active</th>
                {topics.map(t => (
                    <th key={t.slug} className="px-6 py-5 font-bold tracking-wider">{t.title}</th>
                ))}
                <th className="px-6 py-5 font-bold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredStudents.map((student, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4">
                      <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-100 to-purple-100 dark:from-brand-900/50 dark:to-purple-900/50 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold mr-4 shadow-sm border border-white dark:border-gray-700 shrink-0">
                              {student.studentName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                              <div className="font-bold text-gray-900 dark:text-white text-base">{student.studentName}</div>
                              <div className="text-xs text-gray-500">{student.email}</div>
                          </div>
                      </div>
                  </td>
                  <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          student.averageProgress > 75 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          student.averageProgress > 30 ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400' :
                          'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                          {student.averageProgress > 75 ? 'On Track' : student.averageProgress > 30 ? 'In Progress' : 'Starting'}
                      </span>
                  </td>
                  <td className="px-6 py-4">
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Clock size={14} className="mr-2 opacity-70"/>
                          {student.lastActive}
                      </div>
                  </td>

                  {topics.map(t => {
                      const score = student[t.slug] || 0;
                      let colorClass = 'bg-gray-200 dark:bg-gray-700';
                      if (score === 100) colorClass = 'bg-green-500';
                      else if (score > 50) colorClass = 'bg-brand-500';
                      else if (score > 0) colorClass = 'bg-orange-400';

                      return (
                        <td key={t.slug} className="px-6 py-4 align-middle">
                            <div className="w-full max-w-[80px]">
                                <div className="flex justify-between text-[10px] mb-1.5 text-gray-500 font-medium">
                                    <span>{score}%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                                    <div className={`h-1.5 rounded-full ${colorClass}`} style={{ width: `${score}%` }}></div>
                                </div>
                            </div>
                        </td>
                      );
                  })}

                  <td className="px-6 py-4 text-right">
                    <button 
                        onClick={() => setSelectedStudent(student)}
                        className="p-2 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                    >
                        <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredStudents.length === 0 && !loading && (
                <tr>
                   <td colSpan={topics.length + 4} className="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                       <div className="flex flex-col items-center">
                           <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-full mb-4">
                              <Users size={32} className="opacity-40"/>
                           </div>
                           <p>No interns found matching your search.</p>
                       </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
