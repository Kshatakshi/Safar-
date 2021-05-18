const mongoose = require('mongoose');

const roadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Roads must have a name'],
    },
    coordinates: [], // long lat
    closestPoliceStation: {},
    policeInVicinity: {
      type: Number,
      default: 0,
    },
    lighting: {
      type: Number,
      default: 0,
    },
    crowd: {
      type: Number,
      default: 0,
    },
    genderRatio: {
      type: Number,
      default: 0,
    },
    feltSafe: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

roadSchema.virtual('finalScore').get(function () {
  return (
    this.policeInVicinity +
    this.lighting +
    this.crowd +
    this.genderRatio +
    this.feltSafe
  );
});

const Road = mongoose.model('Road', roadSchema);
module.exports = Road;
