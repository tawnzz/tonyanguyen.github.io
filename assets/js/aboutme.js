$('document').ready(function() {
	var $window = $(window);
	var windowSize = $window.width();
	console.log(windowSize);
	if (windowSize > 800) {
		$('.tonya').on({
			mouseover: function() {
				$('#hover-img').fadeOut(300);
				$('.my-img').fadeIn(200);
			}
		});
		$('.tonya').focus(function() {
			$('#hover-img').fadeOut(300);
			$('.my-img').fadeIn(200);
		});

		$('.alaska').on({
			mouseover: function() {
				if ($('#hover-img').attr('src') == 'assets/img/alaska.jpg') {
					return;
				} else {
					// current img
					$('#hover-img').css('display', 'none');
					// my img
					$('.my-img').delay(100).fadeOut();
					// switch attr
					$('#hover-img').attr('src', 'assets/img/alaska.jpg');
					$('#hover-img').fadeIn(900);
				}
			}
		});

		$('.alaska').on({
			focus: function() {
				if ($('#hover-img').attr('src') == 'assets/img/alaska.jpg') {
					return;
				} else {
					// current img
					$('#hover-img').css('display', 'none');
					// my img
					$('.my-img').delay(100).fadeOut();
					// switch attr
					$('#hover-img').attr('src', 'assets/img/alaska.jpg');
					$('#hover-img').fadeIn(900);
				}
			}
		});

		$('.dog').on({
			mouseover: function() {
				if ($('#hover-img').attr('src') == 'assets/img/dog_person.jpeg') {
					return;
				} else {
					// current img
					$('#hover-img').css('display', 'none');
					// my img
					$('.my-img').delay(100).fadeOut();
					// switch attr
					$('#hover-img').attr('src', 'assets/img/dog_person.jpeg');
					$('#hover-img').fadeIn(900);
				}
			}
		});

		$('.dog').on({
			focus: function() {
				if ($('#hover-img').attr('src') == 'assets/img/dog_person.jpeg') {
					return;
				} else {
					// current img
					$('#hover-img').css('display', 'none');
					// my img
					$('.my-img').delay(100).fadeOut();
					// switch attr
					$('#hover-img').attr('src', 'assets/img/dog_person.jpeg');
					$('#hover-img').fadeIn(900);
				}
			}
		});

		$('.train').on({
			mouseover: function() {
				if ($('#hover-img').attr('src') == 'assets/img/train.jpg') {
					return;
				} else {
					// current img
					$('#hover-img').css('display', 'none');
					// my img
					$('.my-img').delay(100).fadeOut();
					// switch attr
					$('#hover-img').attr('src', 'assets/img/train.jpg');
					$('#hover-img').fadeIn(900);
				}
			}
		});

		$('.train').on({
			focus: function() {
				if ($('#hover-img').attr('src') == 'assets/img/train.jpg') {
					return;
				} else {
					// current img
					$('#hover-img').css('display', 'none');
					// my img
					$('.my-img').delay(100).fadeOut();
					// switch attr
					$('#hover-img').attr('src', 'assets/img/train.jpg');
					$('#hover-img').fadeIn(900);
				}
			}
		});

		$('.berk').on({
			mouseover: function() {
				if ($('#hover-img').attr('src') == 'assets/img/gobears.jpeg') {
					return;
				} else {
					// current img
					$('#hover-img').css('display', 'none');
					// my img
					$('.my-img').delay(100).fadeOut();
					// switch attr
					$('#hover-img').attr('src', 'assets/img/gobears.jpeg');
					$('#hover-img').fadeIn(900);
				}
			}
		});

		$('.berk').on({
			focus: function() {
				if ($('#hover-img').attr('src') == 'assets/img/gobears.jpeg') {
					return;
				} else {
					// current img
					$('#hover-img').css('display', 'none');
					// my img
					$('.my-img').delay(100).fadeOut();
					// switch attr
					$('#hover-img').attr('src', 'assets/img/gobears.jpeg');
					$('#hover-img').fadeIn(900);
				}
			}
		});

		$('.art').on({
			mouseover: function() {
				if ($('#hover-img').attr('src') == 'assets/img/my_art.jpg') {
					return;
				} else {
					// current img
					$('#hover-img').css('display', 'none');
					// my img
					$('.my-img').delay(100).fadeOut();
					// switch attr
					$('#hover-img').attr('src', 'assets/img/my_art.jpg');
					$('#hover-img').fadeIn(900);
				}
			}
		});

		$('.art').on({
			focus: function() {
				if ($('#hover-img').attr('src') == 'assets/img/my_art.jpg') {
					return;
				} else {
					// current img
					$('#hover-img').css('display', 'none');
					// my img
					$('.my-img').delay(100).fadeOut();
					// switch attr
					$('#hover-img').attr('src', 'assets/img/my_art.jpg');
					$('#hover-img').fadeIn(900);
				}
			}
		});

		$('.plate').on({
			mouseover: function() {
				if ($('#hover-img').attr('src') == 'assets/img/plating.jpeg') {
					return;
				} else {
					// current img
					$('#hover-img').css('display', 'none');
					// my img
					$('.my-img').delay(100).fadeOut();
					// switch attr
					$('#hover-img').attr('src', 'assets/img/plating.jpeg');
					$('#hover-img').fadeIn(900);
				}
			}
		});

		$('.plate').on({
			focus: function() {
				if ($('#hover-img').attr('src') == 'assets/img/plating.jpeg') {
					return;
				} else {
					// current img
					$('#hover-img').css('display', 'none');
					// my img
					$('.my-img').delay(100).fadeOut();
					// switch attr
					$('#hover-img').attr('src', 'assets/img/plating.jpeg');
					$('#hover-img').fadeIn(900);
				}
			}
		});

		$('.plant').on({
			mouseover: function() {
				if ($('#hover-img').attr('src') == 'assets/img/plant.jpeg') {
					return;
				} else {
					// current img
					$('#hover-img').css('display', 'none');
					// my img
					$('.my-img').delay(100).fadeOut();
					// switch attr
					$('#hover-img').attr('src', 'assets/img/plant.jpeg');
					$('#hover-img').fadeIn(900);
				}
			}
		});

		$('.plant').on({
			focus: function() {
				if ($('#hover-img').attr('src') == 'assets/img/plant.jpeg') {
					return;
				} else {
					// current img
					$('#hover-img').css('display', 'none');
					// my img
					$('.my-img').delay(100).fadeOut();
					// switch attr
					$('#hover-img').attr('src', 'assets/img/plant.jpeg');
					$('#hover-img').fadeIn(900);
				}
			}
		});
	} else {
		return;
	}
});
