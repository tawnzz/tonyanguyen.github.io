$(document).ready(function() {
	$(function() {
		// Fun mode toggle (90s Y2K girly homepage vibe)
		var funModeCanvas = null;
		var funModeBanner = null;
		var funModeAnimationId = null;
		var funModeGlitterCanvas = null;
		var funModeHeartCanvas = null;
		var mouseX = 0;
		var mouseY = 0;
		var sparkles = [];
		var glitterTrails = [];
		var heartTunnels = [];
		var isMainSiteHome = $('.container.page-layout').length > 0;
		var isFunModePage = $('body').hasClass('fun-mode') && $('#fun-mode-content').length > 0 && !isMainSiteHome;

		if (isMainSiteHome && localStorage.getItem('funMode') === 'true') {
			window.location.href = 'fun-content.html';
			return;
		}

		var BANNER_QUOTES = [
			"welcome to tonya's web page",
			'thanks for stopping by ~ have a lovely day',
		];
		var MARQUEE_SEPARATORS = [' ✦ ', ' · ', ' ♡ ', ' ~ '];

		function createY2KBackground() {
			removeY2KBackground();
			// Marquee banner
			var banner = document.createElement('div');
			banner.className = 'fun-mode-banner';
			var track = document.createElement('div');
			track.className = 'fun-mode-banner-track';

			for (var i = 0; i < 24; i++) {
				var quote = BANNER_QUOTES[i % BANNER_QUOTES.length];
				var sep = MARQUEE_SEPARATORS[i % MARQUEE_SEPARATORS.length];
				var text = quote + sep;
				var unit = document.createElement('span');
				unit.className = 'banner-unit';
				var heart = document.createElement('img');
				heart.setAttribute('aria-hidden', 'true');
				var span = document.createElement('span');
				span.className = 'banner-text';
				span.textContent = text;
				unit.appendChild(heart);
				unit.appendChild(span);
				track.appendChild(unit);
			}
			banner.appendChild(track);
			var canvas = document.createElement('canvas');
			canvas.id = 'fun-mode-bg';
			canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
			document.body.insertBefore(canvas, document.body.firstChild);
			document.body.insertBefore(banner, document.body.firstChild);
			funModeBanner = banner;
			funModeCanvas = canvas;

			// Heart tunnel: click on background to spawn tunnel at click point; multiple tunnels can run at once
			$(document).on('click.funmodeHearts', function(e) {
				if (!$('body').hasClass('fun-mode')) return;
				if ($(e.target).closest('a, button, input, select, textarea, .fun-mode-tab, .fun-mode-photo-cycle, .fun-mode-close').length) return;
				var HEART_COLORS = [[255,255,255],[255,255,255],[250,250,255],[255,250,255],[255,255,250]];
				heartTunnels.push({
					originX: e.clientX,
					originY: e.clientY,
					hearts: Array.from({ length: 1 }, function(_, i) {
						return { z: (i + 0.5) / 1, ci: Math.floor(Math.random() * HEART_COLORS.length) };
					})
				});
				document.body.classList.add('fun-mode-hearts-active');
			});

			// Heart tunnel overlay (click background to activate)
			var heartTunnel = document.createElement('div');
			heartTunnel.className = 'fun-mode-heart-tunnel';
			var heartCanvas = document.createElement('canvas');
			heartCanvas.className = 'fun-mode-heart-canvas';
			heartTunnel.appendChild(heartCanvas);
			document.body.insertBefore(heartTunnel, document.body.firstChild);
			funModeHeartCanvas = heartCanvas;

			// Glitter cursor trail
			var glitterTrail = document.createElement('div');
			glitterTrail.className = 'fun-mode-glitter-trail';
			var glitterCanvas = document.createElement('canvas');
			glitterCanvas.className = 'fun-mode-glitter-canvas';
			glitterTrail.appendChild(glitterCanvas);
			document.body.appendChild(glitterTrail);
			funModeGlitterCanvas = glitterCanvas;

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

				// 4. Glitter cursor trail - metallic flakes at cursor
				if (funModeGlitterCanvas && document.body.contains(funModeGlitterCanvas)) {
					var gc = funModeGlitterCanvas;
					gc.width = w;
					gc.height = h;
					var gctx = gc.getContext('2d');
					if (gctx) {
						var GLITTER_COLORS = ['#ffd700','#ffe4b5','#c0c0c0','#fff8dc','#ffb6c1','#f0e68c','#ffec8b'];
						gctx.clearRect(0, 0, w, h);
						if (Math.random() < 0.5) {
							glitterTrails.push({
								x: mouseX + (Math.random() - 0.5) * 16,
								y: mouseY + (Math.random() - 0.5) * 16,
								size: 1.5 + Math.random() * 3,
								opacity: 0.9,
								life: 1,
								vx: (Math.random() - 0.5) * 1.5,
								vy: (Math.random() - 0.5) * 1.5,
								rot: Math.random() * Math.PI * 2,
								ci: Math.floor(Math.random() * GLITTER_COLORS.length)
							});
						}
						glitterTrails = glitterTrails.filter(function(g) {
							g.x += g.vx;
							g.y += g.vy;
							g.opacity *= 0.965;
							g.life = g.opacity;
							if (g.life < 0.05) return false;
							gctx.save();
							gctx.globalAlpha = g.opacity;
							gctx.translate(g.x, g.y);
							gctx.rotate(g.rot + g.life * 2);
							gctx.fillStyle = GLITTER_COLORS[g.ci];
							gctx.strokeStyle = 'rgba(255,255,255,0.6)';
							gctx.lineWidth = 0.5;
							var s = g.size;
							gctx.beginPath();
							gctx.moveTo(0, -s);
							gctx.lineTo(s * 0.4, 0);
							gctx.lineTo(0, s);
							gctx.lineTo(-s * 0.4, 0);
							gctx.closePath();
							gctx.fill();
							gctx.stroke();
							gctx.restore();
							return true;
						});
					}
				}

				// 5. Heart tunnel (when active) - multiple 3D tunnels at click points
				if (document.body.classList.contains('fun-mode-hearts-active') && funModeHeartCanvas && document.body.contains(funModeHeartCanvas) && heartTunnels.length > 0) {
					var hc = funModeHeartCanvas;
					hc.width = w;
					hc.height = h;
					var hctx = hc.getContext('2d');
					if (hctx) {
						var HEART_PATH = new Path2D('M60 100 C60 100 5 60 5 30 C5 10 20 0 35 0 C46 0 56 7 60 14 C64 7 74 0 85 0 C100 0 115 10 115 30 C115 60 60 100 60 100Z');
						var HEART_COLORS = [[255,255,255],[255,255,255],[250,250,255],[255,250,255],[255,255,250]];
						var HEART_BORDER_BASE = 3.0;
						var HEART_BORDER_MIN = 1.5;
						var HEART_GLOW_FACTOR = 2.0;
						var HEART_GLOW_MAX = 150;
						var HEART_SPEED = 0.00006;

						hctx.clearRect(0, 0, w, h);

						var diag = Math.hypot(w, h);
						var HEART_DONE_Z = 0.008;
						heartTunnels = heartTunnels.filter(function(tunnel) {
							tunnel.hearts = tunnel.hearts.filter(function(h) {
								var decel = h.z * 1.2 + 0.15;
								h.z -= HEART_SPEED * 16 * decel;
								return h.z > HEART_DONE_Z;
							});
							return tunnel.hearts.length > 0;
						});
						if (heartTunnels.length === 0) {
							document.body.classList.remove('fun-mode-hearts-active');
						}

						heartTunnels.forEach(function(tunnel) {
							var sorted = tunnel.hearts.slice().sort(function(a, b) { return b.z - a.z; });
							sorted.forEach(function(h) {
								var size = (diag * 0.015) / (h.z * h.z * 6 + h.z * 0.3 + 0.0002);
								var alpha = h.z > 0.85 ? (1 - h.z) / 0.15 : (h.z < 0.06 ? Math.pow(h.z / 0.06, 0.4) : 1.0);
								var color = HEART_COLORS[h.ci];
								var r = color[0], g = color[1], b = color[2];

								hctx.save();
								hctx.translate(tunnel.originX, tunnel.originY);
								var sc = size / 58;
								hctx.scale(sc, sc);
								hctx.translate(-60, -50);

								hctx.shadowColor = 'rgba(' + r + ',' + g + ',' + b + ',' + (alpha * 0.7) + ')';
								hctx.shadowBlur = Math.min(size * HEART_GLOW_FACTOR, HEART_GLOW_MAX) / sc;
								hctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (alpha * 0.06) + ')';
								hctx.fill(HEART_PATH);
								hctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
								hctx.lineWidth = Math.max(HEART_BORDER_MIN, HEART_BORDER_BASE / sc);
								hctx.stroke(HEART_PATH);
								hctx.restore();
							});
						});
					}
				}
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
			$(document).off('click.funmodeHearts');
			$(window).off('resize.funmode');
			document.body.classList.remove('fun-mode-hearts-active');
			if (funModeHeartCanvas && funModeHeartCanvas.parentNode) {
				funModeHeartCanvas.parentNode.remove();
				funModeHeartCanvas = null;
			}
			if (funModeGlitterCanvas && funModeGlitterCanvas.parentNode) {
				funModeGlitterCanvas.parentNode.remove();
				funModeGlitterCanvas = null;
			}
			glitterTrails = [];
			heartTunnels = [];
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
				var count = parseInt(localStorage.getItem('funModeVisits') || '0', 10);
				if (isPageLoad) {
					count += 1;
					localStorage.setItem('funModeVisits', String(count));
				}
				$('#visitor-count').text(count);
			}
		}
		function bindFunPageLiveWidgets() {
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
				}).fail(function() {
					if (el) el.textContent = 'unavailable';
				});
			}
			updateSpotifyNowPlaying();
			var spotifyInterval = setInterval(updateSpotifyNowPlaying, 30000);
			$(document).off('funModeRemoved.spotify');
			$(document).on('funModeRemoved.spotify', function() { clearInterval(spotifyInterval); });
		}

		var funModePhotos = ['assets/img/tonya1.png', 'assets/img/tonya2.png', 'assets/img/tonya3.png'];

		function drawPixelated(ctx, img, w, h, blockSize) {
			if (!img || !img.naturalWidth) return;
			if (blockSize <= 1) {
				ctx.imageSmoothingEnabled = true;
				ctx.drawImage(img, 0, 0, w, h);
				return;
			}
			var bw = Math.max(1, Math.ceil(w / blockSize));
			var bh = Math.max(1, Math.ceil(h / blockSize));
			var temp = document.createElement('canvas');
			temp.width = bw;
			temp.height = bh;
			var tctx = temp.getContext('2d');
			tctx.imageSmoothingEnabled = false;
			tctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, bw, bh);
			ctx.imageSmoothingEnabled = false;
			ctx.drawImage(temp, 0, 0, bw, bh, 0, 0, w, h);
		}

		$(document).on('click', '.fun-mode-photo-cycle', function() {
			var $el = $(this);
			var $wrap = $el.find('.photo-img-wrap');
			var $img = $wrap.find('img');
			var $canvas = $wrap.find('.photo-pixel-canvas')[0];
			var photos = funModePhotos;
			if (!photos || !photos.length || !$img.length || !$canvas) return;

			var currentSrc = $img.attr('src');
			var idx = photos.indexOf(currentSrc);
			idx = idx < 0 ? 0 : (idx + 1) % photos.length;
			var nextSrc = photos[idx];

			function doPhase1() {
				$wrap.addClass('photo-active');
				var img = $img[0];
				var w = img.offsetWidth;
				var h = img.offsetHeight;
				$canvas.width = w;
				$canvas.height = h;
				var ctx = $canvas.getContext('2d');
				if (ctx && img.complete) {
					var blockSize = Math.max(4, Math.min(w, h) / 24);
					drawPixelated(ctx, img, w, h, blockSize);
				}
			}

			function doPhase2() {
				var nextImg = new Image();
				nextImg.onload = function() {
					var w = $img[0].offsetWidth;
					var h = $img[0].offsetHeight;
					var ctx = $canvas.getContext('2d');
					var currentImg = $img[0];
					var minBlock = Math.max(4, Math.min(w, h) / 50);
					var maxBlock = Math.min(w, h) / 2.2;
					var switchBlock = minBlock + (maxBlock - minBlock) * 0.35;

					var startTime = null;
					var scrambleDuration = 1050;

					function easeInOutQuart(x) {
						return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
					}

					function scrambleFrame(timestamp) {
						if (!startTime) startTime = timestamp;
						var elapsed = timestamp - startTime;
						var t = Math.min(1, elapsed / scrambleDuration);
						var te = easeInOutQuart(t);

						var blockSize;
						if (te < 0.35) {
							var scrambleT = te / 0.35;
							blockSize = minBlock + (maxBlock - minBlock) * scrambleT;
							drawPixelated(ctx, currentImg, w, h, blockSize);
						} else if (te < 0.42) {
							var unscrambleToSwitchT = (te - 0.35) / 0.07;
							blockSize = maxBlock + (switchBlock - maxBlock) * unscrambleToSwitchT;
							drawPixelated(ctx, currentImg, w, h, blockSize);
						} else if (te < 0.48) {
							blockSize = switchBlock;
							drawPixelated(ctx, nextImg, w, h, blockSize);
						} else {
							var unscrambleT = (te - 0.48) / 0.52;
							blockSize = switchBlock + (minBlock - switchBlock) * unscrambleT;
							drawPixelated(ctx, nextImg, w, h, blockSize);
						}

						if (t < 1) {
							requestAnimationFrame(scrambleFrame);
						}
					}
					requestAnimationFrame(scrambleFrame);
				};
				nextImg.src = nextSrc;
			}

			function doPhase3() {
				$img.attr('src', nextSrc);
				$wrap.removeClass('photo-active');
			}

			doPhase1();
			setTimeout(doPhase2, 520);
			setTimeout(doPhase3, 1900);
		});

		$(document).on('click', '.fun-mode-tab', function(e) {
			e.preventDefault();
			var tab = $(this).attr('data-tab');
			if (!tab) return;
			$('.fun-mode-panel').removeClass('active').filter('#panel-' + tab).addClass('active');
			$('.fun-mode-tab').removeClass('active').filter('[data-tab="' + tab + '"]').addClass('active');
		});

		if (isFunModePage) {
			bindFunPageLiveWidgets();
			createY2KBackground();
			updateFunModeFooter(true);
		}

		var $scroll = $('.scroll');
		var $list = $scroll.find('ul.list');
		if ($scroll.length && $list.length && typeof TimelineMax !== 'undefined') {
			var $clonedList = $list.clone();
			var listWidth = 10;
			$list.find('li').each(function(i) {
				listWidth += $(this, i).outerWidth(true);
			});

			$list.add($clonedList).css({
				width: listWidth + 'px'
			});

			$clonedList.addClass('cloned').appendTo($scroll);

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

			$scroll
				.on('mouseenter', function() {
					infinite.pause();
				})
				.on('mouseleave', function() {
					infinite.play();
				});
		}

	});
});
