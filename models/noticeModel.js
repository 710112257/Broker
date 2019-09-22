const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/borke')

const db = mongoose.connection
db.on('error', console.error.bind(console, '连接错误：'))
db.once('open', (callback) => {
  console.log('notice连接成功！！')
})

var schema = new mongoose.Schema({ 
  title:String, 
  time: String,
  content:String, 
},{
  collection:'notice'
});   
var notice = mongoose.model('notice',schema);

module.exports=notice;