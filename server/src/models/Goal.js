const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true
    },
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: false
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true
    },
    category: {
      type: String,
      enum: ['Overall', 'Energy', 'Water', 'Renewable Energy', 'Materials', 'Waste', 'Green Features'],
      default: 'Overall'
    },
    targetValue: {
      type: Number,
      required: true
    },
    currentValue: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      default: 'pts'
    },
    deadline: {
      type: Date
    },
    status: {
      type: String,
      enum: ['On Track', 'At Risk', 'Completed'],
      default: 'On Track'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Goal', goalSchema);
