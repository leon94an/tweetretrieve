# TweetRetrieve

**A Simple Twitter Feed Retriever**

This TwitterPackage provides developers a simple API for querying twitter usernames and returning a desired number of recent tweets. Twitter retrieval is done through [twit](https://github.com/ttezel/twit). Tweet retrievals are done on the server and are stored in mongo.  The number of tweets stored for a particular query is capped at 100 by default. Queries are cached for a set number milliseconds before refreshing upon request (default is 1 minutes). Both fields can be changed upon initialization. 

## Quick Start

```meteor add leon94an:tweetretrieve```

## Usage

On the Server-side:
```javascript
if (Meteor.isServer) {
    tweetRetrieve.init({
        cacheDuration: xxx, // optional: cache duration in milliseconds
        maximumTweets: xxx, // optional: maximum number of stored tweets per query
        oath: {
            consumer_key: 'xxx', // API key
            consumer_secret: 'xxx', // API secret
            access_token: 'xxx',
            access_token_secret: 'xxx'
        }
    });
}
```
OAuth authentication keys need to be provided by the user in order to receive access to the twitter API. This can be within the project level using the twitterpackage.init() function. Additionally, the cache duration and maximum number of stored tweets for queries can be modified.

Queries can be returned by calling the tweetRetrieve template as such:
```
{{>tweetRetrieve username="VICE" count=5}}
```
The username field is the screen name of the twitter user being queried, while count is the number tweets to be returned.

## Author
Leon An, July 2015

MIT license