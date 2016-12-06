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

defined( 'SOBIPRO' ) || exit( 'Restricted access' );

/**
 * @author Radek Suski
 * @version 1.0
 * @created 05-Feb-2010 15:14:19
 */
final class SPPayment
{
	/**
	 * @var array
	 */
	private $payments = array( array() );
	/**
	 * @var array
	 */
	private $discounts = array();

	private $refNum = null;

	/* just to prevent direct creation */
	private function __construct()
	{
	}

	/**
	 * Singleton
	 *
	 * @return SPRegistry
	 */
	public static function & getInstance()
	{
		static $me = null;
		if ( !$me || !( $me instanceof SPPayment ) ) {
			$me = new SPPayment();
		}
		return $me;
	}

	public function store( $sid )
	{
		if ( count( $this->payments[ $sid ] ) ) {
			$positions = array();
			$this->refNum = time() . '.' . $sid;
			foreach ( $this->payments[ $sid ] as $position ) {
				$positions[ ] = array(
						'refNum' => $this->refNum,
						'sid' => $sid,
						'fid' => $position[ 'id' ],
						'subject' => $position[ 'reference' ],
						'dateAdded' => 'FUNCTION:NOW()',
						'datePaid' => null,
						'validUntil' => '',
						'paid' => 0,
						'amount' => $position[ 'amount' ]
				);
			}
			try {
				Sobi::Trigger( 'Payment', ucfirst( __FUNCTION__ ), array( &$positions ) );
				SPFactory::db()->insertArray( 'spdb_payments', $positions );
			} catch ( SPException $x ) {
				Sobi::Error( 'Payment', SPLang::e( 'CANNOT_SAVE_PAYMENT_DB_ERR', $x->getMessage() ), SPC::ERROR, 500, __LINE__, __FILE__ );
			}
		}
	}

	public function summary( $id = 0 )
	{
		/**
		 * we have two models here:
		 *  - the german alike is that all prices including VAT allready
		 *  - the USA alike is that all prices are netto
		 */
		$vat = Sobi::Cfg( 'payments.vat', 0 );
		$vatsub = Sobi::Cfg( 'payments.vat_brutto', true );
		$sumnetto = 0;
		$sumbrutto = 0;
//		$sumvat = 0;
		$pos = array();
//		$out = array();
		$dis = array();
//		$sum = array();
		if ( isset( $this->payments[ $id ] ) && count( $this->payments[ $id ] ) ) {
			foreach ( $this->payments[ $id ] as $payment ) {
				if ( $vat ) {
					if ( $vatsub ) {
						$netto = $payment[ 'amount' ] / ( 1 + ( $vat / 100 ) );
						$svat = $payment[ 'amount' ] - $netto;
//						$sumvat = +$svat;
						$brutto = $payment[ 'amount' ];
					}
					else {
						$netto = $payment[ 'amount' ];
						$svat = $netto * $vat;
//						$sumvat = +$svat;
						$brutto = $netto * ( 1 + ( $vat / 100 ) );
					}
					$sumnetto += $netto;
					$sumbrutto += $brutto;
					$pos[ ] = array( 'reference' => $payment[ 'reference' ], 'netto' => self::currency( $netto ), 'brutto' => self::currency( $brutto ), 'vat' => self::percent( $vat ), 'fid' => $payment[ 'id' ] );
				}
				else {
					$sumnetto += $payment[ 'amount' ];
					$sumbrutto += $payment[ 'amount' ];
					$pos[ ] = array( 'reference' => $payment[ 'reference' ], 'amount' => self::currency( $payment[ 'amount' ] ), 'fid' => $payment[ 'id' ] );
				}
			}
		}
//		$this->discounts[ $id ][ 'discount' ] = '12%';
//		$this->discounts[ $id ][ 'for' ] = 'discount for new customer';
		Sobi::Trigger( 'SetDiscount', ucfirst( __FUNCTION__ ), array( &$this->discounts, $id ) );
		if ( isset( $this->discounts[ $id ][ 'discount' ] ) && $this->discounts[ $id ][ 'discount' ] ) {
			if ( $vat ) {
				if ( Sobi::Cfg( 'payments.discount_to_netto', false ) ) {
					if ( strstr( $this->discounts[ $id ][ 'discount' ], '%' ) ) {
						$discount = $sumnetto * ( double )( $this->discounts[ $id ][ 'discount' ] / 100 );
					}
					else {
						$discount = $this->discounts[ $id ][ 'discount' ];
					}
					$sumnetto = $sumnetto - $discount;
					$sumbrutto = $sumnetto * ( 1 + ( $vat / 100 ) );
				}
				else {
					if ( strstr( $this->discounts[ $id ][ 'discount' ], '%' ) ) {
						$discount = $sumbrutto * ( double )( $this->discounts[ $id ][ 'discount' ] / 100 );
					}
					else {
						$discount = $this->discounts[ $id ][ 'discount' ];
					}
					$sumbrutto = $sumbrutto - $discount;
					$sumnetto = $sumnetto / ( 1 + ( $vat / 100 ) );
				}
				$dis = array( 'discount_sum' => self::currency( $discount ), 'discount' => $this->discounts[ $id ][ 'discount' ], 'netto' => self::currency( $sumnetto ), 'brutto' => self::currency( $sumbrutto ), 'for' => $this->discounts[ $id ][ 'for' ], 'code' => $this->discounts[ $id ][ 'code' ] );
			}
			else {
				if ( strstr( $this->discounts[ $id ], '%' ) ) {
					$discount = $sumbrutto * ( double )( $this->discounts[ $id ] / 100 );
				}
				else {
					$discount = $this->discounts[ $id ];
				}
				$sumbrutto = -$discount;
				$sumnetto = -$discount;
				$dis = array( 'discount_sum' => self::currency( $discount ), 'discount' => $this->discounts[ $id ], 'amount' => self::currency( $sumbrutto ), 'for' => $this->discounts[ $id ][ 'for' ], 'code' => $this->discounts[ $id ][ 'code' ] );
			}
		}
		if ( $vat ) {
			if ( $vatsub ) {
				$sumnetto = $sumbrutto / ( 1 + ( $vat / 100 ) );
				$sumvat = $sumbrutto - $sumnetto;
			}
			else {
				$sumbrutto = $sumnetto * ( 1 + ( $vat / 100 ) );
				$sumvat = $sumnetto * ( $vat / 100 );
			}
			$sum = array(
					'sum_netto' => self::currency( $sumnetto ),
					'sum_brutto' => self::currency( $sumbrutto ),
					'sum_vat' => self::currency( $sumvat ),
					'vat' => self::percent( $vat )
			);
		}
		else {
			$sum = array( 'sum_brutto' => self::currency( $sumbrutto ) );
		}
		$r = array( 'positions' => $pos, 'discount' => $dis, 'summary' => $sum, 'refNum' => $this->refNum );
		Sobi::Trigger( 'Payment', 'AfterSummary', array( &$r, $id ) );
		return $r;
	}

	/**
	 * @param double $amount
	 * @param string $reference - just a text to save in the db
	 * @param int $sid - id of the entry
	 * @param string $fid - field id or unique reference identifier
	 * @return bool
	 */
	public function add( $amount, $reference, $sid = 0, $fid = null )
	{
		if ( ( $sid && $this->check( $sid, $fid ) ) || ( Sobi::Can( 'entry.payment.free' ) ) ) {
			return true;
		}
		$this->payments[ $sid ][ ] = array( 'reference' => $reference, 'amount' => $amount, 'id' => $fid );
		Sobi::Trigger( 'Payment', ucfirst( __FUNCTION__ ), array( &$this->payments, $sid ) );
	}

	public function count( $sid = 0 )
	{
		$payment = 0;
		if ( isset( $this->payments[ $sid ] ) && count( $this->payments[ $sid ] ) ) {
			foreach ( $this->payments[ $sid ] as $position ) {
				$payment += $position[ 'amount' ];
			}
		}
		return $payment;
	}

	public static function check( $sid, $fid )
	{
		$db =& SPFactory::db();
		$c = false;
		/* try to save */
		try {
			$db->select( 'COUNT( pid )', 'spdb_payments', array( 'sid' => $sid, 'fid' => $fid ) );
			$c = $db->loadResult();
		} catch ( SPException $x ) {
			Sobi::Error( 'Payment', SPLang::e( 'CANNOT_GET_PAYMENTS', $x->getMessage() ), SPC::WARNING, 0, __LINE__, __FILE__ );
		}
		return $c;
	}

	/**
	 * @return array
	 */
	public function getMethods( $entry, $data )
	{
		$methods = array();
		Sobi::Trigger( 'Payment', 'MethodView', array( &$methods, $entry, &$data ) );
		return $methods;
	}

	/**
	 * @param double $amount
	 * @param string $reference
	 * @param int $sid
	 * @return void
	 */
	public function addDiscount( $amount, $reference, $sid = 0 )
	{
		$this->discounts[ $sid ][ ] = array( 'reference' => $reference, 'amount' => $amount );
	}

	public static function currency( $value )
	{
		return SPLang::currency( $value );
	}

	public static function percent( $value )
	{
		return str_replace( array( '%number', '%sign' ), array( $value, '%' ), Sobi::Cfg( 'payments.percent_format', '%number%sign' ) );
	}

	public function deletePayments( $sid )
	{
		SPFactory::db()
				->delete( 'spdb_payments', array( 'sid' => $sid ) )
				->delete( 'spdb_payments', array( 'sid' => ( $sid * -1 ) ) );
	}
}
