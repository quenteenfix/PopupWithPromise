define(function(require, exports, module) {
    var tpl = '<style>.survey-confirm{font-family:微软雅黑;border:1px solid #dbdbdb;position:fixed;left:50%;top:40%;width:260px;height:140px;margin-left:-130px;background:#fff;z-index:1003}.survey-confirm-title{height:40px;line-height:40px;padding-left:16px;background:#f1f5fd;border-bottom:1px solid #b0c0e7;color:#2c4a93}.survey-confirm-content{height:40px;padding:10px;color:#333}.survey-confirm-button{text-align:center;height:20px;line-height:20px}.survey-mask{position:fixed;height:100%;width:100%;background:#aaa;z-index:1002;top:0;left:0;opacity:.5;filter:alpha(opacity:50)}.button{height:28x;line-height:18px;border-radius:3px;background:#f1f5fd;border:1px solid #b0c0e7;color:#2c4a93}</style><div class="sample-pop"><div class="survey-confirm"><div class="survey-confirm-title">Notice</div><div class="survey-confirm-content"></div><div class="survey-confirm-button"><input type="button" class="button  button-strong" id="survey-confirm-y" value="Confirm">&nbsp;&nbsp;&nbsp;<input type="button" class="button" id="survey-confirm-n" value="Cancel"></div></div><div class="survey-mask"></div></div>';

    var popup_arr = [];
    popup_arr.push('<div class="popup-wrapper">');
    popup_arr.push('<div class="popup-mask"></div>');
    popup_arr.push('<div class="popup">');
    popup_arr.push('<div class="popup-title">');
    popup_arr.push('<div id="popup_title"></div>');
    popup_arr.push('<a class="close" href="javascript:;">×</a>');
    popup_arr.push('</div>');
    popup_arr.push('<div class="popup-content">');
    popup_arr.push('<div class="popup-notice" id="popup_notice"></div>');
    popup_arr.push('<div id="popup_button"></div>');
    popup_arr.push('</div>');
    popup_arr.push('</div>');
    popup_arr.push('</div>');
    var popup_html = popup_arr.join('');

    var popup_button_arr = [];
    popup_button_arr.push('<input type="button" id="popup_confirm" value="确认" class="popup-button w50"/>');
    popup_button_arr.push('<input type="button" id="popup_cancel" value="取消" class="popup-button w50"/>');
    var popup_button = popup_button_arr.join('');

    /**
     * config => { content: '', }
     */
    function showOnce() {
        var config = {
            title: '',
            notice : '',
            button : popup_button,
            height : 360,
            width : 260,
            top : 50,
            is_bg_close : false,// 是否点击浮层后关闭弹出框：true-关闭 false-不关闭
            is_border : false,// 是否有边框
            callback: {}
        };

        if (typeof (arguments[0]) == 'object') {
            var base_config = arguments[0];
            for ( var key in base_config) {
                config[key] = base_config[key];
            }
        }

        $('body').append(popup_html);

        var defer = $.Deferred();
        var data_op;// 按钮的op属性，提供变量用于在前端进行操作的判断

        var pop = $('.popup-wrapper');
        set(pop, config);

        if (config['is_bg_close']) {
            pop.on('click', '.popup-mask', function() {
                defer.reject();
            });
        }

        pop.on('click', '#popup_confirm', function() {
            var me = $(this);
            data_op = me.data('op');
            // console.log(defer.state());

            // 重复点击时，因为defer对象已经是完成的状态，由于promise的不可逆性，所以外层的then不会再次触发
            defer.resolve(); // 将deferred对象的执行状态修改为已完成
        });

        pop.on('click', '#popup_cancel', function() {
            var me = $(this);
            data_op = me.data('op');

            defer.reject(); // 将deferred对象的执行状态修改为失败
        });

        pop.on('click', '.close', function(event) {
            defer.reject();
        });

        var close = function(){
            var pop = $('.popup-wrapper');
            pop.fadeOut(300, function(){
                pop.remove();
            });
        }

        // 保证职责的单一性，只做应该做的事情，其它的控制交给外围的逻辑去管理

        return {
            data_op: data_op,// 操作的标识字符串
            close: close,// 关闭弹窗的函数
            defer: defer.promise()// promise对象，可扩展
        };
    }

    /**
     * config => { rank: 1, content: '', }
     */
    function showMore() {
        var config = {
            rank: 1,
            title: '',
            notice : '',
            button : popup_button,
            height : 360,
            width : 260,
            top : 50,
            is_bg_close : false,// 是否点击浮层后关闭弹出框：true-关闭 false-不关闭
            is_border : false,// 是否有边框
            confirm_fn: {},
            cancel_fn: {},
            callback: {}
        };

        if (typeof (arguments[0]) == 'object') {
            var base_config = arguments[0];
            for ( var key in base_config) {
                config[key] = base_config[key];
            }
        }

        $('body').append(popup_html);

        var pop_arr = $('.popup-wrapper');

        var data_op;// 按钮的op属性，提供变量用于在前端进行操作的判断

        if (typeof (arguments[0]) == 'object') {
            var base_config = arguments[0];
            for ( var key in base_config) {
                config[key] = base_config[key];
            }
        }

        var rank = config['rank'];

        var pop;
        pop_arr.each(function(item){
            var target = $(pop_arr[item]);
            if(!(parseInt(target.attr('data-rank'), 10) > 0)){
                pop = target;
            }
        });

        set(pop, config, 'more');

        if (config['is_bg_close']) {
            pop.on('click', '.popup-mask', function() {
                close();
            });
        }

        // 支持callback
        pop.on('click', '#popup_confirm', function() {
            var me = $(this);
            data_op = me.data('op');

            var fn = config['confirm_fn'];
            if(typeof fn === 'function'){
                fn();
            }else{
                close();
            }
        });

        // 支持自定义点击按钮的事件函数
        pop.on('click', '#popup_cancel', function() {
            var me = $(this);
            data_op = me.data('op');

            var fn = config['cancel_fn'];
            if(typeof fn === 'function'){
                fn();
            }else{
                close();
            }
        });

        pop.on('click', '.close', function(event) {
            close();
        });

        var close = function(){
            var pop = $('.popup-wrapper[data-rank="' + rank + '"]');
            pop.fadeOut(300, function(){
                pop.remove();
            });
        }

        // 保证职责的单一性，只做应该做的事情，其它的控制交给外围的逻辑去管理

        // 支持多个弹窗同时弹出 - 即同时有多个弹窗在一个页面上呈现，然后逐个的关掉
        return {
            data_op: data_op,// 操作的标识字符串
            rank: rank,// 第几层的弹窗
            close: close,// 关闭弹窗的函数
        };
    }

    function set(pop, config){
        pop.find('#popup_title').html(config['title']);
        pop.find('#popup_notice').html(config['notice']);
        pop.find('#popup_button').html(config['button']);

        var top = config['top'];
        var height = config['height'];
        var width = config['width'];
        var margin_left = 0 - (width / 2) - 5;

        pop.find('.popup').css({
            'height' : height + 10,
            'width' : width + 10,
            'margin-left' : margin_left,
            'top' : top
        });

        if (config['is_border']) {
            pop.find('.popup').css('border', '3px solid #dbdbdb');
        }

        if(arguments[2] == 'more'){
            var rank = config['rank'];
            pop.attr('data-rank', rank);
            pop.find('#popup_confirm').attr('data-rank', rank);
            pop.find('#popup_cancel').attr('data-rank', rank);
        }

        return pop;
    }

    module.exports = {
        showOnce: showOnce,
        showMore: showMore
    };
});