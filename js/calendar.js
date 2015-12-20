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
		for (var i = 0 ; i < calendarJson.days.length ; i++) {
			var date = ((t.getMonth() + 1) < 10 ? '0' + (t.getMonth() + 1) : (t.getMonth() + 1)) + '-' + (t.getDate() + i < 10 ? '0' + t.getDate() + i : t.getDate() + i) + '-' +t.getFullYear();
			var msdDate = t.getFullYear() + '-' +((t.getMonth() + 1) < 10 ? '0' + (t.getMonth() + 1) : (t.getMonth() + 1)) + '-' + (t.getDate() + i < 10 ? '0' + t.getDate() + i : t.getDate() + i);
			var lunchMember = calendarJson.days[i].events.lunch.participantCount;
			var dinnerMember = calendarJson.days[i].events.dinner.participantCount;
			var content = '<div id="msd-lunch-'+msdDate+'" class="msd-js-event msd-event';
			
			// 昼の情報
			if (calendarJson.days[i].events.lunch.isFixed && calendarJson.days[i].events.lunch.hasJoined) {
				content += ' msd-js-event-fixed msd-js-event-joined msd-event-fixed msd-event-joined">';
			} else if (calendarJson.days[i].events.lunch.isFixed) {
				content += ' msd-js-event-fixed msd-event-fixed">';
			} else if (calendarJson.days[i].events.lunch.hasJoined) {
				content += ' msd-js-event-joined msd-event-joined">';
			} else {
				content += '">';
			}
			content += '<button class="msd-js-join-event msd-btn">昼</button>';
			content += '<div class="msd-js-event-people">' + lunchMember + '</div></div>';
			content += '<div id="msd-dinner-'+msdDate+'" class="msd-js-event msd-event';
			// 夜の情報
			if (calendarJson.days[i].events.dinner.isFixed && calendarJson.days[i].events.dinner.hasJoined) {
				content += ' msd-js-event-fixed msd-js-event-joined msd-event-fixed msd-event-joined">';
			} else if (calendarJson.days[i].events.dinner.isFixed) {
				content += ' msd-js-event-fixed msd-event-fixed">';
			} else if (calendarJson.days[i].events.dinner.hasJoined) {
				content += ' msd-js-event-joined msd-event-joined">';
			} else {
				content += '">';
			}
			content += '<button class="msd-js-join-event msd-btn">夜</button>';
			content += '<div class="msd-js-event-people">' + dinnerMember + '</div></div>';
			events[date] = [{content: content, allDay: true}];
			//events[test] = [{content: 'test' + i, allDay: true}];
		}
		//	Creation of today event
		//	var today = ((t.getMonth() + 1) < 10 ? '0' + (t.getMonth() + 1) : (t.getMonth() + 1)) + '-' + (t.getDate() < 10 ? '0' + t.getDate() : t.getDate()) + '-' + t.getFullYear();
		//	events[today] = [{content: 'TODAY', allDay: true}];

		return events;
	}
});

