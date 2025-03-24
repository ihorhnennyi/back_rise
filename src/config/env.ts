export default () => ({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  database: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/crm',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'defaultsecret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
});
