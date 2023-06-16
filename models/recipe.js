const mongoose = require('mongoose')

const RecipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    ingredients: [{ type: String, trim: true }],
    instructions: [{ type: String, trim: true }],
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        required: true,
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collection: 'recipes',
  }
)

RecipeSchema.virtual('id', {
  id: this.id,
})

const Recipe = mongoose.model('Recipe', RecipeSchema)

module.exports = Recipe