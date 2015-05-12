var express = require('express'),
	router = express.Router(),
	AWS = require('aws-sdk'),
	s3 = new AWS.S3();

router.get('/', function(req, res) {
	var bucket = 'barney-photos';
	var prefix = 'Thumbnails/Archer Studio';
	s3.listObjects({ Bucket: bucket, Prefix: prefix }, function(err, data) {
		var urls = [];
		if (data && data.Contents) {
			var files = data.Contents;
			for (var filename in files) {
				var file = files[filename];
				var url = s3.getSignedUrl('getObject', { Bucket: bucket, Key: file.Key });
				urls.push(url);
			}
		}
		else if (err)
			console.log('error: ', err);
		else
			console.log(data);
		// res.json(urls)
		res.render('index.html', { urls: urls });
	});
	}
);


module.exports = router