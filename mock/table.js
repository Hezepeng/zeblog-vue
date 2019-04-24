import Mock from 'mockjs'

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    title: '@sentence(10, 20)',
    'status|1': ['published', 'draft', 'deleted'],
    author: 'name',
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }]
})

const attendanceList = Mock.mock({
  'items|20': [{
    id: '@zip',
    name: '@cname',
    'department|1': ['行政', '后勤', '财务', '销售'],
    'type|1': ['上班', '下班'],
    time: '@datetime',
    remark: '无'
  }]
})

const personList = Mock.mock({
  'items|20': [{
    id: '@zip',
    name: '@cname',
    'password|6-10': '*',
    'sex|1': ['男', '女'],
    'department|1': ['行政', '后勤', '财务', '销售'],
    'startTimes|1-30': 25,
    'endTimes|1-30': 25,
    'state|1': [1, 2, 3],
    remark: '无'
  }]
})

export default [
  {
    url: '/table/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
]
