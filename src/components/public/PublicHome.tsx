// =====================================================================
// KKDGMS — Master Public Home Page & School Portal
// =====================================================================

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  Users,
  Compass,
  Sparkles,
  ArrowRight,
  Play,
  X,
  Volume2,
  CheckCircle,
  Eye,
  Megaphone
} from 'lucide-react';
import { StoryItem, SchoolEvent, AnnouncementItem, Faculty } from '../../types';
import { api } from '../../lib/supabase';

interface PublicHomeProps {
  onOpenLogin: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ onOpenLogin }) => {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    api.getStories().then(setStories);
    api.getEvents().then(setEvents);
    api.getAnnouncements().then(setAnnouncements);
    api.getFaculty().then(setFacultyList);
  }, []);

  // 15s / 30s Story auto-advance timer
  useEffect(() => {
    if (!activeStory) return;
    setStoryProgress(0);
    const durationMs = (activeStory.duration_seconds || 15) * 1000;
    const interval = 100;
    const step = (interval / durationMs) * 100;

    const timer = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setActiveStory(null);
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [activeStory]);

  const stats = [
    { label: 'Students Enrolled', value: '1,240+', icon: Users, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Expert Faculty', value: '84+', icon: GraduationCap, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Hostel Boarders', value: '960+', icon: Building2, color: 'text-amber-600 bg-amber-50' },
    { label: 'Established', value: `2023–${currentYear}`, icon: Award, color: 'text-rose-600 bg-rose-50' },
  ];

  const toppers = [
    { rank: 'State Rank 1', name: 'M. Sneha Priya', score: '594/600 (99%)', stream: 'Maths-Computer', photo: '/icon.jpg' },
    { rank: 'District Rank 1', name: 'A. Dhanush Kumar', score: '591/600 (98.5%)', stream: 'Bio-Maths', photo: '/icon.jpg' },
    { rank: 'District Rank 2', name: 'V. Praveen Raj', score: '586/600 (97.6%)', stream: 'Bio-Maths', photo: '/icon.jpg' }
  ];

  const facilities = [
    { title: 'Advanced STEM & Robotics Lab', desc: 'Equipped with digital sensor kits, 3D printers, and automated physics test benches.' },
    { title: 'Digital Knowledge Library', desc: 'Over 15,000 reference volumes, state question banks, and e-learning terminals.' },
    { title: 'Separate Residential Hostels', desc: 'Dedicated boys & girls hostels with full dining facilities, sports grounds, and warden care.' },
    { title: 'Smart Audio-Visual Theatres', desc: 'High-speed fiber-connected classrooms for state online lectures and model examinations.' }
  ];

  const galleryImages = [
    { url: '/kanyakumari.jpg', title: 'Main Model Campus Entrance' },
    { url: '/icon.jpg', title: 'State Science Fair Champions' },
    { url: '/kanyakumari.jpg', title: 'Sunrise Assembly & Physical Fitness' },
    { url: '/icon.jpg', title: 'Modern Biology & Chemistry Laboratories' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-600 selection:text-white">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <img src="/kk.png" alt="KKDGMS Logo" className="w-12 h-12 rounded-xl object-contain bg-slate-800 p-1 border border-white/10" onError={(e) => { (e.target as any).src = '/icon.jpg'; }} />
            <div>
              <h1 className="text-xs sm:text-sm md:text-base font-black tracking-tight text-white uppercase leading-tight">
                Kanyakumari District Government Model School
              </h1>
              <p className="text-[10px] sm:text-[11px] font-semibold tracking-widest text-amber-400 uppercase">
                Navalcadu, Kanyakumari District • Tamil Nadu (Est. 2023)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-300">
              <a href="#about" className="hover:text-amber-400 transition-colors">About</a>
              <a href="#stories" className="hover:text-amber-400 transition-colors">Stories</a>
              <a href="#faculty" className="hover:text-amber-400 transition-colors">Faculty</a>
              <a href="#events" className="hover:text-amber-400 transition-colors">Events</a>
              <a href="#gallery" className="hover:text-amber-400 transition-colors">Gallery</a>
              <a href="#contact" className="hover:text-amber-400 transition-colors">Contact</a>
            </nav>

            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-indigo-600/30 active:scale-95 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>ERP Portal Login</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Live Announcements Marquee Ticker */}
      <div className="bg-slate-900 border-b border-white/10 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="flex items-center gap-1.5 bg-rose-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider shrink-0 animate-pulse">
            <Megaphone className="w-3 h-3" /> Live Circular
          </span>
          <div className="overflow-hidden whitespace-nowrap w-full">
            <div className="inline-block animate-marquee text-xs font-medium text-slate-300">
              {announcements.length > 0
                ? announcements.map((a, i) => `📢 ${a.title}: ${a.description}  •  `).join(' ')
                : '📢 Admissions for Academic Session 2024-25 in Progress for Standards 9, 10, 11 & 12 • Hostel Outpass Applications open for Diwali Holidays • Quarterly Exam Results published on ERP Portal.'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. 24-Hour Stories Section */}
      <section id="stories" className="py-6 border-b border-white/5 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Campus Stories (24h Live)</h3>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
            {stories.map((story) => (
              <button
                key={story.id}
                onClick={() => setActiveStory(story)}
                className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer focus:outline-none"
              >
                <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-400 to-indigo-600 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-slate-950 bg-slate-800">
                    <img src={story.media_url} alt={story.caption} className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = '/icon.jpg'; }} />
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-slate-300 truncate max-w-[70px]">
                  {story.created_by_name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
            {/* Progress Bar */}
            <div className="absolute top-3 left-3 right-3 z-20 h-1 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 transition-all ease-linear" style={{ width: `${storyProgress}%` }}></div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setActiveStory(null)}
              className="absolute top-6 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media */}
            <div className="h-[480px] w-full bg-slate-950 relative flex items-center justify-center">
              <img src={activeStory.media_url} alt={activeStory.caption} className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = '/icon.jpg'; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40"></div>
            </div>

            {/* Caption */}
            <div className="p-5 bg-slate-900 border-t border-white/10">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase">
                  {activeStory.created_by_role}
                </span>
                <span className="text-xs font-bold text-white">{activeStory.created_by_name}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{activeStory.caption}</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img src="/kanyakumari.jpg" alt="Kanyakumari Background" className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = '/icon.jpg'; }} />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/90 to-slate-950"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-amber-400/10 border border-amber-400/30 text-amber-300 uppercase tracking-widest shadow-lg shadow-amber-400/10">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            Where Oceans Meet Knowledge • Navalcadu Model Campus
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.15] max-w-5xl mx-auto">
            Illuminating Minds at <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-indigo-300 to-indigo-500">
              the Land's End
            </span>
          </h2>

          <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
            Established under the Government of Tamil Nadu Model School Initiative in 2023, KKDGMS nurtures residential academic excellence, scientific innovation, and character building for standards 9 to 12.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest py-4 px-8 rounded-2xl transition-all shadow-xl shadow-indigo-600/30 cursor-pointer"
            >
              <span>Access Student & Staff Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 font-bold text-xs uppercase tracking-widest py-4 px-8 rounded-2xl transition-all"
            >
              <span>Explore School Profile</span>
            </a>
          </div>

          {/* Statistics Matrix */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-12 max-w-5xl mx-auto">
            {stats.map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={i} className="bg-slate-900/80 backdrop-blur border border-white/10 p-5 rounded-3xl text-left hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl sm:text-3xl font-black text-white">{st.value}</span>
                    <div className="p-2.5 rounded-xl bg-slate-800 text-indigo-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{st.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Vision & Mission */}
      <section id="about" className="py-20 bg-slate-900/60 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              Strategic Vision & Daily Mission
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Benchmarked against national educational standards while preserving coastal resilience and ethics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-slate-900 border border-amber-400/20 p-8 rounded-3xl space-y-4 hover:border-amber-400/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-black">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-amber-300 uppercase tracking-tight">Our Strategic Vision</h4>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                To build a premier residential model academy that empowers talented students from government institutions with world-class science, mathematical, and linguistic competence for national competitive exams.
              </p>
            </div>

            <div className="bg-slate-900 border border-indigo-400/20 p-8 rounded-3xl space-y-4 hover:border-indigo-400/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-indigo-400/10 text-indigo-400 flex items-center justify-center font-black">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-indigo-300 uppercase tracking-tight">Our Daily Mission</h4>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Deploying intensive digital learning environments, periodic online examinations, supervised hostel study hours, and individualized student mentorship across all academic streams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Academic Toppers Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-[10px] font-bold bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
              Academic Excellence 2024
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              State & District Rank Holders
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {toppers.map((t, idx) => (
              <div key={idx} className="bg-slate-900 border border-white/10 rounded-3xl p-6 text-center space-y-4 hover:border-amber-400/40 transition-all shadow-xl relative overflow-hidden group">
                <div className="w-20 h-20 rounded-2xl mx-auto overflow-hidden bg-slate-800 border-2 border-amber-400/30">
                  <img src={t.photo} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div>
                  <span className="inline-block px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] uppercase rounded-full tracking-wider mb-1.5">
                    {t.rank}
                  </span>
                  <h4 className="text-base font-bold text-white">{t.name}</h4>
                  <p className="text-xs text-amber-300 font-mono font-bold mt-1">{t.score}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{t.stream}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Faculty Directory */}
      <section id="faculty" className="py-20 bg-slate-900/60 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              Certified Faculty Directory
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Highly qualified postgraduate educators dedicated to model school instruction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {facultyList.map((fac) => (
              <div key={fac.id} className="bg-slate-900 border border-white/10 rounded-3xl p-6 text-left space-y-3 hover:border-indigo-500/40 transition-all shadow-lg">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-base">
                  {fac.full_name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{fac.full_name}</h4>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mt-1">
                    {fac.department}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">{fac.qualification}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Campus Facilities */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              World-Class Infrastructure
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {facilities.map((fac, idx) => (
              <div key={idx} className="bg-slate-900 border border-white/10 p-6 rounded-3xl space-y-2 hover:border-white/20 transition-all">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-tight">{fac.title}</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-6">{fac.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Upcoming Events & Circulars */}
      <section id="events" className="py-20 bg-slate-900/60 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              Campus Events & Calendar
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {events.map((ev) => (
              <div key={ev.id} className="bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-4 hover:border-indigo-500/30 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold bg-indigo-600/20 text-indigo-400 px-2.5 py-0.5 rounded-full uppercase">
                      {ev.status}
                    </span>
                    <h4 className="text-base font-bold text-white mt-2">{ev.title}</h4>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{ev.description}</p>
                <div className="pt-3 border-t border-white/5 flex flex-wrap gap-4 text-[11px] text-slate-300 font-medium">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-400" /> {ev.event_date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-indigo-400" /> {ev.start_time} - {ev.end_time}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-rose-400" /> {ev.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Photo Gallery */}
      <section id="gallery" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              Campus Photo Gallery
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedGalleryImg(img.url)}
                className="group relative h-56 rounded-3xl overflow-hidden bg-slate-800 border border-white/10 cursor-pointer"
              >
                <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { (e.target as any).src = '/icon.jpg'; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-bold text-white leading-snug">{img.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Modal */}
      {selectedGalleryImg && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setSelectedGalleryImg(null)}>
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/20">
            <button onClick={() => setSelectedGalleryImg(null)} className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black">
              <X className="w-5 h-5" />
            </button>
            <img src={selectedGalleryImg} alt="Gallery Zoom" className="w-full max-h-[80vh] object-contain" />
          </div>
        </div>
      )}

      {/* 11. Location Map & Contact Footer */}
      <footer id="contact" className="bg-slate-900 border-t border-white/10 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contact Details */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <img src="/kk.png" alt="Logo" className="w-12 h-12 rounded-xl object-contain bg-slate-800 p-1" onError={(e) => { (e.target as any).src = '/icon.jpg'; }} />
                <div>
                  <h4 className="text-sm font-black text-white uppercase">KKDGMS NAVALCADU</h4>
                  <p className="text-xs text-amber-400 font-semibold">Government Model School, Kanyakumari District</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto lg:mx-0 font-medium">
                Navalcadu, Kanyakumari District, Tamil Nadu, India — PIN 629002.<br />
                Dedicated residential learning academy for standards 9 through 12.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 text-xs font-semibold justify-center lg:justify-start">
                <a href="tel:+918015188967" className="flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-white/10 px-4 py-2.5 rounded-xl transition-colors">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>+91 8015188967</span>
                </a>
                <a href="mailto:kkmadlin2023@gmail.com" className="flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-white/10 px-4 py-2.5 rounded-xl transition-colors">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span>kkmadlin2023@gmail.com</span>
                </a>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-4 pt-2">
                <a href="https://www.youtube.com/@kanniyagms" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-rose-400 border border-white/10 transition-colors" title="YouTube">
                  <Play className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/_.kkdgms._/" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-pink-400 border border-white/10 transition-colors" title="Instagram">
                  <Sparkles className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Google Map Frame */}
            <div className="h-72 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
              <iframe
                title="KKDGMS Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.1994192667104!2d77.41793217588737!3d8.245837091787943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04f649ff29b99f%3A0xaf9a09a6b371df92!2sJames%20College%20of%20Engineering%20and%20Technology!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-slate-500 font-mono">
            © 2023–{currentYear} Kanyakumari District Government Model School (KKDGMS). All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
