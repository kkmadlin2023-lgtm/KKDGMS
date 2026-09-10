// =====================================================================
// KKDGMS — Master Events, 24h Stories, & Homepage Announcements Manager
// =====================================================================

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  Megaphone,
  Plus,
  Trash2,
  Clock,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  X
} from 'lucide-react';
import { StoryItem, SchoolEvent, AnnouncementItem } from '../../types';
import { api } from '../../lib/supabase';

export const EventsStoriesManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stories' | 'events' | 'announcements'>('stories');
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);

  // Story Form
  const [storyCaption, setStoryCaption] = useState('');
  const [storyDuration, setStoryDuration] = useState<15 | 30>(15);
  const [storyUrl, setStoryUrl] = useState('/kanyakumari.jpg');

  // Event Form
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLoc, setEventLoc] = useState('Navalcadu Campus Ground');

  // Announcement Form
  const [annTitle, setAnnTitle] = useState('');
  const [annDesc, setAnnDesc] = useState('');

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setStories(await api.getStories());
    setEvents(await api.getEvents());
    setAnnouncements(await api.getAnnouncements());
  };

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyCaption.trim()) return;

    await api.createStory({
      media_url: storyUrl,
      media_type: 'image',
      caption: storyCaption,
      duration_seconds: storyDuration,
      created_by_role: 'admin',
      created_by_name: 'Principal Administration'
    });

    setStoryCaption('');
    await loadAll();
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    await api.createEvent({
      title: eventTitle,
      description: eventDesc,
      event_date: eventDate || new Date().toISOString().split('T')[0],
      start_time: '09:30 AM',
      end_time: '04:00 PM',
      location: eventLoc,
      expiry_date: eventDate || new Date().toISOString().split('T')[0],
      status: 'upcoming',
      created_by: 'Administration'
    });

    setEventTitle('');
    setEventDesc('');
    await loadAll();
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim()) return;

    await api.createAnnouncement({
      title: annTitle,
      description: annDesc,
      start_date: new Date().toISOString().split('T')[0],
      expiry_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      is_active: true,
      priority: 'normal',
      created_by: 'Principal Office',
      created_at: new Date().toISOString()
    });

    setAnnTitle('');
    setAnnDesc('');
    await loadAll();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-black text-slate-900">Public Media, 24h Stories & Events Console</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish campus stories (15s/30s slides with 24-hour auto-deletion), dynamic marquee announcements, and school events.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('stories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
            activeTab === 'stories' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          24h Live Stories ({stories.length})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
            activeTab === 'events' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          School Events ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
            activeTab === 'announcements' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          Marquee Circulars ({announcements.length})
        </button>
      </div>

      {/* Stories Tab */}
      {activeTab === 'stories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Add 24-Hour Campus Story</h3>
            <form onSubmit={handleCreateStory} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Story Caption / Highlight</label>
                <input
                  type="text"
                  required
                  value={storyCaption}
                  onChange={(e) => setStoryCaption(e.target.value)}
                  placeholder="e.g. Morning sports assembly..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Duration Setting</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStoryDuration(15)}
                    className={`py-2 rounded-xl font-bold uppercase text-[10px] border ${
                      storyDuration === 15 ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    15 Seconds
                  </button>
                  <button
                    type="button"
                    onClick={() => setStoryDuration(30)}
                    className={`py-2 rounded-xl font-bold uppercase text-[10px] border ${
                      storyDuration === 30 ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    30 Seconds
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Campus Image</label>
                <select
                  value={storyUrl}
                  onChange={(e) => setStoryUrl(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                >
                  <option value="/kanyakumari.jpg">Campus Landscape</option>
                  <option value="/icon.jpg">Science & Academic Winners</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase py-3 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Publish 24h Story
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Active Live Stories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stories.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="h-36 rounded-xl overflow-hidden bg-slate-900">
                    <img src={s.media_url} alt={s.caption} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span>Duration: {s.duration_seconds}s</span>
                    <span className="text-emerald-700 font-mono">24h Active</span>
                  </div>
                  <p className="text-xs font-medium text-slate-800">{s.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Create Campus Event</h3>
            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Science Fair"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Event Date</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase py-3 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Schedule Event
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Scheduled Events</h3>
            <div className="space-y-3">
              {events.map((ev) => (
                <div key={ev.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{ev.title}</h4>
                    <span className="text-xs font-mono font-bold text-indigo-700">{ev.event_date}</span>
                  </div>
                  <p className="text-xs text-slate-600">{ev.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Add Live Marquee Circular</h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Model Exam Hall Tickets"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Announcement Body</label>
                <textarea
                  rows={3}
                  value={annDesc}
                  onChange={(e) => setAnnDesc(e.target.value)}
                  placeholder="Brief marquee text..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase py-3 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Post Marquee Circular
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Homepage Circulars</h3>
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">{a.title}</h4>
                  <p className="text-xs text-slate-600">{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
