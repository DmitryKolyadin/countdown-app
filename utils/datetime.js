/**
 * Утилиты для работы с датами и временем
 */

/**
 * Форматирует дату в строку YYYY-MM-DD
 * @param {Date} date - дата для форматирования
 * @returns {string} отформатированная дата
 */
export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Форматирует время в строку HH:MM
 * @param {Date} date - дата для форматирования времени
 * @returns {string} отформатированное время
 */
export function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Создает timestamp из строк даты и времени
 * @param {string} dateStr - дата в формате YYYY-MM-DD
 * @param {string} timeStr - время в формате HH:MM
 * @returns {number} timestamp в миллисекундах
 */
export function createTimestamp(dateStr, timeStr) {
  const dateTimeStr = `${dateStr}T${timeStr}:00`;
  return new Date(dateTimeStr).getTime();
}

/**
 * Вычисляет разность времени и возвращает объект с днями, часами, минутами и секундами
 * @param {number} targetTimestamp - целевое время в миллисекундах
 * @returns {Object} объект с полями {days, hours, minutes, seconds, isExpired}
 */
export function calculateTimeDifference(targetTimestamp) {
  const now = Date.now();
  const diff = targetTimestamp - now;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false
  };
}

/**
 * Проверяет валидность даты
 * @param {string} dateStr - дата в формате YYYY-MM-DD
 * @returns {boolean} true если дата валидна
 */
export function isValidDate(dateStr) {
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date);
}

/**
 * Проверяет валидность времени
 * @param {string} timeStr - время в формате HH:MM
 * @returns {boolean} true если время валидно
 */
export function isValidTime(timeStr) {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeStr);
}

/**
 * Возвращает дату и время через указанное количество дней
 * @param {number} daysFromNow - количество дней от текущего момента
 * @returns {Object} объект с полями {dateStr, timeStr, timestamp}
 */
export function getFutureDateTime(daysFromNow = 1) {
  const future = new Date();
  future.setDate(future.getDate() + daysFromNow);
  future.setHours(12, 0, 0, 0); // Устанавливаем время на полдень
  
  return {
    dateStr: formatDate(future),
    timeStr: formatTime(future),
    timestamp: future.getTime()
  };
}

/**
 * Форматирует оставшееся время в человекочитаемый формат
 * @param {Object} timeDiff - объект с полями {days, hours, minutes, seconds}
 * @returns {string} отформатированная строка времени
 */
export function formatTimeRemaining(timeDiff) {
  const { days, hours, minutes, seconds, isExpired } = timeDiff;
  
  if (isExpired) {
    return "Time's up!";
  }
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}
