'use strict';

$(document).ready(function () {
	var $calendar = $('#calendar');

	/**
	 * カレンダーを表示するイベント
	 */
	$(document).on('display-calendar', function () {
		$calendar.calendario({
			checkUpdate : false,
				caldata : buildCalData(fetchCalendar(2015, 12)),
			fillEmpty : false
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
			var lunchMember = calendarJson.days[i].events.lunch.participantCount;
			var dinnerMember = calendarJson.days[i].events.dinner.participantCount;
			var content = '<div id="msd-lunch-'+date+'" class="msd-js-event">';
			// 昼の情報
			if (calendarJson.days[i].events.lunch.isFixed == true && calendarJson.days[i].events.lunch.hasJoined == true) {
				content += '<button class="msd-js-join-lunch msd-js-event-fixed msd-js-event-joined msd-event-fixed msd-event-joined">昼</button>';
			} else if (calendarJson.days[i].events.lunch.isFixed == true) {
				content +='<button class="msd-js-join-lunch msd-js-event-fixed msd-event-fixed">昼</button>';
			} else if (calendarJson.days[i].events.lunch.hasJoined == true) {
				content +='<button class="msd-js-join-lunch msd-js-event-joined msd-event-joined">昼</button>';
			} else {
				content += '<button class="msd-js-join-lunch">昼</button>';
			}
			content += '<div class="msd-js-event-people">' + lunchMember + '</div></div>';
			content += '<div id="msd-dinner-'+date+'" class="msd-js-event">';
			// 夜の情報
			if (calendarJson.days[i].events.dinner.isFixed == true && calendarJson.days[i].events.dinner.hasJoined == true) {
				content += '<button class="msd-js-join-dinner msd-js-event-fixed msd-js-event-joined msd-event-fixed msd-event-joined">夜</button>';
			} else if (calendarJson.days[i].events.dinner.isFixed == true) {
				content +='<button class="msd-js-join-dinner msd-js-event-fixed msd-event-fixed">夜</button>';
			} else if (calendarJson.days[i].events.dinner.hasJoined == true) {
				content +='<button class="msd-js-join-dinner msd-js-event-joined msd-event-joined">夜</button>';
			} else {
				content += '<button class="msd-js-join-dinner">夜</button>';
			}
			content += '<div class="msd-js-event-people">' + dinnerMember + '</div></div>';
			events[date] = [{content: content, allDay: true}];
			//events[test] = [{content: 'test' + i, allDay: true}];
		}
		//	Creation of today event
		//	var today = ((t.getMonth() + 1) < 10 ? '0' + (t.getMonth() + 1) : (t.getMonth() + 1)) + '-' + (t.getDate() < 10 ? '0' + t.getDate() : t.getDate()) + '-' + t.getFullYear();
		//	events[today] = [{content: 'TODAY', allDay: true}];

		return events;
	}

	/**
	 * サーバからカレンダーを取得する
	 *
	 * @param {Number} year 年
	 * @param {Number} month 月
	 */
	function fetchCalendar(year, month) {
		// TODO: サーバから取得する
		// サーバからのレスポンスのフォーマットは
		// https://github.com/TeijigoTeaTime/meshido-backend#カレンダー-get-groupgroupcalendar
		// を参照
		return {
			"v": "0.1",
			// 一ヶ月分のカレンダーと各イベントの状態
			"days": [
				{
					"dayOfMonth": (new Date().getDate()),    // 日にち
					"weekday": ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][new Date().getDay()],   // 曜日
					"events": {
						"lunch": {
							"hasJoined": true,   // 参加済みか
							"isFixed": true,     // 確定済みのイベントか
							"participantCount": 3,  // 参加者数
							"_links": {}
						},
						"dinner": {
							"hasJoined": false,
							"isFixed": true,
							"participantCount": 4,
							"_links": {}
						}
					}
				},
				{
					"dayOfMonth": (new Date().getDate() + 1),    // 日にち
					"weekday": ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][new Date().getDay() + 1],   // 曜日
					"events": {
						"lunch": {
							"hasJoined": false,   // 参加済みか
							"isFixed": false,     // 確定済みのイベントか
							"participantCount": 5,  // 参加者数
							"_links": {}
						},
						"dinner": {
							"hasJoined": true,
							"isFixed": false,
							"participantCount": 6,
							"_links": {}
						}
					}
				}
			],
			"_links": {
				"self" : {
					"href": "/group/group12345/calendar/year/2015/month/12",
				},
				"next" : {
					"href": "/group/group12345/calendar/year/2016/month/1",
				},
				"prev" : {
					"href": "/group/group12345/calendar/year/2015/month/11",
				}
			},
			"_embeded": {}
		};
	}
	console.log('display-calendar');
});

