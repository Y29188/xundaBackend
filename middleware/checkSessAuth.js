
module.exports = (req, res, next) => {
    // 放行的路由
    const notSessAuth = ['/login', '/userlogin'];
    const reqPath = req.path.toLowerCase()
    if (notSessAuth.includes(reqPath)) {
        next();
    } else {
        // 判断session，有效持续操作，无效重新定向到登录页面
        if (req.session.userInfo) {
            next();
        } else {
            res.redirect('/login')
            return;
        }
    }
}