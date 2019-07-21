$(document).ready(function() {
	$(function() {
		var $scroll = $('.scroll');
		var $list = $scroll.find('ul.list');
		var $clonedList = $list.clone();
		var listWidth = 10;
		console.log('scroll!');
		$list.find('li').each(function(i) {
			listWidth += $(this, i).outerWidth(true);
		});

		var endPos = $scroll.width() - listWidth;

		$list.add($clonedList).css({
			width: listWidth + 'px'
		});

		$clonedList.addClass('cloned').appendTo($scroll);

		//TimelineMax
		var infinite = new TimelineMax({ repeat: -1, paused: true });
		var time = 40;

		infinite
			.fromTo($list, time, { rotation: 0.01, x: 0 }, { force3D: true, x: -listWidth, ease: Linear.easeNone }, 0)
			.fromTo(
				$clonedList,
				time,
				{ rotation: 0.01, x: listWidth },
				{ force3D: true, x: 0, ease: Linear.easeNone },
				0
			)
			.set($list, { force3D: true, rotation: 0.01, x: listWidth })
			.to($clonedList, time, { force3D: true, rotation: 0.01, x: -listWidth, ease: Linear.easeNone }, time)
			.to($list, time, { force3D: true, rotation: 0.01, x: 0, ease: Linear.easeNone }, time)
			.progress(1)
			.progress(0)
			.play();

		//Pause/Play
		$scroll
			.on('mouseenter', function() {
				infinite.pause();
			})
			.on('mouseleave', function() {
				infinite.play();
			});

		//page title
		var pageTitle = $('title').text();

		//change page title!
		$(window).blur(function() {
			$('title').text('😔 Come back! ');
		});

		//change back on focus
		$(window).focus(function() {
			$('title').text(pageTitle);
		});
	});
});
