module.exports = {
    head: (data) => {
        let { res } = data
        res.status(200).send(`ping true`)
    },
    get: async (data) => {
        let { res } = data
        res.sendFile(__dirname + '/html/main.html')
    }
}