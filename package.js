Package.describe({
    name: 'leon94an:tweetretrieve',
    version: '0.0.1',
    summary: 'twitterfeed retriever',
    git: 'https://leon94an@github.com/leon94an/tweetretrieve.git'
});

Package.onUse(function(api) {
    api.versionsFrom('1.1.0.2');

    api.use([
        'templating',
        'coffeescript',
        'mongo',
    ], ['client','server']);

    api.addFiles([
        'twitterpackage.html',
        'twitterpackage.js'
    ], ['client', 'server']);

    api.export('twitterPackage',['server']);
});

// Package.onTest(function(api) {
//   api.use('tinytest');
//   api.use('leon94an:twitterpackage');
//   api.addFiles('twitterpackage-tests.js');
// });

Npm.depends({
    'twit': '1.1.20'
})