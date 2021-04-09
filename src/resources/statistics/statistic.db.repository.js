const Statistics = require('./statistic.model');
const { NOT_FOUND_ERROR } = require('../../errors/appErrors');

const get = async (userId) => {
  const statistic = await Statistics.findOne({ userId });
  if (!statistic) {
    throw new NOT_FOUND_ERROR('statistic', `userId: ${userId}`);
  }

  return statistic;
};

const unique = (arr, obj) => {
  for (const i of arr) {
    if (i.word.id === obj.word.id) return arr;
  }
  return [...arr, obj];
};

const upsert = async (userId, word) => {
  const stat =
    (await Statistics.findOne({ userId }).then((data) => {
      if (data) return data.learnedWords;
    })) || [];
  await Statistics.updateOne(
    { userId },
    { $set: { learnedWords: unique(stat, word) } },
    { upsert: true, new: true }
  );
};

const remove = async (userId) => Statistics.deleteOne({ userId });

module.exports = { get, upsert, remove };
