'use strict';

$(document).ready(function () {
	/**
	 * カレンダーを表示するイベント
	 */
	$(document).on('display-calendar', function () {
		function updateMonthYear() {
			$( '#custom-month' ).html( $( '#calendar' ).calendario('getMonthName') );
			$( '#custom-year' ).html( $( '#calendar' ).calendario('getYear'));
		}
		$(document).on('finish.calendar.calendario', function(e){
			$( '#custom-month' ).html( $( '#calendar' ).calendario('getMonthName') );
			$( '#custom-year' ).html( $( '#calendar' ).calendario('getYear'));
			$( '#custom-next' ).on( 'click', function() {
				$( '#calendar' ).calendario('gotoNextMonth', updateMonthYear);
			} );
			$( '#custom-prev' ).on( 'click', function() {
				$( '#calendar' ).calendario('gotoPreviousMonth', updateMonthYear);
			} );
			$( '#custom-current' ).on( 'click', function() {
				$( '#calendar' ).calendario('gotoNow', updateMonthYear);
			} );
		});
		$( '#calendar' ).calendario({
			checkUpdate : false,
				caldata : buildCalData(fetchCalendar(2015, 12)),
			fillEmpty : false
		});
	});

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
			events[date] = [{content: '<div id="msd-lunch-'+date+'" class="msd-js-event"><button class="msd-js-join-lunch">昼</button><div class="msd-js-event-people"></div></div><div id="msd-dinner-'+date+'" class="msd-js-event"><button class="msd-js-join-dinner">夜</button><div class="msd-js-event-people"></div></div>', allDay: true}];
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

