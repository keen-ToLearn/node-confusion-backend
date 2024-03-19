const express = require('express')
const mongoose = require('mongoose')
const authenticate = require('../authenticate')
const cors = require('./cors')

const Dishes = require('../models/dishes')

const dishRouter = express.Router()

dishRouter.use(express.json())

// handling /dishes...
dishRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.cors, (req, res, next) => {
        Dishes.find({})
            .populate('comments.author')
            .then(dishes => {
                console.log('Dishes: ' + dishes)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(dishes)
                // writeHead is strict and only allows write and end method post it
                // status method in app.js line 56 is causing error Setting Header after Sending to Client
                // res.writeHead(200, { 'Content-Type': 'application/json' })
            },
            err => next(err))
            .catch(err => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.create(req.body)
            .then(dish => {
                console.log('Dish created: ' + dish)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(dish)
                // res.writeHead(200, {'Content-Type': 'application/json'})
            },
            err => next(err))
            .catch(err => next(err))
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403
        res.end('PUT operation not supported on /dishes')
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.remove({})
            .then(resp => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
                // res.writeHead(200, {'Content-Type': 'application/json'})
            },
            err => next(err))
            .catch(err => next(err))
    })

dishRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .all((req, res, next) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        next()
    })
    .get(cors.cors, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then(dish => {
                console.log('Dish: ' + dish)
                res.json(dish)
            },
            err => next(err))
            .catch(err => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403
        res.setHeader('Content-Type', 'text/plain')
        res.end('POST operation not supported on /dishes/' + req.params.dishId)
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true })
            .then(dish => {
                console.log('Dish created: ' + dish)
                res.json(dish)
            },
            err => next(err))
            .catch(err => next(err))
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishId)
            .then(resp => res.json(resp),
            err => next(err))
            .catch(err => next(err))
    })

// handling /dishes/:dishId...
dishRouter.route('/:dishId/comments')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.cors, (req, res, next) => {
        Dishes.findById(req.params.dishId, {})
            .populate('comments.author')
            .then(dish => {
                if(dish != null) {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(dish.comments)
                }
                else {
                    let err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404
                    return next(err)
                }
            },
            err => next(err))
            .catch(err => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then(dish => {
                if(dish != null) {
                    req.body.author = req.user._id
                    dish.comments.push(req.body)
                    dish.save()
                        .then(dish => {
                            // W3 - Mongoose Populate - need user document in author instead of just _id
                            Dishes.findOne({ _id: dish._id })
                                .populate('comments.author')
                                .then(dish => {
                                    res.statusCode = 200
                                    res.setHeader('Content-Type', 'application/json')
                                    res.json(dish)
                                })
                        }, err => next(err))
                }
                else {
                    let err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404
                    return next(err)
                }
            },
            err => next(err))
            .catch(err => next(err))
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403
        res.end('PUT operation not supported on /dishes' + req.params.dishId + '/comments')
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then(dish => {
                if(dish != null) {
                    for(let i = 0; i < dish.comments.length; i++)
                        dish.comments.id(dish.comments[i]._id).remove()
                    dish.save()
                        .then(dish => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(dish)
                        }, err => next(err))
                }
                else {
                    let err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404
                    return next(err)
                }
            },
            err => next(err))
            .catch(err => next(err))
    })

dishRouter.route('/:dishId/comments/:commentId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .all((req, res, next) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        next()
    })
    .get(cors.cors, (req, res, next) => {
        Dishes.findOne({ _id: req.params.dishId })
            .populate('comments.author')
            .then(dish => {
                if(dish != null && dish.comments.id(req.params.commentId) != null)
                    res.json(dish.comments.id(req.params.commentId))
                else if(dish == null) {
                    let err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404
                    return next(err)
                }
                else {
                    let err = new Error('Comment ' + req.params.commentId + ' not found')
                    err.status = 404
                    return next(err)
                }
            }, err => next(err))
            .catch(err => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403
        res.setHeader('Content-Type', 'text/plain')
        res.end('POST operation not supported on /dishes/' + req.params.dishId +
            '/comments/' + req.params.commentId)
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Dishes.findOne({ _id: req.params.dishId })
            .then(dish => {
                if(dish != null && dish.comments.id(req.params.commentId) != null) {
                    console.log(dish.comments.id(req.params.commentId).author)

                    if(!(dish.comments.id(req.params.commentId).author.equals(req.user._id))) {
                        let err = new Error('You are not authorized to edit this comment!')
                        err.status = 403
                        return next(err)
                    }
                    if(req.body.rating)
                        dish.comments.id(req.params.commentId).rating = req.body.rating
                    if(req.body.comment)
                        dish.comments.id(req.params.commentId).comment = req.body.comment
                    dish.save()
                        .then(dish => {
                            // W3 - Mongoose Populate - need user document in author instead of just _id
                            Dishes.findById(dish._id)
                                .populate('comments.author')
                                .then(dish => res.json(dish))
                        }, err => next(err))
                }
                else if(dish == null) {
                    let err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404
                    return next(err)
                }
                else {
                    let err = new Error('Comment ' + req.params.commentId + ' not found')
                    err.status = 404
                    return next(err)
                }
            }, err => next(err))
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then(dish => {
                if(dish != null && dish.comments.id(req.params.commentId) != null) {
                    console.log(dish.comments.id(req.params.commentId).author)

                    if(!(dish.comments.id(req.params.commentId).author.equals(req.user._id))) {
                        let err = new Error('You are not authorized to delete this comment!')
                        err.status = 403
                        return next(err)
                    }

                    dish.comments.id(req.params.commentId).remove()
                    dish.save()
                        .then(dish => {
                            // W3 - Mongoose Populate - need user document in author instead of just _id
                            Dishes.findOne({ _id: dish._id })
                                .populate('comments.author')
                                .then(dish => res.json(dish))
                        }, err => next(err))
                }
                else if(dish == null) {
                    let err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404
                    return next(err)
                }
                else {
                    let err = new Error('Comment ' + req.params.commentId + ' not found')
                    err.status = 404
                    return next(err)
                }
            },
            err => next(err))
            .catch(err => next(err))
    })

module.exports = dishRouter