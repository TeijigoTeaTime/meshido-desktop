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
				caldata : events,
			fillEmpty : false
		});
	});

	/**
	 * ランチ|ディナーへの参加ボタンを押した時のEvent
	 */
	$(document).on('click', '.msd-js-join-lunch, .msd-js-join-dinner', function() {
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
		// id="msd-event-{年}-{月}-{日}"
		var split = $event.attr('id').split('-');
		var year = split[2];
		var month = split[3];
		var day = split[4];

		var joinOrCancelEvent = $this.hasClass('msd-js-event-joined') ? cancelEvent : joinEvent;

		joinOrCancelEvent(type, year, month, day).then(function(event) {
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
		return function(type, year, month, day) {
			// TODO: サーバから取得する
			var deferred = $.Deferred();
			deferred.resolve({
				"hasJoined": true,
				"isFixed": false,
				"participantCount": 3
			});
			return deferred.promise();
		}
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
		return function(type, year, month, day) {
			// TODO: サーバから取得する
			var deferred = $.Deferred();
			deferred.resolve({
				"hasJoined": false,
				"isFixed": false,
				"participantCount": 2
			});
			return deferred.promise();
		}
	}
});

