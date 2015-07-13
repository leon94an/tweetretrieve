var Tweets = Mongo.Collection.get('tweets');

var testQuery = {
    username: "VICE",
}
var testCount = 5;



if (Meteor.isServer) {
    fs = Npm.require('fs');
    var jsonPath = __meteor_bootstrap__.serverDir + '/assets/packages/local-test_leon94an_tweetretrieve/test/test_key.json'

    var apikeys;

    Tinytest.add("[test set-up] make sure keys in json are not blank", function(test) {
        apikeys = JSON.parse(fs.readFileSync(jsonPath).toString());

        test.notEqual(apikeys["consumer_key"], "xxx");

    });

    Tinytest.add("[test set-up] initialize package", function(test) {
        tweetRetrieve.init({
            oath: apikeys
        });
    });



    Tinytest.add("grabResults method stores correct keyword query in mongo", function(test) {

        Tweets.remove({});

        var query = {
            keyword: "dogs"
        };
        test.equal(Tweets.find({
            "query": "keyword_" + query["keyword"]
        }).count(), 0);
        Meteor.call('grabResults', query, function(err) {
            if (err) {
                console.log(err);
            }
        })
        test.notEqual(Tweets.find({
            "query": "keyword_" + query["keyword"]
        }).count(), 0);

        test.equal(Tweets.find({
            "query": "keyword_" + query["keyword"]
        }).count(), 100);

        Tweets.remove({});

    });

    Tinytest.add("grabResults method stores correct username query in mongo", function(test) {

        Tweets.remove({});

        var query = testQuery;

        test.equal(Tweets.find({
            "query": "username_" + query["username"]
        }).count(), 0);
        Meteor.call('grabResults', query, function(err) {
            if (err) {
                console.log(err);
            }
        })
        test.notEqual(Tweets.find({
            "query": "username_" + query["username"]
        }).count(), 0);

        test.equal(Tweets.find({
            "query": "username_" + query["username"]
        }).count(), 100);

    });
}

if (Meteor.isClient) {

    Tinytest.addAsync("subscribe publish the correct selection of tweets", function(test, next) {

        Meteor.subscribe("tweets", {
                query: testQuery,
                count: testCount
            },
            function(err, result) {
                test.equal(Tweets.find().count(), testCount);
                this.stop();
                next();
            });
    });

    Tinytest.add("template renders as expected", function(test) {
        var instance = Blaze.renderWithData(Template.tweetRetrieve, {
            query: testQuery,
            count: 5
        }, document.body);

        instance.rendered(function(){
            console.log("instance",$(instance.firstNode()));
        });
        // console.log(instance.toHTMLWithData());
    });
}