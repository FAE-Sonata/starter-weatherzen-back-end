const service = require("./observations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const observations = [];
const validSkyConditions = [100, 101, 102, 103, 104, 106, 108, 109]

function hasData(req, res, next) {
    if (req.body.data) {
        return next()
    }
    next({status: 400, message: "body must have data property"})
}

function hasLatitude(req, res, next) {
    const latitude = Number(req.body.data.latitude)
    if (latitude >= -90 && latitude <= 90 ) {
        return next()
    }
    next({status: 400, message: "latitude must be between -90 and 90"})
}

function hasLongitude(req, res, next) {
    const longitude = Number(req.body.data.longitude)
    if (longitude >= -180 && longitude <= 180 ) {
        return next()
    }
    next({status: 400, message: "longitude must be between -180 and 180"})
}

function hasSkyCondition(req, res, next) {
    const skyCondition = Number(req.body.data.sky_condition)

    if (validSkyConditions.includes(skyCondition)) {
        return next()
    }
    next({status: 400, message: `sky_condition must be one of: ${validSkyConditions}`})
}

async function observationExists(req, res, next) {
    const observation = await service.read(req.params['observation_id']);
  
    if (observation) {
      res.locals['observation'] = observation;
      return next();
    }
    next({ status: 404, message: `Observation cannot be found.` });
  }

async function create(req, res) {
    const newObservation = await service.create(req.body.data);
    res.status(201).json({
        data: newObservation,
    });
}

async function list(req, res) {
    const data = await service.list();
    res.json({
        data,
    });
}

async function update(req, res) {
    const updatedObs = {
      ...req.body.data,
      observation_id: res.locals['observation']['observation_id'],
    };
  
    const data = await service.update(updatedObs);
    res.json({ data });
  }

module.exports = {
    create: [hasData, hasLatitude, hasLongitude, hasSkyCondition,
        asyncErrorBoundary(create)],
    list: asyncErrorBoundary(list),
    update: [asyncErrorBoundary(observationExists), hasData, hasLatitude,
        hasLongitude, hasSkyCondition, asyncErrorBoundary(update)],
};