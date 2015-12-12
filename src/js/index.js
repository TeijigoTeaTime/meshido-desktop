'use strict';

window.$$ = {};

/**
 * localStorage のラッパー
 */
$$.storage = {
	setItem: function (key, value) {
		localStorage.setItem(key, JSON.stringify(value));
	},
	getItem: function (key) {
		var item = localStorage.getItem(key);
		return item === null ? null : JSON.parse(item);
	},
	removeItem: function (key) {
		localStorage.removeItem(key);
	},
	clear: function () {
		localStorage.clear();
	}
};

$(document).ready(function () {
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
