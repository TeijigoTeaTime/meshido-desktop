'use strict';

$(document).ready(function () {
	var $calendar = $('#calendar');

	/**
	 * カレンダーを表示するイベント
	 */
	$(document).on('display-calendar', function () {
		var now = new Date();
		var year = now.getFullYear();
		var month = now.getMonth() + 1;

		$$.ajax({
			url: '/group/:group/calendar/year/' + year + '/month/' + month
		}).done(function (res) {
			// カレンダーの初期化
			$calendar.calendario({
				checkUpdate: false,
				caldata: buildCalData(res.days),
				fillEmpty: false
			});
		}).fail(function () {
			$$.alert('カレンダーの取得に失敗しました。');
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

	/**
	 * Calendarioに与えるcaldataを生成する
	 *
	 * @param {Object} calendarJson カレンダーのJSON (fetchCalendarの戻り値)
	 */
	function buildCalData(calendarJson) {
		// TODO: calendarJson から各日付に表示するHTMLを作る

		var events = {
		};
		var t = new Date();
		for (var i = 0 ; i < 31 ; i++) {
			var date = ((t.getMonth() + 1) < 10 ? '0' + (t.getMonth() + 1) : (t.getMonth() + 1)) + '-' + (t.getDate() + i < 10 ? '0' + t.getDate() + i : t.getDate() + i) + '-' +t.getFullYear();
			events[date] = [{content: '<div id="msd-lunch-'+date+'" class="msd-js-event"><button class="msd-js-join-lunch">昼</button><div class="msd-js-event-people">' + i + '</div></div><div id="msd-dinner-'+date+'" class="msd-js-event"><button class="msd-js-join-dinner">夜</button><div class="msd-js-event-people">' + i + '</div></div>', allDay: true}];
			//events[test] = [{content: 'test' + i, allDay: true}];
		}
		//	Creation of today event
		//	var today = ((t.getMonth() + 1) < 10 ? '0' + (t.getMonth() + 1) : (t.getMonth() + 1)) + '-' + (t.getDate() < 10 ? '0' + t.getDate() : t.getDate()) + '-' + t.getFullYear();
		//	events[today] = [{content: 'TODAY', allDay: true}];

		return events;
	}
});

