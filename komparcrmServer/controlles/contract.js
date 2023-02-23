const Contract = require('../models/contract');
const slugify = require('slugify');

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

// exports.listAllNp = async (req, res) => {
//   let contracts = await Contract.find({})
//     .limit(parseInt(req.params.count))

//     .sort([['createdAt', 'desc']])
//     .exec();
//   res.json(contracts);
// };
exports.contractsPagintationCursor = async (req, res) => {
  try {
    const { cursor, pageSize } = req.body;
    const query = cursor
      ? Contract.find({ _id: { $lt: cursor } })
          .sort({ _id: -1 })
          .limit(pageSize)
      : Contract.find().sort({ _id: -1 }).limit(pageSize);

    const models = await query.exec();
    const nextCursor = models.length > 0 ? models[models.length - 1]._id : null;

    return res.json({
      data: models,
      nextCursor,
      totalRowCount: await Contract.countDocuments(),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.contractFilter = async (req, res) => {
  // if (!req.body) {
  //   return res.status(400).json({ error: 'Filter options are missing' });
  // }a
  console.log(req.body);
  try {
    const { filterOptions, quickFilterValue, sortOptions } = req.body;

    //console.log(quickFilterValue);
    // if (!filterOptions) {
    //   return res.status(400).json({ error: 'Filter options are missing' });
    // }
    const query = Contract.find();
    if (filterOptions) {
      Object.values(filterOptions).forEach((filter) => {
        switch (filter.operator) {
          case 'contains':
            query.regex(filter.column, new RegExp(filter.value, 'i'));
            break;
          case 'equals':
            query.where(filter.column).equals(filter.value);
            break;
          case 'startsWith':
            query.regex(filter.column, new RegExp(`^${filter.value}`, 'i'));
            break;
          case 'endsWith':
            query.regex(filter.column, new RegExp(`${filter.value}$`, 'i'));
            break;
          case 'isEmpty':
            query.where(filter.column).equals(null);
            break;
          case 'isnotempty':
            query.where(filter.column).ne(null);
            break;
          case 'anyof':
            query.where(filter.column).in(filter.value);
            break;
        }
      });
    }

    if (quickFilterValue) {
      query.or([
        { clientRef: { $regex: new RegExp(quickFilterValue, 'i') } },
        { tel: { $regex: new RegExp(quickFilterValue, 'i') } },
        { prenom: { $regex: new RegExp(quickFilterValue, 'i') } },
      ]);
    }

    if (sortOptions && sortOptions.length > 0) {
      const sort = {};
      sortOptions.forEach((sortOption) => {
        sort[sortOption.field] = sortOption.sort === 'asc' ? 1 : -1;
      });
      query.sort(sort);
    }

    const results = await query.exec();
    return res.json({
      data: results,
      totalRowCount: results.length,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//with pagination //
exports.listAll = async (req, res) => {
  console.table(req.body);
  try {
    const { sort, order, page, filter } = req.body;
    const currentPage = page || 0;
    const perPage = 25;
    const quickFilterValue = req.body.quickFilter[0];

    let query = Contract.find();

    if (filter) {
      filter.forEach((filter) => {
        switch (filter.operator) {
          case 'contains':
            query.regex(filter.column, new RegExp(filter.value, 'i'));
            break;
          case 'equals':
            query.where(filter.column).equals(filter.value);
            break;
          case 'startsWith':
            query.regex(filter.column, new RegExp(`^${filter.value}`, 'i'));
            break;
          case 'endsWith':
            query.regex(filter.column, new RegExp(`${filter.value}$`, 'i'));
            break;
          case 'isEmpty':
            query.where(filter.column).equals(null);
            break;
          case 'isnotempty':
            query.where(filter.column).ne(null);
            break;
          case 'anyof':
            query.where(filter.column).in(filter.value);
            break;
        }
      });
    }

    // add quick filter using 'contains' operator
    if (quickFilterValue) {
      query.or([
        { clientRef: { $regex: new RegExp(quickFilterValue, 'i') } },
        { tel: { $regex: new RegExp(quickFilterValue, 'i') } },
        { prenom: { $regex: new RegExp(quickFilterValue, 'i') } },
      ]);
    }

    const contracts = await query
      .skip(currentPage * perPage)
      .sort([[sort, order]])
      .limit(perPage)
      .exec();

    res.json(contracts);
  } catch (err) {
    console.log(err);
  }
};

exports.contractsCount = async (req, res) => {
  let total = await Contract.find({}).estimatedDocumentCount().exec();
  res.json(total);
};

exports.read = async (req, res) => {
  console.log(req.params.slug, '----> i m slug');
  let contract = await Contract.findOne({ clientRef: req.params.slug }).exec();
  res.json(contract);
};

exports.search = async (req, res, query) => {
  console.log(req.params.slug, '----> i m slug');
  const contract = await Contract.findOne({ $text: { $search: query } }).exec();
  res.json(contract);
};
