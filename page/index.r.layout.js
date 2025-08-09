import { px } from "@zos/utils";

// Стили для круглых экранов (480x480)
export const SCREEN_WIDTH = px(480);
export const SCREEN_HEIGHT = px(480);

// Заголовок
export const TITLE_STYLE = {
  x: px(0),
  y: px(50),
  w: px(480),
  h: px(60),
  text_size: px(32),
  color: 0xffffff,
};

// Контейнеры для значений таймера
export const TIMER_CONTAINER = {
  width: px(240),
  height: px(110)
};

// Позиции для блоков таймера
export const DAYS_POSITION = {
  x: px(0),
  y: px(130)
};

export const HOURS_POSITION = {
  x: px(240),
  y: px(130)
};

export const MINUTES_POSITION = {
  x: px(0),
  y: px(250)
};

export const SECONDS_POSITION = {
  x: px(240),
  y: px(250)
};

// Стили для подписей
export const LABEL_STYLE = {
  w: px(240),
  h: px(40),
  text_size: px(20),
  color: 0xcccccc
};

// Стили для значений
export const VALUE_STYLE = {
  w: px(240),
  h: px(60),
  text_size: px(48),
  color: 0x00ff00
};

// Кнопка настроек
export const SETTINGS_BUTTON = {
  x: px(140),
  y: px(380),
  w: px(200),
  h: px(60),
  radius: px(30)
};

// Цвета
export const COLORS = {
  WHITE: 0xffffff,
  GREEN: 0x00ff00,
  GRAY: 0xcccccc,
  RED: 0xff0000,
  BLUE: 0x0066cc,
  DARK_GRAY: 0x222222,
  MEDIUM_GRAY: 0x444444
};
