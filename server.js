const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    let body = null;

    try {
        const ext = req.url.split('.')[1]
        const ifSvg = ext === 'svg'
        if (ifSvg) {
            res.setHeader('Content-Type', 'image/svg+xml')
        }
        
        body = fs.readFileSync(`./public${req.url}`)
    } catch {
        body = fs.readFileSync(`./public/index.html`)
    }

    res.end(body);
});

const port = process.env.PORT || 3000;

server.listen(port);

console.log(`Server started on port ${port}!`);