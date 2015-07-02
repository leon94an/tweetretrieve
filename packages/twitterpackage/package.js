Package.describe({
    name: 'leon94an:twitterpackage',
    version: '0.0.1',
    summary: 'clientside twitterfeed retriever',
});

Package.onUse(function(api) {
    api.versionsFrom('1.1.0.2');

    api.use([
        'templating',
        'coffeescript',
        'mongo',
    ], ['client','server']);

    api.addFiles(['twit.js'], ['server']);

    api.addFiles([
        'twitterpackage.html',
        'tweetitem.html',
        'tweetsubmit.html',
        'twitterpackage.js',
    ], ['client', 'server']);

});

// Package.onTest(function(api) {
//   api.use('tinytest');
//   api.use('leon94an:twitterpackage');
//   api.addFiles('twitterpackage-tests.js');
// });

Npm.depends({
    'twit': '1.1.20'
})