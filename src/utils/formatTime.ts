export function formatTimeComponents(totalSeconds: number): {
  hours: string;
  minutes: string;
  seconds: string;
  display: string;
} {
  const isNegative = totalSeconds < 0;
  const absSecs = Math.abs(totalSeconds);

  const h = Math.floor(absSecs / 3600);
  const m = Math.floor((absSecs % 3600) / 60);
  const s = Math.floor(absSecs % 60);

  const hoursStr = String(h);
  const minutesStr = String(m).padStart(2, '0');
  const secondsStr = String(s).padStart(2, '0');

  const prefix = isNegative ? '-' : '';
  const display = `${prefix}${hoursStr}:${minutesStr}:${secondsStr}`;

  return {
    hours: hoursStr,
    minutes: minutesStr,
    seconds: secondsStr,
    display,
  };
}

export function parseSeconds(hours: number, minutes: number, seconds: number): number {
  return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
}
