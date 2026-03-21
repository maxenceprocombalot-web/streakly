// Date utilities
export function getDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getDayOfWeek(date: Date): number {
  // 0 = Monday, 6 = Sunday
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

export function getWeekDayLabel(dayIndex: number): string {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  return days[dayIndex];
}

export function getWeekDayInitial(dayIndex: number): string {
  const initials = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  return initials[dayIndex];
}

export function getFullDateLabel(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };
  return date.toLocaleDateString('fr-FR', options);
}

export function formatTime(timeString: string): string {
  // Input: "14:30", Output: "14h30"
  return timeString.replace(':', 'h');
}

export function getWeekDays(): { label: string; date: Date; isToday: boolean }[] {
  const result = [];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is Sunday
  const monday = new Date(today.setDate(diff));

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(date.getDate() + i);
    const isToday = getDateISO(date) === getDateISO(new Date());
    result.push({
      label: getWeekDayLabel(i),
      date,
      isToday,
    });
  }

  return result;
}

export function getHourMinutesFromTime(timeString: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
}

export function getTimeFromHourMinutes(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
