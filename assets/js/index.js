$(document).ready(function() {
	$(function() {
		// Fun mode toggle (90s Y2K girly homepage vibe)
		var funModeCanvas = null;
		var funModeBanner = null;
		var funModeAnimationId = null;
		var mouseX = 0;
		var mouseY = 0;
		var sparkles = [];
		var originalContainerHTML = null;
		var funContentHTML = null;

		function createY2KBackground() {
			removeY2KBackground();
			// Marquee banner
			var banner = document.createElement('div');
			banner.className = 'fun-mode-banner';
			var track = document.createElement('div');
			track.className = 'fun-mode-banner-track';
			var text = 'welcome to tonya\'s world ✦ ';
			for (var i = 0; i < 24; i++) {
				var span = document.createElement('span');
				span.className = 'banner-text';
				span.textContent = text;
				track.appendChild(span);
			}
			banner.appendChild(track);
			var canvas = document.createElement('canvas');
			canvas.id = 'fun-mode-bg';
			canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
			document.body.insertBefore(canvas, document.body.firstChild);
			document.body.insertBefore(banner, document.body.firstChild);
			funModeBanner = banner;
			funModeCanvas = canvas;

			// Mouse tracking
			mouseX = window.innerWidth / 2;
			mouseY = window.innerHeight / 2;
			$(document).on('mousemove.funmode', function(e) {
				mouseX = e.clientX;
				mouseY = e.clientY;
			});

			// Sparkles that rain down (more + some shiny)
			sparkles = [];
			var w0 = window.innerWidth, h0 = window.innerHeight;
			for (var i = 0; i < 280; i++) {
				var shiny = Math.random() < 0.25;
				sparkles.push({
					x: Math.random() * w0,
					y: Math.random() * h0,
					size: shiny ? 1.2 + Math.random() * 2.5 : 0.8 + Math.random() * 2,
					opacity: shiny ? 0.6 + Math.random() * 0.4 : 0.25 + Math.random() * 0.6,
					speed: 0.5 + Math.random() * 1.5,
					drift: (Math.random() - 0.5) * 0.4,
					shiny: shiny
				});
			}

			function draw() {
				if (!funModeCanvas || !document.body.contains(funModeCanvas)) return;
				var w = canvas.width = window.innerWidth;
				var h = canvas.height = window.innerHeight;
				var ctx = canvas.getContext('2d');
				if (!ctx) return;

				// 1. Pink base
				var baseGrad = ctx.createLinearGradient(0, 0, w, h);
				baseGrad.addColorStop(0, '#ffe4ec');
				baseGrad.addColorStop(0.3, '#f8bbd9');
				baseGrad.addColorStop(0.6, '#f48fb1');
				baseGrad.addColorStop(1, '#fce4ec');
				ctx.fillStyle = baseGrad;
				ctx.fillRect(0, 0, w, h);

				// 2. White gradients at edges
				var edges = [
					{ x: 0, y: 0 }, { x: w, y: 0 }, { x: w, y: h }, { x: 0, y: h },
					{ x: w/2, y: 0 }, { x: w, y: h/2 }, { x: w/2, y: h }, { x: 0, y: h/2 }
				];
				edges.forEach(function(p) {
					var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(w, h) * 0.6);
					g.addColorStop(0, 'rgba(255,255,255,0.5)');
					g.addColorStop(0.4, 'rgba(255,255,255,0.15)');
					g.addColorStop(1, 'rgba(255,255,255,0)');
					ctx.fillStyle = g;
					ctx.fillRect(0, 0, w, h);
				});

				// 3. Raining sparkles with cursor interaction
				var cursorRadius = 100;
				var repelStrength = 3;
				sparkles.forEach(function(s) {
					// Cursor repulsion: push sparkle away when near mouse
					var dx = s.x - mouseX;
					var dy = s.y - mouseY;
					var dist = Math.sqrt(dx * dx + dy * dy) || 1;
					if (dist < cursorRadius) {
						var force = (1 - dist / cursorRadius) * repelStrength;
						s.x += (dx / dist) * force;
						s.y += (dy / dist) * force;
					}
					// Rain down + drift
					s.y += s.speed;
					s.x += s.drift;
					if (s.y > h + 10) {
						s.y = -10;
						s.x = Math.random() * w;
					}
					if (s.y < -10) s.y = h + 10;
					if (s.x < -10) s.x = w + 10;
					if (s.x > w + 10) s.x = -10;

					if (s.shiny) {
						ctx.shadowBlur = 12;
						ctx.shadowColor = 'rgba(255,255,255,0.9)';
						ctx.fillStyle = 'rgba(255,255,255,' + Math.min(1, s.opacity + 0.3) + ')';
						ctx.beginPath();
						ctx.arc(s.x, s.y, s.size * 1.2, 0, Math.PI * 2);
						ctx.fill();
						ctx.shadowBlur = 0;
						ctx.fillStyle = 'rgba(255,255,255,' + s.opacity + ')';
						ctx.beginPath();
						ctx.arc(s.x, s.y, s.size * 0.5, 0, Math.PI * 2);
						ctx.fill();
					} else {
						ctx.fillStyle = 'rgba(255,255,255,' + s.opacity + ')';
						ctx.beginPath();
						ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
						ctx.fill();
					}
				});
			}

			function tick() {
				draw();
				funModeAnimationId = requestAnimationFrame(tick);
			}

			tick();

			$(window).on('resize.funmode', function() {
				sparkles.forEach(function(s) {
					s.x = Math.random() * window.innerWidth;
					s.y = Math.random() * window.innerHeight;
				});
			});
		}

		function removeY2KBackground() {
			if (funModeAnimationId) {
				cancelAnimationFrame(funModeAnimationId);
				funModeAnimationId = null;
			}
			$(document).off('mousemove.funmode');
			$(window).off('resize.funmode');
			if (funModeBanner) {
				funModeBanner.remove();
				funModeBanner = null;
			}
			if (funModeCanvas) {
				funModeCanvas.remove();
				funModeCanvas = null;
			}
		}

		function updateFunModeFooter(isPageLoad) {
			if ($('body').hasClass('fun-mode')) {
				if (!$('.fun-mode-footer').length) {
					var count = parseInt(localStorage.getItem('funModeVisits') || '0', 10);
					if (isPageLoad) {
						count += 1;
						localStorage.setItem('funModeVisits', String(count));
					}
					$('.container').append(
						'<div class="fun-mode-footer">' +
						'<hr>' +
						'<span>♥ you are visitor #' + count + ' ♥</span><br>' +
						'<span>last updated 2025 • don\'t forget to say hi!</span>' +
						'</div>'
					);
				}
			} else {
				$('.fun-mode-footer').remove();
			}
		}
		function loadFunContent(callback) {
			if (funContentHTML) {
				callback(funContentHTML);
				return;
			}
			var url = new URL('fun-content.html', window.location.href).href;
			$.get(url, function(html) {
				var parser = new DOMParser();
				var doc = parser.parseFromString(html, 'text/html');
				var el = doc.getElementById('fun-mode-content');
				funContentHTML = el ? el.innerHTML : html;
				callback(funContentHTML);
			}).fail(function() {
				var fallback = document.getElementById('fun-mode-fallback');
				if (fallback && fallback.content) {
					var div = document.createElement('div');
					div.appendChild(fallback.content.cloneNode(true));
					funContentHTML = div.innerHTML;
					callback(funContentHTML);
				} else if (fallback && fallback.innerHTML) {
					funContentHTML = fallback.innerHTML;
					callback(funContentHTML);
				} else {
					callback(null);
				}
			});
		}

		function switchToFunContent(done) {
			if (!originalContainerHTML) {
				originalContainerHTML = $('.container').html();
			}
			loadFunContent(function(html) {
				if (html) {
					$('.container').html(html);
					var dateEl = document.getElementById('myspace-date');
					if (dateEl) {
						dateEl.textContent = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
					}
					function updateSfTime() {
						var el = document.getElementById('sf-time');
						if (el) {
							el.textContent = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'America/Los_Angeles' });
						}
					}
					updateSfTime();
					var sfTimeInterval = setInterval(updateSfTime, 1000);
					$(document).off('funModeRemoved.sfTime');
					$(document).on('funModeRemoved.sfTime', function() { clearInterval(sfTimeInterval); });

					var spotifyApiUrl = window.SPOTIFY_API_URL || '';
					function updateSpotifyNowPlaying() {
						var el = document.getElementById('current-song');
						if (!el) return;
						if (!spotifyApiUrl) {
							el.textContent = '—';
							return;
						}
						if (el.textContent === '—' || el.textContent === 'nothing right now' || el.textContent.indexOf('unavailable') !== -1) {
							el.textContent = 'checking...';
						}
						$.get(spotifyApiUrl, function(data) {
							if (data.isPlaying && data.title) {
								var text = data.title + ' — ' + data.artists;
								if (data.url) {
									el.innerHTML = '<a href="' + data.url + '" target="_blank" rel="noopener">' + text + '</a>';
								} else {
									el.textContent = text;
								}
							} else {
								el.textContent = 'nothing right now';
							}
						}).fail(function(xhr) {
							if (el) el.textContent = 'unavailable';
						});
					}
					updateSpotifyNowPlaying();
					var spotifyInterval = setInterval(updateSpotifyNowPlaying, 30000);
					$(document).on('funModeRemoved.spotify', function() { clearInterval(spotifyInterval); });
				}
				if (done) done();
			});
		}

		function switchToNormalContent() {
			if (originalContainerHTML) {
				$('.container').html(originalContainerHTML);
			}
		}

		if (localStorage.getItem('funMode') === 'true') {
			$('body').addClass('fun-mode');
			switchToFunContent(function() {
				createY2KBackground();
				updateFunModeFooter(true);
			});
		}

		var funModePhotos = ['assets/img/tonya1.png', 'assets/img/tonya2.png', 'assets/img/tonya3.png'];
		$(document).on('click', '.fun-mode-photo-cycle', function() {
			var $el = $(this);
			var $img = $el.find('img');
			var photos = funModePhotos;
			if (photos && photos.length) {
				var currentSrc = $img.attr('src');
				var idx = photos.indexOf(currentSrc);
				idx = idx < 0 ? 0 : (idx + 1) % photos.length;
				$img.attr('src', photos[idx]);
			}
			$el.addClass('photo-pop');
			setTimeout(function() { $el.removeClass('photo-pop'); }, 400);
		});

		$(document).on('click', '#fun-mode-toggle, .fun-mode-toggle', function(e) {
			e.preventDefault();
			var isOn = !$('body').hasClass('fun-mode');
			$('body').toggleClass('fun-mode');
			localStorage.setItem('funMode', isOn);
			if (isOn) {
				switchToFunContent(function() {
					createY2KBackground();
					updateFunModeFooter(false);
				});
			} else {
				switchToNormalContent();
				removeY2KBackground();
				updateFunModeFooter(false);
				$(document).trigger('funModeRemoved.sfTime');
			}
		});

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
			$('title').text('Come back!');
		});

		//change back on focus
		$(window).focus(function() {
			$('title').text(pageTitle);
		});
	});
});
