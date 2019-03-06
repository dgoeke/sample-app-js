import Resource from './resource-model';

const createResource = async (resource, options = {}) => (
  Resource.create(resource, options)
);

const loadOneResource = async filter => {
  const resource = await Resource.find({
    where: filter
  });
  return resource;
};

const loadAllResources = async () => {
  const resources = await Resource.findAll();
  return resources;
};

export default {
  createResource,
  loadOneResource,
  loadAllResources
};
