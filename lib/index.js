var
	levenshtein = require('levenshtein'),
	request = require('request'),
	unidecode = require('unidecode');


var echonester = (function (self) {
	'use strict';

	self = self || {};

	var defaultOptions = {
		apiKey : '',
		searchResultLimit : 10,
		searchUrl : 'https://developer.echonest.com/api/v4/song/search',
		timeout : 10000 // 10 seconds
	};

	function closestMatch (artist, title, matches) {
		var
			bestDistance = null,
			bestMatch = null,
			distance = 0;

		// sanitize query
		artist = sanitize(artist);
		title = sanitize(title);

		matches.some(function (match) {
			/* jshint camelcase:false */
			distance = new levenshtein(
				artist + ' ' + title,
				sanitize(match.artist_name) + ' ' + sanitize(match.title))
			.distance;

			if (bestDistance === null || distance < bestDistance) {
				bestDistance = distance;
				bestMatch = match;
			}

			// 0 is an exact match - no need to process further
			return bestDistance === 0;
		});

		return bestMatch;
	}

	function sanitize (term) {
		var
			i = 0,
			reFeaturing = /\sfeat(uring)?/ig, // match " feat" and " featuring"
			reNonAllowableChar = /[^\#\*\+\.\-_'a-zA-Z 0-9]+/g; // match anything that is not alpha, numeric, space, -, ., _, + and '

		term = unidecode(term.toLowerCase())
			.replace(reNonAllowableChar, ' ') // remove unallowed chars !
			.split(/\s+/).join(' '); // normalize      spaces

		// remove featuring
		i = term.search(reFeaturing);
		if (i > 0) {
			term = term.substring(0, i);
		}

		return term.trim();
	}

	self.findBestMatch = function (artist, title, callback) {
		var match = null;

		self.search(artist, title, function (err, result) {
			if (err) {
				return callback(err);
			}

			if (Array.isArray(result) && result.length > 0) {
				match = closestMatch(artist, title, result);
			}

			return callback(null, match);
		});
	};

	self.search = function (options, artist, title, callback) {
		if (typeof callback === 'undefined' && typeof title === 'function') {
			callback = title;
			title = artist;
			artist = options;
			options = {};
		}

		// sanitize query params
		artist = sanitize(artist);
		title = sanitize(title);

		var
			bucket = options.bucket || self.options.bucket || undefined,
			querystring = [
				'api_key=',
				options.apikey || self.options.apikey,
				'&artist=',
				encodeURIComponent(artist),
				'&title=',
				encodeURIComponent(title),
				'&results=',
				options.limit || self.options.searchResultLimit,
				'&start=',
				options.start || 0].join(''),
			result = {};

		// add each requested bucket to the querystring
		if (bucket) {
			if (!Array.isArray(bucket)) {
				bucket = [bucket];
			}

			bucket.forEach(function (b) {
				querystring = [querystring, '&bucket=', b].join('');
			});
		}

		/* jshint camelcase:false */
		request({
			method : 'GET',
			timeout : self.options.timeout,
			uri : [self.options.searchUrl, querystring].join('?')
		}, function (err, res, body) {
			if (err) {
				return callback(err);
			}

			if (body) {
				try {
					result = JSON.parse(body).response;
				} catch (ex) {
					err = new Error('unexpected response from server');
					err.body = body;
					err.statusCode = res.statusCode;

					return callback(err);
				}
			}

			if (res.statusCode >= 200 && res.statusCode <= 299) {
				return callback(null, result.songs);
			}

			// provide more details in this case
			result.statusCode = res.statusCode;

			return callback(result);
		});
	};

	return function (options) {
		options = options || {};

		// apply default for missing keys
		Object.keys(defaultOptions).forEach(function (key) {
			if (typeof options[key] === 'undefined') {
				options[key] = defaultOptions[key];
			}
		});

		self.options = options;

		return self;
	};
}({}));

exports = module.exports = echonester;
exports.initialize = echonester;
