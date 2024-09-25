/**
 * 日期格式化工具类
 *
 * @author : fankey 2022-03-22
 */
export default {
  /**
   * 格式化日期
   * @param date 日期
   * @param format 格式
   * @returns 格式化后的日期字符串
   */
  formatDate: function (date: Date, format: string): string {
    if (!this.isValidDate(date)) {
      return ''
    }
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const millisecond = date.getMilliseconds()

    const padZero = (num: number, len: number) => {
      return num.toString().padStart(len, '0')
    }

    const formatObj: { [key: string]: number } = {
      yyyy: year,
      MM: month,
      dd: day,
      HH: hour,
      mm: minute,
      ss: second,
      SSS: millisecond
    }

    return format.replace(/(yyyy|MM|dd|HH|mm|ss|SSS)/g, (match: string) => {
      return padZero(formatObj[match], match.length)
    })
  },
  /**
   * 格式化日期字符串
   *
   * @param dateString 日期字符串(带时间),"YY*MM*DD HH:MM:SS" -> "YY*MM*DD"
   * @param format 格式，默认'-'，还可以'/'
   * @returns 格式化后的日期字符串
   */
  formatDateStr (dateString: string, separator = '-') {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const formattedDate = `${year}${separator}${(month < 10 ? '0' : '')}${month}${separator}${(day < 10 ? '0' : '')}${day}`
    return formattedDate
  },
  /**
   * 将字符串转换为日期
   *
   * @param dateString 日期字符串
   * @param format 格式
   * @returns 转换后的日期
   */
  parseDate: function (dateString: string, format: string): Date {
    const formatObj: { [key: string]: string } = {
      yyyy: '',
      MM: '',
      dd: '',
      HH: '',
      mm: '',
      ss: '',
      SSS: ''
    }

    let index = 0
    format.replace(/(yyyy|MM|dd|HH|mm|ss|SSS)/g, (match: string) => {
      formatObj[match] = dateString.substr(index, match.length)
      index += match.length
      return match
    })

    const year = parseInt(formatObj.yyyy)
    const month = parseInt(formatObj.MM) - 1
    const day = parseInt(formatObj.dd)
    const hour = parseInt(formatObj.HH)
    const minute = parseInt(formatObj.mm)
    const second = parseInt(formatObj.ss)
    const millisecond = parseInt(formatObj.SSS)

    return new Date(year, month, day, hour, minute, second, millisecond)
  },

  /**
   * 获取当前日期星期几
   */
  getWeek: function (Date: Date): string {
    const weekList = [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六'
    ]

    return weekList[Date.getDay()]
  },

  /**
   * 获取未来七天日期
   */
  getWeekOfFuture: function (): Array<string> {
    const dateArray = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000)
      const year = date.getFullYear()
      const month =
        date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1
      const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
      dateArray.push(`${year}-${month}-${day}`)
    }
    return dateArray
  },

  /**
   * 检测是否是合法的日期
   *
   * @param date 日期
   * @returns boolean
   */
  isValidDate: function (date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime())
  }

}
