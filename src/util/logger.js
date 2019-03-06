import bunyan from 'bunyan';

const log = bunyan.createLogger({
  name: 'cms-cloud',
  stream: process.stdout
});

export default log;
