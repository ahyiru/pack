const {resolve} = require('path');
// const colors = require('colors');

const {spawn} = require('node:child_process');

const initConfigs = require('./configs');

const startStr = ['start', 'run start', 'run dev'];

const starter = async () => {
  try {
    await initConfigs();
  } catch (err) {
    console.error('init configs error: ', err);
    return;
  }

  const huxyDir = __dirname;

  const argvs = process.argv.slice(2);

  const argvStr = argvs.join(' ');

  if (startStr.includes(argvStr)) {
    return spawn('node', [resolve(huxyDir, 'scripts/index.js')], {stdio: 'inherit'});
  }
  if (argvStr === 'run build') {
    return spawn('webpack', ['--config', resolve(huxyDir, 'scripts/webpack.production.js'), '--progress'], {stdio: 'inherit'});
  }
  if (argvStr === 'run analyze') {
    return spawn('webpack', ['--config', resolve(huxyDir, 'scripts/webpack.production.js'), '--progress'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        ANALYZE: true,
      },
    });
  }
  if (argvStr === 'run server') {
    return spawn('node', [resolve(huxyDir, 'scripts/server.js')], {stdio: 'inherit'});
  }
  if (argvStr === 'run test') {
    return spawn('jest', ['--colors', '--coverage'], {stdio: 'inherit'});
  }
  if (argvStr === 'run release') {
    return spawn('standard-version', [], {stdio: 'inherit'});
  }

  const cmd = argvs[0];
  const params = argvs.slice(1);

  spawn(cmd, params, {stdio: 'inherit'});

  /* starter.stdout.on('data', data => {
    console.log(data.toString().blue);
  });
  starter.stderr.on('data', data => {
    console.error(data.toString().red);
  }); */

};


module.exports = starter;