"use strict";
const express = require('express')

const async = require('asyncawait/async');
const await = require('asyncawait/await');



module.exports = (function() {
  var router = express.Router();
  // ---------------------------
  
  //Array with pages
  var routes = [
    {page:'start', path:'/'},
    {page:'signup'},
    {page:'editcreator'},
    {page:'creator',path:'user/creator-:id', dataGen: req=>{
      return {user:req.params.id}
    }},
    {page:'brand',path:'user/brand-:id', dataGen: req=>{
      return {user:req.params.id}
    }},
  ]
  
  // Loop through the routes array and
  // register them with the express router
  for (var i = 0; i<routes.length; i++) {
    var route = routes[i]
    if (!route.path) route.path = route.page

    router.get('/'+route.path, (function(route) {
      return function(req, res) {
        async (function(){
          route.data = route.dataGen ? route.dataGen(req) : {}
          if (route.fn && await (route.fn(req, res, route.data)) === false) return;
          if (!route.data.title) route.data.title = 'Fleet'
          route.data.dataPage = route.page
          console.log(route.data)
          res.render('templates/pages/'+route.page, route.data)
        })()
      }
    })(route) )
  }

  // -----------
  return router;    
})();