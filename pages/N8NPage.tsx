
import React, { useState } from 'react';
import { N8N_CURRICULUM, N8N_RESOURCES } from '../store/mockData';
import { 
  CheckCircle, Circle, Play, FileText, Download, 
  ChevronDown, ChevronUp, BookOpen, Clock, AlertTriangle, 
  Calendar, GraduationCap, Workflow,
  CheckSquare, Printer, Settings, Award, BarChart3,
  Video, Shield, Mail, Database, Layers, AlertCircle, Lock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Tab = 'dashboard' | 'learning' | 'workbook' | 'resources' | 'assessment' | 'setup' | 'instructor';

const N8NPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [completedDays, setCompletedDays] = useState<number[]>(
    N8N_CURRICULUM.filter(d => d.isCompleted).map(d => d.day)
  );

  const toggleDayCompletion = (day: number) => {
    if (completedDays.includes(day)) {
      setCompletedDays(completedDays.filter(d => d !== day));
    } else {
      setCompletedDays([...completedDays, day]);
    }
  };

  // --- Visualizations for Days ---
  const renderInfographic = (day: number) => {
    switch(day) {
      case 1: // Mental Model 3-box
        return (
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 py-4">
            <div className="w-24 h-24 bg-white border-2 border-dashed border-gray-400 rounded-xl flex flex-col items-center justify-center shadow-sm">
                <span className="text-xs font-bold text-gray-500 uppercase">Input</span>
                <span className="text-lg font-bold text-gray-800">Trigger</span>
            </div>
            <div className="hidden md:block w-12 h-0.5 bg-gray-400 relative"><div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-gray-400 rotate-45"></div></div>
            <div className="block md:hidden h-8 w-0.5 bg-gray-400 relative"><div className="absolute bottom-0 -left-1 w-2 h-2 border-b-2 border-r-2 border-gray-400 rotate-45"></div></div>
            <div className="w-24 h-24 bg-brand-50 border-2 border-brand-500 rounded-xl flex flex-col items-center justify-center shadow-sm">
                <span className="text-xs font-bold text-brand-600 uppercase">Process</span>
                <span className="text-lg font-bold text-brand-800">Nodes</span>
            </div>
            <div className="hidden md:block w-12 h-0.5 bg-gray-400 relative"><div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-gray-400 rotate-45"></div></div>
            <div className="block md:hidden h-8 w-0.5 bg-gray-400 relative"><div className="absolute bottom-0 -left-1 w-2 h-2 border-b-2 border-r-2 border-gray-400 rotate-45"></div></div>
            <div className="w-24 h-24 bg-green-50 border-2 border-green-500 rounded-xl flex flex-col items-center justify-center shadow-sm">
                <span className="text-xs font-bold text-green-600 uppercase">Output</span>
                <span className="text-lg font-bold text-green-800">Action</span>
            </div>
          </div>
        );
      case 2: // Data flow
        return (
            <div className="flex justify-center py-4 space-x-2">
                <div className="bg-gray-800 text-white text-xs p-3 rounded font-mono w-32 shadow-lg">
                    {`[
  { "id": 1, "name": "A" },
  { "id": 2, "name": "B" }
]`}
                </div>
                <div className="flex flex-col justify-center items-center px-2">
                   <div className="text-xs text-gray-500 mb-1">Pass Through</div>
                   <div className="w-16 h-1 bg-brand-500 rounded"></div>
                </div>
                <div className="bg-gray-800 text-white text-xs p-3 rounded font-mono w-32 shadow-lg border-2 border-brand-400">
                     {`[
  { "id": 1, "name": "A", "role": "User" },
  { "id": 2, "name": "B", "role": "User" }
]`}
                </div>
            </div>
        );
      case 3: // Logic
         return (
             <div className="flex flex-col items-center py-4">
                 <div className="bg-white border-2 border-gray-300 px-4 py-2 rounded-lg font-bold text-xs">Start</div>
                 <div className="h-6 w-0.5 bg-gray-400"></div>
                 <div className="bg-yellow-50 border-2 border-yellow-500 px-6 py-4 rounded-lg font-bold transform rotate-0 shadow-sm relative">
                    <span className="text-yellow-900">IF Node</span>
                    <div className="absolute -bottom-6 -left-4 w-0.5 h-6 bg-gray-400 rotate-45 origin-top"></div>
                    <div className="absolute -bottom-6 -right-4 w-0.5 h-6 bg-gray-400 -rotate-45 origin-top"></div>
                 </div>
                 <div className="flex space-x-16 mt-6">
                     <div className="text-center">
                         <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded">True</span>
                         <div className="mt-2 w-12 h-12 bg-green-100 border-2 border-green-500 rounded flex items-center justify-center text-xs">Email</div>
                     </div>
                     <div className="text-center">
                         <span className="text-xs text-red-600 font-bold bg-red-100 px-2 py-1 rounded">False</span>
                         <div className="mt-2 w-12 h-12 bg-red-100 border-2 border-red-500 rounded flex items-center justify-center text-xs">Slack</div>
                     </div>
                 </div>
             </div>
         );
      case 4: // Email & Routing
        return (
          <div className="flex items-center justify-center space-x-4 py-4">
             <div className="w-20 h-20 bg-blue-50 border border-blue-200 rounded-lg flex flex-col items-center justify-center">
                <Mail size={24} className="text-blue-500" />
                <span className="text-[10px] mt-2 font-bold text-blue-800">New Email</span>
             </div>
             <div className="w-8 h-0.5 bg-gray-400"></div>
             <div className="w-20 h-20 bg-white border-2 border-brand-500 rounded-full flex flex-col items-center justify-center z-10">
                <span className="text-[10px] font-bold">Subject?</span>
             </div>
             <div className="flex flex-col space-y-8">
                <div className="flex items-center">
                   <div className="w-8 h-0.5 bg-gray-400 -ml-4 rotate-[-30deg] origin-left"></div>
                   <div className="bg-red-50 px-3 py-1 rounded text-xs text-red-700 font-bold border border-red-200">Urgent</div>
                </div>
                <div className="flex items-center">
                   <div className="w-8 h-0.5 bg-gray-400 -ml-4 rotate-[30deg] origin-left"></div>
                   <div className="bg-gray-50 px-3 py-1 rounded text-xs text-gray-700 font-bold border border-gray-200">General</div>
                </div>
             </div>
          </div>
        );
      case 5: // OAuth & API
        return (
           <div className="flex items-center justify-center space-x-2 py-4">
              <div className="border border-gray-300 p-4 rounded-lg bg-white relative">
                  <span className="text-xs font-bold text-gray-500 block mb-2">n8n Credential</span>
                  <div className="flex items-center text-brand-600">
                    <Lock size={16} className="mr-1"/> <span className="text-xs font-mono">OAuth2</span>
                  </div>
              </div>
              <div className="w-12 border-t-2 border-dashed border-gray-400 animate-pulse"></div>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center space-x-2">
                 <Database size={20} className="text-green-600"/>
                 <div>
                    <span className="block text-xs font-bold text-green-800">Google Sheets</span>
                    <span className="block text-[10px] text-green-600">Read/Write Access</span>
                 </div>
              </div>
           </div>
        );
      case 6: // Architecture
      case 7:
      case 8:
        return (
           <div className="flex flex-col items-center justify-center py-2">
              <div className="flex items-center space-x-4 mb-4">
                  <div className="w-24 h-16 bg-white border border-gray-300 rounded-lg shadow-sm flex items-center justify-center">
                      <span className="text-xs text-gray-400 font-bold">Trigger</span>
                  </div>
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                  <div className="w-32 h-20 bg-brand-50 border-2 border-brand-200 rounded-lg shadow-sm flex flex-col items-center justify-center">
                      <Layers size={20} className="text-brand-500 mb-1"/>
                      <span className="text-xs text-brand-700 font-bold">Main Logic</span>
                  </div>
              </div>
              <div className="flex space-x-4">
                 <div className="w-0.5 h-6 bg-gray-300"></div>
                 <div className="w-0.5 h-6 bg-gray-300"></div>
              </div>
              <div className="flex space-x-4">
                 <div className="w-24 h-12 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-[10px]">Sub-workflow A</div>
                 <div className="w-24 h-12 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-[10px]">Sub-workflow B</div>
              </div>
           </div>
        );
      case 9: // Error Handling
         return (
             <div className="flex items-center justify-center py-4 relative">
                <div className="w-full max-w-sm bg-gray-50 rounded-lg p-4 border border-gray-200 opacity-50">
                    {/* Ghost workflow */}
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        <div className="w-8 h-0.5 bg-gray-300"></div>
                        <div className="w-8 h-8 bg-red-100 border border-red-300 rounded-full flex items-center justify-center">
                             <AlertCircle size={16} className="text-red-500" />
                        </div>
                        <div className="w-8 h-0.5 bg-dashed bg-gray-300"></div>
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
                {/* Error Node Overlay */}
                <div className="absolute top-1 right-10 bg-white border-2 border-red-500 rounded-xl p-3 shadow-xl flex items-center space-x-3">
                    <div className="bg-red-100 p-2 rounded-full">
                        <Workflow size={20} className="text-red-600"/>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-red-600 uppercase block">Error Trigger</span>
                        <span className="text-xs text-gray-600">Catches any failure</span>
                    </div>
                </div>
             </div>
         );
      default:
        return (
            <div className="h-32 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                <Workflow className="mr-2" />
                <span className="text-sm font-medium">Concept Visualization (Day {day})</span>
            </div>
        );
    }
  }

  // --- Sub-Components for Tabs ---

  const DashboardTab = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Duration</div>
            <div className="text-2xl font-bold text-gray-900">1.5 Weeks</div>
            <div className="text-xs text-gray-400 mt-2">Part-time paced</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Workflows</div>
            <div className="text-2xl font-bold text-brand-600">12+</div>
            <div className="text-xs text-gray-400 mt-2">Hands-on practice</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Capstone</div>
            <div className="text-2xl font-bold text-purple-600">1 Project</div>
            <div className="text-xs text-gray-400 mt-2">Portfolio ready</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Certificate</div>
            <div className="flex items-center text-2xl font-bold text-green-600">
                <Award className="mr-2" size={24}/> Ready
            </div>
             <div className="text-xs text-gray-400 mt-2">Upon completion</div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900">Course Timeline</h3>
             <span className="text-sm text-gray-500">{completedDays.length} / 9 Days Completed</span>
        </div>
        
        <div className="relative pb-8 overflow-x-auto">
          <div className="hidden md:block absolute top-4 left-0 w-full h-1 bg-gray-100 rounded"></div>
          <div className="flex md:justify-between min-w-max md:min-w-0 space-x-6 md:space-x-0 px-2">
            {N8N_CURRICULUM.map((day) => {
                const isDone = completedDays.includes(day.day);
                return (
                    <div key={day.day} className="flex flex-col items-center relative z-10 group cursor-pointer" onClick={() => setActiveTab('learning')}>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            isDone 
                            ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-200' 
                            : 'bg-white border-gray-300 text-gray-400 hover:border-brand-400 hover:text-brand-500'
                        }`}>
                            {isDone ? <CheckCircle size={18} /> : <span className="text-sm font-bold">{day.day}</span>}
                        </div>
                        <div className="text-center mt-3">
                            <span className={`text-xs font-bold block ${isDone ? 'text-green-600' : 'text-gray-500'}`}>Day {day.day}</span>
                            <span className="text-[10px] text-gray-400 max-w-[60px] truncate block md:hidden lg:block" title={day.title}>{day.title}</span>
                        </div>
                    </div>
                );
            })}
          </div>
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="bg-gradient-to-r from-brand-50 to-blue-50 p-6 rounded-xl border border-brand-100 flex items-start space-x-5">
        <div className="bg-white p-3 rounded-xl shadow-sm text-brand-600 hidden sm:block">
            <BookOpen size={28} />
        </div>
        <div>
            <h4 className="font-bold text-brand-900 text-lg">Getting Started with n8n</h4>
            <p className="text-brand-800 text-sm mt-2 leading-relaxed max-w-2xl">
                Welcome to the automation bootcamp! Before diving into Day 1, ensure you have set up your local n8n instance or have access to the cloud workspace. 
                Go to the <strong>Setup Tab</strong> to run through the pre-flight checklist.
            </p>
            <div className="mt-4 flex space-x-3">
                <button onClick={() => setActiveTab('setup')} className="px-4 py-2 bg-white text-brand-700 text-sm font-medium rounded-lg shadow-sm hover:bg-brand-50 border border-brand-200 transition-colors">
                    Go to Setup
                </button>
                <button onClick={() => setActiveTab('learning')} className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg shadow-md shadow-brand-200 hover:bg-brand-700 transition-colors">
                    Start Day 1
                </button>
            </div>
        </div>
      </div>
    </div>
  );

  const LearningTab = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider">Curriculum</h3>
            <span className="text-xs text-gray-400">Click to expand details</span>
        </div>
        {N8N_CURRICULUM.map((day) => {
            const isDone = completedDays.includes(day.day);
            return (
                <div key={day.day} className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ${
                    expandedDay === day.day ? 'shadow-md ring-1 ring-brand-100 border-brand-200' : 'shadow-sm border-gray-200 hover:border-gray-300'
                }`}>
                    {/* Header */}
                    <div 
                        className={`p-5 flex items-center justify-between cursor-pointer ${expandedDay === day.day ? 'bg-brand-50/30' : 'bg-white'}`}
                        onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm transition-colors ${
                                isDone ? 'bg-green-100 text-green-700' : 'bg-white border border-gray-200 text-gray-500'
                            }`}>
                                {isDone ? <CheckCircle size={24} /> : day.day}
                            </div>
                            <div>
                                <h3 className={`font-bold text-lg ${isDone ? 'text-gray-900' : 'text-gray-700'}`}>{day.title}</h3>
                                <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                    <span className="flex items-center bg-gray-100 px-2 py-0.5 rounded text-gray-600"><Clock size={12} className="mr-1"/> {day.timeEstimate}</span>
                                    <span>•</span>
                                    <span>{day.outcomes.length} Outcomes</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {isDone && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded hidden sm:block">COMPLETED</span>}
                            {expandedDay === day.day ? <ChevronUp size={20} className="text-brand-500"/> : <ChevronDown size={20} className="text-gray-400"/>}
                        </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedDay === day.day && (
                        <div className="p-6 border-t border-gray-100 space-y-8">
                            
                            {/* Infographic Section */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-purple-400"></div>
                                <h4 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-wider text-center flex items-center justify-center">
                                    <Video size={14} className="mr-2" /> Concept Visualization
                                </h4>
                                {renderInfographic(day.day)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Outcomes */}
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-3 flex items-center"><Award size={18} className="mr-2 text-brand-600"/> Learning Outcomes</h4>
                                    <ul className="space-y-3">
                                        {day.outcomes.map((outcome, idx) => (
                                            <li key={idx} className="flex items-start space-x-3 text-sm text-gray-600 group">
                                                <div className="mt-0.5 w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-white group-hover:border-brand-500 group-hover:bg-brand-50 transition-colors">
                                                    <CheckCircle size={12} className="opacity-0 group-hover:opacity-100 text-brand-600" />
                                                </div>
                                                <span className="group-hover:text-gray-900 transition-colors">{outcome}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Deep Dive */}
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-3 flex items-center"><BookOpen size={18} className="mr-2 text-purple-600"/> Key Concepts</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {day.keyConcepts.map((concept, idx) => (
                                            <span key={idx} className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs rounded-lg font-medium border border-purple-100 shadow-sm">
                                                {concept}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-6">
                                        <h4 className="font-bold text-gray-900 mb-2 text-sm">Description</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">{day.description} In this module, we will explore practical examples and build real-time execution flows.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Homework Section */}
                            <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-xl flex flex-col md:flex-row gap-4">
                                <div className="shrink-0 pt-1">
                                    <div className="bg-yellow-100 p-2 rounded-lg text-yellow-700">
                                        <FileText size={24} />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-yellow-900 text-sm uppercase tracking-wide mb-1">Homework Task</h4>
                                    <p className="text-sm text-yellow-800 font-medium">{day.homework}</p>
                                    <p className="text-xs text-yellow-600 mt-2">Time estimate: 45 mins • Submit in Workbook Tab</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <div className="text-xs text-gray-400">
                                    Have questions? <a href="#" className="text-brand-600 hover:underline">Check Q&A</a>
                                </div>
                                <button 
                                    onClick={() => toggleDayCompletion(day.day)}
                                    className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                        isDone 
                                        ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' 
                                        : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-200'
                                    }`}
                                >
                                    {isDone ? 'Mark as Incomplete' : 'Mark Complete'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            );
        })}
    </div>
  );

  const ResourcesTab = () => (
    <div className="space-y-10 animate-in fade-in duration-300">
        <div className="bg-blue-900 text-white p-6 rounded-xl flex justify-between items-center bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center blend-overlay">
            <div className="bg-blue-900/80 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-1">Resource Library</h3>
                <p className="text-blue-100">Curated videos, workflows, and cheat sheets.</p>
            </div>
            <button className="bg-white text-blue-900 px-4 py-2 rounded-lg font-bold text-sm shadow-lg hover:bg-blue-50 transition-colors hidden sm:block">
                Request a Topic
            </button>
        </div>

        {/* Video Categories */}
        {['Fundamentals', 'Google Sheets', 'Error Handling', 'Best Practices', 'RAG & Advanced'].map((category) => {
            const categoryResources = N8N_RESOURCES.filter(r => r.tags?.includes(category));
            if (categoryResources.length === 0) return null;

            return (
                <div key={category}>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <span className="w-1 h-6 bg-brand-500 rounded-full mr-3"></span>
                        {category} Series
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryResources.map(resource => (
                            <div key={resource.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer">
                                <div className="aspect-video bg-gray-100 flex items-center justify-center relative group-hover:bg-gray-200 transition-colors">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                        <Play size={20} className="text-brand-600 ml-1" />
                                    </div>
                                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded">
                                        {resource.duration}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                            resource.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                            resource.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>{resource.difficulty}</span>
                                        <span className="text-xs text-gray-400 flex items-center"><Video size={10} className="mr-1"/> Video</span>
                                    </div>
                                    <h4 className="font-bold text-gray-900 leading-tight mb-2 text-sm line-clamp-2">{resource.title}</h4>
                                    <p className="text-xs text-gray-500">{resource.channel}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        })}

        <div className="border-t border-gray-200 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Downloadable Workflows</h3>
                <div className="space-y-3">
                     {[1,2,3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div className="flex items-center space-x-3">
                                <div className="bg-purple-100 p-2 rounded-lg text-purple-600 group-hover:bg-purple-200">
                                    <Workflow size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">Workflow Template {i}: Email Parser</p>
                                    <p className="text-xs text-gray-500">JSON • 12kb</p>
                                </div>
                            </div>
                            <Download size={16} className="text-gray-400 group-hover:text-gray-600" />
                        </div>
                     ))}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Reference Cards</h3>
                <div className="space-y-3">
                     <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                        <div className="flex items-center space-x-3">
                            <div className="bg-red-100 p-2 rounded-lg text-red-600 group-hover:bg-red-200">
                                <FileText size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">Cron Expression Cheat Sheet</p>
                                <p className="text-xs text-gray-500">PDF • Printable</p>
                            </div>
                        </div>
                        <Printer size={16} className="text-gray-400 group-hover:text-gray-600" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  const WorkbookTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
        <div className="lg:col-span-2 space-y-6">
            {/* Note Editor */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 flex items-center"><BookOpen className="mr-2 text-brand-600" size={20}/> Daily Log</h3>
                    <span className="text-xs text-gray-400">Last saved: Just now</span>
                </div>
                <div className="space-y-4">
                    <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-shadow">
                        {N8N_CURRICULUM.map(d => <option key={d.day}>Day {d.day}: {d.title}</option>)}
                    </select>
                    <div className="relative">
                        <textarea 
                            className="w-full h-48 p-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none text-sm leading-relaxed"
                            placeholder="• key takeaway 1&#10;• key takeaway 2&#10;• paste workflow JSON snippet..."
                        ></textarea>
                        <div className="absolute bottom-3 right-3 flex space-x-2">
                            <button className="p-1.5 text-gray-400 hover:text-gray-600 bg-gray-100 rounded"><Download size={14}/></button>
                        </div>
                    </div>
                    <button className="px-6 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors w-full sm:w-auto">
                        Save Entry
                    </button>
                </div>
            </div>

            {/* Capstone Planner */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900 flex items-center"><Workflow className="mr-2 text-purple-600" size={20}/> Capstone Project Planner</h3>
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded">Phase 1: Planning</span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 mb-6 border border-gray-100">
                    <strong>Objective:</strong> Build a complete end-to-end automation that solves a real business problem. Must include 3+ nodes, error handling, and external API.
                </div>
                
                <div className="space-y-3">
                    {['Define Problem Statement', 'Sketch Architecture Diagram', 'List API Requirements', 'Core Logic Implementation', 'Error Handling Layer', 'Final Testing'].map((task, i) => (
                        <label key={i} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                            <input type="checkbox" className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-gray-300" />
                            <span className="text-sm font-medium text-gray-700">{task}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>

        {/* Sidebar Tracker */}
        <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-6">Progress Tracker</h3>
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-xs mb-2">
                            <span className="font-semibold text-gray-600">Course Completion</span>
                            <span className="font-bold text-brand-600">{Math.round((completedDays.length / 9) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div className="bg-brand-600 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${(completedDays.length / 9) * 100}%` }}></div>
                        </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-100">
                        <h4 className="text-xs font-bold uppercase text-gray-400 mb-4 tracking-wider">Homework Status</h4>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {N8N_CURRICULUM.map((day) => (
                                <div key={day.day} className="flex justify-between items-center text-sm group">
                                    <span className="text-gray-600">Day {day.day}</span>
                                    {completedDays.includes(day.day) ? (
                                        <span className="flex items-center text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded font-medium">
                                            <CheckCircle size={12} className="mr-1"/> Done
                                        </span>
                                    ) : (
                                        <span className="text-gray-300 text-xs flex items-center group-hover:text-gray-400 transition-colors">
                                            <Circle size={10} className="mr-1" /> Pending
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-2">Self Assessment</h3>
                <p className="text-purple-100 text-xs mb-4">Rate your confidence level for this week's topics.</p>
                <button className="w-full py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors">
                    Start Quiz
                </button>
            </div>
        </div>
    </div>
  );

  const AssessmentTab = () => (
      <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4 text-brand-600">
                      <CheckSquare size={24} />
                      <h3 className="text-lg font-bold text-gray-900">Homework Rubric</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-6">Daily assignments are graded on a 0-3 point scale.</p>
                  <div className="space-y-4">
                      <div className="flex items-start p-3 bg-green-50 rounded-lg">
                          <span className="font-bold text-green-700 w-8 text-lg">3</span>
                          <div className="text-sm text-green-800"><span className="font-bold">Excellent:</span> Workflow runs perfectly, handles edge cases, and is well annotated.</div>
                      </div>
                      <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                          <span className="font-bold text-blue-700 w-8 text-lg">2</span>
                          <div className="text-sm text-blue-800"><span className="font-bold">Good:</span> Workflow achieves main goal but lacks cleanup or error handling.</div>
                      </div>
                      <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
                          <span className="font-bold text-yellow-700 w-8 text-lg">1</span>
                          <div className="text-sm text-yellow-800"><span className="font-bold">Needs Work:</span> Workflow attempts the problem but fails execution.</div>
                      </div>
                  </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                   <div className="flex items-center space-x-3 mb-4 text-purple-600">
                      <Award size={24} />
                      <h3 className="text-lg font-bold text-gray-900">Capstone Rubric</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-6">Final project is graded out of 100 points.</p>
                  <div className="space-y-3">
                      {[
                          { area: 'Complexity & Logic', pts: '40pts' },
                          { area: 'Error Handling', pts: '20pts' },
                          { area: 'Documentation', pts: '20pts' },
                          { area: 'Creativity/Utility', pts: '20pts' }
                      ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                              <span className="font-medium text-gray-700">{item.area}</span>
                              <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded text-xs">{item.pts}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-gray-900">Your Gradebook</h3>
                  <button className="text-xs text-brand-600 hover:underline">Download Report</button>
              </div>
              <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                          <th className="px-6 py-3">Item</th>
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3 text-right">Score</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      <tr>
                          <td className="px-6 py-4 font-medium">Day 1 Homework</td>
                          <td className="px-6 py-4 text-gray-500">Oct 12</td>
                          <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Graded</span></td>
                          <td className="px-6 py-4 text-right font-bold">3/3</td>
                      </tr>
                      <tr>
                          <td className="px-6 py-4 font-medium">Day 2 Homework</td>
                          <td className="px-6 py-4 text-gray-500">Oct 13</td>
                          <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Pending</span></td>
                          <td className="px-6 py-4 text-right text-gray-400">-</td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
  );

  const SetupTab = () => (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
          <div className="bg-white border-l-4 border-brand-500 p-6 rounded-r-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pre-Bootcamp Checklist</h3>
              <p className="text-gray-600 mb-6">Complete these items before Day 1 to ensure a smooth start.</p>
              
              <div className="space-y-4">
                  {[
                      'Create n8n Cloud account (or install locally via Docker)',
                      'Sign up for OpenAI API key (for AI nodes)',
                      'Create a dedicated testing Google Sheet',
                      'Join the cohort Slack channel'
                  ].map((item, i) => (
                      <label key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                          <input type="checkbox" className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 border-gray-300" />
                          <span className="text-gray-800 font-medium">{item}</span>
                      </label>
                  ))}
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center"><Settings className="mr-2 text-gray-500"/> Tech Requirements</h4>
                  <ul className="text-sm space-y-3 text-gray-600">
                      <li className="flex justify-between"><span>Browser</span> <span className="font-medium text-gray-900">Chrome / Firefox</span></li>
                      <li className="flex justify-between"><span>RAM</span> <span className="font-medium text-gray-900">8GB Minimum</span></li>
                      <li className="flex justify-between"><span>Internet</span> <span className="font-medium text-gray-900">Stable Broadband</span></li>
                  </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center"><AlertTriangle className="mr-2 text-orange-500"/> Troubleshooting</h4>
                  <div className="text-sm space-y-3">
                      <details className="group">
                          <summary className="cursor-pointer font-medium text-brand-600 list-none flex justify-between items-center">
                              <span>Webhook not triggering?</span>
                              <ChevronDown size={16} className="group-open:rotate-180 transition-transform"/>
                          </summary>
                          <p className="mt-2 text-gray-600 pl-2 border-l-2 border-gray-200">Check if you are using the 'Test' URL vs 'Production' URL. Ensure the workflow is Active.</p>
                      </details>
                       <details className="group">
                          <summary className="cursor-pointer font-medium text-brand-600 list-none flex justify-between items-center">
                              <span>Google Sheets 403 Error?</span>
                              <ChevronDown size={16} className="group-open:rotate-180 transition-transform"/>
                          </summary>
                          <p className="mt-2 text-gray-600 pl-2 border-l-2 border-gray-200">Re-authenticate your OAuth credential. Scopes might have expired.</p>
                      </details>
                  </div>
              </div>
          </div>
      </div>
  );

  const InstructorTab = () => (
      <div className="bg-red-50 border border-red-100 rounded-xl p-8 animate-in fade-in duration-300">
          {user?.role === 'admin' ? (
              <div className="text-left space-y-8">
                <div className="flex items-center space-x-3 text-red-900 border-b border-red-200 pb-4">
                    <div className="bg-red-200 p-2 rounded-lg"><GraduationCap size={24}/></div>
                    <div>
                        <h3 className="text-xl font-bold">Instructor Control Center</h3>
                        <p className="text-red-700 text-sm">Restricted access: Teaching materials and grading keys.</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
                        <h4 className="font-bold text-gray-900 mb-4">Teaching Guide (Day-by-Day)</h4>
                        <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <span className="text-xs font-bold text-red-600 uppercase">Day 1 Tip</span>
                                <p className="text-sm text-gray-700 mt-1">Emphasize the JSON structure. Show them the 'Input Data' view repeatedly.</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <span className="text-xs font-bold text-red-600 uppercase">Day 3 Tip</span>
                                <p className="text-sm text-gray-700 mt-1">Logic day is hard. Draw the decision tree on a whiteboard before opening n8n.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
                            <h4 className="font-bold text-gray-900 mb-4">Downloads</h4>
                            <div className="space-y-2">
                                <button className="w-full flex justify-between items-center p-3 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <span className="flex items-center"><FileText size={16} className="mr-2 text-gray-400"/> Slide Deck (PPTX)</span>
                                    <Download size={16} className="text-gray-400"/>
                                </button>
                                <button className="w-full flex justify-between items-center p-3 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <span className="flex items-center"><BarChart3 size={16} className="mr-2 text-gray-400"/> Grading Sheet (XLS)</span>
                                    <Download size={16} className="text-gray-400"/>
                                </button>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
                             <h4 className="font-bold text-gray-900 mb-4">Quick Tools</h4>
                             <div className="flex space-x-2">
                                 <button className="px-3 py-1 bg-gray-100 text-xs font-bold text-gray-600 rounded">Cron Generator</button>
                                 <button className="px-3 py-1 bg-gray-100 text-xs font-bold text-gray-600 rounded">JSON Validator</button>
                             </div>
                        </div>
                    </div>
                </div>
              </div>
          ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Shield size={64} className="mb-4 text-red-200" />
                  <h3 className="text-xl font-bold text-gray-600">Restricted Access</h3>
                  <p className="max-w-md text-center mt-2 text-gray-500">This area is reserved for course instructors and administrators. Please contact your supervisor if you believe you should have access.</p>
              </div>
          )}
      </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-200">
            <Workflow className="text-white" size={32} />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-gray-900">n8n Automation</h1>
            <p className="text-gray-500 mt-1">Batch 4 • Instructor: Sarah Admin</p>
        </div>
      </div>

      {/* Sticky Tab Navigation */}
      <div className="sticky top-0 bg-gray-50 z-20 pt-2 pb-4 -mx-4 px-4 md:-mx-8 md:px-8 border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1 min-w-max p-1 bg-white/50 backdrop-blur-md rounded-xl border border-gray-200 shadow-sm">
            {(['dashboard', 'learning', 'workbook', 'resources', 'assessment', 'setup', 'instructor'] as Tab[]).map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all capitalize ${
                        activeTab === tab 
                        ? 'bg-white text-brand-600 shadow-sm ring-1 ring-gray-200' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </nav>
      </div>

      {/* Tab Content Area */}
      <div className="min-h-[500px]">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'learning' && <LearningTab />}
        {activeTab === 'workbook' && <WorkbookTab />}
        {activeTab === 'resources' && <ResourcesTab />}
        {activeTab === 'assessment' && <AssessmentTab />}
        {activeTab === 'setup' && <SetupTab />}
        {activeTab === 'instructor' && <InstructorTab />}
      </div>
    </div>
  );
};

export default N8NPage;
