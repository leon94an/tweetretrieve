if (Meteor.isServer) {
    tweetRetrieve.init({
        cacheDuration: 5000,
        maximumTweets: 1000,
        oath: {
            consumer_key: 'xxx',
            consumer_secret: 'xxx',
            access_token: 'xxx',
            access_token_secret: 'xxx',
        }
    });
}

if (Meteor.isClient) {
    Template.feed.helpers({
        query: function() {
            return {
                username: "times",
                count: 5
            }
        }
    })
}