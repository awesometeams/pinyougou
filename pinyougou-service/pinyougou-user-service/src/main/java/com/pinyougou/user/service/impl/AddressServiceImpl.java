package com.pinyougou.user.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.mapper.AddressMapper;
import com.pinyougou.pojo.Address;
import com.pinyougou.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.transaction.annotation.Transactional;
import tk.mybatis.mapper.entity.Example;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 地址服务接口实现类
 *
 * @author lee.siu.wah
 * @version 1.0
 * <p>File Created at 2019-04-20<p>
 */
@Service(interfaceName = "com.pinyougou.service.AddressService")
@Transactional
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressMapper addressMapper;

    @Override
    public void save(Address address) {

    }

    @Override
    public void update(Address address) {

    }

    @Override
    public void delete(Serializable id) {

        addressMapper.deleteByPrimaryKey(id);

    }

    @Override
    public void deleteAll(Serializable[] ids) {

    }

    @Override
    public Address findOne(Serializable id) {
        return null;
    }

    @Override
    public List<Address> findAll() {
        return null;
    }

    @Override
    public List<Address> findByPage(Address address, int page, int rows) {
        return null;
    }

    @Override
    public List<Address> findAddressByUser(String userId) {
        try{
            // SELECT * FROM tb_address WHERE user_id = 'itcast' ORDER BY is_default DESC
            // 创建示范对象
            Example example = new Example(Address.class);
            // 创建条件对象
            Example.Criteria criteria = example.createCriteria();
            // user_id = 'itcast'
            criteria.andEqualTo("userId", userId);
            // ORDER BY is_default DESC
            example.orderBy("isDefault").desc();
            // 条件查询
            return addressMapper.selectByExample(example);
        }catch (Exception ex){
            throw new RuntimeException(ex);
        }
    }

    @Override
    public void saveAddress(Address address,String userId) {
        address.setUserId(userId);
        address.setIsDefault("0");
        address.setCreateDate(new Date());

        addressMapper.insertSelective(address);

    }

    @Override
    public void setDefaultAddress(Long id,String userId) {

        try {
            addressMapper.setDefaultAddress(id,userId);
            addressMapper.setNoneDefaultAddress(id,userId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    @Override
    public List<Address> findAddressList(String userId) {
        return  addressMapper.findAddressList(userId);
    }

    @Override
    public void updateAddress(Address address) {
        addressMapper.updateByPrimaryKeySelective(address);
    }
}
