/**
 * @version: $Id$
 * @package: SobiPro Library

 * @author
 * Name: Sigrid Suski & Radek Suski, Sigsiu.NET GmbH
 * Email: sobi[at]sigsiu.net
 * Url: http://www.Sigsiu.NET

 * @copyright Copyright (C) 2006 - 2013 Sigsiu.NET GmbH (http://www.sigsiu.net). All rights reserved.
 * @license GNU/LGPL Version 3
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License version 3 as published by the Free Software Foundation, and under the additional terms according section 7 of GPL v3.
 * See http://www.gnu.org/licenses/lgpl.html and http://sobipro.sigsiu.net/licenses.

 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

 * $Date$
 * $Revision$
 * $Author$
 * $HeadURL$
 */

SobiPro.jQuery( document ).ready( function ()
{
	SobiPro.jQuery( 'input:file' ).change( function ()
	{
		if ( !( SobiPro.jQuery( this ).hasClass( 'spFileUpload' ) ) && SobiPro.jQuery( this ).val() ) {
			SobiPro.jQuery( '#SP_method' ).val( 'html' );
		}
	} );
	var count = 0;
	SobiPro.jQuery( '#SPAdmToolbar a' ).click( function ( e )
	{
		var task = SobiPro.jQuery( this ).attr( 'rel' );
		SobiPro.jQuery( '#SP_task' ).val( task );
		if ( task.length ) {
			e.preventDefault();
			e.stopPropagation();
			if ( SobiPro.jQuery( '#SP_method' ).val() == 'xhr' ) {
				var handler = { 'takeOver':false };
				SobiPro.jQuery( '#SPAdminForm' ).trigger( 'BeforeAjaxSubmit', [ handler, task ] )
				if ( handler.takeOver == true ) {
					return true;
				}
				SPTriggerFrakingWYSIWYGEditors();
				var req = SobiPro.jQuery( '#SPAdminForm' ).serialize();
				SobiPro.jQuery( SobiPro.jQuery( '#SPAdminForm' ).find( ':button' ) ).each( function ( i, b )
				{
					bt = SobiPro.jQuery( b );
					if ( bt.attr( 'disabled' ) != 'disabled' && bt.hasClass( 'active' ) ) {
						req += '&' + bt.attr( 'name' ) + '=' + bt.val();
					}
				} );
				SobiPro.jQuery( '#SP_task' ).val( task );
				SobiPro.jQuery.ajax( {
					url:'index.php',
					data:req,
					type:'post',
					dataType:'json',
					success:function ( data )
					{
						if ( !( data.redirect.execute ) ) {
							var handler = { 'takeOver':false };
							SobiPro.jQuery( '#SPAdminForm' ).trigger( 'AfterAjaxSubmit', [ handler, data ] )
							if ( handler.takeOver == true ) {
								return true;
							}
							count++;
							c = '';
							if ( count > 1 ) {
								c = '&nbsp;(' + count + ')';
							}
							alert = '<div class="alert alert-' + data.message.type + '"><a class="close" data-dismiss="alert" href="#">×</a>' + data.message.text + c + '</div>';
							SobiPro.jQuery( '#spMessage' ).html( alert );
							try {
								SobiPro.jQuery.each( data.data.sets, function ( i, val )
								{
									SobiPro.jQuery( '[name^="' + i + '"]' ).val( val );
								} );
							}
							catch ( e ) {
							}
							if ( data.data.required ) {
								SobiPro.jQuery( '[name*="' + data.data.required + '"]' )
									.addClass( 'error' )
									.attr( 'required', 'required' )
									.focus()
									.focusout( function ()
									{
										if ( SobiPro.jQuery( this ).val() ) {
											SobiPro.jQuery( this )
												.removeClass( 'error' )
												.removeAttr( 'required' )
												.addClass( 'success' );
										}
									} )
								;
							}
						}
						else {
							window.location.replace( data.redirect.url );
						}
					}
				} );
			}
			else {
				SobiPro.jQuery( '#SPAdminForm' ).submit();
			}
		}
	} );

	SobiPro.jQuery( '.spOrdering' ).change( function ()
	{
		SobiPro.jQuery( '#SPAdminForm' ).submit();
	} );

	SobiPro.jQuery( '[name="spToggle"]' ).change( function ()
	{
		SobiPro.jQuery( '[name="' + SobiPro.jQuery( this ).attr( 'rel' ) + '[]"]' ).prop( 'checked', SobiPro.jQuery( this ).is( ':checked' ) );
	} );

	SobiPro.jQuery( '[name="spReorder"]' ).click( function ( e )
	{
		e.preventDefault();
		SobiPro.jQuery( '#SP_task' ).val( SobiPro.jQuery( this ).attr( 'rel' ) + '.reorder' );
		SobiPro.jQuery( '#SPAdminForm' ).submit();
	} );

	try {
		SobiPro.jQuery( '.counter-reset' ).each( function ( i, e )
		{
			"use strict";
			var el = SobiPro.jQuery( e );
			if ( el.html() == 0 ) {
				el.attr( 'disabled', 'disabled' );
			}
		} );
	}
	catch ( e ) {
	}
	SobiPro.jQuery( '.counter-reset' ).click( function ()
	{
		"use strict";
		var button = SobiPro.jQuery( this );
		if ( button.html() ) {
			SobiPro.jQuery.ajax( {
				'type':'post',
				'url':SobiProAdmUrl.replace( '%task%', button.attr( 'rel' ) + '.resetCounter' ),
				'data':{
					'sid':SobiPro.jQuery( '[name^="' + button.attr( 'rel' ) + '.id"]' ).val(),
					'format':'raw'
				},
				'dataType':'json',
				success:function ()
				{
					button.html( 0 );
					button.attr( 'disabled', 'disabled' );
				}
			} );
		}
		else {
			button.attr( 'disabled', 'disabled' );
		}
	} )
	function SPTriggerFrakingWYSIWYGEditors()
	{
		var events = [ 'unload', 'onbeforeunload', 'onunload' ];
		for ( var i = 0; i < events.length; i++ ) {
			try {
				window.dispatchEvent( events[ i ] );
			}
			catch ( e ) {
			}
			try {
				window.fireEvent( events[ i ] );
			}
			catch ( e ) {
			}
			try {
				SobiPro.jQuery( document ).triggerHandler( events[ i ] );
			}
			catch ( e ) {
			}
		}
		try {
			tinyMCE.triggerSave();
		}
		catch ( e ) {
		}
	}

	SobiPro.jQuery( '.spSubmit' ).keydown(
		function ( e )
		{
			"use strict";
			if ( e.keyCode == 13 ) {
				e.preventDefault();
				e.stopPropagation();
				SobiPro.jQuery( '#SPAdminForm' ).submit();
			}
		}
	);

	SobiPro.jQuery( '.buttons-radio :button' ).each( function ( i, e )
	{
		var e = SobiPro.jQuery( e );
		"use strict"
		if ( !( e.hasClass( 'selected' ) ) ) {
			e.removeClass( 'btn-success' )
				.removeClass( 'btn-danger' );
		}
		e.click( function ()
		{
			SobiPro.jQuery( e )
				.parent()
				.parent()
				.find( '.buttons-radio :button' )
				.removeClass( 'btn-danger' )
				.removeClass( 'btn-success' );
			switch ( parseInt( SobiPro.jQuery( this ).val() ) ) {
				case 0:
					e.addClass( 'btn-danger' );
					break;
				case 1:
					e.addClass( 'btn-success' );
					break;
			}
		} );
	} );
	try {
		SobiPro.jQuery( '#spcfg-general-show-pb' ).click( function ()
		{
			if ( SobiPro.jQuery( this ).find( '.active' ).val() == 1 ) {
				SobiPro.Alert( 'PBY_NO' );
			}
		} );
	}
	catch ( e ) {
	}
	SobiPro.jQuery( 'a[rel=tooltip]' )
		.tooltip( { 'html':true } )
		.click( function ( e )
		{
			if ( SobiPro.jQuery( this ).attr( 'href' ) == '#' ) {
				e.preventDefault();
			}
		} );
	var template = '<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="pull-right close spclose">x</div><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>';
	SobiPro.jQuery( 'a[rel=popover]' )
		.popover( { 'html':true, 'trigger':'click', 'placement':'top', 'template':template } )
		.click( function ( e )
		{
			e.preventDefault();
			var proxy = SobiPro.jQuery( this );
			SobiPro.jQuery( this ).parent().find( '.popover' ).find( '.close' ).click( function ()
			{
				proxy.popover( 'hide' );
			} )
		} );
	if ( SobiPro.jQuery( '.spFileUpload' ).length ) {
		SobiPro.jQuery( '.spFileUpload' ).SPFileUploader();
	}

	//P_current-ip
	//
	try {
		SobiPro.jQuery( '#spcfg-debug-xml-ip' ).click( function ()
		{
			"use strict";
			if ( SobiPro.jQuery( this ).val() == '' ) {
				SobiPro.jQuery( this ).val( SobiPro.jQuery( '#SP_current-ip' ).val() );
			}
		} )
	}
	catch ( e ) {
	}
} );
