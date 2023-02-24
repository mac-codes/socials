const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

// thoughts schema
const thoughtsSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      maxlength: 280
    },
    createdArt: {
      type: Date,
      default: Date.now,
      get: (createdAtValue) => dateFormate(createdAtValue)
    },
    username: {
      type: String,
      required: true
    },
    reactions: [reactionSchema]
  },
  {
  toJSON: {
    virtuals: true,
    getters: true
  },
  id: false
  }
);

// get total friend count
thoughtsSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

// create user model
const Thought = model('Thought', thoughtsSchema);

module.exports = { Thought };