const getArgs = args => {
  const argvs = args ?? process.argv.slice(2);
  const params = {};
  argvs.map(param => {
    const [key, value] = param.split('=');
    params[key] = value;
  });
  return params;
};

export default getArgs;
