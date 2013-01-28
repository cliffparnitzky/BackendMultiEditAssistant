window.addEvent('domready', function() {
	var assistant = new Element('div', {
		'class': 'tl_assistant'
	}).inject($('main'));

	new Drag(assistant, {
		onStart: function(el) {
			el.set('styles', {right: 'auto'});
		}
	});
});