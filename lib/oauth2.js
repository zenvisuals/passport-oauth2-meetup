var util = require('util')
  , OAuth2Strategy = require('passport-oauth2')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError;

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://secure.meetup.com/oauth2/authorize';
  options.tokenURL = options.tokenURL || 'https://secure.meetup.com/oauth2/access';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'meetup';
  this.profileUrl = 'https://api.meetup.com/2/member/self';
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function(accessToken, done) {

  //LinkedIn uses a custom name for the access_token parameter
  this._oauth2.setAccessTokenName("oauth2_access_token");

  this._oauth2.get(this.profileUrl, accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }

    try {
      var json = JSON.parse(body);

      var profile = { provider: 'meetup' };

      profile._raw = body;
      profile._json = json;
      console.log(json);
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}

module.exports = Strategy;
