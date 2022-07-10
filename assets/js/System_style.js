; (function () {
    async function system() {
        let { data } = await $.get('/systemData')
        let logoText = ''
        let blogLogo = ''
        for (let item of data) {
            if (item.name === 'logoText') {
                logoText = item.val;
            } else if (item.name === 'blogLogo') {
                blogLogo = item.val;
            }
        }
        $("#logoText").text(logoText)
        // 存储到本地存储或cookie，供其他页面使用
        localStorage.setItem('logoText', logoText)
        $("#logo").attr('src', `${blogLogo}`)
        localStorage.setItem('blogLogo', blogLogo)
    }
    system()
}
)()