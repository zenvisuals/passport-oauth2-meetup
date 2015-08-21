var util = require('util')
  , OAuth2Strategy = require('passport-oauth2')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError;

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://secure.meetup.com/oauth2/authorize';
  options.tokenURL = options.tokenURL || 'https://secure.meetup.com/oauth2/access';


  OAuth2Strategy.call(this, options, verify);
  this.name = 'meetup';
  this._refreshURL = options.refreshURL || 'https://secure.meetup.com/oauth2/access';
  this._oauth2._useAuthorizationHeaderForGET = true;
  this.profileUrl = 'https://api.meetup.com/2/member/self';
  this.autoGenerateUsername = options.autoGenerateUsername || false;
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function(accessToken, done) {


  var autoGenerateUsername = this.autoGenerateUsername;

  this._oauth2.setAccessTokenName("oauth2_access_token");

  this._oauth2.get(this.profileUrl, accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }

    try {
      var json = JSON.parse(body);

      var profile = { provider: 'meetup' };

      profile.id = json.id;
      profile.displayName = json.name;
      if(autoGenerateUsername) {
        profile.username = "meetup_" + json.id;
      }

      profile._raw = body;
      profile._json = json;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}

module.exports = Strategy;
