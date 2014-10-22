# Echonester

Simple Echonest search library that provides song search and best match retrieval from the Echonest API

## Install

```bash
npm install echonester
```

## Usage:

In your code, require the `echonester` module as follows.

```javascript
var echonester = require('echonester');

var client = echonester();

client.search('foo fighters', 'breakout', function (err, result) {
  // work with results here...
});
```

### Options:

* apikey - Your Echonest API key
* searchResultLimit - Max number of results to return from search (defaults to 10)
* searchUrl - URL of API endpoint (defaults to `https://developer.echonest.com/api/v4/song/search`)
* timeout - Timeout for request in milliseconds (defaults to `10000`)

```javascript
var echonester = require('echonester');

var client = echonester({
  apikey : 'YOUR KEY HERE',
  searchResultLimit : 10,
  searchUrl : 'https://developer.echonest.com/api/v4/song/search',
  timeout : 10000
});
```

### Find Best Match

Find the single best match for a search:

`client.findBestMatch(artist, title, callback)`

```javascript
var client = (require('echonester')());

client.findBestMatch('beck', 'loser', function (err, result) {
  if (err) {
    console.error(err);
  }

  console.log(result);
});
```

Which returns the following response:

```javascript
{ artist_id: 'ARC2XR11187FB5CC95',
  id: 'SOGKSOJ14373B756E5',
  artist_name: 'Beck',
  title: 'Loser' }
```

### Search

Find all matches for a search:

`client.search(options, artist, title, callback)`

_Please note, the `options` parameter is optional and can be omitted_

```javascript
var
  client = (require('echonester')()),
  options = {
    limit : 10,
    start : 0
  };

client.search(options, 'beck', 'loser', function (err, result) {
  if (err) {
    console.error(err);
  }

  console.log(result);
});
```

Which returns the following response:

```javascript
[ { artist_id: 'ARC2XR11187FB5CC95',
    id: 'SOGKSOJ14373B756E5',
    artist_name: 'Beck',
    title: 'Loser' },
  { artist_id: 'ARC2XR11187FB5CC95',
    id: 'SOFWZUR12AF729EC33',
    artist_name: 'Beck',
    title: 'Loser' },
  { artist_id: 'ARC2XR11187FB5CC95',
    id: 'SOQXVQS12B0B8076CA',
    artist_name: 'Beck',
    title: '06 - Loser' },
  { artist_id: 'ARC2XR11187FB5CC95',
    id: 'SOLHXQF137395C36F0',
    artist_name: 'Beck',
    title: 'LOSER (Outro Fade)/(CONTENT!)' },
  { artist_id: 'ARC2XR11187FB5CC95',
    id: 'SOWZWBR13D52FA4048',
    artist_name: 'Beck',
    title: 'Loser [Fatboy Slim Remix]' } ]
```
