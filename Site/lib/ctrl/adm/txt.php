<?php
/**
 * @package: SobiPro Library

 * @author
 * Name: Sigrid Suski & Radek Suski, Sigsiu.NET GmbH
 * Email: sobi[at]sigsiu.net
 * Url: https://www.Sigsiu.NET

 * @copyright Copyright (C) 2006 - 2015 Sigsiu.NET GmbH (https://www.sigsiu.net). All rights reserved.
 * @license GNU/LGPL Version 3
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License version 3
 * as published by the Free Software Foundation, and under the additional terms according section 7 of GPL v3.
 * See http://www.gnu.org/licenses/lgpl.html and https://www.sigsiu.net/licenses.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 */

use Sobi\Input\Input;

defined( 'SOBIPRO' ) || exit( 'Restricted access' );
SPLoader::loadController( 'txt' );

/**
 * @author Radek Suski
 * @version 1.0
 * @created 15-Jul-2010 18:17:28
 */
class SPJsTxtAdm extends SPJsTxt
{
	protected function js()
	{
		$lang = SPLang::jsLang( true );
		if( count( $lang ) ) {
			foreach ( $lang as $term => $text ) {
				unset( $lang[ $term ] );
				$term = str_replace( 'SP.JS_', null, $term );
				$lang[ $term ] = $text;
			}
		}
		if( !( Input::Int( 'deb' ) ) ) {
			SPFactory::mainframe()->cleanBuffer();
			header( 'Content-type: text/javascript' );
		}
		echo 'SobiPro.setLang( '.json_encode( $lang ).' );';
		exit;
	}
}
