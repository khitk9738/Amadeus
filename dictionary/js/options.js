var db = new Dexie('gwg');

// Define a schema
db.version(1).stores({
	history: '++id, *word, *timestamp'
});

// Open the database
db.open().catch(function(error) {
	//console.error(error);
	db.history = {
		add: function (){}
	};
});

function refreshHistoryCount () {
	db.history.count(function (count) {
		var disabled = false;
		
		$('#history_count').text(count);
		
		if (count == 0) {
			disabled = true;
		}
		
		$('#downloadHistory, #clearHistory').attr('disabled', disabled);
	});
}

refreshHistoryCount();

if ( ! localStorage.language) {
	var lang		=	navigator.language.toLowerCase(),
		langPart	=	lang.split('-'),
		language	=	$('[value=' + lang + '],[value=' + langPart[0] + '], [value=en]')[0].value;	
	
	var value = {
		language			:	language,
		font_size			:	11,
		dblclick_checkbox	:	true,
		dblclick_key		:	'',
		select_checkbox		:	false,
		select_key			:	''
	};
	
	for (var key in value) {
		localStorage[key] = value[key];
	}
	
	$(function() {
		$( '<p style="margin-top:.5em">The pop-up bubble will not work in tabs that were open prior to installation; such tabs must be refreshed. Also, note that all extensions are disabled on Chrome Web Store pages.</p>' ).dialog({
			buttons: {
				'Ok': function ()
				{
					$(this).dialog('close');
				}
			},
			modal: true,
			title: 'IMPORTANT'
		});
	});

}

$("#downloadHistory").click(function (e) {
	e.preventDefault();
	
	var tsv = '"Word","Count","URL","Last lookup date\/time"\n';
	var link = $("#download-history-link")[0];

	db.history.each((row) => {
		tsv += '"' + row.word + '","';
		tsv += row.count + '","';
		tsv += 'https://www.goodwordguide.com/define/' + row.word.replace(/\s+/g, '+') + '","';
		tsv += (new Date(row.date)).toLocaleString() + '"\n';
	}).then(() => {		
		link.href = window.URL.createObjectURL(new Blob([tsv], {
			type: "text/plain"
		}));

		mouseEvent = document.createEvent("MouseEvents");
		mouseEvent.initEvent("click", true, true);
		link.dispatchEvent(mouseEvent);
	});
});

$('#clearHistory').click(function (e) {
	e.preventDefault();

	db.history.clear();
	refreshHistoryCount();
});

var reset = $('[type=reset]').click(function (e) {
	e.preventDefault();
	$('button[type=submit],button[type=reset]').attr('disabled', true);
	
	for (var name in localStorage)
	{
		var elem = $('[name="' + name + '"]'),
			val = localStorage[name];
		
		if (elem[0] && elem[0].type == 'checkbox')
		{
			val = val === 'true' ? true : false;
			elem.prop('checked', val);
		}
		else if (elem[0])
		{
			elem.val(val);
		}
	}
}).click();

$('form').submit(function (e) {
	e.preventDefault();
	
	localStorage.setItem("history_checkbox", false);
	
	for (var name in localStorage) {
		var elem = $('[name="' + name + '"]'),
			val = elem.val();
		
		if (elem[0] && elem[0].type == 'checkbox') {
			val = elem[0].checked ? true : false;

		}
		
		if (elem[0]) {
			localStorage[name] = val;
		}
		
	}
	
	$('#saved').css('visibility', '').stop(1).show().delay(2225).fadeOut('slow');
	
	reset.click();
	
	chrome.extension.sendMessage({
		method: 'update_app_detail',
	});
	
});

$('#select_checkbox, #dblclick_checkbox, #history_checkbox').change(function () {
	if (this.type == 'checkbox') {
		var keyGroup = $('.' + this.id);
		
		$('select', keyGroup).attr('disabled', true);
		keyGroup.addClass('disabled');
		
		if (this.checked) {
			keyGroup.removeClass('disabled');
			$('select', keyGroup).attr('disabled', false);
		}
		
	}
}).change();

$('input, select').change(function () {
	$('button[type=submit],button[type=reset]').attr('disabled', false);	
});

var app = JSON.parse(localStorage['app']);
$('#option_version').text(app.version);