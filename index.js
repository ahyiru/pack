import {spawn} from 'node:child_process';

// import colors from 'colors';

import getDirName from './configs/getDirName.js';

import initConfigs from './configs/index.js';

const {fixPath} = getDirName(import.meta.url);

const starter = async () => {
  try {
    await initConfigs();
  } catch (err) {
    console.error('init configs error: ', err);
    return;
  }

  const argvs = process.argv.slice(2);

  const argvStr = argvs.join(' ');

  const startStr = ['start', 'run start', 'run dev'].find(str => argvStr.startsWith(str));
  if (startStr) {
    const cmdArgs = argvStr.replace(startStr, '').split(' ').filter(Boolean);
    const child = spawn('node', [fixPath('scripts/index.js'), ...cmdArgs], {stdio: 'inherit'});
    child.on('close', code => process.exit(code));
    return;
  }
  if (argvStr.startsWith('run build')) {
    const cmdArgs = argvStr.replace('run build', '').split(' ').filter(Boolean);
    const child = spawn('webpack', ['--config', fixPath('scripts/webpack.production.js'), '--progress', ...cmdArgs], {stdio: 'inherit'});
    child.on('close', code => process.exit(code));
    return;
  }
  if (argvStr.startsWith('run analyze')) {
    const cmdArgs = argvStr.replace('run analyze', '').split(' ').filter(Boolean);
    const child = spawn('webpack', ['--config', fixPath('scripts/webpack.production.js'), '--progress', ...cmdArgs], {
      stdio: 'inherit',
      env: {
        ...process.env,
        ANALYZE: true,
      },
    });
    child.on('close', code => process.exit(code));
    return;
  }
  if (argvStr.startsWith('run server')) {
    const cmdArgs = argvStr.replace('run server', '').split(' ').filter(Boolean);
    const child = spawn('node', [fixPath('scripts/server.js'), ...cmdArgs], {stdio: 'inherit'});
    child.on('close', code => process.exit(code));
    return;
  }
  const testStr = ['test', 'run test', 'run jest'].find(str => argvStr.startsWith(str));
  if (testStr) {
    const cmdArgs = argvStr.replace(testStr, '').split(' ').filter(Boolean);
    const child = spawn('jest', ['--colors', '--coverage', ...cmdArgs], {stdio: 'inherit'});
    child.on('close', code => process.exit(code));
    return;
  }
  const releaseStr = ['release', 'run release'].find(str => argvStr.startsWith(str));
  if (releaseStr) {
    const cmdArgs = argvStr.replace(releaseStr, '').split(' ').filter(Boolean);
    const child = spawn('commit-and-tag-version', cmdArgs, {stdio: 'inherit'});
    child.on('close', code => process.exit(code));
    return;
  }

  const cmd = argvs[0];
  if (!cmd) {
    console.error('未传入命令');
    return;
  }
  console.error(`未知命令: ${cmd}`);
  process.exit(1);

  /* child.stdout.on('data', data => {
    console.log(data.toString().blue);
  });
  child.stderr.on('data', data => {
    console.error(data.toString().red);
  }); */

};

export default starter;