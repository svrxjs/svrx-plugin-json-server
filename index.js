const jsonServer = require('json-server');
const ffp = require('find-free-port');


function getFreePortAfter(port) {
  return new Promise((resolve, reject) => {
    ffp(port, '127.0.0.1', (err, p1) => {
      if (err) reject(Error('NO PORT FREE'));
      resolve(p1);
    });
  });
}


module.exports = {
  // Ref: https://docs.svrx.io/en/contribute/plugin.html#schema
  configSchema: {
    source: {
      default: 'db.json',
      description: 'The source of json server , can be an object or string, default is `db.json`',
      ui: false,
      anyOf: [
        {
          type: 'string',
        },
        {
          type: 'object',
        },
      ],
    },
    filter: {
      type: 'string',
      description: 'The request must be proxy to json-server',
    },
    fallback: {
      type: 'boolean',
      default: true,
      description: 'auto fallback to svrx when json-server is 404 (default: true)',
    },
    logger: {
      type: 'boolean',
      default: false,
      description: 'enable json-server logger (default: false)',
    },
    rewriter: {
      type: 'object',
      default: {},
      description: 'Add custom routes',
    },
  },

  hooks: {
    // Ref: https://docs.svrx.io/en/contribute/plugin.html#server
    async onCreate({
      middleware, config, events, 
    }) {
      let filter = config.get('filter');
      if (typeof filter === 'string') filter = new RegExp(filter);

      const isFilterRegexp = filter instanceof RegExp;

      const source = config.get('source');
      const fallback = config.get('fallback');
      const rewriter = config.get('rewriter');
      const loggerConfig = config.get('logger');

      const server = jsonServer.create();

      server.use(jsonServer.defaults({
        logger: loggerConfig,
      }));

      server.use(jsonServer.rewriter(rewriter));
      server.use(jsonServer.router(source));

      events.on('ready', (port) => {
        getFreePortAfter(port).then((jsonServerPort) => {
          server.listen(jsonServerPort, () => {
            middleware.add('json-server', {
              priority: 20,
              async onRoute(ctx, next) {
                if (!filter || (isFilterRegexp && filter.test(ctx.path))) {
                  await ctx.proxy(ctx, {
                    target: `http://localhost:${jsonServerPort}`,
                  });
                  if (ctx.status === 404 && fallback) {
                    ctx.body = undefined;
                    ctx.type = '';
                    ctx.status = 404;
                    return next();
                  }
                }
                return next();
              },
            });
          });
        });
      });

      return () => {
        // fire onDestory
      };
    },
  },
};
