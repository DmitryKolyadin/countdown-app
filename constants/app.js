/**
 * Константы приложения CountdownApp
 */

// Интервалы времени
export const TIMER_INTERVAL = 1000; // 1 секунда в миллисекундах
export const SAVE_DELAY = 1000; // Задержка перед возвратом на главную страницу

// Ключи для хранения данных
export const STORAGE_KEYS = {
  TARGET_TIMESTAMP: 'targetTimestamp',
  SELECTED_DATE: 'selectedDate',
  SELECTED_TIME: 'selectedTime'
};

// Цвета интерфейса в стиле шпионских фильмов
export const UI_COLORS = {
  PRIMARY_TEXT: 0xffffff,      // Белый для заголовков
  ACCENT_RED: 0xff0000,        // Красный для основного таймера (опасность)
  ACCENT_GREEN: 0x00ff00,      // Зеленый для безопасных значений
  ACCENT_ORANGE: 0xff8800,     // Оранжевый для предупреждений
  ACCENT_CYAN: 0x00ffff,       // Циан для подсветки
  SECONDARY_TEXT: 0xcccccc,    // Серый для подписей
  DANGER_RED: 0xff0000,        // Красный для критического времени
  WARNING_YELLOW: 0xffff00,    // Желтый для предупреждений
  TERMINAL_GREEN: 0x00ff00,    // Зеленый терминала
  MATRIX_GREEN: 0x00aa00,      // Темно-зеленый в стиле Matrix
  BUTTON_DARK: 0x1a1a1a,       // Темный для кнопок
  BUTTON_DARK_PRESSED: 0x333333, // Темнее для нажатых кнопок
  BACKGROUND: 0x000000,        // Черный фон
  GRID_COLOR: 0x004400,        // Цвет сетки
  NEON_BLUE: 0x0099ff,         // Неоновый синий
  NEON_PINK: 0xff0099          // Неоновый розовый
};

// Размеры экрана
export const SCREEN_SIZES = {
  WIDTH: 480,
  HEIGHT: 480,
  RADIUS: 240 // Для круглых экранов
};

// Размеры элементов интерфейса
export const UI_SIZES = {
  TITLE_HEIGHT: 60,
  TIMER_BLOCK_WIDTH: 240,
  TIMER_BLOCK_HEIGHT: 110,
  BUTTON_HEIGHT: 60,
  LABEL_HEIGHT: 40,
  VALUE_HEIGHT: 60
};

// Позиции элементов
export const POSITIONS = {
  TITLE_Y: 50,
  TIMER_START_Y: 130,
  TIMER_ROW_HEIGHT: 120,
  SETTINGS_BUTTON_Y: 380
};

// Размеры шрифтов в стиле шпионских фильмов
export const FONT_SIZES = {
  TITLE: 36,                   // Крупный заголовок
  MISSION_CODE: 28,            // Код миссии
  TIMER_VALUE: 56,             // Крупные цифры таймера
  TIMER_LABEL: 18,             // Подписи таймера
  BUTTON: 22,                  // Кнопки
  SMALL_BUTTON: 16,            // Маленькие кнопки
  SETTING_TITLE: 32,           // Заголовок настроек
  SETTING_LABEL: 20,           // Подписи настроек
  SETTING_VALUE: 24,           // Значения настроек
  STATUS_TEXT: 14,             // Статусный текст
  COORDINATES: 12              // Координаты/технические данные
};

// Радиусы скругления
export const BORDER_RADIUS = {
  BUTTON: 30,
  SMALL_BUTTON: 25
};

// Отступы
export const MARGINS = {
  SIDE: 40,
  TOP: 40,
  BOTTOM: 40,
  BETWEEN_ELEMENTS: 20
};

// Настройки по умолчанию
export const DEFAULT_VALUES = {
  FUTURE_DAYS: 1, // На сколько дней вперед устанавливать по умолчанию
  DEFAULT_HOUR: 12, // Час по умолчанию
  DEFAULT_MINUTE: 0 // Минута по умолчанию
};

// Текстовые константы для отладки
export const DEBUG_MESSAGES = {
  APP_CREATED: 'CountdownApp created',
  APP_DESTROYED: 'CountdownApp destroyed',
  SETTINGS_LOADED: 'Settings loaded successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
  TIMER_STARTED: 'Countdown timer started',
  TIMER_STOPPED: 'Countdown timer stopped',
  TIME_EXPIRED: 'Countdown time expired'
};

// Форматы даты и времени
export const DATE_FORMATS = {
  DATE_INPUT: 'YYYY-MM-DD',
  TIME_INPUT: 'HH:MM',
  DATETIME_ISO: 'YYYY-MM-DDTHH:MM:SS'
};

// Лимиты
export const LIMITS = {
  MAX_FUTURE_YEARS: 10, // Максимум лет в будущее
  MIN_COUNTDOWN_SECONDS: 1, // Минимум секунд для отсчета
  CRITICAL_TIME_MINUTES: 5, // Критическое время в минутах
  WARNING_TIME_HOURS: 1 // Время предупреждения в часах
};

// Анимации и эффекты
export const ANIMATIONS = {
  BLINK_INTERVAL: 500,         // Интервал мигания в мс
  FADE_DURATION: 200,          // Длительность затухания
  PULSE_DURATION: 1000,        // Длительность пульсации
  SCAN_LINE_SPEED: 2000        // Скорость сканирующей линии
};

// Шпионские термины и коды
export const SPY_TERMS = {
  MISSION_CODES: [
    'OPERATION COUNTDOWN',
    'MISSION CRITICAL',
    'CODE RED ALERT',
    'TARGET ACQUIRED',
    'INFILTRATION MODE'
  ],
  STATUS_MESSAGES: {
    ACTIVE: 'MISSION ACTIVE',
    CRITICAL: 'CRITICAL TIME',
    WARNING: 'WARNING ZONE', 
    COMPLETE: 'MISSION COMPLETE',
    FAILED: 'MISSION FAILED'
  }
};

// Эффекты интерфейса
export const UI_EFFECTS = {
  GRID_ENABLED: true,          // Включить сетку
  SCAN_LINES: true,            // Сканирующие линии
  GLOW_EFFECT: true,           // Эффект свечения
  MATRIX_RAIN: false,          // Дождь символов (отключен для производительности)
  TERMINAL_CURSOR: true        // Мигающий курсор
};
