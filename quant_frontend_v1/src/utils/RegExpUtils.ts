/**
 * 正则表达式工具类模块
 *
 * @author : fankey 2022-02-03
 */

export default {
  /**
   * 正则校验手机方法
   */
  checkCellPhone: function (phoneNumber: string) {
    // 校验手机号的正则表达式
    const regExp = /^1(3|4|5|6|7|8|9)\d{9}$/
    if (!regExp.test(phoneNumber)) {
      return false
    }
    return true
  },

  /**
   * 正则表达式校验帐号规则
   * 1、大小写英文开头
   * 2、中间可以包含下划线、@、以及点
   * 3、长度大于6位，小于32位
   */
  checkAccount: function (account: string) {
    const regExp = /^[a-zA-Z][0-9a-zA-Z_.@]{4,32}$/g
    if (!regExp.test(account)) {
      return false
    }
    return true
  },

  /**
   * 正则表达式校验邮箱
   */
  checkEmail: function (email: string) {
    // 校验邮箱的正则表达式
    const regExp = /^([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
    if (!regExp.test(email)) {
      return false
    }
    return true
  }
}
