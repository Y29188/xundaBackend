var express = require('express');
var router = express.Router();

// 导入Home控制器
const HomeController = require('../controller/HomeController.js');

// 编辑文章接口
router.get('/article', HomeController.article)

// 分类接口
router.get('/cate', HomeController.cate)

// 获取单页文章详情
router.get('/fetchOneArt', HomeController.fetchOneArt)

// 获取指定分类下面的所有文章
router.get('/fetchCateArt', HomeController.fetchCateArt)

module.exports = router;