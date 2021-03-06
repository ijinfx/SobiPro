/**
 * @package: SobiPro Library
 *
 * @author
 * Name: Sigrid Suski & Radek Suski, Sigsiu.NET GmbH
 * Email: sobi[at]sigsiu.net
 * Url: https://www.Sigsiu.NET
 *
 * @copyright Copyright (C) 2006 - 2017 Sigsiu.NET GmbH (https://www.sigsiu.net). All rights reserved.
 * @license GNU/LGPL Version 3
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License version 3
 * as published by the Free Software Foundation, and under the additional terms according section 7 of GPL v3.
 * See http://www.gnu.org/licenses/lgpl.html and https://www.sigsiu.net/licenses.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 */

SobiPro.jQuery( document ).ready( function () {
	SPJoomlaMenu()
} );

function SPJmenuFixTask( b ) {
	SobiPro.jQuery( document ).ready( function () {
		try {
			SobiPro.jQuery( SobiPro.jQuery( '#jform_type-lbl' ).siblings()[ 0 ] ).val( b );
		} catch (e) {
		}
		try {
			var a = SobiPro.jQuery( '[name*="jform[type]"]' ).parent().find( 'input[type=text]' );
			a.val( b );
			a.css( 'min-width', '200px' );
			SobiPro.jQuery( '#jform_link' ).css( 'min-width', '500px' );
		} catch (e) {
		}
	} );
}

function SPJoomlaMenu() {
	try {
		var f = Joomla.submitbutton;
		Joomla.submitbutton = function ( a, b ) {
			if ( a.indexOf( 'save' ).indexOf == -1 || a.indexOf( 'apply' ) == -1 || SPValidate() ) {
				f( a, b );
			}
		}
	} catch (x) {
		var f = submitbutton;
		submitbutton = function ( a, b ) {
			if ( a.indexOf( 'save' ).indexOf == -1 || a.indexOf( 'apply' ) == -1 || SPValidate() ) {
				f( a, b );
			}
		}
	}
	SobiPro.jQuery( "#spsection" ).bind( "change", function () {
		if ( !(SobiPro.jQuery( "#spsection option:selected" ).val()) ) {
			return;
		}
		sid = SobiPro.jQuery( "#spsection option:selected" ).val();
		SobiPro.jQuery( "#sid" ).val( sid );
		SPSetObjectType( SPJmenuStrings.objects.section );
		SobiPro.jQuery( "#oname" ).val( SobiPro.htmlEntities( SobiPro.jQuery( "#spsection option:selected" ).html() ) );
		SobiPro.jQuery( "#sp_category" ).removeClass( 'btn-primary' ).html( SPJmenuStrings.labels.category );
		SobiPro.jQuery( "#sp_entry" ).removeClass( 'btn-primary' ).html( SPJmenuStrings.labels.entry );
		SPReloadTemplates( 'section' );
	} );
	if ( SobiPro.jQuery( "#sp_category" ) != null ) {
		SobiPro.jQuery( "#sp_category" ).bind( "click", function ( e ) {
			if ( SobiPro.jQuery( "#sid" ).val() == 0 ) {
				SobiPro.Alert( "PLEASE_SELECT_SECTION_FIRST" );
				semaphore = 0;
				return false;
			}
			else {
				var a = SobiProUrl.replace( '%task%', 'category.chooser' ) + '&treetpl=rchooser&multiple=1&tmpl=component&sid=' + SobiPro.jQuery( "#sid" ).val();
				jQuery( "#spCatsChooser" ).html( '<iframe id="spCatSelectFrame" src="' + a + '" style="width: 480px; height: 400px; border: none;"> </iframe>' );
				SobiPro.jQuery( '#spCat' ).modal();
				semaphore = 0;
			}
		} );
	}
	if ( SobiPro.jQuery( "#sp_entry" ) != null ) {
		SobiPro.jQuery( "#sp_entry" ).bind( "click", function ( e ) {
			if ( SobiPro.jQuery( "#sid" ).val() == 0 ) {
				SobiPro.Alert( "PLEASE_SELECT_SECTION_FIRST" );
				return false;
			}
			else {
				SobiPro.jQuery( '#spEntryChooser' ).typeahead( {
					source: function ( b, c ) {
						var d = {
							'option': 'com_sobipro',
							'task': 'entry.search',
							'sid': SobiPro.jQuery( "#sid" ).val(),
							'search': c,
							'format': 'raw'
						};
						return SobiPro.jQuery.ajax( {
							'type': 'post',
							'url': 'index.php',
							'data': d,
							'dataType': 'json',
							success: function ( a ) {
								responseData = [];
								if ( a.length ) {
									for ( var i = 0; i < a.length; i++ ) {
										responseData[ i ] = {
											'name': a[ i ].name + ' ( ' + a[ i ].id + ' )',
											'id': a[ i ].id,
											'title': a[ i ].name
										}
									}
									b.process( responseData );
									SobiPro.jQuery( '.typeahead' ).addClass( 'typeahead-width' ).css( 'font-size', '13px' );
									SobiPro.jQuery( '#spEntryChooser' ).after( SobiPro.jQuery( '.typeahead' ) );
								}
							}
						} );
					},
					onselect: function ( a ) {
						SobiPro.jQuery( '#selectedEntry' ).val( a.id );
						SobiPro.jQuery( '#selectedEntryName' ).val( a.title );
					},
					property: "name"
				} );
				SobiPro.jQuery( '#spEntry' ).modal();
			}
		} );
	}
	SobiPro.jQuery( '#spEntrySelect' ).bind( "click", function ( e ) {
		if ( !(SobiPro.jQuery( '#selectedEntry' ).val()) ) {
			return;
		}
		SobiPro.jQuery( '#sid' ).val( SobiPro.jQuery( '#selectedEntry' ).val() );
		SPSetObjectType( SPJmenuStrings.objects.entry );
		SobiPro.jQuery( "#sp_entry" ).addClass( 'btn-primary' ).html( SobiPro.htmlEntities( SobiPro.jQuery( '#selectedEntryName' ).val() ) );
		SobiPro.jQuery( "#sp_category" ).removeClass( 'btn-primary' ).html( SPJmenuStrings.labels.category );
		SPReloadTemplates( 'entry' );
	} );
	SobiPro.jQuery( '#spCatSelect' ).bind( "click", function ( e ) {
		if ( !(SobiPro.jQuery( '#selectedCat' ).val()) ) {
			return;
		}
		SobiPro.jQuery( '#sid' ).val( SobiPro.jQuery( '#selectedCat' ).val() );
		SPSetObjectType( SPJmenuStrings.objects.category );
		SobiPro.jQuery( "#sp_category" ).addClass( 'btn-primary' ).html( SobiPro.htmlEntities( SobiPro.jQuery( '#selectedCatName' ).val() ) );
		SobiPro.jQuery( "#sp_entry" ).removeClass( 'btn-primary' ).html( SPJmenuStrings.labels.entry );
		SPReloadTemplates( 'category' );
	} );
	SobiPro.jQuery( '#sptpl' ).change( function () {
		if ( SobiPro.jQuery( this ).find( 'option:selected' ).val() ) {
			SobiPro.jQuery( this ).attr( 'name', SobiPro.jQuery( this ).attr( 'name' ).replace( '-sptpl-', 'sptpl' ) );
		}
		else {
			SobiPro.jQuery( this ).attr( 'name', SobiPro.jQuery( this ).attr( 'name' ).replace( 'sptpl', '-sptpl-' ) );
			SobiPro.jQuery( '#jform_link' ).val( SobiPro.jQuery( '#jform_link' ).val().replace( /\&sptpl\=[a-zA-Z0-9\-\_\.]*/gi, '' ) )
		}
	} );
	SobiPro.jQuery( '.SobiProCalendar' ).find( 'select' ).change( function () {
		"use strict";
		var a = [];
		SobiPro.jQuery( '.SobiProCalendar' ).find( 'select' ).each( function ( i, e ) {
			if ( SobiPro.jQuery( this ).val() ) {
				a.push( SobiPro.jQuery( this ).val() );
			}
		} );
		SobiPro.jQuery( '#selectedDate' ).val( a.join( '.' ) );
	} );
}

function SPSetObjectType( a ) {
	if ( !(SPJmenuStrings.task) ) {
		SobiPro.jQuery( "#otype" ).val( a );
	}
}

function SPReloadTemplates( b ) {
	if ( (SPJmenuStrings.task) ) {
		b = SPJmenuStrings.task;
	}
	sid = SobiPro.jQuery( "#spsection option:selected" ).val();
	var c = {
		'option': 'com_sobipro',
		'task': 'template.list',
		'sid': sid,
		'type': b,
		'format': 'raw'
	};
	SobiPro.jQuery.ajax( {
		'type': 'post',
		'url': 'index.php',
		'data': c,
		'dataType': 'json',
		success: function ( a ) {
			responseData = [];
			SobiPro.jQuery( "#sptpl option" ).each( function () {
				if ( SobiPro.jQuery( this ).val() ) {
					SobiPro.jQuery( this ).remove();
				}
			} );
			if ( a.length ) {
				for ( var i = 0; i < a.length; i++ ) {
					SobiPro.jQuery( "#sptpl" ).append( '<option value="' + a[ i ].name + '">' + a[ i ].filename + '</option>' );
				}
			}
		}
	} );
}

function SPValidate() {
	if ( SobiPro.jQuery( "#sid" ).val() == 0 || SobiPro.jQuery( "#sid" ).val() == "" ) {
		SobiPro.Alert( 'YOU_HAVE_TO_AT_LEAST_SELECT_A_SECTION' );
		return false;
	}
	else {
		return true;
	}
}