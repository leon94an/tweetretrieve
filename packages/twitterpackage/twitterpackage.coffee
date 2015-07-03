Tweets = new (Mongo.Collection)('tweets')
if Meteor.isServer
  T = undefined
  #key goes here
  myKey = 
    

  getTweets = (username, count, callback) ->
    T.get 'statuses/user_timeline', {
      screen_name: username
      count: count
    }, (err, data) ->
      callback err, data
      return
    return

  storeTweets = (response) ->
    array = response
    i = 0
    while i < array.length
      Tweets.insert
        username: array[i].user.name
        screen_name: array[i].user.screen_name
        message: array[i].text
        time: array[i].created_at
      i++
    return

  init = (keys) ->
    T = new Twit(keys)
    return

  Meteor.methods grabResults: (twittername, count) ->
    twe = Meteor.wrapAsync(getTweets)
    try
      init myKey
      tweeters = twe(twittername, count)
      storeTweets tweeters
    catch error
      console.log 'Could not find request.'
    false
if Meteor.isClient
  Template.twitterPackage.onRendered ->
    username = @data.query
    count = @data.count
    console.log username
    console.log count
    Meteor.call 'grabResults', username, count, (err) ->
      if err
        console.log err
      return
    return
  Template.twitterPackage.helpers tweets: ->
    Tweets.find screen_name: @query
