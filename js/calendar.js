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
	console.log('display-calendar');
});

