# Passport-OAuth2-Meetup

Passport OAuth2 Meetup authentication strategy for [Passport](https://github.com/jaredhanson/passport).

## Install

    $ npm install passport-oauth2-meetup

## Usage of OAuth2-Meetup

#### Configure Strategy

This authentication strategy authenticates users using their meetup account. Users have
to be logged on to Meetup.com to complete the process. Meetup API does not supply username
or email for its user profile. This strategy has been tweaked to include auto generation
of username. The username will be identified as `meetup_<meetupID>`. The auto generation
can be disabled. If there is no username generated, there will be nothing to identify the user
unless the user has already logged on. Passport.connect function has to be modified to
continue the process even when there are no username or email provided.

    // If neither an email or a username was available in the profile, we don't
    // have a way of identifying the user in the future. Throw an error and let
    // whoever's next in the line take care of it.
    if (!user.username && !user.email) {
      if(!req.user || provider != 'meetup') return next(new Error('Neither a username nor email was available'));
    }

If username is auto generated, the process should carry on smoothly.

    var MeetupOAuth2Strategy = require('passport-oauth2-meetup').Strategy;

    passport.use(new MeetupOAuth2Strategy({
      clientID: MEETUP_KEY,
      clientSecret: MEETUP_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/meetup/callback",
      autoGenerateUsername: true
    }, function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'meetup'` strategy, to
authenticate requests.  

    app.get('/auth/meetup',
      passport.authenticate('meetup', { session: false }),
      function(req, res) {
        res.json(req.user);
      });

## License

[The ISC License](http://opensource.org/licenses/ISC)
