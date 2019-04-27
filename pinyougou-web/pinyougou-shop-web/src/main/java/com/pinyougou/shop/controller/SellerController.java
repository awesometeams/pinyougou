package com.pinyougou.shop.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.Seller;
import com.pinyougou.service.SellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * 商家控制器
 *
 * @author lee.siu.wah
 * @version 1.0
 * <p>File Created at 2019-04-01<p>
 */
@RestController
@RequestMapping("/seller")
public class SellerController {

    @Reference(timeout = 10000)
    private SellerService sellerService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    /** 商家申请入驻 */
    @PostMapping("/save")
    public boolean save(@RequestBody Seller seller){
        try{
            String password = passwordEncoder.encode(seller.getPassword());
            seller.setPassword(password);
            sellerService.save(seller);
            return true;
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return false;
    }

    @GetMapping("/findSeller")
    public Seller findSeller(HttpServletRequest request) {
        try {
            String userId = request.getRemoteUser();
           Seller seller =  sellerService.findOne(userId);
            return seller;
        }catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    // 修改
    @PostMapping("/update")
    public boolean update(@RequestBody Seller seller) {
        try {
            sellerService.update(seller);
            return true;
        }catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    // 修改密码
    @PostMapping("/updatePassword")
    public boolean updatePassword(@RequestBody Map<String,String> map, HttpServletRequest request) {
        try {
            String userId = request.getRemoteUser();
            Seller seller = sellerService.findOne(userId);
            String password = seller.getPassword();
            String oldPassword = map.get("oldPassword");
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            if (passwordEncoder.matches(oldPassword,password)){
                sellerService.updatePassword(passwordEncoder.encode(map.get("newPassword")),userId);
                return true;
            }
        }catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

}
