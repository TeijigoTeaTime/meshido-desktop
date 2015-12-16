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

		login(email, name).then(function (token) {
			// ストレージにユーザ情報を保存
			$$.storage.setItem('token', token);
			$$.storage.setItem('user', {
				email: email,
				name: name
			});

			// ログインダイアログを閉じる
			$loginModal.closeModal();

			// カレンダーを表示する
			$(document).trigger('display-calendar');
		}, function () {
			$$.alert('メールアドレス、または、名前が不正です。');
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
		var deferred = $.Deferred();

		$$.ajax({
			url: '/login',
			method: 'POST',
			data: {
				group: 'test1',
				email: email,
				name: name
			}
		}).done(function (res) {
			deferred.resolve(res.token);
		}).fail(function () {
			deferred.reject();
		});

		return deferred.promise();
	}
});
