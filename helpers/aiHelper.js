export function parsePostgresUrl(postgresUrl) {
    const { protocol, username, password, host, port, pathname } = new URL(postgresUrl);
    const dbName = pathname.slice(1);
  
    return {
      username,
      password,
      host,
      port,
      database: dbName,
    };
  }