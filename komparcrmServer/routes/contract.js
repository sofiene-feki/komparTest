const express = require('express');

const router = express.Router();
const { authCheck, adminCheck } = require('../middlewares/auth');

const {
  create,
  listAll,
  remove,
  read,
  updateQuality,
  updateSav,
  updateWc,
  contractsPagintationCursor,
  contractsCount,
  search,
  contractFilter,
  wcData,
  qualityContractsPaginationCursor,
  getSavContacts,
} = require('../controlles/contract');

router.post('/contract', authCheck, adminCheck, create);
router.post('/contractsPagintationCursor', contractsPagintationCursor);
router.post(
  '/qualityContractsPaginationCursor',
  qualityContractsPaginationCursor
);
router.post('/contracts/sav', getSavContacts);
router.post('/ContractsFilters', contractFilter);
router.post('/contracts', listAll);
router.post('/contracts/welcome-call', wcData);
router.get('/contracts/total', contractsCount);
router.get('/:contract/:slug', read);
router.post('/search/filter', search);
router.delete('/contract/:_id', authCheck, adminCheck, remove);
router.put('/contract/update/quality/:slug', authCheck, updateQuality);
router.put('/contract/update/sav/:slug', authCheck, updateSav);
router.put('/contract/update/wc/:slug', authCheck, updateWc);

module.exports = router;
