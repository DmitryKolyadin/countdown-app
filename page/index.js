import { getText } from '@zos/i18n'
import { createWidget, widget, prop, align, event } from '@zos/ui'
import { push } from '@zos/router'
import { readFileSync, statSync } from '@zos/fs'
import { getDeviceInfo } from '@zos/device'
import { showToast } from '@zos/interaction'

const deviceInfo = getDeviceInfo()
const W = deviceInfo.width
const H = deviceInfo.height

Page({
  state: {
    targetTimestamp: null,
    eventName: '',
    intervalId: null,
    isExpired: false
  },

  onInit() {
    this.loadSettings()
  },

  build() {
    this.createInterface()
    this.startCountdown()
  },

  loadSettings() {
    try {
      const { size } = statSync({ path: 'countdown_target.json' })
      if (size > 0) {
        const data = readFileSync({
          path: 'countdown_target.json',
          options: { encoding: 'utf8' }
        })
        const settings = JSON.parse(data)
        if (settings && settings.target) {
          this.state.targetTimestamp = settings.target
          this.state.eventName = settings.eventKey
            ? getText(settings.eventKey)
            : getText('countdown')
          return
        }
      }
    } catch (e) {
      console.log('No settings found, using defaults')
    }
    this.setDefaultTarget()
  },

  setDefaultTarget() {
    const future = new Date()
    future.setHours(future.getHours() + 1)
    this.state.targetTimestamp = future.getTime()
    this.state.eventName = getText('countdown')
  },

  createInterface() {
    createWidget(widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: W,
      h: H,
      color: 0x000000
    })

    this.eventWidget = createWidget(widget.TEXT, {
      x: 0,
      y: Math.floor(H * 0.10),
      w: W,
      h: Math.floor(H * 0.10),
      text: this.state.eventName || getText('countdown'),
      text_size: Math.floor(W * 0.065),
      color: 0x00b4ff,
      align_h: align.CENTER_H
    })

    createWidget(widget.TEXT, {
      x: 0,
      y: Math.floor(H * 0.20),
      w: W,
      h: Math.floor(H * 0.06),
      text: getText('timeLeft'),
      text_size: Math.floor(W * 0.035),
      color: 0x888888,
      align_h: align.CENTER_H
    })

    const yPos = Math.floor(H * 0.30)
    const valueH = Math.floor(H * 0.18)
    const labelY = yPos + valueH - Math.floor(H * 0.02)
    const labelH = Math.floor(H * 0.06)
    const valFont = Math.floor(W * 0.15)
    const lblFont = Math.floor(W * 0.032)
    const compW = Math.floor(W * 0.19)
    const sepW = Math.floor(W * 0.04)
    const totalW = compW * 4 + sepW * 3
    const startX = Math.floor((W - totalW) / 2)

    this.daysValue = this.createTimeBlock(startX, yPos, compW, valueH, valFont, '00')
    this.createLabel(startX, labelY, compW, labelH, lblFont, getText('days'))

    let cx = startX + compW
    this.createSep(cx, yPos, sepW, valueH, valFont)

    cx += sepW
    this.hoursValue = this.createTimeBlock(cx, yPos, compW, valueH, valFont, '00')
    this.createLabel(cx, labelY, compW, labelH, lblFont, getText('hours'))

    cx += compW
    this.createSep(cx, yPos, sepW, valueH, valFont)

    cx += sepW
    this.minutesValue = this.createTimeBlock(cx, yPos, compW, valueH, valFont, '00')
    this.createLabel(cx, labelY, compW, labelH, lblFont, getText('mins'))

    cx += compW
    this.createSep(cx, yPos, sepW, valueH, valFont)

    cx += sepW
    this.secondsValue = this.createTimeBlock(cx, yPos, compW, valueH, valFont, '00')
    this.createLabel(cx, labelY, compW, labelH, lblFont, getText('secs'))

    this.statusWidget = createWidget(widget.TEXT, {
      x: 0,
      y: Math.floor(H * 0.58),
      w: W,
      h: Math.floor(H * 0.08),
      text: '',
      text_size: Math.floor(W * 0.04),
      color: 0x00cc66,
      align_h: align.CENTER_H
    })

    this.targetDateWidget = createWidget(widget.TEXT, {
      x: 0,
      y: Math.floor(H * 0.66),
      w: W,
      h: Math.floor(H * 0.06),
      text: this.formatTargetDate(),
      text_size: Math.floor(W * 0.030),
      color: 0x666666,
      align_h: align.CENTER_H
    })

    const btnW = Math.floor(W * 0.46)
    const btnH = Math.floor(H * 0.11)
    const settingsBtn = createWidget(widget.BUTTON, {
      x: Math.floor((W - btnW) / 2),
      y: Math.floor(H * 0.80),
      w: btnW,
      h: btnH,
      text: getText('settings'),
      normal_color: 0x1c1c1e,
      press_color: 0x333333,
      color: 0xffffff,
      text_size: Math.floor(W * 0.045),
      radius: Math.floor(btnH / 2)
    })

    settingsBtn.addEventListener(event.CLICK_UP, () => {
      push({ url: 'setting/index' })
    })
  },

  createTimeBlock(x, y, w, h, fontSize, text) {
    return createWidget(widget.TEXT, {
      x: x,
      y: y,
      w: w,
      h: h,
      text: text,
      text_size: fontSize,
      color: 0xffffff,
      align_h: align.CENTER_H
    })
  },

  createLabel(x, y, w, h, fontSize, text) {
    createWidget(widget.TEXT, {
      x: x,
      y: y,
      w: w,
      h: h,
      text: text,
      text_size: fontSize,
      color: 0x888888,
      align_h: align.CENTER_H
    })
  },

  createSep(x, y, w, h, fontSize) {
    createWidget(widget.TEXT, {
      x: x,
      y: y - Math.floor(h * 0.05),
      w: w,
      h: h,
      text: ':',
      text_size: fontSize,
      color: 0x444444,
      align_h: align.CENTER_H
    })
  },

  formatTargetDate() {
    if (!this.state.targetTimestamp) return ''
    const d = new Date(this.state.targetTimestamp)
    const dd = d.getDate().toString().padStart(2, '0')
    const mm = (d.getMonth() + 1).toString().padStart(2, '0')
    const yyyy = d.getFullYear()
    const hh = d.getHours().toString().padStart(2, '0')
    const min = d.getMinutes().toString().padStart(2, '0')
    return dd + '.' + mm + '.' + yyyy + '  ' + hh + ':' + min
  },

  startCountdown() {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId)
    }
    this.updateCountdown()
    this.state.intervalId = setInterval(() => {
      this.updateCountdown()
    }, 1000)
  },

  updateCountdown() {
    if (!this.state.targetTimestamp) {
      this.setTime(0, 0, 0, 0)
      return
    }

    const diff = this.state.targetTimestamp - Date.now()

    if (diff <= 0) {
      this.setTime(0, 0, 0, 0)
      this.onExpired()
      return
    }

    const days = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)

    this.setTime(days, hours, minutes, seconds)
    this.updateStatus(diff)
  },

  setTime(d, h, m, s) {
    try {
      if (this.daysValue) this.daysValue.setProperty(prop.TEXT, d.toString().padStart(2, '0'))
      if (this.hoursValue) this.hoursValue.setProperty(prop.TEXT, h.toString().padStart(2, '0'))
      if (this.minutesValue) this.minutesValue.setProperty(prop.TEXT, m.toString().padStart(2, '0'))
      if (this.secondsValue) this.secondsValue.setProperty(prop.TEXT, s.toString().padStart(2, '0'))
    } catch (e) {
      console.log('Error updating time:', e)
    }
  },

  updateStatus(diff) {
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    try {
      if (mins <= 5) {
        const c = { color: 0xff3b30 }
        if (this.daysValue) this.daysValue.setProperty(prop.MORE, c)
        if (this.hoursValue) this.hoursValue.setProperty(prop.MORE, c)
        if (this.minutesValue) this.minutesValue.setProperty(prop.MORE, c)
        if (this.secondsValue) this.secondsValue.setProperty(prop.MORE, c)
        if (this.statusWidget) {
          this.statusWidget.setProperty(prop.TEXT, getText('almostThere'))
          this.statusWidget.setProperty(prop.MORE, { color: 0xff3b30 })
        }
      } else if (hours < 1) {
        const c = { color: 0xff9500 }
        if (this.daysValue) this.daysValue.setProperty(prop.MORE, c)
        if (this.hoursValue) this.hoursValue.setProperty(prop.MORE, c)
        if (this.minutesValue) this.minutesValue.setProperty(prop.MORE, c)
        if (this.secondsValue) this.secondsValue.setProperty(prop.MORE, c)
        if (this.statusWidget) {
          this.statusWidget.setProperty(prop.TEXT, getText('lessThanHour'))
          this.statusWidget.setProperty(prop.MORE, { color: 0xff9500 })
        }
      } else {
        const c = { color: 0xffffff }
        if (this.daysValue) this.daysValue.setProperty(prop.MORE, c)
        if (this.hoursValue) this.hoursValue.setProperty(prop.MORE, c)
        if (this.minutesValue) this.minutesValue.setProperty(prop.MORE, c)
        if (this.secondsValue) this.secondsValue.setProperty(prop.MORE, c)
        if (this.statusWidget) {
          if (days > 0) {
            this.statusWidget.setProperty(prop.TEXT, days + ' ' + getText('daysRemaining'))
          } else {
            this.statusWidget.setProperty(prop.TEXT, hours + ' ' + getText('hoursRemaining'))
          }
          this.statusWidget.setProperty(prop.MORE, { color: 0x00cc66 })
        }
      }
    } catch (e) {
      console.log('Error updating status:', e)
    }
  },

  onExpired() {
    if (this.state.isExpired) return
    this.state.isExpired = true

    try {
      const c = { color: 0x00b4ff }
      if (this.daysValue) this.daysValue.setProperty(prop.MORE, c)
      if (this.hoursValue) this.hoursValue.setProperty(prop.MORE, c)
      if (this.minutesValue) this.minutesValue.setProperty(prop.MORE, c)
      if (this.secondsValue) this.secondsValue.setProperty(prop.MORE, c)
      if (this.statusWidget) {
        this.statusWidget.setProperty(prop.TEXT, getText('timesUp'))
        this.statusWidget.setProperty(prop.MORE, { color: 0x00b4ff })
      }
      if (this.eventWidget) {
        this.eventWidget.setProperty(prop.MORE, { color: 0x00b4ff })
      }
    } catch (e) {
      console.log('Error updating expired state:', e)
    }

    try {
      showToast({ content: getText('timesUp') })
    } catch (e) {
      console.log('Toast notification unavailable')
    }
  },

  onDestroy() {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId)
    }
  }
})
