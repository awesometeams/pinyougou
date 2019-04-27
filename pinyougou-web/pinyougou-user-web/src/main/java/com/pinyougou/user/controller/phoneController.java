package com.pinyougou.user.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.service.PhoneService;
import com.pinyougou.service.SafeService;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/phone")
public class phoneController {

    @Reference(timeout = 10000)
    private PhoneService phoneService;

    //获取图片验证码
    @GetMapping("/getCode")
    public String getCode(HttpServletRequest request){
        return (String) request.getSession().getAttribute("verify_code");
    }
     //发送短信
    @GetMapping("/sendSms")
    public boolean sendSms(String phone,HttpServletRequest request){
        try{
            // 获取安全上下文对象 得到用户名
            SecurityContext context = SecurityContextHolder.getContext();
            String loginName = context.getAuthentication().getName();
            //得到传入新手机
           // String phone = (String) request.getSession().getAttribute("phone");
            //通过用户名 新手机号 修改原来手机号
           // phoneService.updateOldPhone(loginName,phone);
            phoneService.sendSmsCode2(phone);
            return true;
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return false;
    }
    //点击下一步 判断验证码是否一致
    @GetMapping("/checkSmsCode")
    public boolean checkSmsCode(String code, String phone,HttpServletRequest request){
        try{
            //登录用户名
            String loginName = request.getRemoteUser();

            //检验验证码是否正确
            boolean flag = phoneService.checkSmsCode(phone ,code);
            if (flag){
                phoneService.updateOldPhone(loginName,phone);
                return true;
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return false;
    }

}
