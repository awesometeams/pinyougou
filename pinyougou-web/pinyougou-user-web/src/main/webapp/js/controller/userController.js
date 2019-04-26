/** 定义控制器层 */
app.controller('userController', function($scope, $timeout, baseService){

    // 定义user对象
    $scope.user = {};
    /** 用户注册 */
    $scope.save = function () {

        // 判断两次密码是否一致
        if ($scope.okPassword && $scope.user.password == $scope.okPassword){
            // 发送异步请求
            baseService.sendPost("/user/save?code=" + $scope.code, $scope.user)
                .then(function(response){
                if (response.data){
                    // 清空表单数据
                    $scope.user = {};
                    $scope.okPassword = "";
                    $scope.code = "";
                }else{
                    alert("注册失败！");
                }
            });

        }else{
            alert("两次密码不一致！");
        }
    };




    // 发送短信验证码
    $scope.sendSmsCode = function () {

        // 判断手机号码
        if ($scope.user.phone && /^1[3|4|5|7|8]\d{9}$/.test($scope.user.phone)){
            // 发送异步请求
            baseService.sendGet("/user/sendSmsCode?phone=" + $scope.user.phone)
                .then(function(response){
                if (response.data){
                    // 调用倒计时方法
                    $scope.downcount(90);

                }else{
                    alert("发送失败！");
                }
            });
        }else {
            alert("手机号码格式不正确！")
        }
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

    $scope.setProfession=function (value) {
        $scope.userInfo.profession=value;
        
    };
    
    $scope.updateUserInfo=function () {

        if( up_img_WU_FILE_0.files[0]){
            $scope.uploadFile();
        }else {
            baseService.sendPost("/user/updateUserInfo",$scope.userInfo).then(function (response) {
                if(response.data){
                    alert("更新成功！")
                }else {
                    alert("更新失败！")
                }
            });
        }



    };

    // 定义文件上传
    $scope.uploadFile = function () {
        // 调用服务层上传文件
        baseService.uploadFile().then(function(response){
            // 获取响应数据 {status : 200, url : 'http://192.168.12.131/group1/xxx/xx/x.jpg'}
            if(response.data.status == 200){
                // 获取图片url $scope.picEntity : {url : '', color:''}
                $scope.userInfo.headPic = response.data.url;

                baseService.sendPost("/user/updateUserInfo",$scope.userInfo).then(function (response) {
                    if(response.data){
                        alert("更新成功！");
                        $scope.init();
                    }else {
                        alert("更新失败！")
                    }
                });




            }else{
                alert("图片上传失败！");
            }
        });
    };


    /** 定义获取登录用户名方法 */
    $scope.showName = function(){
        baseService.sendGet("/user/showName")
            .then(function(response){
                $scope.loginName = response.data.loginName;

                baseService.sendGet("/user/showUserInfo?username="+$scope.loginName).then(function (response) {
                    $scope.userInfo=response.data;


                    if ($scope.userInfo.birthday != null) {
                        var date = new Date($scope.userInfo.birthday);
                        $scope.userInfo.birthday= date.getFullYear() + '-' + (date.getMonth() + 1>9?date.getMonth() + 1:'0'+(date.getMonth() + 1)) + '-' +(date.getDate()>9?date.getDate():'0'+date.getDate()) ;
                    }
                });

            });
    };


    $scope.init_province_city_town=function () {
        $scope.provinceList=[];
        $scope.cityList=[];
        $scope.townList=[];
    }

    $scope.init=function () {
        $scope.init_province_city_town();
        $scope.showName();
        $scope.findProvinceList();
    };

    $scope.init_address=function () {
        $scope.init_province_city_town();
        $scope.showName();
        $scope.findProvinceList();
        $scope.findAddressList();
    }
    $scope.findAddressList=function () {
        baseService.sendGet("/address/findAddressList").then(function (response) {
            $scope.addressList=response.data;

        });
    }


    // 省市区三级级联开始
    // 根据父级id查询商品分类
    $scope.findProvinceList = function () {
        baseService.sendGet("/user/findProvinceList")
            .then(function (response) {
            // 获取响应数据
            $scope.provinceList= response.data;
        });
    };
    $scope.findCityList=function (provinceId) {
        baseService.sendGet("/user/findCityList?provinceId="+provinceId)
            .then(function (response) {
                // 获取响应数据
                $scope.cityList= response.data;
            });
    };

    $scope.findTownList=function (cityId) {
        baseService.sendGet("/user/findTownList?cityId="+cityId)
            .then(function (response) {
                // 获取响应数据
                $scope.townList= response.data;
            });
    };

   $scope.userInfo={"profession":""};


    // $scope.$watch: 它可以监控$scope中的变量发生改变，就会调用一个函数
    // $scope.$watch: 监控一级分类id,发生改变，查询二级分类
    $scope.$watch('userInfo.provinceId', function (newVal, oldVal) {
        //alert("新值：" + newVal + ",旧值:" + oldVal);
        if (newVal){ // 不是undefined、null
            // 查询二级分类
            $scope.findCityList(newVal);
        }else {
            $scope.cityList = [];
        }
    });
    $scope.$watch('address.provinceId', function (newVal, oldVal) {
        //alert("新值：" + newVal + ",旧值:" + oldVal);
        if (newVal){ // 不是undefined、null
            // 查询二级分类
            $scope.findCityList(newVal);
        }else {
            $scope.cityList = [];
        }
    });

    // $scope.$watch: 监控二级分类id,发生改变，查询三级分类
    $scope.$watch('userInfo.cityId', function (newVal, oldVal) {
        //alert("新值：" + newVal + ",旧值:" + oldVal);
        if (newVal){ // 不是undefined、null
            // 查询三级分类
            $scope.findTownList(newVal);
        }else {
            $scope.townList = [];
        }

    });
    $scope.$watch('address.cityId', function (newVal, oldVal) {
        //alert("新值：" + newVal + ",旧值:" + oldVal);
        if (newVal){ // 不是undefined、null
            // 查询三级分类
            $scope.findTownList(newVal);
        }else {
            $scope.townList = [];
        }

    });
    // 省市区三级级联结束

    $scope.address={};

    $scope.setAddressAlias=function (value) {
        alert(1)
        $scope.address.alias=value;
        alert($scope.address.alias)

    }
    $scope.saveAddress=function () {
        if($scope.address.id !=null){
            baseService.sendPost("/address/updateAddress",$scope.address).then(function (response) {
                if(response.data){
                    $scope.init_address();
                }else {
                    alert("更新地址失败！")
                }
            });

            return;
        }
        baseService.sendPost("/address/saveAddress",$scope.address).then(function (response) {
            if(response.data){
                $scope.init_address();
            }else {
                alert("保存地址失败！")
            }
        });
    }
    $scope.deleteAddress=function(id,isDefault){

        if(isDefault==1){
            alert("不能删除默认地址！");
            return;
        }

        baseService.sendGet("/address/deleteAddress?id="+id).then(function (response) {
            if(response.data){
                $scope.init_address();
            }else {
                alert("删除失败！")
            }
            }

        );
    };

    $scope.setDefaultAddress=function(id){
        baseService.sendGet("/address/setDefaultAddress?id="+id).then(function (response) {
                if(response.data){
                    $scope.init_address();
                }else {
                    alert("设置默认地址失败！")
                }
            }

        );
    }
    
    $scope.showUpdate=function (data) {

        $scope.address=JSON.parse(JSON.stringify(data));
    }

});