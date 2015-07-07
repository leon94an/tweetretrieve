if (Meteor.isServer) {
    tweetRetrieve.init({
        cacheDuration: 5000,
        maximumTweets: 1000,
        oath: {
            consumer_key: 'xxx', // API key
            consumer_secret: 'xxx', // API secret
            access_token: 'xxx',
            access_token_secret: 'xxx'
        }
    });
}