Tweets = new Mongo.Collection("tweets")



if (Meteor.isServer) {
    
    var T;
    var myKey = {
                consumer_key: 'CbqeFfqUzsE9JgmmLTjAebyt7', // API key
                consumer_secret: '5Q6XpRSj261SMEaNhekzlviIIj1nNcNd3A2vgpEeLXrXT3GbK5', // API secret
                access_token: '3256361616-o13asDcdneszFfT35PRgHy0pxVtHYPRgmFmc007',
                access_token_secret: 'fqqB9nArN9dlANpiS1GwtMTfrFcMiCmaRvdeODe1kowqX'
            }

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


    var init = function(keys){
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

    Template.twitterPackage.onRendered(function(){
        var username = this.data.query;
        var count = this.data.count;
        console.log(username);
        console.log(count);
        Meteor.call("grabResults", username, count, function(err){
            if(err){
                console.log(err);
            }
        })
    })

    Template.twitterPackage.helpers({
        tweets: function() {
            return Tweets.find({screen_name:this.query});
        }
    })


}