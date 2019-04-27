package com.pinyougou.service;
import javax.servlet.http.HttpServletRequest;
import java.io.Serializable;

public interface SafeService {

     //修改密码
    void updatePassword(String loginName,String password);
     //发短信
    boolean sendSmsCode(String loginName);
    //通过查询登录用户名获取电话号
    public String selectPhoneByUserName(String loginName);
    //检验验证码是否正确
    boolean checkSmsCode(String phone, String code);


}
