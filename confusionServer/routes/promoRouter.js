const express = require('express')
const mongoose = require('mongoose')
const authenticate = require('../authenticate')
const cors = require('./cors')

const Promotions = require('../models/promotions')

const promoRouter = express.Router()

promoRouter.use(express.json())

promoRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .all((req, res, next) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        next()
    })
    .get(cors.cors, (req, res, next) => {
        Promotions.find({})
            .then(promos => res.json(promos),
            err => next(err))
            .catch(err => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        let newPromo = new Promotions(req.body)
        newPromo.save()
            .then(promo => res.json(promo),
            err => next(err))
            .catch(err => next(err))
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        res.statusCode = 403
        res.setHeader('Content-Type', 'text/plain')
        res.end('PUT operation not supported on /promotions')
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.deleteMany({})
            .then(promos => res.json(promos),
            err => next(err))
            .catch(err => next(err))
    })

promoRouter.route('/:promoId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .all((req, res, next) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        next()
    })
    .get(cors.cors, (req, res, next) => {
        Promotions.findById(req.params.promoId)
            .then(promo => res.json(promo),
            err => next(err))
            .catch(err => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        res.statusCode = 403
        res.setHeader('Content-Type', 'text/plain')
        res.end('POST operation not supported on /promotions/' + req.params.promoId)
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.findOneAndUpdate({ _id: req.params.promoId }, { $set: req.body }, { new: true })
            .then(promo => res.json(promo),
            err => next(err))
            .catch(err => next(err))
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.findOneAndDelete({ _id: req.params.promoId })
            .then(promo => res.json(promo),
            err => next(err))
            .catch(err => next(err))
    })

module.exports = promoRouter