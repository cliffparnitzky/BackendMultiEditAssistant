/**
 * Contao Open Source CMS
 * Copyright (C) 2005-2013 Leo Feyer
 *
 * Formerly known as TYPOlight Open Source CMS.
 *
 * This program is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program. If not, please visit the Free
 * Software Foundation website at <http://www.gnu.org/licenses/>.
 *
 * @copyright  Cliff Parnitzky 2012-2013
 * @author     Cliff Parnitzky
 * @package    BackendMultiEditAssistant
 * @license    LGPL
 */

window.addEvent('domready', function() {
	var assistant = new Element('div', {
		'class': 'tl_assistant',
		'id': 'multiEditAssistant'
	}).inject($('main'));

	var assistantContainer = new Element('div', {
		'class': 'tl_assistant_container'
	}).inject(assistant);
	
	// determine first element ... will be used for clone
	var firstElement = null;
	var elements = $('main').getElements('.tl_form')[0].getElements('.tl_tbox');
	if (elements.length > 0) {
		Array.each(elements, function(element){
			if (firstElement == null) {
				firstElement = element;
			}
		});
	}
	
	var clone = firstElement.clone(true, true).cloneEvents(firstElement);
	clone.inject(assistantContainer);
	
	// reset ids starting with "ctrl_"
	var fields = clone.getElements('[id^=ctrl_]');
	Array.each(fields, function(field){
		field.id = field.id.substring(0, field.id.lastIndexOf("_"));
		field.addEvent("click", function() {
			field.focus();
        });
	});
	// reset ids starting with "opt_"
	fields = clone.getElements('[id^=opt_]');
	Array.each(fields, function(field){
		field.id = field.id.substring(0, field.id.lastIndexOf("_"));
		// do it twice to remove record id and option index
		field.id = field.id.substring(0, field.id.lastIndexOf("_"));
	});
	// reset ids starting with "check_all_"
	fields = clone.getElements('[id^=check_all_]');
	Array.each(fields, function(field){
		field.id = field.id.substring(0, field.id.lastIndexOf("_"));
		var id = "ctrl" + field.id.substring(field.id.lastIndexOf("_"), field.id.lenth);
		field.onclick = function() {Backend.toggleCheckboxGroup(this, id);};
	});

	new Drag.Move(assistant);
	assistant.style.top = (firstElement.offsetTop - clone.offsetTop) + "px";
	
	new Element('input', {
		'type': 'submit',
		'value': backendMultiEditAssistantButtonApplyToAll,
		'onclick': 'backendMultiEditAssistantApplyToAll()'
	}).inject(assistantContainer);
	
	new Element('input', {
		'id': 'buttonTableLayout',
		'type': 'submit',
		'value': backendMultiEditAssistantButtonTableLayoutOn ,
		'onclick': 'backendMultiEditAssistantSwitchTableLayout()'
	}).inject(assistantContainer);
	
	if (isTablelayoutActive()) {
		setTablelayoutBoxWidth();
		setTablelayoutTooltips();
		hideTablelayoutIncompatibleFields();
		$("buttonTableLayout").value = backendMultiEditAssistantButtonTableLayoutOff;
	} else {
		$("buttonTableLayout").value = backendMultiEditAssistantButtonTableLayoutOn;
	}
	
	// adding interactive help to assistent
	$$('#multiEditAssistant p.tl_tip').each(function(el)
	{
		el.addEvent('mouseover', function()
		{
			el.timo = setTimeout(function()
			{
				var box = $('tl_helpBox');
				if (box)
				{
					box.setStyle('left', (el.getLeft()) + 'px');
					box.setStyle('margin-left', 0);
				}
			}, 1050);
		});
		el.addEvent('mouseout', function()
		{
			var box = $('tl_helpBox');
			if (box)
			{
				box.setStyle('left', null);
				box.setStyle('margin-left', null);
			}
		});
	});
	Backend.addInteractiveHelp();
});

function backendMultiEditAssistantApplyToAll () {
	// setting assistent fields starting with "ctrl_"
	var assitantFields = $('multiEditAssistant').getElements('[id^=ctrl_]');
	Array.each(assitantFields, function(assitantField){
		var fields = $('main').getElements('.tl_form')[0].getElements('[id^=' + assitantField.id + ']');
		Array.each(fields, function(field){
			field.value = assitantField.value;
		});
	});

	// setting assistent fields starting with "opt_"
	assitantFields = $('multiEditAssistant').getElements('[id^=opt_]');
	Array.each(assitantFields, function(assitantField){
		var fields = $('main').getElements('.tl_form')[0].getElements('[id^=' + assitantField.id + ']');
		Array.each(fields, function(field){
			if (field.value == assitantField.value) {
				field.checked = assitantField.checked;
			}
		});
	});
}

function backendMultiEditAssistantSwitchTableLayout () {
	if (isTablelayoutActive()) {
		sheet = document.getElementById("tablelayout")
		sheet.parentNode.removeChild(sheet);
		removeTablelayoutBoxWidth();
		removeTablelayoutTooltips();
		showTablelayoutIncompatibleFields();
		$("buttonTableLayout").value = backendMultiEditAssistantButtonTableLayoutOn;
	} else {
		Asset.css("system/modules/BackendMultiEditAssistant/html/tablelayout.css", {
			id: "tablelayout",
			onLoad: function() {
				setTablelayoutBoxWidth();
				setTablelayoutTooltips();
				hideTablelayoutIncompatibleFields();
			}
		});
		$("buttonTableLayout").value = backendMultiEditAssistantButtonTableLayoutOff;
	}
}

function isTablelayoutActive () {
	var styleSheets = document.getElementsByTagName("link");
	for (var i = 0; i < styleSheets.length; i++) {
		if (styleSheets[i] != null && styleSheets[i].href != null && styleSheets[i].href.search("tablelayout.css") > -1) {
			styleSheets[i].setAttribute("id", "tablelayout");
			return true;
		}
	}
	return false;
}

function setTablelayoutBoxWidth () {
	var fieldCount =  $('main').getElements('.tl_formbody_edit')[0].getElements('.tl_tbox')[0].getChildren('div').length;
	var fieldCountHidden = 0;
	$('main').getElements('.tl_formbody_edit')[0].getElements('.tl_tbox')[0].getChildren("div").each(function(el) {
		if (el.getStyle('display') == 'none') {
			fieldCountHidden++;
		}
	});
	var fieldCountSub =  $('main').getElements('.tl_formbody_edit')[0].getElements('.tl_tbox')[0].getChildren("div[id*='sub_']").length;
	var fieldCountSubDiv = 0;
	$('main').getElements('.tl_formbody_edit')[0].getElements('.tl_tbox')[0].getChildren("div[id*='sub_']").each(function(el) {
		fieldCountSubDiv += el.getChildren('div').length;
	});
	
	fieldCount = fieldCount - fieldCountHidden - fieldCountSub + fieldCountSubDiv;
	
	var fieldWidth = $('main').getElements('.tl_formbody_edit')[0].getElements('.tl_tbox')[0].getChildren('div')[0].getStyle('width').toInt();
	var boxWidth = fieldCount * fieldWidth;
	
	$('main').getElements('.tl_formbody_edit')[0].getElements('.tl_tbox')[0].setStyle('width', boxWidth);
	fields = $('main').getElements('.tl_formbody_edit')[0].getElements('.tl_box');
	Array.each(fields, function(field){
		field.setStyle('width', boxWidth)
	});
}

function removeTablelayoutBoxWidth () {
	$('main').getElements('.tl_formbody_edit')[0].getElements('.tl_tbox')[0].setStyle('width', null);
	fields = $('main').getElements('.tl_formbody_edit')[0].getElements('.tl_box');
	Array.each(fields, function(field){
		field.setStyle('width', null)
	});
}

function setTablelayoutTooltips () {
	// adding tooltips to label
	$$('.tl_formbody_edit label').each(function(el)
	{
		if (el.retrieve('complete'))
		{
			return;
		}

		el.addEvent('mouseover', function()
		{
			el.timo = setTimeout(function()
			{
				var box = $('tl_helpBox');

				if (!box)
				{
					box = new Element('div').setProperty('id', 'tl_helpBox').injectInside($(document.body));
				}

				var scroll = el.getTop();

				box.set('html', el.get('html'));
				box.setStyle('display', 'block');
				box.setStyle('top', (scroll + 18) + 'px');
				box.setStyle('left', (el.getLeft()) + 'px');
				box.setStyle('margin-left', 0);
				box.setStyle('width', 130);
			}, 1000);
		});

		el.addEvent('mouseout', function()
		{
			var box = $('tl_helpBox');

			if (box)
			{
				box.setStyle('display', 'none');
				box.setStyle('width', null);
			}

			clearTimeout(el.timo);
		});

		el.store('complete', true);
	});
}

function removeTablelayoutTooltips () {
	// adding tooltips to label
	$$('.tl_formbody_edit label').each(function(el)
	{
		el.removeEvents('mouseover');
		el.removeEvents('mouseout');
		
		el.store('complete', false);
	});
}

function hideTablelayoutIncompatibleFields () {
	// remove some fields that could not be displayed correct in a table
	var timo = setTimeout(function() {
		var hidedElements = 0;
		$$('.tl_formbody_edit .tl_modulewizard').each(function(el) {
			el.getParent().setStyle('display', 'none');
			hidedElements++;
		}); 
		$$('.tl_formbody_edit .mceEditor').each(function(el) {
			el.getParent().setStyle('display', 'none');
			hidedElements++;
		}); 
		$$('.tl_formbody_edit .tree_view').each(function(el) {
			el.getParent().setStyle('display', 'none');
			hidedElements++;
		}); 
		$$(".tl_formbody_edit div[id*='_sub_']").each(function(el) {
			el.setStyle('display', 'none');
			hidedElements++;
		});
		if (hidedElements > 0) {
			alert(backendMultiEditAssistantButtonTableLayoutMessageHidedElements);
			setTablelayoutBoxWidth();
		}
	}, 1000);
}

function showTablelayoutIncompatibleFields () {
	$$('.tl_formbody_edit .tl_modulewizard').each(function(el) {
		el.getParent().setStyle('display', null);
	});
	$$('.tl_formbody_edit .mceEditor').each(function(el) {
		el.getParent().setStyle('display', null);
	});
	$$('.tl_formbody_edit .tree_view').each(function(el) {
		el.getParent().setStyle('display', null);
		hidedElements++;
	}); 
	$$(".tl_formbody_edit div[id*='_sub_']").each(function(el) {
		el.setStyle('display', null);
		hidedElements++;
	});
}