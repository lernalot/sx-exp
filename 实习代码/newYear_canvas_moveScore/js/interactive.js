$(function() {
	var gameinter = {
		init : function() {
			this._startGame();
			this._helpAdd();
			this._judgeAward();
		},

		_startGame : function() {
			$('li.gamecontrol').on('click', function() {
						$('#gamerule').show();
					});
			$('div.tiphelp').on('click', function() {
						$('#gamerule').hide();
					});
			$('li.supaward').on('click', function() {
						$('div.award-list').show();
					});
			$('div.award-list').on('click', function() {
						$('div.award-list').hide();
					});

			$('#guidePanel ul li').on('touchstart', function() {
						$(this).css('opacity', '0.6');
					});
			$('#guidePanel ul li').on('touchend', function() {
						$(this).css('opacity', '1');
					});

			$('ul.selclist li').on('touchstart', function() {
						$(this).css('opacity', '0.6');
					});
			$('ul.selclist li').on('touchend', function() {
						$(this).css('opacity', '1');
					});

			$('div.edit-area li').on('touchstart', function() {
						$(this).css('opacity', '0.6');
					});
			$('div.edit-area').on('touchend', function() {
						$(this).css('opacity', '1');
					});

			$('li.want-again').on('touchstart', function() {
						$('div.help-add').hide();
					});
		},

		_helpAdd : function() {
			$('#closetab').on('touchstart', function() {
						$('div.help-add').hide();
					});
			$('li.help-nor').on('touchstart', function() {
						var obj = $(this);
						if (obj.hasClass("helped"))
							return;
						var wxId = $("#wxId").val();
						HYB.request({
									url : "/game/addPlayTimes/2/" + wxId,
									data : "",
									callFunc : function(data) {
										$('div.helpednote').show();
										$('div.help-add').hide();
									}
								});

					});
			$('div.helpednote').on('touchstart', function() {
						$('div.helpednote').hide();
					});

		},
		
		_judgeAward:function(){
			var awardName = $('#award').val();
			//console.log(awardName);
			if(awardName == '1000元体验金' || awardName == '未中奖'){
				$('div.tilpic').css('background-image','url(/templates/game/newYear/img/tiyan.png)')
			}
			if(awardName == '10元满减券' || awardName == '50元满减券' || awardName == '100元满减券'){
				$('div.tilpic').css('background-image','url(/templates/game/newYear/img/manjian.png)')
			}
			if(awardName == '20元京东卡' || awardName == '50元京东卡'){
				$('div.tilpic').css('background-image','url(/templates/game/newYear/img/jingdong.png)')
			}
			if(awardName == '1%加息券' || awardName == '2%加息券'){
				$('div.tilpic').css('background-image','url(/templates/game/newYear/img/jiaxi.png)')
			}
		},

	};

	// 结束页面滚动
	$.fn.myScroll = function(options) {
		// 默认配置
		var defaults = {
			speed : 40, // 滚动速度,值越大速度越慢
			rowHeight : 24
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
	gameinter.init();
});