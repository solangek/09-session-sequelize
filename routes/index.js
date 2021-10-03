var express = require('express');
var router = express.Router();

//Access the session as req.session to count visits
router.get('/',function(req,
                        res, next) {

  if (req.session.views) {
    req.session.views++;
  } else { // first time we access session.views
    req.session.views = 1
  }

  res.render('index', {
    title: 'Visits',
    views: req.session.views
  });

})


module.exports = router;
