## svrx-plugin-json-server

[![svrx](https://img.shields.io/badge/svrx-plugin-%23ff69b4?style=flat-square)](https://svrx.io/)
[![npm](https://img.shields.io/npm/v/svrx-plugin-json-server.svg?style=flat-square)](https://www.npmjs.com/package/svrx-plugin-json-server)

The svrx plugin for [json-server](https://github.com/typicode/json-server), help us to get a full fake REST API with zero coding and integrated with [svrx](https://svrx.io/).

## Usage

> Please make sure that you have installed [svrx](https://svrx.io/) already.

> Example beblow need a `db.json` in your current working directory, and with content like
> ```js
>posts: [
>   { id: 1, title: 'json-server', author: 'typicode' },
>   { id: 2, title: 'json-server', author: 'typicode2' }
>]
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

### Then...

Visit page `/posts/1` in your browser, you will  
found that the corresponding post object has been output, like

```js
{ id: 1, title: 'json-server', author: 'typicode' },
```

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

#### **filter \[String]:**

A regular expression string that represents a matching rule to proxy request to json-server.

if filter is not specified,all requests will go through the json-server

```js
svrx({
  plugins: [
    {
      name: 'json-server',
      options: {
        filter: 'blog|post' // only blog and post will go through json-server
      }
    }
  ]
});
```

#### **rewriter \[Object]:**

Add custom routes , see [json-server#routes](https://github.com/typicode/json-server#add-custom-routes) for more details

```js
svrx({
  plugins: [
    {
      name: 'json-server',
      options: {
        rewriter: {
          '/api/*': '/$1',
          '/:resource/:id/show': '/:resource/:id',
        }
      }
    }
  ]
});

// /api/posts  → /posts
// /api/posts/1   → /posts/1
// /posts/1/show  → /posts/1


```

#### **logger \[Object]:**

Enable json-server logger (default: false)


#### **fallback \[boolean]:**

Auto fallback to svrx when json-server is 404 (default: true)

## Priority

The json-server middleware's priority is 20, which is small than proxy(21), but bigger than serving(8).

## License

MIT
