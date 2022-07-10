module.exports = {
    host: "localhost", // 主机
    port: '3306', // 端口
    user: process.env.db_username, // 用户名
    password: process.env.db_password, // 密码
    database: "blog" // 数据库
}
