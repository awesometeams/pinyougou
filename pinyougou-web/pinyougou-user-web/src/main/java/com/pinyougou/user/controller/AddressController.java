package com.pinyougou.user.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.Address;
import com.pinyougou.pojo.User;
import com.pinyougou.service.AddressService;
import com.pinyougou.service.UserService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

/**
 * 地址控制器
 *
 * @author lee.siu.wah
 * @version 1.0
 * <p>File Created at 2019-04-15<p>
 */
@RestController
@RequestMapping("/address")
public class AddressController {

    @Reference
    private AddressService addressService;

    @PostMapping("/saveAddress")
    public boolean saveAddress(@RequestBody Address address,HttpServletRequest request){
        try {
            String userId = request.getRemoteUser();
            addressService.saveAddress(address,userId);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @GetMapping("/deleteAddress")
    public boolean deleteAddress(Long id){
        try {
            addressService.delete(id);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @GetMapping("/setDefaultAddress")
    public boolean setDefaultAddress(Long id,HttpServletRequest request){
        try {
            String userId = request.getRemoteUser();
            addressService.setDefaultAddress(id,userId);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @GetMapping("/findAddressList")
    public List<Address> findAddressList(HttpServletRequest request){

        String userId = request.getRemoteUser();

        return   addressService.findAddressList(userId);
    }
    @PostMapping("/updateAddress")
    public boolean updateAddress(@RequestBody Address address){
        try {
            addressService.updateAddress(address);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }


}
