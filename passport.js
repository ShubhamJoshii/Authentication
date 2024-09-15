const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { Strategy: FacebookStrategy } = require("passport-facebook");
const { Strategy: GithubStrategy } = require("passport-github2");
const { UserModel } = require("./database");
const debug = require("debug");
const debugServer = debug();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const userExist = await UserModel.findOne({ GoogleId: profile.id });
      if (userExist) {
        debugServer("User Already exists in database");
        let token = await userExist.generateAuthToken();
        await userExist.save();
        return done(null, { user:userExist, token });
      } else {
        debugServer("User does not exist in database. Adding user to database");
        const user = new UserModel({
          GoogleId: profile.id,
          FirstName: profile.name.givenName,
          LastName: profile.name.familyName,
          isVerified: profile.emails[0].verified,
          Email: profile.emails[0].value,
          Provider: profile.provider,
        });
        let token = await user.generateAuthToken();
        await user.save();
        return done(null, { user, token });
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/facebook/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const userExist = await UserModel.findOne({ FacebookId: profile.id });
      if (userExist) {
        debugServer("User Already exists in database");
        let token = await userExist.generateAuthToken();
        await userExist.save();
        return done(null, { user:userExist, token });
      } else {
        debugServer("User does not exist in database. Adding user to database");
        const user = new UserModel({
          FacebookId: profile.id,
          FirstName: profile.name.givenName,
          LastName: profile.name.familyName,
          isVerified: profile.emails[0].verified,
          Email: profile.emails[0].value,
          Provider: profile.provider,
        });
        let token = await user.generateAuthToken();
        await user.save();
        return done(null, { user, token });
      }
    }
  )
);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const userExist = await UserModel.findOne({ GitHubId: profile.id });
      if (userExist) {
        debugServer("User Already exists in database");
        let token = await userExist.generateAuthToken();
        await userExist.save();
        return done(null, { user:userExist, token });
      } else {
        debugServer("User does not exist in database. Adding user to database");
        const user = new UserModel({
          GitHubId: profile.id,
          FirstName: profile.displayName,
          LastName: null,
          isVerified: true,
          Email: profile._json.email,
          Provider: profile.provider,
        });
        let token = await user.generateAuthToken();
        await user.save();
        return done(null, { user, token});
      }
    }
  )
);



// Serialize user into the session
passport.serializeUser((user, done) => done(null, user));

// Deserialize user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});
