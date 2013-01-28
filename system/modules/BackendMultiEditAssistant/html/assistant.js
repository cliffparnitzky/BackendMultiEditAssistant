window.addEvent('domready', function() {
	var assistant = new Element('div', {
		'class': 'tl_assistant'
	}).inject($('main'));

	var assistantContainer = new Element('div', {
		'class': 'tl_assistant_container'
	}).inject(assistant);
	
	var dataset = $('main').getElements('.tl_box');
	if (dataset.length > 0) {
		var fields = dataset[0].getElements('[id^=ctrl_]');
		
		Array.each(fields, function(element){
			var clone = element.clone().cloneEvents(element); 
			clone.inject(assistantContainer);
		});
	}

	new Drag(assistant, {
		onStart: function(el) {
			el.set('styles', {right: 'auto'});
		}
	});
});