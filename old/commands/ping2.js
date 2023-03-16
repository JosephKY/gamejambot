module.exports = {
  name: 'ping2',
  description: 'description: replies with pong2',
  execute(message, args){
    message.channel.send('pong2')
  }
}