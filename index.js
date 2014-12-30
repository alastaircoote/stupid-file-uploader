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
    if (!req.files.file.length) {
        req.files.file = [req.files.file];
    }

    var currentIndex = -1;
    var ids = []
    var doUpload = function() {
        currentIndex++
        var file = req.files.file[currentIndex]
        var uu = uuid.v4()

        var params = {}
        params.Bucket = 'filedump'
        params.Key = uu + '.jpg'
        params.Body = file.buffer
        params.ACL = 'public-read'
        params.ContentType = 'image/jpeg'
        params.CacheControl = 'public'
        s3Client.putObject(params, function(err,result) {
            ids.push(uu);
            if (currentIndex == req.files.file.length - 1) {
                res.end(ids.join(','));
            } else {
                doUpload()
            }
        })
    }

    doUpload();

})

app.listen(31245, function(){
  console.log('Running...');
});