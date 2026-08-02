export type ViewMode = 'spacious' | 'compact' | 'list';
export type PlusMinusMode = 'add' | 'subtract';

export interface TimerItem {
  id: string;
  name: string;
  remainingSeconds: number; // Current remaining time in seconds
  targetEndTime: number | null; // Timestamp (Date.now() + remainingSeconds * 1000) when running
  isRunning: boolean;
  isSelected: boolean;
  isExpired: boolean;
  createdAt: number;
  initialSeconds?: number;
  colorTag?: string; // Optional color accent
}

export type TimeQuickAdd = 30 | 60 | 180 | 300 | 600 | 900 | 2700 | 3600;

export const QUICK_ADD_OPTIONS: { label: string; seconds: number; mobileHide?: boolean }[] = [
  { label: '30 sec', seconds: 30,  mobileHide: true  },
  { label: '1 min',  seconds: 60                     },
  { label: '3 min',  seconds: 180, mobileHide: true  },
  { label: '5 min',  seconds: 300                    },
  { label: '10 min', seconds: 600                    },
  { label: '15 min', seconds: 900                    },
  { label: '45 min', seconds: 2700, mobileHide: true },
  { label: '1 hr',   seconds: 3600, mobileHide: true },
];
