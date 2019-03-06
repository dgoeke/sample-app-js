module.exports = {
  up: queryInterface => {
    const now = new Date();
    const resources = [];
    for (let i = 1; i < 11; i++) {
      resources.push({
        title: `Resource ${i}`,
        description: `Description ${i}`,
        date_created: now,
        date_updated: now
      });
    }
    return queryInterface.bulkInsert('resource', resources, {});
  },
  down: queryInterface => (
    queryInterface.bulkDelete('resource', null, {})
  )
};
