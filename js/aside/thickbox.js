/*
 * Thickbox 3.1 - One Box To Rule Them All.
 * By Cody Lindley (http://www.codylindley.com)
 * Copyright (c) 2007 cody lindley
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
*/
var last_hash = window.location.hash;

(function($) {
    $.fn.poll = function(callback,options){
        var $this = $(this);
        // extend our default options with those provided
        var opts = $.extend({}, $.fn.poll.defaults, options);
        setInterval(callback, opts.interval);

        // method used to update element html
        if(!callback){
		callback = function(){};
        };
    };

    // default options
    $.fn.poll.defaults = {
        type: "POST",
        url: ".",
        success: '',
        interval: 2000
    };
})(jQuery);

jQuery(document).poll(
	function(){
		if (window.location.hash != last_hash) {
			last_hash = window.location.hash;
			if (window.location.hash == "" || window.location.hash == "#") {
				// if hash is empty, remove thickbox
				tb_remove();
			} else {
				if(jQuery("#TB_iframeContent").length){
					jQuery("#TB_iframeContent")[0].contentWindow.location.replace(jQuery('a[rel="' + window.location.hash + '"]').attr("href"));
					jQuery(".spr-current-document").removeClass("spr-current-document");
					jQuery('a[class="spr-dd-menu-item"][rel="' + window.location.hash + '"]').addClass("spr-current-document");
				} else {
					tb_show('', jQuery('a[rel="' + window.location.hash + '"]').attr("href"), null);
				}
			}
		}
	},
	{
		interval: 500
	}
);
		  
var tb_pathToImage = "http://content.stockpr.com/stockpr/files/loadingAnimation.gif";
var tb_maxAutoWidth = 950;
var tb_iframe = jQuery("TB_iframeContent");
var tb_actions = '<a href="' + document.location.href.split('#')[0] + '#print" onclick="print(); return false" class="spr-print-link">Print</a>';
var tb_closeText = '<a href="' + document.location.href.split('#')[0] + '#" id="TB_closeWindowButton" title="Close">Close</a>';

function check_url(){
	if(!url){
		var url = new Object();
		url.paths = new Array();	
	}
	url.current_path = document.location.toString() + date_query();
	
	if(url.paths.indexOf(url.current_path)) {
		tb_remove();
	} else {
		url.paths.push(document.location.toString() + date_query());
		alert("adding new path: " + url.paths[url.paths.length - 1]);
	}
	return url;
}

function print() {
	frame = jQuery("#TB_iframeContent")[0];
	if (!print.url) {
		// First time someone hits print
		print.url = frame.src;
	        frame.src = print.url.replace(/(http:\/\/.+\/sec).*/, "$1/print.html" + date_query() + "#" + print.url);
	} else {
		// Second and subsequent times, they're already on the print URL
		frame.src = frame.src.replace(/\?.*?#/, date_query() + "#");
	}
}

function date_query() {
	return "?num=" + new Date().getTime().toString()
}

function update_anchor(anchor){
	var url = document.location.href;
	last_hash = anchor;
	if (!url.match("#") )
		url = url + "#";
	
	if (window.location.hash == "" || window.location.hash == "#") {
        	document.location = url.split('#')[0] + anchor;
        	//document.location = url.split('#')[0] + anchor;
	} else {
		//location.replace(url + anchor);
		location.replace(url.split('#')[0] + anchor);
	}
}

/*!!!!!!!!!!!!!!!!! edit below this line at your own risk !!!!!!!!!!!!!!!!!!!!!!!*/

//on page load call tb_init
jQuery(document).ready(function(){   
	tb_init('a.thickbox, area.thickbox, input.thickbox');//pass where to apply thickbox
	imgLoader = new Image();// preload image
	imgLoader.src = tb_pathToImage;
});

//add thickbox to href & area elements that have a class of .thickbox
function tb_init(domChunk){
	jQuery(domChunk).click(function(){
	var t = this.title || this.name || null;
	var a = this.href || this.alt;
	if(!this.rel.match("#")){
		var g = this.rel || false;
	} else {
		var g = false;
		document.location = document.location.href.split("#")[0] + "#";
		update_anchor(this.rel);
	}
	tb_show(t,a,g);
	this.blur();
	return false;
	});
}

function tb_show(caption, url, imageGroup) {//function called when the user clicks on a thickbox link

	try {
		if (typeof document.body.style.maxHeight === "undefined") {//if IE 6
			jQuery("body","html").css({height: "100%", width: "100%"});
			jQuery("html").css("overflow","hidden");
			if (document.getElementById("TB_HideSelect") === null) {//iframe to hide select elements in ie6
				jQuery("body").append("<iframe id='TB_HideSelect'></iframe><div id='TB_overlay'></div><div id='TB_window'></div>");
				jQuery("#TB_overlay").click(tb_remove);
			}
		}else{//all others
			if(document.getElementById("TB_overlay") === null){
				jQuery("body").append("<div id='TB_overlay'></div><div id='TB_window'></div>");
				jQuery("#TB_overlay").click(tb_remove);
			}
		}
		
		if(tb_detectMacXFF()){
			jQuery("#TB_overlay").addClass("TB_overlayMacFFBGHack");//use png overlay so hide flash
		}else{
			jQuery("#TB_overlay").addClass("TB_overlayBG");//use background and opacity
		}
		
		if(caption===null){caption="";}
		jQuery("body").append("<div id='TB_load'><img src='"+imgLoader.src+"' /></div>");//add loader to the page
		//jQuery('#TB_load').show();//show loader
		jQuery("#TB_window").css({display:"block"});
		
		var baseURL;
	   if(url.indexOf("?")!==-1){ //ff there is a query string involved
			baseURL = url.substr(0, url.indexOf("?"));
	   }else{ 
	   		baseURL = url;
	   }
	   
	   var urlString = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/;
	   var urlType = baseURL.toLowerCase().match(urlString);

		if(urlType == '.jpg' || urlType == '.jpeg' || urlType == '.png' || urlType == '.gif' || urlType == '.bmp'){//code to show images
				
			TB_PrevCaption = "";
			TB_PrevURL = "";
			TB_PrevHTML = "";
			TB_NextCaption = "";
			TB_NextURL = "";
			TB_NextHTML = "";
			TB_imageCount = "";
			TB_FoundURL = false;
			if(imageGroup){
				TB_TempArray = jQuery("a[rel="+imageGroup+"]").get();
				for (TB_Counter = 0; ((TB_Counter < TB_TempArray.length) && (TB_NextHTML === "")); TB_Counter++) {
					var urlTypeTemp = TB_TempArray[TB_Counter].href.toLowerCase().match(urlString);
						if (!(TB_TempArray[TB_Counter].href == url)) {						
							if (TB_FoundURL) {
								TB_NextCaption = TB_TempArray[TB_Counter].title;
								TB_NextURL = TB_TempArray[TB_Counter].href;
								TB_NextHTML = "<span id='TB_next'>&nbsp;&nbsp;<a href='#'>Next &gt;</a></span>";
							} else {
								TB_PrevCaption = TB_TempArray[TB_Counter].title;
								TB_PrevURL = TB_TempArray[TB_Counter].href;
								TB_PrevHTML = "<span id='TB_prev'>&nbsp;&nbsp;<a href='#'>&lt; Prev</a></span>";
							}
						} else {
							TB_FoundURL = true;
							TB_imageCount = "Image " + (TB_Counter + 1) +" of "+ (TB_TempArray.length);											
						}
				}
			}

			imgPreloader = new Image();
			imgPreloader.onload = function(){		
			imgPreloader.onload = null;
				
			// Resizing large images - orginal by Christian Montoya edited by me.
			var pagesize = tb_getPageSize();
			var x = pagesize[0] - 150;
			var y = pagesize[1] - 150;
			var imageWidth = imgPreloader.width;
			var imageHeight = imgPreloader.height;
			if (imageWidth > x) {
				imageHeight = imageHeight * (x / imageWidth); 
				imageWidth = x; 
				if (imageHeight > y) { 
					imageWidth = imageWidth * (y / imageHeight); 
					imageHeight = y; 
				}
			} else if (imageHeight > y) { 
				imageWidth = imageWidth * (y / imageHeight); 
				imageHeight = y; 
				if (imageWidth > x) { 
					imageHeight = imageHeight * (x / imageWidth); 
					imageWidth = x;
				}
			}
			// End Resizing
			
			TB_WIDTH = imageWidth + 30;
			TB_HEIGHT = imageHeight + 60;
			jQuery("#TB_window").append("<a href='' id='TB_ImageOff' title='Close'><img id='TB_Image' src='"+url+"' width='"+imageWidth+"' height='"+imageHeight+"' alt='"+caption+"'/></a>" + "<div id='TB_caption'>"+caption+"<div id='TB_secondLine'>" + TB_imageCount + TB_PrevHTML + TB_NextHTML + "</div></div><div id='TB_closeWindow'>"+tb_closeText+"</div>"); 		
			
			jQuery("#TB_closeWindowButton").click(tb_remove);
			
			if (!(TB_PrevHTML === "")) {
				function goPrev(){
					if(jQuery(document).unbind("click",goPrev)){jQuery(document).unbind("click",goPrev);}
					jQuery("#TB_window").remove();
					jQuery("body").append("<div id='TB_window'></div>");
					tb_show(TB_PrevCaption, TB_PrevURL, imageGroup);
					return false;	
				}
				jQuery("#TB_prev").click(goPrev);
			}
			
			if (!(TB_NextHTML === "")) {		
				function goNext(){
					jQuery("#TB_window").remove();
					jQuery("body").append("<div id='TB_window'></div>");
					tb_show(TB_NextCaption, TB_NextURL, imageGroup);				
					return false;	
				}
				jQuery("#TB_next").click(goNext);
				
			}

			document.onkeydown = function(e){ 	
				if (e == null) { // ie
					keycode = event.keyCode;
				} else { // mozilla
					keycode = e.which;
				}
				if(keycode == 27){ // close
					tb_remove();
				} else if(keycode == 190){ // display previous image
					if(!(TB_NextHTML == "")){
						document.onkeydown = "";
						goNext();
					}
				} else if(keycode == 188){ // display next image
					if(!(TB_PrevHTML == "")){
						document.onkeydown = "";
						goPrev();
					}
				}	
			};
			
			tb_position();
			//jQuery("#TB_load").remove();
			jQuery("#TB_ImageOff").click(tb_remove);
			//jQuery("#TB_window").css({display:"block"}); //for safari using css instead of show
			};
			
			imgPreloader.src = url;
		}else{//code to show html
			
			var queryString = url.replace(/^[^\?]+\??/,'');
			var params = tb_parseQuery( queryString );

			TB_WIDTH = (params['width']*1) + 30 || 630; //defaults to 630 if no paramaters were added to URL
			TB_HEIGHT = (params['height']*1) + 40 || 440; //defaults to 440 if no paramaters were added to URL
			
			// Custom auto width/height option
                        var pagesize = tb_getPageSize();
			if(params['width'] == 'auto'){
				TB_WIDTH = tb_maxAutoWidth < (pagesize[0]-50) ? tb_maxAutoWidth : (pagesize[0] - 100);
			}
			if(params['height'] == 'auto'){
				TB_HEIGHT = pagesize[1] - 100;
			}

			ajaxContentW = TB_WIDTH - 30;
			ajaxContentH = TB_HEIGHT - 45;
			if(url.indexOf('TB_iframe') != -1){// either iframe or ajax window		
					urlNoQuery = url.split('TB_');
					jQuery("#TB_iframeContent").remove();
					if(params['modal'] != "true"){//iframe no modal
						jQuery("#TB_window").append("<div id='TB_title'><span id='TB_titleExtras'></span><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'>"+tb_closeText+"</div><div style='clear:both'></div></div><iframe frameborder='0' hspace='0' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent"+Math.round(Math.random()*1000)+"' onload='tb_showIframe()' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;' > </iframe>");
					}else{
						//iframe modal
						jQuery("#TB_overlay").unbind();
						jQuery("#TB_window").append("<iframe frameborder='0' hspace='0' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent"+Math.round(Math.random()*1000)+"' onload='tb_showIframe()' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;'> </iframe>");
					}
					var menu_params = document.location.toString().split('#document-')[1];
				// 	console.log(menu_params);
					// Only attempt to load the document menu if the correct ref existed on the link
				// 	if (menu_params) {
    					clean_url = document.location.href.split("#")[0].split("?")[0];
    					jQuery("#TB_titleExtras").load(clean_url + "/menu/" + menu_params,function(){
    						jQuery(".spr-sec-doc-menu #doc-link").click(function($){
                                    			jQuery(this).toggleClass("selected");
    		                        	        if(jQuery("#spr-dd-holder")){
    		                	                        jQuery("#spr-dd-holder").toggle();
    		        	                        }
    			                        });
    						jQuery("#spr-dd-close-button").click(function(){
    							jQuery(".spr-sec-doc-menu #doc-link").toggleClass("selected");
    							jQuery("#spr-dd-holder").toggle();
    							return false;
    						});
    						jQuery(".spr-dd-menu-item").each(function(){
    							jQuery(this).click(function() {
    								jQuery("#TB_iframeContent")[0].contentWindow.jQuery("#spr-sec-filing-content").html('<span class="spr-loading-indicator"><img src="http://' + document.location.host + '/images/loading-indicator.gif" align="absmiddle" /> Loading Content...</span>');
    								jQuery("#TB_iframeContent")[0].contentWindow.jQuery("#spr-sec-filing-content").load(jQuery(this).attr("href")); 
    								jQuery(".spr-current-document").removeClass("spr-current-document");
    								jQuery(this).addClass("spr-current-document");
    								update_anchor(jQuery(this).attr("rel"));
    								jQuery(".spr-sec-doc-menu #doc-link").toggleClass("selected");
    	                                                        jQuery("#spr-dd-holder").toggle();
    								return false;
    							});
    						});
    					});
				// 	}
					tb_position();
			}else{// not an iframe, ajax
					if(jQuery("#TB_window").css("display") != "block"){
						if(params['modal'] != "true"){//ajax no modal
						jQuery("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'>"+tb_closeText+"</div></div><div id='TB_ajaxContent' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px'></div>");
						}else{//ajax modal
						jQuery("#TB_overlay").unbind();
						jQuery("#TB_window").append("<div id='TB_ajaxContent' class='TB_modal' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px;'></div>");	
						}
					}else{//this means the window is already up, we are just loading new content via ajax
						jQuery("#TB_ajaxContent")[0].style.width = ajaxContentW +"px";
						jQuery("#TB_ajaxContent")[0].style.height = ajaxContentH +"px";
						jQuery("#TB_ajaxContent")[0].scrollTop = 0;
						jQuery("#TB_ajaxWindowTitle").html(caption);
					}
			}
					
			jQuery("#TB_closeWindowButton").click(tb_remove);

				if(url.indexOf('TB_inline') != -1){	
					jQuery("#TB_ajaxContent").append(jQuery('#' + params['inlineId']).children());
					jQuery("#TB_window").unload(function () {
						jQuery('#' + params['inlineId']).append( jQuery("#TB_ajaxContent").children() ); // move elements back when you're finished
					});
					tb_position();
					jQuery("#TB_load").remove();
					jQuery("#TB_window").css({display:"block"}); 
				}else if(url.indexOf('TB_iframe') != -1){
					tb_position();
					if($.browser.safari){//safari needs help because it will not fire iframe onload
						jQuery("#TB_load").remove();
						jQuery("#TB_window").css({display:"block"});
					}
				}else{
					jQuery("#TB_ajaxContent").load(url += "&random=" + (new Date().getTime()),function(){//to do a post change this load method
						tb_position();
						jQuery("#TB_load").remove();
						tb_init("#TB_ajaxContent a.thickbox");
						jQuery("#TB_window").css({display:"block"});
					});
				}
			
		}

		if(!params['modal']){
			document.onkeyup = function(e){ 	
				if (e == null) { // ie
					keycode = event.keyCode;
				} else { // mozilla
					keycode = e.which;
				}
				if(keycode == 27){ // close
					tb_remove();
				}	
			};
		}
		
	} catch(e) {
		//nothing here
	}
}

//helper functions below
function tb_showIframe(){
	jQuery("#TB_load").remove();
	jQuery("#TB_window").css({display:"block"});
}

function tb_remove() {
 	jQuery("#TB_imageOff").unbind("click");
	jQuery("#TB_closeWindowButton").unbind("click");
	jQuery("#TB_window").fadeOut("fast",function(){jQuery('#TB_window,#TB_overlay,#TB_HideSelect').trigger("unload").unbind().remove();});
	jQuery("#TB_load").remove();
	if (typeof document.body.style.maxHeight == "undefined") {//if IE 6
		jQuery("body","html").css({height: "auto", width: "auto"});
		jQuery("html").css("overflow","");
	}
	document.onkeydown = "";
	document.onkeyup = "";
	var url = document.location.toString();
        if(url.match("#")){
                document.location = url.split('#')[0] + "#";
        }
	return false;
}

function tb_position() {
	jQuery("#TB_window").css({marginLeft: '-' + parseInt((TB_WIDTH / 2),10) + 'px', width: TB_WIDTH + 'px'});
	if ( !(jQuery.browser.msie && jQuery.browser.version < 7)) { // take away IE6
		jQuery("#TB_window").css({marginTop: '-' + parseInt((TB_HEIGHT / 2),10) + 'px'});
	}
}

function tb_parseQuery ( query ) {
   var Params = {};
   if ( ! query ) {return Params;}// return empty object
   var Pairs = query.split(/[;&]/);
   for ( var i = 0; i < Pairs.length; i++ ) {
      var KeyVal = Pairs[i].split('=');
      if ( ! KeyVal || KeyVal.length != 2 ) {continue;}
      var key = unescape( KeyVal[0] );
      var val = unescape( KeyVal[1] );
      val = val.replace(/\+/g, ' ');
      Params[key] = val;
   }
   return Params;
}

function tb_getPageSize(){
	var de = document.documentElement;
	var w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
	var h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;
	arrayPageSize = [w,h];
	return arrayPageSize;
}

function tb_detectMacXFF() {
  var userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('mac') != -1 && userAgent.indexOf('firefox')!=-1) {
    return true;
  }
}


