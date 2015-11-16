$(function() {
  
  var pid, gid, gave, mycolor;

  function init() {
    if ($('.p-id').length) pid = $('.p-id').val();
    if ($('.game-id').length) gid = $('.game-id').val();
    
    if ($('body.wait').length || $('body.play').length) {
      socketSetup();
    }
    if ($('body.wait').length) {
      getUserCount();
    }
    else if ($('body.play').length) {
      getConnection();
    }
    $('.play-btn').on('click', playGame);
    $('.roll-btn').on('click', rollGame);


    if (pid && $('.roll-btn').length) {
      if (pid == 1) {
        $('.roll-btn').removeClass('disabled');
      }
    }
  }

  function socketSetup() {
    //當有user
    io.socket.on('user_logged_in', function (msg) {
      $('.total-count').text(msg.usercount);
      //console.log(msg)
    });
    //當遊戲開始
    io.socket.on('game_start', function (msg) {
      location.href = '/play/' + gid + '/' + pid;
    });
    //當遊戲結束
    /*io.socket.on('game_end', function (msg) {
      $('.end-game-btn-row').removeClass('hide');
    });*/
    // 當被通知要轉的時候
    io.socket.on('onroll', function (msg) {
      console.log(msg);
      var color = msg.color;
      var oriColor = 'rgba(0,0,0,.5)';
      var number = $('.number');
      var finalColor = msg.target == pid ? color : oriColor;
      number.css({backgroundColor: oriColor});
      //五秒後再顯示按鈕
      setTimeout(function(){
        if (pid == msg.self) {
          $('.target').css({
            display: 'block',
            background: color
          }).text(msg.target);
        }

        if (pid == msg.next) {
          $('.roll-btn').removeClass('disabled');
        }
        // 當下一位是0代表沒有下一位了
        else if(msg.next == 0) {
          $('.end-game-btn-row').removeClass('hide');
          number.css({backgroundColor: mycolor});
        }
      }, 10000);

      // 如果是當局的主人（收禮的人）圓圈顏色就換成這盤的顏色
      if (msg.self == pid) {
        number.css({background: color});
      };

      if (pid == msg.target) {
        mycolor = color;
      }

      // 給過禮物的人，或者是當局的主人，就不跑
      if (msg.self == pid || gave) {
        return;
      };

      number.delay(pid * 100)
          .queue(function (next) {
            $(this).css({backgroundColor: color});
            next();
          })
          .delay(900)
          .queue(function (next) {
            $(this).css({backgroundColor: oriColor});
            next();
          })
          .delay(700)
          .queue(function (next) {
            $(this).css({backgroundColor: color});
            next();
          })
          .delay(500)
          .queue(function (next) {
            $(this).css({backgroundColor: oriColor});
            next();
          })
          .delay(300)
          .queue(function (next) {
            $(this).css({backgroundColor: color});
            next();
          })
          .delay(200)
          .queue(function (next) {
            $(this).css({backgroundColor: oriColor});
            next();
          })
          .delay(100)
          .queue(function (next) {
            $(this).css({backgroundColor: color});
            next();
          })
          .delay(80)
          .queue(function (next) {
            $(this).css({backgroundColor: oriColor});
            next();
          })
          .delay(70)
          .queue(function (next) {
            $(this).css({backgroundColor: color});
            next();
          })
          .delay(60)
          .queue(function (next) {
            $(this).css({backgroundColor: oriColor});
            next();
          })
          .delay(50)
          .queue(function (next) {
            $(this).css({backgroundColor: color});
            next();
          })
          .delay(50)
          .queue(function (next) {
            $(this).css({backgroundColor: oriColor});
            next();
          })
          .delay(50)
          .queue(function (next) {
            $(this).css({backgroundColor: oriColor});
            next();
          })
          .delay(50)
          .queue(function (next) {
            $(this).css({backgroundColor: oriColor});
            next();
          })
          .delay(50)
          .queue(function (next) {
            $(this).css({backgroundColor: color});
            next();
          })
          .delay(50)
          .queue(function (next) {
            $(this).css({backgroundColor: oriColor});
            next();
          })
          .delay(50)
          .queue(function (next) {
            $(this).css({backgroundColor: color});
            next();
          })
          .delay(50)
          .queue(function (next) {
            $(this).css({backgroundColor: oriColor});
            next();
          })
          .delay(50)
          .queue(function (next) {
            $(this).css({backgroundColor: color});
            next();
          })
          .delay(50)
          .queue(function (next) {
            $(this).css({backgroundColor: oriColor});
            next();
          })
          .delay(50)
          .queue(function (next) {
            $(this).css({backgroundColor: color});
            next();
          })
          .delay(50)
          .queue(function (next) {
            $(this).css({backgroundColor: oriColor});
            next();
          })
          .delay(50)
          .queue(function (next) {
            $(this).css({backgroundColor: color});
            next();
          })
          .delay(100)
          .queue(function (next) {
            $(this).css({backgroundColor: oriColor});
            next();
          })
          .delay(200)
          .queue(function (next) {
            $(this).css({backgroundColor: color});
            next();
          })
          .delay(400)
          .queue(function (next) {
            $(this).css({backgroundColor: oriColor});
            next();
          })
          .delay(600)
          .queue(function (next) {
            $(this).css({backgroundColor: color});
            next();
          })
          .delay(800)
          .queue(function (next) {
            $(this).css({backgroundColor: oriColor});
            next();
          })
          .delay(1000)
          .queue(function (next) {
            $(this).css({backgroundColor: color});
            next();
          })
          .delay(1000)
          .queue(function (next) {
            $(this).css({backgroundColor: oriColor});
            next();
          })
          .delay(1000)
          .queue(function (next) {
            $(this).css({backgroundColor: finalColor});
            gave = msg.target == pid;
            next();
          })
      
    });
    //廣播
    io.socket.on('game_alert', function (msg) {
      alert(msg.text)
    });
  }

  function getUserCount() {
    //通知所有人多一個人進入等待模式
    io.socket.get('/waiting/' + gid);
  }
  
  function playGame() {
    //通知所有人遊戲開始了
    io.socket.get('/start/' + gid);
  };
  
  function getConnection() {
    //通知所有人遊戲開始了
    io.socket.get('/playing/' + gid);
  };
  
  function rollGame() {
    $('.roll-btn').addClass('disabled');
    //通知所有人開始轉
    io.socket.get('/roll/' + gid + '/' + pid);
  };

  init();
    
});