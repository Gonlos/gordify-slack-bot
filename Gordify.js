const SlackBot = require('./models/SlackBot')

class Gordify {
  constructor(name){
    this.name = name || "Gordify"
    this.channel = "general"
    this.days = "thursday"
    this.time = "10:00"
    this.duration = "2"
    this.jobs = []
    this.WakeUpBot()
  }

  createBot(){
    return SlackBot.create({
      name:this.name,
      channel:this.channel,
      days:this.days,
      time:this.time,
      duration:this.duration
    })
  }

  WakeUpBot(){
    SlackBot.findOne({name:this.name})
    .then(bot=>{
      if(!bot){
        return this.createBot()
      }else{
        this.name = bot.name
        this.channel = bot.channel
        this.days = bot.days
        this.time = bot.time
        this.duration = bot.duration
        return bot
      }
    })
    .then(bot=>console.log("WakeUp",bot))
    .catch(e=>{
      console.log("Error wake",e)
    })
  }

  start(){}

  stop(){}

  makeGroups(users) {
    users.sort(() => Math.random() - 0.5)
    nUsers = users.length
    nGroups = Math.ceil(users.length / 7)
    groups = []
    for (i = 0; i < nGroups; i++) {
      groups.push([])
    }
    for (i = 0; i < nUsers; i++) {
      groups[i % (nGroups)].push(users[i])
    }
    return groups
  }
}

module.exports = Gordify