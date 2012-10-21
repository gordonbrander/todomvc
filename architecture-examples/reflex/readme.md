# [TodoMVC](http://todomvc.com) using Reflex

Reflex is a reactive programming approach to creating web applications.

Reflex allows you to react to, filter and transform live streams of data in
real time.

## Install

You'll need [Node][node] with [NPM][npm]. Once you've got that:

```sh
cd todomvc/architecture-examples/reflex
npm install
```

You'll also need [Browserify][].

```sh
npm install -g browserify
```

## Usage

```sh
cd todomvc/architecture-examples/reflex
npm run browserify
```

Open `index.html` in your browser. You don't need a local server.

Unfortunately [Browserify][browserify] watch is [broken on OSX 10.7][watch bug],
but there is a [fix][watch fix] that did not made it to upstream yet. As a
temporary workaround you could use that fix to get watch working:

```
git clone https://github.com/substack/node-browserify.git
cd node-browserify
curl https://github.com/substack/node-browserify/pull/190.patch | git am
npm install -g
```

[node]:http://nodejs.org/
[npm]:http://npmjs.org/
[browserify]:https://github.com/substack/node-browserify
[watch bug]:https://github.com/substack/node-browserify/issues/166
[watch fix]:https://github.com/substack/node-browserify/pull/190
