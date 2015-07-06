Tweets = new Mongo.Collection("tweets")

if (Meteor.isServer) {

    var myKey = {
        consumer_key: 'xxx',
        consumer_secret: 'xxx',
        access_token: 'xxx',
        access_token_secret: 'xxx'

    }
   
    twitterPackage = {
        init: function(userKey) {
            myKey = userKey;
        }
    };

    var T;

    var getTweets = function(username, count, callback) {
        T.get('statuses/user_timeline', {
                screen_name: username,
                count: count
            },
            function(err, data) {
                callback(err, data);
            }
        );
    }


    var storeTweets = function(response) {
        var array = response;
        for (var i = 0; i < array.length; i++) {
            Tweets.insert({
                username: array[i].user.name,
                screen_name: array[i].user.screen_name,
                message: array[i].text,
                time: array[i].created_at
            });
        }
    }


    var init = function(keys) {
        T = new Twit(keys);
    }

    Meteor.methods({
        grabResults: function(twittername, count) {
            var twe = Meteor.wrapAsync(getTweets);
            try {
                init(myKey);
                var tweeters = twe(twittername, count);
                storeTweets(tweeters);
            } catch (error) {
                console.log("Could not find request.")
            }
            return false;
        }
    });
}


if (Meteor.isClient) {

    Template.twitterPackage.onRendered(function() {
        var username = this.data.query;
        var count = this.data.count;
        Meteor.call("grabResults", username, count, function(err) {
            if (err) {
                console.log(err);
            }
        })
    })

    Template.twitterPackage.helpers({
        tweets: function() {
            return Tweets.find({
                screen_name: this.query
            }, { limit: this.count});
        }
    })


}