-- ********************************************************
-- *                                                      *
-- * IMPORTANT NOTE                                       *
-- *                                                      *
-- * Do not import this file manually but use the Contao  *
-- * install tool to create and maintain database tables! *
-- *                                                      *
-- ********************************************************

-- 
-- Table `tl_user`
-- 

CREATE TABLE `tl_user` (
  `backendMultiEditAssistantActive` char(1) NOT NULL default '',
  `backendMultiEditAssistantTableLayoutAlwaysActive` char(1) NOT NULL default ''
) ENGINE=MyISAM DEFAULT CHARSET=utf8;