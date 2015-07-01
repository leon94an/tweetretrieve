Tweets = new Mongo.Collection("tweets")



if (Meteor.isServer) {
    var getTweets = function(callback) {
        Tweets.remove({});
        var T = new Twit({
            consumer_key: 'CbqeFfqUzsE9JgmmLTjAebyt7', // API key
            consumer_secret: '5Q6XpRSj261SMEaNhekzlviIIj1nNcNd3A2vgpEeLXrXT3GbK5', // API secret
            access_token: '3256361616-o13asDcdneszFfT35PRgHy0pxVtHYPRgmFmc007',
            access_token_secret: 'fqqB9nArN9dlANpiS1GwtMTfrFcMiCmaRvdeODe1kowqX'
        });


        T.get('search/tweets', {
                q: "plebs",
                count: 10,
            },
            function(err, data) {
                callback(err, data);
            }
        );
        // T.get('statuses/user_timeline', {
        //         screen_name: 'garrettjcochran',
        //         count: 3
        //     },
        //     function(err, data) {
        //         console.log(data);
        //         callback(err, data);
        //     }
        // );

    }


    var storeTweets = function(response) {
        var array = response.statuses;
        for (var i = 0; i < array.length; i++) {
            Tweets.insert({
                message: array[i].text,
                time: array[i].created_at
            });
        }
    }

    // Meteor.publish("tweets", function() {
    //     return Tweets.find();
    // });

    Meteor.methods({
        grabResults: function() {
            var twe = Meteor.wrapAsync(getTweets);
            try {
                var tweeters = twe();
                storeTweets(tweeters);
            } catch (error) {
                console.log("Error.")
            }
            return false;
        }
    });
}



if (Meteor.isClient) {
    // Meteor.subscribe("tweets");
    Template.twitterPackage.events({
        'click .find': function(e) {
            Meteor.call("grabResults", function(err) {
                console.log("error", err);
            })
        }
    });
    Template.twitterPackage.helpers({
        tweets: function() {
            return Tweets.find();
        }
    })
}