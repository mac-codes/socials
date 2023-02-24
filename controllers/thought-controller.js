const { User, Thoughts } = require('../models');

const thoughtController = {
  getAllThoughts(req, res) {
    Thoughts.find({})
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  getThoughtById({ params }, res) {
    Thoughts.findOne({ _id: params.thoughtId })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'ʕ·ᴥ·ʔ No Thought with this ID!?' });
          return;
        }
        res.json(dbThoughtData);
      });
  },
  addThought({ params, body }, res) {
    console.log(body);
    Thoughts.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'ʕ·ᴥ·ʔ No user found by this ID!? '});
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },
  updateThought({ params }, res) {
    Thoughts.findOneAndDelete({ _id: params.thoughtId })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'ʕ·ᴥ·ʔ No thought with this ID!?'});
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  },

  removeThought({ params }, res) {
    Thoughts.findOneAndDelete({ _id: params.thoughtId })
      .then(deleteThought => {
        if(!deleteThought) {
          return res.status(404).json({ message: 'ʕ·ᴥ·ʔ No thought with this ID!?'});
        }
        return User.findOneAndUpdate(
          { _id: params.UserId },
          { $pull: { thoughts: params.thoughtId } },
          {new: true }
        );
      })
      .then(dbUserData => {
        if(!dbUserData) {
          res.status(404).json({ message: 'ʕ·ᴥ·ʔ No user found by this ID!?' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  addReaction({ params, body }, res) {
    Thoughts.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'ʕ·ᴥ·ʔ No thought with this ID!?'})
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.json(err));
  },

  removeReaction({ params }, res) {
    console.log(params.thoughtId, params.reactionId);
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { runValidators: true, new: true }
    )
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
}
};

module.exports = thoughtController;