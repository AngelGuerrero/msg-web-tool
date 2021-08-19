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
    }
  }
})()
