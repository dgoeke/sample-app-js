import { Joi } from 'celebrate';

const resourceParams = {
  title: Joi.string().required(),
  description: Joi.string().required()
};

export default {
  create: {
    body: Joi.object().keys({
      ...resourceParams
    })
  },
  getById: {
    params: {
      id: Joi.number().integer().required()
    }
  }
};
