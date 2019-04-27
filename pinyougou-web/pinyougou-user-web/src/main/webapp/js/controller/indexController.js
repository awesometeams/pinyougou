/** 定义控制器层 */
app.controller('indexController', function ($scope, $controller, $interval,baseService) {

    // 品牌控制器继承基础控制器
    // 第一个$scope为 baseController
    // 第二个$scope为 brandController
    $controller('baseController', {$scope:$scope});
    /** 定义获取登录用户名方法 */
    $scope.showName = function(){
        baseService.sendGet("/user/showName")
            .then(function(response){
                $scope.loginName = response.data.loginName;

                baseService.sendGet("/user/showUserInfo?username="+$scope.loginName).then(function (response) {
                    $scope.userInfo=response.data;
                });

            });
    };

    $scope.init=function () {
        $scope.showName();

    }

    // 分页查询数据
    $scope.search = function (page, rows) {
        $scope.init();
        // 发送异步请求
        baseService.findByPage("/order/findByPage", page, rows)
            .then(function(response){
                // 获取响应数据
                // response.data: {total: 1000, rows : [{},{}]}
                // 获取品牌数据

                $scope.dataList = response.data.rows;

                if($scope.dataList !=null && $scope.dataList.length>0){
                    for(var i=0;i<$scope.dataList.length;i++){

                        if ($scope.dataList[i].createTime != null) {
                            var date = new Date($scope.dataList[i].createTime);
                            $scope.dataList[i].createTime= date.getFullYear() + '-' + (date.getMonth() + 1>9?date.getMonth() + 1:'0'+(date.getMonth() + 1)) + '-' +(date.getDate()>9?date.getDate():'0'+date.getDate()) ;
                        }
                    }
                }
                // 获取总记录数
                $scope.paginationConf.totalItems = response.data.total;

            });
    };

    $scope.orderStatus=['未付款','已付款','未发货','已发货','交易成功','交易关闭','待评价'];


    $scope.GetQueryString=function(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }

// 调用方法
//     alert(GetQueryString("参数名1"));
//     alert(GetQueryString("参数名2"));
//     alert(GetQueryString("参数名3"));

    // 生成微信支付二维码
    $scope.genPayCode = function () {


        baseService.sendGet("/order/genPayCode?" +
            "orderId="
            // +"979186611747028991"+
            +$scope.GetQueryString("orderId")+
            "&money="+$scope.GetQueryString("money")).then(function(response){
            // 获取响应数据  response.data : {outTradeNo: '', money : 1, codeUrl : ''}
            // 获取交易订单号
            $scope.outTradeNo = response.data.outTradeNo;
            // 获取支付金额
            $scope.money = (response.data.totalFee / 100).toFixed(2);
            // 获取支付URL
            $scope.codeUrl = response.data.codeUrl;

            // 支付二维码
            document.getElementById("qrcode").src = "/barcode?url=" + $scope.codeUrl;

            // 开启定时器
            // 第一个参数：定时需要回调的函数
            // 第二个参数：间隔的时间毫秒数 3秒
            // 第三个参数：总调用次数 100
            var timer = $interval(function(){

                // 发送异步请求，获取支付状态
                baseService.sendGet("/order/queryPayStatus?outTradeNo="
                    + $scope.outTradeNo).then(function(response){
                    // 获取响应数据: response.data: {status : 1|2|3} 1:支付成功 2：未支付 3:支付失败
                    if (response.data.status == 1){// 支付成功
                        // 取消定时器
                        $interval.cancel(timer);
                        // 跳转到支付成功的页面
                        location.href = "/paysuccess.html?money=" + $scope.money;
                    }
                    if (response.data.status == 3){
                        // 取消定时器
                        $interval.cancel(timer);
                        // 跳转到支付失败的页面
                        location.href = "/payfail.html";
                    }
                });
            }, 3000, 100);

            // 总调用次数结束后，需要调用的函数
            timer.then(function(){
                // 关闭订单
                $scope.tip = "二维码已过期，刷新页面重新获取二维码。";
            });

        });
    };


    // 获取支付的总金额
    $scope.getMoney = function () {
        return $location.search().money;
    };


});