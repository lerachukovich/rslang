const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { addMethods } = require('../../utils/toResponse');

const SettingsSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    setting: {
      type: Object,
      required: true,
    },
  },
  { collection: 'setting' }
);

addMethods(SettingsSchema);

module.exports = mongoose.model('Settings', SettingsSchema);
