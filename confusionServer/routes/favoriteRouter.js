const express = require('express')
const Favorites = require('../models/favorites')
const cors = require('./cors')
const authenticate = require('../authenticate')

const favoriteRouter = express.Router()
favoriteRouter.use(express.json())

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .all(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        next()
    })
    .get((req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then(favorites => {
                if(!favorites) {
                    let err = new Error('No favorites marked by user')
                    err.status = 404
                    throw err
                }
                res.json(favorites)
            },
            err => next(err))
            .catch(err => next(err))
    })
    .post((req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then(favorites => {
                if(!favorites)
                    return Favorites.create({
                        user: req.user._id,
                        dishes: req.body.map(dish => dish._id)
                    })
                favorites.dishes = [ ...(new Set([ ...favorites.dishes, ...(req.body.map(dish => dish._id)) ])) ]
                return favorites.save()
            })
            .then(newFavorites => res.json(newFavorites))
            .catch(err => next(err))
    })
    .delete((req, res, next) => {
        Favorites.findOneAndDelete({ user: req.user._id })
            .then(favorites => res.json(favorites))
            .catch(err => next(err))
    })

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .all(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        next()
    })
    .post((req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then(favorites => {
                if(!favorites)
                    return Favorites.create({
                        user: req.user._id,
                        dishes: [ req.params.dishId ]
                    })
                favorites.dishes = [ ...(new Set([ ...favorites.dishes, req.params.dishId ])) ]
                return favorites.save()
            })
            .then(newFavorites => res.json(newFavorites))
            .catch(err => next(err))
    })
    .delete((req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then(favorites => {
                if(!favorites) {
                    let err = new Error('No favorites marked by user')
                    err.status = 404
                    throw err
                }
                favorites.dishes = favorites.dishes.filter(id => !(id.equals(req.params.dishId)))
                return favorites.save()
            })
            .then(newFavorites => res.json(newFavorites))
            .catch(err => next(err))
    })

module.exports = favoriteRouter