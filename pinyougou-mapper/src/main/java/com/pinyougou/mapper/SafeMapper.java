package com.pinyougou.mapper;

import com.pinyougou.pojo.User;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import tk.mybatis.mapper.common.Mapper;
import org.apache.ibatis.annotations.Param;

public interface SafeMapper extends Mapper<User> {
    @Update("update tb_user set password=#{newPassword} where username =#{username}")
    void updatePassword(@Param("username") String loginName,
                        @Param("newPassword") String md5Hex);

    @Select("select phone from tb_user where username =#{loginName}")
    String selectPhoneByUserName(String phone);

    @Update("update tb_user set phone=#{phone} where username =#{loginName}")
    boolean updateOldPhone(@Param("loginName") String loginName,
                            @Param("phone") String phone);

}
