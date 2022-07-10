const path = require('path')
const fs = require('fs');
const moment = require('moment')
const ArtController = {};
const { promisify } = require('util');

// 导入模型
const query = require('../model/query.js');


const rename = promisify(fs.rename)


ArtController.index = (req, res) => {
    res.render('articlelist.html')
}

// 文章数据接口
ArtController.artData = async (req, res) => {
    // 1. 接收页码和每页显示的条数
    const {
        page,
        limit,
        keyword
    } = req.query;
    // 2. 查询总记录数
    let sql1 = 'select count(id) as count from article where 1 ';
    if (keyword) {
        sql1 += ` and title like '%${keyword}%' `
    }
    const result = await query(sql1)
    const {
        count
    } = result[0]
    // 3. 根据page和limit获取指定页码的数据
    // 查询起始位置 : （当前页-1）* 每页显示的条数
    // page=1 offset = 0,2，每页显示2条
    // page=2 offset = 2,2，以此类推

    const offset = (page - 1) * limit;
    let sql2 = `select t1.*,t2.cate_name,t3.username from article t1 
        left join category t2 on t1.cate_id = t2.cate_id 
        left join users t3 on t1.author = t3.id 
        where 1 `

    if (keyword) {
        sql2 += ` and t1.title like '%${keyword}%'`;
    }
    sql2 += `order by t1.id desc
    limit ${offset},${limit}`

    let data = await query(sql2)
    data = data.map((item) => {
        const {
            add_date,
            status,
            cate_name,
            username
        } = item;
        item.statusText = status == 1 ? '审核通过' : '审核中'
        item.cate_name = cate_name || '未分类'
        item.username = username || '匿名者'
        item.add_date = moment(add_date).format('YYYY-MM-DD HH:mm:ss')
        return item;
    })
    // 4. 响应数据
    res.json({
        count,
        data,
        code: 0,
        msg: 'sucess'
    })
}

// 文章添加页面
ArtController.addArticle = (req, res) => {
    res.render('addArticle.html')
}

// 文章添加接口
ArtController.addArtData = async (req, res) => {
    // 1. 接收参数
    const {
        title,
        cate_id,
        status,
        content
    } = req.body;
    // 未完成
    const add_date = moment().format('YYYY-MM-DD HH:mm:ss')
    const author = req.session.userInfo.id;
    let pic = '';
    // 上传文件
    if (req.file) {
        // 2. 上传文件得到路径
        let {
            originalname,
            filename
        } = req.file;
        let extName = originalname.substring(originalname.lastIndexOf('.'))
        let uploadDir = './uploads'
        let oldName = path.join(uploadDir, filename);
        let newName = path.join(uploadDir, filename) + extName;

        try {
            await rename(oldName, newName)
            pic = `uploads/${filename}${extName}`

        } catch (err) {
            console.log('上传失败')
        }


    }
    console.log(pic);
    // 2. 编写sql语句
    let sql = `insert into article(title,cate_id,status,content,add_date,author,pic) 
            values('${title}','${cate_id}','${status}','${content}','${add_date}','${author}','${pic}')`
    const {
        affectedRows
    } = await query(sql)
    // 3. 返回结果
    if (affectedRows > 0) {
        res.json({
            code: 0,
            message: '添加文章成功'
        })
    } else {
        res.json({
            code: -7,
            message: '添加文章失败'
        })
    }
}

// 文章删除接口
ArtController.delArtData = async (req, res) => {
    const {
        id
    } = req.body;
    // 通过id获取文章的pic路径
    let rows = await query(`select pic from article where id = ${id}`)
    let pic = rows[0].pic;
    // 编写sql语句
    const sql = `delete from article where id = ${id}`
    const {
        affectedRows
    } = await query(sql)
    // 删除对应的封面图文件
    if (affectedRows > 0) {
        const picPath = path.join(path.dirname(__dirname), pic); // 获取完整路径
        fs.unlink(picPath, () => { })
        res.json({
            code: 0,
            message: 'delete sucess'
        })
    } else {
        res.json({
            code: -7,
            message: 'delete fail'
        })
    }
}

// 展示编辑文章页面
ArtController.editArt = (req, res) => {
    res.render('editArticle.html')
}

ArtController.reviseOneArt = async (req, res) => {
    // 1. 接收参数
    let {
        i
    } = req.query
    // 2. 查询单条的sql语句
    const sql = `select * from article where id = ${i}`;
    const result = await query(sql);
    res.json(result[0]);
}

ArtController.updArtData = async (req, res) => {
    // 1. 接收参数
    let {
        id,
        title,
        content,
        cate_id,
        isUpdPic,
        status,
        oldPic
    } = req.body;
    // 2. 是否上传文件
    let pic = '';
    let sql;
    if (isUpdPic == 1) {
        // 上传文件
        let {
            originalname,
            filename
        } = req.file;
        let extName = originalname.substring(originalname.lastIndexOf('.'));
        let uploadDir = './uploads';
        let oldName = path.join(uploadDir, filename);
        let newName = path.join(uploadDir, filename) + extName;

        try {
            await rename(oldName, newName);
            pic = `uploads/${filename}${extName}`;
            let oldPicFullPath = path.join(path.dirname(__dirname), oldPic);
            fs.unlink(oldPicFullPath, () => { })
        } catch (err) {
            console.log('上传失败')
        }
        sql = `update article set title='${title}',content='${content}',cate_id='${cate_id}',status='${status}', pic='${pic}' where id = ${id} `;
    } else {
        sql = `update article set title='${title}',content='${content}',cate_id='${cate_id}',status='${status}' where id = ${id} `;
    }

    // 3. 执行sql语句
    const {
        affectedRows
    } = await query(sql)
    if (affectedRows > 0) {
        res.json({
            code: 0,
            message: 'update success'
        })
    } else {
        res.json({
            code: -9,
            message: 'update fail'
        })
    }
}


module.exports = ArtController;