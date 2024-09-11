const fs = require('fs')
const express = require('express');
const https = require('https');

module.exports = (path, sequelize) => {
    const app = express();
    app.use(express.json())
    const port = 1444;
    let saits = new Map()
    const server = https.createServer(
        {
            key: fs.readFileSync(`${path}/src/key.pem`),
            cert: fs.readFileSync(`${path}/src/cert.pem`),
            ca: [fs.readFileSync(`${path}/src/ca1.pem`), fs.readFileSync(`${path}/src/ca2.pem`)]
        },
        app
    ).listen(port, () => {
        console.log(`Server listens https://gamesggge.ru  port: ${port}`);
    });
    app.use('/img', (req, res, next) => {
        console.log(`============================ >>`);
        console.log(req.method + ' ' + req._parsedUrl.pathname);
        console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
        console.log(`============================ >>`);
        res.setHeader('Cache-Control', 'max-age=2592000');
        next()
    }, express.static(`${__dirname}/server/img`));
    app.use('/js', express.static(`${__dirname}/server/js`))
    app.use('/css', express.static(`${__dirname}/server/css`))

    app.all(`*`, async (req, res) => {
        try {
            console.log(`============================ >>`)
            console.log(req.method + ` ` + req._parsedUrl.pathname)
            console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress)

            function scanDirectory(directoryPath) {
                fs.readdir(directoryPath, async (err, files) => {
                    if (err) {
                        console.error('Ошибка чтения директории:', err);
                        return;
                    }

                    files.forEach(async (file) => {
                        const filePath = `${directoryPath}/${file}`
                        if (fs.statSync(filePath).isDirectory()) {
                            scanDirectory(filePath);
                        } else {
                            const relativePath = filePath.replace(`${path}/server/`, '');
                            saits.set("/" + relativePath, "/" + relativePath);
                        }
                    });
                });
            }

            scanDirectory(`${path}/server`);
            let pathname = req._parsedUrl.pathname.replace(/[0-9/]*$/, "");
            let sait = await saits.get(pathname.toLowerCase() + `.js`)
            if (pathname.toLowerCase() === undefined || pathname.toLowerCase() === "") sait = `main.js`
            if (sait === undefined || sait === null) {
                return res.status(404).send(`ошибка 404`)
            } else {
                let data = {
                    req,
                    res,
                    path,
                    sequelize
                }
                delete require.cache[require.resolve(__dirname + `/server/` + sait)];
                sait = await require(__dirname + `/server/` + sait)
                await sait[req.method.toLowerCase()](data).catch(err => {
                    console.log(err)
                    return res.status(500).send(`ошибка 500`)
                })
            }
        } catch (err) {
            console.log(err)
            return res.status(500).send(`ошибка 500`)
        } finally {
            console.log(`============================ <<`)
        }
    })
}