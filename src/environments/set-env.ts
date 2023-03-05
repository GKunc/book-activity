const setEnv = () => {
  const fs = require('fs');
  const writeFile = fs.writeFile;
  // Configure Angular `environment.ts` file path
  const targetPath = './src/environments/environment.prod.ts';
  // Load node modules
  const appVersion = require('../../package.json').version;
  require('dotenv').config({
    path: 'src/environments/.env'
  });
  // `environment.ts` file structure
  const envConfigFile = `export const environment = {
  GOOGLE_CLIENT_ID: '${process.env["GOOGLE_CLIENT_ID"]}',
  GOOGLE_SECRET: '${process.env["GOOGLE_SECRET"]}',
  MANGO_DB_CONNECTION_STRING: '${process.env["MANGO_DB_CONNECTION_STRING"]}',
  MANGO_DB_CONNECTION_STRING_PHOTOS: '${process.env["MANGO_DB_CONNECTION_STRING_PHOTOS"]}',
  API_URL: 'hhtp://localhost:8080',
  appVersion: '${appVersion}',
  production: true,
};
`;
  console.log('The file `environment.ts` will be written with the following content: \n');
  writeFile(targetPath, envConfigFile, (err) => {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
    }
  });
};

setEnv();