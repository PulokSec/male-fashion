import mongoose, { Schema } from "mongoose"

const DimensionsSchema = new Schema(
  {
    width: Number,
    height: Number,
    depth: Number,
  },
  { _id: false },
)

const ReviewSchema = new Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    reviewerName: {
      type: String,
      required: true,
    },
    reviewerEmail: {
      type: String,
    },
  },
  { _id: false },
)

const MetaSchema = new Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    barcode: String,
    qrCode: String,
  },
  { _id: false },
)

const ProductSchema = new Schema(
  {
    // Core product information
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    brand: {
      type: String,
      default: "",
    },

    // Media
    thumbnail: {
      type: String,
      default: "",
    },
    images: [String],

    // Inventory
    stock: {
      type: Number,
      default: 0,
    },
    sku: {
      type: String,
      default: "",
    },
    availabilityStatus: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Backordered", "Discontinued"],
      default: "In Stock",
    },
    minimumOrderQuantity: {
      type: Number,
      default: 1,
    },

    // Product attributes
    tags: [String],
    colors: [String],
    sizes: [String],
    material: String,
    weight: Number,
    dimensions: {
      type: DimensionsSchema,
      default: () => ({}),
    },

    // Additional information
    warrantyInformation: String,
    shippingInformation: String,
    returnPolicy: String,
    careInstructions: String,

    // Flags
    isNew: {
      type: Boolean,
      default: false,
      index: true,
    },
    isSale: {
      type: Boolean,
      default: false,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Ratings and reviews
    rating: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: [ReviewSchema],
      default: [],
    },

    // Metadata
    meta: {
      type: MetaSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  },
)

// Add text index for search
ProductSchema.index({ title: "text", description: "text", tags: "text", brand: "text" })

// Virtual for calculated sale price
ProductSchema.virtual("salePrice").get(function () {
  if (this.discountPercentage > 0) {
    return Number((this.price * (1 - this.discountPercentage / 100)).toFixed(2))
  }
  return null
})

// Ensure virtuals are included in JSON output
ProductSchema.set("toJSON", { virtuals: true })
ProductSchema.set("toObject", { virtuals: true })

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema)

export default Product
