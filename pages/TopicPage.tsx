
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { TOPICS, TOPIC_CURRICULUM, getResourcesByTopic } from '../store/mockData';
import {
    CheckCircle, Circle, Play, FileText, Download,
    ChevronDown, ChevronUp, BookOpen, Clock, AlertTriangle,
    Workflow, Code, MessageSquare, Cpu, CheckSquare, Award, BarChart3,
    Video, Shield, Settings, Save, GraduationCap, Layout as LayoutIcon, Image as ImageIcon,
    ArrowLeft, Star, Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { N8NModule, Resource } from '../types';
import TopicInfographics from '../components/TopicInfographics';

const { useParams, Navigate } = ReactRouterDOM as any;

type Tab = 'dashboard' | 'learning' | 'workbook' | 'resources' | 'setup' | 'instructor';

const TopicPage: React.FC = () => {
    const { slug } = useParams();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [expandedDay, setExpandedDay] = useState<number | null>(1);
    const [loading, setLoading] = useState(true);

    // State for fetched data
    const [topicInfo, setTopicInfo] = useState<any>(null);
    const [curriculum, setCurriculum] = useState<N8NModule[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [completedDays, setCompletedDays] = useState<number[]>([]);

    // Notes State
    const [notes, setNotes] = useState<Record<string, any>>({});
    const [currentNoteDay, setCurrentNoteDay] = useState<string>("1");
    const [isSavingNotes, setIsSavingNotes] = useState(false);

    // Helper to get consistent cover images
    const getTopicCoverImage = (topicSlug: string, day: number) => {
        const images = [
            'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1531297425937-2591b6c61989?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&w=1000&q=80',
        ];
        const slugSum = topicSlug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const index = (slugSum + day) % images.length;
        return images[index];
    };

    const ensureTopicInDb = async (slugToCheck: string) => {
        const { data } = await supabase.from('topics').select('slug').eq('slug', slugToCheck).single();
        if (data) return true;

        const mockTopic = TOPICS.find(t => t.slug === slugToCheck);
        if (!mockTopic) return false;

        const { error } = await supabase.from('topics').insert([{
            slug: mockTopic.slug,
            title: mockTopic.title,
            description: mockTopic.description,
            icon: mockTopic.icon,
            total_modules: mockTopic.totalModules
        }]);

        if (error) {
            console.error("Failed to auto-seed topic:", error);
            return false;
        }
        return true;
    };

    useEffect(() => {
        const fetchTopicData = async () => {
            if (!slug || !user) return;

            try {
                setLoading(true);
                await ensureTopicInDb(slug);

                let { data: tData } = await supabase.from('topics').select('*').eq('slug', slug).single();
                if (!tData) tData = TOPICS.find(t => t.slug === slug);
                setTopicInfo(tData);

                const { data: mData } = await supabase.from('modules').select('*').eq('topic_slug', slug).order('day_number', { ascending: true });

                if (mData && mData.length > 0) {
                    const mappedModules: N8NModule[] = mData.map((m: any) => ({
                        day: m.day_number,
                        title: m.title,
                        description: m.description,
                        timeEstimate: m.time_estimate,
                        outcomes: m.outcomes || [],
                        keyConcepts: m.key_concepts || [],
                        homework: m.homework_description,
                        resources: [],
                        isCompleted: false
                    }));
                    setCurriculum(mappedModules);
                } else {
                    setCurriculum(TOPIC_CURRICULUM[slug] || []);
                }

                const { data: rData } = await supabase.from('resources').select('*');
                if (rData && rData.length > 0) {
                    setResources(rData.map((r: any) => ({
                        ...r,
                        difficulty: r.difficulty || 'Beginner'
                    })));
                } else {
                    setResources(getResourcesByTopic(slug));
                }

                const { data: pData } = await supabase
                    .from('user_progress')
                    .select('completed_days, notes')
                    .eq('user_id', user.id)
                    .eq('topic_slug', slug)
                    .single();

                if (pData) {
                    setCompletedDays(pData.completed_days || []);
                    setNotes(pData.notes || {});
                }

            } catch (err) {
                console.error("Error fetching topic data:", err);
                setTopicInfo(TOPICS.find(t => t.slug === slug));
                setCurriculum(TOPIC_CURRICULUM[slug || 'n8n'] || []);
            } finally {
                setLoading(false);
            }
        };

        fetchTopicData();
    }, [slug, user]);

    const persistProgress = async (newCompletedDays: number[], newNotes: Record<string, any>) => {
        if (!user || !slug) return;
        try {
            const payload = {
                user_id: user.id,
                topic_slug: slug,
                completed_days: newCompletedDays,
                notes: newNotes,
                last_active: new Date().toISOString()
            };
            const { error } = await supabase.from('user_progress').upsert(payload, { onConflict: 'user_id,topic_slug' });
            if (error) {
                if (error.code === '23503') {
                    const { error: repairError } = await supabase.from('profiles').insert([{ id: user.id, email: user.email, full_name: user.name, role: user.role }]);
                    if (!repairError) await supabase.from('user_progress').upsert(payload, { onConflict: 'user_id,topic_slug' });
                } else throw error;
            }
        } catch (err: any) {
            showToast("Failed to save progress.", 'error');
        }
    };

    const toggleDayCompletion = async (day: number) => {
        let newCompleted = [...completedDays];
        const isNowComplete = !completedDays.includes(day);

        if (completedDays.includes(day)) {
            newCompleted = newCompleted.filter(d => d !== day);
        } else {
            newCompleted.push(day);
        }

        setCompletedDays(newCompleted);
        await persistProgress(newCompleted, notes);
        if (isNowComplete) showToast(`Day ${day} complete! Saved.`, 'success');
    };

    const saveNotes = async () => {
        setIsSavingNotes(true);
        try {
            await persistProgress(completedDays, notes);
            showToast("Work saved successfully!", 'success');
        } finally {
            setIsSavingNotes(false);
        }
    };

    const handleResourceClick = (url: string) => {
        if (url === '#') showToast('Resource coming soon', 'info');
        else window.open(url, '_blank');
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F4F6] dark:bg-[#0f1115]">
            <div className="w-16 h-16 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin"></div>
            <p className="mt-4 text-gray-500 font-medium animate-pulse">Loading module...</p>
        </div>
    );
    if (!topicInfo) return <Navigate to="/dashboard" replace />;

    const DashboardTab = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#1A1D24] p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-2xl text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform">
                            <BookOpen size={24} />
                        </div>
                        <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Total</span>
                    </div>
                    <div className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-1">{curriculum.length}</div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Learning Modules</div>
                </div>

                <div className="bg-white dark:bg-[#1A1D24] p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                            <Zap size={24} />
                        </div>
                        <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Progress</span>
                    </div>
                    <div className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-1">
                        {Math.round((completedDays.length / Math.max(curriculum.length, 1)) * 100)}%
                    </div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Course Completion</div>
                </div>

                <div className="bg-white dark:bg-[#1A1D24] p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-2xl text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                            <CheckSquare size={24} />
                        </div>
                        <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Tasks</span>
                    </div>
                    <div className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-1">Tracked</div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Daily Homework</div>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1A1D24] p-6 md:p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Learning Journey</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your daily progress through the curriculum.</p>
                    </div>
                    <span className="text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full">
                        {completedDays.length} / {curriculum.length} Completed
                    </span>
                </div>

                <div className="relative pb-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    <div className="hidden md:block absolute top-5 left-0 w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                    <div className="flex md:justify-between min-w-max md:min-w-0 space-x-8 md:space-x-0 px-2 pb-4">
                        {curriculum.map((day) => {
                            const isDone = completedDays.includes(day.day);
                            return (
                                <div key={day.day} className="flex flex-col items-center relative z-10 group cursor-pointer" onClick={() => setActiveTab('learning')}>
                                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border-4 transition-all duration-300 shadow-sm ${isDone
                                            ? 'bg-green-500 border-white dark:border-[#1A1D24] text-white shadow-green-200 dark:shadow-none'
                                            : 'bg-white dark:bg-[#1A1D24] border-gray-100 dark:border-gray-800 text-gray-400 hover:border-brand-200 dark:hover:border-brand-800'
                                        }`}>
                                        {isDone ? <CheckCircle size={20} className="fill-current" /> : <span className="text-sm font-bold">{day.day}</span>}
                                    </div>
                                    <div className="text-center mt-3">
                                        <span className={`text-xs font-bold block mb-1 ${isDone ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>Day {day.day}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );

    const LearningTab = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {curriculum.map((day) => {
                const isDone = completedDays.includes(day.day);
                return (
                    <div key={day.day} className={`bg-white dark:bg-[#1A1D24] border rounded-[2rem] overflow-hidden transition-all duration-300 ${expandedDay === day.day ? 'shadow-lg border-brand-200 dark:border-brand-900/50 ring-1 ring-brand-100 dark:ring-brand-900/30' : 'shadow-sm border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                        }`}>
                        <div
                            className={`p-4 md:p-6 flex items-center justify-between cursor-pointer transition-colors ${expandedDay === day.day ? 'bg-gray-50/50 dark:bg-gray-800/30' : ''}`}
                            onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                        >
                            <div className="flex items-center space-x-3 md:space-x-5 flex-1 min-w-0">
                                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm md:text-lg transition-colors shadow-sm ${isDone ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-400'
                                    }`}>
                                    {isDone ? <CheckCircle size={18} className="md:w-6 md:h-6" /> : day.day}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-base md:text-xl text-gray-900 dark:text-white font-heading pr-2 leading-tight line-clamp-2">{day.title}</h3>
                                    <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        <span className="flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg whitespace-nowrap"><Clock size={10} className="mr-1 md:mr-1.5" /> {day.timeEstimate}</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="hidden sm:inline">{day.outcomes.length} Outcomes</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`p-1.5 md:p-2 rounded-full shrink-0 transition-transform duration-300 ${expandedDay === day.day ? 'bg-white dark:bg-gray-700 rotate-180 text-brand-600 dark:text-white' : 'text-gray-400'}`}>
                                <ChevronDown size={18} className="md:w-5 md:h-5" />
                            </div>
                        </div>

                        {expandedDay === day.day && (
                            <div className="p-4 md:p-8 border-t border-gray-100 dark:border-gray-800 space-y-6 md:space-y-8 animate-in fade-in">

                                {/* Hero Image */}
                                <div className="relative h-40 md:h-56 w-full rounded-3xl overflow-hidden group shadow-md">
                                    <img
                                        src={getTopicCoverImage(slug || 'default', day.day)}
                                        alt={day.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent flex items-end p-4 md:p-8">
                                        <h3 className="text-white text-xl md:text-3xl font-heading font-bold drop-shadow-lg">{day.title}</h3>
                                    </div>
                                </div>

                                {/* Full Width Description */}
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-sm uppercase tracking-wider flex items-center">
                                        <BookOpen size={16} className="mr-2 text-brand-500" /> Module Overview
                                    </h4>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                                        {day.description}
                                    </p>
                                </div>

                                {/* Infographic Section - Reintroduced */}
                                <div className="bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-8 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-purple-400"></div>
                                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-6 tracking-wider text-center flex items-center justify-center">
                                        <Video size={14} className="mr-2" /> Concept Visualization
                                    </h4>
                                    <div className="flex justify-center w-full overflow-x-auto">
                                        <div className="w-full max-w-2xl min-w-[280px]">
                                            <TopicInfographics slug={slug || ''} day={day.day} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center uppercase text-xs tracking-wider"><Award size={16} className="mr-2 text-brand-500" /> Outcomes</h4>
                                        <ul className="space-y-3">
                                            {day.outcomes.map((o, i) => (
                                                <li key={i} className="flex items-start text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800/30 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-400 mr-3 shrink-0"></div>
                                                    {o}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center uppercase text-xs tracking-wider"><Code size={16} className="mr-2 text-purple-500" /> Key Concepts</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {day.keyConcepts.map((c, i) => (
                                                <span key={i} className="px-3 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm rounded-xl font-bold border border-purple-100 dark:border-purple-800">{c}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 p-6 rounded-[1.5rem] flex items-start space-x-4">
                                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-xl shrink-0">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-yellow-900 dark:text-yellow-200 text-sm uppercase tracking-wide mb-1">Homework</h4>
                                        <p className="text-sm text-yellow-800 dark:text-yellow-300/80 leading-relaxed">{day.homework}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <button
                                        onClick={() => showToast('Q&A Forum coming soon!', 'info')}
                                        className="text-sm font-medium text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                                    >
                                        Have questions? Check Q&A
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleDayCompletion(day.day); }}
                                        className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${isDone
                                                ? 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                                                : 'bg-brand-600 text-white shadow-brand-500/20'
                                            }`}
                                    >
                                        {isDone ? 'Mark Incomplete' : 'Complete Module'}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
            {resources.length > 0 ? resources.map(r => (
                <div
                    key={r.id}
                    onClick={() => handleResourceClick(r.url)}
                    className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-gray-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1"
                >
                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/5 dark:bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        <div className="w-16 h-16 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Play size={24} className="text-brand-600 ml-1" />
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-bold uppercase bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-3 py-1 rounded-full">{r.type}</span>
                            <span className="text-xs text-gray-400">{r.duration}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-base mb-2 group-hover:text-brand-600 transition-colors">{r.title}</h4>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {r.tags?.slice(0, 2).map((tag, i) => (
                                <span key={i} className="text-[10px] bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-700">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )) : (
                <div className="col-span-3 text-center py-20">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-gray-600">
                        <Video size={32} />
                    </div>
                    <p className="text-gray-500 font-medium">No specific resources found.</p>
                </div>
            )}
        </div>
    );

    const WorkbookTab = () => {
        const getChecklist = (): string[] => Array.isArray(notes['_capstone_checklist']) ? notes['_capstone_checklist'] : [];
        const toggleChecklist = (task: string) => {
            const current = getChecklist();
            const updated = current.includes(task) ? current.filter(t => t !== task) : [...current, task];
            setNotes({ ...notes, '_capstone_checklist': updated });
        };

        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-gray-800 rounded-[2rem] p-6 md:p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center text-lg"><BookOpen className="mr-3 text-brand-500" size={22} /> Daily Log</h3>
                            <button
                                onClick={saveNotes}
                                disabled={isSavingNotes}
                                className="flex items-center text-xs font-bold bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {isSavingNotes ? 'Saving...' : 'Save Notes'}
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex space-x-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                                {curriculum.map(d => (
                                    <button
                                        key={d.day}
                                        onClick={() => setCurrentNoteDay(d.day.toString())}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${currentNoteDay === d.day.toString()
                                                ? 'bg-brand-600 text-white shadow-md'
                                                : 'bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        Day {d.day}
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={notes[currentNoteDay] || ''}
                                onChange={(e) => setNotes({ ...notes, [currentNoteDay]: e.target.value })}
                                className="w-full h-80 p-6 bg-gray-50 dark:bg-[#0C0E14] border border-gray-200 dark:border-gray-800 rounded-3xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none resize-none text-sm leading-relaxed font-sans"
                                placeholder="Write your key takeaways and workflow ideas here..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-gray-800 rounded-[2rem] p-6 md:p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center text-lg"><LayoutIcon className="mr-3 text-purple-500" size={22} /> Capstone Planner</h3>
                            <div className="w-32 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${(getChecklist().length / 6) * 100}%` }}></div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[
                                'Define Problem Statement & Goals', 'Research & Architecture Diagram',
                                'Define API / Data Requirements', 'Core Implementation (MVP)',
                                'Error Handling & Reliability', 'Final Documentation'
                            ].map((task, i) => (
                                <label key={i} className="flex items-center space-x-4 p-4 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all group">
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${getChecklist().includes(task) ? 'bg-purple-500 border-purple-500' : 'border-gray-300 dark:border-gray-600'
                                        }`}>
                                        {getChecklist().includes(task) && <CheckSquare size={14} className="text-white" />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={getChecklist().includes(task)} onChange={() => toggleChecklist(task)} />
                                    <span className={`text-sm font-medium transition-colors ${getChecklist().includes(task) ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                                        {task}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-brand-600 to-purple-700 rounded-[2rem] p-8 text-white shadow-xl shadow-brand-900/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-xl mb-2">Overall Progress</h3>
                            <p className="text-white/70 text-sm mb-6">Keep pushing! You're doing great.</p>
                            <div className="text-4xl font-bold mb-2">{Math.round((completedDays.length / Math.max(curriculum.length, 1)) * 100)}%</div>
                            <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                                <div className="bg-white h-2 rounded-full transition-all duration-1000" style={{ width: `${(completedDays.length / Math.max(curriculum.length, 1)) * 100}%` }}></div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    </div>
                </div>
            </div>
        );
    };

    const SetupTab = () => (
        <div className="max-w-3xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-[#1A1D24] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Pre-Flight Checklist</h3>
                <div className="space-y-4">
                    {['Create Accounts', 'Install Extensions', 'Join Slack', 'Verify API Keys'].map((item, i) => (
                        <label key={i} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <input type="checkbox" className="w-5 h-5 rounded-md text-brand-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                            <span className="font-bold text-gray-700 dark:text-gray-200">{item}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* 1. Glass Hero - Optimized for Mobile */}
            <div className="relative bg-white dark:bg-[#1A1D24] rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-12 mb-6 md:mb-10 overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-brand-100/50 to-purple-100/50 dark:from-brand-900/20 dark:to-purple-900/20 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 w-full">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <button onClick={() => window.history.back()} className="p-2 md:p-3 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-brand-600 transition-colors shadow-sm shrink-0">
                                <ArrowLeft size={18} className="md:w-5 md:h-5" />
                            </button>
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl md:rounded-3xl flex items-center justify-center text-white shadow-xl shadow-brand-500/20 rotate-3 shrink-0">
                                {slug === 'n8n' && <Workflow size={28} className="md:w-9 md:h-9" />}
                                {slug === 'vibe-coding' && <Code size={28} className="md:w-9 md:h-9" />}
                                {slug === 'prompt-engineering' && <MessageSquare size={28} className="md:w-9 md:h-9" />}
                                {slug === 'ai-tools' && <Cpu size={28} className="md:w-9 md:h-9" />}
                            </div>
                        </div>

                        <div className="mt-2 sm:mt-0">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-gray-900 dark:text-white tracking-tight leading-tight">{topicInfo.title}</h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="px-2 py-0.5 md:px-3 md:py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-[10px] md:text-xs font-bold uppercase text-gray-500 tracking-wide">Cohort 4</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">Interactive Module</span>
                            </div>
                        </div>
                    </div>

                    {/* Mini Progress Circle - Hidden on Mobile */}
                    <div className="hidden md:flex flex-col items-center">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100 dark:text-gray-800" />
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (175 * (completedDays.length / Math.max(curriculum.length, 1)))} className="text-brand-500 transition-all duration-1000" strokeLinecap="round" />
                            </svg>
                            <span className="absolute text-xs font-bold text-gray-900 dark:text-white">{Math.round((completedDays.length / Math.max(curriculum.length, 1)) * 100)}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Floating Nav Island (Sticky) - Positioned below header on mobile */}
            <div className="sticky top-[64px] md:top-4 z-30 mb-6 md:mb-10 mx-auto max-w-full md:max-w-fit transition-all">
                <nav className="flex items-center space-x-1 p-1.5 bg-white/90 dark:bg-[#151515]/90 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-xl md:rounded-2xl shadow-lg shadow-black/5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] w-full md:w-auto">
                    {(['dashboard', 'learning', 'workbook', 'resources', 'setup'] as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all capitalize whitespace-nowrap ${activeTab === tab
                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg shadow-gray-900/10'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/5'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* 3. Tab Content */}
            <div className="min-h-[500px]">
                {activeTab === 'dashboard' && DashboardTab()}
                {activeTab === 'learning' && LearningTab()}
                {activeTab === 'workbook' && WorkbookTab()}
                {activeTab === 'resources' && ResourcesTab()}
                {activeTab === 'setup' && SetupTab()}
            </div>
        </div>
    );
};

export default TopicPage;
