const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collection: 'category',
  }
)

CategorySchema.virtual('id', {
  id: this.id,
})

const Category = mongoose.model('Category', CategorySchema)

module.exports = Category