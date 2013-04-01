<?php if (!defined('TL_ROOT')) die('You cannot access this file directly!');

/**
* Contao Open Source CMS
* Copyright (C) 2005-2012 Leo Feyer
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
* PHP version 5
* @copyright  Cliff Parnitzky 2012
* @author     Cliff Parnitzky
* @package    BackendMultiEditAssistant
* @license    LGPL
*/

/**
* Class BackendMultiEditAssistant
*
* Adds misc functions and initializes the assistant.
* @copyright  Cliff Parnitzky 2012
* @author     Cliff Parnitzky
*/
class BackendMultiEditAssistant extends Backend
{
	/**
	 * Initialize the object, import the user class file
	 */
	public function __construct()
	{
			parent::__construct();
			$this->import('BackendUser', 'User');
	}
	
	/**
	* Adds translated css and javascript for the footer
	*/
	public function addStaticConfiguration($strName, $strLanguage)
	{
		if ($this->User->backendMultiEditAssistantActive)
		{
			$GLOBALS['TL_CSS'][] = 'system/modules/BackendMultiEditAssistant/html/assistant.css';
			$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/BackendMultiEditAssistant/html/assistant.js';
			
			if ($this->User->backendMultiEditAssistantTableLayoutAlwaysActive)
			{
				$GLOBALS['TL_CSS'][] = 'system/modules/BackendMultiEditAssistant/html/tablelayout.css';
			}
			
			// make sure the hook is only executed once
			unset($GLOBALS['TL_HOOKS']['loadLanguageFile']['BackendMultiEditAssistantHook']);
		}
	}
	
	/**
	* Adds translated css and javascript for the footer
	*/
	public function addTranslatedConfiguration($strContent, $strTemplate)
	{
		if ($strTemplate == 'be_main' && $this->User->backendMultiEditAssistantActive)
		{
			$strContent = preg_replace('/<\/head>/', "<style type=\"text/css\">.tl_assistant_container:before {content: \"" . $GLOBALS['TL_LANG']['MSC']['BackendMultiEditAssistantTitle'] . "\";}</style>\n$0", $strContent, 1);
			return preg_replace('/<\/body>/', "<script type=\"text/javascript\">var backendMultiEditAssistantButtonApplyToAll = '" . $GLOBALS['TL_LANG']['MSC']['BackendMultiEditAssistantButtonApplyToAll'] . "';var backendMultiEditAssistantButtonTableLayoutOn = '" . $GLOBALS['TL_LANG']['MSC']['BackendMultiEditAssistantButtonTableLayoutOn'] . "';var backendMultiEditAssistantButtonTableLayoutOff = '" . $GLOBALS['TL_LANG']['MSC']['BackendMultiEditAssistantButtonTableLayoutOff'] . "';</script>\n$0", $strContent, 1);
		}
		return $strContent;
	}
}

?>