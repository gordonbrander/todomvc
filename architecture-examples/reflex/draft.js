/*jshint asi:true */
var chanegs = channel()

var state = reductions(input, function(state, changes) {
  return apply(changes, state)
}, localStorage)

write(state, localStorage)


var app = {
  open: map(state, function(items) {
    return items.filter(function(item) {
      return item.done
    }).length
  }),
  closed: map(state, function(items) {
    return items.filter(function(item) {
      return !item.done
    }).length
  })
}


function writeTextContent(input, output, initial) {
  reductions(input, function(state, update) {
    if (state !== update) outputs.textContent = update
    return update
  }, initial)
}

function render(inputs, outputs) {
  Object.keys(inputs).forEach(function(name) {
    pipe(inputs[name], outputs[name])
  })
}
render(app, {
  open: openItemsNode,
  closed: closedItemNode
})


function model(initial, apply, render) {
  var state = channel()
  var view = render(state)
  reductions(state, function(state, update) {
    apply(update, view)
  })
  return { id: initial.id, input: state, view: view }
}


function updateView(update, view) {
  if (text in update) view.querySelector(".text").innerHTML = update.text
  if (done in update) view.querySelector(".done").checked = update.done
}


connect({
  ".text": "text",
  ".done:checked": "done"
})






// Utils


var open = require('reducers/dom').open
var compound = require("compound")
var hub = require('reducers/hub')
var core = require('reducers/core'),
    filter = core.filter,
    map = core.map,
    reductions = core.reductions

var reduce = require("reducers/accumulator").reduce
var channel = require("reducers/channel")
var enqueue = channel.enqueue



function writer(swap, close, open) {
  return function write(input, output) {
    output = output || open()
    reduce(input, function(state, update) {
      if (update === null) close(output)
      else swap(output, update)
      return update
    })
    return output
  }
}

function htmlElement(tagName) {
  return writer(function swap(element, state) {
    element.textContent = state
  }, function close(element) {
    if (element.parentElement)
      element.parentElement.removeChild(element)
      }, function open(state) {
        return document.createElement(tagName)
      })
}

var h1 = htmlElement("h1")

var makeAxis = (compound
            (open, "mousemove")
            (map, function(event) { return event.x + ":" + event.y }))

axis = axis(document.body)

document.body.appendChild(h1(axis))



var input = channel()
document.body.appendChild(h1(input))


var write = connect({
  ".text": "text",
  ".done:checked": "done"
})

function connect(mapping) {
  return writer(function swap(root, data) {
    Object.keys(data).forEach(function(key) {
      root.querySelector(mapping[key]).textContent = data[key]
    })
  }, function close(element) {
    element.parentElement.removeChild(element)
  })
}
