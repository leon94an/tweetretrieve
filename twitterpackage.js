Tweets = new Mongo.Collection("tweets")

if (Meteor.isServer) {
    Twit = Npm.require('twit');
    Meteor.publish("tweets", function(options) {
        return Tweets.find({
            screen_name: options.screen_name
        }, {
            limit: options.count
        });
    });

    var myKey = {
        consumer_key: 'xxx',
        consumer_secret: 'xxx',
        access_token: 'xxx',
        access_token_secret: 'xxx'

    }

    var T;
    var cacheTime;
    var maxTweets;


    twitterPackage = {
        init: function(userKey, time, max) {
            T = new Twit(userKey);
            cacheTime = time.time;
            maxTweets = max.maximum;
        }

    };

    var getTweets = function(username, callback) {
        T.get('statuses/user_timeline', {
                screen_name: username,
                count: 100
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
                time: array[i].created_at,
                image: array[i].user.profile_image_url
            });
        }
    }




    tweetCache = {};

    Meteor.methods({
        grabResults: function(twittername) {
            var twe = Meteor.wrapAsync(getTweets);
            try {
                // var num= Tweets.find({screen_name: twittername}).count();
                // var diff= maxTweets-num;
                if (typeof tweetCache[twittername] == 'undefined') {
                    var currTime = new Date();
                    tweetCache[twittername] = currTime;
                    var tweeters = twe(twittername);
                    storeTweets(tweeters);
                } else if ((Math.abs(new Date().getTime() - tweetCache[twittername]) > cacheTime)) {
                    Tweets.remove({
                        screen_name: twittername
                    });
                    tweetCache[twittername] = new Date();
                    var tweeters = twe(twittername);
                    storeTweets(tweeters);
                }
            } catch (error) {
                console.log("Could not find request.")
            }
            return false;
        }
    });
}


if (Meteor.isClient) {

    Template.twitterPackage.onCreated(function() {
        this.subscribe("tweets", {
            screen_name: this.data.query,
            count: this.data.count
        });
    })

    Template.twitterPackage.onRendered(function() {
        var username = this.data.query;
        Meteor.call("grabResults", username, function(err) {
            if (err) {
                console.log(err);
            }
        })
    })

    Template.twitterPackage.helpers({
        tweets: function() {
            return Tweets.find({
                screen_name: this.query
            }, {
                limit: this.count
            });
        }
    })

    function Parser(text) {

        var html = text;

        var urlRegex = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
        var hashTagRegex = /#([^ ]+)/gi;

        this.linkifyURLs = function() {
            html = html.replace(urlRegex, '<a href="$1">$1</a>');
        };
        this.linkifyHashTags = function() {
            html = html.replace(hashTagRegex, '<a href="http://twitter.com/#!/search?q=%23$1">#$1</a>');
        };

        this.getHTML = function() {
            return html;
        };

    }

    Template.tweetItem.helpers({
        message: function() {
            var parser = new Parser(this.message);
            parser.linkifyURLs();
            parser.linkifyHashTags();
            return parser.getHTML();
        },
        time: function() {
            var time = new Date(this.time);
            return time;
        }
    })


}