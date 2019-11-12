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
    capture: {
      type: 'string',
      description: 'Determine which request must be proxy to json-server, default is null',
    },
    logger: {
      type: 'boolean',
      default: false,
      description: 'enable json-server logger (default: false)',
    },
  },

  hooks: {
    // Ref: https://docs.svrx.io/en/contribute/plugin.html#server
    async onCreate({
      middleware, config, events, router,
    }) {
      let proxy = config.get('proxy'); let
        filter = proxy;
      if (typeof proxy === 'string') proxy = new RegExp(filter);
      if (typeof proxy === 'boolean') filter = () => proxy;
      if (proxy instanceof RegExp) filter = (path) => proxy.test(path);

      const isFilterFn = typeof filter === 'function';

      const source = config.get('source');
      const loggerConfig = config.get('logger');

      const server = jsonServer.create();

      server.use(jsonServer.defaults({
        logger: loggerConfig,
      }));

      server.use(jsonServer.router(source));

      let proxyPort;

      function handle(ctx) {
        return ctx.proxy(ctx, {
          target: `http://localhost:${proxyPort}`,
        });
      }

      router.action('jsonServer', () => async (ctx) => {
        ctx.originalUrl = ctx.url;
        await handle(ctx);
      });

      events.on('ready', (port) => {
        getFreePortAfter(port).then((jsonServerPort) => {
          server.listen(jsonServerPort, () => {
            proxyPort = jsonServerPort;


            if (isFilterFn) {
              middleware.add('json-server', {
                priority: 20,
                onRoute(ctx, next) {
                  if (filter(ctx.path)) return handle(ctx);
                  else return next();
                },
              });
            }
          });
        });
      });

      return () => {
        // fire onDestory
      };
    },
  },
};
