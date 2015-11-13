$(function() {
  
  function init() {
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
    $('.roll-btn').on('click', rollGame)
  }

  function socketSetup() {
    //當有user
    io.socket.on('user_logged_in', function (msg) {
      $('.total-count').text(msg.usercount);
      //console.log(msg)
    });
    //當遊戲開始
    io.socket.on('game_start', function (msg) {
      location.href = '/play/' + $('.game-id').val() + '/' + $('.p-id').val();
    });
    //當遊戲結束
    io.socket.on('game_end', function (msg) {
      $('.end-game-btn-row').removeClass('hide');
    });
    //當被點名時
    io.socket.on('your_turn_' + $('.p-id').val(), function (msg) {
      $('.roll-btn').removeClass('disabled');
    });
  }

  function getUserCount() {
    //通知所有人多一個人進入等待模式
    io.socket.get('/waiting/' + $('.game-id').val());
  }
  
  function playGame() {
    //通知所有人遊戲開始了
    io.socket.get('/start/' + $('.game-id').val());
  };
  
  function getConnection() {
    //通知所有人遊戲開始了
    io.socket.get('/playing/' + $('.game-id').val());
  };
  
  function rollGame() {
    $('.roll-btn').addClass('disabled');
    //通知所有人開始轉
    //io.socket.get('/roll/' + $('.p-id').val());
  };

  init();
    
});