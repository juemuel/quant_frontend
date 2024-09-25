type MyObject = {
  [key:string]:any
}

export default {
  /**
   * 通用过滤方法
   * @param  {number|string} value
   * @param {Array} options
   */
  format: function (value:number|string, options:Array<{id:number, name:string}>) {
    if (options.length === 0) return
    switch (typeof (value)) {
      case 'number':
        return options.filter((item:any) => {
          return item.id === value
        })[0].name
      case 'string':
        return options.filter((item:any) => {
          return item.name === value
        })[0].id
      default :
        return ''
    }
  },
  /**
   * 通过任意属性查找
   */
  getOptionByAnyKey: function (value:string | number, options:Array<any>) {
    console.log(value)
    console.log(options)

    const arr = []
    for (const key in options[0]) {
      arr.push(...options.filter((item:any) => {
        return item[key] === value
      }))
    }
    console.log(arr)

    return arr
  },
  /**
   * 会员满意度
   */
  satisfactionOptions: [
    {
      id: 1,
      name: '非常满意'
    },
    {
      id: 2,
      name: '满意'
    },
    {
      id: 3,
      name: '一般'
    },
    {
      id: 4,
      name: '不满意'
    }
  ],
  /**
   * 订单状态
   */
  orderStatusOptions: [
    {
      id: 0,
      name: '未支付',
      tagType: 'warning'
    },
    {
      id: 8,
      name: '外部订单待确认',
      tagType: 'warning'
    },
    {
      id: 10,
      name: '未提交',
      tagType: 'info'
    },
    {
      id: 11,
      name: '已生成',
      tagType: 'success'
    },
    {
      id: 12,
      name: '已指派',
      tagType: 'success'
    },
    {
      id: 13,
      name: '预约中',
      tagType: 'warning'
    },
    {
      id: 14,
      name: '待服务',
      tagType: 'warning'
    },
    {
      id: 15,
      name: '服务完成',
      tagType: 'success'
    },
    {
      id: 20,
      name: '浮动价格待确认(服务完成)',
      tagType: 'warning'
    },
    {
      id: 21,
      name: '浮动价格待确认(取消扣费)',
      tagType: 'warning'
    },
    {
      id: 98,
      name: '待取消',
      tagType: 'warning'
    },
    {
      id: 99,
      name: '取消不扣费',
      tagType: 'danger'
    },
    {
      id: 100,
      name: '取消扣费',
      tagType: 'danger'
    },
    {
      id: 101,
      name: '待置换',
      tagType: 'warning'
    },
    {
      id: 102,
      name: '已置换',
      tagType: 'success'
    }
  ],
  /**
   * 工单状态
   */
  workOrderStatusOptions: [
    {
      id: 1,
      name: '待指派',
      tagType: 'warning'
    },
    {
      id: 2,
      name: '待服务',
      tagType: 'warning'
    },
    {
      id: 3,
      name: '服务取消',
      tagType: 'info'
    },
    {
      id: 4,
      name: '服务成功',
      tagType: 'success'
    },
    {
      id: 11,
      name: '取消扣次',
      tagType: 'danger'
    }
  ],
  /**
   * 预约单状态
   */
  appointmentOrderStatusOptions: [
    {
      id: 1,
      name: '生成',
      tagType: 'primary'
    },
    {
      id: 2,
      name: '已指派',
      tagType: 'primary'
    },
    {
      id: 3,
      name: '预约成功',
      tagType: 'success'
    },
    {
      id: 4,
      name: '历史成功',
      tagType: 'success'
    },
    {
      id: 99,
      name: '关闭预约',
      tagType: 'info'
    }
  ],
  /**
   * 订单类型
   */
  orderTypeOptions: [
    {
      id: 1,
      name: '服务单'
    },
    {
      id: 8,
      name: '置换前订单'
    },
    {
      id: 9,
      name: '置换后订单'
    }
  ],
  /**
   * 人员属性
   */
  userAttributesOptions2: [
    {
      id: 0,
      name: '元化'
    },
    {
      id: 1,
      name: '虚拟人'
    },
    {
      id: 2,
      name: '橙医'
    },
    {
      id: 3,
      name: '非元化'
    },
    {
      id: 4,
      name: '乐亲'
    },
    {
      id: 5,
      name: '勤闰'
    },
    {
      id: 6,
      name: '东帝'
    },
    {
      id: 7,
      name: '霖木'
    }
  ],
  /**
   * 签到情况
   */
  signSituationOptions: [
    {
      id: 1,
      name: '签到正常'
    },
    {
      id: 2,
      name: '存在异常',
      color: 'red'
    }
  ],
  /**
   * 附件类型
   */
  fileTypeOptions: [
    {
      id: 1,
      name: '资料图片'
    },
    {
      id: 2,
      name: '工单客户签名'
    },
    {
      id: 3,
      name: '任务单签名'
    },
    {
      id: 4,
      name: 'videos视频'
    },
    {
      id: 5,
      name: 'zip'
    },
    {
      id: 6,
      name: 'pdf'
    },
    {
      id: 7,
      name: '录音文件'
    },
    {
      id: 8,
      name: 'text'
    },
    {
      id: 9,
      name: 'doc'
    },
    {
      id: 10,
      name: 'xlsx'
    }
  ],
  /**
   * 文件所属分类
   */
  fileCategoryOptions: [
    {
      name: '默认分类',
      otherName: 'default'
    },
    {
      name: '常规检查',
      otherName: 'normal'
    },
    {
      name: 'ct影像',
      otherName: 'ct'
    },
    {
      name: '诊断结果',
      otherName: 'diagnosis'
    },
    {
      name: '保险资料',
      otherName: 'insure'
    },
    {
      name: '病例',
      otherName: 'case'
    },
    {
      name: '住院单',
      otherName: 'hospitalization'
    }
  ],
  /**
   * 录音类型
   */
  soundTypeOptions: [
    {
      id: 1,
      name: '呼叫中心'
    },
    {
      id: 2,
      name: '客服'
    },
    {
      id: 3,
      name: '自行上传'
    },
    {
      id: 4,
      name: '陪诊通话记录'
    }
  ],
  /**
   * OMS卡状态
   */
  cardStatusOptions: [
    {
      id: 1,
      name: '已生成'
    },
    {
      id: 2,
      name: '已激活'
    },
    {
      id: 3,
      name: '已暂停'
    }
  ],
  approvalRulesStatusOptions: [
    {
      id: 0,
      name: '待审批',
      tagType: 'warning'
    },
    {
      id: 1,
      name: '审批中',
      tagType: ''
    },
    {
      id: 2,
      name: '审批通过',
      tagType: 'success'
    },
    {
      id: 3,
      name: '审批拒绝',
      tagType: 'danger'

    }
  ],

  serviceStatusOptions: [
    {
      id: 0,
      name: '已关闭'
    },
    {
      id: 1,
      name: '待服务'
    },
    {
      id: 2,
      name: '服务中'
    },
    {
      id: 3,
      name: '服务完成'
    }
  ],
  expenseStatusOptions: [
    {
      id: 1,
      name: '待审核',
      tagType: 'warning'
    },
    {
      id: 2,
      name: '待结算',
      tagType: ''
    },
    {
      id: 3,
      name: '已结算',
      tagType: 'success'
    }
  ],
  settlementTypeOptions: [
    {
      id: 1,
      name: '工单'
    },
    {
      id: 2,
      name: '预约单'
    },
    {
      id: 3,
      name: '任务单'
    }
  ],
  salaryStatusOptions: [
    {
      id: 1,
      name: '未确认',
      tagType: 'info'
    },
    {
      id: 2,
      name: '待确认',
      tagType: ''
    },
    {
      id: 3,
      name: '已确认',
      tagType: 'warning'
    },
    {
      id: 4,
      name: '已结算',
      tagType: 'success'
    },
    {
      id: 5,
      name: '存在异议',
      tagType: 'danger'
    }
  ],
  2: [
    {
      id: 1,
      name: '元化服务人员'
    },
    {
      id: 3,
      name: '橙医人员'
    }
  ],
  approvalStatusOptions: [
    {
      id: 0,
      name: '待提交',
      tagType: 'info'
    },
    {
      id: 1,
      name: '待审批',
      tagType: 'warning'
    },
    {
      id: 2,
      name: '审批通过',
      tagType: 'success'
    },
    {
      id: 3,
      name: '已驳回',
      tagType: 'danger'
    },
    {
      id: 4,
      name: '已结算',
      tagType: 'success'
    }
  ],
  /**
   * 费用汇总
   */
  approvalStatusOptions2: [
    {
      id: 0,
      name: '待审批',
      tagType: 'warning'
    },
    {
      id: 1,
      name: '审批中',
      tagType: 'primary'
    },
    {
      id: 2,
      name: '审批通过',
      tagType: 'success'
    },
    {
      id: 3,
      name: '审批拒绝',
      tagType: 'danger'
    },
    {
      id: 4,
      name: '待提交',
      tagType: 'info'
    }
  ],
  expensesOptions: [
    {
      id: 15,
      name: '加班费'
    },
    {
      id: 16,
      name: '挂号费'
    },
    {
      id: 17,
      name: '交通费'
    },
    {
      id: 18,
      name: '快递费'
    },
    {
      id: 19,
      name: '其他费用'
    }
  ],
  serviceTypeOptions: [
    {
      name: '外派陪医'
    },
    {
      name: '外派预约'
    },
    {
      name: '外派陪检'
    },
    {
      name: '外派专车'
    },
    {
      name: '预约单'
    },
    {
      name: '开单建卡'
    },
    {
      name: '协助调查'
    },
    {
      name: '协助缴费'
    },
    {
      name: '取卡取药'
    },
    {
      name: '取寄报告'
    },
    {
      name: '协助就医'
    },
    {
      name: '预约体检'
    }
  ]
}
