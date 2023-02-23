const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const contractSchema = mongoose.Schema(
  {
    contratRef: {
      type: String,
      trim: true,
      maxlenght: 32,
      text: true,
    },
    slug: {
      type: String,
      slug: 'clientRef',
    },
    clientRef: {
      type: String,
      trim: true,
      maxlenght: 32,
      text: true,
    },
    civility: {
      type: String,
      trim: true,
      maxlenght: 8,
      text: true,
    },
    prenom: {
      type: String,
      trim: true,
      maxlenght: 32,
      text: true,
    },

    nom: {
      type: String,
      trim: true,
      maxlenght: 32,
      text: true,
    },
    tel: {
      type: String,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      maxlenght: 32,
      text: true,
    },
    adresse: {
      type: String,
      maxlenght: 100,
    },
    codePostal: {
      type: Number,
    },
    comune: {
      type: String,
      maxlenght: 50,
      text: true,
    },
    mensualiteElec: {
      type: Number,
    },
    optionTarifaire: {
      type: String,
    },
    prixAbonnement: {
      type: String,
    },
    prixKwhBase: {
      type: String,
    },
    prixKwhHp: {
      type: String,
    },
    prixKwhHc: {
      type: String,
    },
    puissance: {
      type: Number,
    },
    dateActivationElec: {
      type: Date,
    },
    mensualiteGaz: {
      type: Number,
    },
    dateActivationGaz: {
      type: Date,
    },
    //   category: {
    //     type: ObjectId,
    //     ref: 'category',
    //   },
    //   subs: [
    //     {
    //       type: ObjectId,
    //       ref: 'Sub',
    //     },
    //   ],
    //   quantity: Number,
    //   sold: {
    //     type: Number,
    //     default: 0,
    //   },
    //   images: {
    //     type: Array,
    //   },
    //   shipping: {
    //     type: String,
    //     enum: ['yes', 'no'],
    //   },
    //   color: {
    //     type: String,
    //     enum: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
    //   },
    //   brand: {
    //     type: String,
    //     enum: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'Asus'],
    //   },
    //   ratings: [
    //     {
    //       star: Number,
    //       postedBy: { type: ObjectId, ref: 'User' },
    //     },
    //   ],
  },
  { timestamps: true }
);
module.exports = mongoose.model('Contract', contractSchema);
