package com.pinyougou.service;

public interface PhoneService {
    //通过用户名 新手机号 修改原来手机号
    boolean updateOldPhone(String loginName,String phone);

    //发送短信验证码
    boolean sendSmsCode(String loginName);
    boolean sendSmsCode2(String phone);

    String selectPhoneByUserName(String loginName);

    boolean checkSmsCode(String phone, String code);

}
