Tweets = new Mongo.Collection("tweets")



if (Meteor.isServer) {

    Meteor.publish("tweets", function() {
        return Tweets.find();
    });

    Meteor.methods({
        grabResults: function() {
            var future = new Future();
            var T = new Twit({
                consumer_key: 'CbqeFfqUzsE9JgmmLTjAebyt7', // API key
                consumer_secret: '5Q6XpRSj261SMEaNhekzlviIIj1nNcNd3A2vgpEeLXrXT3GbK5', // API secret
                access_token: '3256361616-o13asDcdneszFfT35PRgHy0pxVtHYPRgmFmc007',
                access_token_secret: 'fqqB9nArN9dlANpiS1GwtMTfrFcMiCmaRvdeODe1kowqX'
            });

            //  search twitter for all tweets containing the word 'banana'
            //  since Nov. 11, 2011
            setTimeout(function() {
                T.get('search/tweets', {
                        q: 'banana since:2011-11-11',
                        count: 100
                    },
                    function(err, data, response) {
                        future.return(data);
                    }
                );
            }, 100);

                return future.wait();



        }
    });
}

if (Meteor.isClient) {
    Meteor.subscribe("tweets");
    Template.twitterPackage.events({
        'click .find': function(e) {
            Meteor.call("grabResults", function(error, results) {
                if (error)
                    return alert(error.reason);
                console.log(results);
            })
        }
    })
}