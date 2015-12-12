'use strict';

$(document).ready(function() {

	var user = $$.storage.getItem('user');

	if (user) {
		// ログイン済みの場合
		// カレンダーを表示
		$(document).trigger('display-calendar');
	} else {
		// ログインダイアログを表示
		$(document).trigger('open-login-modal');
	}

	// FIXME: 動作確認用の一時コード(あとで削除する)
	$$.ajax({
		url: '/',
		method: 'POST',
		data: {
			email: 'taro.yamada@example.com',
			name: 'Taro Yamada'
		}
	}).done(function(json) {
		console.log('Response = ' + JSON.stringify(json));
	});

});
