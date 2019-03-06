import express from 'express';
import ResourceController from './resource-controller';
import ResourceValidtor from './resource-validator';
import ValidatorUtil from '../../util/validator';

const router = express.Router();
const validate = ValidatorUtil.getEndPointValidator(ResourceValidtor);

router.route('/resources')
  .get(validate(ResourceController.getAll))
  .post(validate(ResourceController.create));

router.route('/resources/:id')
  .get(validate(ResourceController.getById));

export default router;
