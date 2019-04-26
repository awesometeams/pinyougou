package com.pinyougou.user.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.Address;
import com.pinyougou.pojo.User;
import com.pinyougou.service.UserService;
import com.sun.javafx.collections.MappingChange;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 用户控制器
 *
 * @author lee.siu.wah
 * @version 1.0
 * <p>File Created at 2019-04-15<p>
 */
@RestController
@RequestMapping("/user")
public class UserController {

    @Reference(timeout = 10000)
    private UserService userService;

    /** 用户注册 */
    @PostMapping("/save")
    public boolean save(@RequestBody User user, String code){
        try{
            // 检验验证码是否正确
            boolean flag = userService.checkSmsCode(user.getPhone(), code);
            if (flag) {
                userService.save(user);
            }
            return flag;
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return false;
    }


    /** 发送短信验证码 */
    @GetMapping("/sendSmsCode")
    public boolean sendSmsCode(String phone){
        try{
            return userService.sendSmsCode(phone);
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return false;
    }


    @GetMapping("/findProvinceList")
    public List<Map<String, Object>> findProvinceList(){
        return userService.findProvinceList();
    }
    @GetMapping("/findCityList")
    public List<Map<String, Object>> findCityList(String provinceId){
        return userService.findCityList(provinceId);
    }
    @GetMapping("/findTownList")
    public List<Map<String, Object>> findTownList(String cityId){
        return userService.findTownList(cityId);
    }

    @PostMapping("/updateUserInfo")
    public boolean updateUserInfo(@RequestBody User user, HttpServletRequest request){
        try {
            String username = request.getRemoteUser();
            userService.updateUserInfo(username,user);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;

    }

    @GetMapping("/showUserInfo")
    public User showUserInfo(String username){
        return userService.showUserInfo(username);
    }

    @GetMapping("/findAddressList")
    public List<Address> findAddressList(){
       return   userService.findAddressList();
    }



}
