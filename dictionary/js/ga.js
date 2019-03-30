var qs	=	window.location.search.replace('?', ''),
	_q	=	qs.split('&'),
	q	=	{};

for (var i in _q) {
	var p = _q[i].split('=');
	q[p[0]] = p[1];
}

var referer = q['referer'];
var ssl = referer.match(/https/i) || false;

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-34191946-1']);
_gaq.push(['_setCustomVar', 1, 'app_name', q['app_name'], 3]);
_gaq.push(['_setCustomVar', 2, 'referer', referer, 3]);
_gaq.push(['_gat._forceSSL']);

if (q['error']) {
	_gaq.push(['_setCustomVar', 3, 'error', q['error'], 3]);
}

_gaq.push(['_trackPageview', q['path']]);

(function() {
	var _ga = document.createElement('script'); _ga.type = 'text/javascript'; _ga.async = true;
	_ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(_ga, s);
})();