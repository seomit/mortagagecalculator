<?php 
/*
Plugin Name: Mortgage Calculator
Plugin URI: https://urjasoft.com/
Description: Mortgage Calculator Plugin to estimate the repayments with term/amount graph
Version: 1.0
Author: Sumit Kumar
Author URI: https://the-sumit.com
Text Domain: mortgage-calculator
@package mortgage-calculator
Copyright 2019 Urjasoft.
*/
function prefix_enqueue() 
{       
    // JS
	wp_register_script('prefix_highcharts_js', plugins_url().'/mortgage-calculator/js/highcharts.js');
    wp_enqueue_script('prefix_highcharts_js');
	wp_register_script('prefix_mcalc_js', plugins_url().'/mortgage-calculator/js/mcalc.js?v='.time());
    wp_enqueue_script('prefix_mcalc_js');

    // CSS
    wp_register_style('prefix_custom_css', plugins_url().'/mortgage-calculator/css/mcalc.css?v='.time());
    wp_enqueue_style('prefix_custom_css');
	
}
function calculator_model(){
ob_start();
prefix_enqueue();
?>
		<div style="width:100%">
			<div class="loanRow first-section">
				<div class="col-4">
					I would like to borrow<br/>
					<input id="loan_amount" class="form_field dollarInput" type="text" /><br/>
					<span id="errAmount" class="loanErr" ></span>
				</div>
				<div class="col-4">
					Over<br/>
					<input id="loan_term" type="text" class="form_field" maxlength="2" /> &nbsp;&nbsp;years<br/>
					<span id="errTerm" class="loanErr" ></span>
				</div>
				<div class="col-4" style="display: none;">
					Repayment Type<br/>
					<select id="repay_type" class="form_field" >
						<option value="p+i">Principal and interest</option>
					</select>
				</div>
				<div class="col-4">
					With an interest rate of<br/>
					<input id="loan_rate" type="text" class="form_field percentInput" /> %<br/>
					<span id="errRate" class="loanErr" ></span>
				</div>
				<div class="col-4" style="display:none">
					<div class="repay_feq_div">
						At Repayment frequency<br/>
						<select id="repay_freq" class="form_field">
							<option value="monthly" selected>Monthly</option>
							<option value="fortnightly">Fortnightly</option>
							<option value="weekly">Weekly</option>
						</select>
					</div>
				</div>
			</div>
		</div>
		
		<div class="loanRow second-section">
			<div class="col-12">
				<h2 id="h2-message">Your principal and interest repayments would be $<span id="installment">0.00</span> per <span id="interval">month</span>.</h2>
			</div>
			<div class="col-12">
				<h4 id="extraPaymentMsg" style="font-weight: 100;margin-top:0;"></h4>
			</div>
		</div>
		
		<div class="loanRow third-section">
			<div class="col-8">
				<div id="loanChart"></div>
			</div>
			<div class="col-4 third-section-2">
				<div class="col-12">
					<h5>Total loan repayments</h5>
					<h2 id="totalRepay">$0.00</h2>
				</div>
				<div class="col-12">
					<h5>Total interest charged</h5>
					<h2 id="totalInterest">$0.00</h2>
				</div>
				<div class="col-6 extra_pay_div">
					Monthly Extra Payment<br/>
					<input type="text" class="form_field dollarInput"  id="extra_payment" />
				</div>
			</div>
		</div>
<?php
return ob_get_clean();
}

add_shortcode( 'mortgage-calculator', 'calculator_model' );


?>