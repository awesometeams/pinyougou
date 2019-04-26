/** 定义控制器层 */
app.controller('updatePasswordController', function($scope, $controller, baseService) {

    /** 指定继承baseController */
    $controller('baseController', {$scope: $scope});


    $scope.user = {};
    // 修改密码
    $scope.updatePassword = function () {
        if ($scope.user.oldPassword == "" || $scope.user.oldPassword == null){
            alert("原始密码不能为空！");
        }

        // 判断密码是否一致
      if ($scope.user.newPassword != $scope.user.confirmPassword) {
          alert("密码不一致，请重新输入！");
          $scope.user.newPassword = "";
          $scope.user.confirmPassword = "";
          return;
      }
      if ($scope.user.oldPassword){

          baseService.sendPost("/seller/updatePassword", $scope.user).then(function (response) {
              if (response.data) {
                  alert("修改成功！");
                  /** 跳转到登录页面 */
                  location.href = "/shoplogin.html";
              }else {
                  alert("修改失败！");
              }
              $scope.user.oldPassword = "";
              $scope.user.newPassword = "";
              $scope.user.confirmPassword = "";
          });
      }
    };




});