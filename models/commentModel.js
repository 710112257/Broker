const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/borke')

const db = mongoose.connection
db.on('error', console.error.bind(console, '连接错误：'))
db.once('open', (callback) => {
  console.log('comment连接成功！！')
})

var schema = new mongoose.Schema({ 
  id:String, 
  comment: String,
  title:String, 
  ip: String,
  time:String, 
},{
  collection:'comment'
});   
var comment = mongoose.model('comment',schema);

module.exports=comment;