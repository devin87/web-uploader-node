//devin87@qq.com
//build:2021/03/11 11:23:13
!function(t,i){"use strict";var e,s,o,r=Object.prototype.toString,a=Object.prototype.hasOwnProperty,n=Array.prototype.slice;function u(e,t){return e!==i?e:t}function l(e){return"[object Function]"===r.call(e)}function c(e){return"number"==typeof e&&0<e&&e===Math.floor(e)}function d(e,t,r){if(!e||!t)return e;for(var n in t)n!=i&&a.call(t,n)&&(!r&&e[n]!==i||(e[n]=t[n]));return e}function f(e,t,r,n){for(var i=e[r||t],a=[];i;){if(1==i.nodeType){if(!n)return i;a.push(i)}i=i[t]}return n?a:null}function p(e){return e.firstElementChild||f(e,"nextSibling","firstChild",!1)}function h(e,t,r){e=document.createElement(e);return t&&(e.className=t),r&&(e.innerHTML=r),e}function m(e){e=e||t.event;return e.target||(e.target=e.srcElement),e}d(Object,{forEach:function(e,t,r){for(var n in e)a.call(e,n)&&t.call(r,n,e[n],e)}}),d(Array.prototype,{forEach:function(e,t){for(var r=this,n=0,i=r.length;n<i;n++)n in r&&e.call(t,r[n],n,r)}}),d(Date,{now:function(){return+new Date}}),(t.ActiveXObject||t.msIndexedDB)&&(e=document.documentMode||(t.XMLHttpRequest?7:6)),t.JSON||(t.JSON={}),JSON.parse||(JSON.parse=function(e,t){if(!1!==t&&!/^[\],:{}\s]*$/.test(e.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))throw new Error("JSON SyntaxError");try{return new Function("return "+e)()}catch(e){}}),document.addEventListener?(s=function(e,t,r){e.addEventListener(t,r,!1)},o=function(e,t,r){e.removeEventListener(t,r,!1)}):document.attachEvent&&(s=function(e,t,r){e.attachEvent("on"+t,r)},o=function(e,t,r){e.detachEvent("on"+t,r)});var v=/^https?:\/\//i;function g(e){return v.test(e)}function y(e,t,r){e=+e;for(var n=0,i="number"==typeof(t=t||1024),a=1,s=c(r)?r:i?100:t.length;a<=e&&n<s;)a*=i?t:t[n],n++;return n&&e<a&&(a/=i?t:t.last(),n--),{value:n?e/a:e,level:n}}var w=["B","KB","MB","GB","TB","PB","EB"],b={def:u,isFunc:l,isUInt:c,fire:function(e,t){if(l(e))return e.apply(t,n.call(arguments,2))},extend:d,ie:e,setOpacity:function(e,t){t<=1&&(t*=100),e.style.opacity!=i?e.style.opacity=t/100:e.style.filter!=i&&(e.style.filter="alpha(opacity="+parseInt(t)+")")},getOffset:function(e,t){for(var r=0,n=0,i=e.offsetWidth,a=e.offsetHeight;r+=e.offsetLeft,n+=e.offsetTop,e=e.offsetParent,e&&e!=t;);return{left:r,top:n,width:i,height:a}},walk:f,getPrev:function(e){return e.previousElementSibling||f(e,"previousSibling",null,!1)},getNext:function(e){return e.nextElementSibling||f(e,"nextSibling",null,!1)},getFirst:p,getLast:function(e){return e.lastElementChild||f(e,"previousSibling","lastChild",!1)},getChilds:function(e){return e.children||f(e,"nextSibling","firstChild",!0)},createEle:h,parseHTML:function(e,t){return e=h("div","",e),t?e.childNodes:p(e)},isHttpURL:g,isSameHost:function(e){if(!g(e))return!0;var t=RegExp.lastMatch.length,t=e.indexOf("/",t);return e.slice(0,-1!=t?t:i).toLowerCase()==(location.protocol+"//"+location.host).toLowerCase()},parseLevel:y,formatSize:function(e,t){if(t=!0===t?{all:!0}:t||{},isNaN(e)||e==i||e<0){var r=t.error||"--";return t.all?{text:r}:r}return r=y(e,t.steps,t.limit),e=r.value.toFixed(u(t.digit,2)),!1!==t.trim&&-1!=e.lastIndexOf(".")&&(e=e.replace(/\.?0+$/,"")),r.text=e+(t.join||"")+(t.units||w)[r.level+(t.start||0)],t.all?r:r.text}};e&&(b["ie"+(e<6?6:e)]=!0),b.event={fix:m,stop:function(e,t,r){e=m(e),!1!==t&&(e.preventDefault?e.preventDefault():e.returnValue=!1),!1!==r&&(e.stopPropagation?e.stopPropagation():e.cancelBubble=!0)},trigger:function(e,t){var r;l(e[t])?e[t]():e.fireEvent?e.fireEvent("on"+t):e.dispatchEvent&&((r=document.createEvent("HTMLEvents")).initEvent(t,!0,!0),e.dispatchEvent(r))},add:function(t,r,n,i){var a=function(e){n.call(t,m(e)),i&&o(t,r,a)};if(s(t,r,a),!i)return{stop:function(){o(t,r,a)}}}},t.Q=b}(window),function(e,o){"use strict";var n=Q.def,u=Q.fire,i=Q.extend,l=Q.getFirst,a=Q.getLast,c=JSON.parse,s=Q.createEle,d=Q.parseHTML,f=Q.setOpacity,p=Q.getOffset||Q.offset,h=Q.md5File,t=Q.event,m=t.add,v=t.trigger,g=t.stop,y=!1,w=!1,b=!1,r=0,x=0,_=0,E={};function S(e,t){t=e.lastIndexOf(t);return-1!=t?e.slice(t):""}function T(e){if(e){for(var t=e.split(","),r={},n=0,i=t.length;n<i;n++)r[t[n]]=!0;return r}}function k(e){var t=this,e=e||{};t.guid=e.guid||"uploader"+ ++r,t.list=[],t.map={},t.index=0,t.started=!1,t.set(e)._init()}k.prototype={constructor:k,set:function(e){var t=this,r=i(e,t.ops);t.url=r.url,t.dataType=r.dataType||"json",t.data=r.data,t.targets=r.target||[],t.targets.forEach||(t.targets=[t.targets]),t.target=t.targets[0],t.html5=y&&!!n(r.html5,!0),t.multiple=w&&t.html5&&!!n(r.multiple,!0),t.clickTrigger=b&&!!n(r.clickTrigger,!0),t.workerThread=t.html5&&r.workerThread||1,t.workerIdle=t.workerThread,t.auto=!1!==r.auto,t.upName=r.upName||"upfile",t.accept=r.accept||(0==(navigator.platform||"").indexOf("Win")?r.allows:"*/*"),t.isDir=r.isDir,t.allows=T(r.allows),t.disallows=T(r.disallows),t.maxSize=+r.maxSize||0,t.isSlice=!!r.isSlice,t.chunkSize=+r.chunkSize||2097152,t.isQueryState=!!n(r.isQueryState,t.isSlice),t.isMd5=!!n(r.isMd5,t.isSlice),t.isUploadAfterHash=!1!==r.isUploadAfterHash,t.sliceRetryCount=r.sliceRetryCount==o?2:+r.sliceRetryCount||0,t.urlForQuery=r.urlForQuery||t.url,t.container=r.container||document.body,r.getPos&&(t.getPos=r.getPos);e=r.UI||{};return e.init&&(t.init=e.init),e.draw&&(t.draw=e.draw),e.update&&(t.update=e.update),e.over&&(t.over=e.over),t.fns=r.on||{},t.ops=r,t.accept&&!t.clickTrigger&&t.resetInput(),t},_init:function(){var t=this;if(!t._inited){t._inited=!0;var r,e=t.guid,n=t.container,i=s("div","upload-input "+e);return n.appendChild(i),t.boxInput=i,t.html5||(e=s("div","upload-html4 "+e,'<iframe class="u-iframe" name="'+(e="upload_iframe_"+e)+'"></iframe><form class="u-form" action="" method="post" enctype="multipart/form-data" target="'+e+'"></form>'),n.appendChild(e),r=l(e),n=a(e),t.iframe=r,t.form=n,e=function(){if(0==t.workerIdle){var e;try{e=r.contentWindow.document.body.innerHTML}catch(e){}t.complete(o,2,e)}},(n=r).attachEvent?n.attachEvent("onload",e):n.addEventListener("load",e,!1)),t.targets.forEach(function(e){t.clickTrigger?m(e,"click",function(e){!1!==t.fire("select",e)&&(t.resetInput(),v(t.inputFile,"click"))}):m(e,"mouseover",function(e){t.target=this,t.updatePos()})}),t.clickTrigger||(m(i,"click",function(e){!1===t.fire("select",e)&&g(e)}),f(i,0),t.resetInput()),t.run("init",o,"init")}},resetInput:function(){var t=this,e=t.boxInput;if(!e)return t;e.innerHTML='<input type="file" name="'+t.upName+'"'+(t.accept?'accept="'+t.accept+'"':"")+(t.isDir?'webkitdirectory=""':"")+' style="'+(t.clickTrigger?"visibility: hidden;":"font-size:100px;")+'"'+(t.multiple?' multiple="multiple"':"")+">";e=l(e);return m(e,"change",function(e){t.add(this),t.html5||t.resetInput()}),t.inputFile=e,t.updatePos()},updatePos:function(e){var t=this;if(t.clickTrigger)return t;var r=t.getPos||p,n=t.boxInput,i=l(n),a=t.target,s=a.offsetWidth,o=a.offsetHeight,a=0==s?{left:-1e4,top:-1e4}:r(a);return n.style.width=i.style.width=s+"px",n.style.height=i.style.height=o+"px",n.style.left=a.left+"px",n.style.top=a.top+"px",e&&(n.style.zIndex=++_),t},fire:function(e,t,r){if(!r)return u(this.fns[e],this,t);var n=this.fns[e+"Async"];if(n)return u(n,this,t,r);r(u(this.fns[e],this,t))},run:function(e,t,r){e=this[e];return e&&u(e,this,t),r&&u(this.fns[r],this,t),this},addTask:function(e,t){if(e||t){var r,n,i=t?(r=t.webkitRelativePath||t.name||t.fileName,0===t.size?0:t.size||t.fileSize):(r=S(e.value,"\\").slice(1)||e.value,-1),a=this,s=S(r,".").toLowerCase();a.disallows&&a.disallows[s]||a.allows&&!a.allows[s]?n="ext":-1!=i&&a.maxSize&&i>a.maxSize&&(n="size");var o={id:++x,name:r,ext:s,size:i,input:e,file:t,state:n?-1:0};return n&&(o.limited=n,o.disabled=!0),a.fire("add",o,function(e){!1===e||o.disabled||o.limited||(o.index=a.list.length,a.list.push(o),a.map[o.id]=o,a.run("draw",o,"draw"),a.auto&&a.start())}),o}},add:function(e){if("INPUT"==e.tagName){var t=e.files;if(t)for(var r=0,n=t.length;r<n;r++)this.addTask(e,t[r]);else this.addTask(e)}else this.addTask(o,e)},addList:function(e){for(var t=0,r=e.length;t<r;t++)this.add(e[t])},get:function(e){if(e!=o)return this.map[e]},cancel:function(e,t){var r=this,n=r.get(e);if(n){e=n.state;if(0!=e&&1!=e)return r;if(1==e){e=n.xhr;if(e)return e.abort(),r;r.iframe.contentWindow.location="about:blank"}return t?r:r.complete(n,-2)}},remove:function(e){var t=this.get(e);t&&(1==t.state&&this.cancel(e),t.deleted=!0,this.fire("remove",t))},start:function(){var e=this,t=e.workerIdle,r=e.list,n=e.index,i=r.length;if(e.started||(e.started=!0),i<=0||i<=n||t<=0)return e;n=r[n];return e.index++,e.upload(n)},upload:function(t){var r=this;return!t||0!=t.state||t.skip||t.deleted?r.start():(t.url=r.url,r.workerIdle--,r.fire("upload",t,function(e){return!1===e?r.complete(t,-1):void(r.html5&&t.file?r._upload_html5_ready(t):t.input?r._upload_html4(t):r.complete(t,-1))}),r)},_process_xhr_headers:function(r){function e(e,t){r.setRequestHeader(e,t)}var t=this.ops;E.headers&&Object.forEach(E.headers,e),t.headers&&Object.forEach(t.headers,e)},queryState:function(n,i){var a=this,e=a.urlForQuery,s=new XMLHttpRequest,r=["action=query","hash="+(n.hash||encodeURIComponent(n.name)),"fileName="+encodeURIComponent(n.name)];return-1!=n.size&&r.push("fileSize="+n.size),a._process_params(n,function(e,t){r.push(encodeURIComponent(e)+"="+(t!=o?encodeURIComponent(t):""))},"dataQuery"),n.queryUrl=e+(-1==e.indexOf("?")?"?":"&")+r.join("&"),a.fire("beforeQuery",n),a.fire("sliceQuery",n),s.open("GET",n.queryUrl),a._process_xhr_headers(s),s.onreadystatechange=function(){if(4==s.readyState){if(s.status<200||400<=s.status)return u(i,a,s);var r,e=s.responseText;"ok"===e?r={data:{ok:!0}}:e&&(r=c(e)),r&&"number"!=typeof r||(r={data:{start:r}}),n.response=e,n.json=r,a.fire("query",n,function(e){var t;-1==(e=e==o?(t=r?r.data:o)?t.ok||t.url?-1:t.start:1==r.ret?-1:r.start:e)?(n.queryOK=!0,a.cancel(n.id,!0).complete(n,2)):((e=+e||0)!=Math.floor(e)&&(e=0),n.sliceStart=e),u(i,a,s)})}},s.onerror=function(){u(i,a,s)},s.send(null),a},_upload_html5_ready:function(n){function e(){2!=n.state&&(a.isSlice?a._upload_slice(n):a._upload_html5(n))}function i(e){n.hash&&a.isQueryState&&2!=n.state?a.queryState(n,e):e()}function t(r){a.fire("hash",n,function(){if(n.hash||!a.isMd5||!h)return i(r);var t=a.fns.hashProgress;h(n.file,function(e,t){n.hash=e,n.timeHash=t,i(r)},function(e){u(t,a,n,e)})})}var a=this;return a.isUploadAfterHash?t(e):(e(),t()),a},_process_params:function(e,t,r){r=r||"data",E.data&&Object.forEach(E.data,t),this.data&&Object.forEach(this.data,t),e&&e[r]&&Object.forEach(e[r],t)},_upload_html5:function(t){var r=this,n=new XMLHttpRequest;(t.xhr=n).upload.addEventListener("progress",function(e){r.progress(t,e.total,e.loaded)},!1),n.addEventListener("load",function(e){r.complete(t,2,e.target.responseText)},!1),n.addEventListener("error",function(){r.complete(t,-3)},!1),n.addEventListener("abort",function(){r.complete(t,-2)},!1);var i=new FormData;r._process_params(t,function(e,t){i.append(e,t)}),i.append("fileName",t.name),i.append(r.upName,t.blob||t.file,t.name),n.open("POST",t.url),r._process_xhr_headers(n),r.fire("send",t,function(e){return!1===e?r.complete(t,-1):(n.send(i),void r._afterSend(t))})},_upload_html4:function(t){var r=this,n=r.form,e=t.input;if(e._uploaded)return r.complete(t,2);e._uploaded=!0,e.name=r.upName,n.innerHTML="",n.appendChild(e),n.action=t.url,r._process_params(t,function(e,t){n.appendChild(d('<input type="hidden" name="'+e+'" value="'+t+'">'))}),r.fire("send",t,function(e){return!1===e?r.complete(t,-1):(n.submit(),void r._afterSend(t))})},_afterSend:function(e){e.lastTime=e.startTime=Date.now(),e.state=1,this._lastTask=e,this.progress(e)},progress:function(e,t,r){t=t||e.size,(!r||r<0)&&(r=0);var n=e.state||0;0<(r=t<r?t:r)&&0==n&&(e.state=n=1),function(e,t,r){if(t&&!(t<=0)){var n,i=Date.now();if(t<=r)return(n=i-e.startTime)?e.avgSpeed=Math.min(Math.round(1e3*t/n),t):e.speed||(e.avgSpeed=e.speed=t),e.time=n||0,e.endTime=i;(n=i-e.lastTime)<200||(e.speed=Math.min(Math.round(1e3*(r-e.loaded)/n),e.total),e.lastTime=i)}}(e,t=2==n?r=e.size:t,r),e.total=t,e.loaded=r,this.run("update",e,"progress")},_process_response:function(e,t){(e.response=t)&&"json"==this.dataType&&(e.json=c(t))},complete:function(e,t,r){var n=this;return(e=!e&&1==n.workerThread?n._lastTask:e)&&(t!=o&&(e.state=t),1!=e.state&&2!=t||(e.state=2,n.progress(e,e.size,e.size)),r!==o&&n._process_response(e,r)),n.run("update",e,"update").run("over",e,"over"),-2==t&&n.fire("cancel",e),n.fire("complete",e),n.workerIdle++,n.started&&n.start(),n}},k.extend=function(e,t){i(k.prototype,e,t)},(t=e.XMLHttpRequest)&&(new t).upload&&e.FormData&&(y=!0),(t=document.createElement("input")).type="file",w=!!t.files,i(k,{support:{html5:b=y,multiple:w},READY:0,PROCESSING:1,COMPLETE:2,SKIP:-1,CANCEL:-2,ERROR:-3,UI:{},Lang:{status_ready:"准备中",status_processing:"上传中",status_complete:"已完成",status_skip:"已跳过",status_cancel:"已取消",status_error:"已失败"},setup:function(e){i(E,e,!0)},getStatusText:function(e){var t=k.Lang;switch(e){case 0:return t.status_ready;case 1:return t.status_processing;case 2:return t.status_complete;case-1:return t.status_skip;case-2:return t.status_cancel;case-3:return t.status_error}return e}}),Q.Uploader=k}(window),function(a){"use strict";var p=Q.getFirst,h=Q.getNext,m=Q.createEle,v=Q.setOpacity,s=Q.ie,o=Q.Uploader;function r(e,t){e.className+=" "+t}function u(t,e,r){var n=e.input,e=e.file||(n.files?n.files[0]:void 0);if(e)!function(e,t){var r=a.URL||a.webkitURL;if(r)return t(r.createObjectURL(e));a.FileReader?((r=new FileReader).onload=function(e){t(e.target.result)},r.readAsDataURL(e)):e.readAsDataURL&&t(e.readAsDataURL())}(e,function(e){e&&(t.innerHTML='<img src="'+e+'" />'),r&&r(e)});else if(n){var i=n.value;if(i&&!/^\w:\\fakepath/.test(i)||(n.select(),parent.document.body.focus(),document.selection&&(i=document.selection.createRange().text)),i){t.innerHTML='<img src="'+i+'" />';try{6<s&&(t.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src='"+i+"')")}catch(e){}}r&&r(i)}}var l=a.Blob||a.WebkitBlob||a.MozBlob,c=a.WebKitBlobBuilder||a.MozBlobBuilder,n=function(){if(!a.FileReader||!a.atob||!l&&!c)return!1;var e=document.createElement("canvas");return!!e.getContext&&!!e.getContext("2d")}();function d(e,s,o,u){var l=new Image;l.src=e,l.onload=function(){var e=l.width,t=l.height,r=o.maxWidth,n=o.maxHeight,i=r&&r<e,a=n&&n<t;if(!(i||a))return u&&u(!1);i&&(e=r,t=Math.floor(l.height*e/l.width)),a&&(t=n,e=Math.floor(l.width*t/l.height));a=document.createElement("canvas"),n=a.getContext("2d");a.width=e,a.height=t,n.drawImage(l,0,0,e,t),u&&u(a.toDataURL(s),s)}}var i=".jpg,.png,.gif,.bmp,.webp,.tif,.tiff";o.support.imageScale=n,o.previewImage=u,o.scaleImage=d,o.UI.Image={init:function(){var e=this.ops,t=e.view;e.allows||(e.allows=i),t&&r(t,"ui-image "+(this.html5?"html5":"html4"))},supportScale:function(e){if(!n)return!1;".jpeg"==e&&(e=".jpg");var t=(this.ops.scale||{}).types||".jpg";return-1!=i.indexOf(e)&&("*"==t||-1!=t.indexOf(e))},previewImage:function(e,n,t){var i=this,r=n.scale||t.scale,a=r&&i.supportScale(n.ext);return a&&(n.skip=!0),u(e,n,function(e){i.fire("preview",{task:n,src:e}),e&&a&&d(e,"image/"+("jpg"==(e=(e=n.ext).slice(1))?"jpeg":e),r,function(e,t){var r;e&&(r=function(e,t){for(var e=e.split(","),r=atob(e[1]),n=[],i=0,a=r.length;i<a;i++)n[i]=r.charCodeAt(i);return l?new l([new Uint8Array(n)],{type:t}):((e=new c).append(n),e.getBlob(t))}(e,t),n.blob=r,i.fire("scale",{task:n,base64:e,type:t,blob:r})),n.skip=!1,i.list.push(n),i.auto&&i.start()})}),i},draw:function(e){var t,r,n,i,a,s,o,u,l,c=this,d=c.ops,f=d.view;f&&(l='<div class="u-img"></div><div class="u-progress-bar"><div class="u-progress"></div></div><div class="u-detail"></div><div class="u-name" title="'+(u=e.name)+'">'+u+'</div><div class="u-close-bg"></div><div class="u-close-text">X</div>',t=e.id,(r=m("div","u-item",l)).taskId=t,n=p(r),i=h(n),a=p(i),s=h(i),o=h(s),u=h(o),l=h(u),v(i,.3),v(a,.5),v(u,.3),l.onclick=function(){f.removeChild(r),c.remove(t)},e.box=r,e.boxProgress=a,e.boxDetail=s,e.boxName=o,f.appendChild(r),c.previewImage(n,e,d).update(e))},update:function(e){var t,r,n,i,a,s;e&&e.box&&(t=e.total||e.size,r=e.loaded,n=e.state,i=e.boxProgress,s=e.boxDetail,e=o.getStatusText(n),this.html5&&null!=r&&0<=r&&(n==o.PROCESSING?"100.0"==(a=Math.min(100*r/t,100).toFixed(1))&&(a="99.9"):n==o.COMPLETE&&(a="100"),a&&(e+=" "+(a+="%"),i.style.width=a)),e=e,(s=s)&&(s.innerHTML=e||""))},over:function(e){e&&e.box&&r(e.box,"u-over")}},o.extend(o.UI.Image)}(window);