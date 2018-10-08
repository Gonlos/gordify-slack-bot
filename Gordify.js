const schedule = require("node-schedule");
const { daysOfWeek, daysToCron, timeToCron } = require("./helpers/util");
const ObjectId = require("mongodb").ObjectID;
const Lunch = require("./models/Lunch");
const User = require("./models/User");
const SlackBot = require('./models/SlackBot')
const Slack = require("./helpers/slackMethods");
const { startMessage } = require("./helpers/messages");

class Gordify {
  constructor(name) {
    this.name = name || "Gordify";
    this.channel = "general";
    this.days = "thursday";
    this.time = "10:00";
    this.duration = "2";
    this.currentLunch = "";
    this.jobs = [];
    this.response_url=""
    this.WakeUpBot();
  }

  createBot() {
    return SlackBot.create({
      name: this.name,
      channel: this.channel,
      days: this.days,
      time: this.time,
      duration: this.duration,
      currentLunch: this.currentLunch
    });
  }

  findOrCreateUser({ slackId, name }) {
    return User.findOne({ slackId }).then(user => {
      if (!user) {
        return this.createUser({ slackId, name });
      } else {
        return user;
      }
    });
  }

  createUser({ slackId, name }) {
    return User.create({
      slackId,
      name,
      lunches: [],
      leadGroup: 0,
      leadGroupAvg: 0
    });
  }
  removeUserLunch(userId, callback_id) {
    console.log(callback_id,this.currentLunch)
    if (callback_id != this.currentLunch)
      return Promise.reject({ error: "This lunch is not active" });
    let query = {
      $and: [{ users: ObjectId(userId) }, { callback_id }]
    };
    let update = { $pull: { users: userId } };
    return Lunch.findOneAndUpdate(query, update);
  }
  addUserLunch(userId, callback_id) {
    if (callback_id != this.currentLunch)
      return Promise.reject({ error: "This lunch is not active" });
    let query = {
      $and: [{ users: { $ne: ObjectId(userId) } }, { callback_id }]
    };
    let update = { $push: { users: userId } };
    return Lunch.findOneAndUpdate(query, update);
  }
  WakeUpBot() {
    SlackBot.findOne({ name: this.name })
      .then(bot => {
        if (!bot) {
          return this.createBot();
        } else {
          this.name = bot.name;
          this.channel = bot.channel;
          this.days = bot.days;
          this.time = bot.time;
          this.duration = bot.duration;
          this.currentLunch = bot.currentLunch;
          this.response_url = bot.response_url;
          return bot;
        }
      })
      .then((bot)=> {
        console.log("WakeUp", bot);
        Lunch.findOne({is_finished:false})
        .then(lunch=>{
          if(lunch){
            this.currentLunch=lunch.callback_id
          }
        })
        .catch(e=>Promise.reject(e))
      })
      .catch(e => {
        console.log("Error wake", e);
      });
  }
  probando(date, otro) {
    console.log("probandooooooooo" + " " + date + "---" + otro);
  }
  scheduleLunch({ days, time, duration }) {
    days = daysToCron(days);
    time = timeToCron(time);
    let hour = time[0];
    let minute = time[1];
    console.log("arranco");
    schedule.scheduleJob(
      `${minute} ${hour} * * ${days}`,
      this.probando.bind(null, "empezamos")
    );
    hour = hour + duration == 23 ? 23 : hour + duration;
    schedule.scheduleJob(
      `${minute} ${hour} * * ${days}`,
      this.probando.bind(null, "acabamos")
    );
  }
  startLunch() {
    if (this.currentLunch != "") return Promise.reject({ error: "Lunch is already underway" })
    const callback_id = "l" + new Date().getTime();
    const duration = this.duration;
    return Lunch.create({ callback_id, duration })
    .then(() => {
      return SlackBot.findOneAndUpdate({name:this.name},{currentLunch:callback_id})
    })
    .then(()=>{
      startMessage.channel = this.channel;
      startMessage.attachments[0].callback_id = callback_id;
      this.currentLunch = callback_id
      return Slack.chat("postMessage", startMessage)
          .then(message=>{
            this.response_url=message.response_url
            return Lunch.findOneAndUpdate({callback_id},{response_url:message.response_url})
          })
    });
  }
  stopLunch() {
    let groupsPopulate,groups,createdGroups,groupsName
    // Slack.response(this.response_url,{text:"It's already closed. Good lunch"})
    Lunch.findOne({callback_id:this.currentLunch}).populate('users')
    .then(u=>{
      groupsPopulate=this.makeGroups(u.users)
      groups=this.selectLeaders(groupsPopulate)
      Lunch.findOneAndUpdate({callback_id:this.currentLunch},{groups})
      .then(update=>{
        if(update){
          groupsName=groupsPopulate.map(g=>{
            g.name="g" + new Date().getTime();
            return g
          })
          groupsName.map(g=>this.createGroup(g))
          createdGroups=groupsName.map(g=>{
            return Slack.groups("create",{name:g.name,validate:false})
          })
          Promise.all(createdGroups)
          .then((createdGrps)=>{
            // createdGrps.map(grp=>console.log(grp.data))
            let invitedUsers=groupsName.map((group,i)=>{
               return Promise.all(group.map(user=>{
                   return Slack.groups("invite",{user:user.slackId,channel:createdGrps[i].data.group.id})
               }))
             })
            Promise.all(invitedUsers)
            .then(()=>{
              console.log(groups)
            })
          })
          // .then((a)=>{
          //   console.log("invitados")
          //   a.map(e=>e.map(ee=>console.log(ee.data)))
          // })
        }
      })
    })
  }
  createGroup(group){
    console.log("----",group)
    // Slack.groups("create",{name:"Prueba5",validate:false})
    // .then((e)=>{
    //   console.log(e)
    //   if(e.data.ok){
    //     return Slack.groups('setPurpose',{channel:e.data.group.id,purpose:"Proposito del canal"})
    //   }
    //   throw e
    // })
    // .then()
    // .catch(e=>console.log("create error",e.data))

  }
  makeGroups(users) {
    users.sort(() => Math.random() - 0.5);
    const nUsers = users.length;
    const nGroups = Math.ceil(users.length / 7);
    const groups = [];
    let i;
    for (i = 0; i < nGroups; i++) {
      groups.push([]);
    }
    for (i = 0; i < nUsers; i++) {
      groups[i % nGroups].push(users[i]);
    }
    return groups;
  }
  selectLeaders(groups){
    return groups.sort((a,b)=>a-leadGroupAvg-b.leadGroupAvg).map(g=>{
      return {users:g.map(u=>ObjectId(u._id)),leader:ObjectId(g[0]._id)}
    })
  }
}

module.exports = Gordify;
