const { attachBodyInfoToError } = require('twit/lib/helpers');
const { User , Thought } = require('../models');

const userController = {
  getAllUsers(reg, res) {
    User.find({})
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
        .populate('thoughts')
        .populate('friends')
        .select('-__v')
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found by this ID!?' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
},

createUser({ body }, res) {
  User.create(body)
  .then(dbUserData => res.json(dbUserData))
  .catch(err => res.json(400).json(err));
},

updateUser({ params, body }, res) {
  User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidation: true })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found by this ID!?'});
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.status(400).json(err));
},

deleteUser({ params }, res) {
  User.findOneDelete({ _id: params.id })
    .then(dbUserData => {
      if (!dbUserData) {
        return res.status(404).json({ message: 'No user found by this ID!?'});
      }
    })
},

addFriend({ params }, res) {
  User.findOneAndUpdate({ _id: params.id }, { $pull: {friends: params.friendId } }, { runValidators: true })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found by this ID!?'})
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.status(400).json(err));
},
}

module.exports = userControllers;