exports.getEnvironmentConfig = async (req, res) => {
  if(req.hostname.includes('localhost') || req.query?.adminToken === process.env['ADMIN_TOKEN']) {
    return res.send({
        isProd: false,
    });
  }
  return res.send({
    isProd: true,
  });
};
