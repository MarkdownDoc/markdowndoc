import fs from 'fs';
import path from 'path';

import { filter } from './utils';

export function createTree(dir, done, fileNameRegex) {
  const results     = [];
  const files       = [];

  fs.readdir(dir, function(err, list) {
    if (err) {
      return done(err);
    }

    const filteredList = filter(dir, list, fileNameRegex);

    let pending = filteredList.length;

    if (!pending) {
      // Folder
      return done(null, {
        dir: dir,
        files: {},
        directories: results,
      });
    }

    filteredList.forEach(function(file) {
      const filePath = path.resolve(dir, file);

      fs.stat(filePath, function(error, stat) {
        if (stat && stat.isDirectory()) {
          createTree(filePath, function(treeError, res) {
            // Folder
            if (!--pending) {
              results.push({
                path: dir,
                files: files,
                directories: res,
              });

              done(null, results);
            }
          }, fileNameRegex);
        } else {
          // File
          files.push({
            fileName: filePath,
            title: '',
            html: '',
          });

          if (!--pending) {
            results.push({
              path: dir,
              files: files,
              directories: [],
            });

            done(null, results);
          }
        }
      });
    });
  });
}
