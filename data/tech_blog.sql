/*
Navicat MySQL Data Transfer

Source Server         : 本地主机
Source Server Version : 50553
Source Host           : 127.0.0.1:3306
Source Database       : tech_blog

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2022-04-09 10:38:12
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(30) DEFAULT '' COMMENT '标题',
  `content` text COMMENT '内容',
  `author` int(11) DEFAULT '0' COMMENT '所属某个用户id',
  `status` tinyint(4) DEFAULT '0' COMMENT '文章状态 0-待审核 1-通过',
  `add_date` datetime DEFAULT NULL COMMENT '添加时间',
  `pic` varchar(200) DEFAULT '' COMMENT '图片封面路径',
  `cate_id` int(11) DEFAULT '0' COMMENT '所属分类的id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of article
-- ----------------------------
INSERT INTO `article` VALUES ('1', 'CSS居中', 'CSS居中CSS居中CSS居中', '1', '0', '2022-04-22 15:09:06', '', '1');

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `cate_id` int(11) NOT NULL AUTO_INCREMENT,
  `cate_name` varchar(30) DEFAULT '',
  `orderBy` int(11) DEFAULT '0' COMMENT '排序字段',
  PRIMARY KEY (`cate_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES ('1', 'css-vue-react', '1000');
INSERT INTO `category` VALUES ('2', 'JS-小程序', '2828');
INSERT INTO `category` VALUES ('5', 'node', '5');

-- ----------------------------
-- Table structure for settings
-- ----------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `val` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of settings
-- ----------------------------
INSERT INTO `settings` VALUES ('1', 'logoText', '小白技术博客');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) DEFAULT NULL,
  `password` char(32) DEFAULT NULL,
  `avatar` varchar(200) DEFAULT NULL,
  `intro` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------