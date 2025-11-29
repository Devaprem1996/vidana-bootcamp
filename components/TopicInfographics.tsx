
import React from 'react';
import { Workflow, Mail, Database, Layers, AlertCircle, Lock, Code, Terminal, Bug, Zap, MessageSquare, Brain, Image as ImageIcon, Mic, Search } from 'lucide-react';

interface TopicInfographicProps {
  slug: string;
  day: number;
}

const TopicInfographics: React.FC<TopicInfographicProps> = ({ slug, day }) => {
  
  // --- N8N Visuals (Migrated) ---
  if (slug === 'n8n') {
    switch(day) {
      case 1: // Mental Model
        return (
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 py-4">
            <div className="w-24 h-24 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-400 rounded-xl flex flex-col items-center justify-center shadow-sm">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Input</span>
                <span className="text-lg font-bold text-gray-800 dark:text-white">Trigger</span>
            </div>
            <div className="hidden md:block w-12 h-0.5 bg-gray-400 relative"><div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-gray-400 rotate-45"></div></div>
            <div className="block md:hidden h-8 w-0.5 bg-gray-400 relative"><div className="absolute bottom-0 -left-1 w-2 h-2 border-b-2 border-r-2 border-gray-400 rotate-45"></div></div>
            <div className="w-24 h-24 bg-brand-50 dark:bg-brand-900/30 border-2 border-brand-500 rounded-xl flex flex-col items-center justify-center shadow-sm">
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase">Process</span>
                <span className="text-lg font-bold text-brand-800 dark:text-brand-100">Nodes</span>
            </div>
            <div className="hidden md:block w-12 h-0.5 bg-gray-400 relative"><div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-gray-400 rotate-45"></div></div>
            <div className="block md:hidden h-8 w-0.5 bg-gray-400 relative"><div className="absolute bottom-0 -left-1 w-2 h-2 border-b-2 border-r-2 border-gray-400 rotate-45"></div></div>
            <div className="w-24 h-24 bg-green-50 dark:bg-green-900/30 border-2 border-green-500 rounded-xl flex flex-col items-center justify-center shadow-sm">
                <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase">Output</span>
                <span className="text-lg font-bold text-green-800 dark:text-green-100">Action</span>
            </div>
          </div>
        );
      case 2: // Data Flow
        return (
            <div className="flex justify-center py-4 space-x-2">
                <div className="bg-gray-800 text-white text-xs p-3 rounded font-mono w-32 shadow-lg">
                    {`[ { "id": 1 }, { "id": 2 } ]`}
                </div>
                <div className="flex flex-col justify-center items-center px-2">
                   <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Transform</div>
                   <div className="w-16 h-1 bg-brand-500 rounded"></div>
                </div>
                <div className="bg-gray-800 text-white text-xs p-3 rounded font-mono w-32 shadow-lg border-2 border-brand-400">
                     {`[ { "id": 1, "ok": true }, ... ]`}
                </div>
            </div>
        );
      case 3: // Logic
         return (
             <div className="flex flex-col items-center py-4">
                 <div className="bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-500 px-6 py-4 rounded-lg font-bold transform rotate-0 shadow-sm relative">
                    <span className="text-yellow-900 dark:text-yellow-100">IF Node</span>
                 </div>
                 <div className="flex space-x-16 mt-6">
                     <div className="text-center">
                         <span className="text-xs text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">True</span>
                         <div className="mt-2 w-12 h-12 bg-green-100 dark:bg-green-900/30 border-2 border-green-500 rounded flex items-center justify-center text-xs dark:text-green-200">Email</div>
                     </div>
                     <div className="text-center">
                         <span className="text-xs text-red-600 dark:text-red-400 font-bold bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">False</span>
                         <div className="mt-2 w-12 h-12 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded flex items-center justify-center text-xs dark:text-red-200">Slack</div>
                     </div>
                 </div>
             </div>
         );
       // ... (Include other N8N cases simplified or full)
       default: return <DefaultViz icon={Workflow} />;
    }
  }

  // --- Vibe Coding Visuals ---
  if (slug === 'vibe-coding') {
    switch(day) {
      case 1: // Pair Programmer
        return (
          <div className="flex justify-center items-center space-x-8 py-6">
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-gray-800 dark:bg-gray-700 rounded-lg flex items-center justify-center text-white"><Terminal size={32}/></div>
               <span className="text-xs font-bold mt-2 text-gray-600 dark:text-gray-400">You (Driver)</span>
            </div>
            <div className="text-2xl text-gray-300 dark:text-gray-500">+</div>
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-300"><Code size={32}/></div>
               <span className="text-xs font-bold mt-2 text-purple-600 dark:text-purple-400">AI (Navigator)</span>
            </div>
            <div className="text-2xl text-gray-300 dark:text-gray-500">=</div>
            <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-2 rounded-lg font-bold">10x Speed</div>
          </div>
        );
      case 2: // Prompt Driven
        return (
           <div className="flex flex-col items-center space-y-2 max-w-md mx-auto">
              <div className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-3 rounded-lg rounded-bl-none shadow-sm text-sm text-gray-700 dark:text-gray-300">
                "Create a React component for a responsive navbar..."
              </div>
              <div className="w-full bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 p-3 rounded-lg rounded-tr-none shadow-sm text-xs font-mono text-purple-800 dark:text-purple-200">
                {`const Navbar = () => { return <nav>...</nav> }`}
              </div>
           </div>
        );
      case 3: // Debugging
        return (
           <div className="flex justify-center items-center space-x-4 py-4">
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4 rounded-lg flex items-center">
                 <Bug className="text-red-500 dark:text-red-400 mr-2"/>
                 <span className="font-mono text-xs text-red-700 dark:text-red-200">Error: undefined</span>
              </div>
              <div className="h-0.5 w-12 bg-gray-300 dark:bg-gray-600"></div>
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-4 rounded-lg flex items-center">
                 <Zap className="text-green-500 dark:text-green-400 mr-2"/>
                 <span className="font-mono text-xs text-green-700 dark:text-green-200">Fixed Code</span>
              </div>
           </div>
        );
       default: return <DefaultViz icon={Code} />;
    }
  }

  // --- Prompt Engineering Visuals ---
  if (slug === 'prompt-engineering') {
     switch(day) {
       case 1: // Core Mechanics
         return (
           <div className="flex justify-center space-x-2 py-4">
             {['Context', 'Instruction', 'Input', 'Output'].map((item, i) => (
                <div key={i} className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 px-3 py-2 rounded-lg text-xs font-bold text-blue-800 dark:text-blue-200 shadow-sm">
                  {item}
                </div>
             ))}
           </div>
         );
       case 2: // Reasoning
         return (
            <div className="flex flex-col items-center py-2">
               <div className="flex items-center space-x-2 mb-2">
                 <Brain size={20} className="text-purple-500 dark:text-purple-400"/>
                 <span className="font-bold text-gray-700 dark:text-gray-300">Chain of Thought</span>
               </div>
               <div className="space-y-2 w-64">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs text-gray-500 dark:text-gray-400">Input</div>
                  <div className="bg-purple-50 dark:bg-purple-900/30 border-l-2 border-purple-400 dark:border-purple-600 p-2 rounded text-xs text-purple-700 dark:text-purple-200 italic">"First, I calculate X..."</div>
                  <div className="bg-purple-50 dark:bg-purple-900/30 border-l-2 border-purple-400 dark:border-purple-600 p-2 rounded text-xs text-purple-700 dark:text-purple-200 italic">"Then, I compare Y..."</div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded text-xs font-bold text-green-800 dark:text-green-200">Final Answer</div>
               </div>
            </div>
         );
       default: return <DefaultViz icon={MessageSquare} />;
     }
  }

  // --- AI Tools Visuals ---
  if (slug === 'ai-tools') {
    switch(day) {
      case 2: // Image Gen
        return (
          <div className="flex justify-center space-x-4 py-4">
             <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-800 dark:to-purple-800 rounded-lg flex items-center justify-center">
                <ImageIcon className="text-white opacity-50" size={32}/>
             </div>
             <div className="flex flex-col justify-center space-y-2">
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="w-28 h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
             </div>
          </div>
        );
      case 3: // Audio/Video
         return (
            <div className="flex justify-center items-center space-x-6 py-4">
               <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-2 mx-auto"><Mic className="text-orange-500"/></div>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Voice</span>
               </div>
               <div className="text-2xl text-gray-300 dark:text-gray-600">+</div>
               <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2 mx-auto"><ImageIcon className="text-blue-500"/></div>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Avatar</span>
               </div>
               <div className="text-2xl text-gray-300 dark:text-gray-600">=</div>
               <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-1 rounded text-xs">Video</div>
            </div>
         );
      default: return <DefaultViz icon={Search} />;
    }
  }

  return <DefaultViz icon={AlertCircle} />;
};

const DefaultViz = ({ icon: Icon }: { icon: any }) => (
  <div className="h-32 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500">
    <Icon className="mr-2" />
    <span className="text-sm font-medium">Concept Visualization</span>
  </div>
);

export default TopicInfographics;