var sw = screen.width;
//$('body').css('width', 390);//sw - sw/1.61803398875);
var current_term;
var ac_stay;
var audio_playing;
var $term;

$(document).on('click', '.ui-autocomplete a', function () {
	$('#search-form').submit();
});

$('#q').autocomplete({
	delay: false,
	source: 'https://api.goodwordguide.com/v1/autocomplete/',
	open: function() {
		$('#title').addClass('ac');
		$('#usage-tip').hide();
		$('.ui-menu li a').each(function(){
			var that = this;
			var re = new RegExp('^(' + $('#q').val() + ')(.*)$',"g");
			var str = $(this).text();
			$(that).html(str.replace(re, "$1<b>$2</b>"));
		});
	
		var menu  = $('.ui-autocomplete');
		var menu_top = parseInt(menu.css('top'));
		menu.css('top', menu_top -1);
		$('#press_enter').css('top', menu.height() + 8).show();
	},
	change: function ()
	{
		$('#search-form').submit();
	},
	close: function ()
	{
		$('#press_enter').hide();
		$('#title').removeClass('ac');
	},
	focus: function()
	{
		ac_stay = true;
		setTimeout(function (){$('#search-form').submit()}, 50);
	},
	select: function ()
	{
		$('#search-form').submit();
	}
}).focus();

$('#meaning').scroll(function () {
	$('#title').addClass('box-fix');
	
	if ($(this).scrollTop() == 0)
	{
		$('#title').removeClass('box-fix');
	}
});

$('#search-form').submit(function (e) {
	e.preventDefault();
	var $_term = $('#q').val();
	$term = $.trim($_term).replace(/\s/g, '+');
	
	if ( ! ac_stay)
	{
		$('#q').autocomplete( "close" );
	}
	
	if (!$term || current_term == $term)
	{
		return;
	}
	
	if ( ! ac_stay)
	{
		$('#q').autocomplete( "disable" );
	}

	$('title').removeClass('box-fix');
	$('#lookup-status').text('Searching...').show();
	$('#usage-tip').hide();

	$.ajax({
		url: 'https://api.goodwordguide.com/v1/dictionary/' + $term,
		success: function (data)
		{
			current_term = $term;
			$('#press_enter').remove();
			$('#meaning').scrollTop(0);
			new view(data);
		},
		error: function ()
		{
			$('#title').html("<h3>No results found for: <i>" + $_term + "</i>.</h3>").show();
			$('#meaning').html(" ").hide();
		},
		complete: function ()
		{
			x$('#lookup-status').hide();
			ac_stay = false;
			setTimeout(function () {
				  x$(".audio_pronunciation").click(function(a) {
					play_audio(this.href);
					return;
					audio_playing || (audio_playing = this, x$(this).addClass("playing"), play_audio.registerEvent("onSongOver", "(function () {$(audio_playing).removeClass('playing');audio_playing = false;})()"), play_audio.loadAndPlay(this.href));
					a.preventDefault();
					a.stopPropagation()
				});
				$('#q').autocomplete( "enable" );
			}, 1000);
		}
	});
});

var view = function (data)
{
	var that = this;
	var dict = data.dictionary;

	for (var word in dict)
	{
		var content = [];
		var word_data = dict[word];
		var order = word_data['order'];
		var defs_data = word_data.definitions;
		
		if (word_data['hyphenated'])
		{
			word_data['hyphenated'] = word_data['hyphenated'].replace(/Â¥|¥/g, '•');
		}
		
		order.forEach(function(type, i) {
			content.push(that[type + '_title'](word, word_data, i+1) + that.definitions(defs_data[type]));
		});
		
		$('#title').html(this.title(word, word_data)).show();
		$('#meaning').html(content.join(' ')).show();
	}
};

view.prototype = {
	a_title: function (word, word_data, i)
	{
		var adj = word_data['adjective_forms'];
		var ret = '<h2>' + (word_data['hyphenated'] || word) + ' <span class="word_count">' + (i) + '.</span> <em>(adjective)</em></h2>';
		
		if (adj) ret += '<div class="meta">adjective: <b>' + adj['adjective'] + '</b>; comparative adjective: <b>' + adj['comparative'] + '</b>; superlative adjective: <b>' + adj['superlative'] + '</b></div>';
		
		return ret;
	},

	definitions: function (defs_type_data)
	{
		var ret = [];
		var i = 0;
		var l = defs_type_data.length;
		
		for (; i < l ;)
		{
			var def = defs_type_data[i++];
			var definition = def.definition;
			var examples = def.examples;
			var synonyms = def.synonyms;
			
			if (examples && examples.length)
			{
				if ( examples.length > 2) examples = examples.slice(0, 2);
				definition += ': <ul><li>' + examples.join('; <li>') + '</ul>';
			}
			else
			{
				definition += '.';
			}
			
			ret.push('<li><span class="definition_no">' + i + '.</span> ' + definition + '');
		}
		
		return '<ol>' + ret.join(' ') + '</ol>';
	},
	
	n_title: function (word, word_data, i)
	{
		var noun = word_data['noun_forms'];
		var ret = '<h2>' + (word_data['hyphenated'] || word) + ' <span class="word_count">' + (i) + '.</span> <em>(noun)</em></h2>';
		
		if (noun) ret += '<div class="meta">noun: <b>' + noun['singular'] + '</b>' + (noun['plural'] ? '; plural noun: <b>' + noun['plural'] + '</b>' : '') + '</div>';
		
		return ret;
	},
	
	r_title: function (word, word_data, i)
	{
		return '<h2>' + (word_data['hyphenated'] || word) + ' <span class="word_count">' + (i) + '.</span> <em>(adverb)</em></h2>';
	},
	
	s_title: function (word, word_data, i)
	{
		return '<h2>' + (word_data['hyphenated'] || word) + ' <span class="word_count">' + (i) + '.</span> <em>(adjective)</em></h2>';
	},
	
	title: function (word, word_data, i)
	{
		var title = '<h1>' + (word_data['hyphenated'] || word) + '</h1>';
		
		title += '<div id="meta">';
		
		var pronun = word_data.pronunciations;

		if (pronun && pronun['pronun1'])
		{
			title += ' <abbr title="North American English">NAmE.</abbr>\
				/<span class="pronunciation">' + pronun['pronun1'] + '</span>/\
				<a class="audio_pronunciation" href="https://www.goodwordguide.com/audio/mp3/' + pronun['en_us'] + '.mp3" title="#">audio</a>';
		}

		if (pronun && pronun['pronun2'])
		{
			title += ' &nbsp; | &nbsp; <abbr title="British English">BrE.</abbr>\
				/<span class="pronunciation">' + pronun['pronun2'] + '</span>/\
				<a class="audio_pronunciation" href="https://www.goodwordguide.com/audio/mp3/' + pronun['en_uk'] + '.mp3" title="#">audio</a>';
		}
		
		title += '</div>'
		
		return title;
	},
	
	v_title: function (word, word_data, i)
	{
		var verb = word_data['verb_forms'];
		var ret = '<h2>' + (word_data['hyphenated'] || word) + ' <span class="word_count">' + (i) + '.</span> <em>(verb)</em></h2>';
		
		if (verb) ret += '<div class="meta">verb: <b>' + verb['verb']  + '</b>; 3rd person present: <b>' + verb['3pp'] + '</b>; past tense: <b>' + verb['pt'] + '</b>; gerund or present participle: <b>' + verb['g'] + '</b>; past participle: <b>' + verb['pp'] + '</b></div>';
		
		return ret;
	}
};

function defaultSearch (obj)
{
	var txt = $.trim(obj.text);
	
	if (txt)
	{
		$('#q').val(txt);
		$('#search-form').submit();
	}
}

chrome.tabs.query({
    active: true,    
    lastFocusedWindow: true
}, function(array_of_Tabs) {
    var tab = array_of_Tabs[0];
	chrome.tabs.sendMessage(tab.id,  {from:'page_action', subject: "getSelection"}, defaultSearch);
});

x$(function() {
    var a = x$("#audio").flash({
        width: "0px",
        height: "0px",
        name: "pronunciation",
        id: "audio",
        allowscriptaccess: "always",
        quality: "best",
        swliveconnect: "true",
        src: "/swf/speaker.swf"
    }).css({
        overflow: "hidden",
        display: "block",
        "line-height": "0px",
        padding: "0px",
        margin: "0px",
        position: "absolute",
        left: "-1000px",
        top: "-1000px"
    });
	window.play_audio = function ($href) {console.log($href);
		$('<embed src="' + $href + '" hidden=true autostart=true loop=false>').appendTo('#meaning');
	} || new gwg.speaker(a[0]);
    x$(".audio_pronunciation").click(function(a) {
		play_audio(this.href);
		return;
        audio_playing || (audio_playing = this, x$(this).addClass("playing"), play_audio.registerEvent("onSongOver", "(function () {$(audio_playing).removeClass('playing');audio_playing = false;})()"), play_audio.loadAndPlay(this.href));
        a.preventDefault();
        a.stopPropagation()
    });
});