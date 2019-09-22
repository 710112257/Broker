const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/borke')

const db = mongoose.connection
db.on('error', console.error.bind(console, '连接错误：'))
db.once('open', (callback) => {
  console.log('picture连接成功！！')
})

var schema = new mongoose.Schema({ 
  title:String, 
  describe: String,
  upload:String, 
  time: String,
},{
  collection:'picture'
});   
var picture = mongoose.model('picture',schema);

module.exports=picture;