import{_ as n,a as t,i as e,s as r,S as o,e as c,b as a,t as i,l as s,o as u,c as f,q as l,r as h,u as p,v as m,w as v,x as d,y as g,R as x,z as b,d as $,T as k,D as j,j as w,U as E,V as q,n as y,f as T,h as I,m as N,k as D}from"./index.cab134b1.js";import{_ as S,a as V,b as _,c as z}from"./assertThisInitialized.911b0af7.js";import B from"@babel/runtime/helpers/esm/createSuper";import{s as C}from"./_store.c5ff64f7.js";import"./index.925cd94f.js";function H(n,t,e){var r=n.slice();return r[15]=t[e],r}function L(n,t,e){var r=n.slice();return r[12]=t[e],r}function M(n){for(var t,e,r=n[3],o=[],l=0;l<r.length;l+=1)o[l]=G(H(n,r,l));var h=function(n){return i(o[n],1,1,function(){o[n]=null})};return{c:function(){for(var n=0;n<o.length;n+=1)o[n].c();t=c()},l:function(n){for(var e=0;e<o.length;e+=1)o[e].l(n);t=c()},m:function(n,r){for(var c=0;c<o.length;c+=1)o[c].m(n,r);a(n,t,r),e=!0},p:function(n,e){if(15&e){var c;for(r=n[3],c=0;c<r.length;c+=1){var a=H(n,r,c);o[c]?(o[c].p(a,e),u(o[c],1)):(o[c]=G(a),o[c].c(),u(o[c],1),o[c].m(t.parentNode,t))}for(w(),c=r.length;c<o.length;c+=1)h(c);s()}},i:function(n){if(!e){for(var t=0;t<r.length;t+=1)u(o[t]);e=!0}},o:function(n){o=o.filter(Boolean);for(var t=0;t<o.length;t+=1)i(o[t]);e=!1},d:function(n){$(o,n),n&&f(t)}}}function O(n){var t,e=n[12].content+"";return{c:function(){t=h("section"),this.h()},l:function(n){t=v(n,"SECTION",{class:!0}),d(t).forEach(f),this.h()},h:function(){g(t,"class","md svelte-1tq8dlf")},m:function(n,r){a(n,t,r),t.innerHTML=e},p:function(n,r){1&r&&e!==(e=n[12].content+"")&&(t.innerHTML=e)},i:y,o:y,d:function(n){n&&f(t)}}}function R(n){var t,e,r,o={ctx:n,current:null,token:null,pending:F,then:A,catch:U,value:18,blocks:[,,,]};return q(e=n[15].getElement(),o),{c:function(){t=c(),o.block.c()},l:function(n){t=c(),o.block.l(n)},m:function(n,e){a(n,t,e),o.block.m(n,o.anchor=e),o.mount=function(){return t.parentNode},o.anchor=t,r=!0},p:function(t,r){if(n=t,o.ctx=n,8&r&&e!==(e=n[15].getElement())&&q(e,o));else{var c=n.slice();c[18]=o.resolved,o.block.p(c,r)}},i:function(n){r||(u(o.block),r=!0)},o:function(n){for(var t=0;t<3;t+=1){var e=o.blocks[t];i(e)}r=!1},d:function(n){n&&f(t),o.block.d(n),o.token=null,o=null}}}function U(n){return{c:y,l:y,m:y,p:y,i:y,o:y,d:y}}function A(n){var t,e,r,o=n[18].default;function c(n){return{props:{theme:n[1],themes:n[2],context:n[12].content}}}if(o)var p=new o(c(n));return{c:function(){t=h("section"),p&&T(p.$$.fragment),e=l(),this.h()},l:function(n){t=v(n,"SECTION",{class:!0});var r=d(t);p&&I(p.$$.fragment,r),r.forEach(f),e=m(n),this.h()},h:function(){g(t,"class","svelte-1tq8dlf")},m:function(n,o){a(n,t,o),p&&N(p,t,null),a(n,e,o),r=!0},p:function(n,e){var r={};if(2&e&&(r.theme=n[1]),4&e&&(r.themes=n[2]),1&e&&(r.context=n[12].content),o!==(o=n[18].default)){if(p){w();var a=p;i(a.$$.fragment,1,0,function(){D(a,1)}),s()}o?(p=new o(c(n)),T(p.$$.fragment),u(p.$$.fragment,1),N(p,t,null)):p=null}else o&&p.$set(r)},i:function(n){r||(p&&u(p.$$.fragment,n),r=!0)},o:function(n){p&&i(p.$$.fragment,n),r=!1},d:function(n){n&&f(t),p&&D(p),n&&f(e)}}}function F(n){return{c:y,l:y,m:y,p:y,i:y,o:y,d:y}}function G(n){var t,e,r=n[12].type===n[15].tag&&R(n);return{c:function(){r&&r.c(),t=c()},l:function(n){r&&r.l(n),t=c()},m:function(n,o){r&&r.m(n,o),a(n,t,o),e=!0},p:function(n,e){n[12].type===n[15].tag?r?(r.p(n,e),9&e&&u(r,1)):((r=R(n)).c(),u(r,1),r.m(t.parentNode,t)):r&&(w(),i(r,1,1,function(){r=null}),s())},i:function(n){e||(u(r),e=!0)},o:function(n){i(r),e=!1},d:function(n){r&&r.d(n),n&&f(t)}}}function J(n){var t,e,r,o,l=[O,M],h=[];function p(n,t){return"md"===n[12].type?0:1}return t=p(n),e=h[t]=l[t](n),{c:function(){e.c(),r=c()},l:function(n){e.l(n),r=c()},m:function(n,e){h[t].m(n,e),a(n,r,e),o=!0},p:function(n,o){var c=t;(t=p(n))===c?h[t].p(n,o):(w(),i(h[c],1,1,function(){h[c]=null}),s(),(e=h[t])||(e=h[t]=l[t](n)).c(),u(e,1),e.m(r.parentNode,r))},i:function(n){o||(u(e),o=!0)},o:function(n){i(e),o=!1},d:function(n){h[t].d(n),n&&f(r)}}}function K(n){var t,e,r,o,c,k,j;document.title=t=n[0].title;for(var E=n[0].sections,q=[],y=0;y<E.length;y+=1)q[y]=J(L(n,E,y));var T=function(n){return i(q[n],1,1,function(){q[n]=null})};return{c:function(){e=l(),r=h("div"),o=h("div"),c=h("div");for(var n=0;n<q.length;n+=1)q[n].c();this.h()},l:function(n){p('[data-svelte="svelte-1aetrll"]',document.head).forEach(f),e=m(n),r=v(n,"DIV",{class:!0});var t=d(r);o=v(t,"DIV",{class:!0});var a=d(o);c=v(a,"DIV",{class:!0});for(var i=d(c),s=0;s<q.length;s+=1)q[s].l(i);i.forEach(f),a.forEach(f),t.forEach(f),this.h()},h:function(){g(c,"class","section-container svelte-1tq8dlf"),g(o,"class","section-wrapper svelte-1tq8dlf"),g(r,"class",k=x(n[7])+" svelte-1tq8dlf")},m:function(t,i){a(t,e,i),a(t,r,i),b(r,o),b(o,c);for(var s=0;s<q.length;s+=1)q[s].m(c,null);n[9](c),n[10](o),n[11](r),j=!0},p:function(n,e){var o=z(e,1)[0];if((!j||1&o)&&t!==(t=n[0].title)&&(document.title=t),15&o){var a;for(E=n[0].sections,a=0;a<E.length;a+=1){var i=L(n,E,a);q[a]?(q[a].p(i,o),u(q[a],1)):(q[a]=J(i),q[a].c(),u(q[a],1),q[a].m(c,null))}for(w(),a=E.length;a<q.length;a+=1)T(a);s()}(!j||128&o&&k!==(k=x(n[7])+" svelte-1tq8dlf"))&&g(r,"class",k)},i:function(n){if(!j){for(var t=0;t<E.length;t+=1)u(q[t]);j=!0}},o:function(n){q=q.filter(Boolean);for(var t=0;t<q.length;t+=1)i(q[t]);j=!1},d:function(t){t&&f(e),t&&f(r),$(q,t),n[9](null),n[10](null),n[11](null)}}}function P(n){return Q.apply(this,arguments)}function Q(){return(Q=S(V.mark(function n(t){var e,r,o,c;return V.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return e=t.path,r=t.params,n.next=3,this.fetch("".concat(r.slug,".json"),{headers:{"x-madoc-path":e}});case 3:return o=n.sent,n.next=6,o.json();case 6:if(c=n.sent,200!==o.status){n.next=11;break}return n.abrupt("return",{page:c});case 11:this.error(o.status,c.message);case 12:case"end":return n.stop()}},n,this)}))).apply(this,arguments)}function W(n,t,e){var r,o,c,a,i,s,u,f=t.page,l=[];return k(S(V.mark(function n(){return V.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:if(C.set(f),r===f.title){n.next=8;break}return a.scrollTo({top:0,behavior:"smooth"}),n.t0=e,n.next=6,import("./index.0b32e929.js");case 6:n.t1=l=n.sent.default,(0,n.t0)(3,n.t1);case 8:r=f.title;case 9:case"end":return n.stop()}},n)}))),j(S(V.mark(function n(){return V.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.t0=e,n.next=3,import("./theme.96af092a.js");case 3:return n.t1=o=n.sent.theme,(0,n.t0)(1,n.t1),n.t2=e,n.next=8,import("./theme.96af092a.js");case 8:return n.t3=c=n.sent.themes,(0,n.t2)(2,n.t3),n.t4=e,n.next=13,import("./index.0b32e929.js");case 13:n.t5=l=n.sent.default,(0,n.t4)(3,n.t5);case 15:case"end":return n.stop()}},n)}))),n.$set=function(n){"page"in n&&e(0,f=n.page)},n.$$.update=function(){1&n.$$.dirty&&e(7,u=f.class?"content ".concat(f.class.join(" ")):"content")},[f,o,c,l,a,i,s,u,r,function(n){E[n?"unshift":"push"](function(){e(6,s=n)})},function(n){E[n?"unshift":"push"](function(){e(5,i=n)})},function(n){E[n?"unshift":"push"](function(){e(4,a=n)})}]}export default(function(c){n(i,o);var a=B(i);function i(n){var o;return t(this,i),o=a.call(this),e(_(o),n,W,K,r,{page:0}),o}return i}());export{P as preload};