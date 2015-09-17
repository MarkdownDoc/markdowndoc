'use strict';

import read from 'read-file';

import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import checkbox from 'markdown-it-checkbox';
import linkscheme from 'markdown-it-linkscheme';
import responsive from 'markdown-it-responsive';

export default function render (env, filepath) {

  function renderHtml(env, filepath) {
    let md   = markdown(env);
    let file = read.sync(filepath, { encoding: 'utf8' });

    return md.render(file, { encoding: 'utf8' });
  }

  function markdown (env) {
    let md = new MarkdownIt({
      highlight: function (str, lang) {
        return markdownHighlight(env, str, lang);
      }
    });

    let plugin = env.get('intern.plugins');

    if (plugin.linkscheme) {
      md.use(linkscheme);
    }

    if (plugin.responsiveimage) {
      md.use(responsive, responsiveOption());
    }

    if (plugin.checkbox) {
      md.use(checkbox);
    }

    return md;
  }

  function responsiveOption() {
    return {
      responsive: {
        'srcset': {
          'header-*': [{
            width: 480,
            rename: {
              suffix: '-small'
            }
          }, {
            width: 768,
            rename: {
              suffix: '-medium'
            }
          }]
        },
        'sizes': {
          'header-*': '(min-width: 48em) 33.3vw, 100vw'
        }
      }
    };
  }

  function markdownHighlight (env, str, lang) {
    let plugin = env.get('intern.plugins');

    if (plugin.highlight) {
      return '';
    }

    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {

      }
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (__) {

    }

    return ''; // use external default escaping
  }

  return renderHtml(env, filepath);
}
