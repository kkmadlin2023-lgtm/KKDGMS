import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  School,
  Sparkles,
  RefreshCw,
  Coffee,
  CalendarDays,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { timetableService } from '@/services/timetableService';
import { academicService } from '@/services/academicService';
import { facultyService } from '@/services/facultyService';
import {
  TimetablePeriod,
  TimetableEntry,
  DayOfWeek,
  AcademicYear,
  FacultyMember,
} from '@/types';

const DAYS_OF_WEEK: DayOfWeek[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

export const FacultyTimetablePage: React.FC = () => {
  const { profile } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [faculty, setFaculty] = useState<FacultyMember | null>(null);
  const [currentYear, setCurrentYear] = useState<AcademicYear | null>(null);
  const [periods, setPeriods] = useState<TimetablePeriod[]>([]);
  const [entries, setEntries] = useState<TimetableEntry[]>([]);

  // Determine current day of week
  const todayName = useMemo(() => {
    const days: DayOfWeek[] = ['SUNDAY' as any, 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const current = days[new Date().getDay()];
    return current === ('SUNDAY' as any) ? 'MONDAY' : current;
  }, []);

  const loadFacultySchedule = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Get current academic year and periods
      const [years, pds] = await Promise.all([
        academicService.getAcademicYears(),
        timetableService.getPeriods(),
      ]);

      const activeYear = years.find((y) => y.is_current) || years[0];
      setCurrentYear(activeYear || null);
      setPeriods(pds);

      if (!activeYear) return;

      // 2. Find faculty record matching logged-in user profile
      let facultyRecord: FacultyMember | null = null;
      if (profile?.id) {
        facultyRecord = await facultyService.getFacultyByUserId(profile.id);
      }

      // If user profile is not directly linked yet, fallback to email lookup
      if (!facultyRecord && profile?.email) {
        const { data: allFaculty } = await facultyService.getFaculty({ page: 1, pageSize: 100 });
        facultyRecord = allFaculty.find((f) => f.email.toLowerCase() === profile.email.toLowerCase()) || null;
      }

      setFaculty(facultyRecord);

      if (facultyRecord) {
        // 3. Fetch timetable entries for this faculty
        const facultyEntries = await timetableService.getTimetableEntries({
          academicYearId: activeYear.id,
          facultyId: facultyRecord.id,
          status: 'PUBLISHED',
        });
        setEntries(facultyEntries);
      }
    } catch (err: any) {
      toast.error(err.message || 'Could not load your teaching timetable', 'Schedule Fetch Failed');
    } finally {
      setLoading(false);
    }
  }, [profile, toast]);

  useEffect(() => {
    loadFacultySchedule();
  }, [loadFacultySchedule]);

  // Entry lookup map: "DAY_PERIOD" -> TimetableEntry
  const entryMap = useMemo(() => {
    const map = new Map<string, TimetableEntry>();
    entries.forEach((e) => {
      map.set(`${e.day_of_week}_${e.period_number}`, e);
    });
    return map;
  }, [entries]);

  // Today's specific schedule
  const todayEntries = useMemo(() => {
    return entries
      .filter((e) => e.day_of_week === todayName)
      .sort((a, b) => a.period_number - b.period_number);
  }, [entries, todayName]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              My Teaching Timetable
            </h1>
            {currentYear && (
              <Badge variant="success">
                {currentYear.name}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {faculty
              ? `Weekly teaching schedule for ${faculty.full_name} (${faculty.department})`
              : 'Weekly teaching timetable overview'}
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={loadFacultySchedule}
          disabled={loading}
          leftIcon={<RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />}
        >
          Refresh Schedule
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-4 border-l-4 border-l-brand-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Weekly Teaching Load
              </p>
              <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {entries.length} Periods
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Today's Sessions ({todayName})
              </p>
              <h3 className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {todayEntries.length} Classes
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CalendarDays className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Assigned Classes
              </p>
              <h3 className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {new Set(entries.map((e) => `${e.class?.name}-${e.section?.name}`)).size} Sections
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <School className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Timeline Widget */}
      {todayEntries.length > 0 && (
        <Card className="p-5 bg-gradient-to-r from-brand-50/60 to-white dark:from-slate-800 dark:to-slate-900 border-brand-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            <h3 className="font-bold text-slate-900 dark:text-white">
              Today's Classes ({todayName})
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {todayEntries.map((item) => {
              const matchedPeriod = periods.find((p) => p.period_number === item.period_number);
              return (
                <div
                  key={item.id}
                  className="rounded-lg bg-white p-3.5 shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                      Period {item.period_number}
                    </span>
                    {matchedPeriod && (
                      <span className="text-[11px] text-slate-500">
                        {matchedPeriod.start_time.slice(0, 5)} - {matchedPeriod.end_time.slice(0, 5)}
                      </span>
                    )}
                  </div>
                  <h4 className="mt-1.5 font-bold text-sm text-slate-900 dark:text-white">
                    {item.subject?.name}
                  </h4>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Class {item.class?.name}-{item.section?.name}</span>
                    {item.room && <span>Room: {item.room}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Full Weekly Timetable Grid */}
      <Card className="overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            <span className="font-bold text-slate-900 dark:text-white">
              Full Weekly Schedule Matrix
            </span>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Official Timetable ({currentYear?.name})
          </span>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr className="bg-slate-100/75 dark:bg-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3.5 text-left w-32 border-r border-slate-200 dark:border-slate-700">
                    Day
                  </th>
                  {periods.map((pd) => (
                    <th
                      key={pd.id}
                      className={`p-3 min-w-[130px] border-r border-slate-200 dark:border-slate-700 ${
                        pd.is_break ? 'bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300' : ''
                      }`}
                    >
                      <div className="font-bold text-sm">{pd.name}</div>
                      <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                        {pd.start_time.slice(0, 5)} - {pd.end_time.slice(0, 5)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
                {DAYS_OF_WEEK.map((day) => (
                  <tr
                    key={day}
                    className={`transition-colors ${
                      day === todayName
                        ? 'bg-brand-50/20 dark:bg-brand-950/10'
                        : 'hover:bg-slate-50/40 dark:hover:bg-slate-800/20'
                    }`}
                  >
                    <td className="p-3.5 text-left font-bold text-slate-900 dark:text-white bg-slate-50/70 dark:bg-slate-800/40 border-r border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-1.5">
                        <span>{day}</span>
                        {day === todayName && (
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                        )}
                      </div>
                    </td>

                    {periods.map((pd) => {
                      if (pd.is_break) {
                        return (
                          <td
                            key={pd.id}
                            className="p-2 border-r border-slate-200 dark:border-slate-700 bg-amber-50/30 dark:bg-amber-950/10 text-amber-800 dark:text-amber-400 text-xs font-semibold"
                          >
                            <div className="flex flex-col items-center justify-center py-3">
                              <Coffee className="h-4 w-4 mb-1 opacity-70" />
                              <span>{pd.name}</span>
                            </div>
                          </td>
                        );
                      }

                      const entry = entryMap.get(`${day}_${pd.period_number}`);

                      return (
                        <td
                          key={pd.id}
                          className="p-2 border-r border-slate-200 dark:border-slate-700 align-top h-24"
                        >
                          {entry ? (
                            <div className="h-full rounded-lg bg-brand-50/90 border border-brand-200 p-2.5 text-left shadow-sm dark:bg-brand-950/40 dark:border-brand-900/60">
                              <span className="block font-bold text-xs text-brand-950 dark:text-brand-200 truncate">
                                {entry.subject?.name}
                              </span>

                              <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-brand-700 dark:text-brand-300">
                                <School className="h-3 w-3 flex-shrink-0" />
                                <span>Class {entry.class?.name}-{entry.section?.name}</span>
                              </div>

                              {entry.room && (
                                <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
                                  <MapPin className="h-2.5 w-2.5" />
                                  <span>Room: {entry.room}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-full w-full rounded-lg border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700 text-xs">
                              Free
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
