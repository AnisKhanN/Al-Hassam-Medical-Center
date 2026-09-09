const mongoose = require("mongoose");

const clinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    phone: String,

    address: String,

    logo: String,

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },

    subscriptionPlan: {
      type: String,
      enum: ["free", "basic", "premium"],
      default: "free",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Clinic Metadata for AI Embeddings
    aiSummary: {
      type: String,
      default: "",
    },
    aiEmbeddings: {
      type: [Number],
      default: [],
    },
    aiEmbeddingUpdatedAt: {
      type: Date,
    },
    aiEmbeddingVersion: {
      type: String,
      default: "v1",
    },
    // Subscription tracking
    subscriptionStatus: {
      type: String,
      enum: ["active", "grace_period", "inactive", "suspended", "expired"],
      default: "grace_period",
    },
    subscriptionStartDate: {
      type: Date,
    },
    subscriptionEndDate: {
      type: Date,
    },
    subscriptionType: {
      type: String, // free, starter, professional, enterprise
    },
    // Clinic Configuration for AI limits
    aiFeatures: {
      type: Object,
      default: () => ({}),
    },
    aiTokenLimitPerDay: {
      type: Number,
      default: 10000,
    },
    aiUsageResetDay: {
      type: Number, // 1-31
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Clinic", clinicSchema);
