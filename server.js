const express = require('express');
const path = require('path');
const cors = require('cors');
const artTemplate = require('art-template');
const express_template = require('express-art-template');
const session = require('express-session');
const checkSessAuth = require('./middleware/checkSessAuth');

// 导入环境变量
require('dotenv').config()
console.log(process.env.db_username);
console.log(process.env.db_password);

// 导入路由模块中间件
const router = require('./router/router.js');
const apiRouter = require('./router/apiRouter.js');

const app = express();

app.use(cors());

// 设置托管静态资源
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 初始化session
app.use(session({
    name: 'sessionID',
    secret: "@%$#$%34353^&%^12",
    cookie: {
        path: "/",
        httpOnly: true,
        maxAge: 60000 * 24, // 设置有效期为24分钟，说明：24分钟内，不访问就会过期，如果24分钟内访问了。则有效期重新初始化为24分钟。
    }
}))

// 注册前台路由
app.use('/api', apiRouter);

// 中间件，判断session阻止翻墙
app.use(checkSessAuth)


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({
    extended: true
})) // for parsing application/x-www-form-urlencoded


// 配置模板的路径
app.set('views', __dirname + '/views/');
// 设置express_template模板后缀为.html的文件(不设这句话，模板文件的后缀默认是.art)
app.engine('html', express_template);
// 设置视图引擎为上面的html
app.set('view engine', 'html');


app.use(router)

app.listen(4700, () => {
    console.log('server is running at port 4700')
})