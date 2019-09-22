const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/borke')

const db = mongoose.connection
db.on('error', console.error.bind(console, '连接错误：'))
db.once('open', (callback) => {
  console.log('myselfinfo连接成功！！')
})

var schema = new mongoose.Schema({ 
  _id:String,
  onlinename:String, 
  sex: String,
  profess:String, 
  wechatNumber: String,
  email:String, 
  myselfsimple: String,
  experience:String, 
  img: String, 
},{
  collection:'myselfinfo'
});   
var myselfinfo = mongoose.model('myselfinfo',schema);

module.exports=myselfinfo;