const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/borke')

const db = mongoose.connection
db.on('error', console.error.bind(console, '连接错误：'))
db.once('open', (callback) => {
  console.log('article连接成功！！')
})

var schema_article = new mongoose.Schema({ 
    content:String, 
    title: String,
    keywords:String, 
    describe: String,
    category:String, 
    tags: String,
    visibility:String,
    time: String,
    upload:String, 
    count: Number
},{
    collection:'article'
});   

var article = mongoose.model('article',schema_article);

module.exports=article;