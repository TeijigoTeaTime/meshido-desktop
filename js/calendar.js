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
				caldata: buildCalData(year, month, res.days),
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
	 * @param {Number} calYear カレンダーの年
	 * @param {Number} calMonth カレンダーの月
	 * @param {Array} calDays カレンダーの日の配列
	 */
	function buildCalData(calYear, calMonth, calDays) {
		var events = {};
		var today = new Date();

		for (var i = 0; i < calDays.length; i++) {
			var calDay = calDays[i];

			if (calYear <= today.getFullYear() && calMonth <= today.getMonth() + 1) {
				if (calDay.dayOfMonth < today.getDate()) {
					// カレンダーが当月以前の場合、前日より古いイベントは表示しない
					continue;
				}
			}

			var date = [calMonth, calDay.dayOfMonth, calYear].join('-');
			var msdDate = [calYear, calMonth, calDay.dayOfMonth].join('-');
			var lunchMember = calDay.lunch.participantCount;
			var dinnerMember = calDay.dinner.participantCount;
			var content = '<div id="msd-lunch-' + msdDate + '" class="msd-js-event msd-event';

			// 昼の情報
			if (calDay.lunch.isFixed && calDay.lunch.hasJoined) {
				content += ' msd-js-event-fixed msd-js-event-joined msd-event-fixed msd-event-joined">';
			} else if (calDay.lunch.isFixed) {
				content += ' msd-js-event-fixed msd-event-fixed">';
			} else if (calDay.lunch.hasJoined) {
				content += ' msd-js-event-joined msd-event-joined">';
			} else {
				content += '">';
			}
			content += '<button class="msd-js-join-event msd-btn">昼</button>';
			content += '<div class="msd-js-event-people">' + lunchMember + '</div></div>';
			content += '<div id="msd-dinner-' + msdDate + '" class="msd-js-event msd-event';
			// 夜の情報
			if (calDay.dinner.isFixed && calDay.dinner.hasJoined) {
				content += ' msd-js-event-fixed msd-js-event-joined msd-event-fixed msd-event-joined">';
			} else if (calDay.dinner.isFixed) {
				content += ' msd-js-event-fixed msd-event-fixed">';
			} else if (calDay.dinner.hasJoined) {
				content += ' msd-js-event-joined msd-event-joined">';
			} else {
				content += '">';
			}
			content += '<button class="msd-js-join-event msd-btn">夜</button>';
			content += '<div class="msd-js-event-people">' + dinnerMember + '</div></div>';
			events[date] = [{content: content, allDay: true}];
		}

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

		if ($event.hasClass('msd-js-event-fixed')) {
			// 確定済みの場合は何もしない
			console.log(type + ' at ' + [year, month, day].join('-') + ' is fixed.');
			return;
		}

		// 参加済→cancel
		// 未参加→join
		var joinOrCancelEvent = $event.hasClass('msd-js-event-joined')
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
		}).done(function (res) {
			deferred.resolve(res.days[0][type]);
		}).fail(function () {
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
		}).done(function (res) {
			deferred.resolve(res.days[0][type]);
		}).fail(function () {
			deferred.reject();
		});

		return deferred.promise();
	}
});

