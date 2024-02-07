const fs = require("node:fs");
const cheerio = require('cheerio');

const startFetching = async () => {

	console.log("start fetching...");

	const url = "https://orenjispark-website.vercel.app";
	const res = await fetch(url);

	console.log("done fetching");

	if (res.ok) {
		const games = [];

		const data = await res.text();
		const html = cheerio.load(data);

		const gameCards = html('.game-card');

		for (const gameCard of gameCards) {
			const game = {};

			const cardHtml = cheerio.load(gameCard);

			const gameUrl = cardHtml('a');
			game.url = gameUrl[0].attribs.href;

			const images = cardHtml('img');


			for (const image of images) {
				if (image.attribs.alt == "game engine") {
					game.engineUrl = url + image.attribs.src;
				}
				else {
					game.iconUrl = url + image.attribs.src;
				}
			}

			games.push(game);
		}

		saveFile('games.json', games);
	}
	else {
		console.err("error fetch : ", res);
	}
};

function saveFile(path, data) {
	try {
		console.log("saving file...");
		fs.writeFileSync(path, JSON.stringify(data));
		console.log("finish save file");
	} catch (err) {
		console.error(err);
	}
}


startFetching();