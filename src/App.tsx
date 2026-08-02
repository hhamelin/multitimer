import { useMultiTimer } from './hooks/useMultiTimer';
import { HeaderToolbar } from './components/HeaderToolbar';
import { TimerGrid } from './components/TimerGrid';
import { PortfolioReturnBanner } from './components/PortfolioReturnBanner';
import { Footer } from './components/Footer';
import './scss/index.scss';

export function App() {
  const {
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
  } = useMultiTimer();

  const handleSelectAllToggle = () => {
    selectAll(!isAllSelected);
  };

  const handleTogglePlusMinus = () => {
    setPlusMinusMode((prev) => (prev === 'add' ? 'subtract' : 'add'));
  };

  return (
    <div className="app-container">
      <PortfolioReturnBanner />
      <div className="app-wrapper">
        <HeaderToolbar
          timerCount={timers.length}
          selectedCount={selectedCount}
          isAllSelected={isAllSelected}
          plusMinusMode={plusMinusMode}
          onTogglePlusMinus={handleTogglePlusMinus}
          currentViewMode={currentViewMode}
          onSelectViewMode={setViewModeOverride}
          theme={theme}
          onToggleTheme={toggleTheme}
          onSelectAllToggle={handleSelectAllToggle}
          onPlayPauseSelected={playPauseSelected}
          onAddTimeSelected={addTimeSelected}
          onManualTimeSelected={setManualTimeSelected}
          onAddTimer={() => addTimer()}
          onClearSelected={clearSelected}
          onDeleteSelected={deleteSelected}
        />

        <main className="main-content">
          <TimerGrid
            timers={timers}
            plusMinusMode={plusMinusMode}
            viewMode={currentViewMode}
            onToggleSelect={toggleSelect}
            onTogglePlayPause={togglePlayPause}
            onAddTime={addTime}
            onSetManualTime={setManualTime}
            onClearTimer={clearTimer}
            onDeleteTimer={deleteTimer}
            onUpdateName={updateTimerName}
            onReorderTimers={reorderTimers}
            onAddTimer={() => addTimer()}
          />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
