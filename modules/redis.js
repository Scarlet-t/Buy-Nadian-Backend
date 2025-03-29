require("dotenv").config();
const { Redis } = require('@upstash/redis');


const redis = new Redis({
    url: 'https://quick-dinosaur-38305.upstash.io',
    token: process.env.REDIS_TOKEN,
  });

  module.exports={redis};
