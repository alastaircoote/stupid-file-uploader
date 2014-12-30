var express = require('express')
  , cors = require('cors')
  , app = express();

var multer  = require('multer')
var config = require('./config.json')
var AWS = require('aws-sdk')
var uuid = require('node-uuid')

app.use(cors());
app.use(multer({ inMemory:true}))


AWS.config.update({
    accessKeyId: config.key,
    secretAccessKey: config.secret 
})

var s3Client = new AWS.S3()


app.use(function(req,res,next) {

    var uu = uuid.v4()

    var params = {}
    params.Bucket = 'filedump'
    params.Key = uu + '.jpg'
    params.Body = req.files.file.buffer
    params.ACL = 'public-read'
    params.ContentType = 'image/jpeg'
    params.CacheControl = 'public'
    s3Client.putObject(params, function(err,result) {
        res.end(uu)
    })

})

app.listen(31245, function(){
  console.log('Running...');
});