import React, { useState } from 'react';
import type { TimerItem, PlusMinusMode, ViewMode } from '../types/timer';
import { TimerCard } from './TimerCard';
import { PlusCircle } from 'lucide-react';

interface TimerGridProps {
  timers: TimerItem[];
  plusMinusMode: PlusMinusMode;
  viewMode: ViewMode;
  onToggleSelect: (id: string) => void;
  onTogglePlayPause: (id: string) => void;
  onAddTime: (id: string, seconds: number) => void;
  onSetManualTime: (id: string, totalSeconds: number) => void;
  onClearTimer: (id: string) => void;
  onDeleteTimer: (id: string) => void;
  onUpdateName: (id: string, name: string) => void;
  onReorderTimers: (startIndex: number, endIndex: number) => void;
  onAddTimer: () => void;
}

export const TimerGrid: React.FC<TimerGridProps> = ({
  timers,
  plusMinusMode,
  viewMode,
  onToggleSelect,
  onTogglePlayPause,
  onAddTime,
  onSetManualTime,
  onClearTimer,
  onDeleteTimer,
  onUpdateName,
  onReorderTimers,
  onAddTimer,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const count = timers.length;
  const PRIMARY_LIMIT = 6;

  const primaryTimers = timers.slice(0, PRIMARY_LIMIT);
  const secondaryTimers = timers.slice(PRIMARY_LIMIT);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorderTimers(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  if (count === 0) {
    return (
      <div className="empty-state-container">
        <div className="empty-state-card">
          <h3>No Active Timers</h3>
          <p>Click below to create your timers.</p>
          <button className="btn-empty-add" onClick={onAddTimer}>
            <PlusCircle size={20} />
            <span>Create First Timer</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`timer-dashboard-container view-${viewMode} count-${count}`}>
      <div className={`primary-timer-grid primary-count-${primaryTimers.length}`}>
        {primaryTimers.map((timer, index) => (
          <div
            key={timer.id}
            className={`grid-item-wrapper primary-item ${draggedIndex === index ? 'is-dragging' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <TimerCard
              timer={timer}
              plusMinusMode={plusMinusMode}
              viewMode={viewMode}
              variant="primary"
              onToggleSelect={onToggleSelect}
              onTogglePlayPause={onTogglePlayPause}
              onAddTime={onAddTime}
              onSetManualTime={onSetManualTime}
              onClearTimer={onClearTimer}
              onDeleteTimer={onDeleteTimer}
              onUpdateName={onUpdateName}
            />
          </div>
        ))}
      </div>

      {secondaryTimers.length > 0 && (
        <>
          <div className="timer-grid-separator" />
          <div className={`secondary-timer-grid secondary-count-${secondaryTimers.length}`}>
          {secondaryTimers.map((timer, secIndex) => {
            const globalIndex = PRIMARY_LIMIT + secIndex;
            return (
              <div
                key={timer.id}
                className={`grid-item-wrapper secondary-item ${
                  draggedIndex === globalIndex ? 'is-dragging' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, globalIndex)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, globalIndex)}
              >
                <TimerCard
                  timer={timer}
                  plusMinusMode={plusMinusMode}
                  viewMode={viewMode}
                  variant="primary"
                  onToggleSelect={onToggleSelect}
                  onTogglePlayPause={onTogglePlayPause}
                  onAddTime={onAddTime}
                  onSetManualTime={onSetManualTime}
                  onClearTimer={onClearTimer}
                  onDeleteTimer={onDeleteTimer}
                  onUpdateName={onUpdateName}
                />
              </div>
            );
          })}
        </div>
        </>
      )}
    </div>
  );
};
