var
	echonester = require('./lib'),

	client = echonester({
		apikey : process.env.ECHONEST_APIKEY || 'FILDTEOIK2HBORODV' // example key used on Echonest site
	});

/*
client.findBestMatch('beck', 'loser', function (err, result) {
	if (err) {
		console.error(err);
	}

	if (result) {
		console.log('best match:');
		console.log(result);
	}
});
//*/

client.findBestMatch('Roots', '@15', function (err, result) {
	if (err) {
		console.error(err);
	}

	if (result) {
		console.log('best match:');
		console.log(result);
	}
});

/*
client.search('beck', 'loser', function (err, result) {
	if (err) {
		console.error(err);
	}

	if (result) {
		console.log('search:');
		console.log(result);
	}
});
//*/
