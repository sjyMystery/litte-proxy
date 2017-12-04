var  express = require ('express')
var fs = require( 'fs')
var _ = require ('underscore')._
var app=express()
var http =require('http')

var ipList = [];

fs.readFile("./config.json",(err,data)=>{
    var config=JSON.parse(data)
    app.use(function(req,res,next){
        if(req.path===config.apiRoutes.checkIn)
        {
            next()
        }
        else if(_.contains(ipList,req.ip) || _.contains(config.whitelist,`http://${req.hostname}${req.path}`))
        {
            var sreq =http.request({
                host: config.destination.host,
                port: config.destination.port,
                path: req.path,
                method: req.method
            },function(sres,err){
                sres.pipe(res);
                sres.on('end',function(){})
            })
            if (/POST|PUT/i.test(req.method)) {
                req.pipe(sreq);
            } else {
                sreq.end();
            }
        }
        else
        {
            res.sendStatus(403)
        }
    })
    app.get(config.apiRoutes.checkIn, function (req, res) {
        if(_.contains(config.clientData.userIds,req.query.userId))
        {
            ipList.push(req.ip);
            res.send({success:true})
        }
        else
        {
            res.send({success:false});
        }
    });
    var server = app.listen(config.listenPort, function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log('your proxy is listening at http://%s:%s', host, port);
    });
})

