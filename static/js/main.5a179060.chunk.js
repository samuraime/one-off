(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{37:function(e,t,n){e.exports=n(47)},42:function(e,t,n){},43:function(e,t,n){},47:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),c=n(8),i=n.n(c),r=(n(42),n(20)),l=n(73),s=n(77),m=n(78);n(43);var u=function(){var e=Object(a.useState)(""),t=Object(r.a)(e,2),n=t[0],c=t[1],i=Object(a.useState)([]),u=Object(r.a)(i,2),f=u[0],h=u[1],d=Object(a.useState)(!1),p=Object(r.a)(d,2),v=p[0],b=p[1];return o.a.createElement("form",{className:"form",noValidate:!0,autoComplete:"off",onSubmit:function(e){e.preventDefault(),b(!0),fetch("".concat("https://one-off.samuraime.com","/kg"),{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({mids:f})}).then((function(e){return e.json()})).then((function(e){var t,n=(t=e).length?Object.keys(t[0]).join(",")+"\n"+t.map((function(e){return Object.entries(e).map((function(e){return e[1]})).join(",")})).join("\n"):"";!function(e,t){var n=document.createElement("a"),a=URL.createObjectURL(t);n.href=a,n.download=e,n.click(),URL.revokeObjectURL(a)}("kg.csv",new Blob([n],{type:"text/plain"}))})).catch((function(e){alert(e.message)})).finally((function(){b(!1)}))}},o.a.createElement(l.a,{variant:"h5"},"Get K\u6b4c Rank Detail"),o.a.createElement(s.a,{className:"row",label:"URLs",multiline:!0,fullWidth:!0,value:n,onChange:function(e){var t=e.target.value.split("\n").map((function(e){var t=e.match(/[?&]mid=([^?&]+)/);return!!t&&t[1]})).filter(Boolean);c(e.target.value),h(t)},placeholder:"example: https://kg.qq.com/accompanydetail/index.html?mid=000IsIQC1S3E6A",margin:"normal",helperText:"valid URLs: ".concat(f.length)}),o.a.createElement(m.a,{className:"row",variant:"contained",color:"primary",type:"submit",disabled:v},"Submit"))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(o.a.createElement(u,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[37,1,2]]]);
//# sourceMappingURL=main.5a179060.chunk.js.map