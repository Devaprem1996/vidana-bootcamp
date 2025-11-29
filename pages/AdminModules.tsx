
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  Edit, Trash2, Save, X, Plus, BookOpen, Clock, 
  CheckSquare, AlertCircle, Search, Loader, FileText, ShieldCheck 
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

// Define the shape of a module
interface Module {
  id?: string; 
  topic_slug: string;
  day_number: number;
  title: string;
  description: string;
  time_estimate: string;
  outcomes: string[];
  key_concepts: string[];
  homework_description: string;
}

interface Topic {
  slug: string;
  title: string;
}

const AdminModules: React.FC = () => {
  const { showToast } = useToast();
  const [modules, setModules] = useState<Module[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selection State
  const [activeTopic, setActiveTopic] = useState<string>('n8n');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Action State
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isTestingPermissions, setIsTestingPermissions] = useState(false);

  // --- 1. Fetch Data ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Topics
      const { data: topicsData } = await supabase.from('topics').select('slug, title').order('slug');
      if (topicsData) {
          setTopics(topicsData);
          // Set default active topic if not set
          if (!activeTopic && topicsData.length > 0) setActiveTopic(topicsData[0].slug);
      }

      // Fetch Modules
      const { data: modulesData, error } = await supabase
        .from('modules')
        .select('*')
        .order('day_number', { ascending: true });

      if (error) throw error;
      setModules(modulesData || []);
    } catch (err: any) {
      console.error('Error fetching modules:', err);
      showToast(`Failed to load data: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. Action Handlers ---

  const checkPermissions = async () => {
    setIsTestingPermissions(true);
    const toastId = showToast('Testing database write access...', 'info');
    
    try {
        // 1. Try to INSERT a dummy record
        const { data, error: insertError } = await supabase.from('modules').insert([{
            topic_slug: activeTopic,
            day_number: 9999,
            title: 'PERMISSION_TEST',
            description: 'Temporary test row',
            time_estimate: '1m'
        }]).select().single();

        if (insertError) throw new Error(`INSERT Failed: ${insertError.message}`);

        // 2. Try to DELETE the dummy record
        const { error: deleteError } = await supabase.from('modules').delete().eq('id', data.id);
        
        if (deleteError) throw new Error(`DELETE Failed: ${deleteError.message}`);

        alert("✅ SUCCESS: Your user has full Write/Delete permissions!");
        showToast("Permissions verified!", 'success');

    } catch (err: any) {
        console.error("Permission Test Failed:", err);
        alert(`❌ PERMISSION DENIED\n\nError: ${err.message}\n\nPlease copy the SQL from 'fix_permissions.js' and run it in Supabase.`);
    } finally {
        setIsTestingPermissions(false);
    }
  };

  // Prepare the modal for CREATING a new module
  const handleAdd = () => {
    // Calculate next day number for this topic
    const topicModules = modules.filter(m => m.topic_slug === activeTopic);
    const maxDay = topicModules.length > 0 
      ? Math.max(...topicModules.map(m => m.day_number)) 
      : 0;

    setEditingModule({
      // id is explicitly undefined for new items
      topic_slug: activeTopic,
      day_number: maxDay + 1,
      title: '',
      description: '',
      time_estimate: '2 Hours',
      outcomes: [],
      key_concepts: [],
      homework_description: ''
    });
  };

  // Prepare the modal for EDITING an existing module
  const handleEdit = (module: Module) => {
    // Create a copy to avoid mutating state directly
    setEditingModule({ ...module });
  };

  // Handle DELETE
  const handleDeleteClick = async (e: React.MouseEvent, id: string | undefined) => {
    // CRITICAL: Stop propagation so we don't open the edit modal
    e.preventDefault();
    e.stopPropagation();

    console.log("Delete button clicked. ID:", id);

    if (!id) {
        alert("Error: Module ID is missing. Cannot delete.");
        return;
    }
    
    // Browser confirmation
    if (!window.confirm('Are you sure you want to delete this module?')) {
        return;
    }
    
    setDeletingId(id);
    try {
      console.log("Attempting database delete...");
      
      // Perform Delete
      const { data, error, count } = await supabase
        .from('modules')
        .delete()
        .eq('id', id)
        .select('*'); // Select * allows us to see if it returned the deleted row

      if (error) {
          console.error("Supabase Error:", error);
          throw error;
      }

      console.log("Delete Result Data:", data);

      // Check if anything was actually deleted
      if (!data || data.length === 0) {
          throw new Error("Database returned 0 deleted rows. Check permissions or if ID exists.");
      }
      
      // Update UI immediately
      console.log("Updating UI state...");
      setModules(prev => prev.filter(m => m.id !== id));
      showToast('Module deleted successfully', 'success');
    } catch (err: any) {
      console.error('Delete error details:', err);
      alert(`DELETE FAILED\n\n${err.message}\n\nPlease ensure you ran the SQL from fix_permissions.js`);
    } finally {
      setDeletingId(null);
    }
  };

  // Handle SAVE (Insert or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;
    setIsSaving(true);

    try {
      const payload = {
        topic_slug: editingModule.topic_slug,
        day_number: editingModule.day_number,
        title: editingModule.title,
        description: editingModule.description,
        time_estimate: editingModule.time_estimate,
        homework_description: editingModule.homework_description,
        outcomes: editingModule.outcomes,
        key_concepts: editingModule.key_concepts
      };

      if (editingModule.id) {
        // 1. UPDATE existing
        const { data, error } = await supabase
          .from('modules')
          .update(payload)
          .eq('id', editingModule.id)
          .select()
          .single();

        if (error) throw error;
        
        setModules(prev => prev.map(m => m.id === editingModule.id ? (data as Module) : m));
        showToast('Module updated successfully', 'success');

      } else {
        // 2. INSERT new
        const { data, error } = await supabase
          .from('modules')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;

        setModules(prev => [...prev, (data as Module)]);
        showToast('Module created successfully', 'success');
      }

      setEditingModule(null); // Close modal
    } catch (err: any) {
      console.error("Save error:", err);
      alert(`SAVE FAILED\n\n${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper for textarea arrays (outcomes/concepts)
  const handleArrayInput = (value: string, field: 'outcomes' | 'key_concepts') => {
    if (!editingModule) return;
    setEditingModule({ ...editingModule, [field]: value.split('\n') });
  };

  // Filter View
  const filteredModules = modules.filter(m => 
    m.topic_slug === activeTopic &&
    (m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     m.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // --- Render ---

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 pb-20">
      
      {/* 1. Top Bar */}
      <div className="bg-white dark:bg-[#1A1D24] p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white flex items-center">
            <BookOpen className="mr-3 text-brand-600" /> Module Manager
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base">Create, edit, and reorganize course content.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
           {/* Search */}
           <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 flex-1 sm:flex-none">
               <Search size={18} className="text-gray-400" />
               <input 
                 type="text" 
                 placeholder="Search titles..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="bg-transparent border-none outline-none text-sm w-full sm:w-48 text-gray-900 dark:text-white placeholder-gray-400"
               />
           </div>
           
           {/* Test Permissions Button */}
            <button 
              onClick={checkPermissions}
              disabled={isTestingPermissions}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700"
              title="Click here if you can't edit/delete items"
           >
              {isTestingPermissions ? <Loader size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
              <span className="hidden xl:inline">Test DB</span>
           </button>

           {/* ADD BUTTON */}
           <button 
              onClick={handleAdd}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-lg shadow-brand-500/30 transition-all hover:scale-105"
           >
              <Plus size={20} />
              <span>Add Module</span>
           </button>
        </div>
      </div>

      {/* 2. Topic Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar px-1">
        {topics.map(topic => (
          <button
            key={topic.slug}
            onClick={() => setActiveTopic(topic.slug)}
            className={`px-5 py-2.5 md:px-6 md:py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
              activeTopic === topic.slug 
              ? 'bg-brand-600 text-white border-brand-600 shadow-md' 
              : 'bg-white dark:bg-[#1A1D24] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {topic.title}
          </button>
        ))}
      </div>

      {/* 3. List of Modules */}
      <div className="grid grid-cols-1 gap-4">
        {filteredModules.length > 0 ? (
          filteredModules.map((module) => (
            <div 
              key={module.id || Math.random()} 
              className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden cursor-pointer"
              onClick={() => handleEdit(module)} // Card click opens edit
            >
               <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                  
                  {/* Left: Info */}
                  <div className="flex-1 space-y-4 pointer-events-none"> 
                     {/* pointer-events-none ensures clicks on text go to parent */}
                     <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-lg md:text-xl shadow-sm border border-brand-100 dark:border-brand-900/30 shrink-0">
                           {module.day_number}
                        </div>
                        <div>
                           <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-tight">{module.title}</h3>
                           <div className="flex flex-wrap items-center text-xs text-gray-500 mt-2 gap-2 md:gap-3">
                              <span className="flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"><Clock size={12} className="mr-1"/> {module.time_estimate}</span>
                              <span className="flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"><CheckSquare size={12} className="mr-1"/> {module.outcomes?.length || 0} Outcomes</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Right: Actions */}
                  {/* We re-enable pointer events for buttons specifically */}
                  <div className="flex md:flex-col items-end justify-end md:justify-between gap-4 pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-4 md:pt-0 pointer-events-auto">
                     <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Don't trigger card click
                          handleEdit(module);
                        }}
                        className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-xl transition-colors"
                        title="Edit Module"
                     >
                        <Edit size={20} />
                     </button>
                     <button 
                        onClick={(e) => handleDeleteClick(e, module.id)}
                        className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-colors z-50 relative"
                        title="Delete Module"
                        disabled={deletingId === module.id}
                     >
                        {deletingId === module.id ? <Loader size={20} className="animate-spin" /> : <Trash2 size={20} />}
                     </button>
                  </div>

               </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-[#1A1D24] rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <BookOpen size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No modules found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by creating your first module for {activeTopic}.</p>
            <button onClick={handleAdd} className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold shadow-lg hover:bg-brand-700 transition-colors">
              Create Module
            </button>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editingModule && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1A1D24] rounded-[1.5rem] md:rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-5 md:px-8 md:py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 shrink-0">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {editingModule.id ? 'Edit Module' : 'New Module'}
                </h2>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mt-1">{activeTopic} • Day {editingModule.day_number}</p>
              </div>
              <button onClick={() => setEditingModule(null)} className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm hover:bg-gray-100 text-gray-500 dark:text-gray-300">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="col-span-1">
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Day #</label>
                   <input 
                      type="number"
                      value={editingModule.day_number}
                      onChange={(e) => setEditingModule({...editingModule, day_number: parseInt(e.target.value)})}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-center focus:ring-2 focus:ring-brand-500 outline-none"
                   />
                </div>
                <div className="col-span-1 md:col-span-3">
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Module Title</label>
                   <input 
                      type="text"
                      value={editingModule.title}
                      onChange={(e) => setEditingModule({...editingModule, title: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-brand-500 outline-none"
                      placeholder="e.g. Introduction to APIs"
                   />
                </div>
              </div>

              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                  <textarea 
                    value={editingModule.description}
                    onChange={(e) => setEditingModule({...editingModule, description: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                    placeholder="Brief overview of what will be learned..."
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Learning Outcomes (One per line)</label>
                    <textarea 
                      value={editingModule.outcomes?.join('\n')}
                      onChange={(e) => handleArrayInput(e.target.value, 'outcomes')}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 h-32 focus:ring-2 focus:ring-brand-500 outline-none resize-none font-mono text-sm"
                      placeholder="- Understand X&#10;- Build Y"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Key Concepts (One per line)</label>
                    <textarea 
                      value={editingModule.key_concepts?.join('\n')}
                      onChange={(e) => handleArrayInput(e.target.value, 'key_concepts')}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 h-32 focus:ring-2 focus:ring-brand-500 outline-none resize-none font-mono text-sm"
                      placeholder="Variables&#10;Loops&#10;Functions"
                    />
                 </div>
              </div>

              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Homework Task</label>
                  <div className="flex items-start space-x-2 bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                     <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                     <textarea 
                        value={editingModule.homework_description}
                        onChange={(e) => setEditingModule({...editingModule, homework_description: e.target.value})}
                        className="w-full bg-transparent border-none outline-none text-yellow-900 dark:text-yellow-200 placeholder-yellow-400 text-sm h-20 resize-none"
                        placeholder="Describe the practical assignment..."
                      />
                  </div>
              </div>

              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Time Estimate</label>
                 <input 
                      type="text"
                      value={editingModule.time_estimate}
                      onChange={(e) => setEditingModule({...editingModule, time_estimate: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none"
                      placeholder="e.g. 2.5 Hours"
                   />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 md:p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col-reverse md:flex-row justify-end gap-3 shrink-0">
              <button 
                onClick={() => setEditingModule(null)}
                className="w-full md:w-auto px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full md:w-auto px-6 py-3 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all flex items-center justify-center"
              >
                {isSaving ? <Loader size={20} className="animate-spin mr-2"/> : <Save size={20} className="mr-2"/>}
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminModules;
