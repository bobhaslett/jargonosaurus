import oHoverable from 'o-hoverable';
import FastClick from 'fastclick';

document.addEventListener('DOMContentLoaded', () => {
	// make hover effects work on touch devices
	oHoverable.init();

	// remove the 300ms tap delay on mobile browsers
	FastClick.attach(document.body);

	// YOUR CODE HERE!
	var dataset=spreadsheet.data
	// console.log("dataset",dataset);
	var width= document.getElementById('holder').getBoundingClientRect().width;
	window.addEventListener('resize', resize);
	var divSelect = document.getElementById('lucyLogo');
	divSelect.addEventListener("click",latest);
	divSelect = document.getElementById('searchText');
	divSelect.addEventListener("change",search);

	latest ();

	function search() {
		var lookup=String(this.value)
		console.log("search",lookup);
		var results=dataset.filter(function(el){
			return (el.word.indexOf(lookup) > -1)
		});
		if((results.length)<1){
			var divSelect = document.getElementById('jargon');
			divSelect.innerHTML='<div class="slide_defin">Sorry there where no matches</div>';
		}
		else {
			results=sortDS(results);
			var divSelect = document.getElementById('jargon');
			divSelect.innerHTML="";
			for (var i = 0; i < results.length; i++) {
				var wordContent=''
				var annotation=results[i]
				var str =String(annotation.commenturl)
				wordContent=wordContent+'<div class="slide_date">'+annotation.submisiondate+'</div>'+
				'<div class="slide_word" id="'+annotation.wordid+'">'+annotation.word+'</div>'+
				'<div class="slide_type">'+annotation.wordtype+'</div>'+
				'<div class="slide_url">Seen at: '+convertlink(str)+'</div></p>'+
				'<div class="slide_subhead">Plain english definition</div>'+
				'<div class="slide_defin">'+annotation.definition+'</div></p>'+
				'<div class="slide_subhead">Lucy’s commentary</div>'+
				'<div class="slide_defin">'+annotation.lucycommentary+'</div></p>'+
				'<div class="slide_subhead">Usage example</div>'+
				'<div class="slide_defin">'+annotation.usageexample+'</div></p>'+
				'<div class="slide_type">Related words</div>'+
				'<div class="slide_wordSmall">'+annotation.relatedwords+'</div>'+
				'<div class="slide_bottom"></div></p></p>'
				divSelect.innerHTML=divSelect.innerHTML+wordContent;
			}
		}
	}

	function latest () {
		console.log("latest")
		dataset=sortDS(dataset);
		var mostRecent=10;
	  	var divSelect = document.getElementById('buttonHolder');
	  	divSelect.innerHTML='<button id="submit" class="o-buttons o-buttons--standout">Submit your jargon here</button>'
	  	var button = document.getElementById('submit');
	  	button.addEventListener("click",submit);
	  	var divSelect = document.getElementById('jargon');
	  	divSelect.innerHTML='<div class="slide_defin">Most recent submissons (click word for the full definition, Lucy’s comments and related words)</div></p>';
		for (var i = 0; i < mostRecent; i++) {
			console.log(i)
			var wordContent=''
			var annotation=dataset[i]
			var str =String(annotation.commenturl)
			wordContent=wordContent+'<div class="slide_date">'+annotation.submisiondate+'</div>'+
			'<div class="slide_word" id="'+annotation.wordid+'">'+annotation.word+'</div>'+
			'<div class="slide_type">'+annotation.wordtype+'</div>'+
			'<div class="slide_url">Seen at: '+convertlink(str)+'</div></p>'+
			'<div class="slide_subhead">Plain english definition</div>'+
			'<div class="slide_defin">'+annotation.definition+'</div></p>'+
			'<div class="slide_subhead">Usage example</div>'+
			'<div class="slide_defin">'+annotation.usageexample+'</div>'+
			'<div class="slide_bottom"></div></p></p>'
			divSelect.innerHTML=divSelect.innerHTML+wordContent;

			var buttonSelect=document.getElementById(annotation.wordid);
			//console.log(buttonSelect)
			buttonSelect.addEventListener("click",fullDef);
			};

	};

	function fullDef() {
		console.log("fullDef")
	}

	function submit() {
		var divSelect = document.getElementById('buttonHolder');
		divSelect.innerHTML="";
		var divSelect = document.getElementById('jargon');
		divSelect.innerHTML="";
	}

	function convertlink(text) {
	    var urlRegex = /(https?:\/\/[^\s]+)/g;
	    return text.replace(urlRegex, function(url) {
	        return '<a href="' + url + '">' + geturl(url) + '</a>';
	    })
	}

	function geturl(url){
	    if(url.length > 13){
	     return url.substr(0,20) + "...";
	    } else { 
	     return url;
	    }
	}

	function resize () {
		width= document.getElementById('holder').getBoundingClientRect().width;
 	 }

 	function sortDS(data) {
 		data.sort(function(a, b) {
    		a = (a.submisiondate);
    		b = (b.submisiondate);
    	return a>b ? -1 : a<b ? 1 : 0;
		});
		return data
 	}


});
