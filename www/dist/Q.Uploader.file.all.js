//devin87@qq.com
//build:2021/03/16 10:09:24
!function(t,r){"use strict";var e,s,o,n=Object.prototype.toString,a=Object.prototype.hasOwnProperty,i=Array.prototype.slice;function l(e,t){return e!==r?e:t}function u(e){return"[object Function]"===n.call(e)}function c(e){return"number"==typeof e&&0<e&&e===Math.floor(e)}function d(e,t,n){if(!e||!t)return e;for(var i in t)i!=r&&a.call(t,i)&&(!n&&e[i]!==r||(e[i]=t[i]));return e}function p(e,t,n,i){for(var r=e[n||t],a=[];r;){if(1==r.nodeType){if(!i)return r;a.push(r)}r=r[t]}return i?a:null}function f(e){return e.firstElementChild||p(e,"nextSibling","firstChild",!1)}function h(e,t,n){e=document.createElement(e);return t&&(e.className=t),n&&(e.innerHTML=n),e}function m(e){e=e||t.event;return e.target||(e.target=e.srcElement),e}d(Object,{forEach:function(e,t,n){for(var i in e)a.call(e,i)&&t.call(n,i,e[i],e)}}),d(Array.prototype,{forEach:function(e,t){for(var n=this,i=0,r=n.length;i<r;i++)i in n&&e.call(t,n[i],i,n)}}),d(Date,{now:function(){return+new Date}}),(t.ActiveXObject||t.msIndexedDB)&&(e=document.documentMode||(t.XMLHttpRequest?7:6)),t.JSON||(t.JSON={}),JSON.parse||(JSON.parse=function(e,t){if(!1!==t&&!/^[\],:{}\s]*$/.test(e.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))throw new Error("JSON SyntaxError");try{return new Function("return "+e)()}catch(e){}}),document.addEventListener?(s=function(e,t,n){e.addEventListener(t,n,!1)},o=function(e,t,n){e.removeEventListener(t,n,!1)}):document.attachEvent&&(s=function(e,t,n){e.attachEvent("on"+t,n)},o=function(e,t,n){e.detachEvent("on"+t,n)});var v=/^https?:\/\//i;function g(e){return v.test(e)}function y(e,t,n){e=+e;for(var i=0,r="number"==typeof(t=t||1024),a=1,s=c(n)?n:r?100:t.length;a<=e&&i<s;)a*=r?t:t[i],i++;return i&&e<a&&(a/=r?t:t.last(),i--),{value:i?e/a:e,level:i}}var _=["B","KB","MB","GB","TB","PB","EB"],x={def:l,isFunc:u,isUInt:c,fire:function(e,t){if(u(e))return e.apply(t,i.call(arguments,2))},extend:d,ie:e,setOpacity:function(e,t){t<=1&&(t*=100),e.style.opacity!=r?e.style.opacity=t/100:e.style.filter!=r&&(e.style.filter="alpha(opacity="+parseInt(t)+")")},getOffset:function(e,t){for(var n=0,i=0,r=e.offsetWidth,a=e.offsetHeight;n+=e.offsetLeft,i+=e.offsetTop,e=e.offsetParent,e&&e!=t;);return{left:n,top:i,width:r,height:a}},walk:p,getPrev:function(e){return e.previousElementSibling||p(e,"previousSibling",null,!1)},getNext:function(e){return e.nextElementSibling||p(e,"nextSibling",null,!1)},getFirst:f,getLast:function(e){return e.lastElementChild||p(e,"previousSibling","lastChild",!1)},getChilds:function(e){return e.children||p(e,"nextSibling","firstChild",!0)},createEle:h,parseHTML:function(e,t){return e=h("div","",e),t?e.childNodes:f(e)},isHttpURL:g,isSameHost:function(e){if(!g(e))return!0;var t=RegExp.lastMatch.length,t=e.indexOf("/",t);return e.slice(0,-1!=t?t:r).toLowerCase()==(location.protocol+"//"+location.host).toLowerCase()},parseLevel:y,formatSize:function(e,t){if(t=!0===t?{all:!0}:t||{},isNaN(e)||e==r||e<0){var n=t.error||"--";return t.all?{text:n}:n}return n=y(e,t.steps,t.limit),e=n.value.toFixed(l(t.digit,2)),!1!==t.trim&&-1!=e.lastIndexOf(".")&&(e=e.replace(/\.?0+$/,"")),n.text=e+(t.join||"")+(t.units||_)[n.level+(t.start||0)],t.all?n:n.text}};e&&(x["ie"+(e<6?6:e)]=!0),x.event={fix:m,stop:function(e,t,n){e=m(e),!1!==t&&(e.preventDefault?e.preventDefault():e.returnValue=!1),!1!==n&&(e.stopPropagation?e.stopPropagation():e.cancelBubble=!0)},trigger:function(e,t){var n;u(e[t])?e[t]():e.fireEvent?e.fireEvent("on"+t):e.dispatchEvent&&((n=document.createEvent("HTMLEvents")).initEvent(t,!0,!0),e.dispatchEvent(n))},add:function(t,n,i,r){var a=function(e){i.call(t,m(e)),r&&o(t,n,a)};if(s(t,n,a),!r)return{stop:function(){o(t,n,a)}}}},t.Q=x}(window),function(e,o){"use strict";var i=Q.def,l=Q.fire,r=Q.extend,u=Q.getFirst,a=Q.getLast,c=JSON.parse,s=Q.createEle,d=Q.parseHTML,p=Q.setOpacity,f=Q.getOffset||Q.offset,h=Q.md5File,t=Q.event,m=t.add,v=t.trigger,g=t.stop,y=!1,_=!1,x=!1,n=0,w=0,E=0,S={};function b(e,t){t=e.lastIndexOf(t);return-1!=t?e.slice(t):""}function T(e){if(e){for(var t=e.split(","),n={},i=0,r=t.length;i<r;i++)n[t[i]]=!0;return n}}function k(e){var t=this,e=e||{};t.guid=e.guid||"uploader"+ ++n,t.list=[],t.map={},t.index=0,t.started=!1,t.set(e)._init()}k.prototype={constructor:k,set:function(e){var t=this,n=r(e,t.ops);t.url=n.url,t.dataType=n.dataType||"json",t.data=n.data,t.targets=n.target||[],t.targets.forEach||(t.targets=[t.targets]),t.target=t.targets[0],t.html5=y&&!!i(n.html5,!0),t.multiple=_&&t.html5&&!!i(n.multiple,!0),t.clickTrigger=x&&!!i(n.clickTrigger,!0),t.workerThread=t.html5&&n.workerThread||1,t.workerIdle=t.workerThread,t.auto=!1!==n.auto,t.upName=n.upName||"upfile",t.accept=n.accept||(0==(navigator.platform||"").indexOf("Win")?n.allows:"*/*"),t.isDir=n.isDir,t.allows=T(n.allows),t.disallows=T(n.disallows),t.maxSize=+n.maxSize||0,t.isSlice=!!n.isSlice,t.chunkSize=+n.chunkSize||2097152,t.isQueryState=!!i(n.isQueryState,t.isSlice),t.isMd5=!!i(n.isMd5,t.isSlice),t.isUploadAfterHash=!1!==n.isUploadAfterHash,t.sliceRetryCount=n.sliceRetryCount==o?2:+n.sliceRetryCount||0,t.urlForQuery=n.urlForQuery||t.url,t.container=n.container||document.body,n.getPos&&(t.getPos=n.getPos);e=n.UI||{};return e.init&&(t.init=e.init),e.draw&&(t.draw=e.draw),e.update&&(t.update=e.update),e.over&&(t.over=e.over),t.fns=n.on||{},t.ops=n,t.accept&&!t.clickTrigger&&t.resetInput(),t},_init:function(){var t=this;if(!t._inited){t._inited=!0;var n,e=t.guid,i=t.container,r=s("div","upload-input "+e);return i.appendChild(r),t.boxInput=r,t.html5||(e=s("div","upload-html4 "+e,'<iframe class="u-iframe" name="'+(e="upload_iframe_"+e)+'"></iframe><form class="u-form" action="" method="post" enctype="multipart/form-data" target="'+e+'"></form>'),i.appendChild(e),n=u(e),i=a(e),t.iframe=n,t.form=i,e=function(){if(0==t.workerIdle){var e;try{e=n.contentWindow.document.body.innerHTML}catch(e){}t.complete(o,2,e)}},(i=n).attachEvent?i.attachEvent("onload",e):i.addEventListener("load",e,!1)),t.targets.forEach(function(e){t.clickTrigger?m(e,"click",function(e){!1!==t.fire("select",e)&&(t.resetInput(),v(t.inputFile,"click"))}):m(e,"mouseover",function(e){t.target=this,t.updatePos()})}),t.clickTrigger||(m(r,"click",function(e){!1===t.fire("select",e)&&g(e)}),p(r,0),t.resetInput()),t.run("init",o,"init")}},resetInput:function(){var t=this,e=t.boxInput;if(!e)return t;e.innerHTML='<input type="file" name="'+t.upName+'"'+(t.accept?'accept="'+t.accept+'"':"")+(t.isDir?'webkitdirectory=""':"")+' style="'+(t.clickTrigger?"visibility: hidden;":"font-size:100px;")+'"'+(t.multiple?' multiple="multiple"':"")+">";e=u(e);return m(e,"change",function(e){t.add(this),t.html5||t.resetInput()}),t.inputFile=e,t.updatePos()},updatePos:function(e){var t=this;if(t.clickTrigger)return t;var n=t.getPos||f,i=t.boxInput,r=u(i),a=t.target,s=a.offsetWidth,o=a.offsetHeight,a=0==s?{left:-1e4,top:-1e4}:n(a);return i.style.width=r.style.width=s+"px",i.style.height=r.style.height=o+"px",i.style.left=a.left+"px",i.style.top=a.top+"px",e&&(i.style.zIndex=++E),t},fire:function(e,t,n){if(!n)return l(this.fns[e],this,t);var i=this.fns[e+"Async"];if(i)return l(i,this,t,n);n(l(this.fns[e],this,t))},run:function(e,t,n){e=this[e];return e&&l(e,this,t),n&&l(this.fns[n],this,t),this},addTask:function(e,t){if(e||t){var n,i,r=t?(n=t.webkitRelativePath||t.name||t.fileName,0===t.size?0:t.size||t.fileSize):(n=b(e.value,"\\").slice(1)||e.value,-1),a=this,s=b(n,".").toLowerCase();a.disallows&&a.disallows[s]||a.allows&&!a.allows[s]?i="ext":-1!=r&&a.maxSize&&r>a.maxSize&&(i="size");var o={id:++w,name:n,ext:s,size:r,input:e,file:t,state:i?-1:0};return i&&(o.limited=i,o.disabled=!0),a.fire("add",o,function(e){!1===e||o.disabled||o.limited||(o.index=a.list.length,a.list.push(o),a.map[o.id]=o,a.run("draw",o,"draw"),a.auto&&a.start())}),o}},add:function(e){if("INPUT"==e.tagName){var t=e.files;if(t)for(var n=0,i=t.length;n<i;n++)this.addTask(e,t[n]);else this.addTask(e)}else this.addTask(o,e)},addList:function(e){for(var t=0,n=e.length;t<n;t++)this.add(e[t])},get:function(e){if(e!=o)return this.map[e]},cancel:function(e,t){var n=this,i=n.get(e);if(i){e=i.state;if(0!=e&&1!=e)return n;if(1==e){e=i.xhr;if(e)return e.abort(),n;n.iframe.contentWindow.location="about:blank"}return t?n:n.complete(i,-2)}},remove:function(e){var t=this.get(e);t&&(1==t.state&&this.cancel(e),t.deleted=!0,this.fire("remove",t))},start:function(){var e=this,t=e.workerIdle,n=e.list,i=e.index,r=n.length;if(e.started||(e.started=!0),r<=0||r<=i||t<=0)return e;i=n[i];return e.index++,e.upload(i)},upload:function(t){var n=this;return!t||0!=t.state||t.skip||t.deleted?n.start():(t.url=n.url,n.workerIdle--,n.fire("upload",t,function(e){return!1===e?n.complete(t,-1):void(n.html5&&t.file?n._upload_html5_ready(t):t.input?n._upload_html4(t):n.complete(t,-1))}),n)},_process_xhr_headers:function(n){function e(e,t){n.setRequestHeader(e,t)}var t=this.ops;S.headers&&Object.forEach(S.headers,e),t.headers&&Object.forEach(t.headers,e)},queryState:function(i,r){var a=this,e=a.urlForQuery,s=new XMLHttpRequest,n=["action=query","hash="+(i.hash||encodeURIComponent(i.name)),"fileName="+encodeURIComponent(i.name)];return-1!=i.size&&n.push("fileSize="+i.size),a._process_params(i,function(e,t){n.push(encodeURIComponent(e)+"="+(t!=o?encodeURIComponent(t):""))},"dataQuery"),i.queryUrl=e+(-1==e.indexOf("?")?"?":"&")+n.join("&"),a.fire("beforeQuery",i),a.fire("sliceQuery",i),s.open("GET",i.queryUrl),a._process_xhr_headers(s),s.onreadystatechange=function(){if(4==s.readyState){if(s.status<200||400<=s.status)return l(r,a,s);var n,e=s.responseText;"ok"===e?n={data:{ok:!0}}:e&&(n=c(e)),n&&"number"!=typeof n||(n={data:{start:n}}),i.response=e,i.json=n,a.fire("query",i,function(e){var t;-1==(e=e==o?(t=n?n.data:o)?t.ok||t.url?-1:t.start:1==n.ret?-1:n.start:e)?(i.queryOK=!0,a.cancel(i.id,!0).complete(i,2)):((e=+e||0)!=Math.floor(e)&&(e=0),i.sliceStart=e),l(r,a,s)})}},s.onerror=function(){l(r,a,s)},s.send(null),a},_upload_html5_ready:function(i){function e(){2!=i.state&&(a.isSlice?a._upload_slice(i):a._upload_html5(i))}function r(e){i.hash&&a.isQueryState&&2!=i.state?a.queryState(i,e):e()}function t(n){a.fire("hash",i,function(){if(i.hash||!a.isMd5||!h)return r(n);var t=a.fns.hashProgress;h(i.file,function(e,t){i.hash=e,i.timeHash=t,r(n)},function(e){l(t,a,i,e)})})}var a=this;return a.isUploadAfterHash?t(e):(e(),t()),a},_process_params:function(e,t,n){n=n||"data",S.data&&Object.forEach(S.data,t),this.data&&Object.forEach(this.data,t),e&&e[n]&&Object.forEach(e[n],t)},_upload_html5:function(t){var n=this,i=new XMLHttpRequest;(t.xhr=i).upload.addEventListener("progress",function(e){n.progress(t,e.total,e.loaded)},!1),i.addEventListener("load",function(e){n.complete(t,2,e.target.responseText)},!1),i.addEventListener("error",function(){n.complete(t,-3)},!1),i.addEventListener("abort",function(){n.complete(t,-2)},!1);var r=new FormData;n._process_params(t,function(e,t){r.append(e,t)}),r.append("fileName",t.name),r.append(n.upName,t.blob||t.file,t.name),i.open("POST",t.url),n._process_xhr_headers(i),n.fire("send",t,function(e){return!1===e?n.complete(t,-1):(i.send(r),void n._afterSend(t))})},_upload_html4:function(t){var n=this,i=n.form,e=t.input;if(e._uploaded)return n.complete(t,2);e._uploaded=!0,e.name=n.upName,i.innerHTML="",i.appendChild(e),i.action=t.url,n._process_params(t,function(e,t){i.appendChild(d('<input type="hidden" name="'+e+'" value="'+t+'">'))}),n.fire("send",t,function(e){return!1===e?n.complete(t,-1):(i.submit(),void n._afterSend(t))})},_afterSend:function(e){e.lastTime=e.startTime=Date.now(),e.state=1,this._lastTask=e,this.progress(e)},progress:function(e,t,n){t=t||e.size,(!n||n<0)&&(n=0);var i=e.state||0;0<(n=t<n?t:n)&&0==i&&(e.state=i=1),function(e,t,n){if(t&&!(t<=0)){var i,r=Date.now();if(t<=n)return(i=r-e.startTime)?e.avgSpeed=Math.min(Math.round(1e3*t/i),t):e.speed||(e.avgSpeed=e.speed=t),e.time=i||0,e.endTime=r;(i=r-e.lastTime)<200||(e.speed=Math.min(Math.round(1e3*(n-e.loaded)/i),e.total),e.lastTime=r)}}(e,t=2==i?n=e.size:t,n),e.total=t,e.loaded=n,this.run("update",e,"progress")},_process_response:function(e,t){(e.response=t)&&"json"==this.dataType&&(e.json=c(t))},complete:function(e,t,n){var i=this;return(e=!e&&1==i.workerThread?i._lastTask:e)&&(t!=o&&(e.state=t),1!=e.state&&2!=t||(e.state=2,i.progress(e,e.size,e.size)),n!==o&&i._process_response(e,n)),i.run("update",e,"update").run("over",e,"over"),-2==t&&i.fire("cancel",e),i.fire("complete",e),i.workerIdle++,i.started&&i.start(),i}},k.extend=function(e,t){r(k.prototype,e,t)},(t=e.XMLHttpRequest)&&(new t).upload&&e.FormData&&(y=!0),(t=document.createElement("input")).type="file",_=!!t.files,r(k,{support:{html5:x=y,multiple:_},READY:0,PROCESSING:1,COMPLETE:2,SKIP:-1,CANCEL:-2,ERROR:-3,UI:{},Lang:{status_ready:"准备中",status_processing:"上传中",status_complete:"已完成",status_skip:"已跳过",status_cancel:"已取消",status_error:"已失败"},setup:function(e){r(S,e,!0)},getStatusText:function(e){var t=k.Lang;switch(e){case 0:return t.status_ready;case 1:return t.status_processing;case 2:return t.status_complete;case-1:return t.status_skip;case-2:return t.status_cancel;case-3:return t.status_error}return e}}),Q.Uploader=k}(window),function(e){"use strict";var r,h=Q.Uploader;h.support.html5&&(r=e.File?File.prototype.slice||File.prototype.mozSlice||File.prototype.webkitSlice:void 0,h.extend({_upload_slice:function(o){var l,u=this,e=o.blob||o.file,c=e.size,t=u.chunkSize,d=o.sliceStart||0,p=u.sliceRetryCount,f=function(e,t,n){n=+n||0;var i=new XMLHttpRequest,r=o.url,a=l==c;o.xhr=i,r+=(-1==r.indexOf("?")?"?":"&")+"action=upload&hash="+(o.hash||o.name)+"&ok="+(a?"1":"0"),i.upload.addEventListener("progress",function(e){u.progress(o,c,d+e.loaded)},!1),i.addEventListener("load",function(e){e=e.target.responseText;return a?u.complete(o,h.COMPLETE,e):1==e||'"1"'==e?t():void u.complete(o,h.ERROR,e)},!1),i.addEventListener("error",function(){return++n>p?u.complete(o,h.ERROR):void f(e,t,n)},!1);var s=new FormData;u._process_params(o,function(e,t){s.append(e,t)}),s.append("fileName",o.name),-1!=o.size&&s.append("fileSize",o.size),s.append(u.upName,e,o.name),s.append("sliceCount",o.sliceCount),s.append("sliceIndex",o.sliceIndex),i.open("POST",r),u._process_xhr_headers(i),a?u.fire("send",o,function(e){return!1===e?u.complete(o,h.SKIP):void i.send(s)}):i.send(s)};o.sliceCount=Math.ceil(c/t);function n(){c<=d||(c<(l=d+t)&&(l=c),o.sliceStart=d,o.sliceEnd=l,o.sliceIndex=Math.ceil(l/t),o.sliceBlob=r.call(e,d,l),u.fire("sliceUpload",o,function(e){return!1===e?i():void f(o.sliceBlob,i)}))}var i=function(){d=l,n()};n(),u._afterSend(o)}}))}(window),function(){"use strict";var l=Q.def,c=Q.getFirst,u=Q.getLast,d=Q.getNext,p=Q.createEle,f=Q.formatSize,h=Q.event.add,m=Q.Uploader,v=m.Lang;function t(e,t){e.className+=" "+t}function g(e,t){e&&(e.innerHTML=t||"")}m.UI.File={init:function(){var e=this.ops.view;e&&t(e,"ui-file "+(this.html5?"html5":"html4"))},draw:function(e){var t,n,i,r,a=this,s=a.ops,o=s.view;o&&(t=s.button||{},r=l(v.cancel||t.cancel,"取消"),s=l(v.remove||t.remove,"删除"),r='<div class="fl"><div class="u-name" title="'+(t=e.name)+'">'+t+'</div></div><div class="fr"><div class="u-size"></div><div class="u-speed">--/s</div><div class="u-progress-bar"><div class="u-progress" style="width:1%;"></div></div><div class="u-detail">0%</div><div class="u-state"></div><div class="u-op"><a class="u-op-cancel">'+r+'</a><a class="u-op-remove">'+s+'</a></div></div><div class="clear"></div>',n=e.id,(i=p("div","u-item",r)).taskId=n,e.box=i,o.appendChild(i),s=u(i.childNodes[1]),r=c(s),s=u(s),h(r,"click",function(){a.cancel(n)}),h(s,"click",function(){a.remove(n),o.removeChild(i)}),a.update(e))},update:function(e){var t,n,i,r,a,s,o,l,u;e&&e.box&&(t=e.total||e.size,n=e.loaded,i=e.state,o=e.box.childNodes[1],r=c(o),a=d(r),u=d(a),s=c(u),o=d(u),g(d(o),m.getStatusText(i)),t<0||(u="",this.html5&&null!=n&&0<=n&&(i==m.PROCESSING?"100.0"==(l=Math.min(100*n/t,100).toFixed(1))&&(l="99.9"):i==m.COMPLETE&&(l="100"),l&&(l+="%",g(o,s.style.width=l)),u='<span class="u-loaded">'+f(n)+"</span> / ",e=e.avgSpeed||e.speed,g(a,f(e)+"/s")),g(r,u+='<span class="u-total">'+f(t)+"</span>")))},over:function(e){e&&e.box&&t(e.box,"u-over")}},m.extend(m.UI.File)}(window);