var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var Users = require('./models/users')
var JwtStrategy = require('passport-jwt').Strategy
var ExtractJwt = require('passport-jwt').ExtractJwt
var jwt = require('jsonwebtoken')
var config = require('./config')
var FacebookTokenStrategy = require('passport-facebook-token')

module.exports.local = passport.use(new LocalStrategy(Users.authenticate()))
passport.serializeUser(Users.serializeUser())
passport.deserializeUser(Users.deserializeUser())

module.exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600
    })
}

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secretKey

module.exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("JWT payload:", jwt_payload)
    Users.findOne({ _id: jwt_payload._id }, (err, user) => {
        if(err)
            return done(err, false)
        else if(user)
            return done(null, user)
        else
            return done(null, false)
    })
}))

module.exports.verifyUser = passport.authenticate('jwt', { session: false })

module.exports.verifyAdmin = (req, res, next) => {
    if(req.user && req.user.admin)
        next()
    else {
        let err = new Error('You are not authorized to perform this operation!')
        err.status = 403
        next(err)
    }
}

module.exports.facebookPassport = passport.use(new FacebookTokenStrategy({
        clientID: config.facebook.clientId,
        clientSecret: config.facebook.clientSecret
    },
    (accessToken, refreshToken, profile, done) => {
        Users.findOne({ facebookId: profile.id })
            .then(user => {
                user = new Users({ username: profile.displayName })
                user.facebookId = profile.id
                user.firstname = profile.name.givenName
                user.lastname = profile.name.familyName
                user.save()
                    .then(user => {
                        return done(null, user)
                    },
                    err => {
                        return done(err, false)
                    })
                    .catch(err => {
                        return done(err, false)
                    })
            },
            err => {
                return done(err, false)
            })
            .catch(err => {
                return done(err, false)
            })
    })
)