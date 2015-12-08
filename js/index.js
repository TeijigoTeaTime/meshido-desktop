'use strict';

$(document).ready(function() {
	console.log('index.js');
});

$(document).ready(function() {
	var $loginModal = $('#login-modal');

	// TODO： ログインしていないときだけ
	// ログインダイアログを開く
	$loginModal.openModal({
		dismissible: false,
		opacity: .2,
		in_duration: 300
	});

	$loginModal.on('click', '.js-login-btn', function(e) {
		e.preventDefault();

		var email = $('#login-email').val();
		var name = $('#login-name').val();

		login(email, name).done(function(sessionId) {
			// TODO: セッションIDを永続化する
			console.log(sessionId);
			$loginModal.closeModal();
		});
	});

	/**
	 * サーバにログイン情報を送信し、セッションIDを受け取る
	 *
	 * @param {String} email メールアドレス
	 * @param {String} name 名前
	 * @returns {Promise}
	 */
	var login = function(email, name) {
		// TODO: サーバにリクエストを投げる
		var defer = $.Deferred();
		defer.resolve('session-id');
		return defer.promise();
	};
});
