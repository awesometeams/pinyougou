/** 定义控制器层 */
app.controller('indexController', function($scope, baseService){
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

});