/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true  devel: true browser: true
         forin: true latedef: false globalstrict: true */
'use strict';

window.require = require;

// Imports
// -----------------------------------------------------------------------------

var open = require('reducers/dom').open
var compound = require("compound")
var hub = require('reducers/hub')
var core = require('reducers/core'),
    filter = core.filter,
    map = core.map,
    reductions = core.reductions

var reduce = require('reducers/accumulator').reduce

// Helper Functions
// -----------------------------------------------------------------------------

function id() {
  /**
  Function returns generated unique `id` when invoked.
  **/
  return (Date.now()).toString(32)
}


// Mutates an element by capturing, removing and returning it's value.
var removeValue = function (el) {
  var value = el.value;
  el.value = '';
  return value;
};

// Create a new Todo element from a template by passing an
// object as a data model.
var makeTaskView = function (model) {
  var view = document.createElement("li")
  view.setAttribute("id", model.cid)
  view.innerHTML = "<div class=view><input class=toggle type=checkbox>" +
                      "<label>" + model.title + "</label>" +
                      "<button class=destroy></button>"
                      "</div>" +
                      "<input class=edit value='" + model.title + "'>"
  return view
}

// Prepend an element to the top of a parent element.
// This helper could be replaced if you decide to use jQuery.
var prepend = function (parent, view) {
  var firstChild = parent.firstChild
  parent.insertBefore(view, firstChild)
}

// Create new TODO
// -----------------------------------------------------------------------------

var inputs = (compound
  (open, "keypress")
  (filter, function isEnter(event) { return event.keyCode === 13 })
  (document.documentElement))

var newTasks = (compound
  (map, function(event) { return event.target.value })
  (filter, function(title) { return !!title })
  (map, function(title) {
    return { id: id(), title: title, done: false }
  })
  (hub)
  (inputs))

var newViews = (compound
  (map, makeTaskView)
  (newTasks))

var count = reductions(newTasks, function(x) {
  return x + 1
}, 0)

// Add the todo elements to the DOM as they stream in.
reduce(newViews, function(container, view) {
  prepend(container, view)
  return container
}, document.getElementById("todo-list"))

reduce(inputs, function(_, event) {
  event.target.value = ""
})

// Update the item count for each item entered.
reduce(count, function(view, n) {
  view.textContent = n
  return view
}, document.getElementById("todo-count"))

function getViewID(element) {
  return element.parentElement.parentElement.getAttribute('id')
}

var completeUpdates = (compound
  (open, "change")
  (map, function(event) { return event.target })
  (map, function(target) {
    return { id: getViewID(target), done: target.checked }
  })
  (document.documentElement))

reduce(completeUpdates, function(_, update) {
  document.getElementById(update.id).className = update.done ? "completed" : ""
})



