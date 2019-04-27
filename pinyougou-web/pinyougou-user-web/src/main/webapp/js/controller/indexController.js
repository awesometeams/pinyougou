/** 定义控制器层 */
app.controller('indexController', function($scope, baseService){
    /** 定义获取登录用户名方法 */
    $scope.showName = function(){
        //重定向
        $scope.redirectUrl = window.encodeURIComponent(location.href);

        baseService.sendGet("/user/showName")
            .then(function(response){
                $scope.loginName = response.data.loginName;
            });
        };
});