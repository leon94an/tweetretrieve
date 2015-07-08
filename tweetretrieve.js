Tweets = new Mongo.Collection("tweets")

if (Meteor.isServer) {

    Twit = Npm.require('twit');

    // Meteor.publish("tweets", function(options) {
    //     return Tweets.find({
    //         screen_name: options.screen_name
    //     }, {
    //         limit: parseInt(options.count) || 5
    //     });
    // });

    var T;
    var cacheTime;
    var maxTweets;


    tweetRetrieve = {
        init: function(entry) {
            if (!entry.oath) {
                return new Meteor.Error("Missing oath parameter.");
            }
            T = new Twit(entry.oath);
            cacheTime = entry.cacheDuration || 1000 * 60;
            maxTweets = entry.maximumTweets || 100;
        }

    };

    var getTweets = function(query, callback) {
        if ("username" in query) {
            T.get('statuses/user_timeline', {
                    screen_name: query["username"],
                    count: maxTweets
                },
                function(err, data) {
                    callback(err, data);
                }
            );
        }
        if ("keyword" in query) {
            T.get('search/tweets', {
                    q: query["keyword"],
                    result_type: 'recent',
                    count: maxTweets
                },
                function(err, data) {
                    callback(err, data.statuses);
                }
            );
        }
    }


    var storeTweets = function(response, queryName) {
        var array = response;

        for (var i = 0; i < array.length; i++) {
            Tweets.insert({
                username: array[i].user.name,
                screen_name: array[i].user.screen_name,
                message: array[i].text,
                time: array[i].created_at,
                image: array[i].user.profile_image_url,
                query: queryName
            });
        }
    }




    tweetCache = {};

    Meteor.methods({
        grabResults: function(query) {
            var twe = Meteor.wrapAsync(getTweets);
            var queryName;
            if ("username" in query) {
                queryName=query["username"];
            }
            if ("keyword" in query) {
                queryName=query["keyword"];
            }
            try {
                if (typeof tweetCache[query] == 'undefined') {
                    var currTime = new Date();
                    tweetCache[query] = currTime;
                    var tweeters = twe(query);
                    storeTweets(tweeters, queryName);
                } else if ((Math.abs(new Date().getTime() - tweetCache[query]) > cacheTime)) {
                    Tweets.remove({
                        query: queryName
                    })
                    tweetCache[item] = new Date();
                    var tweeters = twe(queryName);
                    storeTweets(tweeters, queryName);
                }
            } catch (error) {
                console.log("twitterretrieve", error)
            }
            return false;
        }
    });
}


if (Meteor.isClient) {

    // Template.tweetRetrieve.onCreated(function() {
    //     this.subscribe("tweets", {
    //         screen_name: this.data.username,
    //         count: this.data.count
    //     });
    // })

    Template.tweetRetrieve.onRendered(function() {
        var query = this.data;
        Meteor.call("grabResults", query, function(err) {
            if (err) {
                console.log(err);
            }
        })
    })

    Template.tweetRetrieve.helpers({
        tweets: function() {
            var queryName;
            console.log(this);
            if ("username" in this) {
                queryName=this["username"];
            }
            if ("keyword" in this) {
                queryName=this["keyword"];
            }
            return Tweets.find({
                query: queryName
            }, {
                limit: parseInt(this["count"]) || 5
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