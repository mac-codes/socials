const { schema, model } = require('mongoose');

// users schema

const userSchema = new schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  emaile: {
    type: String,
    unique: true,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  thoughts: [
    {
      type: schema.types.objectId,
      ref: 'Thought'
    }
  ],
  friends: [
    {
      type: schema.types.objectId,
      ref: 'User'
    }
  ]
},
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

// create user model

const User = model('User', UserSchema);

// get total count of friends
UserSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

module.exports = User