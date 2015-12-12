'use strict';

window.$$ = {};

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
		clear: function() {
			localStorage.clear();
		}
	};

})(jQuery, window.$$);
