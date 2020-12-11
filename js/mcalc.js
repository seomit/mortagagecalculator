var factor = 1;
		var interval = "month";
		
		
		function startCalculation(){
			debugger;
			var amount = jQuery('#loan_amount').val();
			var term = jQuery('#loan_term').val();
			var type = jQuery('#repay_type').val();
			var rate = jQuery('#loan_rate').val();
			var extraPayment = jQuery('#extra_payment').val();
			var freq = jQuery('#repay_freq').val();
			
			
			if(freq == 'monthly'){
				factor = 12;
				interval = "month";
			}else if(freq == 'fortnightly'){
				factor = 26;
				interval = "fortnight";
			}else if(freq == 'weekly'){
				factor = 52;
				interval = "week";
			}
			
			if(extraPayment == null || extraPayment ==""){
				extraPayment = 0;
			}
			
			if(validateFields(amount,term,rate)){
				calculateLoan(amount,term,type,rate,extraPayment);
			}
		}
		
		function validateFields(amount,term,rate){
			var validFlag = true;
			jQuery('#errAmount').text("");
			jQuery('#errTerm').text("");
			jQuery('#errRate').text("");
			if(amount=="" || amount == "0"){
				jQuery('#errAmount').text("Please enter amount.");
				validFlag = false;
			}
			else if(isNaN(amount)){
				jQuery('#errAmount').text("Please enter valid number.");
				validFlag = false;
			}
			
			if(term=="" || term == "0"){
				jQuery('#errTerm').text("Please enter term.");
				validFlag = false;
			}
			else if(isNaN(term)){
				jQuery('#errTerm').text("Please enter valid term.");
				validFlag = false;
			}
			
			if(term=="" || term == "0"){
				jQuery('#errRate').text("Please enter rate.");
				validFlag = false;
			}
			else if(isNaN(term)){
				jQuery('#errRate').text("Please enter valid rate.");
				validFlag = false;
			}
			
			return validFlag;
			
		}
		
		function calculateLoan(amount,term,type,rate,extraPayment){
			
			var loanStartMonth = 0;
			var colorFiller = 0;
			var newTerm = term;
			var adjustedTerm = term;
			var oldMonthlyPayment = 0;
			var oldTerm = term;
			var extraInterest = 0;
			var total_repay = 0;
			var old_total_repay = 0;
			var monthly_payment = 0;
			var total_interest = 0;
			var old_total_interest = 0;
			var installment = 0;
			
			if(type == 'p+i'){
				loanStartMonth = 0;
				colorFiller = 0;
				newTerm = newTerm;
				extraInterest = 0;
			}else if(type == 'i1'){
				loanStartMonth = 12;
				colorFiller = 1;
				newTerm = newTerm-1;
				extraInterest = amount*(rate/100)*1;
			}
			else if(type == 'i2'){
				loanStartMonth = 24;
				colorFiller = 2;
				newTerm = newTerm-2;
				extraInterest = amount*(rate/100)*2;
			}
			else if(type == 'i3'){
				loanStartMonth = 36;
				colorFiller = 3;
				newTerm = newTerm-3;
				extraInterest = amount*(rate/100)*3;
			}
			else if(type == 'i4'){
				loanStartMonth = 48;
				colorFiller = 4;
				newTerm = newTerm-4;
				extraInterest = amount*(rate/100)*4;
			}
			else if(type == 'i5'){
				loanStartMonth = 60;
				colorFiller = 5;
				newTerm = newTerm-5;
				extraInterest = amount*(rate/100)*5;
			}
			
			
			
			
			var monthly_interest_rate = rate/(100*factor);
			
			if(extraPayment!=0){
				monthly_payment = (amount*monthly_interest_rate*Math.pow((1+monthly_interest_rate),newTerm*factor))/(Math.pow((1+monthly_interest_rate),(newTerm*factor))-1);
				oldMonthlyPayment = monthly_payment;
				oldTerm = term;
				
				monthly_payment += parseInt(extraPayment);
				adjustedTerm = (Math.log(monthly_payment)-Math.log(monthly_payment-(parseFloat(amount)*monthly_interest_rate)))/Math.log(1+monthly_interest_rate);
				adjustedTerm = adjustedTerm/factor;
				old_total_repay = oldMonthlyPayment*factor*newTerm;
				total_repay = monthly_payment*factor*adjustedTerm;
				total_interest = total_repay-(amount)+extraInterest;
				old_total_interest = old_total_repay-(amount)+extraInterest;
				
				total_repay += extraInterest;
				old_total_repay += extraInterest;
				
				installment = addCommasFormat(monthly_payment.toFixed(2));
				old_installment = addCommasFormat(oldMonthlyPayment.toFixed(2));
				
				jQuery('#totalRepay').html("$"+addCommasFormat(total_repay.toFixed(2)));
				jQuery('#totalInterest').html("$"+addCommasFormat(total_interest.toFixed(2)));
				
				var currentYear = new Date().getFullYear();
				var old_currentYear = new Date().getFullYear();
				var lastYear = parseInt(new Date().getFullYear() + parseInt(adjustedTerm));
				var old_lastYear = parseInt(new Date().getFullYear() + parseInt(oldTerm));
				var currMonth = 0;
				var old_currMonth = 0;
				var totalMonth = parseFloat(Math.ceil(adjustedTerm))*factor;
				var old_totalMonth = parseFloat(Math.ceil(term))*factor;
				var yearCount = 0;
				var old_yearCount = 0;
				
				var remaining_balance = parseFloat(amount);
				var old_remaining_balance = parseFloat(amount);
				
				var seriesData = new Array();
				var old_seriesData = new Array();
				var markerParam = {symbol: 'circle'};
				
				var newYear = yearsToYearsMonthsDays(adjustedTerm);
				
				if(type == 'p+i'){
					jQuery('#h2-message').html("Your principal and interest repayments would be $"+installment+" per "+interval+".<br/><small>(Including extra repayments of $"+addCommasFormat(parseFloat(extraPayment).toFixed(2))+")</small>");
					jQuery('#extraPaymentMsg').html("By making monthly extra repayments you could save up to <b>$"+addCommasFormat((old_total_repay-total_repay).toFixed(2))+"</b> in interest and pay off your loan in <b>"+newYear+"</b>.");
				}
				else{
					jQuery('#h2-message').html("Your approximate interest only payments would be $"+addCommasFormat((((amount*(rate/100))/factor)+parseFloat(extraPayment)).toFixed(2))+" per "+interval+".<br/><small>Once the interest only period ends, your repayments will be $"+installment+" per "+interval+", based on the current rate - which may change.</small>");
				}
				
				seriesData.push({name:currentYear.toString(), marker: markerParam, y: remaining_balance});
				
				while(currMonth < totalMonth){
					
					if((currMonth-2)%factor == 0 && currMonth !=2 ){
						yearCount++;
						if((parseInt(adjustedTerm)-yearCount)%5==0){
							markerParam = { enabled: true, symbol: 'circle' };
						}else{
							markerParam = { enabled: false };
						}
						currentYear++;
						seriesData.push({name:currentYear.toString(), marker: markerParam, y: remaining_balance});
						
						if(remaining_balance<=0){
							break;
						}
					}
					var interest_paid = remaining_balance*monthly_interest_rate;
					var principal_paid = monthly_payment-interest_paid;
					if(currMonth>loanStartMonth){
						remaining_balance = remaining_balance-principal_paid;
					}else{
						// remaining_balance = remaining_balance-extraPayment;
					}
					if(remaining_balance < 0){
						remaining_balance = 0;
					}
					currMonth++;
					if(currMonth == totalMonth ){
						currentYear++;
						seriesData.push({name:currentYear.toString(), marker: { enabled: true,symbol: 'circle' }, y: remaining_balance});
						if(remaining_balance<=0){
							break;
						}
					}
				}
				
				old_seriesData.push({name:old_currentYear.toString(), marker: markerParam, y: old_remaining_balance});
				
				while(old_currMonth < old_totalMonth){
					
					if((old_currMonth-2)%factor == 0 && old_currMonth !=2 ){
						old_yearCount++;
						if((parseInt(term)-old_yearCount)%5==0){
							markerParam = { enabled: false };
						}else{
							markerParam = { enabled: false };
						}
						old_currentYear++;
						old_seriesData.push({name:old_currentYear.toString(), marker: markerParam, y: old_remaining_balance});
						
						if(old_remaining_balance<=0){
							break;
						}
					}
					var interest_paid = old_remaining_balance*monthly_interest_rate;
					var principal_paid = oldMonthlyPayment-interest_paid;
					if(old_currMonth>loanStartMonth){
						old_remaining_balance = old_remaining_balance-principal_paid;
					}
					if(old_remaining_balance < 0){
						old_remaining_balance = 0;
					}
					old_currMonth++;
					if(old_currMonth == old_totalMonth ){
						old_currentYear++;
						old_seriesData.push({name:old_currentYear.toString(), marker: { enabled: true }, y: old_remaining_balance});
						if(old_remaining_balance<=0){
							break;
						}
					}
				}
				
				
				jQuery('#loanChart').highcharts({
					chart: {
						type: 'areaspline',
						marginTop: 0,
						height: 300
					},
					title: {
						text: null
					},
					
					credits: {
						enabled: false
					},
					tooltip: {
						useHTML: true,
						formatter: function () {
							
							if(this.color == 'grey'){
								// if(term==this.point.x){
									// return '<div style="width:300px;padding-left:40px;"><div style="float:left;width:50%"><h5 style="line-height: 1em !important;margin-bottom: 2px !important;font-size:13px !important;">Principal remaining</h5><h3 style="line-height: 1em;margin-bottom: 2px; margin-top:0;">'+addCommasFormat((0).toFixed(2))+'</h3></div><div style="float:right;width:50%"><h5 style="line-height: 1em;margin-bottom: 2px;font-size:13px;">Years remaining</h5><h3 style="line-height: 1em;margin-bottom: 2px; margin-top:0;">'+(parseInt(term)-parseInt(this.point.x))+'</h3></div></div><div style="float:left;width:100%;padding-left: 40px;"><h5 style="line-height: 1em;margin-bottom: 2px;font-size:13px;">Rate</h5><h3 style="line-height: 1em;margin-bottom: 2px; margin-top:0;">'+rate+'%</h3></div>';
								// }else{
									// return '<div style="width:300px;padding-left:40px;"><div style="float:left;width:50%"><h5 style="line-height: 1em !important;margin-bottom: 2px !important;font-size:13px !important;">Principal remaining</h5><h3 style="line-height: 1em;margin-bottom: 2px; margin-top:0;">'+addCommasFormat(this.point.y.toFixed(2))+'</h3></div><div style="float:right;width:50%"><h5 style="line-height: 1em;margin-bottom: 2px;font-size:13px;">Years remaining</h5><h3 style="line-height: 1em;margin-bottom: 2px; margin-top:0;">'+(parseInt(term)-parseInt(this.point.x))+'</h3></div></div><div style="float:left;width:100%;padding-left: 40px;"><h5 style="line-height: 1em;margin-bottom: 2px;font-size:13px;">Rate</h5><h3 style="line-height: 1em;margin-bottom: 2px; margin-top:0;">'+rate+'%</h3></div>';
								// }
								return false ;
							}else{
								// if(adjustedTerm==this.point.x){
									// return '<div style="width:300px;padding-left:40px;"><div style="float:left;width:50%"><h5 style="line-height: 1em !important;margin-bottom: 2px !important;font-size:13px; !important">Principal remaining</h5><h3 style="line-height: 1em;margin-bottom: 2px; margin-top:0;">'+addCommasFormat((0).toFixed(2))+'</h3></div><div style="float:right;width:50%"><h5 style="line-height: 1em;margin-bottom: 2px;font-size:13px;">Years remaining</h5><h3 style="line-height: 1em;margin-bottom: 2px; margin-top:0;">'+(parseInt(adjustedTerm)-parseInt(this.point.x))+'</h3></div></div><div style="float:left;width:100%;padding-left: 40px;"><h5 style="line-height: 1em;margin-bottom: 2px;font-size:13px;">Rate</h5><h3 style="line-height: 1em;margin-bottom: 2px; margin-top:0;">'+rate+'%</h3></div>';
								// }else{
									return '<div class="chart-tooltip" style="width:300px;"><div style="float:left;width:50%"><h5 style="line-height: 1em !important;margin-bottom: 2px !important;font-size:13px !important;">Principal remaining</h5><h3 style="line-height: 1em !important;margin-bottom: 2px !important; margin-top:0 !important; font-size: 18px !important;">'+addCommasFormat(this.point.y.toFixed(2))+'</h3></div><div style="float:right;width:50%"><h5 style="line-height: 1em !important;margin-bottom: 2px !important;font-size:13px !important;">Years remaining</h5><h3 style="line-height: 1em !important;margin-bottom: 2px !important; margin-top:0 !important; font-size: 18px !important;">'+(Math.ceil(parseFloat(adjustedTerm))-parseInt(this.point.x))+'</h3></div></div><div class="chart-tooltip" style="float:left;width:100%;"><h5 style="line-height: 1em !important;margin-bottom: 2px !important;font-size:13px !important;">Rate</h5><h3 style="line-height: 1em !important;margin-bottom: 2px !important; margin-top:0 !important; font-size: 18px !important;">'+rate+'%</h3></div>';
								// }
							}
							
							
						}
					},
					yAxis: {
						labels: {
							enabled: false
						},
						title: {
							text: 'Loan Amount'
						},
						gridLineWidth: 0
					},
					xAxis: {
						tickInterval: 5,
						labels: {
							enabled: true,
							formatter: function() { 
								if (this.isLast ) {
									return parseInt(old_seriesData[this.value].name)-parseInt(old_seriesData[0].name)+"<br/>years";
								 }
								 else if (this.isFirst) {
									return "Today";
								 }else{
									 return parseInt(old_seriesData[this.value].name)-parseInt(old_seriesData[0].name)+"<br/>years";
								 }
							},
						},
						// tickLength: 0,
						lineWidth: 2,
						title: {
							text: 'Loan Term'
						},
					},
					legend: {
						enabled: false
					},

					plotOptions: {
						series: {
							color: '#0053af',
							fillColor: '#ffffff',
							fillOpacity: 0.4,
							marker: {
								fillColor: '#FFFFFF',
								lineWidth: 2,
								lineColor: null // inherit from series
							}
							
						}
					},

					series: [{
						data: old_seriesData,color:'grey',fillOpacity:0.1
					},{
						data: seriesData,
						zoneAxis: 'x',
						zones: [{value: colorFiller, fillColor: '#0053af',fillOpacity: 0.4}, {value: colorFiller+1, fillColor: '#ffffff'}]
					}],

					responsive: {
						rules: [{
							condition: {
								maxWidth: 1600
							},
							chartOptions: {
								legend: {
									layout: 'horizontal',
									align: 'center',
									verticalAlign: 'bottom'
								},
								 xAxis: {
									labels: {
									  // step: parseInt(term)
									}
								 }
							}
						},{
							condition: {
								maxWidth: 500
							},
							chartOptions: {
								legend: {
									layout: 'horizontal',
									align: 'center',
									verticalAlign: 'bottom'
								},
								 xAxis: {
									labels: {
									  // step: parseInt(term)
									}
								 }
							}
						}]
					}

				}, function(chart) { // on complete
						
						chart.renderer.text('$'+addCommasFormat(parseFloat(amount).toFixed(2)), 10, 40,true)
							.css({
							 'marginTop':'15px'
							})
							.add();
						
					});
				
				
			}
			else{
			
				
				monthly_payment = (amount*monthly_interest_rate*Math.pow((1+monthly_interest_rate),newTerm*factor))/(Math.pow((1+monthly_interest_rate),(newTerm*factor))-1);
				
				total_repay = monthly_payment*factor*newTerm;
				total_interest = total_repay-(amount)+extraInterest;
				total_repay += extraInterest;
				
				installment = addCommasFormat(monthly_payment.toFixed(2));
				jQuery('#totalRepay').html("$"+addCommasFormat(total_repay.toFixed(2)));
				jQuery('#totalInterest').html("$"+addCommasFormat(total_interest.toFixed(2)));
				
				
				var currentYear = new Date().getFullYear();
				var lastYear = parseInt(new Date().getFullYear() + parseInt(term));
				var currMonth = 0;
				var totalMonth = parseInt(Math.ceil(term))*factor;
				var yearCount = 0;
				
				var remaining_balance = parseFloat(amount);
				
				var seriesData = new Array();
				var markerParam = {};
				
				if(type == 'p+i'){
					jQuery('#h2-message').html("Your principal and interest repayments would be $"+installment+" per "+interval+".");
					jQuery('#extraPaymentMsg').html("")
				}
				else{
					jQuery('#h2-message').html("Your approximate interest only payments would be $"+addCommasFormat(((amount*(rate/100))/factor).toFixed(2))+" per "+interval+".<br/><small>Once the interest only period ends, your repayments will be $"+installment+" per "+interval+", based on the current rate - which may change.</small>");
				}
				
				seriesData.push({name:currentYear.toString(), marker: markerParam, y: remaining_balance});
				
				while(currMonth < totalMonth){
					
					if((currMonth-2)%factor == 0 && currMonth !=2 ){
						yearCount++;
						if((parseInt(term)-yearCount)%5==0){
							markerParam = { enabled: true };
						}else{
							markerParam = { enabled: false };
						}
						currentYear++;
						seriesData.push({name:currentYear.toString(), marker: markerParam, y: remaining_balance});
						
						if(remaining_balance<=0){
							break;
						}
					}
					var interest_paid = remaining_balance*monthly_interest_rate;
					var principal_paid = monthly_payment-interest_paid;
					if(currMonth>loanStartMonth){
						remaining_balance = remaining_balance-principal_paid;
					}
					if(remaining_balance < 0){
						remaining_balance = 0;
					}
					currMonth++;
					if(currMonth == totalMonth ){
						currentYear++;
						seriesData.push({name:currentYear.toString(), marker: { enabled: true }, y: remaining_balance});
						if(remaining_balance<=0){
							break;
						}
					}
				}
				
				
				jQuery('#loanChart').highcharts({
					chart: {
						type: 'areaspline',
						marginTop: 0,
						height: 300
					},
					title: {
						text: null
					},
					
					credits: {
						enabled: false
					},
					tooltip: {
						useHTML: true,
						formatter: function () {
							
							if(term==this.point.x){
								return '<div class="chart-tooltip" style="width:300px;"><div style="float:left;width:50%"><h5 style="line-height: 1em !important;margin-bottom: 2px !important;font-size:13px !important;">Principal remaining</h5><h3 style="line-height: 1em !important;margin-bottom: 2px !important; margin-top:0 !important; font-size: 18px !important;">$'+addCommasFormat((0).toFixed(2))+'</h3></div><div style="float:right;width:50%"><h5 style="line-height: 1em !important;margin-bottom: 2px !important;font-size:13px !important;">Years remaining</h5><h3 style="line-height: 1em !important;margin-bottom: 2px !important; margin-top:0 !important; font-size: 18px !important;">'+(parseInt(term)-parseInt(this.point.x))+'</h3></div></div><div class="chart-tooltip" style="float:left;width:100%;"><h5 style="line-height: 1em !important;margin-bottom: 2px !important;font-size:13px !important;">Rate</h5><h3 style="line-height: 1em !important;margin-bottom: 2px !important; margin-top:0 !important; font-size: 18px !important;">'+rate+'%</h3></div>';
							}else{
								return '<div class="chart-tooltip" style="width:300px;"><div style="float:left;width:50%"><h5 style="line-height: 1em !important;margin-bottom: 2px !important;font-size:13px !important;">Principal remaining</h5><h3 style="line-height: 1em !important;margin-bottom: 2px !important; margin-top:0 !important; font-size: 18px !important;">$'+addCommasFormat(this.point.y.toFixed(2))+'</h3></div><div style="float:right;width:50%"><h5 style="line-height: 1em !important;margin-bottom: 2px !important;font-size:13px !important;">Years remaining</h5><h3 style="line-height: 1em !important;margin-bottom: 2px !important; margin-top:0 !important; font-size: 18px !important;">'+(parseInt(term)-parseInt(this.point.x))+'</h3></div></div><div class="chart-tooltip" style="float:left;width:100%;"><h5 style="line-height: 1em !important;margin-bottom: 2px !important;font-size:13px !important;">Rate</h5><h3 style="line-height: 1em !important;margin-bottom: 2px !important; margin-top:0 !important; font-size: 18px !important;">'+rate+'%</h3></div>';
							}
						}
					},
					yAxis: {
						labels: {
							enabled: false
						},
						title: {
							text: 'Loan Amount'
						},
						gridLineWidth: 0
					},
					xAxis: {
						tickInterval: 5,
						labels: {
							enabled: true,
							formatter: function() { 
								if (this.isLast ) {
									return parseInt(seriesData[this.value].name)-parseInt(seriesData[0].name)+"<br/>years";
								 }
								 else if (this.isFirst) {
									return "Today";
								 }else{
									 return parseInt(seriesData[this.value].name)-parseInt(seriesData[0].name)+"<br/>years";
								 }
							},
						},
						// tickLength: 0,
						lineWidth: 2,
						title: {
							text: 'Loan Term'
						},
					},
					legend: {
						enabled: false
					},

					plotOptions: {
						series: {
							color: '#0053af',
							fillColor: '#ffffff',
							fillOpacity: 0.4,
							marker: {
								fillColor: '#FFFFFF',
								lineWidth: 2,
								lineColor: null // inherit from series
							}
							
						}
					},

					series: [{
						data: seriesData,
						zoneAxis: 'x',
						zones: [{value: colorFiller, fillColor: '#0053af',fillOpacity: 0.4}, {value: colorFiller+1, fillColor: '#ffffff'}]
					}],

					responsive: {
						rules: [{
							condition: {
								maxWidth: 1600
							},
							chartOptions: {
								legend: {
									layout: 'horizontal',
									align: 'center',
									verticalAlign: 'bottom'
								},
								 xAxis: {
									labels: {
									  // step: parseInt(term)
									}
								 }
							}
						},{
							condition: {
								maxWidth: 500
							},
							chartOptions: {
								legend: {
									layout: 'horizontal',
									align: 'center',
									verticalAlign: 'bottom'
								},
								 xAxis: {
									labels: {
									  // step: parseInt(term)
									}
								 }
							}
						}]
					}

				}, function(chart) { // on complete
						
						chart.renderer.text('$'+addCommasFormat(parseFloat(amount).toFixed(2)), 10, 40,true)
							.css({
                                'marginTop':'15px'
							})
							.add();
						
					});
			}
			
			
		}
		
		
		function addCommasFormat(nStr) {
		  nStr += '';
		  
		  var x = Math.ceil(parseFloat(nStr));
		  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		  // var x = nStr.split('.');

		  // var x1 = x[0];
		  // var x2 = x.length > 1 ? '.' + x[1] : '';
		  var rgx = /(\d+)(\d{3})/;
		  while (rgx.test(x1)) {
			  x1 = x1.replace(rgx, '$1' + ',' + '$2');
		  }
		  // return x1 + ""+x2+"";
		}
		
		function yearsToYearsMonthsDays(value)
		{
			var totalDays = value * 365;
			var years = Math.floor(totalDays/365);
			var months = Math.ceil((totalDays-(years *365))/30);
			if(months == 12){
				years++;
				months = 0;
			}
			// var days = Math.floor(totalDays - (years*365) - (months * 30));
			var result = years + " years and " + months + " months";
			return result;
		}
		
		
		jQuery(document).ready(function(){
			jQuery('#loan_amount').val("300000");
			jQuery('#loan_term').val("30");
			jQuery('#repay_type').val("p+i");
			jQuery('#loan_rate').val("6");
			jQuery('#extra_payment').val("0");
			
			startCalculation();
			jQuery('.form_field').on('keyup change',function(){
			debugger;
			startCalculation();
			
		});
			
		});
