# PopupWithPromise
基于seajs和promise的弹窗（兼容单个和多个 模式）

基本调用方式为：

                          $('.popup-a').click(function() {
                            seajs.use('popup/PopupUtil', function(popup_util) {
                                var config = {
                                    title : '1',
                                    notice : '1',
                                    height : 360,
                                };
                                var popup_instance = popup_util.showOnce(config);

                                var data_op = popup_instance.data_op;

                                popup_instance.defer.done(function() {
                                    /*
                                    seajs.use('popup/PopupUtil', function(popup_util) {
                                        var config = {
                                            content : '2'
                                        };
                                        var popup_instance = popup_util.showOnce(config);
                                        alert('close confirm');
                                        popup_instance.close();
                                    });
                                    */
                                    alert('一次弹窗，点击确认');
                                    popup_instance.close();
                                }).fail(function() {
                                    alert('一次弹窗，点击取消');
                                    popup_instance.close();
                                });
                            });
                        });
                        
                        or
                        
                        $('.popup-b').click(function() {
                            seajs.use('popup/PopupUtil', function(popup_util) {
                                var confirm_fn = function(){
                                    seajs.use('popup/PopupUtil', function(popup_util) {
                                        var config_two = {
                                            rank : 2,
                                            title : '2',
                                            notice : '2',
                                            height : 160,
                                        };
                                        //var popup_instance = popup_util.showOnce(config_two);
                                        var popup_instance = popup_util.showMore(config_two);
                                    });
                                };

                                var cancel_fn = function(){
                                    popup_instance.close();
                                };

                                var config_one = {
                                    rank : 1,
                                    title : '1',
                                    notice : '1',
                                    confirm_fn: confirm_fn,
                                    cancel_fn: cancel_fn
                                };

                                var popup_instance = popup_util.showMore(config_one);

                                var data_op = popup_instance.data_op;
                            });
                        });
                        
  config配置为：
        var config = {
            title: '',
            notice : '',
            button : popup_button,
            height : 360,
            width : 260,
            top : 50,
            is_bg_close : false,// 是否点击浮层后关闭弹出框：true-关闭 false-不关闭
            is_border : false,// 是否有边框
            callback: {}//回调函数
        };
