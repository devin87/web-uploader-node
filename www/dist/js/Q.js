//devin87@qq.com
//build:2015/08/27 16:01:05
!function(t,e){"use strict";function n(t,n){return t!==e?t:n}function r(t){return"[object Function]"===N.call(t)}function i(t){return"number"==typeof t&&t>0&&t===Math.floor(t)}function o(t,e){return r(t)?t.apply(e,C.call(arguments,2)):void 0}function a(t,n,r){if(t&&n){for(var i in n)i!=e&&B.call(n,i)&&(r||t[i]===e)&&(t[i]=n[i]);return t}}function l(t,e){if(e!==!1&&!/^[\],:{}\s]*$/.test(t.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))throw new Error("JSON SyntaxError");try{return new Function("return "+t)()}catch(n){}}function u(t,n){1>=n&&(n*=100),t.style.opacity!=e?t.style.opacity=n/100:t.style.filter!=e&&(t.style.filter="alpha(opacity="+parseInt(n)+")")}function c(t,e){var n=0,r=0,i=t.offsetWidth,o=t.offsetHeight;do n+=t.offsetLeft,r+=t.offsetTop,t=t.offsetParent;while(t&&t!=e);return{left:n,top:r,width:i,height:o}}function f(t,e,n,r){for(var i=t[n||e],o=[];i;){if(1==i.nodeType){if(!r)return i;o.push(i)}i=i[e]}return r?o:null}function s(t){return t.previousElementSibling||f(t,"previousSibling",null,!1)}function p(t){return t.nextElementSibling||f(t,"nextSibling",null,!1)}function v(t){return t.firstElementChild||f(t,"nextSibling","firstChild",!1)}function d(t){return t.lastElementChild||f(t,"previousSibling","lastChild",!1)}function h(t){return t.children||f(t,"nextSibling","firstChild",!0)}function g(t,e,n){var r=document.createElement(t);return e&&(r.className=e),n&&(r.innerHTML=n),r}function E(t,e){var n=g("div","",t);return e?n.childNodes:v(n)}function m(e){var n=e||t.event;return n.target||(n.target=n.srcElement),n}function y(t,e,n,r){var i=function(o){n.call(t,m(o)),r&&H(t,e,i)};return F(t,e,i),r?void 0:{stop:function(){H(t,e,i)}}}function b(t,e){if(r(t[e]))t[e]();else if(t.fireEvent)t.fireEvent("on"+e);else if(t.dispatchEvent){var n=document.createEvent("HTMLEvents");n.initEvent(e,!0,!0),t.dispatchEvent(n)}}function S(t,e,n){var r=m(t);e!==!1&&(r.preventDefault?r.preventDefault():r.returnValue=!1),n!==!1&&(r.stopPropagation?r.stopPropagation():r.cancelBubble=!0)}function x(t){return M.test(t)}function w(t){if(!x(t))return!0;var n=RegExp.lastMatch.length,r=t.indexOf("/",n),i=t.slice(0,-1!=r?r:e);return i.toLowerCase()==(location.protocol+"//"+location.host).toLowerCase()}function O(t,e,n){t=+t,e=e||1024;for(var r=0,o="number"==typeof e,a=1,l=i(n)?n:o?100:e.length;t>=a&&l>r;)a*=o?e:e[r],r++;return r&&a>t&&(a/=o?e:e.last(),r--),{value:r?t/a:t,level:r}}function L(t,r){if(r=r===!0?{all:!0}:r||{},isNaN(t)||t==e||0>t){var i=r.error||"--";return r.all?{text:i}:i}var o=O(t,r.steps,r.limit),a=o.value,l=a.toFixed(n(r.digit,2));return r.trim!==!1&&-1!=l.lastIndexOf(".")&&(l=l.replace(/\.?0+$/,"")),o.text=l+(r.join||"")+(r.units||P)[o.level+(r.start||0)],r.all?o:o.text}var N=Object.prototype.toString,B=Object.prototype.hasOwnProperty,C=Array.prototype.slice;a(Object,{forEach:function(t,e,n){for(var r in t)B.call(t,r)&&e.call(n,r,t[r],t)}}),a(Date,{now:function(){return+new Date}}),t.JSON||(t.JSON={}),JSON.parse||(JSON.parse=l);var F,H;document.addEventListener?(F=function(t,e,n){t.addEventListener(e,n,!1)},H=function(t,e,n){t.removeEventListener(e,n,!1)}):document.attachEvent&&(F=function(t,e,n){t.attachEvent("on"+e,n)},H=function(t,e,n){t.detachEvent("on"+e,n)});var M=/^https?:\/\//i,P=["B","KB","MB","GB","TB","PB","EB"],T={def:n,isFunc:r,isUInt:i,fire:o,extend:a,setOpacity:u,getOffset:c,walk:f,getPrev:s,getNext:p,getFirst:v,getLast:d,getChilds:h,createEle:g,parseHTML:E,isHttpURL:x,isSameHost:w,parseLevel:O,formatSize:L};T.Event={fix:m,stop:S,trigger:b,add:y},t.Q=T}(window);