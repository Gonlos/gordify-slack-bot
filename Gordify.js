const SlackBot = require('./models/SlackBot')

class Gordify {
  constructor(){
    this.name = "Gordify"
    this.channel = "general"
    this.days = "thursday"
    this.time = "10:00"
    this.duration = "2"
    this.jobs = []
    SlackBot.find()
    .then(bots=>{
      if(bots.length==0){
        this.createBot()
      }else{
        console.log(bots[0])
        this.WakeUpBot(bots[0])
      }
    })
    .catch(e=>{
      console.log("Error find",e)
    })
  }
  createBot(){
    SlackBot.create({
      name:this.name,
      channel:this.channel,
      days:this.days,
      time:this.time,
      duration:this.duration
    })
    .then(bot=>{
      console.log(bot)
      console.log(this)
    })
  }
  WakeUpBot(bot){
    this.name = bot.name
    this.channel = bot.channel
    this.days = bot.days
    this.time = bot.time
    this.duration = bot.duration
    console.log("whakeUp",bot)
    console.log("whakeUp",this)
  }
  start(){}
  stop(){}
  makeGroups(){}
}

module.exports = Gordify