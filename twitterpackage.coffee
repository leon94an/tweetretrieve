Parser = (text) ->
  html = text
  urlRegex = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi
  hashTagRegex = /#([^ ]+)/gi

  @linkifyURLs = ->
    html = html.replace(urlRegex, '<a href="$1">$1</a>')
    return

  @linkifyHashTags = ->
    html = html.replace(hashTagRegex, '<a href="http://twitter.com/#!/search?q=%23$1">#$1</a>')
    return

  @getHTML = ->
    html

  return

Tweets = new (Mongo.Collection)('tweets')
if Meteor.isServer
  Meteor.publish 'tweets', (options) ->
    Tweets.find { screen_name: options.screen_name }, limit: options.count
  myKey = 
    consumer_key: 'xxx'
    consumer_secret: 'xxx'
    access_token: 'xxx'
    access_token_secret: 'xxx'
  T = undefined
  cacheTime = undefined
  maxTweets = undefined
  twitterPackage = init: (userKey, time, max) ->
    T = new Twit(userKey)
    cacheTime = time.time
    maxTweets = max.maximum
    return

  getTweets = (username, callback) ->
    T.get 'statuses/user_timeline', {
      screen_name: username
      count: 100
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
        image: array[i].user.profile_image_url
      i++
    return

  tweetCache = {}
  Meteor.methods grabResults: (twittername) ->
    `var tweeters`
    twe = Meteor.wrapAsync(getTweets)
    try
      # var num= Tweets.find({screen_name: twittername}).count();
      # var diff= maxTweets-num;
      if typeof tweetCache[twittername] == 'undefined'
        currTime = new Date
        tweetCache[twittername] = currTime
        tweeters = twe(twittername)
        storeTweets tweeters
      else if Math.abs((new Date).getTime() - (tweetCache[twittername])) > cacheTime
        Tweets.remove screen_name: twittername
        tweetCache[twittername] = new Date
        tweeters = twe(twittername)
        storeTweets tweeters
    catch error
      console.log 'Could not find request.'
    false
if Meteor.isClient
  Template.twitterPackage.onCreated ->
    @subscribe 'tweets',
      screen_name: @data.query
      count: @data.count
    return
  Template.twitterPackage.onRendered ->
    username = @data.query
    Meteor.call 'grabResults', username, (err) ->
      if err
        console.log err
      return
    return
  Template.twitterPackage.helpers tweets: ->
    Tweets.find { screen_name: @query }, limit: @count
  Template.tweetItem.helpers
    message: ->
      parser = new Parser(@message)
      parser.linkifyURLs()
      parser.linkifyHashTags()
      parser.getHTML()
    time: ->
      time = new Date(@time)
      time
