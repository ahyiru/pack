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
    const child = spawn('node', [resolve(huxyDir, 'scripts/index.js')], {stdio: 'inherit'});
    child.on('close', code => process.exit(code));
    return;
  }
  if (argvStr === 'run build') {
    const child = spawn('webpack', ['--config', resolve(huxyDir, 'scripts/webpack.production.js'), '--progress'], {stdio: 'inherit'});
    child.on('close', code => process.exit(code));
    return;
  }
  if (argvStr === 'run analyze') {
    const child = spawn('webpack', ['--config', resolve(huxyDir, 'scripts/webpack.production.js'), '--progress'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        ANALYZE: true,
      },
    });
    child.on('close', code => process.exit(code));
    return;
  }
  if (argvStr === 'run server') {
    const child = spawn('node', [resolve(huxyDir, 'scripts/server.js')], {stdio: 'inherit'});
    child.on('close', code => process.exit(code));
    return;
  }
  if (argvStr === 'run test') {
    const child = spawn('jest', ['--colors', '--coverage'], {stdio: 'inherit'});
    child.on('close', code => process.exit(code));
    return;
  }
  if (argvStr === 'run release') {
    const child = spawn('standard-version', [], {stdio: 'inherit'});
    child.on('close', code => process.exit(code));
    return;
  }

  const cmd = argvs[0];
  const params = argvs.slice(1);

  const child = spawn(cmd, params, {stdio: 'inherit'});

  child.on('close', code => process.exit(code));

  /* child.stdout.on('data', data => {
    console.log(data.toString().blue);
  });
  child.stderr.on('data', data => {
    console.error(data.toString().red);
  }); */

};


module.exports = starter;