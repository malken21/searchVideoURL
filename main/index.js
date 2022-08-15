const https = require('https');
const http = require('http');
const url = require('url');

const Config = require("./Config.json");

let cache = {}

const server = http.createServer(async (req, res) => {

	const query = url.parse(req.url, true).query;

	if (query.searchVideo) {//?searchVideo=[text]

		//----------キャッシュ----------//
		if (cache[query.searchVideo]) {
			if (((new Date - cache[query.searchVideo].time) - 300000) <= 0) {
				res.writeHead(302, {
					'Location': `https://youtube.com/watch?v=${cache[query.searchVideo].id}`
				});
				res.end();
				console.log("cache: " + query.searchVideo)
				return;
			}
		}

		//----------通常----------//
		const data = await getGAS("searchVideo", query.searchVideo);
		if (data.error) {
			error(res);
			return;
		}
		const id = data.searchVideo.main.id;
		res.writeHead(302, {
			'Location': `https://youtube.com/watch?v=${id}`
		});
		res.end();
		cache[query.searchVideo] = { id: id, time: new Date }
		console.log(query.searchVideo)
		return;
	}
	error(res);
});
const port = Config.port;
server.listen(port, () => {//起動時
	console.info('port: ' + port);
});

function getGAS(type, text) {//GASに接続
	return new Promise((resolve) => {
		https.get(`${Config.GAS}?${type}=${encodeURIComponent(text)}`, (res) => {
			https.get(res.headers.location, (res) => {
				let data = "";
				res.setEncoding("utf8");
				res.on("data", (chunk) => {
					data += chunk;
				});
				res.on("end", () => {
					resolve(JSON.parse(data));
				});
			});

		});
	});
}

function error(res) {//それ以外の時に実行
	res.writeHead(200, {
		"Content-Type": "text/html"
	});
	res.end("null");
}