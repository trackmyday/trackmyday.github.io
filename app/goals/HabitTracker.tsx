'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';

interface Goal {
  id: string;
  name: string;
  emoji: string;
}

interface CompletionData {
  [goalId: string]: {
    [date: string]: boolean;
  };
}

const EMOJI_OPTIONS = ['🛁', '🧘', '🍳', '💪', '💻', '📖', '💰', '🎯', '🚫', '📵', '✍️', '🚿', '⏰', '🗓️', '🌿'];

export default function HabitTracker() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [completions, setCompletions] = useState<CompletionData>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalEmoji, setNewGoalEmoji] = useState('✅');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    // Check for old 'habits' key and migrate if exists
    const savedHabits = localStorage.getItem('habits');
    const savedGoals = localStorage.getItem('goals');
    const savedCompletions = localStorage.getItem('completions');
    
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else if (savedHabits) {
      // Migrate from old 'habits' key
      const migratedGoals = JSON.parse(savedHabits);
      setGoals(migratedGoals);
      localStorage.setItem('goals', JSON.stringify(migratedGoals));
      localStorage.removeItem('habits');
    } else {
      // Initialize with sample goals
      const sampleGoals: Goal[] = [
        { id: '1', name: 'Bath', emoji: '🛁' },
        { id: '2', name: 'Meditation', emoji: '🧘' },
        { id: '3', name: 'Breakfast', emoji: '🍳' },
        { id: '4', name: 'Workout', emoji: '💪' },
        { id: '5', name: 'Coding', emoji: '💻' },
      ];
      setGoals(sampleGoals);
      localStorage.setItem('goals', JSON.stringify(sampleGoals));
    }
    
    if (savedCompletions) {
      setCompletions(JSON.parse(savedCompletions));
    }
  }, []);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('goals', JSON.stringify(goals));
    }
  }, [goals]);

  // Save completions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('completions', JSON.stringify(completions));
  }, [completions]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: Date[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return { days, startingDayOfWeek, daysInMonth };
  };

  useEffect(() => {
    const today = new Date();
    if (currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear()) {
      const { startingDayOfWeek } = getDaysInMonth(currentMonth);
      const dayIndex = today.getDate();
      const weekIndex = Math.floor((startingDayOfWeek + dayIndex - 1) / 7);
      
      if (scrollContainerRef.current) {
        const weekHeader = document.getElementById(`week-header-${weekIndex}`);
        if (weekHeader) {
          const container = scrollContainerRef.current;
          const headerRect = weekHeader.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const scrollLeft = headerRect.left - containerRect.left + container.scrollLeft;

          setTimeout(() => {
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
          }, 100);
        }
      }
    }
  }, [currentMonth]);

  const formatDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const toggleCompletion = (goalId: string, date: Date) => {
    const dateKey = formatDateKey(date);
    setCompletions(prev => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        [dateKey]: !prev[goalId]?.[dateKey],
      },
    }));
  };

  const isCompleted = (goalId: string, date: Date): boolean => {
    const dateKey = formatDateKey(date);
    return completions[goalId]?.[dateKey] || false;
  };

  const addGoal = () => {
    if (newGoalName.trim() && goals.length < 50) {
      const newGoal: Goal = {
        id: Date.now().toString(),
        name: newGoalName.trim(),
        emoji: newGoalEmoji,
      };
      setGoals([...goals, newGoal]);
      setNewGoalName('');
      setNewGoalEmoji('✅');
      setShowAddGoal(false);
    }
  };

  const removeGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId));
    const newCompletions = { ...completions };
    delete newCompletions[goalId];
    setCompletions(newCompletions);
  };

  const getDayLabel = (date: Date): string => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return days[date.getDay()];
  };

  const getMonthName = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'long' });
  };

  const getWeeks = () => {
    const { days, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const weeks: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      currentWeek.push(null);
    }
    
    // Add all days of the month
    days.forEach(day => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    // Add empty cells for the last week if needed
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const getProgressForDay = (date: Date | null): { progress: number; done: number; notDone: number } => {
    if (!date) return { progress: 0, done: 0, notDone: 0 };
    
    const completed = goals.filter(goal => isCompleted(goal.id, date)).length;
    const total = goals.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      progress,
      done: completed,
      notDone: total - completed,
    };
  };

  const getAllDaysInMonth = (): Date[] => {
    const { days } = getDaysInMonth(currentMonth);
    return days;
  };

  const getTotalCompleted = (): number => {
    return Object.values(completions).reduce((total, goalCompletions) => {
      return total + Object.values(goalCompletions).filter(Boolean).length;
    }, 0);
  };

  const getOverallProgress = (): number => {
    const allDays = getAllDaysInMonth();
    const totalPossible = goals.length * allDays.length;
    if (totalPossible === 0) return 0;
    
    const totalCompleted = allDays.reduce((sum, day) => {
      return sum + goals.filter(goal => isCompleted(goal.id, day)).length;
    }, 0);
    
    return Math.round((totalCompleted / totalPossible) * 100);
  };

  const weeks = getWeeks();
  const allDays = getAllDaysInMonth();
  const totalCompleted = getTotalCompleted();
  const overallProgress = getOverallProgress();

  return (
    // <div className="min-h-screen bg-gray-50 p-4 md:p-8">
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 bg-gradient-to-br from-[#91ddcf] via-[#f7f9f2] to-[#e8c5e5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-800">{getMonthName(currentMonth)}</h1>
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="text-sm text-gray-600">Number of goals: {goals.length}</div>
            <div className="text-sm text-gray-600">Completed goals: {totalCompleted}</div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Progress:</span>
              <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">{overallProgress}%</span>
            </div>
          </div>
        </div>

        {/* Add Goal Button */}
        <div className="mb-4">
          {!showAddGoal ? (
            <button
              onClick={() => setShowAddGoal(true)}
              disabled={goals.length >= 50}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              + Add Goal {goals.length >= 50 && '(Max 50)'}
            </button>
          ) : (
            <div className="flex gap-2 items-center flex-wrap">
              <input
                type="text"
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                placeholder="Goal name"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                maxLength={50}
              />
              <select
                value={newGoalEmoji}
                onChange={(e) => setNewGoalEmoji(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {EMOJI_OPTIONS.map(emoji => (
                  <option key={emoji} value={emoji}>{emoji}</option>
                ))}
              </select>
              <button
                onClick={addGoal}
                disabled={!newGoalName.trim() || goals.length >= 50}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddGoal(false);
                  setNewGoalName('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto" ref={scrollContainerRef}>
            <div className="inline-block min-w-full">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="sticky left-0 z-10 bg-gray-100 border border-gray-300 p-3 text-left font-semibold text-gray-700 min-w-[200px]">
                      My Goals
                    </th>
                    {weeks.map((week, weekIndex) => (
                      <th key={weekIndex} id={`week-header-${weekIndex}`} colSpan={week.length} className="border border-gray-300 p-2 text-center bg-gray-50">
                        <div className="font-semibold text-gray-700">Week {weekIndex + 1}</div>
                        <div className="flex">
                          {week.map((day, dayIndex) => (
                            <div key={dayIndex} className="flex-1 border-l border-gray-300 first:border-l-0 p-1">
                              {day ? (
                                <>
                                  <div className="text-xs text-gray-600">{getDayLabel(day)}</div>
                                  <div className="text-sm font-semibold text-gray-800">{day.getDate()}</div>
                                </>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {goals.map((goal) => (
                    <tr key={goal.id} className="hover:bg-gray-50">
                      <td className="sticky left-0 z-10 bg-white border border-gray-300 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-base">
                            {goal.emoji} {goal.name}
                          </span>
                          <button
                            onClick={() => removeGoal(goal.id)}
                            className="ml-2 text-red-500 hover:text-red-700 text-sm"
                            title="Remove goal"
                          >
                            ×
                          </button>
                        </div>
                      </td>
                      {weeks.map((week, weekIndex) => (
                        <React.Fragment key={weekIndex}>
                          {week.map((day, dayIndex) => (
                            <td
                              key={dayIndex}
                              className="border border-gray-300 p-2 text-center"
                            >
                              {day ? (
                                <button
                                  onClick={() => toggleCompletion(goal.id, day)}
                                  className={`w-8 h-8 border-2 rounded transition-all ${
                                    isCompleted(goal.id, day)
                                      ? 'bg-green-500 border-green-600 text-white'
                                      : 'bg-white border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
                                  }`}
                                >
                                  {isCompleted(goal.id, day) ? '✓' : ''}
                                </button>
                              ) : null}
                            </td>
                          ))}
                        </React.Fragment>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Progress Summary Table */}
        <div className="mt-6 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700">Progress</th>
                  {allDays.map((day) => (
                    <th key={formatDateKey(day)} className="border border-gray-300 p-2 text-center text-sm font-semibold text-gray-700">
                      {day.getDate()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold text-gray-700">Progress</td>
                  {allDays.map((day) => {
                    const { progress } = getProgressForDay(day);
                    return (
                      <td key={formatDateKey(day)} className="border border-gray-300 p-2 text-center text-sm">
                        {progress}%
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold text-gray-700">Done</td>
                  {allDays.map((day) => {
                    const { done } = getProgressForDay(day);
                    return (
                      <td key={formatDateKey(day)} className="border border-gray-300 p-2 text-center text-sm">
                        {done}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold text-gray-700">Not Done</td>
                  {allDays.map((day) => {
                    const { notDone } = getProgressForDay(day);
                    return (
                      <td key={formatDateKey(day)} className="border border-gray-300 p-2 text-center text-sm">
                        {notDone}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Progress Graph */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Progress Graph</h2>
          <div className="h-48 flex items-end gap-1">
            {allDays.map((day) => {
              const { progress } = getProgressForDay(day);
              return (
                <div key={formatDateKey(day)} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex items-end justify-center" style={{ height: '180px' }}>
                    <div
                      className="w-full bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600"
                      style={{ height: `${(progress / 100) * 180}px`, minHeight: progress > 0 ? '2px' : '0' }}
                      title={`Day ${day.getDate()}: ${progress}%`}
                    />
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{day.getDate()}</div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Previous Month
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Next Month →
          </button>
        </div>
        <footer className="container mx-auto px-4 py-8 mt-16 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <Link href="/" className="text-gray-700 hover:text-indigo-600 transition-colors font-bold">
            Back to Home
          </Link>
        </div>
      </footer>
      </div>
    </div>
  );
}
