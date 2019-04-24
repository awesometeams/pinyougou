package com.pinyougou.service;

import com.pinyougou.common.pojo.PageResult;
import com.pinyougou.pojo.Content;

import java.io.Serializable;
import java.util.List;
/**
 * ContentService 服务接口
 * @date 2019-03-28 09:58:00
 * @version 1.0
 */
public interface ContentService {

	/** 添加方法 */
	void save(Content content);

	/** 修改方法 */
	void update(Content content);

	/** 根据主键id删除 */
	void delete(Serializable id);

	/** 批量删除 */
	void deleteAll(Serializable[] ids);

	/** 根据主键id查询 */
	Content findOne(Serializable id);

	/** 查询全部 */
	List<Content> findAll();

	/** 多条件分页查询 */
	PageResult findByPage(Content content, int page, int rows);

	/** 查询广告数据 */
    List<Content> findContentByCategoryId(Long categoryId);
}