const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    encoding: { type: String, required: true, trim: true },
    mimetype: { type: String, required: true, trim: true },
    /* eslint-disable-next-line no-undef */
    buffer: Buffer,
    /* eslint-enable-next-line no-undef */
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collection: 'images',
  }
)

ImageSchema.virtual('id', {
  id: this.id,
})

const Image = mongoose.model('Image', ImageSchema)

module.exports = Image