const knex = require("../db/connection");

function create(newObservation) {
  return knex("observations").insert(newObservation).returning("*");
}

async function list() {
  return knex("observations").select("*");
}

async function read(observation_id = 0) {
  return knex("observations")
    .select("*")
    .where({ observation_id })
    .first();
}

async function update(newObs) {
  return knex("observations")
    .select("*")
    .where({ observation_id: newObs['observation_id'] })
    .update(newObs, "*");
}

module.exports = {
  create,
  list,
  read,
  update,
};