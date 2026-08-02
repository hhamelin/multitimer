import React, { useState } from 'react';
import {
  GripVertical,
  Play,
  Pause,
  Clock,
} from 'lucide-react';
import type { TimerItem, PlusMinusMode, ViewMode } from '../types/timer';
import { QUICK_ADD_OPTIONS } from '../types/timer';
import { formatTimeComponents } from '../utils/formatTime';
import { TrashConfirmGroup } from './TrashConfirmGroup';
import { ManualTimeModal } from './ManualTimeModal';

interface TimerCardProps {
  timer: TimerItem;
  plusMinusMode: PlusMinusMode;
  viewMode: ViewMode;
  variant?: 'primary' | 'secondary';
  onToggleSelect: (id: string) => void;
  onTogglePlayPause: (id: string) => void;
  onAddTime: (id: string, seconds: number) => void;
  onSetManualTime: (id: string, totalSeconds: number) => void;
  onClearTimer: (id: string) => void;
  onDeleteTimer: (id: string) => void;
  onUpdateName: (id: string, name: string) => void;
  dragHandleProps?: Record<string, unknown>;
}

export const TimerCard: React.FC<TimerCardProps> = ({
  timer,
  plusMinusMode,
  viewMode,
  variant = 'primary',
  onToggleSelect,
  onTogglePlayPause,
  onAddTime,
  onSetManualTime,
  onClearTimer,
  onDeleteTimer,
  onUpdateName,
  dragHandleProps,
}) => {
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(timer.name);

  const timeComp = formatTimeComponents(timer.remainingSeconds);

  const handleNameBlur = () => {
    setIsEditingName(false);
    if (nameInput.trim() && nameInput !== timer.name) {
      onUpdateName(timer.id, nameInput.trim());
    } else {
      setNameInput(timer.name);
    }
  };

  const handleQuickAdd = (seconds: number) => {
    const actualDelta = plusMinusMode === 'subtract' ? -seconds : seconds;
    onAddTime(timer.id, actualDelta);
  };

  const isCompact = viewMode === 'compact';
  const isList = viewMode === 'list';

  let statusClass = 'status-paused';
  let statusText = 'PAUSED';
  if (timer.isExpired) {
    statusClass = 'status-expired';
    statusText = 'FINISHED!';
  } else if (timer.isRunning) {
    statusClass = 'status-running';
    statusText = 'RUNNING';
  }

  return (
    <>
      <div
        className={`timer-card variant-${variant} ${timer.isSelected ? 'selected' : ''} ${
          timer.isRunning ? 'running' : ''
        } ${timer.isExpired ? 'expired' : ''} mode-${viewMode}`}
      >
        <div className="card-top-bar">
          <div className="left-controls">
            <span className="drag-handle" {...dragHandleProps} title="Drag to reorder">
              <GripVertical size={16} />
            </span>
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={timer.isSelected}
                onChange={() => onToggleSelect(timer.id)}
              />
              <span className="checkmark"></span>
            </label>

            {isEditingName ? (
              <input
                type="text"
                className="input-timer-name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={handleNameBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameBlur();
                }}
                autoFocus
              />
            ) : (
              <span
                className="timer-name-display"
                onClick={() => setIsEditingName(true)}
                title="Click to rename"
              >
                {timer.name}
              </span>
            )}
          </div>

          <div className="right-controls">
            <span className={`status-badge ${statusClass}`}>{statusText}</span>
          </div>
        </div>

        <div className="card-body-row">
          <div className="countdown-display">
            <span className="digits">{timeComp.display}</span>
          </div>

          <button
            className={`btn-play-pause ${timer.isRunning ? 'playing' : 'paused'}`}
            onClick={() => onTogglePlayPause(timer.id)}
            disabled={timer.remainingSeconds <= 0 && !timer.isRunning}
            title={timer.isRunning ? 'Pause' : 'Start'}
          >
            {timer.isRunning ? (
              <Pause size={isCompact ? 18 : 22} fill="currentColor" />
            ) : (
              <Play size={isCompact ? 18 : 22} fill="currentColor" />
            )}
          </button>
        </div>

        {!isList && (
          <div className="card-quick-buttons-row">
            {QUICK_ADD_OPTIONS.map((opt) => (
              <button
                key={opt.seconds}
                className={`btn-card-time-chip${opt.mobileHide ? ' mobile-hide' : ''}`}
                onClick={() => handleQuickAdd(opt.seconds)}
              >
                <span className="chip-sign">{plusMinusMode === 'subtract' ? '−' : '+'}</span>
                <span>{opt.label}</span>
              </button>
            ))}

            <button
              className="btn-card-manual"
              onClick={() => setIsManualModalOpen(true)}
              title="Set precise remaining time"
            >
              <Clock size={14} />
              <span>Manual Time</span>
            </button>

            <div className="card-row-spacer" />

            <TrashConfirmGroup
              onDelete={() => onDeleteTimer(timer.id)}
              onClear={() => onClearTimer(timer.id)}
              isCompact={isCompact}
            />
          </div>
        )}

        {isList && (
          <div className="card-footer-bar">
            <button
              className="btn-card-manual"
              onClick={() => setIsManualModalOpen(true)}
              title="Set precise remaining time"
            >
              <Clock size={14} />
              <span>Manual Time</span>
            </button>
            <TrashConfirmGroup
              onDelete={() => onDeleteTimer(timer.id)}
              onClear={() => onClearTimer(timer.id)}
              isCompact={isCompact}
            />
          </div>
        )}
      </div>

      <ManualTimeModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onConfirm={(secs) => onSetManualTime(timer.id, secs)}
        title={`Set Manual Time for ${timer.name}`}
        initialSeconds={timer.remainingSeconds}
      />
    </>
  );
};
