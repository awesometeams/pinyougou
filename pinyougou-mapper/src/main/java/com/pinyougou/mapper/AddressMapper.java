package com.pinyougou.mapper;

import org.apache.ibatis.annotations.Param;
import tk.mybatis.mapper.common.Mapper;

import com.pinyougou.pojo.Address;

import java.util.List;
import java.util.Map;

/**
 * AddressMapper 数据访问接口
 * @date 2019-03-28 09:54:28
 * @version 1.0
 */
public interface AddressMapper extends Mapper<Address>{



    List<Map<String, Object>> findProvinceList();

    List<Map<String,Object>> findCityList(String provinceId);

    List<Map<String,Object>> findTownList(String cityId);

    void setDefaultAddress(@Param("id") Long id,@Param("userId") String userId);

    void setNoneDefaultAddress(@Param("id")Long id, @Param("userId") String userId);


    List<Address> findAddressList(String userId);
}