package com.pinyougou.user.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.User;
import com.pinyougou.service.SafeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/safe")
public class safeController {

    @Reference(timeout = 10000)
    private SafeService safeService;


    @PostMapping("/updatePassword")
    public boolean updatePassword(@RequestBody Map<String,String> password){
        try{
            //获取前端输入密码
            String newPassword = password.get("newPassword");
            System.out.println(newPassword);
            // 获取安全上下文对象 得到用户名
            SecurityContext context = SecurityContextHolder.getContext();
            String loginName = context.getAuthentication().getName();
            safeService.updatePassword(loginName,newPassword);
            return true;
        }catch (Exception e){
            e.printStackTrace();
        }
            return false;
    }
    //获取验证码
    @GetMapping("/getCode")
    public String getCode(HttpServletRequest request){
        return (String) request.getSession().getAttribute("verify_code");
    }


    // 发送短信验证码
    @GetMapping("/sendSms")
    public boolean sendSms(String code){
        try{
            // 获取安全上下文对象 得到用户名
            SecurityContext context = SecurityContextHolder.getContext();
            String loginName = context.getAuthentication().getName();
            safeService.sendSmsCode(loginName);
            return true;
        }catch (Exception ex){
            ex.printStackTrace();
        }
           return false;
    }

    //点击下一步 判断验证码是否一致
    @PostMapping("/checkSmsCode")
    public boolean checkSmsCode(String code, HttpServletRequest request){

    try{
        //登录用户名
        String loginName = request.getRemoteUser();
        //检验验证码是否正确
        String phone = safeService.selectPhoneByUserName(loginName);

        boolean flag = safeService.checkSmsCode(phone ,code);
        if (flag){
            return true;
        }
    }catch (Exception e){
        e.printStackTrace();
       }
       return false;
    }
}
