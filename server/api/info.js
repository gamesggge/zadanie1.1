const fs = require('fs');
const path = require('path');
module.exports = {
    get: async (data) => {
        let { req, res } = data
        res.setHeader('Content-Type', 'application/json');
        const apiFolderPath = path.join(client.path, "/server/api");
        const apiVersions = {};

        for (let i = 1; ; i++) {
            const versionFolder = `v${i}`;
            const versionFolderPath = path.join(apiFolderPath, versionFolder);

            if (fs.existsSync(versionFolderPath)) {
                const filesInVersion = fs.readdirSync(versionFolderPath);
                const jsFiles = filesInVersion.filter(file => file.endsWith('.js'));
                if (jsFiles.length > 0) {
                    apiVersions[versionFolder] = jsFiles.map(file => file.replace('.js', ''));
                }
            } else {
                break;
            }
        }

        if (Object.keys(apiVersions).length > 0) {
            console.log(apiVersions)
            return res.json(apiVersions);
        } else {
            return res.status(404).send("No API versions found");
        }
    }
}