var  express = require ('express')
var fs = require( 'fs')
var _ = require ('underscore')._
var app=express()
var http =require('http')

app.all('/',function(req,res){
    res.send('hello test!');
})
app.listen(80, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('your proxy is listening at http://%s:%s', host, port);
})