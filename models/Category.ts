import mongoose, { Schema, models } from "mongoose"

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

const Category = models.Category || mongoose.model("Category", CategorySchema)

export default Category
