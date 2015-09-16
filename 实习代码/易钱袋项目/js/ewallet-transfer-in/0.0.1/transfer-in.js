/**
 * transfer-in.js
 * @author hzaoyou<hzaoyou@corp.netease.com>
 * @date 20150808
 **/
 define('business/ewallet-transfer-in/0.0.1/transfer-in.js',['jQuery'],
 function(require, exports, module){
    var $ = require('jQuery');
    var TransferIn = {
        init: function(){
            this.$node = $('div.m-ewallet-order');
            this.$input = $('input.in-amount', this.$node);
            this.$issuedate = $('p.issuedate', this.$node);
            this.config = this.$node.data('modConfig');
            this.judge = true;

            this._trainamount();
            this._triggerList();
            this._bindKeyupEvent();
            this._bindBlurEvent();
        },
        

        //银行限额列表显示和隐藏
        _triggerList: function(){
            var $bankLists = $('#js-hide-list'),
                t;

            $('div.banks', this.$node).on('mouseenter', function(){
                t = setTimeout(function(){
                    $bankLists.show();
                }, 300);
            })
            .on('mouseleave', function(){
                clearTimeout(t);
                $bankLists.hide();
            });
        },
        
        //如果输入的时候不符合简单的正则，输入无效,自动回退;
        _bindKeyupEvent: function(){
            var $inputAmount = this.$input,
                tempData = $inputAmount.val(),
                regIn = /^(0|[1-9]\d{0,7})(\.\d{0,2})?$/,
                that = this;

            $inputAmount.on('keyup', function(){
                var elm = $(this),
                    val = elm.val();

                if (val) {
                    if (regIn.test(val)) {
                        tempData = val;
                    } else {
                        elm.val(tempData);
                    }
                } else {
                    tempData = '';
                }
            });
        },

        //转入的金额校验
        _bindBlurEvent: function(){
            var $inputAmount = this.$input,
                $parent = $inputAmount.closest('div.obj-area'),
                $issuedate = this.$issuedate,
                that = this;

            $inputAmount.on('blur', function(e){
                e.preventDefault();

                that._validation($(this).val());
            });

            $inputAmount.on('focus', function(){
                $issuedate.html('预计收益发放日期：' + that.config.earnReleaseDate);
                $parent.removeClass('input-error');
            });
        },

        _validation: function(value){
            var $parent = this.$input.closest('div.obj-area'),
                $issuedate = this.$issuedate,
                reg = /^(0|[1-9]\d{0,7})(\.\d{0,2})?$/;

            if (!value){
                this._setError('转入金额不能为空');
            } else if (value * 1 <= 0){
                this._setError('转入金额不能为零');
            } else if (!reg.test(value)) {
                this._setError('转入金额格式错误');
            } else if (this.config.cardLimit && (value * 1 > this.config.cardLimit)){
                //根据用户特定的个人安全卡对应的银行，限制用户的输入要小于银行的限额
                this._setError('转入金额超过银行限额');
            } else {
                this.$input.val((value * 1).toFixed(2));
                this._resetError();
            }
        },

        _setError: function(str){
            var $parent = this.$input.closest('div.obj-area');

            this.$issuedate.html(str);
            $parent.addClass('input-error');
            
            this.judge = false;
        },

        _resetError: function(){
            var $parent = this.$input.closest('div.obj-area');

            this.$issuedate.html('预计收益发放日期：' + this.config.earnReleaseDate);
            $parent.removeClass('input-error');
            
            this.judge = true;
        },

        _trainamount: function(){
            var that = this;

            $('#js-trinCount', this.$node).on('click', function(e){
                e.preventDefault();
                
                //点击立即转入->金额校验->实名认证->提交数据
                that._validation(that.$input.val());
                if (!that.judge){
                    return;
                }

                //实名认证
                $.ajax({
                    method: 'POST',
                    url: that.config.realNameUrl,
                    data: {
                        'productId': that.config.productTypeId,
                        'productDetailUrl': encodeURIComponent(window.location.href)
                    }
                })
                .done($.proxy(that, '_confirmSuccessCallback'))
                .fail($.proxy(that, '_confirmFailCallback'));
            });
        },
        
        //实名返回成功之后根据result的值判断不同的处理方法
        _confirmSuccessCallback: function(o){
            o = typeof o === 'string' ? $.parseJSON(o) : o;

            var errMsg = o.errorMsg;

            if (o.result === 'success'){
                this._transmitData();
            } else if (o.result === 'fail'){
                window.location.href = o.attach.postUrl;
            } else if (o.result === 'error') {
                this.$issuedate.html('<p class="in-error">'+errMsg+'</p>'); 
            }
        },

        //实名认证接口返回失败
        _confirmFailCallback: function(){
            this.$issuedate.html('<p class="in-error">网络繁忙请稍后再试</p>');
        },

        //通过实名认证成功调用后提交ajax
        _transmitData: function(){
            var that = this;
            var amount = $('#js-hold-amount',this.$node).val();              
                $.ajax({
                    method: 'POST',
                    url: that.config.ewalletPurchaseUrl,
                    data: { 
                        'amount': amount,
                        'fundId': that.config.fundId,
                        'fundCode':that.config.fundCode,
                        'productTypeId':that.config.productTypeId,
                        'csrf_token':that.config.csrf_token
                    }
                })
                .done($.proxy(that, '_successCallback'))
                .fail($.proxy(that, '_failCallback'));
        },

        _successCallback: function(o){
            o = typeof o === 'string' ? $.parseJSON(o) : o;

            var cashierUrl = o.attach.cashierUrl,
                errMsg = o.errorMsg;

            if (o.success){
               window.location.href = cashierUrl;
            } else if (o.result === 'fail'){
               this.$issuedate.html('<p class="in-error">' + errMsg + '</p>');
            }
        },

        _failCallback: function(){
            this.$issuedate.html('<p class="in-error">网络繁忙，请稍后重试！</p>');
        }
    };

    TransferIn.init();
});
