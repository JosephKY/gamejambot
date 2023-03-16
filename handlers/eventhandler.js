const fs = require('fs')

module.exports = (Discord, client) => {
  let loadDir = (dirs) => {
    let eventFiles = fs.readdirSync(`./events/${dirs}`).filter(file => file.endsWith('.js'))
    
    for (let file of eventFiles) {
      let event = require(`../events/${dirs}/${file}`)
      let eventName = file.split('.')[0]
      client.on(eventName, event.bind(null, Discord, client))
    }
  }
  
  ['client', 'guild'].forEach(e => loadDir(e))
}