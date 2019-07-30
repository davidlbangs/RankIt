var rep = function(text, obj) {
   for (var k in obj) {
       text = text.replace('{{'+k+'}}',obj[k]);
   }
   return text;
}

var last = function(selector) {
    var all = document.querySelectorAll(selector);
    return all[all.length-1];
}

window.onload = function () {
    var q = last("pre");
    q.innerHTML = JSON.stringify(stv(2,ballots),null,2);
}
    
