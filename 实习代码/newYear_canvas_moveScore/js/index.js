function Ship(ctx) {
	var posiJudge = window.screen.height;
	console.log(posiJudge);
	gameMonitor.im.loadImage(['/templates/game/newYear/img/monkey.png']);
	this.width = 80;
	this.height = 80;
	this.left = gameMonitor.w / 2 - this.width / 2;
	if (posiJudge < 568) {
		this.top = gameMonitor.h - 2 * this.height - 140;
	} else {
		this.top = gameMonitor.h - 2 * this.height;
	}

	this.player = gameMonitor.im
			.createImage('/templates/game/newYear/img/monkey.png');

	this.paint = function() {
		ctx
				.drawImage(this.player, this.left, this.top, this.width,
						this.height);
	}

	this.setPosition = function(event) {
		if (gameMonitor.isMobile()) {
			var tarL = event.changedTouches[0].clientX;
			var tarT = event.changedTouches[0].clientY;
		} else {
			var tarL = event.offsetX;
			var tarT = event.offsetY;
		}
		this.left = tarL - this.width / 2 - 16;
		this.top = tarT - this.height / 2;
		if (this.left < 0) {
			this.left = 0;
		}
		if (this.left > 320 - this.width) {
			this.left = 320 - this.width;
		}
		if (this.top < 0) {
			this.top = 0;
		}
		if (this.top > gameMonitor.h - this.height) {
			this.top = gameMonitor.h - this.height;
		}
		this.paint();
	}

	this.controll = function() {
		var _this = this;
		var stage = $('#gamepanel');
		var currentX = this.left, currentY = this.top, move = false;
		stage.on(gameMonitor.eventType.start, function(event) {
					_this.setPosition(event);
					move = true;
				}).on(gameMonitor.eventType.end, function() {
					move = false;
				}).on(gameMonitor.eventType.move, function(event) {
					event.preventDefault();
					if (move) {
						_this.setPosition(event);
					}

				});
	}

	this.eat = function(foodlist) {
		for (var i = foodlist.length - 1; i >= 0; i--) {
			var f = foodlist[i];
			if (f) {
				var l1 = this.top + this.height / 2 - (f.top + f.height / 2);
				var l2 = this.left + this.width / 2 - (f.left + f.width / 2);
				var l3 = Math.sqrt(l1 * l1 + l2 * l2);
				if (l3 <= this.height / 2 + f.height / 2) {
					foodlist[f.id] = null;
					if (f.type == 0) {
						gameMonitor.stop();
						var x = document.getElementById("myAudio"); 
						x.pause();
						$('#resultPanel').show();
						gameMonitor.getScore();
					} else if (f.type == 1) {
						$('#score').text(gameMonitor.score += 10);
						$('.heart').removeClass('hearthot')
								.addClass('hearthot');
						setTimeout(function() {
									$('.heart').removeClass('hearthot')
								}, 200);
					} else if (f.type == 2) {
						$('#score').text(gameMonitor.score += 50);
						$('.heart').removeClass('hearthot')
								.addClass('hearthot');
						setTimeout(function() {
									$('.heart').removeClass('hearthot')
								}, 200);
					} else if (f.type == 3) {
						$('#score').text(gameMonitor.score += 100);
						$('.heart').removeClass('hearthot')
								.addClass('hearthot');
						setTimeout(function() {
									$('.heart').removeClass('hearthot')
								}, 200);
					}
				}
			}

		}
	}
}

function Food(type, left, id) {
	this.speedUpTime = 300;
	this.id = id;
	this.type = type;
	this.width = 50;
	this.height = 50;
	this.left = left;
	this.top = -50;
	this.speed = 0.04
			* Math.pow(1.2, Math.floor(gameMonitor.time / this.speedUpTime));
	this.loop = 0;

	var p;
	if (this.type == 0) {
		p = '/templates/game/newYear/img/boom.png';
	} else if (this.type == 1) {
		p = '/templates/game/newYear/img/peach.png';
	} else if (this.type == 2) {
		p = '/templates/game/newYear/img/gold.png';
	} else if (this.type == 3) {
		p = '/templates/game/newYear/img/hongbao.png';
	}
	this.pic = gameMonitor.im.createImage(p);
}
Food.prototype.paint = function(ctx) {
	ctx.drawImage(this.pic, this.left, this.top, this.width, this.height);
}
Food.prototype.move = function(ctx) {
	if (gameMonitor.time % this.speedUpTime == 0) {
		this.speed *= 1.2;
	}
	this.top += ++this.loop * this.speed;
	if (this.top > gameMonitor.h) {
		gameMonitor.foodList[this.id] = null;
	} else {
		this.paint(ctx);
	}
}

function ImageMonitor() {
	var imgArray = [];
	return {
		createImage : function(src) {
			return typeof imgArray[src] != 'undefined'
					? imgArray[src]
					: (imgArray[src] = new Image(), imgArray[src].src = src, imgArray[src])
		},
		loadImage : function(arr, callback) {
			for (var i = 0, l = arr.length; i < l; i++) {
				var img = arr[i];
				imgArray[img] = new Image();
				imgArray[img].onload = function() {
					if (i == l - 1 && typeof callback == 'function') {
						callback();
					}
				}
				imgArray[img].src = img
			}
		}
	}
}

var countdown = $('#dd').text() * 1;
var gameMonitor = {
	w : 320,
	h : 568,
	bgWidth : 320,
	bgHeight : 1126,
	time : 0,
	timmer : null,
	bgSpeed : 2,
	bgloop : 0,
	score : 0,
	im : new ImageMonitor(),
	foodList : [],
	bgDistance : 0,// 背景位置
	eventType : {
		start : 'touchstart',
		move : 'touchmove',
		end : 'touchend'
	},

	init : function() {
		var _this = this;
		var canvas = document.getElementById('stage');
		var ctx = canvas.getContext('2d');

		// 绘制背景
		var bg = new Image();
		_this.bg = bg;
		bg.onload = function() {
			ctx.drawImage(bg, 0, 0, _this.bgWidth, _this.bgHeight);
		}
		bg.src = '/templates/game/newYear/img/bg.jpg';

		_this.initListener(ctx);

		_this.helpClick();

		this.timeup = 0;

	},

	initListener : function(ctx) {
		var _this = this;
		var body = $(document.body);
		$(document).on(gameMonitor.eventType.move, function(event) {
					event.preventDefault();
				});
		body.on(gameMonitor.eventType.start, '.replay, .playagain', function() {
					_this.startPlay(true);
				});

		body.on(gameMonitor.eventType.start, '#frontpage', function() {
					$('#frontpage').css('left', '-100%');
				});

		body.on(gameMonitor.eventType.start, '#getStartTime', function() {
					_this.startPlay(false);
				});

		body.on(gameMonitor.eventType.start, '.share', function() {
					$('.weixin-share').show().on(gameMonitor.eventType.start,
							function() {
								$(this).hide();
							});
				});
	},

	settime : function() {
		var canvas = document.getElementById('stage');
		var ctx = canvas.getContext('2d');
		console.log(countdown);
		var _this = this;

		if (countdown == 0) {
			$('div.increase-time').hide();
			$('#gamepanel').show();
			var x = document.getElementById("myAudio"); 
			x.play();
			_this.ship = new Ship(ctx);
			_this.ship.paint();
			_this.ship.controll();
			_this.run(ctx);
			return;
		} else {
			countdown--;
			$('#dd').text(countdown);
		}
		if (countdown == 0) {
			$('#dd').text('GO!');
		}
		setTimeout(function() {
					_this.settime()
				}, 1000)
	},

	startPlay : function(isRestart) {
		var _this = this;
		HYB.request({
					url : "/game/start/2",
					data : "",
					callFunc : function(playTimes) {
						playTimes = parseInt(playTimes);// 1;//
						if (playTimes > 0) {
							var canvas = document.getElementById('stage');
							var ctx = canvas.getContext('2d');
							if (isRestart) {
								$('#resultPanel').hide();
								_this.settime();
							} else {
								$('#guidePanel').hide();
								// 画界面前 一个三秒倒计时，页面3秒褪去
								$('div.increase-time').show();
								_this.settime();
							}
						} else {
							$('#stilltimes').show();
							/*
							 * $('#getStartTime').on('click',function(){
							 * $('#stilltimes').addClass('tipshow'); });
							 */

							/*
							 * new TipBox({ str :
							 * "您没有游戏次数了，可以通过点击“邀请好友”按钮分享到朋友圈叫朋友帮忙加次数", btnCount :
							 * 1, btnText : "点击邀请", callBack : function() {
							 * closeReward(1); } });
							 */
						}
					}
				});
	},

	helpClick : function() {
		$('#stilltimes').on('touchstart', function() {
					$('#stilltimes').hide();
				});
	},
	rollBg : function(ctx) {
		if (this.bgDistance >= this.bgHeight) {
			this.bgloop = 0;
		}
		this.bgDistance = ++this.bgloop * this.bgSpeed;
		ctx.drawImage(this.bg, 0, this.bgDistance - this.bgHeight,
				this.bgWidth, this.bgHeight);
		ctx.drawImage(this.bg, 0, this.bgDistance, this.bgWidth, this.bgHeight);
	},
	run : function(ctx) {
		var _this = gameMonitor;
		ctx.clearRect(0, 0, _this.bgWidth, _this.bgHeight);
		_this.rollBg(ctx);

		// 绘制飞船
		_this.ship.paint();
		_this.ship.eat(_this.foodList);

		// 产生月饼
		_this.genorateFood();

		// 绘制月饼
		for (i = _this.foodList.length - 1; i >= 0; i--) {
			var f = _this.foodList[i];
			if (f) {
				f.paint(ctx);
				f.move(ctx);
			}

		}
		_this.timmer = setTimeout(function() {
					gameMonitor.run(ctx);
				}, Math.round(1000 / 60));

		_this.time++;
	},
	stop : function() {
		var _this = this
		$('#stage').off(gameMonitor.eventType.start + ' '
				+ gameMonitor.eventType.move);
		setTimeout(function() {
					clearTimeout(_this.timmer);
				}, 0);

	},
	genorateFood : function() {
		var genRate = 50; // 产生月饼的频率
		var random = Math.random();
		if (random * genRate > genRate - 1) {
			var left = Math.random() * (this.w - 50);// 月饼随机出现的横坐标
			// var type = Math.floor(left)%2 == 0 ? 0 : 1;
			var scoreTp = Math.floor(left);
			var type = scoreTp % 2;
			if (scoreTp % 5 == 0) {
				type = 3;
			} else if (scoreTp % 4 == 0) {
				type = 2;
			} else if (scoreTp % 3 == 0) {
				type = 0;
			} else if (scoreTp % 1 == 0) {
				type = 1;
			}
			var id = this.foodList.length;
			var f = new Food(type, left, id);
			this.foodList.push(f);
		}
	},
	reset : function() {
		this.foodList = [];
		this.bgloop = 0;
		this.score = 0;
		this.timmer = null;
		this.time = 0;
		$('#score').text(this.score);
	},
	getScore : function() {
		var time = Math.floor(this.time / 60);
		var score = this.score;
		HYB.request({
					url : "/game/end/2",
					data : "score=" + score,
					callFunc : function(data) {
						window.location.href = "/game/result/2?rewardName="
								+ encodeURI(encodeURI(data)) + "&score=" + score;
					}
				});
	},
	isMobile : function() {
		var sUserAgent = navigator.userAgent.toLowerCase(), bIsIpad = sUserAgent
				.match(/ipad/i) == "ipad", bIsIphoneOs = sUserAgent
				.match(/iphone os/i) == "iphone os", bIsMidp = sUserAgent
				.match(/midp/i) == "midp", bIsUc7 = sUserAgent
				.match(/rv:1.2.3.4/i) == "rv:1.2.3.4", bIsUc = sUserAgent
				.match(/ucweb/i) == "ucweb", bIsAndroid = sUserAgent
				.match(/android/i) == "android", bIsCE = sUserAgent
				.match(/windows ce/i) == "windows ce", bIsWM = sUserAgent
				.match(/windows mobile/i) == "windows mobile", bIsWebview = sUserAgent
				.match(/webview/i) == "webview";
		return (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc
				|| bIsAndroid || bIsCE || bIsWM);
	}
}
if (!gameMonitor.isMobile()) {
	gameMonitor.eventType.start = 'mousedown';
	gameMonitor.eventType.move = 'mousemove';
	gameMonitor.eventType.end = 'mouseup';
}

gameMonitor.init();
