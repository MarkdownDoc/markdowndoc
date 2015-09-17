'use strict';

import fs from 'fs';
import path from 'path';

/**
 * Type checking helpers.
 */
const toString = arg => Object.prototype.toString.call(arg);

/**
 * Tool to turn functions with Node-style callback APIs
 * into functions that return Promises
 *
 * @param  {Function} fn
 *
 * @return {Object}
 */
export function denodeify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, ...args) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(...args);
      });
    });
  };
}

/**
 * Filter files in array on regex.
 *
 * @param  {String} regex
 * @param  {String} dir
 * @param  {Array} array
 *
 * @return {Array}
 */
export function filter (dir, array, regex = null) {
  if (regex === null) {
    return array;
  }

  let newList = [];

  array.forEach(function (file) {
    let filePath = fs.lstatSync(path.resolve(dir, file));

    if (filePath.isDirectory()) {
      newList.push(file);
    } else if (filePath.isFile() && regex.test(file)) {
      newList.push(file);
    }
  });

  return newList;
}

/**
  * Merge given object.
  *
  * @param {Object} target
  * @param {Object} src
  *
  * @return {Object}
  */
export function merge (target, src) {
  let dst = {};

  if (target && is.object(target)) {
    Object.keys(target).forEach(function (key) {
      dst[key] = target[key];
    })
  }

  Object.keys(src).forEach(function (key) {
    if (!is.object(src[key]) || !src[key]) {
      dst[key] = src[key];
    } else {
      if (!target[key]) {
        dst[key] = src[key];
      } else {
        dst[key] = merge(target[key], src[key]);
      }
    }
  });

  return dst;
}

/**
 * Get first match from regex
 *
 * @param  {String} string
 * @param  {String} regex
 * @param  {Integer} index
 *
 * @return {String}
 */
export function getFirstMatch(string, regex, index = 1) {
  let matches;

  matches = regex.exec(string);

  return matches ? matches[index] : '';
}

export const is = {
  undef: arg => arg === void 0,
  string: arg => typeof arg === 'string',
  function: arg => typeof arg === 'function',
  object: arg => typeof arg === 'object' && arg !== null,
  plainObject: arg => toString(arg) === '[object Object]',
  array: arg => Array.isArray(arg),
  error: arg => is.object(arg) &&
    (toString(arg) === '[object Error]' || arg instanceof Error),
  promise: arg => arg && is.function(arg.then),
  stream: arg => arg && is.function(arg.pipe)
};
