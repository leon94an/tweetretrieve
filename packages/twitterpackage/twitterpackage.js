// Tweets = new Mongo.Collection("tweets")



// if (Meteor.isServer) {
//     var getTweets = function(username, count, callback) {
//         Tweets.remove({});
//         var T = new Twit({
//             consumer_key: 'CbqeFfqUzsE9JgmmLTjAebyt7', // API key
//             consumer_secret: '5Q6XpRSj261SMEaNhekzlviIIj1nNcNd3A2vgpEeLXrXT3GbK5', // API secret
//             access_token: '3256361616-o13asDcdneszFfT35PRgHy0pxVtHYPRgmFmc007',
//             access_token_secret: 'fqqB9nArN9dlANpiS1GwtMTfrFcMiCmaRvdeODe1kowqX'
//         });


//         // T.get('search/tweets', {
//         //         q: "plebs",
//         //         count: 10,
//         //     },
//         //     function(err, data) {
//         //         callback(err, data);
//         //     }
//         // );
//         T.get('statuses/user_timeline', {
//                 screen_name: 'realskipbayless',
//                 count: 4
//             },
//             function(err, data) {
//                 console.log(data);
//                 callback(err, data);
//             }
//         );

//     }


//     var storeTweets = function(response) {
//         // var array = response.statuses;
//         var array = response;
//         for (var i = 0; i < array.length; i++) {
//             Tweets.insert({
//                 message: array[i].text,
//                 time: array[i].created_at
//             });
//         }
//     }

//     // Meteor.publish("tweets", function() {
//     //     return Tweets.find();
//     // });

//     Meteor.methods({
//         grabResults: function(twittername, count) {
//             var twe = Meteor.wrapAsync(getTweets);
//             try {
//                 var tweeters = twe(twittername, count);
//                 storeTweets(tweeters);
//             } catch (error) {
//                 console.log("Error.")
//             }
//             return false;
//         }
//     });
// }



// if (Meteor.isClient) {
//     // Meteor.subscribe("tweets");
//     Template.tweetSubmit.events({
//         'submit form': function(e, template) {
//             e.preventDefault();
//             var $target = $(e.target)
//             Meteor.call("grabResults", $target.find('[name=twitterName]'), $target.find('[name=count]'), function(err) {
//                 console.log("error", err);
//             });
//             template.find("form").reset();
//         }
//     });
//     Template.twitterPackage.helpers({
//         tweets: function() {
//             return Tweets.find();
//         }
//     })
// }



Tweets = new Mongo.Collection("tweets")



if (Meteor.isServer) {
    var getTweets = function(username, count, callback) {
        Tweets.remove({});
        var T = new Twit({
            consumer_key: 'CbqeFfqUzsE9JgmmLTjAebyt7', // API key
            consumer_secret: '5Q6XpRSj261SMEaNhekzlviIIj1nNcNd3A2vgpEeLXrXT3GbK5', // API secret
            access_token: '3256361616-o13asDcdneszFfT35PRgHy0pxVtHYPRgmFmc007',
            access_token_secret: 'fqqB9nArN9dlANpiS1GwtMTfrFcMiCmaRvdeODe1kowqX'
        });


        // T.get('search/tweets', {
        //         q: "plebs",
        //         count: 10,
        //     },
        //     function(err, data) {
        //         callback(err, data);
        //     }
        // );
        T.get('statuses/user_timeline', {
                screen_name: username,
                count: count
            },
            function(err, data) {
                console.log(data);
                callback(err, data);
            }
        );

    }


    var storeTweets = function(response) {
        // var array = response.statuses;
        var array = response;
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
        grabResults: function(twittername, count) {
            var twe = Meteor.wrapAsync(getTweets);
            try {
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
    // Meteor.subscribe("tweets");
    Template.tweetSubmit.events({
        'submit form': function(e, template) {
            e.preventDefault();
            var $target = $(e.target);
            var username = $target.find('[name=twitterName]').val();
            var count = $target.find('[name=count]').val();
            if (username != "" && count != "") {
                Meteor.call("grabResults", username, count, function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            else{
                console.log("forms are not filled");
            }
            template.find("form").reset();
        }
    });

    Template.twitterPackage.helpers({
        tweets: function() {
            return Tweets.find();
        }
    })

}