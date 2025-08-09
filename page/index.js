import { getText } from '@zos/i18n'
import { createWidget, widget, prop, align, text_style, event } from '@zos/ui'
import { px } from '@zos/utils'
import { push } from '@zos/router'
import { readFileSync, statSync } from '@zos/fs'

Page({
  state: {
    targetTimestamp: null,
    intervalId: null,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCritical: false
  },

  onInit() {
    console.log('Spy Countdown Mission Initialized')
    this.loadSettings()
  },

  build() {
    console.log('Building spy interface...')
    
    // Создаем простой интерфейс
    this.createSimpleInterface()
    
    // Запускаем таймер
    this.startCountdown()
  },

  loadSettings() {
    try {
      const filePath = 'countdown_target.json'
      const { size } = statSync({ path: filePath })

      if (size > 0) {
        const data = readFileSync({ path: filePath, options: { encoding: 'utf8' } })
        const settings = JSON.parse(data)
        if (settings && settings.target) {
          this.state.targetTimestamp = settings.target
          console.log('Loaded target from file:', new Date(this.state.targetTimestamp).toString())
          return
        }
      }
    } catch (error) {
      console.log('Settings file not found or invalid, using default.')
    }

    // Устанавливаем время по умолчанию, если загрузка не удалась
    this.setDefaultTarget()
  },

  setDefaultTarget() {
    // Устанавливаем время через час для демонстрации
    const futureTime = new Date()
    futureTime.setHours(futureTime.getHours() + 1)
    this.state.targetTimestamp = futureTime.getTime()
    console.log('Target set to:', futureTime.toString())
  },

  createSimpleInterface() {
    try {
      // Фон
      createWidget(widget.FILL_RECT, {
        x: 0,
        y: 0,
        w: 480,
        h: 490,
        color: 0x000000
      })

      // Заголовок
      createWidget(widget.TEXT, {
        x: 0,
        y: 60,
        w: 480,
        h: 50,
        text: 'ОСТАЛОСЬ',
        text_size: 36,
        color: 0xffffff,
        align_h: align.CENTER_H
      })

      // Статус
      // this.statusWidget = createWidget(widget.TEXT, {
      //   x: 0,
      //   y: 120,
      //   w: 480,
      //   h: 30,
      //   text: 'MISSION ACTIVE',
      //   text_size: 20,
      //   color: 0xffffff,
      //   align_h: align.CENTER_H
      // })

      const yPos = 155
      const labelYPos = yPos + 100
      const valueHeight = 90
      const labelHeight = 30
      const valueTextSize = 80
      const labelTextSize = 18
      const valueColor = 0xffffff
      const labelColor = 0xaaaaaa
      const componentWidth = 100
      const separatorWidth = 20
      const totalWidth = (componentWidth * 4) + (separatorWidth * 3)
      const startX = (480 - totalWidth) / 2

      // Дни
      this.daysValue = createWidget(widget.TEXT, {
        x: startX,
        y: yPos,
        w: componentWidth,
        h: valueHeight,
        text: '00',
        text_size: valueTextSize,
        color: valueColor,
        align_h: align.CENTER_H
      })
      createWidget(widget.TEXT, {
        x: startX,
        y: labelYPos,
        w: componentWidth,
        h: labelHeight,
        text: 'DAYS',
        text_size: labelTextSize,
        color: labelColor,
        align_h: align.CENTER_H
      })

      // Разделитель
      let currentX = startX + componentWidth
      createWidget(widget.TEXT, {
        x: currentX,
        y: yPos - 10,
        w: separatorWidth,
        h: valueHeight,
        text: ':',
        text_size: valueTextSize,
        color: labelColor,
        align_h: align.CENTER_H
      })

      // Часы
      currentX += separatorWidth
      this.hoursValue = createWidget(widget.TEXT, {
        x: currentX,
        y: yPos,
        w: componentWidth,
        h: valueHeight,
        text: '00',
        text_size: valueTextSize,
        color: valueColor,
        align_h: align.CENTER_H
      })
      createWidget(widget.TEXT, {
        x: currentX,
        y: labelYPos,
        w: componentWidth,
        h: labelHeight,
        text: 'HOURS',
        text_size: labelTextSize,
        color: labelColor,
        align_h: align.CENTER_H
      })

      // Разделитель
      currentX += componentWidth
      createWidget(widget.TEXT, {
        x: currentX,
        y: yPos - 10,
        w: separatorWidth,
        h: valueHeight,
        text: ':',
        text_size: valueTextSize,
        color: labelColor,
        align_h: align.CENTER_H
      })

      // Минуты
      currentX += separatorWidth
      this.minutesValue = createWidget(widget.TEXT, {
        x: currentX,
        y: yPos,
        w: componentWidth,
        h: valueHeight,
        text: '00',
        text_size: valueTextSize,
        color: valueColor,
        align_h: align.CENTER_H
      })
      createWidget(widget.TEXT, {
        x: currentX,
        y: labelYPos,
        w: componentWidth,
        h: labelHeight,
        text: 'MINS',
        text_size: labelTextSize,
        color: labelColor,
        align_h: align.CENTER_H
      })

      // Разделитель
      currentX += componentWidth
      createWidget(widget.TEXT, {
        x: currentX,
        y: yPos - 10,
        w: separatorWidth,
        h: valueHeight,
        text: ':',
        text_size: valueTextSize,
        color: labelColor,
        align_h: align.CENTER_H
      })

      // Секунды
      currentX += separatorWidth
      this.secondsValue = createWidget(widget.TEXT, {
        x: currentX,
        y: yPos,
        w: componentWidth,
        h: valueHeight,
        text: '00',
        text_size: valueTextSize,
        color: valueColor,
        align_h: align.CENTER_H
      })
      createWidget(widget.TEXT, {
        x: currentX,
        y: labelYPos,
        w: componentWidth,
        h: labelHeight,
        text: 'SECS',
        text_size: labelTextSize,
        color: labelColor,
        align_h: align.CENTER_H
      })

      // Кнопка настройки цели
      const targetBtn = createWidget(widget.BUTTON, {
        x: (480 - 220) / 2,
        y: 400,
        w: 220,
        h: 55,
        text: 'SET TARGET',
        normal_color: 0x1c1c1e,
        press_color: 0x333333,
        color: 0xffffff,
        text_size: 22,
        radius: 28
      })

      targetBtn.addEventListener(event.CLICK_UP, () => {
        console.log('Opening settings...')
        push({ url: 'setting/index' })
      })

      console.log('Interface created successfully')

    } catch (error) {
      console.error('Error creating interface:', error)
    }
  },

  startCountdown() {
    console.log('Starting countdown...')
    
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId)
    }

    this.state.intervalId = setInterval(() => {
      this.updateCountdown()
    }, 1000)

    // Сразу обновляем при запуске
    this.updateCountdown()
  },

  updateCountdown() {
    if (!this.state.targetTimestamp) {
      this.setTime(0, 0, 0, 0)
      return
    }

    const now = Date.now()
    const diff = this.state.targetTimestamp - now

    if (diff <= 0) {
      this.setTime(0, 0, 0, 0)
      this.missionComplete()
      return
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    this.setTime(days, hours, minutes, seconds)
    this.updateMissionStatus(diff)
  },

  setTime(days, hours, minutes, seconds) {
    try {
      if (this.daysValue) {
        this.daysValue.setProperty(prop.TEXT, days.toString().padStart(2, '0'))
      }
      if (this.hoursValue) {
        this.hoursValue.setProperty(prop.TEXT, hours.toString().padStart(2, '0'))
      }
      if (this.minutesValue) {
        this.minutesValue.setProperty(prop.TEXT, minutes.toString().padStart(2, '0'))
      }
      if (this.secondsValue) {
        this.secondsValue.setProperty(prop.TEXT, seconds.toString().padStart(2, '0'))
      }
    } catch (error) {
      console.error('Error updating time:', error)
    }
  },

  updateMissionStatus(timeDiff) {
    const totalMinutes = Math.floor(timeDiff / (1000 * 60))
    
    try {
      if (totalMinutes <= 5 && totalMinutes > 0) {
        this.state.isCritical = true
        if (this.statusWidget) {
          this.statusWidget.setProperty(prop.TEXT, 'CRITICAL TIME')
          this.statusWidget.setProperty(prop.MORE, { color: 0xff0000 })
        }
        
        // Меняем цвет всех значений на красный
        const criticalColor = { color: 0xff0000 }
        if (this.daysValue) this.daysValue.setProperty(prop.MORE, criticalColor)
        if (this.hoursValue) this.hoursValue.setProperty(prop.MORE, criticalColor)
        if (this.minutesValue) this.minutesValue.setProperty(prop.MORE, criticalColor)
        if (this.secondsValue) this.secondsValue.setProperty(prop.MORE, criticalColor)
        
      } else if (this.state.isCritical) { // Сбрасываем, если время больше не критическое
        this.state.isCritical = false
        if (this.statusWidget) {
          this.statusWidget.setProperty(prop.TEXT, 'MISSION ACTIVE')
          this.statusWidget.setProperty(prop.MORE, { color: 0xffffff })
        }
        const normalColor = { color: 0xffffff }
        if (this.daysValue) this.daysValue.setProperty(prop.MORE, normalColor)
        if (this.hoursValue) this.hoursValue.setProperty(prop.MORE, normalColor)
        if (this.minutesValue) this.minutesValue.setProperty(prop.MORE, normalColor)
        if (this.secondsValue) this.secondsValue.setProperty(prop.MORE, normalColor)
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  },

  missionComplete() {
    try {
      this.state.isCritical = false
      if (this.statusWidget) {
        this.statusWidget.setProperty(prop.TEXT, 'MISSION COMPLETE')
        this.statusWidget.setProperty(prop.MORE, { color: 0x00ffff })
      }
      console.log('Mission Complete!')
    } catch (error) {
      console.error('Error in mission complete:', error)
    }
  },

  onDestroy() {
    console.log('Destroying countdown page')
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId)
    }
  }
})
