const express = require('express');

const router = express.Router();
const { authCheck, adminCheck } = require('../middlewares/auth');

const {
  create,
  listAll,
  // remove,
  read,
  // update,
  contractsPagintationCursor,
  contractsCount,
  search,
  contractFilter,
} = require('../controlles/contract');

router.post('/contract', authCheck, adminCheck, create);
router.post('/contractsPagintationCursor', contractsPagintationCursor);
router.post('/ContractsFilters', contractFilter);
router.post('/contracts', listAll);
router.get('/contracts/total', contractsCount);
router.get('/:contract/:slug', read);
router.post('/search/filter', search);

module.exports = router;
