$(function() {
  
  var pid, gid;

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
      console.log("it's " + msg.target);
      console.log("next is " + msg.next);
      if (pid == msg.next) {
        $('.roll-btn').removeClass('disabled');
      }
      else if(msg.next == 0) {
        $('.end-game-btn-row').removeClass('hide'); 
      }
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