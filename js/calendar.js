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
	$(document).on('click', '.msd-js-join-lunch, .msd-js-join-dinner', function () {
		var $this = $(this);

		if ($this.hasClass('msd-js-event-fixed')) {
			// 確定済みの場合は何もしない
			return;
		}

		var type = '';
		if ($this.hasClass('msd-js-join-lunch')) {
			type = 'lunch';
		} else if ($this.hasClass('msd-js-join-dinner')) {
			type = 'dinner';
		}

		var $event = $this.closest('.msd-js-event');
		// id='msd-event-{年}-{月}-{日}'
		var split = $event.attr('id').split('-');
		var year = split[2];
		var month = split[3];
		var day = split[4];

		var joinOrCancelEvent = $this.hasClass('msd-js-event-joined') ? cancelEvent : joinEvent;

		joinOrCancelEvent(type, year, month, day).then(function (event) {
			if (event.isFixed) {
				$$.alert('すでに募集は締め切られています。');
				// TODO: ボタンを非活性化
				return;
			}

			// TODO: hasJoined | !hasJoined に応じてボタンのスタイルを変える
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
	 * @returns {Function} Promiseを返す関数
	 */
	function joinEvent(type, year, month, day) {
		return function (type, year, month, day) {
			// TODO: サーバから取得する
			var deferred = $.Deferred();
			deferred.resolve({
				'hasJoined': true,
				'isFixed': false,
				'participantCount': 3
			});
			return deferred.promise();
		};
	}

	/**
	 * イベントへの参加をキャンセルする
	 *
	 * @param {String} type イベント種別 (lunch|dinner)
	 * @param {Number} year 年
	 * @param {Number} month 月
	 * @param {Number} day 日
	 * @returns {Function}  Promiseを返す関数
	 */
	function cancelEvent(type, year, month, day) {
		return function (type, year, month, day) {
			// TODO: サーバから取得する
			var deferred = $.Deferred();
			deferred.resolve({
				'hasJoined': false,
				'isFixed': false,
				'participantCount': 2
			});
			return deferred.promise();
		};
	}
});

