//定义控制器层
app.controller('completeController', function($scope, $controller,baseService) {
    //指定继承indexController
    $controller("indexController", {$scope: $scope});
     //重定向
    $scope.redirectUrl = window.encodeURIComponent(location.href);

});