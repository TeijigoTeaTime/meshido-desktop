'use strict';

window.$$ = {
	apiHost: 'http://meshido.herokuapp.com',
	apiVersion: '1.0'
};

(function ($, $$) {
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

	/**
	 * Ajax通信を行う
	 *
	 * @param {Object} ajaxOpt $.ajaxのオプション
	 * @return {Promise} jqXHRオブジェクト
	 */
	$$.ajax = function (ajaxOpt) {
		var token = $$.storage.getItem('token');

		var opt = $.extend({}, ajaxOpt, {
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
				'X-Meshido-ApiVerion': $$.apiVersion,
				'X-Meshido-UserToken': token
			},
			dataType: 'json'
		});

		opt.url = $$.apiHost + opt.url;
		opt.data = JSON.stringify(opt.data);

		return ajax(opt);
	};

	/**
	 * Alertダイアログを表示する
	 *
	 * @param {String} msg メッセージ
	 */
	$$.alert = function (msg) {
		var $modal = $('#msd-alert-modal');
		$modal.find('.modal-content > p').text(msg);

		$modal.openModal({
			dismissible: false,
			opacity: '.2',
			'in_duration': 300
		});
	};

	/**
	 * $.ajax のラッパー
	 *
	 * @param {Object} ajaxOpt $.ajaxのオプション
	 * @param {Function} done Ajax通信成功時の共通処理 (optional)
	 * @param {Function} fail Ajax通信失敗時の共通処理 (optional)
	 * @param {Function} always 常に実行する共通処理 (optional)
	 * @return {Promise} jqXHRオブジェクト
	 */
	function ajax(ajaxOpt, done, fail, always) {
		var jqXHR = $.ajax(ajaxOpt);
		var defer = $.Deferred();

		jqXHR.done(function (data, statusText, jqXHR) {
			console.log(data, statusText, jqXHR);

			if (done && done(data, statusText, jqXHR) === false) {
				return;
			}

			defer.resolveWith(this, arguments);
		});

		jqXHR.fail(function (jqXHR, statusText, errorThrown) {
			console.log(jqXHR, statusText, errorThrown);

			if (fail && fail(jqXHR, statusText, errorThrown) === false) {
				return;
			}

			defer.rejectWith(this, arguments);
		});

		jqXHR.always(function () {
			always && always();
		});

		return $.extend({}, jqXHR, defer.promise());
	}
})(jQuery, window.$$);
