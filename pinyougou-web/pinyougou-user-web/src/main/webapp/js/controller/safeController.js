//定义控制器层
app.controller('safeController', function($scope, $controller,$interval,baseService){
    //指定继承indexController
    $controller("indexController",{$scope:$scope});
    //重定向
    $scope.redirectUrl = window.encodeURIComponent(location.href);

     $scope.entity={newPassword:''};
       //修改账户密码
    $scope.updatePassword=function () {
            if ($scope.entity.newPassword == $scope.okPassword){
                baseService.sendPost("/safe/updatePassword",$scope.entity)
                    .then(function (response) {
                    if (response.data){
                        alert("修改成功");
                    } else {
                        alert("修改失败");
                    }
                });
            }else{
                alert("两次输入密码不同");
            }
      };
    //发送短信验证码  判断验证码
    $scope.sendSms=function () {
        baseService.sendGet("/safe/getCode").then(function (response) {
           var  getCode=response.data;
           if ($scope.code == getCode && $scope.code !=null) {
               baseService.sendGet("/safe/sendSms")
                   .then(function (response) {
                       if (response.data) {
                       }else {
                           alert("发送失败!");
                       }
                   });
           }else {
               alert("验证码不正确");
               $scope.code='';
           }
        });
    };
    //点击下一步 判断验证码是否一致
$scope.saveOne=function(){
     baseService.sendPost("/safe/checkSmsCode?Code=" + $scope.smsCode).then(function (response) {
         if (! response.data) {
             alert("验证失败!");
             window.location.href="http://user.pinyougou.com/home-setting-safe.html";
         }
     });
};


    $scope.smsTip = "获取短信验证码";
    $scope.disabled = false;

    // 倒计时方法
    $scope.downcount = function (seconds) {

        seconds--;

        if (seconds >= 0){
            $scope.smsTip = seconds + "秒后，重新获取！";
            $scope.disabled = true;
            // 第一个参数：回调的函数
            // 第二个参数：间隔的时间毫秒数
            $timeout(function(){
                $scope.downcount(seconds);
            }, 1000);
        }else {
            $scope.smsTip = "获取短信验证码";
            $scope.disabled = false;
        }

    };
});