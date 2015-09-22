/**
 * transfer-out.js
 * @author hzaoyou<hzaoyou@corp.netease.com>
 * @date 20150808
 **/
 define('business/ewallet-transfer-out/0.0.1/transfer-out.js',['jQuery'],
 function(require, exports, module){
    var $ = require('jQuery');
    var TransferOut = {
        init: function(node){
            this.$node = $('div.trasfer-out-content');
            this.config = this.$node.data('modConfig');
            this.isSmsGetting = false;      //验证码获取中或者获取的验证码未失效
            this.hasValidSmsCode = false;   //有个有效的验证码
            this.$getBtn = $('a.code-get',this.$node);
            
            //金额校验正则表达式
            this.reg = /^(0|[1-9]\d{0,7})(\.\d{0,2})?$/;
            this.regMessage = /^\d{6}$/;
            
            //所有函数作用的变量决定不同情况下定义不同值决定ajax是否提交
            this.amountJudge = true;
            this.timeJudge = true;
            this.zeroRedeem = true;
            this.formatJudge = true;
            
            //输入框不合法回退
            this.formTempData = {};
            this.mod = node;
            this.$input = $('input.out-amount', node);


            this._trainOutAmount();
            this._getSmsCodehandler();
            this._selectModel();
            this._validate();
            this._messageFocus();
            this._bindKeyupEvent();
            this._focusReset();
            this._amountFormat();
        },
        


         //赎回模式选择，不同的点击实现不同的交互，其中有赎回模式次数为0的情况
        _selectModel: function(){
            var that = this;
            $('p.ordinary-arrival').show();

            //点击普通赎回的事件交互
            $('#js-ordinary',this.$node).on('click', function(e){
                e.stopPropagation();
                that.zeroRedeem = true;
                $('#js-ordinary-select',this.$node).prop('checked', true);
                $(this).removeClass('check-select');
                $('#js-fast',this.$node).addClass('check-select');
                $('p.ordinary-arrival',this.$node).show();
                $('p.fast-arrival',this.$node).hide();
                $('dd.arrival-time',this.$node).text(that.config.transferDate);
                

                //快速赎回的时候，赎回次数为0，在获取验证码后点击普通赎回样式变为可点
                if(that.isSmsGetting || that.config.flag === 'N'){
                    $('dl.submit',this.$node).removeClass('disabled');
                }
                var redeemMode = $('input[name=odinary]:checked',this.$node).val();
                if(redeemMode === '1'){
                    $('dd.allow-count',this.$node).html('本次可提取金额：<em class="value">' + that.config.redeemAmount +'</em>元');
                    that.amountJudge = true;
                }
            });
            
            //点击快速赎回的时间交互
            $('#js-fast').on('click', function(e){
                var amount = $('input.out-amount',this.$node).val();
                e.stopPropagation();
                that.zeroRedeem = false;
                $('#js-fast-select',this.$node).prop('checked', true);
                $(this,this.$node).removeClass('check-select');
                $('#js-ordinary',this.$node).addClass('check-select');
                $('p.fast-arrival',this.$node).show();
                $('p.ordinary-arrival',this.$node).hide();
                $('dd.arrival-time',this.$node).text('预计两小时内到账');
                

                var redeemMode = $('input[name=odinary]:checked').val();
                //快速赎回模式下如果用户输入大于10000，提示最多能提取10000并拦截
                if(redeemMode === '0' && (amount * 1 > 10000)){
                    $('dd.allow-count').html('快速赎回下您最多可以转出<em class="value">10000</em>元');
                    that.amountJudge = false;
                }
                else if(redeemMode === '0' && that.config.flag === 'N'){
                    $('p.fast-arrival').text('今日快速赎回额度已用完，请选择普通赎回');
                     $('dd.allow-count').html('<em class="value">请选择普通赎回</em>');
                    that.amountJudge= false;
                } 
                else if(redeemMode === '0' && that.config.redeemTimes === '0'){
                    $('dd.allow-count').html('快速赎回下您当日的提取次数已<em class="value">用尽</em>');
                    that.amountJudge = false;
                }
                else{
                    $('dd.allow-count').html('快速赎回下您最多还可以提取<em class="value">' + that.config.redeemTimes +'</em>次');
                }


                if(redeemMode === '0' && that.config.redeemTimes === '0'){
                    $('#js-submit',this.$node).addClass('disabled');
                }
                if (redeemMode === '0' && that.config.flag === 'N') {
                    $('#js-submit',this.$node).addClass('disabled');
                }
            });
        },

        //如果输入的时候不符合简单的正则，输入无效,自动回退;
        _bindKeyupEvent:function(){
            var that = this;

            this.$input.each(function(index){
                var elm = $(this),
                    val = elm.val(),
                    name = elm.data('formConfig').postName;

                that.formTempData[name] = val;
            });

            $('input.out-amount').on('keyup',function(){
                var elm = $(this),
                    name = elm.data('formConfig').postName,
                    val = elm.val();

                if (val) {
                    if (that.reg.test(val)) {
                        that.formTempData[name] = val;
                    } else {
                        elm.val(that.formTempData[name]);
                    }
                } else {
                    that.formTempData[name] = '';
                }
            });
        },


        //输入框金额的校验,keyup进行事件交互
        _validate:function(){
            var that=this;
            $('input.out-amount').on('keyup',function(e){
                e.preventDefault();
                var amount = $('input.out-amount').val();
                var redeemMode = $('input[name=odinary]:checked').val();              

                //用户首先输入的数字限额大于余额，拦截，快速赎回模式下如果输入大于10000，提示最多能提取10000并拦截
                if(amount*1 > that.config.redeemAmount){
                    that._validateChange('<em class="value">超出金额限额</em>',false);
                } else if(redeemMode === '0' && (amount * 1 > 10000)){
                    that._validateChange('快速赎回下您最多可以转出<em class="value">10000</em>元',false);
                } else if(redeemMode === '0' && that.config.redeemTimes === '0'){
                    that._validateChange('快速赎回下您当日的提取次数已<em class="value">用尽</em>',false);
                } else if(redeemMode === '0'){
                    that._validateChange('快速赎回下您最多还可以提取<em class="value">' + that.config.redeemTimes +'</em>次',true);
                } else{
                    that._validateChange('本次可提取金额：<em class="value">' + that.config.redeemAmount +'</em>元',true);
                }
            });
        },

        _validateChange:function(content,judge){
            var $outAmount = $('input.out-amount',this.$node),
                $allowCount = $('dd.allow-count',this.$node),
                that = this;
            if(!judge){
                $allowCount.html(content);
                $outAmount.addClass("error-border");
                $outAmount.removeClass("normal-border");
                that.amountJudge = false;
            } else{
                $allowCount.html(content);
                $outAmount.removeClass("error-border");
                $outAmount.addClass("normal-border");
                that.amountJudge = true;
            }
        },

        //短信输入框获得焦点之后提示隐藏，边框变为灰色
        _focusReset:function(){
        $('input.out-amount',this.$node).on('focus',function(){
            $('p.format-check',this.$node).text("");
            $('input.out-amount',this.$node).removeClass("error-border");
            $('input.out-amount',this.$node).addClass("normal-border");
          });
        },


        /**
         * 发送短信验证码请求
         * @return {[type]} [description]
         */
        _getSmsCodehandler: function(){
            var that = this;
            var redeemMode = $('input[name=odinary]:checked',this.$node).val();
            $('.code-get',this.$node).on('click',function(e){
                if (that.isSmsGetting) {
                    return;
                }
                if(!that.zeroRedeem && that.config.redeemTimes === '0'){
                    return;
                }
                if(!that.zeroRedeem && that.config.flag === 'N'){
                    return;
                }

                //点击获取验证码之后显示用户的手机号
                $('div.phone-number',this.$node).show();
                $('a.non-message',this.$node).show();

                //点击获取短信请求接口
                $('#js-submit',this.$node).removeClass('disabled');
                that.$getBtn.html('请求发送中').addClass('loading');
                that.isSmsGetting = true;
                $.ajax({
                    url: that.config.messageUrl,
                    method: 'post',
                    dataType: 'json'
                })
                .done($.proxy(that, '_setSmsGetBtnSuccess'))
                .fail($.proxy(that, '_setSmsGetBtnFail'));
                $('.message-place').focus();
            });
        },

        /**
         * 发送短信验证码成功后
         * @param {[type]} data [description]
         */
         _setSmsGetBtnSuccess: function(o){
            var time = 60;
            var interval;
            var that = this;
            o = typeof o === 'string' ? $.parseJSON(o) : o;
      
            if(o.success){
                hasValidSmsCode = true;
                interval = setInterval(function() {
                    if (time > 1) {
                        time -= 1;
                        that.$getBtn.html(time + '秒后重新获取');
                        $('a.code-get',this.$node).addClass('message-sended');
                        $('a.code-get',this.$node).removeClass('message-get');
                        return;
                    } else {
                        hasValidSmsCode = false;
                        clearInterval(interval);
                        that._resetSms();
                        $('a.code-get',this.$node).removeClass('message-sended');
                        $('a.code-get',this.$node).addClass('message-get');
                    }
                }, 1000);
            }else{
                this._setSmsGetBtnFail();
            }
        },

        /**
         * 发送短信验证码失败
         */
        _setSmsGetBtnFail: function(){
            $('.j-sms-err',this.$node).text('网络繁忙，请稍候再试');
            this._resetSms();
        },

        /**
         * 重置短信验证码
         * @return {[type]} [description]
         */
        _resetSms: function(){
            var that = this;
            that.$getBtn.html('获取验证码').removeClass('loading');
            that.isSmsGetting = false;
        },

        //输入框失去焦点两位小数结尾
        _amountFormat: function(){
            var that = this;
            $('input.out-amount',this.$node).on('blur',function(){
               var amount = $('input.out-amount',this.$node).val();
               if (!amount) {
                    $('p.format-check',this.$node).text("输入金额不能为空");
                    $('input.out-amount',this.$node).addClass("error-border");
                    $('input.out-amount',this.$node).removeClass("normal-border");
                    that.formatJudge = false;
               }    
               else if(amount <= 0){
                  $('p.format-check',this.$node).text("输入金额不能为零");
                  $('input.out-amount',this.$node).addClass("error-border");
                  that.formatJudge = false;
               }           
               else {
                    // $('input.out-amount',this.$node).val((amount * 1).toFixed(2));
                    that.formatJudge = true;
               }
            })
        },

        //点击提交按钮的ajax对接
        _trainOutAmount: function(){
            var that = this;
            $('#js-submit',this.$node).on('click', function(e){
                e.preventDefault();
                var messageCode = $('input.message-place',this.$node).val();
                if ($('#js-submit',this.$node).hasClass('disabled')) {
                    return;
                }                
                if(!that.formatJudge || !that.amountJudge){
                    return false;
                }
                //短信验证码校验先做六位数字校验再post

                if(!that.regMessage.test(messageCode)){
                    $('p.j-sms-err').show();
                    $('p.j-sms-err').text('请输入六位数字');
                    return;
                }
                var authCode = $('.message-place',this.$node).val();
                var amount = $('input.out-amount',this.$node).val();
                var redeemMode = $('input[name=odinary]:checked',this.$node).val();
                $.ajax({
                    method: 'POST',
                    url: that.config.submitUrl,
                    data: { 
                        'amount': amount,
                        'redeemMode': redeemMode,
                        'parentOrderId':that.config.parentOrderId,
                        'authCode': authCode,
                        'csrf_token':that.config.csrf_token
                    }
                })
                .done($.proxy(that, '_successCallback'))
                .fail($.proxy(that, '_failCallback'));
            });
        },

        _successCallback: function(o){
            o = typeof o === 'string' ? $.parseJSON(o) : o;

            var postUrl = o.attach.postUrl;
            var errMsg = o.errorMsg;

            if (o.success){
               window.location.href = postUrl;
            }else if(o.result === 'fail'){
               window.location.href = postUrl;
            }else if(o.result === 'error'){
               $('p.j-sms-err',this.$node).show();
               $('p.j-sms-err',this.$node).text(errMsg);
               if(!errMsg){
                $('p.error-msg',this.$node).text('网络繁忙，请稍后再试');
               }
            }
        },

        _failCallback: function(){
            $('p.error-msg',this.$node).text('网络繁忙，请稍后再试');
        },
       
        //短信验证码输入框重新得到焦点提示隐藏
        _messageFocus: function(){
            $('input.message-place').on('focus',function(){
               $('.j-sms-err',this.$node).hide();
            });
        },

    };


    TransferOut.init();
});
