const tokens = {
  admin: {
    token: 'admin'
  },
  editor: {
    token: 'editor'
  }
}

const users = {
  'admin': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://hezepeng-1252705718.cos.ap-guangzhou.myqcloud.com/icon/1%20(17).jpg',
    name: 'Super Admin'
  },
  'editor': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://hezepeng-1252705718.cos.ap-guangzhou.myqcloud.com/icon/1%20(64).jpg',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/login',
    type: 'post',
    response: config => {
      console.log('xxx')
      const { username } = config.body
      const token = tokens[username]
      // mock error
      if (!token) {
        return {
          code: 60204,
          message: '用户名密码错误'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/getUserInfo\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
