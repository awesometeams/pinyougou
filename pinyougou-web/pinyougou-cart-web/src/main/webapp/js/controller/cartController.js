// 定义购物车的控制器
app.controller('cartController', function ($scope, $controller, baseService) {

    // 继承baseController
    $controller('baseController', {$scope: $scope});

    $scope.checked = [];
    $scope.carts = [];
    $scope.cartsback = [];

    // 查询购物车
    $scope.findCart = function () {
        baseService.sendGet("/cart/findCart").then(function (response) {
            // 获取响应数据
            $scope.carts = response.data;

            // 定义json对象封装统计的数据
            $scope.totalEntity = {totalNum: 0, totalMoney: 0};
            // 迭代用户的购物车集合
            for (var i = 0; i < $scope.carts.length; i++) {
                // 获取商家的购物车
                var cart = $scope.carts[i];
                // 迭代商家购物车中的商品
                for (var j = 0; j < cart.orderItems.length; j++) {
                    // 获取购买的商品
                    var orderItem = cart.orderItems[j];
                    // 统计购买数量
                    //$scope.totalEntity.totalNum += orderItem.num;
                    // 统计总金额
                    //$scope.totalEntity.totalMoney += orderItem.totalFee;
                }
            }
        });
    };

    $scope.countAll = function () {
        for (var i = 0; i < $scope.carts.length; i++) {
            // 获取商家的购物车
            var cart = $scope.carts[i];
            // 迭代商家购物车中的商品
            for (var j = 0; j < cart.orderItems.length; j++) {
                // 获取购买的商品
                var orderItem = cart.orderItems[j];
                if (orderItem.checked) {
                    // 统计购买数量
                    $scope.totalEntity.totalNum += orderItem.num;
                    // 统计总金额
                    $scope.totalEntity.totalMoney += orderItem.totalFee * orderItem.num;
                }
            }
        }
    };

    // 添加商品到购物车
    $scope.addCart = function (itemId, num) {
        baseService.sendGet("/cart/addCart?itemId="
            + itemId + "&num=" + num).then(function (response) {
            $scope.cartsback = $scope.carts;
            $scope.carts = response.data;
            // 获取响应数据
            if (response.data) {
                alert(1);
                alert($scope.cartsback.length);
                // 重新查询购物车
                var cartLen = $scope.carts.length;
                for (var i = 0; i < cartLen; i++) {
                    // 获取商家的购物车
                    var cart = $scope.carts[i];
                    // 迭代商家购物车中的商品
                    cart.checked = $scope.cartsback[i].checked;
                    var len = cart.orderItems.length;
                    for (var j = 0; j < len; j++) {
                        // 获取购买的商品
                        var orderItem = cart.orderItems[j];
                        orderItem.checked = $scope.cartsback[i].orderItems.checked;
                        if (orderItem.checked) {
                            // 统计购买数量
                            $scope.totalEntity.totalNum += orderItem.num;
                            // 统计总金额
                            $scope.totalEntity.totalMoney += orderItem.totalFee * orderItem.num;
                        }
                    }
                }
            }
            // $scope.cartsback = []
        });
    };

    $scope.checkItem = function ($event, shopIndex, itemIndex) {
        // 定义json对象封装统计的数据
        $scope.totalEntity = {totalNum: 0, totalMoney: 0};
        /*alert(1);
        alert(shopIndex);
        alert(itemIndex);
        alert($scope.carts.length);
        alert($scope.carts[shopIndex].orderItems[itemIndex].num);
        alert($scope.carts[shopIndex].orderItems[itemIndex].money);*/
        // var items = $scope.carts[index].orderItems
        // var itemsLength = items.length
        // if ($scope.carts[index].checked) {
        //     for (var i = 0; i < itemsLength; i++) {
        //         items[i].checked = false
        //     }
        // } else {
        //     for (var i = 0; i < itemsLength; i++) {
        //         items[i].checked = true
        //     }
        // }
        //alert(cart);
        //alert(shopIndex);
        // var len = $scope.carts[shopIndex].orderItems.length;
        // var count = 0;
        // alert("长度等于" + len)
        // for (var i = 0; i < len; i++) {
        //     alert(1)
        //     orderItem = cart.orderItems[i];
        //     if (orderItem.checked) count+=1;
        //     alert(orderItem.checked);
        // }
        // //alert(count);
        // if (count == len) {
        //     cart.checked = true;
        // } else {
        //     cart.checked = false;
        // }
        var countCart = 0;
        var cartLen = $scope.carts.length;
        for (var i = 0; i < cartLen; i++) {
            // 获取商家的购物车
            var cart = $scope.carts[i];
            // 迭代商家购物车中的商品
            var count = 0;
            var len = cart.orderItems.length;
            for (var j = 0; j < len; j++) {
                // 获取购买的商品
                var orderItem = cart.orderItems[j];
                if (orderItem.checked) {
                    count += 1;
                    // 统计购买数量
                    $scope.totalEntity.totalNum += orderItem.num;
                    // 统计总金额
                    $scope.totalEntity.totalMoney += orderItem.totalFee * orderItem.num;
                }
            }
            if (count == len) {
                cart.checked = true;
                countCart++;
            } else {
                cart.checked = false;
            }
        }
        if (countCart == cartLen) {
            $scope.checked = true;
        } else {
            $scope.checked = false;
        }
    };

    /**
     * 店铺全选或者取消
     * @param index
     */
    $scope.checkCart = function ($event, index) {
        // 定义json对象封装统计的数据
        $scope.totalEntity = {totalNum: 0, totalMoney: 0};
        // alert(1);
        // alert(index);
        /*alert(itemIndex);
        alert($scope.carts.length);
        alert($scope.carts[shopIndex].orderItems[itemIndex].num);
        alert($scope.carts[shopIndex].orderItems[itemIndex].money);
*/
        var cart = $scope.carts[index];
        // 迭代商家购物车中的商品
        for (var j = 0; j < cart.orderItems.length; j++) {
            // 获取购买的商品
            var orderItem = cart.orderItems[j];

            orderItem.checked = cart.checked;
            //alert(orderItem.checked)
            //alert(cart.checked)
        }
        // for (var i = 0; i < $scope.carts.length; i++) {
        //     // 获取商家的购物车
        //     var cart = $scope.carts[i];
        //     // 迭代商家购物车中的商品
        //     for (var j = 0; j < cart.orderItems.length; j++) {
        //         // 获取购买的商品
        //         var orderItem = cart.orderItems[j];
        //         if (orderItem.checked) {
        //             // 统计购买数量
        //             $scope.totalEntity.totalNum += orderItem.num;
        //             // 统计总金额
        //             $scope.totalEntity.totalMoney += orderItem.totalFee * orderItem.num;
        //         }
        //     }
        // }
        $scope.countAll();
    };

    $scope.checkAll = function ($event) {
        // 定义json对象封装统计的数据
        $scope.totalEntity = {totalNum: 0, totalMoney: 0};
        alert(1)
        alert($scope.checked);

        for (var i = 0; i < $scope.carts.length; i++) {
            // 获取商家的购物车
            var cart = $scope.carts[i];
            cart.checked = $scope.checked;
            // 迭代商家购物车中的商品
            for (var j = 0; j < cart.orderItems.length; j++) {
                // 获取购买的商品
                var orderItem = cart.orderItems[j];
                orderItem.checked = $scope.checked;
                if ($scope.checked) {
                    // 统计购买数量
                    $scope.totalEntity.totalNum += orderItem.num;
                    // 统计总金额
                    $scope.totalEntity.totalMoney += orderItem.totalFee * orderItem.num;
                }
            }
        }
    }
});