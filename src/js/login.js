'use strict';

$(document).ready(function () {
	var $loginModal = $('#login-modal');

	/**
	 * ログインダイアログを表示するEvent
	 */
	$(document).on('open-login-modal', function () {
		$loginModal.openModal({
			dismissible: false,
			opacity: '.2',
			'in_duration': 300
		});
	});

	/**
	 * ログインボタン押下時のEvent
	 */
	$loginModal.on('click', '.js-login-btn', function (e) {
		e.preventDefault();

		var email = $('#login-email').val();
		var name = $('#login-name').val();

		login(email, name).then(function (user) {
			console.log(user);

			// ストレージにユーザ情報を保存
			$$.storage.setItem('user', user);

			// ログインダイアログを閉じる
			$loginModal.closeModal();

			// カレンダーを表示する
			$(document).trigger('display-calendar');
		});
	});

	/**
	 * サーバにログイン情報を送信し、セッションIDを受け取る
	 *
	 * @param {String} email メールアドレス
	 * @param {String} name 名前
	 * @returns {Promise}
	 */
	function login(email, name) {
		// TODO: サーバにリクエストを投げる
		var defer = $.Deferred();
		defer.resolve({
			email: email,
			name: name,
			token: 'api-token'
		});
		return defer.promise();
	}
});
