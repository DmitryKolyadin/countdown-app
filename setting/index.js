import { getText } from '@zos/i18n'
import { createWidget, widget, prop, align, event } from '@zos/ui'
import { back } from '@zos/router'
import { writeFileSync, readFileSync, statSync } from '@zos/fs'
import { getDeviceInfo } from '@zos/device'

const deviceInfo = getDeviceInfo()
const W = deviceInfo.width
const H = deviceInfo.height

const EVENT_KEYS = [
  'countdown', 'birthday', 'newYear', 'holiday', 'meeting',
  'deadline', 'anniversary', 'trip', 'exam', 'wedding'
]

Page({
  state: {
    eventIndex: 0,
    selectedYear: 2026,
    selectedMonth: 1,
    selectedDay: 1,
    selectedHour: 12,
    selectedMinute: 0
  },

  build() {
    this.loadCurrentSettings()
    this.createSettingsInterface()
  },

  loadCurrentSettings() {
    try {
      const { size } = statSync({ path: 'countdown_target.json' })
      if (size > 0) {
        const data = readFileSync({
          path: 'countdown_target.json',
          options: { encoding: 'utf8' }
        })
        const settings = JSON.parse(data)
        if (settings && settings.target) {
          const d = new Date(settings.target)
          this.state.selectedYear = d.getFullYear()
          this.state.selectedMonth = d.getMonth() + 1
          this.state.selectedDay = d.getDate()
          this.state.selectedHour = d.getHours()
          this.state.selectedMinute = d.getMinutes()
          if (settings.eventKey) {
            const idx = EVENT_KEYS.indexOf(settings.eventKey)
            if (idx >= 0) this.state.eventIndex = idx
          }
          return
        }
      }
    } catch (e) {
      console.log('No saved settings, using defaults')
    }

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(12, 0, 0, 0)
    this.state.selectedYear = tomorrow.getFullYear()
    this.state.selectedMonth = tomorrow.getMonth() + 1
    this.state.selectedDay = tomorrow.getDate()
    this.state.selectedHour = 12
    this.state.selectedMinute = 0
  },

  createSettingsInterface() {
    const contentH = Math.max(H, Math.floor(W * 1.55))

    createWidget(widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: W,
      h: contentH,
      color: 0x000000
    })

    createWidget(widget.TEXT, {
      x: 0,
      y: Math.floor(W * 0.07),
      w: W,
      h: Math.floor(W * 0.08),
      text: getText('setTarget'),
      text_size: Math.floor(W * 0.065),
      color: 0xffffff,
      align_h: align.CENTER_H
    })

    let y = Math.floor(W * 0.18)

    createWidget(widget.TEXT, {
      x: Math.floor(W * 0.08),
      y: y,
      w: Math.floor(W * 0.22),
      h: Math.floor(W * 0.07),
      text: getText('eventName'),
      text_size: Math.floor(W * 0.040),
      color: 0x888888,
      align_h: align.LEFT
    })

    const evBtnSize = Math.floor(W * 0.09)
    const evNameW = Math.floor(W * 0.32)
    const evBtnStartX = Math.floor(W * 0.34)

    const prevEventBtn = createWidget(widget.BUTTON, {
      x: evBtnStartX,
      y: y - Math.floor(W * 0.01),
      w: evBtnSize,
      h: evBtnSize,
      text: '<',
      normal_color: 0x1c1c1e,
      press_color: 0x333333,
      color: 0xffffff,
      text_size: Math.floor(W * 0.042),
      radius: Math.floor(evBtnSize / 2)
    })

    this.eventNameWidget = createWidget(widget.TEXT, {
      x: evBtnStartX + evBtnSize + Math.floor(W * 0.01),
      y: y,
      w: evNameW,
      h: Math.floor(W * 0.07),
      text: getText(EVENT_KEYS[this.state.eventIndex]),
      text_size: Math.floor(W * 0.040),
      color: 0x00b4ff,
      align_h: align.CENTER_H
    })

    const nextEventBtn = createWidget(widget.BUTTON, {
      x: evBtnStartX + evBtnSize + Math.floor(W * 0.02) + evNameW,
      y: y - Math.floor(W * 0.01),
      w: evBtnSize,
      h: evBtnSize,
      text: '>',
      normal_color: 0x1c1c1e,
      press_color: 0x333333,
      color: 0xffffff,
      text_size: Math.floor(W * 0.042),
      radius: Math.floor(evBtnSize / 2)
    })

    prevEventBtn.addEventListener(event.CLICK_UP, () => {
      this.state.eventIndex = (this.state.eventIndex - 1 + EVENT_KEYS.length) % EVENT_KEYS.length
      this.eventNameWidget.setProperty(prop.TEXT, getText(EVENT_KEYS[this.state.eventIndex]))
    })

    nextEventBtn.addEventListener(event.CLICK_UP, () => {
      this.state.eventIndex = (this.state.eventIndex + 1) % EVENT_KEYS.length
      this.eventNameWidget.setProperty(prop.TEXT, getText(EVENT_KEYS[this.state.eventIndex]))
    })

    y = Math.floor(W * 0.30)
    const stepY = Math.floor(W * 0.105)

    this.createDateField('YEAR', this.state.selectedYear, y, (delta) => {
      this.state.selectedYear = Math.max(
        new Date().getFullYear(),
        Math.min(2035, this.state.selectedYear + delta)
      )
      this.updateDisplay()
    })

    this.createDateField('MONTH', this.state.selectedMonth, y + stepY, (delta) => {
      this.state.selectedMonth += delta
      if (this.state.selectedMonth > 12) this.state.selectedMonth = 1
      if (this.state.selectedMonth < 1) this.state.selectedMonth = 12
      this.updateDisplay()
    })

    this.createDateField('DAY', this.state.selectedDay, y + stepY * 2, (delta) => {
      const daysInMonth = new Date(this.state.selectedYear, this.state.selectedMonth, 0).getDate()
      this.state.selectedDay += delta
      if (this.state.selectedDay > daysInMonth) this.state.selectedDay = 1
      if (this.state.selectedDay < 1) this.state.selectedDay = daysInMonth
      this.updateDisplay()
    })

    this.createDateField('HOUR', this.state.selectedHour, y + stepY * 3, (delta) => {
      this.state.selectedHour += delta
      if (this.state.selectedHour > 23) this.state.selectedHour = 0
      if (this.state.selectedHour < 0) this.state.selectedHour = 23
      this.updateDisplay()
    })

    this.createDateField('MIN', this.state.selectedMinute, y + stepY * 4, (delta) => {
      this.state.selectedMinute += delta
      if (this.state.selectedMinute >= 60) this.state.selectedMinute = 0
      if (this.state.selectedMinute < 0) this.state.selectedMinute = 59
      this.updateDisplay()
    })

    const presetsY = y + stepY * 5 + Math.floor(W * 0.02)

    createWidget(widget.TEXT, {
      x: 0,
      y: presetsY,
      w: W,
      h: Math.floor(W * 0.06),
      text: getText('presets'),
      text_size: Math.floor(W * 0.035),
      color: 0x888888,
      align_h: align.CENTER_H
    })

    const presetBtnW = Math.floor(W * 0.40)
    const presetBtnH = Math.floor(W * 0.085)
    const presetGap = Math.floor(W * 0.04)
    const presetStartX = Math.floor((W - presetBtnW * 2 - presetGap) / 2)
    const presetY1 = presetsY + Math.floor(W * 0.07)
    const presetY2 = presetY1 + presetBtnH + Math.floor(W * 0.02)

    this.createPresetBtn(presetStartX, presetY1, presetBtnW, presetBtnH,
      getText('plusHour'), () => this.applyPreset(1, 'hour'))
    this.createPresetBtn(presetStartX + presetBtnW + presetGap, presetY1, presetBtnW, presetBtnH,
      getText('plusDay'), () => this.applyPreset(1, 'day'))
    this.createPresetBtn(presetStartX, presetY2, presetBtnW, presetBtnH,
      getText('plusWeek'), () => this.applyPreset(7, 'day'))
    this.createPresetBtn(presetStartX + presetBtnW + presetGap, presetY2, presetBtnW, presetBtnH,
      getText('nextNewYear'), () => this.applyNewYear())

    const saveBtnW = Math.floor(W * 0.50)
    const saveBtnH = Math.floor(W * 0.11)
    const saveY = presetY2 + presetBtnH + Math.floor(W * 0.05)

    const saveBtn = createWidget(widget.BUTTON, {
      x: Math.floor((W - saveBtnW) / 2),
      y: saveY,
      w: saveBtnW,
      h: saveBtnH,
      text: getText('save'),
      normal_color: 0x004400,
      press_color: 0x006600,
      color: 0xffffff,
      text_size: Math.floor(W * 0.045),
      radius: Math.floor(saveBtnH / 2)
    })

    saveBtn.addEventListener(event.CLICK_UP, () => {
      this.saveSettings()
    })

    this.updateDisplay()
  },

  createDateField(label, value, y, onAdjust) {
    const labelWidth = Math.floor(W * 0.24)
    const valueWidth = Math.floor(W * 0.17)
    const buttonSize = Math.floor(W * 0.09)
    const startX = Math.floor(W * 0.08)
    const fontSize = Math.floor(W * 0.042)
    const valFontSize = Math.floor(W * 0.052)

    createWidget(widget.TEXT, {
      x: startX,
      y: y,
      w: labelWidth,
      h: Math.floor(W * 0.07),
      text: label,
      text_size: fontSize,
      color: 0xaaaaaa,
      align_h: align.LEFT
    })

    const downBtn = createWidget(widget.BUTTON, {
      x: startX + labelWidth + Math.floor(W * 0.02),
      y: y - Math.floor(W * 0.01),
      w: buttonSize,
      h: buttonSize,
      text: '−',
      normal_color: 0x1c1c1e,
      press_color: 0x333333,
      color: 0xffffff,
      text_size: fontSize,
      radius: Math.floor(buttonSize / 2)
    })

    const valueWidget = createWidget(widget.TEXT, {
      x: startX + labelWidth + Math.floor(W * 0.03) + buttonSize,
      y: y,
      w: valueWidth,
      h: Math.floor(W * 0.07),
      text: value.toString().padStart(2, '0'),
      text_size: valFontSize,
      color: 0xffffff,
      align_h: align.CENTER_H
    })

    const upBtn = createWidget(widget.BUTTON, {
      x: startX + labelWidth + Math.floor(W * 0.04) + buttonSize + valueWidth,
      y: y - Math.floor(W * 0.01),
      w: buttonSize,
      h: buttonSize,
      text: '+',
      normal_color: 0x1c1c1e,
      press_color: 0x333333,
      color: 0xffffff,
      text_size: fontSize,
      radius: Math.floor(buttonSize / 2)
    })

    upBtn.addEventListener(event.CLICK_UP, () => onAdjust(1))
    downBtn.addEventListener(event.CLICK_UP, () => onAdjust(-1))

    switch (label) {
      case 'YEAR': this.yearWidget = valueWidget; break
      case 'MONTH': this.monthWidget = valueWidget; break
      case 'DAY': this.dayWidget = valueWidget; break
      case 'HOUR': this.hourWidget = valueWidget; break
      case 'MIN': this.minuteWidget = valueWidget; break
    }
  },

  createPresetBtn(x, y, w, h, text, onClick) {
    const btn = createWidget(widget.BUTTON, {
      x: x,
      y: y,
      w: w,
      h: h,
      text: text,
      normal_color: 0x1a1a2e,
      press_color: 0x2a2a4e,
      color: 0x00b4ff,
      text_size: Math.floor(W * 0.032),
      radius: Math.floor(h / 2)
    })
    btn.addEventListener(event.CLICK_UP, onClick)
  },

  applyPreset(amount, unit) {
    const target = new Date()
    if (unit === 'hour') {
      target.setHours(target.getHours() + amount)
    } else if (unit === 'day') {
      target.setDate(target.getDate() + amount)
    }
    this.state.selectedYear = target.getFullYear()
    this.state.selectedMonth = target.getMonth() + 1
    this.state.selectedDay = target.getDate()
    this.state.selectedHour = target.getHours()
    this.state.selectedMinute = target.getMinutes()
    this.updateDisplay()
  },

  applyNewYear() {
    const year = new Date().getFullYear() + 1
    this.state.selectedYear = year
    this.state.selectedMonth = 1
    this.state.selectedDay = 1
    this.state.selectedHour = 0
    this.state.selectedMinute = 0
    this.updateDisplay()
  },

  updateDisplay() {
    try {
      if (this.yearWidget) this.yearWidget.setProperty(prop.TEXT, this.state.selectedYear.toString())
      if (this.monthWidget) this.monthWidget.setProperty(prop.TEXT, this.state.selectedMonth.toString().padStart(2, '0'))
      if (this.dayWidget) this.dayWidget.setProperty(prop.TEXT, this.state.selectedDay.toString().padStart(2, '0'))
      if (this.hourWidget) this.hourWidget.setProperty(prop.TEXT, this.state.selectedHour.toString().padStart(2, '0'))
      if (this.minuteWidget) this.minuteWidget.setProperty(prop.TEXT, this.state.selectedMinute.toString().padStart(2, '0'))
    } catch (e) {
      console.log('Error updating display:', e)
    }
  },

  saveSettings() {
    try {
      const target = new Date(
        this.state.selectedYear,
        this.state.selectedMonth - 1,
        this.state.selectedDay,
        this.state.selectedHour,
        this.state.selectedMinute,
        0
      )

      const data = JSON.stringify({
        target: target.getTime(),
        eventKey: EVENT_KEYS[this.state.eventIndex]
      })

      writeFileSync({
        path: 'countdown_target.json',
        data: data,
        options: { encoding: 'utf8' }
      })

      back()
    } catch (e) {
      console.error('Error saving settings:', e)
    }
  }
})