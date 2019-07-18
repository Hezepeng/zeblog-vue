import Mock from 'mockjs'

const articleList = Mock.mock({
  'items|30': [{
    id: '@id',
    title: '@sentence(10, 20)',
    'category|1': ['前端', 'Java', '.NET', 'NLP'],
    'label|1': ['原创', '转载'],
    time: '@datetime',
    remark: '@sentence(10, 20)'
  }]
})

export default [
  {
    url: '/article/getArticleList',
    type: 'get',
    response: config => {
      const items = articleList.items
      return {
        code: 20000,
        data: items
      }
    }
  },
]
