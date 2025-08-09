import { getText } from '@zos/i18n'
import { createWidget, widget, prop, align, text_style, event } from '@zos/ui'
import { px } from '@zos/utils'
import { back } from '@zos/router'
import { writeFileSync } from '@zos/fs'

Page({
  state: {
    selectedYear: 2025,
    selectedMonth: 8,
    selectedDay: 6,
    selectedHour: 12,
    selectedMinute: 0,
    targetTimestamp: null
  },

  build() {
    console.log('Building settings page...')
    
    this.loadCurrentSettings()
    this.createSettingsInterface()
  },

  loadCurrentSettings() {
    // Устанавливаем значения по умолчанию (завтра в 12:00)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(12, 0, 0, 0)
    
    this.state.selectedYear = tomorrow.getFullYear()
    this.state.selectedMonth = tomorrow.getMonth() + 1
    this.state.selectedDay = tomorrow.getDate()
    this.state.selectedHour = tomorrow.getHours()
    this.state.selectedMinute = tomorrow.getMinutes()
    
    console.log('Settings loaded:', this.state)
  },

  createSettingsInterface() {
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
        y: 40,
        w: 480,
        h: 40,
        text: 'SET TARGET DATE',
        text_size: 32,
        color: 0xffffff,
        align_h: align.CENTER_H
      })

      const startY = 120
      const stepY = 50

      // Год
      this.createDateField('YEAR', this.state.selectedYear, startY, (delta) => {
        this.state.selectedYear = Math.max(new Date().getFullYear(), Math.min(2035, this.state.selectedYear + delta))
        this.updateDisplay()
      })

      // Месяц
      this.createDateField('MONTH', this.state.selectedMonth, startY + stepY, (delta) => {
        this.state.selectedMonth += delta
        if (this.state.selectedMonth > 12) this.state.selectedMonth = 1
        if (this.state.selectedMonth < 1) this.state.selectedMonth = 12
        this.updateDisplay()
      })

      // День
      this.createDateField('DAY', this.state.selectedDay, startY + stepY * 2, (delta) => {
        const daysInMonth = new Date(this.state.selectedYear, this.state.selectedMonth, 0).getDate()
        this.state.selectedDay += delta
        if (this.state.selectedDay > daysInMonth) this.state.selectedDay = 1
        if (this.state.selectedDay < 1) this.state.selectedDay = daysInMonth
        this.updateDisplay()
      })

      // Час
      this.createDateField('HOUR', this.state.selectedHour, startY + stepY * 3, (delta) => {
        this.state.selectedHour += delta
        if (this.state.selectedHour > 23) this.state.selectedHour = 0
        if (this.state.selectedHour < 0) this.state.selectedHour = 23
        this.updateDisplay()
      })

      // Минута
      this.createDateField('MINUTE', this.state.selectedMinute, startY + stepY * 4, (delta) => {
        this.state.selectedMinute += delta
        if (this.state.selectedMinute >= 60) this.state.selectedMinute = 0
        if (this.state.selectedMinute < 0) this.state.selectedMinute = 59
        this.updateDisplay()
      })

      // Кнопки управления
      this.createControlButtons()

      // Обновляем отображение
      this.updateDisplay()

      console.log('Settings interface created')

    } catch (error) {
      console.error('Error creating settings interface:', error)
    }
  },

  createDateField(label, value, y, onAdjust) {
    const labelWidth = 120
    const valueWidth = 80
    const buttonSize = 44
    const startX = 40

    // Подпись
    createWidget(widget.TEXT, {
      x: startX,
      y: y,
      w: labelWidth,
      h: 30,
      text: label,
      text_size: 22,
      color: 0xaaaaaa,
      align_h: align.LEFT
    })

    // Кнопка -
    const downBtn = createWidget(widget.BUTTON, {
      x: startX + labelWidth + 20,
      y: y - 7,
      w: buttonSize,
      h: buttonSize,
      text: '-',
      normal_color: 0x1c1c1e,
      press_color: 0x333333,
      color: 0xffffff,
      text_size: 24,
      radius: buttonSize / 2
    })

    // Значение
    const valueWidget = createWidget(widget.TEXT, {
      x: startX + labelWidth + 20 + buttonSize + 10,
      y: y,
      w: valueWidth,
      h: 30,
      text: value.toString().padStart(2, '0'),
      text_size: 28,
      color: 0xffffff,
      align_h: align.CENTER_H
    })

    // Кнопка +
    const upBtn = createWidget(widget.BUTTON, {
      x: startX + labelWidth + 20 + buttonSize + 10 + valueWidth + 10,
      y: y - 7,
      w: buttonSize,
      h: buttonSize,
      text: '+',
      normal_color: 0x1c1c1e,
      press_color: 0x333333,
      color: 0xffffff,
      text_size: 24,
      radius: buttonSize / 2
    })

    upBtn.addEventListener(event.CLICK_UP, () => {
      onAdjust(1)
    })

    downBtn.addEventListener(event.CLICK_UP, () => {
      onAdjust(-1)
    })

    // Сохраняем ссылку на виджет значения
    switch(label) {
      case 'YEAR':
        this.yearWidget = valueWidget
        break
      case 'MONTH':
        this.monthWidget = valueWidget
        break
      case 'DAY':
        this.dayWidget = valueWidget
        break
      case 'HOUR':
        this.hourWidget = valueWidget
        break
      case 'MINUTE':
        this.minuteWidget = valueWidget
        break
    }
  },

  createControlButtons() {
    // Кнопка применения
    const applyBtn = createWidget(widget.BUTTON, {
      x: (480 - 220) / 2,
      y: 400,
      w: 220,
      h: 55,
      text: 'SAVE',
      normal_color: 0x004400,
      press_color: 0x006600,
      color: 0xffffff,
      text_size: 22,
      radius: 28
    })

    applyBtn.addEventListener(event.CLICK_UP, () => {
      this.saveSettings()
    })
  },

  setPreset(amount, unit) {
    const now = new Date()
    const target = new Date()
    
    switch(unit) {
      case 'hour':
        target.setHours(target.getHours() + amount)
        break
      case 'day':
        target.setDate(target.getDate() + amount)
        break
    }
    
    this.state.selectedYear = target.getFullYear()
    this.state.selectedMonth = target.getMonth() + 1
    this.state.selectedDay = target.getDate()
    this.state.selectedHour = target.getHours()
    this.state.selectedMinute = target.getMinutes()
    
    this.updateDisplay()
    console.log('Preset applied:', unit, amount)
  },

  updateDisplay() {
    try {
      if (this.yearWidget) {
        this.yearWidget.setProperty(prop.TEXT, this.state.selectedYear.toString())
      }
      if (this.monthWidget) {
        this.monthWidget.setProperty(prop.TEXT, this.state.selectedMonth.toString().padStart(2, '0'))
      }
      if (this.dayWidget) {
        this.dayWidget.setProperty(prop.TEXT, this.state.selectedDay.toString().padStart(2, '0'))
      }
      if (this.hourWidget) {
        this.hourWidget.setProperty(prop.TEXT, this.state.selectedHour.toString().padStart(2, '0'))
      }
      if (this.minuteWidget) {
        this.minuteWidget.setProperty(prop.TEXT, this.state.selectedMinute.toString().padStart(2, '0'))
      }
    } catch (error) {
      console.error('Error updating display:', error)
    }
  },

  calculateTargetTimestamp() {
    const target = new Date(
      this.state.selectedYear,
      this.state.selectedMonth - 1,
      this.state.selectedDay,
      this.state.selectedHour,
      this.state.selectedMinute,
      0
    )
    this.state.targetTimestamp = target.getTime()
    console.log('Target timestamp calculated:', this.state.targetTimestamp, target.toString())
  },

  saveSettings() {
    try {
      this.calculateTargetTimestamp()
      
      if (this.state.targetTimestamp) {
        const filePath = 'countdown_target.json'
        const data = JSON.stringify({ target: this.state.targetTimestamp })
        
        writeFileSync({
          path: filePath,
          data: data,
          options: {
            encoding: 'utf8'
          }
        })
        
        console.log('Settings saved successfully to file!')
        
        back()
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }
})