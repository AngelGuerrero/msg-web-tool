const _ = require('lodash')

module.exports = (() => {
  let instance = null

  const users = []

  function createInstance () {
    return users
  }

  return {
    getInstante: function () {
      if (!this.instance) {
        instance = createInstance()
      }

      return instance
    },

    getUsers: function () {
      return users
    },

    addUser: function (user) {
      users.push(user)
    },

    isRegister: function (prop, value) {
      const index = _.findIndex(this.getUsers(), [prop, value])

      if (index === -1) return { registered: false, message: 'Usuario no registrado' }

      return { registered: true, item: this.getUsers()[index], index }
    }
  }
})()
