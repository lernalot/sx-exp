$(function() {
	var exchangeSuceess = false;
	var awardNum = 0;
	var rewardName = "";
	var rewardType = 6;
	var rewardStockNum = 0;
	var lottery = {
		index : -1, // 当前转动到哪个位置，起点位置
		count : 0, // 总共有多少个位置
		timer : 0, // setTimeout的ID，用clearTimeout清除
		speed : 20, // 初始转动速度
		times : 0, // 转动次数
		cycle : 60, // 转动基本次数：即至少需要转动多少次再进入抽奖环节
		prize : -1, // 中奖位置
		init : function(id) {
			if ($("#" + id).find(".lottery-unit").length > 0) {
				$lottery = $("#" + id);
				$units = $lottery.find(".lottery-unit");
				this.obj = $lottery;
				this.count = $units.length;
				$lottery.find(".lottery-unit-" + this.index).addClass("active");
			};
		},
		roll : function() {
			var index = this.index;
			var count = this.count;
			var lottery = this.obj;
			var newstate = index + 1;
			var serial = Math.random() * 10;
			var serialNum = parseInt(serial);
			// console.log(serialNum);
			$(lottery).find(".lottery-unit-" + index)
					.html('<img class="syemasj unit-' + index
							+ '" src="/templates/game/comeback/images/back'
							+ serialNum + '.png">');

			// insert == '<img src="/templates/game/comeback/images/' + newstate
			// + '.png">';
			// console.log(index);

			$(lottery).find(".lottery-unit-" + index).removeClass("active");
			index += 1;
			if (index > count - 1) {
				index = 0;
			};
			$(lottery).find(".lottery-unit-" + index).addClass("active");

			this.index = index;
			// $('.syemasj').removeClass('trans');

			return false;
		}
		// stop:function(index){
		// this.prize=index;
		// return false;
		// }
	};

	$.fn.myScroll = function(options) {
		// 默认配置
		var defaults = {
			speed : 40, // 滚动速度,值越大速度越慢
			rowHeight : 30
			// 每行的高度
		};

		var opts = $.extend({}, defaults, options), intId = [];

		function marquee(obj, step) {

			obj.find("ul").animate({
						marginTop : '-=1'
					}, 0, function() {
						var s = Math.abs(parseInt($(this).css("margin-top")));
						if (s >= step) {
							$(this).find("li").slice(0, 1).appendTo($(this));
							$(this).css("margin-top", 0);
						}
					});
		}

		this.each(function(i) {
					var sh = opts["rowHeight"], speed = opts["speed"], _this = $(this);
					intId[i] = setInterval(function() {
								if (_this.find("ul").height() <= _this.height()) {
									clearInterval(intId[i]);
								} else {
									marquee(_this, sh);
								}
							}, speed);

					_this.hover(function() {
								marquee(_this, sh);
							}, function() {
								intId[i] = setInterval(function() {
											if (_this.find("ul").height() <= _this
													.height()) {
												clearInterval(intId[i]);
											} else {
												marquee(_this, sh);
											}
										}, speed);
							});

				});

	}

	function roll() {
		lottery.times += 1;
		lottery.roll();
		if (lottery.times > lottery.cycle + 10
				&& lottery.prize == lottery.index && lottery.speed != 240) {
			clearTimeout(lottery.timer);
			lottery.prize = -1;
			lottery.times = 0;
		} else {
			if (lottery.times < lottery.cycle) {
				lottery.speed -= 10;
			} else if (lottery.times == lottery.cycle) {
				var index = Math.random() * (lottery.count) | 0;
				lottery.prize = index;
			} else {
				if (lottery.times > lottery.cycle + 10
						&& ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index
								+ 1)) {
					lottery.speed += 110;

					var endIndex = lottery.index + 1;
					if (endIndex == 8) {
						endIndex = 0;
					}
					setTimeout(function() {
						$('img.unit-' + endIndex).addClass('endtrans');
						$('td.lottery-unit-' + endIndex)
								.html('<img class="endpic endtrans" src="/templates/game/comeback/images/award'
										+ awardNum + '.png">');// ajax请求到的数字
						$('td.lottery-unit-' + endIndex).addClass('endactive');

						setTimeout(function() {
									click = false;
									if (rewardType == 6) {
										$('#stilltimes').show();
									} else {
										var title = "得到了" + rewardName
										if (rewardType == 3) {
											if (isRegister)
												title = "稍后发送卡号密码至您的手机，请查收";
											else
												title = "您登录后将发送短信至您的手机，请查收";
											$('a.click-get').hide();
											$('.play-wining')
													.addClass('jdtive');
											$('.winbtn').addClass('jdtive');
										}

										$('div.winning .awar-name')
												.text(rewardName);
										$('div.winning .getted').text(title);
										$('div.winning').show();
									}
								}, 1400);
					}, 800);
				} else {
					lottery.speed += 20;
				}
			}
			if (lottery.speed == 240) {
				$('img.unit-' + endIndex).addClass('endtrans');
				$('td.lottery-unit-' + endIndex)
						.html('<img class="endpic endtrans" src="/templates/game/comeback/images/award'
								+ awardNum + '.png">')
			}
			if (lottery.speed < 40) {
				lottery.speed = 40;
			};
			// console.log(lottery.speed);
			// console.log(lottery.times+'^^^^^^'+lottery.speed+'^^^^^^^'+lottery.prize);
			lottery.timer = setTimeout(roll, lottery.speed);
		}
		return false;
	}

	var click = false;

	window.onload = function() {
		lottery.init('lottery');
		// var dushu = $('.syemasj').css('transform');
		// console.log(dushu);

		$("#lottery a").click(function() {

			if (click) {
				return false;
			} else {
				click = true;
				// console.log(serialNum);
				for (i = 0; i < 8; i++) {
					var serial = Math.random() * 10;
					var serialNum = parseInt(serial)
					$('td.lottery-unit-' + i)
							.html('<img class="syemasj" src="/templates/game/comeback/images/back'
									+ serialNum + '.png">');
				}

				$('a.play-wining').removeClass('jdtive');
				$('.winbtn').removeClass('jdtive');
				$('a.click-get').show();
				var degree = $('.embed').html()
				console.log(degree)

				HYB.request({
							url : "/game/end/3",
							data : "",
							callFunc : function(data) {
								if (data != "游戏次数不够") {
									$('.syemasj').addClass('trans');
									var d = data.split(",");
									awardNum = d[0];
									rewardName = d[1];
									rewardType = d[2];
									rewardStockNum = d[3];
									var playTimes = d[4];
									$(".playtimes span").text(playTimes);
									lottery.speed = 100;
									setTimeout(function() {
												roll();
											}, 1000)
								} else {
									click = false;
									if(degree == 0){
										$('a.game-method').click();
									}
								}
							}
						});

				return false;
			}
		});

	};

	// 弹窗交互
	$('span.day-close,a.play-again').on('click', function() {
				$('#stilltimes').hide();
				$('div.raiders').hide();
				$('div.winning').hide();
				$('div.award-list').hide();
				if (exchangeSuceess) {
					window.location.reload();
				}
			});
	$('.H_ShareBtn').on('click', function(obj) {
				$('div.raiders').hide();
				var deviceType = $(this).attr("deviceType");
				// console.log("deviceType:" + deviceType);
				showReward(deviceType);
			});
	$('a.game-method').on('click', function() {
				var scoheight = $(document).scrollTop();
				var scrollHeight = scoheight + 45;
				$('div.raidBox').css({
							'top' : scrollHeight + 'px'
						});
				$('#rideclose').css({
							'top' : scoheight + 'px'
						});
				$('.raiders').show();
			});
	$('a.play-wining').on('click', function() {
				// $('.winning').hide();
				window.location.reload();
			});
	$('a.my-award').on('click', function() {
				$('div.award-list').show();
			});
	$('a.click-get').on('click', function() {
				var t = $(this).text();
				var deviceType = $('#deviceType').val();
				deviceType = deviceType || '3';
				if (deviceType == '1') {
					// andriod
					$('div.winning').hide();
					if (t == "点击查看") {
						if (rewardType == 4) {
							console.log("android toPoints");
							window.webkit.goToShopping();

						} else {
							console.log("android toCoupon");
							window.webkit.goToCoupon();
						}
					} else {
						console.log("andriod login");
						window.webkit.goToLogin('');
					}
					return;
				} else if (deviceType == '2') {
					// ios
					$('div.winning').hide();
					if (t == "点击查看") {
						var empty = '';

						if (rewardType == 4) {
							console.log("ios toPoints");
							window.webkit.messageHandlers.OCWebShopModel
									.postMessage({
												body : empty
											});
						} else {
							console.log("ios toCoupon");
							window.webkit.messageHandlers.OCCouponModel
									.postMessage({
												redirect : empty
											});
						}

					} else {
						console.log("ios login");
						// $(".testApp").html("ios login");
						var empty = '0';
						window.webkit.messageHandlers.OCLoginModel.postMessage(
								{
									body : empty
								});
					}
					return;
				}
				if (t == "点击查看") {
					if (rewardType == 4)
						window.location.href = "/verified/integral";
					else
						window.location.href = "/verified/integralExchange";
				} else {
					window.location.href = "/index";
				}
			});
	$('a.H_ExchagePlayTimes').on('click', function() {
		var obj = $(this);
		if (obj.hasClass("un-status"))
			HYB.request({
						url : "/game/exchangePlayTimes/3/1",
						data : "",
						callFunc : function(data) {
							HYB.addProgress({
										content : '<p>' + data + '</p>'
									});
							if (data == "兑换成功") {
								exchangeSuceess = true;
								var playTimes = parseInt($(".playtimes span")
										.text());
								$(".playtimes span").text(playTimes + 1)
								obj.removeClass("un-status")
										.addClass("score-status").text("已兑换");
							}
						}
					});
	});

		/*
		 * $('.my-award').on('click', function() { window.location.href =
		 * "/verified/integralExchange"; });
		 */
});
