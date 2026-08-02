import React, { useState, useRef, useEffect } from 'react';
import { X, Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { formatTimeComponents } from '../utils/formatTime';

interface ManualTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (totalSeconds: number) => void;
  title?: string;
  initialSeconds?: number;
}

const pad = (n: number) => String(n).padStart(2, '0');

function TimeField({
  label,
  value,
  onChange,
  max,
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  max: number;
  autoFocus?: boolean;
}) {
  const num = parseInt(value, 10) || 0;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [animDir, setAnimDir] = useState<'up' | 'down'>('up');
  const hasSpun = useRef(false);

  const increment = () => {
    hasSpun.current = true;
    setAnimDir('up');
    setAnimKey(k => k + 1);
    onChange(pad(num >= max ? 0 : num + 1));
  };

  const decrement = () => {
    hasSpun.current = true;
    setAnimDir('down');
    setAnimKey(k => k + 1);
    onChange(pad(num <= 0 ? max : num - 1));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 2);
    const n = parseInt(raw, 10);
    if (!isNaN(n) && n > max) onChange(pad(max));
    else onChange(raw);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onChange(pad(Math.min(max, Math.max(0, num))));
  };

  return (
    <div className="time-field">
      <button
        type="button"
        className="time-spin-btn"
        onMouseDown={(e) => e.preventDefault()}
        onClick={increment}
        tabIndex={-1}
      >
        <ChevronUp size={16} />
      </button>
      <label>{label}</label>

      <div
        className={`time-drum${isFocused ? ' is-editing' : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        {!isFocused && (
          <span
            key={animKey}
            className={`time-drum-value${hasSpun.current ? ` roll-${animDir}` : ''}`}
          >
            {value}
          </span>
        )}

        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          className="time-drum-input"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp')   { e.preventDefault(); increment(); }
            if (e.key === 'ArrowDown') { e.preventDefault(); decrement(); }
          }}
          autoFocus={autoFocus}
        />
      </div>

      <button
        type="button"
        className="time-spin-btn"
        onMouseDown={(e) => e.preventDefault()}
        onClick={decrement}
        tabIndex={-1}
      >
        <ChevronDown size={16} />
      </button>
    </div>
  );
}

export const ManualTimeModal: React.FC<ManualTimeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Set Manual Time',
  initialSeconds = 1800,
}) => {
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('30');
  const [seconds, setSeconds] = useState('00');

  useEffect(() => {
    if (isOpen) {
      const { hours: h, minutes: m, seconds: s } = formatTimeComponents(initialSeconds);
      setHours(pad(parseInt(h, 10) || 0));
      setMinutes(pad(parseInt(m, 10) || 0));
      setSeconds(pad(parseInt(s, 10) || 0));
    }
  }, [isOpen, initialSeconds]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total =
      (parseInt(hours, 10) || 0) * 3600 +
      (parseInt(minutes, 10) || 0) * 60 +
      (parseInt(seconds, 10) || 0);
    onConfirm(total);
    onClose();
  };

  const setPreset = (presetSecs: number) => {
    const { hours: h, minutes: m, seconds: s } = formatTimeComponents(presetSecs);
    setHours(pad(parseInt(h, 10) || 0));
    setMinutes(pad(parseInt(m, 10) || 0));
    setSeconds(pad(parseInt(s, 10) || 0));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Clock className="modal-icon" size={20} />
            <span>{title}</span>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="time-input-grid">
            <TimeField label="Hours"   value={hours}   onChange={setHours}   max={99} autoFocus />
            <div className="time-colon">:</div>
            <TimeField label="Minutes" value={minutes} onChange={setMinutes} max={59} />
            <div className="time-colon">:</div>
            <TimeField label="Seconds" value={seconds} onChange={setSeconds} max={59} />
          </div>

          <div className="preset-chips">
            <span className="preset-label">Presets:</span>
            <button type="button" className="preset-chip-btn" onClick={() => setPreset(900)}>15m</button>
            <button type="button" className="preset-chip-btn" onClick={() => setPreset(1800)}>30m</button>
            <button type="button" className="preset-chip-btn" onClick={() => setPreset(2700)}>45m</button>
            <button type="button" className="preset-chip-btn" onClick={() => setPreset(3600)}>1h</button>
            <button type="button" className="preset-chip-btn" onClick={() => setPreset(7200)}>2h</button>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-apply">Apply Time</button>
          </div>
        </form>
      </div>
    </div>
  );
};
