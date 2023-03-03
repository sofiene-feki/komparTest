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
    partenaire: {
      type: String,
    },
    quality: {
      values: {
        Appel_enregistré: {
          type: Boolean,
          default: false,
        },
        _14j_de_rétractation: {
          type: Boolean,
          default: false,
        },
        Autorisation_accès_GRD: {
          type: Boolean,
          default: false,
        },
        Inscription_Bloctel: {
          type: Boolean,
          default: false,
        },
        Valider_les_coordonnées_du_client: {
          type: Boolean,
          default: false,
        },
        Expliquer_que_nous_sommes_KOMPAR: {
          type: Boolean,
          default: false,
        },
        Explication_changement_de_fournisseur: {
          type: Boolean,
          default: false,
        },
        Discours_frauduleux_mensenger: {
          type: Boolean,
          default: false,
        },
        MES_non_conforme: {
          type: Boolean,
          default: false,
        },
        non_conformité_signature_recap: {
          type: Boolean,
          default: false,
        },
        Validation_à_la_place_du_prospect: {
          type: Boolean,
          default: false,
        },
        Comportement_général: {
          type: Boolean,
          default: false,
        },
        Mineur_trop_âgée_non_lucide: {
          type: Boolean,
          default: false,
        },
        IBAN_invalide: {
          type: Boolean,
          default: false,
        },
      },
      qualification: {
        type: String,
        enum: ['conforme', 'non-conforme', 'sav', 'annulation', 'non-qualifié'],
        default: 'non-qualifié',
      },
      comment: { type: String, default: '' },
    },
    sav: {
      qualification: {
        type: String,
        enum: ['validé', 'A_relancer', 'annulation', 'non-qualifié'],
      },
      comment: { type: String, default: '' },
    },

    wc: {
      qualification: {
        type: String,
        enum: [
          'validé',
          'A_suivre',
          'annulation',
          'non-qualifié',
          'sav',
          'faux_numéro',
        ],
      },
      subQualification: {
        type: String,
        enum: [
          ' Iban_frauduleux',
          ' STOP_Télémarketing',
          'Hors_cible',
          'forcing',
          'Déménagement',
          'Contrat_en_double',
        ],
      },
      comment: { type: String, default: '' },
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
