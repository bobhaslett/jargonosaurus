import oHoverable from 'o-hoverable';
import FastClick from 'fastclick';

function is_valid_date(date) {
	return date && date instanceof Date && !isNaN(date.getTime());
}

document.addEventListener('DOMContentLoaded', () => {
	// make hover effects work on touch devices
	oHoverable.init();

	// remove the 300ms tap delay on mobile browsers
	FastClick.attach(document.body);

	// YOUR CODE HERE!
	var dataset = spreadsheet.data.map(function(row) {
		row.submisiondate = new Date(row.submisiondate);
		if (!is_valid_date(row.submissiondate)) {
			row.submisiondate = new Date(null); // Epoch.
		}
		return row;
	});
	
	var index_by_word = dataset.reduce(function(ind, row){
		if (ind[row.word]) {
			ind[row.word.toLowerCase()].push(row)
		} else if (row.word) {
			ind[row.word.toLowerCase()] = [row];
		}
		return ind;
	}, {});

	console.dir(index_by_word)

	// console.log("dataset",dataset);
	var width= document.getElementById('holder').getBoundingClientRect().width;
	window.addEventListener('resize', resize);
	var divSelect = document.getElementById('lucyLogo');
	divSelect.addEventListener("click",latest);
	divSelect = document.getElementById('searchText');
	divSelect.addEventListener("keyup",search);
	latest ();

	function search() {

		if (!this.value) {
			setTimeout(latest, 0);
			return;
		}

		var search_term = (this.value).toLowerCase();

		var results = Object.keys(index_by_word).filter(function(word){
			return word.indexOf(search_term) === 0;
		}).reduce(function(arr, word) {
			return arr.concat(index_by_word[word]);
		}, []);

		if((results.length)<1){
			var divSelect = document.getElementById('jargon');
			divSelect.innerHTML='<div class="slide_defin">Sorry there where no matches</div>';
		}
		else {
			results=sortDS(results);
			buildDef(results);
		}
	}

	function latest () {
		console.log("latest")
		dataset=sortDS(dataset);
		var mostRecent=19;
	  	var divSelect = document.getElementById('buttonHolder');
	  	divSelect.innerHTML='<button id="submit" class="o-buttons o-buttons--standout">Submit your jargon here</button>'
	  	var button = document.getElementById('submit');
	  	button.addEventListener("click",submit);
	  	var divSelect = document.getElementById('jargon');
	  	divSelect.innerHTML='<div class="slide_defin">Most recent submissons (click word for the full definition, Lucy’s comments and related words)</div></p>';
		for (var i = 0; i < mostRecent; i++) {
			var wordContent=''
			var annotation=dataset[i]
			var str =String(annotation.commenturl)
			wordContent=wordContent+'<div class="slide_date">'+annotation.submisiondate+'</div>'+
			'<div class="slide_word" data-word="'+ annotation.word.toLowerCase() +'" id="'+annotation.wordid+'">'+annotation.word+'</div>'+
			'<div class="slide_type">'+annotation.wordtype+'</div>'+
			'<div class="slide_url">Seen at: '+convertlink(str)+'</div></p>'+
			'<div class="slide_subhead">Plain english definition</div>'+
			'<div class="slide_defin">'+annotation.definition+'</div></p>'+
			'<div class="slide_subhead">Usage example</div>'+
			'<div class="slide_defin">'+annotation.usageexample+'</div>'+
			'<div class="slide_bottom"></div></p></p>'
			divSelect.innerHTML=divSelect.innerHTML+wordContent;
		}
		select('.slide_word').forEach(function (el) {
				el.addEventListener("click",fullDef);
			})

	};

	function buildDef(data) {
		console.log("Data",data)
		var divSelect = document.getElementById('jargon');
		divSelect.innerHTML=""
		for (var i = 0; i < data.length; i++) {
			var wordContent=''
			var annotation=data[i]
			var str =String(annotation.commenturl)
			wordContent=wordContent+'<div class="slide_date">'+annotation.submisiondate+'</div>'+
			'<div class="slide_word" data-word="'+ annotation.word.toLowerCase() +'" id="'+annotation.wordid+'">'+annotation.word+'</div>'+
			'<div class="slide_type">'+annotation.wordtype+'</div>'+
			'<div class="slide_url">Seen at: '+convertlink(str)+'</div></p>'+
			'<div class="slide_subhead">Plain english definition</div>'+
			'<div class="slide_defin">'+annotation.definition+'</div></p>'+
			'<div class="slide_subhead">Usage example</div>'+
			'<div class="slide_defin">'+annotation.usageexample+'</div></p>'+
			'<div class="slide_subhead">Lucy’s commentary</div>'+
			'<div class="slide_defin">'+annotation.lucycommentary+'</div></p>'+
			'<div class="slide_type">Related words</div>'
			
			console.log("annotations is",annotation.relatedwords);
			if (annotation.relatedwords!== null) {
				var split=annotation.relatedwords;
				var related='';
				for (var j = 0; j < split.length; j++) {
					//console.log("split ",split[j]);
					var newID=dataset.filter(function(el){return el.word===split[j]});
					//console.log("newID ",newID[0].wordid)
					related=related+'<div class="slide_wordSmall" data-word="'+ split[j].toLowerCase() +'" id="'+annotation.wordid+'">'+split[j]+',</div>'
				}
			}
			else {
				var related='';
			}
			wordContent=wordContent+related+'<div class="slide_bottom"></div></p></p>'
			divSelect.innerHTML=divSelect.innerHTML+wordContent;
		}
		select('.slide_wordSmall').forEach(function (el) {
				el.addEventListener("click",fullDef);
			})
	}
	
		

	function select(selector, parent=document) {
			 // return an array of elements matching the selector
		 	return [].slice.apply(parent.querySelectorAll(selector));
	}

	function fullDef() {
		var word = this.getAttribute('data-word');
		var definitions = index_by_word[word];
		console.log(word)
		console.dir(definitions)
		//console.log("Results ",results);
		buildDef (definitions)
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

 	function sortDS(data) {
 		data.sort(function(a, b) {
    		a = (a.submisiondate);
    		b = (b.submisiondate);
    	return a>b ? -1 : a<b ? 1 : 0;
		});
		return data
 	}

 	function resize () {
		width= document.getElementById('holder').getBoundingClientRect().width;
 	}


});
