if (Meteor.isServer) {
    tweetRetrieve.init({
        cacheDuration: 5000,
        maximumTweets: 100,
        oath: {
            consumer_key: 'CbqeFfqUzsE9JgmmLTjAebyt7',
            consumer_secret: '5Q6XpRSj261SMEaNhekzlviIIj1nNcNd3A2vgpEeLXrXT3GbK5',
            access_token: '3256361616-o13asDcdneszFfT35PRgHy0pxVtHYPRgmFmc007',
            access_token_secret: 'fqqB9nArN9dlANpiS1GwtMTfrFcMiCmaRvdeODe1kowqX'
        }
    });
}

if (Meteor.isClient) {
    Template.feed.helpers({
        query: function() {
            return {
                keyword: "life",
                count: 5
            }
        }
    }) 
}