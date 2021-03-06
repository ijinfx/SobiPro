/**
 * @package: Default Template V4 for SobiPro Component for Joomla!

 * @author
 * Name: Sigrid Suski & Radek Suski, Sigsiu.NET GmbH
 * Email: sobi[at]sigsiu.net
 * Url: https://www.Sigsiu.NET

 * @copyright Copyright (C) 2006 - 2018 Sigsiu.NET GmbH (https://www.sigsiu.net). All rights reserved.
 * @license GNU/GPL Version 3
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3
 * as published by the Free Software Foundation, and under the additional terms according section 7 of GPL v3.
 * See http://www.gnu.org/licenses/gpl.html and https://www.sigsiu.net/licenses.

 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 */

SobiPro.jQuery( document ).ready( function () {
	var spSearchDefStr = '';
	SobiPro.jQuery( '#SPSearchBox' ).bind( 'click', function () {
		spSearchDefStr = spSearchDefStr == '' ? SobiPro.Txt( 'SH.SEARCH_FOR_BOX' ) : spSearchDefStr;
		if ( SobiPro.jQuery( '#SPSearchBox' ).val() == spSearchDefStr ) {
			SobiPro.jQuery( '#SPSearchBox' ).val( '' );
		}
	} );
	SobiPro.jQuery( '#SPSearchBox' ).bind( 'blur', function () {
		spSearchDefStr = spSearchDefStr == '' ? SobiPro.Txt( 'SH.SEARCH_FOR_BOX' ) : spSearchDefStr;
		if ( SobiPro.jQuery( '#SPSearchBox' ).val() == '' ) {
			SobiPro.jQuery( '#SPSearchBox' ).val( spSearchDefStr );
		}
	} );

	try {
		SobiPro.jQuery( '#SPExtSearch' ).slideToggle( 'fast' );
		SobiPro.jQuery( '#SPExOptBt' ).bind( 'click', function () {
			SobiPro.jQuery( '#SPExtSearch' ).slideToggle( 'fast' );
		} );
	}
	catch (e) {
	}

	try {
		SobiPro.jQuery( '#info-window-btn' ).bind( 'click', function () {
			if ( SobiPro.jQuery( '#info-window-btn' ).attr( 'data-visible' ) == 'false' ) {

				SobiPro.jQuery( '#info-window-btn' ).html( SobiPro.Txt( 'TP.SEARCH_HIDE' ) );  //set new
				SobiPro.jQuery( '#info-window-btn' ).attr( 'data-visible', true );
				SobiPro.jQuery( '#bottom_button' ).removeClass( 'hidden' );
			}
			else {
				SobiPro.jQuery( '#info-window-btn' ).attr( 'data-visible', false );
				SobiPro.jQuery( '#info-window-btn' ).html( SobiPro.Txt( 'TP.SEARCH_REFINE' ) );
				SobiPro.jQuery( '#bottom_button' ).addClass( 'hidden' );
			}
		} );
	} catch (e) {
	}


	SobiPro.jQuery( '.sphrase' ).each( function ( i, e ) {
		var e = SobiPro.jQuery( e );
		if ( !(e.hasClass( 'active' )) ) {
			e.removeClass( 'btn-sigsiu' );
		}
		e.click( function () {
			SobiPro.jQuery( e )
				.parent()
				.find( '.sphrase' )
				.removeClass( 'btn-sigsiu' ).addClass( 'btn-default' ).removeClass( 'btn-success' );
			SobiPro.jQuery( e ).removeClass( 'btn-default' ).addClass( 'btn-sigsiu' );
		} );
	} );

} );
