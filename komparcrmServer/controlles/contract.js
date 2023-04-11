const Contract = require('../models/contract');
const slugify = require('slugify');
const moment = require('moment');

exports.create = async (req, res) => {
  try {
    // console.log(req.body);
    //req.body.slug = slugify(slug);

    const newContract = await Contract.insertMany(req.body);
    //console.log(res);
    res.json(newContract);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.listAll = async (req, res) => {
  const filter = req.body.filterValues;
  console.log(filter);

  try {
    let query = {};
    if (filter.dateRange && filter.dateRange.endDate !== null) {
      query.date_signature = {};
      if (filter.dateRange.startDate) {
        query.date_signature.$gte = moment(filter.dateRange.startDate)
          .startOf('day')
          .toDate();
      }
      if (filter.dateRange.endDate) {
        query.date_signature.$lte = moment(filter.dateRange.endDate)
          .endOf('day')
          .toDate();
      }
    }
    if (filter.qualificationqté) {
      query['quality.qualification'] = filter.qualificationqté;
    }

    if (filter.qualificationwc) {
      query['wc.qualification'] = filter.qualificationwc;
    }

    if (filter.partenaire) {
      query.partenaire = filter.partenaire;
    }

    let contracts;

    if (Object.keys(query).length === 0) {
      contracts = await Contract.find({});
    } else {
      contracts = await Contract.find(query);
      console.log('querry ------->', query);
    }

    res.json(contracts);
  } catch (err) {
    console.log(err);
  }
};

// exports.listAllNp = async (req, res) => {
//   let contracts = await Contract.find({})
//     .limit(parseInt(req.params.count))

//     .sort([['createdAt', 'desc']])
//     .exec();
//   res.json(contracts);
// };
exports.contractsPagintationCursor = async (req, res) => {
  try {
    const { page, pageSize } = req.body;
    const totalRowCount = await Contract.countDocuments();
    const results = await Contract.find()
      .sort({ date_signature: -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .exec();

    return res.json({
      data: results,
      totalRowCount: totalRowCount,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.qualityContractsPaginationCursor = async (req, res) => {
  console.log(req.body);
  try {
    const { page, pageSize } = req.body;
    const totalRowCount = await Contract.countDocuments({
      'quality.qualification': 'non-qualifié',
    });
    const results = await Contract.find({
      'quality.qualification': 'non-qualifié',
    })
      .sort({ date_signature: -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .exec();

    return res.json({
      data: results,
      totalRowCount: totalRowCount,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getSavContacts = async (req, res) => {
  const quickFilterValue = req.body[0];

  try {
    let query = Contract.find();

    if (quickFilterValue) {
      query.or([
        { clientRef: { $eq: quickFilterValue } },
        { tel: { $eq: quickFilterValue } },
        { Nom: { $eq: quickFilterValue } },
      ]);
    } else {
      query.where('sav.qualification').in([null, '']);
      query.or([
        { 'quality.qualification': 'SAV' },
        { 'wc.qualification': 'SAV' },
      ]);
    }

    const contracts = await query.exec();
    res.json(contracts);
    console.log(contracts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// exports.contractFilter = async (req, res) => {
//   try {
//     const { filterOptions, quickFilterValue, sortOptions, page, pageSize } =
//       req.body;

//     const query = Contract.find();
//     const countQuery = Contract.find();

//     if (filterOptions) {
//       Object.values(filterOptions).forEach((filter) => {
//         switch (filter.operator) {
//           case 'contains':
//             query.regex(filter.column, new RegExp(filter.value, 'i'));
//             break;
//           case 'equals':
//             query.where(filter.column).equals(filter.value);
//             break;
//           case 'startsWith':
//             query.regex(filter.column, new RegExp(`^${filter.value}`, 'i'));
//             break;
//           case 'endsWith':
//             query.regex(filter.column, new RegExp(`${filter.value}$`, 'i'));
//             break;
//           case 'isEmpty':
//             query.where(filter.column).equals(null);
//             break;
//           case 'isnotempty':
//             query.where(filter.column).ne(null);
//             break;
//           case 'anyof':
//             query.where(filter.column).in(filter.value);
//             break;
//           case 'between': // add case for 'between' operator
//             query
//               .where(filter.column)
//               .gte(filter.value[0])
//               .lte(filter.value[1]);
//             break;
//           case 'is':
//             // Convert the filter value to an ISO date string
//             const filterDate = new Date(filter.value);
//             const isoDate = filterDate.toISOString();
//             const startOfDay = new Date(
//               `${isoDate.slice(0, 10)}T00:00:00.000Z`
//             );
//             const endOfDay = new Date(`${isoDate.slice(0, 10)}T23:59:59.999Z`);

//             // Query for documents where the date_signature field is between the start and end of the specified day
//             query.where(filter.column).gte(startOfDay).lte(endOfDay);
//             break;
//         }
//       });
//     }

//     if (quickFilterValue) {
//       query.or([
//         { clientRef: { $regex: new RegExp(quickFilterValue, 'i') } },
//         { tel: { $regex: new RegExp(quickFilterValue, 'i') } },
//         { Nom: { $regex: new RegExp(quickFilterValue, 'i') } },
//       ]);
//     }

//     if (sortOptions && sortOptions.length > 0) {
//       const sort = {};
//       sortOptions.forEach((sortOption) => {
//         sort[sortOption.field] = sortOption.sort === 'asc' ? 1 : -1;
//       });
//       query.sort(sort);
//     }

//     const totalRowCount = await countQuery.countDocuments();

//     const results = await query
//       .skip(page * pageSize)
//       .limit(pageSize)
//       .exec();

//     return res.json({
//       data: results,
//       totalRowCount: totalRowCount,
//     });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// exports.contractAdvancedFilter = async (req, res) => {
//   console.log(req.body);
//   try {
//     const { partenaire, qualificationQté, qualificationWc, dateRange } =
//       req.body.filterValues;
//     const quickFilterValue = req.body.quickFilterValue;

//     let query = Contract.find();

//     // Add filters based on available values
//     if (partenaire) {
//       query = query.where('partenaire', partenaire);
//     }

//     if (qualificationQté) {
//       query = query.where('quality.qualification', qualificationQté);
//     }

//     if (qualificationWc) {
//       query = query.where('wc.qualification', qualificationWc);
//     }

//     if (dateRange.startDate && dateRange.endDate) {
//       const startOfDay = moment(dateRange.startDate)
//         .startOf('day')
//         .toISOString();
//       const endOfDay = moment(dateRange.endDate).endOf('day').toISOString();
//       query = query
//         .where('date_signature')
//         .gte(new Date(startOfDay))
//         .lte(new Date(endOfDay));
//     }

//     if (quickFilterValue && quickFilterValue.length > 0) {
//       query = query.or([
//         { clientRef: { $regex: new RegExp(quickFilterValue, 'i') } },
//         { tel: { $regex: new RegExp(quickFilterValue, 'i') } },
//         { Prénom: { $regex: new RegExp(quickFilterValue, 'i') } },
//       ]);
//     }

//     const results = await query.exec();
//     return res.json({
//       data: results,
//       totalRowCount: results.length,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.contractFilter = async (req, res) => {
  try {
    const { filterOptions, quickFilterValue, sortOptions, page, pageSize } =
      req.body;

    const query = Contract.find();
    const countQuery = Contract.find();

    if (filterOptions) {
      Object.values(filterOptions).forEach((filter) => {
        switch (filter.operator) {
          case 'contains':
            query.regex(filter.column, new RegExp(filter.value, 'i'));
            countQuery.regex(filter.column, new RegExp(filter.value, 'i'));

            break;
          case 'equals':
            query.where(filter.column).equals(filter.value);
            countQuery.where(filter.column).equals(filter.value);

            break;
          case 'startsWith':
            query.regex(filter.column, new RegExp(`^${filter.value}`, 'i'));
            countQuery.regex(
              filter.column,
              new RegExp(`^${filter.value}`, 'i')
            );

            break;
          case 'endsWith':
            query.regex(filter.column, new RegExp(`${filter.value}$`, 'i'));
            countQuery.regex(
              filter.column,
              new RegExp(`${filter.value}$`, 'i')
            );

            break;
          case 'isEmpty':
            query.where(filter.column).equals(null);
            countQuery.where(filter.column).equals(null);

            break;
          case 'isnotempty':
            query.where(filter.column).ne(null);
            break;
          case 'anyof':
            query.where(filter.column).in(filter.value);
            break;
          case 'between': // add case for 'between' operator
            query
              .where(filter.column)
              .gte(filter.value[0])
              .lte(filter.value[1]);
            break;
          case 'is':
            // Convert the filter value to an ISO date string
            const filterDate = new Date(filter.value);
            const isoDate = filterDate.toISOString();
            const startOfDay = new Date(
              `${isoDate.slice(0, 10)}T00:00:00.000Z`
            );
            const endOfDay = new Date(`${isoDate.slice(0, 10)}T23:59:59.999Z`);

            // Query for documents where the date_signature field is between the start and end of the specified day
            query.where(filter.column).gte(startOfDay).lte(endOfDay);
            countQuery.where(filter.column).gte(startOfDay).lte(endOfDay);
          break;
        }
      });
    }

    if (quickFilterValue) {
      query.or([
        { clientRef: { $regex: new RegExp(quickFilterValue, 'i') } },
        { tel: { $regex: new RegExp(quickFilterValue, 'i') } },
        { Nom: { $regex: new RegExp(quickFilterValue, 'i') } },
      ]);
      countQuery.or([
        { clientRef: { $regex: new RegExp(quickFilterValue, 'i') } },
        { tel: { $regex: new RegExp(quickFilterValue, 'i') } },
        { Nom: { $regex: new RegExp(quickFilterValue, 'i') } },
      ]);
    }

    if (sortOptions && sortOptions.length > 0) {
      const sort = {};
      sortOptions.forEach((sortOption) => {
        sort[sortOption.field] = sortOption.sort === 'asc' ? 1 : -1;
      });
      query.sort(sort);
    }

    const results = await query
      .skip(page * pageSize)
      .limit(pageSize)
      .exec();
    const totalRowCount = await countQuery.countDocuments();

    return res.json({
      data: results,
      totalRowCount: totalRowCount,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.contractAdvancedFilter = async (req, res) => {
  try {
    const { partenaire, qualificationQté, qualificationWc, dateRange } =
      req.body.filterValues;
    const quickFilterValue = req.body.quickFilterValue;
    const { pageSize, page } = req.body;

    let query = Contract.find();

    // Add filters based on available values
    if (partenaire) {
      query = query.where('partenaire', partenaire);
    }

    if (qualificationQté) {
      query = query.where('quality.qualification', qualificationQté);
    }

    if (qualificationWc) {
      query = query.where('wc.qualification', qualificationWc);
    }

    if (dateRange.startDate && dateRange.endDate) {
      const startOfDay = moment(dateRange.startDate)
        .startOf('day')
        .toISOString();
      const endOfDay = moment(dateRange.endDate).endOf('day').toISOString();
      query = query
        .where('date_signature')
        .gte(new Date(startOfDay))
        .lte(new Date(endOfDay));
    }

    if (quickFilterValue && quickFilterValue.length > 0) {
      query = query.or([
        { clientRef: { $regex: new RegExp(quickFilterValue, 'i') } },
        { tel: { $regex: new RegExp(quickFilterValue, 'i') } },
        { Nom: { $regex: new RegExp(quickFilterValue, 'i') } },
      ]);
    }

    const totalRowCount = await Contract.countDocuments(query);
    const results = await query
      .skip(page * pageSize)
      .limit(pageSize)
      .exec();
    //       .sort([[sort, order]])

    return res.json({
      data: results,
      totalRowCount: totalRowCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//with pagination //

exports.contractsCount = async (req, res) => {
  let total = await Contract.find({}).estimatedDocumentCount().exec();
  res.json(total);
};

exports.read = async (req, res) => {
  console.log(req.params.slug, '----> i m slug');
  let contract = await Contract.findOne({ contratRef: req.params.slug }).exec();
  res.json(contract);
};

exports.search = async (req, res, query) => {
  console.log(req.params.slug, '----> i m slug');
  const contract = await Contract.findOne({ $text: { $search: query } }).exec();
  res.json(contract);
};

exports.remove = async (req, res) => {
  console.log(req);
  try {
    const deleted = await Contract.findByIdAndDelete(req.params._id);
    if (!deleted) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    res.json(deleted);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateData = async (req, res) => {
  console.log('---------> i m the req', req.body);

  try {
    const updatedDocument = await Contract.findOneAndUpdate(
      { contratRef: req.params.slug },
      req.body,
      { new: true }
    ).exec();

    console.log('---------> i m the update', updatedDocument);
    res.json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateQuality = async (req, res) => {
  console.log('---------> i m the req', req.body.quality);

  try {
    const updatedDocument = await Contract.findOneAndUpdate(
      { contratRef: req.params.slug },
      {
        $set: {
          'quality.values': req.body.quality,
          'quality.qualification': req.body.qualification,
          'quality.comment': req.body.comment,
        },
      },
      { new: true }
    ).exec();

    console.log('---------> i m the update', updatedDocument);
    res.json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateSav = async (req, res) => {
  console.log('---------> i m the req', req.body);

  try {
    const updatedDocument = await Contract.findOneAndUpdate(
      { contratRef: req.params.slug },
      {
        $set: {
          'sav.qualification': req.body.qualification,
          'sav.comment': req.body.comment,
        },
      },
      { new: true }
    ).exec();

    console.log('---------> i m the update', updatedDocument);
    res.json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateWc = async (req, res) => {
  console.log('---------> i m the req', req.body);

  try {
    const updatedDocument = await Contract.findOneAndUpdate(
      { contratRef: req.params.slug },
      {
        $set: {
          'wc.subQualification': req.body.subQualification,
          'wc.qualification': req.body.qualification,
          'wc.comment': req.body.comment,
        },
      },
      { new: true }
    ).exec();

    console.log('---------> i m the update', updatedDocument);
    res.json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// welcome call controller

exports.wcData = async (req, res) => {
  const quickFilterValue = req.body[0];

  try {
    const query = {
      $or: [
        { clientRef: { $eq: quickFilterValue } },
        { tel: { $eq: quickFilterValue } },
        { Prénom: { $eq: quickFilterValue } },
      ],
    };
    const contracts = await Contract.find(query).exec();

    // Close the database connection and return the filtered data in the response
    res.json(contracts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};
