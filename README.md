## svrx-plugin-json-server

[![svrx](https://img.shields.io/badge/svrx-plugin-%23ff69b4?style=flat-square)](https://svrx.io/)
[![npm](https://img.shields.io/npm/v/svrx-plugin-json-server.svg?style=flat-square)](https://www.npmjs.com/package/svrx-plugin-json-server)

The svrx plugin for [json-server](https://github.com/typicode/json-server), help us to get a full fake REST API with zero coding and integrated with [svrx](https://svrx.io/).

## Usage

> Please make sure that you have installed [svrx](https://svrx.io/) already.

> Example beblow need a `db.json` in your current working directory, and with content like
> ```js
> {
>   posts: [
>     { id: 1, title: 'json-server', author: 'typicode' },
>     { id: 2, title: 'json-server', author: 'typicode2' }
>   ]
> }
> ```

### Via CLI

```bash
svrx -p json-server
```

### Via API

```js
const svrx = require('@svrx/svrx');

svrx({ plugins: ['json-server'] }).start();
```

### Then Play it in your `route.js`

This plugin will register a route action named `jsonServer` which can help to proxy specified request to json-server

> see [svrx routing dsl](https://docs.svrx.io/en/guide/route.html)([中文文档](https://docs.svrx.io/zh/guide/route.html)) for more details

```js
get('/(.*)').to.jsonServer();
```

Now, all request will be proxy to json-server. 

Visit page `/posts/1` in your browser, you will  
found that the corresponding post object has been output, like

```js
  { id: 1, title: 'json-server', author: 'typicode' },
```



### request rewrite

By action [rewrite](https://docs.svrx.io/en/guide/route.html#rewrite), you can also rewrite request before proxy to json-server

```js
get('/api/(.*)').rewrite('/{0}')to.jsonServer()
// /api/posts >  /posts
```


### And More...

> See [official json-server reference ](https://github.com/typicode/json-server) for more details about json-server


## Options

#### **source \[String|Object]:**

The source of json server , can be an object or string, default is `db.json`;

```js
svrx({
  plugins: [
    {
      name: 'json-server',
      options: {
        //or source: 'path/to/db.json'
        source: {
          posts: [
            { id: 1, title: 'json-server', author: 'typicode' },
            { id: 2, title: 'json-server', author: 'typicode2' }
          ]
        }
      }
    }
  ]
});
```

#### **proxy \[String|RegExp|Function]:**

A regular expression string or filter function that represents a matching rule to proxy request to json-server.

```js
svrx({
  plugins: [
    {
      name: 'json-server',
      options: {
        filter: 'blog|post' // blog and post will go through json-server
      }
    }
  ]
});
```

> In a simple usage, you can use this option instead of manually declaring a route.

#### **logger \[Object]:**

Enable json-server logger (default: false)

## License

MIT
