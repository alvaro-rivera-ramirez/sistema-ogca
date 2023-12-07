module.exports = {
    app: {
      domain: process.env.DOMAIN || "*",
      port: process.env.SERVER_PORT || 3000,
    },
    database: {
      host: process.env.DB_HOST || "db",
      user: process.env.DB_USER || "usuario",
      name: process.env.DB_NAME || "system_ogca",
      password: process.env.DB_PASSWORD || "usuario",
      port: process.env.DB_SERVER_PORT || "3306",
    },
    secret_key: {
      jwt_key: process.env.JWT_PRIVATE_KEY || "d5;{)bQbPP2Z1LwTG#;u&8'O`<32nG",
    },
  };
  