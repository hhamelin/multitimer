import React, { useState } from 'react';
import {
  Play,
  Pause,
  Plus,
  Minus,
  Clock,
  LayoutGrid,
  Grid,
  List,
  CheckSquare,
  Square,
  PlusCircle,
  MoreVertical,
  RotateCcw,
  Sun,
  Moon,
  Maximize,
  Minimize,
} from 'lucide-react';
import { GalaxyClockIcon } from './GalaxyClockIcon';
import { FilledTrashIcon } from './FilledTrashIcon';
import type { PlusMinusMode, ViewMode } from '../types/timer';
import { QUICK_ADD_OPTIONS } from '../types/timer';
import { ManualTimeModal } from './ManualTimeModal';

interface HeaderToolbarProps {
  timerCount: number;
  selectedCount: number;
  isAllSelected: boolean;
  plusMinusMode: PlusMinusMode;
  onTogglePlusMinus: () => void;
  currentViewMode: ViewMode;
  onSelectViewMode: (mode: ViewMode) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onSelectAllToggle: () => void;
  onPlayPauseSelected: () => void;
  onAddTimeSelected: (seconds: number) => void;
  onManualTimeSelected: (totalSeconds: number) => void;
  onAddTimer: () => void;
  onClearSelected: () => void;
  onDeleteSelected: () => void;
}

export const HeaderToolbar: React.FC<HeaderToolbarProps> = ({
  timerCount,
  selectedCount,
  isAllSelected,
  plusMinusMode,
  onTogglePlusMinus,
  currentViewMode,
  onSelectViewMode,
  theme,
  onToggleTheme,
  onSelectAllToggle,
  onPlayPauseSelected,
  onAddTimeSelected,
  onManualTimeSelected,
  onAddTimer,
  onClearSelected,
  onDeleteSelected,
}) => {
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.warn);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.warn);
      }
    }
  };

  const handleQuickAdd = (seconds: number) => {
    onAddTimeSelected(seconds);
  };

  return (
    <>
      <header className="app-header">
        <div className="header-top-row">
          <div className="brand-section">
            <div className="brand-logo">
              <GalaxyClockIcon size={46} className="galaxy-spill-icon" />
            </div>
            <div>
              <h1 className="app-title">MultiTimer</h1>
              <p className="app-subtitle">Multi-Timer Dashboard</p>
            </div>
          </div>

          <div className="header-status-pills">
            <div className="unified-timer-count-pill">
              <div className="count-segment" title={`${timerCount} active timers out of 21 max`}>
                <span className="count-number">{timerCount}</span>
                <span className="count-max">/ 21</span>
              </div>
              <div className="segment-divider"></div>
              <button
                className="add-segment-btn"
                onClick={onAddTimer}
                disabled={timerCount >= 21}
                title={timerCount >= 21 ? 'Maximum 21 timers reached' : 'Add New Timer'}
              >
                <PlusCircle size={15} />
                <span>Add<span className="btn-label-full"> Timer</span></span>
              </button>
            </div>

            {selectedCount > 0 && (
              <div className="status-pill highlight">
                <span>{selectedCount} Selected</span>
              </div>
            )}
          </div>

          <div className="header-view-and-add">
            <div className="view-mode-toggle">
              <button
                className={`view-btn ${currentViewMode === 'spacious' ? 'active' : ''}`}
                onClick={() => onSelectViewMode('spacious')}
                title="Spacious Card View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                className={`view-btn ${currentViewMode === 'compact' ? 'active' : ''}`}
                onClick={() => onSelectViewMode('compact')}
                title="Compact Grid View"
              >
                <Grid size={16} />
              </button>
              <button
                className={`view-btn ${currentViewMode === 'list' ? 'active' : ''}`}
                onClick={() => onSelectViewMode('list')}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>

            <button
              className="btn-theme-toggle"
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light Mode' : 'Dark Mode'}`}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              className="btn-fullscreen-toggle"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>
          </div>
        </div>

        <div className="header-controls-bar">
          <div className="controls-group-left">
            <button
              className={`btn-select-all ${isAllSelected ? 'selected' : ''}`}
              onClick={onSelectAllToggle}
              title={isAllSelected ? 'Deselect All' : 'Select All'}
            >
              {isAllSelected ? <CheckSquare size={18} /> : <Square size={18} />}
              <span>{isAllSelected ? 'Deselect All' : 'Select All'}</span>
            </button>

            <button
              className="btn-play-pause-all split-play-pause"
              onClick={onPlayPauseSelected}
              disabled={selectedCount === 0}
              title="Play or Pause Selected Timers"
            >
              <span className="split-segment play-segment">
                <Play size={13} className="play-icon" fill="currentColor" />
                <span>Play</span>
              </span>
              <span className="split-segment pause-segment">
                <Pause size={13} className="pause-icon" fill="currentColor" />
                <span>Pause</span>
              </span>
            </button>

            {selectedCount > 0 && (
              <div className="status-pill highlight-mobile-only">
                <span>{selectedCount} Selected</span>
              </div>
            )}
          </div>

          <div className="quick-time-buttons-row">
            <button
              className={`btn-mode-toggle ${plusMinusMode === 'subtract' ? 'minus-active' : 'plus-active'}`}
              onClick={onTogglePlusMinus}
              disabled={selectedCount === 0}
              title={`Switch to ${plusMinusMode === 'add' ? 'Subtract Time (-)' : 'Add Time (+)'}`}
            >
              {plusMinusMode === 'add' ? <Plus size={14} /> : <Minus size={14} />}
            </button>

            {QUICK_ADD_OPTIONS.map((opt) => (
              <button
                key={opt.seconds}
                className={`btn-time-chip${opt.mobileHide ? ' mobile-hide' : ''}`}
                onClick={() => handleQuickAdd(opt.seconds)}
                disabled={selectedCount === 0}
              >
                <span className="chip-sign">{plusMinusMode === 'subtract' ? '−' : '+'}</span>
                <span>{opt.label}</span>
              </button>
            ))}

            <button
              className="btn-manual-time"
              onClick={() => setIsManualModalOpen(true)}
              disabled={selectedCount === 0}
              title="Set manual time for selected timers"
            >
              <Clock size={14} />
              <span>Manual Time</span>
            </button>
          </div>

          <div className="dropdown-container">
            <button
              className="btn-more-actions"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              disabled={selectedCount === 0}
              title="Bulk Actions"
            >
              <MoreVertical size={16} />
            </button>

            {showMoreMenu && (
              <div className="dropdown-menu" onClick={() => setShowMoreMenu(false)}>
                <button className="dropdown-item" onClick={onClearSelected}>
                  <RotateCcw size={14} />
                  <span>Clear Selected ({selectedCount})</span>
                </button>
                <button className="dropdown-item danger" onClick={onDeleteSelected}>
                  <FilledTrashIcon size={14} />
                  <span>Delete Selected ({selectedCount})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <ManualTimeModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onConfirm={onManualTimeSelected}
        title={`Set Time for ${selectedCount} Selected Timer(s)`}
      />
    </>
  );
};
