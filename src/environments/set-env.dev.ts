const setEnv = () => {
  const fs = require('fs');
  const writeFile = fs.writeFile;
  // Configure Angular `environment.ts` file path
  const targetPath = './src/environments/environment.ts';
  // Load node modules
  const appVersion = require('../../package.json').version;
  require('dotenv').config({
    path: 'src/environments/.env',
  });
  // `environment.ts` file structure
  const envConfigFile = `export const environment = {
  GOOGLE_CLIENT_ID: '${process.env['GOOGLE_CLIENT_ID']}',
  GOOGLE_SECRET: '${process.env['GOOGLE_SECRET']}',
  MANGO_DB_CONNECTION_STRING: '${process.env['MANGO_DB_CONNECTION_STRING']}',
  MANGO_DB_CONNECTION_STRING_PHOTOS: '${process.env['MANGO_DB_CONNECTION_STRING_PHOTOS']}',
  HERE_MAPS_API_KEY: '${process.env['HERE_MAPS_API_KEY']}',
  MEASUREMENT_ID: '${process.env['MEASUREMENT_ID']}',
  FACEBOOK_APP_ID: '${process.env['FACEBOOK_APP_ID']}',
  EMAIL_USER: '${process.env['EMAIL_USER']}',
  EMAIL_PASSWORD: '${process.env['EMAIL_PASSWORD']}',
  REFRESH_PRIVATE_KEY: '${process.env['REFRESH_PRIVATE_KEY']}',
  REFRESH_PUBLIC_KEY: '${process.env['REFRESH_PUBLIC_KEY']}',
  AUTH_PRIVATE_KEY: '${process.env['AUTH_PRIVATE_KEY']}',
  AUTH_PUBLIC_KEY: '${process.env['AUTH_PUBLIC_KEY']}',
  PAYMENT_CONFIRMATION: '${process.env['PAYMENT_CONFIRMATION']}',
  PAYMENT_CANCELLED: '${process.env['PAYMENT_CANCELLED']}',
  PAYMENT_API_KEY: '${process.env['PAYMENT_API_KEY']}',
  WEBHOOK_SECRET: '${process.env['WEBHOOK_SECRET']}',
  PAYMENT_UPDATED_URL: '${process.env['PAYMENT_UPDATED_URL']}',
  ADMIN_TOKEN: '${process.env['ADMIN_TOKEN']}',
  appVersion: '${appVersion}',
  production: false,
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
