import { getDeviceInfo } from '@zos/device'

const deviceInfo = getDeviceInfo()
const W = deviceInfo.width
const H = deviceInfo.height

export const SCREEN_WIDTH = W
export const SCREEN_HEIGHT = H

export const TITLE_STYLE = {
  x: 0,
  y: Math.floor(H * 0.10),
  w: W,
  h: Math.floor(H * 0.10),
  text_size: Math.floor(W * 0.065),
  color: 0x00b4ff
}

export const TIMER_VALUE_STYLE = {
  w: Math.floor(W * 0.19),
  h: Math.floor(H * 0.18),
  text_size: Math.floor(W * 0.15),
  color: 0xffffff
}

export const TIMER_LABEL_STYLE = {
  w: Math.floor(W * 0.19),
  h: Math.floor(H * 0.06),
  text_size: Math.floor(W * 0.032),
  color: 0x888888
}

export const SETTINGS_BUTTON = {
  x: Math.floor((W - Math.floor(W * 0.46)) / 2),
  y: Math.floor(H * 0.80),
  w: Math.floor(W * 0.46),
  h: Math.floor(H * 0.11),
  radius: Math.floor(Math.floor(H * 0.11) / 2)
}

export const COLORS = {
  WHITE: 0xffffff,
  ACCENT: 0x00b4ff,
  GRAY: 0x888888,
  DARK_GRAY: 0x444444,
  RED: 0xff3b30,
  ORANGE: 0xff9500,
  GREEN: 0x00cc66,
  BACKGROUND: 0x000000,
  BUTTON: 0x1c1c1e,
  BUTTON_PRESSED: 0x333333
}
