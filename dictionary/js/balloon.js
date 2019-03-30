$(document).dblclick(function (e) {
	if (!e.target || e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA') {
		return;
	}
	e.gwg_type = 'dblclick';
	getOptions(main_callback, e);
}).click(function (e) {
	if ($balloon) {
		$balloon.hide();
	}

}).mouseup(function (e) {
	if ($balloon) {
		$balloon.hide();
	}
	
	if (!e.target || e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA') {
		return;
	}
	e.gwg_type = 'mouseup';
	getOptions(main_callback, e);

}).keyup(function (e) {
	var key = e.keyCode;
	
	if ($balloon && (key == 13 || key == 27 || key == 9)) {
		$balloon.hide();
	}
});


$('#gwg_balloon #gwg_balloon_more').on('click', function (e) {
	$balloon.hide();
});

$(window).on('resize', function () {
	if ($balloon) {
		$balloon.hide();
	}
});

var $showTimeout;
var $protocol = 'https';//(top.location.protocol == 'https:' ? 'https' : 'https');
var spinner = chrome.extension.getURL('images/spinner.gif');
var close = chrome.extension.getURL('images/close.png');
var ga = chrome.extension.getURL('pages/ga.html');
var option_page = chrome.extension.getURL('pages/options.html');
var balloon = 'gwg_balloon';
var pointer = 'gwg_pointer';
var defaultOptions = {
	language			:	'en',
	font_size			:	11,
	dblclick_checkbox	:	'true',
	dblclick_key		:	'',
	select_checkbox		:	'false',
	select_key			:	''
};
var log = function (path, context)
{
	$('#gwg_balloon_log_iframe').remove();
	var iframe = $('<iframe id="gwg_balloon_log_iframe" style="width:1px;height:1px;display:none" src="' + ga + '?' + path + '&referer=' + window.location.href + '&app_name=Chrome EXT" frameborder="0" width="1" height="1" scrolling="no"></iframe>').appendTo(context || 'body:eq(0)').load(function () {
		setTimeout(function () {
			iframe.remove();
		}, 1000);
	});
}

/*
setInterval(function () {
	log('path=/dictionary/void');
}, 60000);

setTimeout(function () {
	log('path=/dictionary/void');
}, 200);
*/
var $balloon;
	
(function (ns) {
	var screenPadding = 5,
		headers = {
			'MEDIUM': 'API_IP',
			'GWG_MEDIUM': 'API',
			'GWG_VERSION': '3.34',
			'GWG_FORMAT': 'HTML',
			'GWG_APP_NAME': 'GWG Chrome Extention',
			'Key': '980de45r25f45d45sf435d4sf5443q5s'
		};
	
	var host = 'ww.goodwordguide.com',
		resource = {
			'dictionary': 'dictionary',
		};
	
	var _b = function (param) {
		this.selection = param.selection;
		this.word = $.trim(this.selection.toString());
		this.pointer = $(param.pointer);
		this.balloon = $(param.balloon);
		this.options = param.options;
		
		try {
			this.app = JSON.parse(param.options.app);
		}
		catch (e) {
			this.app = {
				language			:	'',
				font_size			:	11,
				dblclick_checkbox	:	true,
				dblclick_key		:	'',
				select_checkbox		:	false,
				select_key			:	''
			}
		}
		
		_b.setStaticProp.call(this);
	};
	
	_b.prototype = {
		define: function (selection) {
			//this.position();
			this.word = $.trim(selection || this.selection.toString());
			_b.xhr.call(this, {
				selection: this.word,
				success: _b.render,
				error: _b.error,
				complete: _b.complete
			}, 'dictionary');
		},
		remove: function () {
			this.balloon.remove();
			this.pointer.remove();
			setTimeout(function () {
				delete $balloon;
			});
		},
		position: function (pos) {
			this.show();
			
			var pointerY = balloonY = this.rect ? window.scrollY + this.rect[this.direction] : 20;

			_b.applyPosition.call(this, this.pointer, _b.pointX.call(this, this.pointer), pointerY);
			
			balloonY += (this.direction == 'top' ? -1 : 1) * this.pointerDim.height;
			_b.applyPosition.call(this, this.balloon, _b.pointX.call(this, this.balloon), balloonY);

			this.pointer.removeClass('top bottom').addClass(this.direction);
		},
		show: function () {
			var css = {
				display: '',
				visibility: ''
			};
			this.balloon.css(css);
			this.pointer.css(css);
			clearTimeout($showTimeout);
		},
		hide: function () {
			var css = {
				display: 'none'
			};
			this.balloon.css(css);
			this.pointer.css(css);
			clearTimeout($showTimeout);
		}
	};
	
	_b.xhr = function (opt, resrc) {
		var that = this;

		headers.GWG_VERSION = this.app.version;

		return $.ajax({
			type: 'GET',
			url: $protocol + '://' + host + '/' + resource[resrc] + '/' + opt.selection,
			dataType: 'TEXT',
			data: {
				'rv': headers.GWG_VERSION
			},
			cache: true,
			headers: headers,
			context: that,
			success: opt.success,
			error: opt.error
		});		
	};

	_b.setStaticProp = function () {
		var range = this.selection.getRangeAt(0).cloneRange();
		
		this.rect = range.getClientRects()[0];
		this.pointerDim = _b.getDimensions(this.pointer);
		this.direction = _b.direction.call(this);
	};
	
	_b.direction = function () {
		var screen = _b.getScreenDimension(),
			midPoint =	screen.height/2,
			top = midPoint - this.rect ? this.rect.top : 20,
			bottom = midPoint - this.rect ? this.rect.bottom : 20;
		
		return top < 0 ? 'top' : 'bottom';
		
		/*
		var bubbleHeight = this.balloon.outerHeight() + this.pointerDim.height;
		return this.direction = this.rect.top - bubbleHeight < screenPadding ? 'bottom' : 'top';
		*/
	};
	
	_b.getScreenDimension = function () {
		var screen = $(window);
		
		return _b.getDimensions(screen);
	};
	
	_b.pointX = function (elem) {
		var dim = _b.getDimensions(elem),
			screen = _b.getScreenDimension(),
			rect = this.rect,
			origPoint = (rect ? rect.left : 20) + Math.floor((rect ? rect.width : 20)/2),
			elemHalfWidth = dim.width/2,
			
			left = origPoint - elemHalfWidth < screenPadding ? screenPadding + elemHalfWidth : origPoint,
			right = origPoint + elemHalfWidth > screen.width ? screen.width - screenPadding - elemHalfWidth : origPoint;

			return left > (screenPadding + elemHalfWidth) ? right : left;

	};
	
	_b.applyPosition = function (elem, x, y) {
		var dim = _b.getDimensions(elem);
		
		y = this.direction == 'top' ? y - dim.height : y;
		
		elem.css({
			position: 'fixed',
			top: y + 'px',
			left: (x - elem.outerWidth()/2) + 'px'
		});
		
		var pos = elem.position();
		
		elem.css({
			position: 'absolute',
			top: pos.top + 'px',
			left: pos.left + 'px'
		});
		
	};
	
	_b.getDimensions = function (elem) {

		return {
			width: elem.outerWidth(),
			height: elem.outerHeight()
		}
	
	};
	
	
	window[ns] = function (options) {
		return new _b({
			selection: window.getSelection(),
			pointer: $('#gwg_pointer'),
			balloon: $('#gwg_balloon'),
			options: options
		})
	};
	
	_b.showTip = function (faded) {
		var color = faded ? 'gray' : 'red';
		$('.gwg_balloon_tip').hide();
		$('<div style="color:' + color + ';width:100%;padding-top:8px;clear:both" class="gwg_balloon_tip">Tip: Didn\'t want this definition pop-up? Try setting a trigger key in <a target="_blank" href="' + option_page + '">Extension Options</a>.</div>').insertAfter('#gwg_balloon_define');	
	};
	
	_b.render = function (resp, status, xhr) {
		var syns = [],
			path = xhr.getResponseHeader('CANONICAL-URL') || '/dictionary/' + encodeURIComponent(this.word);
		
		resp = resp.replace(/href="\//g, 'href="' + $protocol + '://www.goodwordguide.com/');
		$('#' + balloon + '_define', this.balloon).html(resp + '<iframe style="width:1px;height:1px;display:none" src="' + ga + '?path=' + path + '&referer=' + window.location.href + '&app_name=Chrome EXT" frameborder="0" width="1" height="1" scrolling="no"></iframe>');

		var audio = $('<audio id="gwg_balloon_audio" style="visibility:hidden" autoplay><source type="audio/mp3" /></audio>').replaceWith('#gwg_balloon_audio')[0];
		
		$('.audio_pronunciation', this.balloon).click(function (e) {
			e.preventDefault();
			e.stopPropagation();
			audio.setAttribute('src', this.href);
			audio.load();
		});
		
		//$(resp).remove();
		$('#gwg_balloon_definition_table *').css('font-size', this.options.font_size + 'px');
		
		if ( (this.word.length < 3 || validateWord(this.word)) && ! this.options.dblclick_key && ! this.options.select_key ) {
			_b.showTip();
		}
		
		this.position();

		addToHistory(this.word, window.location.href);
	};
	
	_b.error = function (xhr, status, error) {
		var term = encodeURIComponent(this.selection);
		var html = xhr.status == 404 ? '<div><div style="color: #666">No results were found.</div><div style="padding: 10px 0 0 0;color:#666;text-align:right"><a style="font-weight:normal" target="_blank" href="https://www.google.com/search?q=' + term + '">Search the web for "<strong style="color:inherit;font-weight:bold">' + $.trim(this.selection) + '</strong>" <img style="display:inline" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAXklEQVR4nK2QwQ3AMAwCs1N28k7eiZ3oI7IcU6efBomXOREyxhUZ2brTdNAcVB2BaJgCVcDAalJLXsB+iLAjm1pAwzHWHD3gWMcMg/ERMjKfFOHVqMEGqEM/gKP/6gE2f+h+3kvjIwAAAABJRU5ErkJggg=="></a></div><iframe style="width:1px;height:1px;display:none" src="' + ga + '?error=' + term + '&referer=' + window.location.href + '&app_name=Chrome EXT: ' + headers['GWG_VERSION'] + '" frameborder="0" width="1" height="1" scrolling="no"></iframe></div>' : 'Internet connection timed out! Please try again.';
		
		$('#' + balloon + '_define', this.balloon).html(html);
		
		if ( ! this.options.dblclick_key && ! this.options.select_key ) {
			//_b.showTip(1);
		}
		
		this.position();
	};
	
	_b.complete = function () {
		clearTimeout($showTimeout);
	}

})('$b');


function main_callback (opt, e) {
	opt = opt['language'] ? opt : defaultOptions;

	if ( ! validateTrigger(opt, e) ) {
		return;
	}

	var selection = $.trim(window.getSelection().toString());

	if ( ! selection || selection == '' || selection.match(/^[\t|\s|\n]+$/) || selection.match(/^\s+$/m)) {
		return false;
	}

	if ( ! opt.dblclick_key && ! opt.select_key) {
		if (selection.length < 2 || selection.match(/[\|\n|\#|\*|\@|\/|\\|\%|\@|\?|\>|\<|\=|\;|\^|\`|\]|\[|\~|\}|\{|\…|\„|\"|\©|\®|\+|\~|\%]/) || selection.length > 48) {
			return false;
		}
		
		if (selection.match(' ') && e.shiftKey == false) {
			return false;
		}
	}
	
	if ( ! $balloon ) {
		//$('#' + balloon).remove();
		//$('#' + pointer).remove();
		
		$('<div style="display:none" id="gwg_pointer" class="top">\
				<div id="gwg_pointer_base"></div>\
			</div>').appendTo('body');
			
		$('<div  style="display:none" id="' + balloon + '">\
			<div id="' + balloon + '_content">\
				<img title="Close" id="' + balloon + '_close" src="' + close + '" />\
				<div id="' + balloon + '_define">\
					<div id="gwg_balloon_spinner" style="text-align:center">Searching...</div>\
				</div>\
			</div>\
		</div>').appendTo('body:eq(0)').click(function (e) {
			e.stopPropagation();
		}).dblclick(function (e){
			e.stopPropagation();
			e.stopImmediatePropagation();
			
			var selection = $.trim(window.getSelection().toString());
			if (!selection) {
				return false;
			}
			$('.gwg_balloon_tip').remove();
			$balloon.define(selection);
		}).click(function (e) {
			e.stopPropagation();
			e.stopImmediatePropagation();
		}).mouseup(function (e) {
			e.stopPropagation();
			e.stopImmediatePropagation();
		});

		$('#' + balloon + '_close').click(function (e) {
			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();
			
			$balloon.hide();
		});
	} else {
		$balloon.hide();
		$('.gwg_balloon_tip').remove();
		$('#gwg_balloon_spinner').text('Searching...');
	}
	
	$balloon = $b(opt);
	$balloon.define();
	
	$showTimeout = setTimeout(function () {
		$balloon.show();
	}, 1000);
}

/* Listen for message from the popup */
chrome.runtime.onMessage.addListener(function(msg, sender, response) {
    if ($balloon && msg.from == 'page_action')
	{
		$balloon.hide();
	}
	
	if (msg.subject === "getSelection")
	{
		var text = window.getSelection().toString();
        response({text: text});
    }
});