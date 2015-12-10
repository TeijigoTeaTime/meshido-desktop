'use strict';

$(document).ready(function() {

	localforage.config({
		driver: localforage.LOCALSTORAGE
	});

	localforage.getItem('user').then(function(user) {
		console.log(user);

		if (user) {
			// ログイン済みの場合
			// カレンダーを表示
			$(document).trigger('display-calendar');
		} else {
			// ログインダイアログを表示
			$(document).trigger('open-login-modal');
		}
	}, function(err) {
		console.log(err);
	});

});
