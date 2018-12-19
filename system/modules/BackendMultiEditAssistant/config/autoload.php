<?php

/**
 * Contao Open Source CMS
 *
 * Copyright (c) 2005-2018 Leo Feyer
 *
 * @license LGPL-3.0+
 */


/**
 * Register the namespaces
 */
ClassLoader::addNamespaces(array
(
	'CliffParnitzky',
));


/**
 * Register the classes
 */
ClassLoader::addClasses(array
(
	// Classes
	'CliffParnitzky\BackendMultiEditAssistant' => 'system/modules/BackendMultiEditAssistant/classes/BackendMultiEditAssistant.php',
));
