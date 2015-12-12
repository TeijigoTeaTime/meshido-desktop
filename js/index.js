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

});
