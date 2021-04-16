const settingRepo = require('./setting.db.repository');

const get = async (userId) => settingRepo.get(userId);

const upsert = async (userId, statistic) =>
  settingRepo.upsert(userId, statistic);

const remove = async (userId) => settingRepo.remove(userId);

module.exports = { get, upsert, remove };
