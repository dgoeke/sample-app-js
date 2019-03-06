import HTTPStatus from 'http-status';
import APIError from '../../errors/api-error';
import ResourceService from './resource-service';

const create = async (req, res) => {
  const resource = await ResourceService.createResource(req.body);
  res.status(HTTPStatus.CREATED).json(resource);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const resource = await ResourceService.loadOneResource({ id });
  if (!resource) {
    throw new APIError('NOT_FOUND', { id });
  }
  res.json(resource);
};

const getAll = async (req, res) => {
  const resources = await ResourceService.loadAllResources();
  if (!resources) {
    res.json([]);
  }
  res.json(resources);
};

export default {
  create,
  getById,
  getAll
};
