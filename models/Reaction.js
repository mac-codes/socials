const { schema, types } = require('mogoose');
const dateFormat = require('../utils/dateFormat');

const reactionSchema = new schema (
  {
    reactionId: {
      type: schema.types.objectId,
      default: () => new types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtValue => dateFormat(createdAtVal)
    }
  },
  {
    toJSON: {
      getters: true
    },
    id: false
  }
);

module.exports = reactionSchema;