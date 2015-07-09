Package.describe({
    name: 'leon94an:tweetretrieve',
    version: '0.0.4',
    summary: 'twitterfeed retriever',
    git: 'https://github.com/leon94an/tweetretrieve'
});

Package.onUse(function(api) {
    api.versionsFrom('1.1.0.2');

    api.use([
        'templating',
        'coffeescript',
        'mongo',
    ], ['client','server']);

    api.addFiles([
        'tweetretrieve.html',
        'tweetretrieve.js',
        'tweetretrieve.css'
    ], ['client', 'server']);

    api.export('tweetRetrieve',['server']);
});



Npm.depends({
    'twit': '1.1.20'
})