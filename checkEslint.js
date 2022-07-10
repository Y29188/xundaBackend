const chokidar = require('chokidar');
const execSh = require('exec-sh');

console.log(777);
// 监听目录src的变化
chokidar.watch('./controller').on('all', (event, path) => {
    console.log(event, path);
    // 文件修改了，自动执行eslint检测语法
    if (event === 'change') {
        // console.log('检测语法');
        // 执行文件
        execSh('npm run lint', (err) => {
            console.log('err:', err);
        })
    }
})