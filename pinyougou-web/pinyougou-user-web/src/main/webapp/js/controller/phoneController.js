//定义控制器层
app.controller('phoneController', function($scope, $controller,baseService){
    //指定继承indexController
    $controller("safeController",{$scope:$scope});

    //重定向
    $scope.redirectUrl = window.encodeURIComponent(location.href);
    //发送短信验证码 判断手机格式 图片验证码
    $scope.sendSms=function () {
        // 判断手机号码
        if ($scope.phone && /^1[3|4|5|7|8]\d{9}$/.test($scope.phone)){
            baseService.sendGet("/phone/getCode").then(function (response) {
                var  getCode=response.data;
                if ($scope.code == getCode && $scope.code !=null) {
                    baseService.sendGet("/phone/sendSms?phone="+$scope.phone)
                        .then(function (response) {
                            if (response.data) {
                                alert("发送成功!")
                            }else {
                                alert("发送失败!");
                            }
        });
                } else {
                    alert("验证码不正确");
                    $scope.code='';
                }
            });
        }else {
            alert("手机号码格式不正确！")
        }
    };

//点击下一步 判断验证码是否一致
    $scope.saveTwo=function(){
        baseService.sendGet("/phone/checkSmsCode?code=" + $scope.smsCode+"&phone="+$scope.phone).then(function (response) {
            if (! response.data) {
                alert("验证失败!");
                window.location.href="http://user.pinyougou.com/home-setting-safe.html";
            }
            else {

            }
        });
    };
});