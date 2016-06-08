/*
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(exports) {
'use strict';

// // Add permalinks to heading elements.
// function addPermalinkHeadings(opt_inDoc) {
//   var doc = opt_inDoc || document;

//   var permalinkEl = doc.querySelector('.show-permalinks');
//   if (permalinkEl) {
//     ['h2','h3','h4'].forEach(function(h, i) {
//       Array.prototype.forEach.call(
//           permalinkEl.querySelectorAll(h), addPermalink);
//     });
//   }
// }

// function prettyPrintPage(opt_inDoc) {
//   var doc = opt_inDoc || document;
//   Array.prototype.forEach.call(doc.querySelectorAll('pre'), function(pre, i) {
//     pre.classList.add('prettyprint');
//   });

//   exports.prettyPrint && prettyPrint();
// }

function downloadStarter() {
  ga('send', 'event', 'button', 'download');
}

function recordSearch(term) {
  ga('send', 'event', 'search', term);
}

function recordPageview(opt_url) {
  var url = opt_url || location.pathname + location.hash;
  ga('send', 'pageview', url);
  ga('devrelTracker.send', 'pageview', url);
}

exports.recordPageview = recordPageview;
exports.recordSearch = recordSearch;
exports.downloadStarter = downloadStarter;

// Analytics -----
/* jshint ignore:start */
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
/* jshint ignore:end */

ga('create', 'UA-39334307-1', 'auto', {'siteSpeedSampleRate': 50});
ga('create', 'UA-49880327-9', 'auto', {'name': 'devrelTracker'});
recordPageview();

if (console) {
  console.log("%cWelcome to Polymer!\n%cweb components are the <bees-knees>",
              "font-size:1.5em;color:#4558c9;", "color:#d61a7f;font-size:1em;");
}

// Show a toast with a service-worker-related update.
window.showToast = function(message) {
  var toast = document.getElementById('sw-toast');

  if (!toast) {
    toast = document.createElement('paper-toast');
    toast.id = 'sw-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.show();
};

// Register service worker if supported.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js'
  ).then(function(registration) {
    registration.onupdatefound = function() {
      // The updatefound event implies that registration.installing is set; see
      // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
      const installingWorker = registration.installing;
      installingWorker.onstatechange = function() {
        switch (installingWorker.state) {
          case 'installed':
            if (!navigator.serviceWorker.controller) {
              window.showToast('Caching complete! Future visits will work offline.');
            }
            break;

          case 'redundant':
            throw Error('The installing service worker became redundant.');
        }
      };
    };
  }).catch(function(e) {
    console.error('Service worker registration failed:', e);
  });
}

// Check to see if the service worker controlling the page at initial load
// has become redundant, since this implies there's a new service worker with fresh content.
if (navigator.serviceWorker && navigator.serviceWorker.controller) {
  navigator.serviceWorker.controller.onstatechange = function(event) {
    if (event.target.state === 'redundant') {
      window.showToast('A new version of this app is available. Refresh the page.');
    }
  };
}

})(window);
