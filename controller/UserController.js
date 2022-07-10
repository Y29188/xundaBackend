const path = require('path')
const fs = require('fs')
// const md5 = require('md5')
const {
    promisify
} = require('util');

// 导入模型
const query = require('../model/query.js')

const UserController = {};
const { password_secret } = require('../config/config.js')

const rename = promisify(fs.rename)

// 用户登录
UserController.userLogin = async (req, res) => {
    // 1. 接受参数
    let {
        username,
        password
    } = req.body;
    // 2. 拼接sql语句，查询用户名和密码是否匹配
    // password = md5(`${password}${password_secret}`)
    const sql = `select * from users where username = '${username}' and password = '${password}'`
    // 3. 成功
    const result = await query(sql)
    if (result.length > 0) {
        // 将信息记录到session或cookie
        req.session.userInfo = result[0];
        res.cookie('userInfo', JSON.stringify(result[0]), {
            expires: new Date(Date.now() + 1 * 3600000),
        })
        res.json({
            code: 0,
            message: 'login success'
        })
    } else {
        // 失败则提示用户
        res.json({
            code: -2,
            message: 'login fail'
        })
    }

}

// 退出
UserController.userLogout = async (req, res) => {
    // 1. 清除session
    req.session.destroy(function (err) {
        if (err) {
            throw err;
        }
    })
    // 2. 响应json
    res.json({
        code: 0,
        message: 'logout success'
    })

}
// 修改个人信息
UserController.updUserInfo = async (req, res) => {
    const {
        id,
        intro
    } = req.body;
    const sql = `update users set intro = '${intro}' where id = ${id}`;
    const {
        affectedRows
    } = await query(sql)
    const successData = {
        code: 0,
        message: 'update user success'
    }
    const failData = {
        code: -5,
        message: 'update user fail'
    }

    if (affectedRows > 0) {
        // 取出用户信息，再同步session和cookie中的用户信息
        const sql = `select * from users where id = ${id}`
        const result = await query(sql)
        // 将信息记录到session或cookie
        req.session.userInfo = result[0];
        res.cookie('userInfo', JSON.stringify(result[0]), {
            expires: new Date(Date.now() + 1 * 3600000),
        })

        res.json(successData)
    } else {
        res.json(failData)
    }
}
// 上传用户头像
UserController.avatar = async (req, res) => {
    // 1. 获取用户在session中的信息
    const {
        id
    } = req.session.userInfo;
    // 2. 负责文件上传
    let pic = ''
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
            // 删除原图，先得到旧图的路径(从session中获取)
            // uploads/861b974ce9f4bf19e826ebcf1cd7ed64.jpg
            let oldAvatar = req.session.userInfo.avatar;
            oldAvatar = path.join(path.dirname(__dirname), oldAvatar)
            fs.unlink(oldAvatar, () => { })
        } catch (err) {
            console.log('上传失败')
        }

        // 上传成功，把路径写到sql语句中，接着更新到数据库中
        const sql = `update users set avatar = '${pic}' where id = ${id}`
        await query(sql)
        // 取出用户信息，然后再同步session和cookie中的用户信息
        const sql2 = `select * from users where id = ${id}`
        const result = await query(sql2)
        // 将信息记录到session或cookie
        req.session.userInfo = result[0];
        res.cookie('userInfo', JSON.stringify(result[0]), {
            expires: new Date(Date.now() + 1 * 3600000),
        })
        res.json({
            code: 0,
            message: 'upload success'
        })
    } else {
        res.json({
            code: -6,
            message: 'upload fail',

        })
    }
}

// 修改用户登录密码
UserController.newPassword = async (req, res) => {
    let { id, oldpassword, newpassword } = req.body
    oldpassword = md5(`${oldpassword}${password_secret}`)
    newpassword = md5(`${newpassword}${password_secret}`)
    const sql1 = `select password from users where password = '${oldpassword}'`;
    const results1 = await query(sql1);
    if (results1.length > 0) {
        const sql2 = `update users set password = '${newpassword}' where id = ${id}`;
        const { affectedRows } = await query(sql2);
        if (affectedRows > 0) {
            res.json({ err: '20000', msg: '修改密码成功。' })
        } else {
            res.json({ err: '20006', msg: '修改密码失败。' })
        }
    } else {
        res.json({ err: '20005', msg: '旧密码不正确。' })
    }
}

module.exports = UserController;