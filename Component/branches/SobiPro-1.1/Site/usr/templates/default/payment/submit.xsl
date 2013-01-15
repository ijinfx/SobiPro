<?xml version="1.0" encoding="UTF-8"?>
<!--
 @version: $Id$
 @package: SobiPro Component for Joomla!

 @author
 Name: Sigrid Suski & Radek Suski, Sigsiu.NET GmbH
 Email: sobi[at]sigsiu.net
 Url: http://www.Sigsiu.NET

 @copyright Copyright (C) 2006 - 2013 Sigsiu.NET GmbH (http://www.sigsiu.net). All rights reserved.
 @license GNU/GPL Version 3
 This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3 as published by the Free Software Foundation, and under the additional terms according section 7 of GPL v3.
 See http://www.gnu.org/licenses/gpl.html and http://sobipro.sigsiu.net/licenses.

 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 $Date$
 $Revision$
 $Author$
 $HeadURL$
-->

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:php="http://php.net/xsl">
<xsl:output method="xml" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" encoding="UTF-8"/>

	<xsl:template match="/payment_details">
		<div class="SPPayment">
			<div class="spPaymentPreview">
				<div class="spPaymentExpl">
					<xsl:value-of select="php:function( 'SobiPro::Txt', 'You have chosen following non-free options' )" />:
				</div>
				<div style="width: 100%; padding: 5px;">
					<div style="width: 10%; text-align:center" class="spPaymentHeader">
						#
					</div>
					<div style="width: 40%;" class="spPaymentHeader">
						<xsl:value-of select="php:function( 'SobiPro::Txt', 'Name' )" />
					</div>
					<div style="width: 15%;" class="spPaymentHeader">
						<xsl:value-of select="php:function( 'SobiPro::Txt', 'Netto' )" />
					</div>
					<div style="width: 15%;" class="spPaymentHeader">
						<xsl:value-of select="php:function( 'SobiPro::Txt', 'Brutto' )" />
					</div>
					<div style="clear:both;"/>
					<xsl:for-each select="positions/position">
						<div style="width: 10%; text-align:center" class="spPaymentPosition">
							<xsl:value-of select="position()" />
						</div>
						<div style="width: 40%;" class="spPaymentPosition">
							<xsl:value-of select="." />
						</div>
						<div style="width: 15%; text-align:right" class="spPaymentPosition">
							<xsl:value-of select="@netto" />
						</div>
						<div style="width: 15%; text-align:right" class="spPaymentPosition">
							<xsl:value-of select="@brutto" />
						</div>
						<div style="clear:both;"/>
					</xsl:for-each>
					<xsl:if test="discount">
						<div style="width: 100%; padding: 5px;">
							<div class="spPaymentDiscount">
								<xsl:value-of select="php:function( 'SobiPro::Txt', 'Discount' )" />:
							</div>
							<div style="width: 40%; text-align:left" class="spPaymentPosition">
								<xsl:value-of select="discount/@for" />
							</div>
							<div style="width: 10%; text-align:right" class="spPaymentPosition">
								<xsl:value-of select="discount/@discount" />
							</div>
							<div style="width: 30%; text-align:right" class="spPaymentPosition">
								- <xsl:value-of select="discount/@discount_sum" />
							</div>
							<div style="clear:both;"/>
						</div>
					</xsl:if>
					<div style="width: 100%; padding: 5px;">
						<div class="spPaymentSum">
							<xsl:value-of select="php:function( 'SobiPro::Txt', 'Summary' )" />:
						</div>
						<div style="clear:both;"/>
						<div style="width: 40%; text-align:left" class="spPaymentSumDesc">
							<xsl:value-of select="php:function( 'SobiPro::Txt', 'Netto' )" />
						</div>
						<div style="width: 40%; text-align:right" class="spPaymentSumPosition">
							<xsl:value-of select="summary/@sum_netto" />
						</div>
						<div style="width: 40%; text-align:left" class="spPaymentSumDesc">
							<xsl:value-of select="php:function( 'SobiPro::Txt', 'VAT' )" /> (<xsl:value-of select="summary/@vat" />)
						</div>
						<div style="width: 40%; text-align:right" class="spPaymentSumPosition">
							<xsl:value-of select="summary/@sum_vat" />
						</div>
						<div style="width: 40%; text-align:left" class="spPaymentSumDesc">
							<xsl:value-of select="php:function( 'SobiPro::Txt', 'Brutto' )" />
						</div>
						<div style="width: 40%; text-align:right" class="spPaymentSumPosition">
							<xsl:value-of select="summary/@sum_brutto" />
						</div>
						<div style="clear:both;"/>
					</div>
				</div>
				<div class="spPaymentExpl">
					<xsl:value-of select="php:function( 'SobiPro::Txt', 'What do you like to do' )" />:
					<div style="clear:both;"/>
					<div style="widh:100% text-align:center;">
						<xsl:for-each select="buttons/*">
								<xsl:choose>
									<xsl:when test="./data/@escaped">
										<xsl:value-of select="./data" disable-output-escaping="yes"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:copy-of select="./data/*" disable-output-escaping="yes"/>
									</xsl:otherwise>
								</xsl:choose>
						</xsl:for-each>
					</div>
				</div>
			</div>
			<br/><br/>
			<div style="clear:both;"/>
		</div>
	</xsl:template>
</xsl:stylesheet>
