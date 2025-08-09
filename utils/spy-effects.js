/**
 * Спецэффекты для шпионского интерфейса CountdownApp
 */

/**
 * Создает эффект мигающего текста
 * @param {Object} widget - виджет для применения эффекта
 * @param {number} interval - интервал мигания в мс
 * @param {number} color1 - первый цвет
 * @param {number} color2 - второй цвет
 */
export function createBlinkEffect(widget, interval = 500, color1 = 0xff0000, color2 = 0x660000) {
  let isBlinking = false
  
  return setInterval(() => {
    isBlinking = !isBlinking
    const color = isBlinking ? color1 : color2
    widget.setProperty(prop.MORE, { color: color })
  }, interval)
}

/**
 * Эффект пульсации для критических состояний
 * @param {Object} widget - виджет для анимации
 * @param {number} duration - длительность пульсации
 */
export function createPulseEffect(widget, duration = 1000) {
  let phase = 0
  
  return setInterval(() => {
    phase += 0.1
    const alpha = Math.sin(phase) * 0.5 + 0.5 // от 0 до 1
    const brightness = Math.floor(alpha * 255)
    const color = (brightness << 16) | (0 << 8) | 0 // Красный с изменяющейся яркостью
    
    widget.setProperty(prop.MORE, { color: color })
  }, 50)
}

/**
 * Генерирует случайные шпионские координаты
 * @returns {string} строка с координатами
 */
export function generateSpyCoordinates() {
  const lat = (Math.random() * 180 - 90).toFixed(6)
  const lng = (Math.random() * 360 - 180).toFixed(6)
  const altitude = Math.floor(Math.random() * 10000) + 'M'
  const heading = Math.floor(Math.random() * 360) + '°'
  const time = new Date().toISOString().substring(11, 19)
  
  return `LAT:${lat} LNG:${lng} ALT:${altitude} HDG:${heading} UTC:${time}`
}

/**
 * Генерирует шпионские коды миссий
 * @returns {string} случайный код миссии
 */
export function generateMissionCode() {
  const prefixes = ['OPERATION', 'MISSION', 'PROJECT', 'CODE', 'ALPHA']
  const suffixes = ['COUNTDOWN', 'OMEGA', 'PHOENIX', 'GHOST', 'SHADOW', 'CRIMSON', 'ZERO']
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
  
  return `${prefix} ${suffix}`
}

/**
 * Создает матричный дождь символов (упрощенная версия)
 * @param {Object} container - контейнер для символов
 * @param {number} count - количество символов
 */
export function createMatrixRain(container, count = 10) {
  const symbols = '0123456789ABCDEF!@#$%^&*()_+-=[]{}|;:,.<>?'
  const drops = []
  
  for (let i = 0; i < count; i++) {
    const x = Math.random() * 480
    const y = Math.random() * 480
    const char = symbols[Math.floor(Math.random() * symbols.length)]
    
    const drop = createWidget(widget.TEXT, {
      x: px(x),
      y: px(y),
      w: px(20),
      h: px(20),
      text: char,
      text_size: px(12),
      color: 0x004400,
      align_h: align.CENTER_H,
      text_style: text_style.NONE
    })
    
    drops.push({ widget: drop, x: x, y: y, speed: Math.random() * 2 + 1 })
  }
  
  return setInterval(() => {
    drops.forEach(drop => {
      drop.y += drop.speed
      if (drop.y > 480) {
        drop.y = -20
        drop.x = Math.random() * 480
        const char = symbols[Math.floor(Math.random() * symbols.length)]
        drop.widget.setProperty(prop.TEXT, char)
      }
      drop.widget.setProperty(prop.MORE, { x: px(drop.x), y: px(drop.y) })
    })
  }, 100)
}

/**
 * Создает эффект сканирующей линии
 * @param {number} width - ширина экрана
 * @param {number} height - высота экрана
 */
export function createScanLine(width = 480, height = 480) {
  let position = 0
  
  const scanLine = createWidget(widget.STROKE_RECT, {
    x: px(0),
    y: px(position),
    w: px(width),
    h: px(2),
    color: 0x00ff00,
    line_width: px(2)
  })
  
  return setInterval(() => {
    position += 3
    if (position > height) {
      position = 0
    }
    scanLine.setProperty(prop.MORE, { y: px(position) })
  }, 50)
}

/**
 * Вычисляет цвет на основе критичности времени
 * @param {number} timeLeft - оставшееся время в миллисекундах
 * @returns {number} цвет в hex формате
 */
export function calculateTimeColor(timeLeft) {
  const minutes = timeLeft / (1000 * 60)
  
  if (minutes <= 1) {
    return 0xff0000 // Красный - критично
  } else if (minutes <= 5) {
    return 0xff4400 // Оранжево-красный
  } else if (minutes <= 30) {
    return 0xff8800 // Оранжевый
  } else if (minutes <= 60) {
    return 0xffff00 // Желтый - предупреждение
  } else {
    return 0x00ff00 // Зеленый - безопасно
  }
}

/**
 * Создает терминальный курсор
 * @param {Object} widget - текстовый виджет для добавления курсора
 */
export function createTerminalCursor(widget) {
  let showCursor = false
  
  return setInterval(() => {
    showCursor = !showCursor
    const currentText = widget.getProperty(prop.TEXT) || ''
    const baseText = currentText.replace(/[_│]$/, '') // Убираем предыдущий курсор
    const newText = baseText + (showCursor ? '│' : '')
    widget.setProperty(prop.TEXT, newText)
  }, 500)
}

/**
 * Форматирует время в военном стиле (24-часовой формат)
 * @param {Date} date - дата для форматирования
 * @returns {string} время в формате HHMM
 */
export function formatMilitaryTime(date = new Date()) {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}${minutes}`
}

/**
 * Генерирует случайный идентификатор агента
 * @returns {string} идентификатор агента
 */
export function generateAgentId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  
  let agentId = 'AGENT-'
  
  // Добавляем 2 буквы
  for (let i = 0; i < 2; i++) {
    agentId += letters[Math.floor(Math.random() * letters.length)]
  }
  
  agentId += '-'
  
  // Добавляем 3 цифры
  for (let i = 0; i < 3; i++) {
    agentId += numbers[Math.floor(Math.random() * numbers.length)]
  }
  
  return agentId
}

/**
 * Создает эффект глитча для текста
 * @param {Object} widget - текстовый виджет
 * @param {string} originalText - оригинальный текст
 * @param {number} intensity - интенсивность глитча (0-1)
 */
export function createGlitchEffect(widget, originalText, intensity = 0.1) {
  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?~`'
  
  return setInterval(() => {
    if (Math.random() < intensity) {
      let glitchedText = ''
      
      for (let i = 0; i < originalText.length; i++) {
        if (Math.random() < 0.1) {
          glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)]
        } else {
          glitchedText += originalText[i]
        }
      }
      
      widget.setProperty(prop.TEXT, glitchedText)
      
      // Возвращаем оригинальный текст через короткое время
      setTimeout(() => {
        widget.setProperty(prop.TEXT, originalText)
      }, 100)
    }
  }, 2000)
}
