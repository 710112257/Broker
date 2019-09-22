const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/borke')

const db = mongoose.connection
db.on('error', console.error.bind(console, '连接错误：'))
db.once('open', (callback) => {
  console.log('answer连接成功！！')
})

var schema = new mongoose.Schema({ 
  id:String, 
  answer: String,
  commentid:String, 
  title: String,
  ip:String, 
  time: String,
},{
  collection:'answer'
});   
var answer = mongoose.model('answer',schema);

module.exports=answer;