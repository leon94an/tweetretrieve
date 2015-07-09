if (Meteor.isServer) {

    Tinytest.add("getTweets method stores correct tweets in mongo", function(test) {
    		var query={keyword: "dogs"};
        test.equal(Tweets.find(query).count(), 0);
        Meteor.call('grabResults', query);
        test.notEqual(Tweets.find(query).count(), 0);

        // Tweets.remove({});
    });
}