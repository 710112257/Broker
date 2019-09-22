const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017'; //连接的url

// var studentModel = new MongoModel('mydb','student');
//studentModel.insertOne({},function(err,result){});
// var courseModel = new MongoModel('mydb','courses');

function MongoModel(dbName, collectionName ){
    this.dbName = dbName;
    this.collectionName = collectionName;

}
/**
 * 连接
 * @param {Function} callback 
 */
MongoModel.prototype.connect = function(callback){
    const _client = new MongoClient(url, { useNewUrlParser: true });
    const _dbName = this.dbName;
    const _collectionName = this.collectionName;

    _client.connect(function(err, client){
        const db = client.db(_dbName); //获得数据库对象
        const collection = db.collection(_collectionName);//获得集合对象
        if(err){
            console.error(err);
            return;
        }
        if(typeof callback === 'function' ){
            callback(client, db, collection);
        }
    });
    return _client;
}
/**
 * 插入一条
 * @param {Document} doc 
 * @param {Function} callback 
 */
MongoModel.prototype.insertOne = function(doc, callback){
    this.connect(function(client, db, collection){
        collection.insertOne(doc, function(err, result){
            client.close();
            /* 
            //这里封装不好，不应该这里处理错误，应该往外传给回调函数去处理
            if(err){
                console.error(err);
                return;
            }
            callback(result);
            */
           //这样子才合理
           callback(err, result);
        })
    })
};
/**
 * 插入多条
 * @param {Array} doc 
 * @param {Function} callback 
 */
MongoModel.prototype.insertMany = function(docs, callback){
    this.connect(function(client, db, collection){
        collection.insertMany(docs, function(err, result){
            client.close();
            callback(err,result);
        })
    })
};

/**
 * 删除一条
 * @param {Object} filter 
 * @param {Function} callback 
 */
MongoModel.prototype.deleteOne = function(filter, callback){
    this.connect(function(client, db, collection){
        collection.deleteOne(filter, function(err, result){
            client.close();
            callback(err,result);
        })
    })
};

/**
 * 删除多条
 * @param {Object} filter 
 * @param {Function} callback 
 */
MongoModel.prototype.deleteMany = function(filter, callback){
    this.connect(function(client, db, collection){
        collection.deleteMany(filter, function(err, result){
            client.close();
            callback(err,result);
        })
    })
};

/**
 * 更新一条
 * @param {Object} filter - 过滤条件
 * @param {Object} update
 * @param {Function} callback 
 */
MongoModel.prototype.updateOne = function(filter,update, callback){
    this.connect(function(client, db, collection){
        collection.updateOne(filter,update, function(err, result){
            client.close();
            callback(err,result);
        })
    })
};

/**
 * 更新多条
 * @param {Object} filter - 过滤条件
 * @param {Object} update
 * @param {Function} callback 
 */
MongoModel.prototype.updateMany = function(filter,update, callback){
    this.connect(function(client, db, collection){
        collection.updateMany(filter,update, function(err, result){
            client.close();
            callback(err,result);
        })
    })
};

/**
 * 普通查找
 * @param {Object} filter - 过滤条件
 * @param {Object} options - 选项
 * @param {Function} callback 
 */
MongoModel.prototype.find = function(filter,options, callback){
    this.connect(function(client, db, collection){
        collection.find(filter,options).toArray(function(err, result){
            client.close();
            callback(err,result);
        })
    })
};

/**
 * 聚合查找 
 * @param {Object} pipeline - 管道
 * @param {Object} options - 选项
 * @param {Function} callback 
 */
MongoModel.prototype.aggregate = function(pipeline, options, callback){
    this.connect(function(client, db, collection){
        collection.aggregate(pipeline, options).toArray(function(err, result){
            client.close();
            callback(err,result);
        })
    })
};

module.exports = MongoModel;