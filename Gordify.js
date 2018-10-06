const SlackBot = require('./models/SlackBot')

module.exports = class Gordify {
  constructor(){
    this.name = "Gordify"
    this.channel = "general"
    this.day = "thursday"
    this.time = "10:00"
    this.duration = "2"

    SlackBot.find()
    .then(bots=>{
      if(bots.length==0){
        this.createBot()
      }else{
        this.WakeUpBot(bots[0])
      }
    })
  }
  createBot(){
    SlackBot.create({
      name:this.name,
      channel:this.channel,
      day:this.day,
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
    this.day = bot.day
    this.time = bot.time
    this.duration = bot.duration
    console.log(this)
  }
}