$(document).ready(function(){
 $("#tictac_button").on('click', function() {
	 
   document.location.href = "../tictac/popup.html";
});
$("#todo_button").on('click', function() {
	document.location.href = "../todo/todo.html";
});
$("#notes_button").on('click', function() {
  document.location.href = "../notes/popup.html";
});
$("#snake_button").on('click', function() {
  document.location.href = "../Snake/popup.html";
});
$("#dictionary").on('click', function() {
  document.location.href = "../dictionary/pages/page_action.html";
});
$("#2048_button").on('click', function() {
  document.location.href = "../2048/popup.html";
});
$("#cur_button").on('click', function() {
  document.location.href = "currency.html";
});
$("#pip_button").on('click', function() {
  document.location.href = "pip/popup.html";
});
$("#sum_button").on('click', function() {
  document.location.href = "sum.html";
});
$("#doodle_music_button").on('click', function() {
var newURL2 = "http://www.google.com/logos/2017/fischinger/fischinger17.html";
  chrome.tabs.create({ url: newURL2 });
});
$("#game_V").on('click', function() {
var newURL3 = "http://www.google.com/logos/2017/vday17/vday17-27919858.html";
  chrome.tabs.create({ url: newURL3 });
});
$("#pacman_button").on('click', function() {
var newURL4 = "http://www.google.com/logos/2010/pacman10-i.html";
  chrome.tabs.create({ url: newURL4 });
});
$("#spotify_button").on('click', function() {
  var e=(window.screen.availHeight-200)/2,n=(window.screen.availWidth-650)/2;window.open(chrome.extension.getURL("https://open.spotify.com/browse/featured"),"spotify","width=850,height=700,top="+e+",left="+n)
});
$("#record_button").on('click', function() {
  var e=(window.screen.availHeight-200)/2,n=(window.screen.availWidth-650)/2;window.open(chrome.extension.getURL("../screenrecord/index.html"),"screen-recorder","width=650,height=200,top="+e+",left="+n)
});
$("#pnr_button").on('click', function() {
  document.location.href = "pnr/pnr.html";
});

 //onoffswitch work
  $("body").on("contextmenu",function(e){
         return false;
      });
      $(document).keydown(function(event){
    if(event.keyCode==123){
    return false;
   }
else if(event.ctrlKey && event.shiftKey && event.keyCode==73){        
      return false;  //Prevent from ctrl+shift+i
   }
});
 	var check;
 	$("#rate").click(function(){
 		chrome.tabs.create({'url':'https://facebook.com'});
 	});
 	$("#howto").click(function(){
 		chrome.tabs.create({'url':'https://khitk9738.github.io/chromeit/index.htm'});
 	});
	function getVal(callback) {
chrome.storage.local.get(/* String or Array */["onoffswitch"], function(items){
	 /*chrome.storage.local.clear(function() {
    var error = chrome.runtime.lastError;
    if (error) {
        console.error(error);
      }
      });*/
                      if(items.onoffswitch === undefined ){ 	
                        chrome.storage.local.set({ "onoffswitch": "false"}, function(){
                        	check = false;
          });             
         } 
         else{
         check = items.onoffswitch;
         }
         if(check === "false"){
         	chrome.browserAction.setIcon({path:"tap.png"});
			$("#on-off-switch").prop("checked",false);
		}
		else{
			chrome.browserAction.setIcon({path:"chromeit16.png"});
			$("#on-off-switch").prop("checked",true);
		}
	new DG.OnOffSwitch({
	el: '#on-off-switch',
        textOn: 'On',
        textOff: 'Off',
        listener:function(name, checked){

chrome.storage.local.get(/* String or Array */["onoffswitch"], function(items){
 						      	if(checked == true){
 						      		chrome.storage.local.get(/* String or Array */["trigger"], function(items2){
 						     			 		if(items2.trigger === undefined){
 						     			 			alert("please set trigger first");
 						     			 			window.location.reload();
 						     			 			$("#on-off-switch").prop("checked",false);
 						     			 		}
 						     			 		else{
 						     			 			chrome.storage.local.set({ "onoffswitch": "true"}, function(){
 						     			 				chrome.browserAction.setIcon({path:"chromeit16.png"});
        							   				});
 						     			 		}
 						     			 	});
 		
 						     	}
 						     		else 
 						     			if (checked == false){
 						     				chrome.browserAction.setIcon({path:"tap.png"});
 						     				 chrome.storage.local.set({ "onoffswitch": "false"}, function(){
           								});	
 						     			}
 						     		});					   	
    					}
    				});
});
}
getVal(workWithVal);
function workWithVal(val) {
	check = val;
}
setTimeout(function(){
},500);
////trigger's work
gettrigger();
$("#trigger").focus(function(){
	$("#trigger").val("");
});
$("#trigger").blur(function(){
		setTimeout(function(){
		gettrigger();
		},500);	
});
function gettrigger(){
	chrome.storage.local.get(/* String or Array */["trigger"], function(items2){
	 	if(items2.trigger === undefined){
			$("#trigger").val("");
		}
	 	else{
 		$("#trigger").val(items2.trigger);			 			
 	}
 });
}
$("#triggerbutton").click(function(){
	var trigger = $("#trigger").val();
	if(trigger === ""){
		return; 
	}
	else{
		chrome.storage.local.set({ "trigger": trigger}, function(){
                      $("#done").css("visibility","visible"); 
          });             
	}	
});
$(document).keydown(function(event){
    if(event.keyCode == 13){
       myfun();
    }
});
function myfun(){
	var trigger = $("#trigger").val();
	if(trigger === ""){
		return; 
	}
	else{
		chrome.storage.local.set({ "trigger": trigger}, function(){
                        $("#done").css("visibility","visible");
          });             
	}	
}
});
