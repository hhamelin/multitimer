import { useState, useEffect, useCallback, useRef } from 'react';
import type { TimerItem, PlusMinusMode, ViewMode } from '../types/timer';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'multitimer_app_state_v1';

const INITIAL_TIMERS: TimerItem[] = [
  {
    id: 'timer-1',
    name: 'Customer 1',
    remainingSeconds: 1800,
    targetEndTime: null,
    isRunning: false,
    isSelected: false,
    isExpired: false,
    createdAt: Date.now() - 7000,
    colorTag: '#3b82f6',
  },
  {
    id: 'timer-2',
    name: 'Customer 2',
    remainingSeconds: 1800,
    targetEndTime: null,
    isRunning: false,
    isSelected: false,
    isExpired: false,
    createdAt: Date.now() - 6000,
    colorTag: '#10b981',
  },
  {
    id: 'timer-3',
    name: 'Customer 3',
    remainingSeconds: 1800,
    targetEndTime: null,
    isRunning: false,
    isSelected: false,
    isExpired: false,
    createdAt: Date.now() - 5000,
    colorTag: '#8b5cf6',
  },
  {
    id: 'timer-4',
    name: 'Customer 4',
    remainingSeconds: 1800,
    targetEndTime: null,
    isRunning: false,
    isSelected: false,
    isExpired: false,
    createdAt: Date.now() - 4000,
    colorTag: '#f59e0b',
  },
  {
    id: 'timer-5',
    name: 'Customer 5',
    remainingSeconds: 1800,
    targetEndTime: null,
    isRunning: false,
    isSelected: false,
    isExpired: false,
    createdAt: Date.now() - 3000,
    colorTag: '#06b6d4',
  },
  {
    id: 'timer-6',
    name: 'Customer 6',
    remainingSeconds: 1800,
    targetEndTime: null,
    isRunning: false,
    isSelected: false,
    isExpired: false,
    createdAt: Date.now() - 2000,
    colorTag: '#ef4444',
  },
  {
    id: 'timer-7',
    name: 'Customer 7',
    remainingSeconds: 1800,
    targetEndTime: null,
    isRunning: false,
    isSelected: false,
    isExpired: false,
    createdAt: Date.now() - 1000,
    colorTag: '#ec4899',
  },
];

export function useMultiTimer() {
  const [timers, setTimers] = useState<TimerItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Adjust targetEndTimes if timers were running when saved
          const now = Date.now();
          return parsed.map((t: TimerItem) => {
            if (t.isRunning && t.targetEndTime) {
              const rem = Math.max(0, Math.round((t.targetEndTime - now) / 1000));
              return {
                ...t,
                remainingSeconds: rem,
                targetEndTime: rem > 0 ? now + rem * 1000 : null,
                isRunning: rem > 0,
                isExpired: rem === 0,
              };
            }
            return t;
          });
        }
      }
    } catch (e) {
      console.warn('Failed to load saved multitimer state:', e);
    }
    return INITIAL_TIMERS;
  });

  const [plusMinusMode, setPlusMinusMode] = useState<PlusMinusMode>('add');
  const [viewModeOverride, setViewModeOverride] = useState<ViewMode | null>(null);
  const expiredAlertedRef = useRef<Set<string>>(new Set());

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return (localStorage.getItem('multitimer_theme') as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('multitimer_theme', next);
      } catch (e) {
        console.warn('Failed to save theme setting:', e);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const currentViewMode: ViewMode = viewModeOverride || 'spacious';

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let hasChanged = false;

      setTimers((prevTimers) => {
        const next = prevTimers.map((t) => {
          if (!t.isRunning || !t.targetEndTime) {
            return t;
          }

          const rem = Math.max(0, Math.round((t.targetEndTime - now) / 1000));
          if (rem !== t.remainingSeconds) {
            hasChanged = true;
          }

          const newlyExpired = rem === 0 && t.remainingSeconds > 0;
          if (newlyExpired && !expiredAlertedRef.current.has(t.id)) {
            expiredAlertedRef.current.add(t.id);
            soundEngine.playAlarmSound();
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
            });
          }

          if (rem === 0) {
            return {
              ...t,
              remainingSeconds: 0,
              targetEndTime: null,
              isRunning: false,
              isExpired: true,
            };
          }

          return {
            ...t,
            remainingSeconds: rem,
          };
        });

        return hasChanged ? next : prevTimers;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const addTimer = useCallback((name?: string, durationSeconds: number = 1800) => {
    setTimers((prev) => {
      if (prev.length >= 21) {
        alert('Maximum limit of 21 timers reached.');
        return prev;
      }
      const newId = `timer-${Date.now()}`;
      const defaultName = name || `Customer ${prev.length + 1}`;
      const newTimer: TimerItem = {
        id: newId,
        name: defaultName,
        remainingSeconds: durationSeconds,
        targetEndTime: null,
        isRunning: false,
        isSelected: false,
        isExpired: false,
        createdAt: Date.now(),
      };
      return [...prev, newTimer];
    });
  }, []);

  const togglePlayPause = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (t.isRunning) {
          return {
            ...t,
            isRunning: false,
            targetEndTime: null,
          };
        } else {
          if (t.remainingSeconds <= 0) return t;
          expiredAlertedRef.current.delete(t.id);
          return {
            ...t,
            isRunning: true,
            isExpired: false,
            targetEndTime: Date.now() + t.remainingSeconds * 1000,
          };
        }
      })
    );
  }, []);

  const playPauseSelected = useCallback(() => {
    setTimers((prev) => {
      const selected = prev.filter((t) => t.isSelected);
      if (selected.length === 0) return prev;

      const anyPaused = selected.some((t) => !t.isRunning && t.remainingSeconds > 0);
      const now = Date.now();

      return prev.map((t) => {
        if (!t.isSelected) return t;
        if (anyPaused) {
          if (t.remainingSeconds <= 0) return t;
          expiredAlertedRef.current.delete(t.id);
          return {
            ...t,
            isRunning: true,
            isExpired: false,
            targetEndTime: now + t.remainingSeconds * 1000,
          };
        } else {
          return {
            ...t,
            isRunning: false,
            targetEndTime: null,
          };
        }
      });
    });
  }, []);

  const addTime = useCallback((id: string, deltaSeconds: number) => {
    setTimers((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const newRem = Math.max(0, t.remainingSeconds + deltaSeconds);
        const now = Date.now();
        if (newRem > 0) {
          expiredAlertedRef.current.delete(t.id);
        }
        return {
          ...t,
          remainingSeconds: newRem,
          isExpired: newRem === 0,
          targetEndTime: t.isRunning && newRem > 0 ? now + newRem * 1000 : null,
          isRunning: t.isRunning && newRem > 0,
        };
      })
    );
  }, []);

  const addTimeSelected = useCallback((deltaSeconds: number) => {
    const actualDelta = plusMinusMode === 'subtract' ? -deltaSeconds : deltaSeconds;
    const now = Date.now();

    setTimers((prev) =>
      prev.map((t) => {
        if (!t.isSelected) return t;
        const newRem = Math.max(0, t.remainingSeconds + actualDelta);
        if (newRem > 0) {
          expiredAlertedRef.current.delete(t.id);
        }
        return {
          ...t,
          remainingSeconds: newRem,
          isExpired: newRem === 0,
          targetEndTime: t.isRunning && newRem > 0 ? now + newRem * 1000 : null,
          isRunning: t.isRunning && newRem > 0,
        };
      })
    );
  }, [plusMinusMode]);

  const setManualTime = useCallback((id: string, totalSeconds: number) => {
    const now = Date.now();
    setTimers((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const newRem = Math.max(0, totalSeconds);
        if (newRem > 0) {
          expiredAlertedRef.current.delete(t.id);
        }
        return {
          ...t,
          remainingSeconds: newRem,
          isExpired: newRem === 0,
          targetEndTime: t.isRunning && newRem > 0 ? now + newRem * 1000 : null,
          isRunning: t.isRunning && newRem > 0,
        };
      })
    );
  }, []);

  const setManualTimeSelected = useCallback((totalSeconds: number) => {
    const now = Date.now();
    setTimers((prev) =>
      prev.map((t) => {
        if (!t.isSelected) return t;
        const newRem = Math.max(0, totalSeconds);
        if (newRem > 0) {
          expiredAlertedRef.current.delete(t.id);
        }
        return {
          ...t,
          remainingSeconds: newRem,
          isExpired: newRem === 0,
          targetEndTime: t.isRunning && newRem > 0 ? now + newRem * 1000 : null,
          isRunning: t.isRunning && newRem > 0,
        };
      })
    );
  }, []);

  const clearTimer = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return {
          ...t,
          remainingSeconds: 0,
          targetEndTime: null,
          isRunning: false,
          isExpired: false,
        };
      })
    );
  }, []);

  const deleteTimer = useCallback((id: string) => {
    setTimers((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearSelected = useCallback(() => {
    setTimers((prev) =>
      prev.map((t) => {
        if (!t.isSelected) return t;
        return {
          ...t,
          remainingSeconds: 0,
          targetEndTime: null,
          isRunning: false,
          isExpired: false,
        };
      })
    );
  }, []);

  const deleteSelected = useCallback(() => {
    setTimers((prev) => prev.filter((t) => !t.isSelected));
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isSelected: !t.isSelected } : t))
    );
  }, []);

  const selectAll = useCallback((shouldSelectAll: boolean) => {
    setTimers((prev) => prev.map((t) => ({ ...t, isSelected: shouldSelectAll })));
  }, []);

  const updateTimerName = useCallback((id: string, name: string) => {
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name } : t))
    );
  }, []);

  const reorderTimers = useCallback((startIndex: number, endIndex: number) => {
    setTimers((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  const selectedCount = timers.filter((t) => t.isSelected).length;
  const isAllSelected = timers.length > 0 && selectedCount === timers.length;

  return {
    timers,
    plusMinusMode,
    setPlusMinusMode,
    currentViewMode,
    setViewModeOverride,
    addTimer,
    togglePlayPause,
    playPauseSelected,
    addTime,
    addTimeSelected,
    setManualTime,
    setManualTimeSelected,
    clearTimer,
    deleteTimer,
    clearSelected,
    deleteSelected,
    toggleSelect,
    selectAll,
    updateTimerName,
    reorderTimers,
    selectedCount,
    isAllSelected,
    theme,
    toggleTheme,
  };
}
