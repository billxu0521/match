/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 

module.exports = {

  'new': function(req, res) {
    res.locals.title = 'Create a new game!';
    res.locals.rootClass = 'new';

    // ID改成取最後8碼 然後有重複的話先remove掉舊的
    var params = {id: String(new Date().getTime()).substr(-8), count: 1};

    Game.findOne({id: params.id})
    .exec(function(err, game) {
      if (!game) {
        Game.create(params)
        .exec(function (err, game) {
          return res.redirect('/new/' + params.id + '/' + params.count);
        });
      }
      else {
        Game.update({id: game.id}, {id: game.id, count: 1})
        .exec(function (er, ga) {
          return res.redirect('/new/' + params.id + '/' + params.count);
        });
      }
    });
    
  },

  'checkGameID': function(req, res) {
    Game.findOne({id: req.param('gid')})
    .exec(function(err, game) {
      if (!game) {
        return res.redirect('/error');
      }
      else {
        res.locals.gid = game.id;
        game.count = Number(game.count) + 1;
        Game.update({id: game.id}, game)
        .exec(function (er, ga) {
          ga = ga[0];
          return res.redirect('/wait/' + ga.id + '/' + ga.count);
        });
      }
    });
  },

  'wait': function(req, res) {
    Game.findOne({id: req.param('gid')})
    .exec(function(err, game) {
      if (!game) {
        return res.redirect('/error');
      }
      else if (!parseInt(req.param('pid')) || parseInt(req.param('pid')) < 1 || parseInt(req.param('pid')) > game.count) {
        return res.redirect('/error');
      }
      else {
        res.locals.title = 'Wait for game start.';
        res.locals.rootClass = 'wait';
        res.locals.gid = req.param('gid');
        res.locals.pid = req.param('pid');
        res.view();
      }
    });
  },

  'play': function(req, res) {
    Game.findOne({id: req.param('gid')})
    .exec(function(err, game) {
      if (!game) {
        return res.redirect('/error');
      }
      else if (!parseInt(req.param('pid')) || parseInt(req.param('pid')) < 1 || parseInt(req.param('pid')) > game.count) {
        return res.redirect('/error');
      }
      else {
        res.locals.title = 'Playing!';
        res.locals.rootClass = 'play';
        res.locals.gid = req.param('gid');
        res.locals.pid = req.param('pid');
        res.locals.match = game.match;
        res.locals.count = game.count;
        res.view();
      }
    });
  },

  'waiting': function(req, res) {
    //console.log(req.param('gid'));
    //將對象socket加入該遊戲id的房間
    sails.sockets.join(req.socket, 'game_' + req.param('gid'));
    console.log(req.param('gid'))
    //取得目前人數
    Game.findOne({id: req.param('gid')}).exec(function(err, game) {
      
      //將遊戲人數廣播道該遊戲房間
      sails.sockets.broadcast('game_' + req.param('gid'), 'user_logged_in', {
        usercount: game.count
      });
      //console.log(sails.sockets.socketRooms(req.socket))

    });

  },

  //當建立者按下開始鍵
  'start': function(req, res) {
    //直接依照total人數來決定順序
    Game.findOne({id: req.param('gid')})
    .exec(function(err, game) {
      var match, c, n;
      var random = true;

      while (random) {
        match = [];
        c = game.count;
        n = 1;

        while (c--) {
          match[c] = n++;
        }
        match.sort(function() {return 0.5 - Math.random()})
        random = false;
        for (var i = 0; i < match.length; i++) {
          if (i == match[i] - 1) {
            random = true;
            break;
          }
        }
      }
      Game.update({id: game.id}, {match: match})
        .exec(function (er, ga) {
          ga = ga[0];
          sails.sockets.broadcast('game_' + req.param('gid'), 'game_start');
        });
    });


  },

  //遊戲頁的連線
  'playing': function(req, res) {
    sails.sockets.join(req.socket, 'game_' + req.param('gid'));
    sails.sockets.broadcast('game_' + req.param('gid'), 'your_turn_1');
  },

  //遊戲頁的連線
  'roll': function(req, res) {
    Game.findOne({id: req.param('gid')})
    .exec(function(err, ga) {
      var next = Number(req.param('pid')) < ga.count ? Number(req.param('pid')) + 1 : 0;
      sails.sockets.broadcast('game_' + req.param('gid'), 'onroll', {
        target: ga.match[Number(req.param('pid')) -1],
        next: next
      });
    });
    

    //sails.sockets.broadcast('game_' + req.param('gid'), 'game_end');
  }
  
  
};