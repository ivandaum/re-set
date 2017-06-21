var IndexController = {
    landingPage: function(req, res) {
        res.render('index', {layout: 'layout/layout',room:null});
    },
    straightToRoom: function(req,res) {
        res.render('index', {layout: 'layout/layout',room:req.params.id});
    },
    getMap: function(req,res) {
          res.render('index', {layout: 'layout/layout',room:'map'});
    }
};
module.exports = IndexController;
