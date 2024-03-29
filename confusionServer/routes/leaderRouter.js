const express = require('express')
const mongoose = require('mongoose')
const authenticate = require('../authenticate')
const cors = require('./cors')

const Leaders = require('../models/leaders')

const leaderRouter = express.Router()

leaderRouter.use(express.json())

leaderRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .all((req, res, next) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        next()
    })
    .get(cors.cors, (req, res, next) => {
        Leaders.find({})
            .then(leaders => res.json(leaders),
            err => next(err))
            .catch(err => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.create(req.body)
            .then(leader => res.json(leader),
            err => next(err))
            .catch(err => next(err))
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        res.statusCode = 403
        res.setHeader('Content-Type', 'text/plain')
        res.end('PUT operation not supported on /leaders')
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.deleteMany({})
            .then(leaders => res.json(leaders),
            err => next(err))
            .catch(err => next(err))
    })

leaderRouter.route('/:leaderId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .all((req, res, next) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        next()
    })
    .get(cors.cors, (req, res, next) => {
        Leaders.findOne({ _id: req.params.leaderId })
            .then(leader => res.json(leader),
            err => next(err))
            .catch(err => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403
        res.setHeader('Content-Type', 'text/plain')
        res.end('POST operation not supported on /leaders/' + req.params.leaderId)
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.findByIdAndUpdate(req.params.leaderId, { $set: req.body }, { new: true })
            .then(leader => res.json(leader),
            err => next(err))
            .catch(err => next(err))
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.findByIdAndDelete(req.params.leaderId)
            .then(leader => res.json(leader),
            err => next(err))
            .catch(err => next(err))
    })

module.exports = leaderRouter