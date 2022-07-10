// 导入模型
const query = require('../model/query.js')

const HomeController = {};


// 分类接口
HomeController.cate = async (req, res) => {
    const sql = 'select * from category order by orderBy desc'
    const result = await query(sql)
    res.json(result)
}

// 文章分页接口
HomeController.article = async (req, res) => {
    const {
        page = 1, pagesize = 5
    } = req.query;
    const offset = (page - 1) * pagesize;
    const sql = `SELECT
            t1.*, t2.cate_name,t3.username FROM article t1
        LEFT JOIN category t2 ON t1.cate_id = t2.cate_id
        left join users t3 on t1.author = t3.id
        where t1.status = 1
        order by t1.id desc
        limit ${offset},${pagesize}`
    let result = await query(sql)
    result = result.map(item => {
        item.host = 'http://127.0.0.1:4700/'
        return item;
    })
    res.json(result)
}

// 获取文章详情
HomeController.fetchOneArt = async (req, res) => {
    const {
        id
    } = req.query;
    const sql = `select t1.*,t2.cate_name from article t1 left join category t2 on t1.cate_id = t2.cate_id where t1.id = ${id}`
    const result = await query(sql);
    res.json(result[0] || {})

}

// 获取指定分类下面的所有的文章
HomeController.fetchCateArt = async (req, res) => {
    const {
        cate_id
    } = req.query;
    const sql = `select t1.*,t2.cate_name from article t1 left join category t2 on t1.cate_id = t2.cate_id where t1.cate_id = ${cate_id}`
    let result = await query(sql);
    result = result.map(item => {
        item.host = 'http://127.0.0.1:4700/'
        return item;
    })
    res.json(result)

}



module.exports = HomeController;