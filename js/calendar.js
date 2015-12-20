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

	/**
	 * ランチ|ディナーへの参加ボタンを押した時のEvent
	 */
	$(document).on('click', '.msd-js-join-event', function () {
		var $btn = $(this);

		var $event = $btn.closest('.msd-js-event');
		// id='msd-{lunch|dinner}-{年}-{月}-{日}'
		var split = $event.attr('id').split('-');
		var type = split[1];
		var year = split[2];
		var month = split[3];
		var day = split[4];

		if ($btn.hasClass('msd-js-event-fixed')) {
			// 確定済みの場合は何もしない
			console.log(type + ' at ' + [year,month, day].join('-') + ' is fixed.');
			return;
		}

		// 参加済→cancel
		// 未参加→join
		var joinOrCancelEvent = $btn.hasClass('msd-js-event-joined')
			? cancelEvent(type, year, month, day) : joinEvent(type, year, month, day);

		joinOrCancelEvent.then(function (event) {
			if (event.isFixed) {
				$event.addClass('msd-js-event-fixed').addClass('msd-event-fixed');
				$$.alert('すでに募集は締め切られています。');
				return;
			}

			if (event.hasJoined) {
				$event.addClass('msd-js-event-joined').addClass('msd-event-joined');
			} else {
				$event.removeClass('msd-js-event-joined').removeClass('msd-event-joined');
			}

			$event.find('.msd-js-event-people').text(event.participantCount);
		});
	});

	/**
	 * イベントに参加登録する
	 *
	 * @param {String} type イベント種別 (lunch|dinner)
	 * @param {Number} year 年
	 * @param {Number} month 月
	 * @param {Number} day 日
	 * @returns {Promise}
	 */
	function joinEvent(type, year, month, day) {
		var deferred = $.Deferred();

		$$.ajax({
			url: '/group/:group/event/join',
			method: 'POST',
			data: {
				eventType: type,
				year: year,
				month: month,
				day: day
			}
		}).done(function(res) {
			deferred.resolve(res.days[0][type]);
		}).fail(function() {
			deferred.reject();
		});

		return deferred.promise();
	}

	/**
	 * イベントへの参加をキャンセルする
	 *
	 * @param {String} type イベント種別 (lunch|dinner)
	 * @param {Number} year 年
	 * @param {Number} month 月
	 * @param {Number} day 日
	 * @returns {Promise}
	 */
	function cancelEvent(type, year, month, day) {
		var deferred = $.Deferred();

		$$.ajax({
			url: '/group/:group/event/cancel',
			method: 'POST',
			data: {
				eventType: type,
				year: year,
				month: month,
				day: day
			}
		}).done(function(res) {
			deferred.resolve(res.days[0][type]);
		}).fail(function() {
			deferred.reject();
		});

		return deferred.promise();
	}
});

