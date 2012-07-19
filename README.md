node-googleproducts
===================

This is a project for node integration, with the Google Products API. This is to let people add, edit, delete, and search for products within their Google Products. 


EXAMPLES
========

All Examples use ExpressJS and JADE

So first in my routes I typically have something like this....

EXPRESS
=======

ROUTES
======
<pre>
var googleproducts = require('googleproducts').getInterface()

exports.getProducts = function(req, res, next){
  googleproducts.getProducts(req,res, next);
}

exports.editProduct = function(req, res, next){
  googleproducts.editProduct(req,res, next);
}


exports.getProduct = function(req, res, next){
  googleproducts.getProduct(req,res, next);
}


exports.addProduct = function(req, res, next){
  googleproducts.addProduct(req,res, next);
}

exports.deleteProduct = function(req, res, next){
  googleproducts.deleteProduct(req,res,next)  
}
</pre>
JADE
====

GETALL
======
<pre>
- each entry in feed.entry
    h2= entry.title.$t
      form(method="POST",action="/product/get")
        input(type="hidden",name="entryId",value="#{entry.sc$id.$t}")
        input(type="submit", value="Edit Item")
      form(method="POST",action="/product/delete")
        input(type="hidden",name="entryId",value="#{entry.sc$id.$t}")
        input(type="submit", value="Delete Item")
</pre>
NEW
===
<pre>
form(method="POST", action="/product/add")
    label Title
      input(type="text", name="title")
    label Link
      input(type="text", name="link")
    label SKU
      input(type="text", name="sku")
    label Description
      input(type="text", name="desc")
    input(type="hidden", name="language",value="en")
    input(type="hidden", name="country", value="US")
    // input(type="hidden", name="productType",value=)
    label Price
      input(type="text", name="price")
    input(type="hidden", name="brand")
    label Color
      input(type="text", name="color")
    input(type="hidden", name="availability", value="Out Of Stock")
    input(type="hidden", name="condition", value="new")
    input(type="submit", value="Add Product")
</pre>

MORE TO COME!!!!!!!!!

Also included as part of BulletTrain Ecommerce.....

