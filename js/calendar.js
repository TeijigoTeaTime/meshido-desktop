'use strict';

$(document).ready(function () {
	var $calendar = $('#calendar');

	/**
	 * カレンダーを表示するイベント
	 */
	$(document).on('display-calendar', function () {
		$calendar.calendario({
			checkUpdate: false,
			fillEmpty: false,
			caldata: events
		});
	});

	$(document).on('finish.calendar.calendario', function () {
		updateYearMonth();
	});

	$('#custom-next').on('click', function () {
		$calendar.calendario('gotoNextMonth', updateYearMonth);
	});

	$('#custom-prev').on('click', function () {
		$calendar.calendario('gotoPreviousMonth', updateYearMonth);
	});

	$('#custom-current').on('click', function () {
		$calendar.calendario('gotoNow', updateYearMonth);
	});

	/**
	 * 現在年月の表示を更新する
	 */
	function updateYearMonth() {
		$('#custom-year').html($calendar.calendario('getYear'));
		$('#custom-month').html($calendar.calendario('getMonthName'));
	}
});

