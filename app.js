var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
const { parse } = require('querystring');

http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true)

    let file = '.' + req.url;
    if (file == './') file = './index.html';
    let extension = String(path.extname(file)).toLowerCase();
    let mime = {
        '.html': 'text/html'
    }
    let type = mime[extension] || 'application/octet-stream';


    if (reqUrl.pathname === '/message' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            body = parse(body);
            fs.appendFile('message.txt', body.message + "\n", (err) => {
                if (err) throw err;
                console.log('Saved!');
            });
            res.end('Form Submitted Sucessfully');
        });

    } else {

        fs.readFile(file, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    fs.readFile('./404.html', (error, content) => {
                        res.writeHead(200, {
                            'Content-Type': type
                        });
                        res.end(content, 'utf-8');
                    });
                } else {
                    res.writeHead(500);
                    res.end('Error: ' + err.code + '\n');
                    res.end();
                }
            } else {
                res.writeHead(200, {
                    'Content-Type': type
                });
                res.end(content, 'utf-8');
            }
        })
    }

}).listen(8080);

console.log("Running on port " + 8080);