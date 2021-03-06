package com.pinyougou.mapper;

import org.apache.ibatis.annotations.Param;
import tk.mybatis.mapper.common.Mapper;

import com.pinyougou.pojo.User;

/**
 * UserMapper 数据访问接口
 * @date 2019-03-28 09:54:28
 * @version 1.0
 */
public interface UserMapper extends Mapper<User>{

    void updateUserInfo(User user);

    User showUserInfo(String username);
}