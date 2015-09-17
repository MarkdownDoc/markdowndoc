'use strict';

import fs from 'fs';
import path from 'path';

import { filter } from './utils';

export function createTree (dir, done, fileNameRegex) {
  let results     = [];
  let files       = [];

  fs.readdir(dir, function (err, list) {
    if (err) {
      return done(err);
    }

    list = filter(dir, list, fileNameRegex);

    let pending = list.length;

    if (!pending) {
      // Folder
      return done(null, {
        dir: dir,
        files: {},
        directories: results
      });
    }

    list.forEach(function (file) {
      let filePath = path.resolve(dir, file);

      fs.stat(filePath, function (err, stat) {
        if (stat && stat.isDirectory()) {
          createTree(filePath, function (err, res) {
            // Folder
            if (!--pending) {
              results.push({
                path: dir,
                files: files,
                directories: res
              });

              done(null, results);
            }
          }, fileNameRegex);
        } else {
          // File
          files.push({
            fileName: filePath,
            title: '',
            html: ''
          });

          if (!--pending) {
            results.push({
              path: dir,
              files: files,
              directories: []
            });

            done(null, results);
          }
        }
      });
    });
  });
}
