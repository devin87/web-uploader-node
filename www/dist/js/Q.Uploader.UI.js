//devin87@qq.com
//build:2015/08/27 16:01:06
!function(i,s){"use strict";function e(i,s){i.className+=" "+s}function a(i,s){i&&(i.innerHTML=s||"")}var t=Q.def,d=Q.getFirst,l=Q.getLast,v=Q.getNext,c=Q.createEle,o=Q.formatSize,n=Q.Event,r=n.add,u=Q.Uploader;u.extend({init:function(){var i=this.ops.view;i&&e(i,this.html5?"html5":"html4")},draw:function(i){var s=this,e=s.ops,a=e.view;if(a){var v=e.button||{},o=t(v.cancel,"取消"),n=t(v.remove,"删除"),u=i.name,f='<div class="fl"><div class="u-name" title="'+u+'">'+u+'</div></div><div class="fr"><div class="fl u-size"></div><div class="fl u-speed">--/s</div><div class="fl u-progress-bar"><div class="u-progress" style="width:1%;"></div></div><div class="fl u-detail">0%</div><div class="fl u-state"></div><div class="fl u-op"><a class="u-op-cancel">'+o+'</a><a class="u-op-remove">'+n+'</a></div></div><div class="clear"></div>',p=i.id,h=c("div","u-item",f);h.taskId=p,i.box=h,a.appendChild(h);var m=l(h.childNodes[1]),x=d(m),Q=l(m);r(x,"click",function(){s.cancel(p)}),r(Q,"click",function(){s.remove(p),a.removeChild(h)}),s.update(i)}},update:function(i){if(i&&i.box){var e=i.total||i.size,t=i.loaded,l=i.state,c=i.box,n=c.childNodes[1],r=d(n),f=v(r),p=v(f),h=d(p),m=v(p),x=v(m);if(a(x,u.getStatusText(l)),!(0>e)){var Q="";if(this.html5&&t!=s&&t>=0){var b;if(l==u.PROCESSING){var g=Math.min(100*t/e,100);b=g.toFixed(1),"100.0"==b&&(b="99.9")}else l==u.COMPLETE&&(b="100");b&&(b+="%",h.style.width=b,a(m,b)),Q='<span class="u-loaded">'+o(t)+"</span> / ";var w=i.avg_speed||i.speed;a(f,o(w)+"/s")}Q+='<span class="u-total">'+o(e)+"</span>",a(r,Q)}}},over:function(i){i&&i.box&&e(i.box,"u-over")}})}(window);