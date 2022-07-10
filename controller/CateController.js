// const path = require('path')
const CateController = {};

// 导入模型
const query = require('../model/query.js')


CateController.index = (req, res) => {
    res.render('catelist.html')
}

// 分类接口数据
CateController.cateData = async (req, res) => {
    // 1.编写sql 查询数据
    const sql = 'select * from category';
    const data = await query(sql)
    // 2.返回json数据（规范）给前端
    const responseData = {
        data,
        code: 0,
        msg: 'success'
    }
    res.json(responseData)
}
// 分类编辑
CateController.updCateData = async (req, res) => {
    // 1. 接收post参数
    const {
        cate_id,
        cate_name,
        orderBy
    } = req.body;
    // 2. 编写sql语句，执行，返回json结果
    const sql = `update category set cate_name = '${cate_name}',orderBy = ${orderBy} 
    where cate_id = ${cate_id}`;
    const {
        affectedRows
    } = await query(sql)
    const successData = {
        code: 0,
        message: 'update success'

    }
    const failData = {
        code: 1,
        message: 'fail success'
    }

    if (affectedRows > 0) {
        res.json(successData)
    } else {
        res.json(failData)
    }
}
// 分类删除
CateController.delCateData = async (req, res) => {
    const {
        cate_id
    } = req.body;
    const sql = `delete from category where cate_id = ${cate_id}`
    const {
        affectedRows
    } = await query(sql)
    const successData = {
        code: 0,
        message: 'delete success'
    }
    const failData = {
        code: 1,
        message: 'delete fail'
    }

    if (affectedRows > 0) {
        res.json(successData)
    } else {
        res.json(failData)
    }
}
// 分类添加
CateController.addCateData = async (req, res) => {
    const { cate_name, orderBy } = req.body;
    const sql = `insert into category(cate_name,orderBy) values('${cate_name}',${orderBy})`;
    const { affectedRows } = await query(sql);
    const successData = {
        code: 0,
        message: '添加成功'
    }
    const failData = {
        code: 1,
        message: '添加失败'
    }


    if (affectedRows > 0) {
        res.json(successData);
    } else {
        res.json(failData);
    }
}
// 统计分类文章总数
CateController.cateCount = async (req, res) => {
    const sql = 'select count(t1.id) total,t2.cate_name  from article t1 left join category t2 on t1.cate_id = t2.cate_id group by t1.cate_id';
    let result = await query(sql)
    result = result.map(item => {
        if (!item.cate_name) {
            item.cate_name = '未分类'
        }
        return item;
    })
    res.json(result)
}



module.exports = CateController;