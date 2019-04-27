package com.pinyougou.user.service.impl;


import com.alibaba.dubbo.config.annotation.Service;
import com.alibaba.fastjson.JSON;
import com.pinyougou.common.util.HttpClientUtils;
import com.pinyougou.mapper.SafeMapper;
import com.pinyougou.service.PhoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service(interfaceName = "com.pinyougou.service.PhoneService")
@Transactional
public class PhoneServiceImpl implements PhoneService {

    @Value("${sms.url}")
    private String smsUrl;
    @Value("${sms.signName}")
    private String signName;
    @Value("${sms.templateCode}")
    private String templateCode;

    @Autowired
    private SafeMapper safeMapper;
    @Autowired
    private RedisTemplate redisTemplate;

    //通过用户名 新手机号 修改原来手机号
    @Override
    public boolean updateOldPhone(String loginName, String phone) {
        try{
         return safeMapper.updateOldPhone(loginName,phone);
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    //通过登录用户名查询手机
    @Override
    public String selectPhoneByUserName(String loginName) {
          return safeMapper.selectPhoneByUserName(loginName);
    }

    //发送短信验证码
    @Override
    public boolean sendSmsCode(String loginName) {
        try {
            //得到传入新手机
            // String phone1 = (String) request.getSession().getAttribute("phone");
            //通过登录用户名查询数据库得到手机号 再封装到集合里
            String phone = safeMapper.selectPhoneByUserName(loginName);

            // 1. 随机生成6位数字的验证码 95db9eb9-94e8-48e7-a5b2-97c622644e70
            String code = UUID.randomUUID().toString().replaceAll("-", "")
                    .replaceAll("[a-zA-Z]", "").substring(0, 6);
            System.out.println("code= " + code);

            // 2. 调用短信发送接口(HttpClientUtils)
            HttpClientUtils httpClientUtils = new HttpClientUtils(false);
            // 定义Map集合封装请求参数 18502903967
            Map<String, String> params = new HashMap<>();
            params.put("phone", phone);
            params.put("signName", signName);
            params.put("templateCode", templateCode);
            params.put("templateParam", "{'number' : '" + code + "'}");
            // 发送post请求
            String content = httpClientUtils.sendPost(smsUrl, params);
            System.out.println("content = " + content);

            // 3. 判断短信是否发送成功，如果发送成功，就需要把验证存储到Redis(时间90秒)
            // {success : true}
            Map map = JSON.parseObject(content, Map.class);
            boolean success = (boolean) map.get("success");
            if (success) {
                // 把验证存储到Redis(时间90秒)
                redisTemplate.boundValueOps(phone).set(code, 90, TimeUnit.SECONDS);
            }
            return success;
        } catch(Exception ex){
            throw new RuntimeException(ex);
        }
    }

    //发送短信验证码
    @Override
    public boolean sendSmsCode2(String phone) {
        try {
            // 1. 随机生成6位数字的验证码 95db9eb9-94e8-48e7-a5b2-97c622644e70
            String code = UUID.randomUUID().toString().replaceAll("-", "")
                    .replaceAll("[a-zA-Z]", "").substring(0, 6);
            System.out.println("code= " + code);

            // 2. 调用短信发送接口(HttpClientUtils)
            HttpClientUtils httpClientUtils = new HttpClientUtils(false);
            // 定义Map集合封装请求参数 18502903967
            Map<String, String> params = new HashMap<>();
            params.put("phone", phone);
            params.put("signName", signName);
            params.put("templateCode", templateCode);
            params.put("templateParam", "{'number' : '" + code + "'}");
            // 发送post请求
            String content = httpClientUtils.sendPost(smsUrl, params);
            System.out.println("content = " + content);

            // 3. 判断短信是否发送成功，如果发送成功，就需要把验证存储到Redis(时间90秒)
            // {success : true}
            Map map = JSON.parseObject(content, Map.class);
            boolean success = (boolean) map.get("success");
            if (success) {
                // 把验证存储到Redis(时间90秒)
                redisTemplate.boundValueOps(phone).set(code, 90, TimeUnit.SECONDS);
            }
            return success;
        } catch(Exception ex){
            throw new RuntimeException(ex);
        }
    }


    //  检验短信验证码是否正确
    public boolean checkSmsCode(String phone, String code) {
        try {
            //redis 中存储的验证码 与前端传入的验证码比较
            String oldCode = (String) redisTemplate.boundValueOps(phone).get();
            return code.equals(oldCode);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }
}
