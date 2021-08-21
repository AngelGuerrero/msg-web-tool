module.exports = (() => {
  let instance = null

  let sessions = []

  function createInstance () {
    return sessions
  }

  return {
    getInstante: function () {
      if (!this.instance) {
        instance = createInstance()
      }

      return instance
    },

    getSessions: function () {
      return sessions
    },

    addToSession: function (user) {
      sessions.push(user)
    },

    removeFromSession: function (id) {
      sessions = sessions.filter(e => e.id !== id)
    }
  }
})()
