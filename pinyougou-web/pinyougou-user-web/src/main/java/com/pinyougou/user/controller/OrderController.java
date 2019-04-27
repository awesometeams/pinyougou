package com.pinyougou.user.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.common.pojo.PageResult;
import com.pinyougou.pojo.Address;
import com.pinyougou.pojo.Brand;
import com.pinyougou.pojo.Order;
import com.pinyougou.pojo.PayLog;
import com.pinyougou.service.AddressService;
import com.pinyougou.service.BrandService;
import com.pinyougou.service.OrderService;
import com.pinyougou.service.WeixinPayService;
import org.apache.commons.lang3.StringUtils;
import org.omg.CORBA.INTERNAL;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 订单控制器
 *
 * @author lee.siu.wah
 * @version 1.0
 * <p>File Created at 2019-04-15<p>
 */
@RestController
@RequestMapping("/order")
public class OrderController {

    /**
     * 引用服务
     * timeout:调用服务超时(1000毫秒)
     * */
    @Reference(timeout = 10000)
    private OrderService orderService;

    @Reference(timeout = 10000)
    private WeixinPayService weixinPayService;

    @GetMapping("/findByPage")
    public PageResult findByPage(Integer page, Integer rows,HttpServletRequest request){

        String userId = request.getRemoteUser();

        // {total: 100, rows : [{},{}]}
        // {} : Map、实体类
        // fastjson: 把java中的数据类型转化成 {}
       return orderService.findByPage(page, rows,userId);
    }


    /** 生成微信支付 */
    @GetMapping("/genPayCode")
    public Map<String, Object> genPayCode(String orderId,Double money){


        String s= (int)(money*100)+"";
        return weixinPayService.genPayCode(orderId, s);
    }

    /** 检测支付状态 */
    @GetMapping("/queryPayStatus")
    public Map<String, Integer> queryPayStatus(String outTradeNo){
        Map<String, Integer> data = new HashMap<>();
        data.put("status", 3);
        try {
            // 调用微信支付服务接口
            Map<String,String> resMap = weixinPayService.queryPayStatus(outTradeNo);

            if (resMap != null){
                // SUCCESS-支付成功
                if ("SUCCESS".equals(resMap.get("trade_state"))){

                    // 支付成功，修改支付日志的状态、订单的状态
                    orderService.updateOederStatus(outTradeNo);

                    data.put("status", 1);
                }
                // NOTPAY—未支付
                if ("NOTPAY".equals(resMap.get("trade_state"))){
                    data.put("status", 2);
                }
            }
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return data;
    }


}
