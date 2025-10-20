const Notes = require("../models/notes.models.js");

const isNoteOwner = async (req, res, next) => {
  const { id } = req.params;
  try {
    const note = await Notes.findById(id);

    if (!note) {
      return res.status(404).json({
        error: "Note not found !",
      });
    }

    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "Forbidden !",
      });
    }

    next();
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid type of id:${id}`,
        error: err,
      });
    }
    res.status(500).json({
      message: "Something went wrong with owner middleware !",
      error: err,
    });
  }
};

module.exports = isNoteOwner;
