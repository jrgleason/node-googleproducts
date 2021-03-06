var username
var password
var appname = "test"
var querystring = require('querystring'),
    https = require('https'),
    authinfo


exports.addProduct = function(req, res,next){
  var mainRes = res
  var itemData = "<?xml version='1.0'?>"+
    "<entry xmlns='http://www.w3.org/2005/Atom' "+
    "xmlns:app='http://www.w3.org/2007/app' "+
    "xmlns:gd='http://schemas.google.com/g/2005' "+
    "xmlns:sc='http://schemas.google.com/structuredcontent/2009' "+
    "xmlns:scp='http://schemas.google.com/structuredcontent/2009/products' > "+
    "<app:control> "+
    "    <sc:required_destination dest='ProductSearch'/> "+
    "</app:control> "+
    "<title type='text'>"+req.body.title+"</title> "+
    "<link rel='alternate' type='text/html' href='"+req.body.link+"'/> "+
    "<sc:id>"+req.body.sku+"</sc:id> "+
    "<content type='text'> "+
    req.body.desc+
    "</content> "+
    "<sc:content_language>"+req.body.language+"</sc:content_language> "+
    "<sc:target_country>"+req.body.country+"</sc:target_country> "+
    //"<scp:product_type>"+req.param.productType+"</scp:product_type> "+
    "<scp:price unit='usd'>"+req.body.price+"</scp:price> "+
    "<scp:brand>"+req.body.brand+"</scp:brand> "+
    "<scp:color>"+req.body.color+"</scp:color> "+
    "<scp:availability>"+req.body.availability+"</scp:availability> "+
    "<scp:condition>"+req.body.condition+"</scp:condition> "+
    "</entry>"
  console.log(itemData)
  var post_options = {
      host: 'content.googleapis.com',
      port: '443',
      path: '/content/v1/8076653/items/products/generic',
      method: 'POST',
      headers: {
        'Content-Type': 'application/atom+xml',
        'Authorization': 'GoogleLogin Auth='+req.token
      }
  }; 
  var post_req = https.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.body = '';
      res.on('data', function (chunk) {
        res.body += chunk;
      });
      res.on('end', function() {
        var response = querystring.parse(res.body);
        return next();
      });
  });
  post_req.write(itemData)
  post_req.end()
  req.on('error', function(e) {
    console.error(e);
    res.send(e);
    return next();
  });
}
exports.getToken = function(req,res, next){
  console.log("Getting Token")
  var post_params = querystring.stringify({
    Passwd:req.password,
    Email:req.username,
    service:"structuredcontent",
    source:req.appname
  })
  var post_options = {
    host: 'www.google.com',
    port: '443',
    path: '/accounts/ClientLogin',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_params.length
    }
  };
  var post_req = https.request(post_options, function(res) {
    res.setEncoding('utf8');
    res.body = '';
    res.on('data', function (chunk) {
      res.body += chunk;
    });
    res.on('end', function() {
      var response = querystring.parse(res.body);
      if(response.SID){
        var sid = response.SID
        var authLocation = sid.indexOf("Auth=")+5
        var value = sid.substring(authLocation,sid.length-1)
        req.token = value
        console.log("Token recieved")
        return next()
      }
      else{
        return next()
      }
    })
  })
  post_req.write(post_params);
  post_req.end();
}


exports.getProducts = function(req, res, next){
  var mainRes = res
  var post_params = querystring.stringify({})
  var post_options = {
    host: 'content.googleapis.com',
    port: '443',
    path: '/content/v1/8076653/items/products/generic?alt=json',
    method: 'GET',
    headers: {
      'Authorization': 'GoogleLogin Auth='+req.token
    }
  };
  var post_req = https.request(post_options, function(res) {
    res.setEncoding('utf8');
    res.body = '';
    res.on('data', function (chunk) {
      res.body += chunk;
    });
    res.on('end', function() {
      req.feed = JSON.parse(res.body).feed
      //console.log("The feed is:"+JSON.stringify(req.feed))
      return next()
    });
  });
  post_req.end();
}

exports.getProduct = function(req, res, next){
  console.log("Getting Product")
  var mainRes = res
  var post_params = querystring.stringify({})
  if(req.body.entryId){
    var post_options = {
      host: 'content.googleapis.com',
      port: '443',
      path: '/content/v1/8076653/items/products/schema/online:en:US:'+req.body.entryId+'?alt=json',
      method: 'GET',
      headers: {
        'Authorization': 'GoogleLogin Auth='+req.token
      }
    };
    console.log(JSON.stringify(post_options))
    var post_req = https.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.body = '';
      res.on('data', function (chunk) {
        res.body += chunk;
      });
      res.on('end', function() {
        //console.log("Got Product Response:"+res.body);
        req.item = JSON.parse(res.body)
        return next();
      });
    });
    post_req.end();
  }
  else{
    //TODO handle
    return next()
  }
}

exports.editProduct = function(req, res,next){
  var mainRes = res
  var itemData = "<?xml version='1.0'?>"+
    "<entry xmlns='http://www.w3.org/2005/Atom' "+
    "xmlns:app='http://www.w3.org/2007/app' "+
    "xmlns:gd='http://schemas.google.com/g/2005' "+
    "xmlns:sc='http://schemas.google.com/structuredcontent/2009' "+
    "xmlns:scp='http://schemas.google.com/structuredcontent/2009/products' > "+
    "<app:control> "+
    "    <sc:required_destination dest='ProductSearch'/> "+
    "</app:control> "+
    "<title type='text'>"+req.body.title+"</title> "+
    "<link rel='alternate' type='text/html' href='"+req.body.link+"'/> "+
    "<sc:id>"+req.body.sku+"</sc:id> "+
    "<content type='text'> "+
    req.body.desc+
    "</content> "+
    "<sc:content_language>"+req.body.language+"</sc:content_language> "+
    "<sc:target_country>"+req.body.country+"</sc:target_country> "+
    //"<scp:product_type>"+req.param.productType+"</scp:product_type> "+
    "<scp:price unit='usd'>"+req.body.price+"</scp:price> "+
    "<scp:brand>"+req.body.brand+"</scp:brand> "+
    "<scp:color>"+req.body.color+"</scp:color> "+
    "<scp:availability>"+req.body.availability+"</scp:availability> "+
    "<scp:condition>"+req.body.condition+"</scp:condition> "+
    "</entry>"
  console.log(itemData)
  console.log('https://content.googleapis.com/content/v1/8076653/items/products/generic/online:en:US:'+req.body.sku)
  var post_options = {
      host: 'content.googleapis.com',
      port: '443',
      path: '/content/v1/8076653/items/products/generic/online:en:US:'+req.body.sku,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/atom+xml',
        'Authorization': 'GoogleLogin Auth='+req.token
      }
  }; 
  var post_req = https.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.body = '';
      res.on('data', function (chunk) {
        res.body += chunk;
      });
      res.on('end', function() {
        console.log(res.body)
        var response = querystring.parse(res.body);
        
        return next();
      });
  });
  post_req.write(itemData)
  post_req.end()
  req.on('error', function(e) {
    console.error(e);
    res.send(e);
    return next();
  });
}

exports.deleteProduct = function(req, res, next){
  console.log("Getting Product")
  var mainRes = res
  var post_params = querystring.stringify({})
  if(req.body.entryId){
    var post_options = {
      host: 'content.googleapis.com',
      port: '443',
      path: '/content/v1/8076653/items/products/generic/online:en:US:'+req.body.sku,
      method: 'DELETE',
      headers: {
        'Authorization': 'GoogleLogin Auth='+req.token
      }
    };
    console.log(JSON.stringify(post_options))
    var post_req = https.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.body = '';
      res.on('data', function (chunk) {
        res.body += chunk;
      });
      res.on('end', function() {
        //console.log("Got Product Response:"+res.body);
        req.item = JSON.parse(res.body)
        return next();
      });
    });
    post_req.end();
  }
  else{
    //TODO handle
    return next()
  }
}

