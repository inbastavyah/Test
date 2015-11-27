// index js 
$(document).on('pagecontainershow', function(e, ui) {
	$('#addLogTimeForm').validate({
 	    rules: {
 	    	fullname: {
 	            required: true
 	        },
 	        elecconnno: {
 	            required: true
 	        },
 	        aadharno: {
 	            required: true
 	        },
 	        taluka: {
 	            required: true
 	        },   
 	        pincode: {
 	            required: true
 	        }, 
 	        
 	        district: {
 	            required: true
 	        }, 
 	        mobile: {
 	            required: true
 	        }, 
 	        spouse: {
 	            required: true
 	        }, 
 	        noOfChildren: {
 	            required: true
 	        }, 
 	        gender: {
 	            required: true
 	        }, 
 	        age: {
 	            required: true
 	        },  
 	        qualification: {
 	            required: true
 	        }, 
 	        noOfLedIssued: {
 	            required: true
 	        }, 
 	        recieptNumber: {
 	            required: true
 	        },
 	    },
 	   /* messages: {
 	    	fullname: {
 	            required: "Please enter your first name."
 	        },
 	        elecconnno: {
 	            required: "Please enter your last name."
 	        },    	        
 	    },*/
 	    errorPlacement: function (error, element) {
 	        error.appendTo(element.parent().prev());
 	    },
 	    submitHandler: function (form) {
 	        $(':mobile-pagecontainer').pagecontainer('change', '#success', {
 	            reload: false
 	        });
 	        return false;
 	    }
 	});
	
	$("#addLogTimeForm").on("submit",submitData);
});

$( document ).on( "mobileinit", function() {
    // Make your jQuery Mobile framework configuration changes here!
	 $.support.cors = true;
     $.mobile.allowCrossDomainPages = true;
     
     jQuery.mobile.phonegapNavigationEnabled = true;
     jQuery.mobile.defaultDialogTransition = "pop";
     jQuery.mobile.defaultPageTransition = "none";
      
     jQuery.mobile.loader.prototype.options.text = "loading";
     jQuery.mobile.loader.prototype.options.textVisible = true;
     jQuery.mobile.loader.prototype.options.theme = "a";
});

var appUrl='http://192.168.1.11:8080/';
var appRequiresWiFi='This action requires internet.';
var serverBusyMsg='Server is busy, please try again later.';
var db;

var app = {
    SOME_CONSTANTS : false,  // some constant
    // Application Constructor
    initialize: function() {
        //console.log("console log init");
        this.bindEvents();
        this.initFastClick();
    },
    // Bind Event Listeners
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    initFastClick : function() {
        window.addEventListener('load', function() {
            FastClick.attach(document.body);
        }, false);
    },
    // Phonegap is now ready...
    onDeviceReady: function() {
        //console.log("device ready, start making you custom calls!");
        document.addEventListener("backbutton", onBackKeyDown, false);
        // Start adding your code here....
		//app.receivedEvent('deviceready');
		
		//db = window.sqlitePlugin.openDatabase("Database", "1.0", "BPMETR", 200000);
		db = window.sqlitePlugin.openDatabase({name: "bpmetr.db", location: 2});
		db.transaction(initializeDB, errorCB, successCB);
		//db.transaction(insertBaseappData, errorCB, successCB);
		
        checkPreAuth();
		$("#loginForm").on("submit",handleLogin);
		
		//start a timer & execute a function every 30 seconds and then reset the timer at the end of 30 seconds.
		/*
		$('#syncCallTimerDiv').timer({
		    duration: '900s',
		    callback: function() {
		        checkConnectionForSync();
		        $('#syncCallTimerDiv').timer('reset');
		    },
		    repeat: true //repeatedly call the callback
		});
		*/
		//setInterval(checkConnectionForSync, 900000);
    },
	// Update DOM on a Received Event
    receivedEvent: function(id) {
		
    }
};

function checkConnectionForSync() {
	var connectionType=checkConnection();
	if(connectionType=="WiFi connection" || connectionType=="Cell 4G connection" || connectionType=="Cell 3G connection" || connectionType=="Cell 2G connection"){
		callSyncWithServer();
	}
}

var successTimeTrackerIdArr=[];

function callSyncWithServer() {
	//alert("callSyncWithServer..");
	db.transaction
	  (
	       function (tx){
	    	   // soTimeId,date,time,crewSize,grnStaffTimeId,timecat,comment,localStatus
	            tx.executeSql('SELECT id, fullname, elecconnno, aadharno, address, taluka, district, pincode, mobile, spouse, noOfChildren,gender, age, qualification, noOfLedIssued, recieptNumber,optedForMonthlyPayment,myImage FROM BASEAPP',[],function(tx,results){
	                    var len = results.rows.length;
	                    alert(" BASEAPP table length...."+len);
	                    if(len>0){
	                        for (var i = 0; i < len; i++) {
	                            alert(results.rows.item(i)['id']);
	                        	//if(results.rows.item(i)['localStatus']=='complete'){
	                        		//alert("id"+results.rows.item(i)['id']);
	                        		//var currid=results.rows.item(i)['id'];
	                        		var dataObj={};
	                        		//dataObj.action='addLogTime';
	                        		//dataObj.grn_user=grnUserObj;
	                        		dataObj.id= results.rows.item(i)['id'];
	                        		dataObj.fullname= results.rows.item(i)['fullname'];
	                        		dataObj.elecconnno= results.rows.item(i)['elecconnno'];
	                        		dataObj.aadharno= results.rows.item(i)['aadharno'];
	                        		dataObj.address= results.rows.item(i)['address'];
	                        		dataObj.taluka= results.rows.item(i)['taluka'];
	                        		dataObj.district= results.rows.item(i)['district'];
	                        		dataObj.pincode= results.rows.item(i)['pincode'];
	                        		dataObj.mobile= results.rows.item(i)['mobile'];
	                        		dataObj.spouse= results.rows.item(i)['spouse'];
	                        		dataObj.noOfChildren= results.rows.item(i)['noOfChildren'];
	                        		dataObj.gender= results.rows.item(i)['gender'];
	                        		dataObj.age= results.rows.item(i)['age'];
	                        		dataObj.qualification= results.rows.item(i)['qualification'];
	                        		dataObj.noOfLedIssued= results.rows.item(i)['noOfLedIssued'];
	                        		dataObj.recieptNumber= results.rows.item(i)['recieptNumber'];
	                        		dataObj.optedForMonthlyPayment= results.rows.item(i)['optedForMonthlyPayment'];
	                        		dataObj.myImage= results.rows.item(i)['myImage'];
	                        		
	                        		 saveDataToServer(dataObj);
	                        		/*var response = saveDataToServer(dataObj);
	                        		if(response){
	                        			//alert("saveLogTime response ----"+response);
	                        			//successTimeTrackerIdArr.push(currid);
	                        		}
	                        		else{
	                        			
	                        		}*/
	                        	//}
	                        	//alert(results.rows.item(i)['localStatus']+"---"+results.rows.item(i)['time']);
	                            //$('#resultList').append('<li><a href="#">' + results.rows.item(i)['localStatus']+"--"+ results.rows.item(i)['time'] + '</a></li>');
	                        }
	                        //$('#resultList').listview();
	                        //alert(" before successTimeTrackerIdArr.."+successTimeTrackerIdArr);
	                    }
	                }, errorCB
	            );
	       },errorCB, successCB 
	   );
	
	/*jQuery.each(successTimeTrackerIdArr, function(index,value) {
		deleteTimeTrackerRow(value);
	});	*/
	//alert("after successTimeTrackerIdArr.."+successTimeTrackerIdArr);
	
	//window.localStorage["solocal"] = 0;
	//window.localStorage["tclocal"] = 0;
	//window.localStorage["ttsync"] = 1;
}
//saveDataToServer
function saveDataToServer(dataObj){
	alert("dataObj.id..." +dataObj.id);
		if(dataObj.id > 0){
			deleteDataFromServer(dataObj.id);
		}
}
// end of saveDataToServer

function deleteDataFromServer(id){
  if(id > 0){
	  //alert("deleteDataFromServer.id...");
	db.transaction
	  (
	       function (tx){
	            tx.executeSql
	            (
	                'DELETE FROM BASEAPP WHERE id=?',[id], successCB
	            );
	       }, successCB, errorCB
	   );
	}
	else{
		  
	}

}


//Query the success callback
function successSyncCall(tx,results) {
	var len = results.rows.length;
	//alert("successSyncCall: " + len + " rows found.");
	for (var i=0; i<len; i++){
		//alert("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
		//console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
		//alert(results.rows.item(i)['time']+"--"+results.rows.item(i)['localStatus']);
		//$('#resultList').append('<li><a href="#">' + results.rows.item(i)['localStatus'] + '--' +results.rows.item(i)['time']+'</a></li>');
	}
	 //$('#resultList').listview();
	// this will be true since it was a select statement and so rowsAffected was 0
	if (!results.rowsAffected) {
		//alert('No rows affected!');
		return false;
	}
	//console.log("Last inserted row ID = " + results.insertId);
}

function onBackKeyDown() {
	if($.mobile.activePage.is('#login-page')){
        showExitDialog();
    }
	else if($.mobile.activePage.is('#home-page')){
        /* 
        Event preventDefault/stopPropagation not required as adding backbutton
         listener itself override the default behaviour. Refer below PhoneGap link.
       */
       //e.preventDefault();
       //navigator.app.exitApp();
       showExitDialog();
   }
	else if($.mobile.activePage.is('#view-all-data')){
       $.mobile.changePage('#home-page','slide');
   }
	else{
		window.history.back();
   }
}

function showExitDialog() {
    navigator.notification.confirm(
            ("Do you want to Exit?"), // message
            alertexit, // callback
            'BP METRICS', // title
            'YES,NO' // buttonName
    );
}

//Call exit function
function alertexit(button){
    if(button=="1" || button==1){
        //device.exitApp();
        navigator.app.exitApp();
    }
}

function doLogout() {
	navigator.notification.alert("Logout requires active internet connection.", function() {});
	var connectionType=checkConnection();
	//var connectionType="Unknown connection";//For Testing
	
	if(connectionType=="Unknown connection" || connectionType=="No network connection"){
		navigator.notification.alert("Logout requires active internet connection.", function() {});
	}
	else if(connectionType=="WiFi connection" || connectionType=="Cell 4G connection" || connectionType=="Cell 3G connection" || connectionType=="Cell 2G connection"){
		showLogoutDialog();
	}
	
}

function showLogoutDialog() {
    navigator.notification.confirm(
            ("Are you sure to Logout?"), // message
            alertlogout, // callback
            'BP METRICS', // title
            'YES,NO' // buttonName
    );
}

//Call logout function
function alertlogout(button){
    if(button=="1" || button==1){
    	logout();
    }
}

function checkConnection() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
    return states[networkState];
}

function checkPreAuth() {
	var form = $("#loginForm");
	if(window.localStorage["username"] != undefined && window.localStorage["password"] != undefined && window.localStorage.getItem("user_logged_in")==1) {
		$("#username", form).val(window.localStorage["username"]);
		$("#password", form).val(window.localStorage["password"]);
		handleLogin();
	}
}

function logout() {
	window.localStorage["password"] = '';
	window.localStorage["user_logged_in"] = 0;
	
	window.localStorage["grnUser"] = '';
	window.localStorage["ID"] = '';
	window.localStorage["grn_companies_id"] = '';
	window.localStorage["nickname"] = '';
	window.localStorage["grn_roles_id"] = '';
	window.localStorage["permissions"] = '';
	
	window.localStorage["email"] = '';
	window.localStorage["datasync"] = 0;
	window.localStorage["solocal"] = 0;
	window.localStorage["tclocal"] = 0;
	window.localStorage["ttsync"] = 0;
	
	var form = $("#loginForm");
	$("#username", form).val(window.localStorage["username"]);
	$.mobile.changePage('#login-page','slide');
}

function handleLogin() {
	//checkConnection();
	//console.log('handle login called');
	var form = $("#loginForm");
	//disable the button so we can't resubmit while we wait
	$("#submitButton",form).attr("disabled","disabled");
	var u = $("#username", form).val();
	var p = $("#password", form).val();
	u='support@dynaread.com';
	p='marbleF16XS';
	
	if(u != '' && p!= '') {
		
		var connectionType=checkConnection();
		//var connectionType="WiFi connection";//For Testing
		if(connectionType=="Unknown connection" || connectionType=="No network connection"){
			
			if(window.localStorage["user_logged_in"] ==1) {
				checkingUserAssignedRoles();
				$.mobile.changePage('#home-page',{ transition: "slideup"});
			}
			else{
				navigator.notification.alert(appRequiresWiFi, function() {});
			}	
		}
		else if(connectionType=="WiFi connection" || connectionType=="Cell 4G connection" || connectionType=="Cell 3G connection" || connectionType=="Cell 2G connection"){
			showModal();
			$.ajax({
				type : 'POST',
			   url:appUrl,
			   data:{action:'userLogin',email:u,password:p,check:'1'},
			   success:function(data,t,f){
				var responseJson=jQuery.parseJSON(data);
				if(responseJson.status == "success" ){
					var grnUser=responseJson.grn_user;
					window.localStorage["username"] = u;
					window.localStorage["password"] = p;
					window.localStorage["user_logged_in"] = 1;
					window.localStorage["grnUser"] = JSON.stringify(grnUser);
					window.localStorage["ID"] = grnUser["ID"];
					window.localStorage["grn_companies_id"] = grnUser["grn_companies_id"];
					window.localStorage["full_name"] = grnUser["full_name"];
					window.localStorage["nickname"] = grnUser["nickname"];
					window.localStorage["grn_roles_id"] = grnUser["grn_roles_id"];
					window.localStorage["permissions"] = grnUser["permissions"];
					window.localStorage["email"] = grnUser["email"];
					
					window.localStorage["trackerValueSave"]=0;
					window.localStorage["solocal"] = 0;
					window.localStorage["tclocal"] = 0;
					window.localStorage["ttsync"] = 0;
					
					//checkConnectionForSync();
					//$.mobile.changePage('#home-page','slide');					
					$.mobile.changePage('#home-page',{ transition: "slideup"});
				}else{
					window.localStorage["password"] = '';
					window.localStorage["user_logged_in"] = 0;
					window.localStorage["trackerValueSave"]=0;
					
					window.localStorage["grnUser"] = '';
					window.localStorage["ID"] = '';
					window.localStorage["grn_companies_id"] = '';
					window.localStorage["nickname"] = '';
					window.localStorage["grn_roles_id"] = '';
					window.localStorage["permissions"] = '';
					
					window.localStorage["email"] = '';
					
					window.localStorage["trackerValueSave"]=0;
					window.localStorage["solocal"] = 0;
					window.localStorage["tclocal"] = 0;
					window.localStorage["ttsync"] = 0;
					
					var form = $("#loginForm");
					$("#username", form).val(window.localStorage["username"]);
					$.mobile.changePage('#login-page','slide');
					
					navigator.notification.alert("Invalid Credentials, please try again", function() {});
				}
				hideModal();
				$('#userFullName').html(window.localStorage.getItem("full_name"));
			   },
			   error:function(data,t,f){
				   hideModal();
				   navigator.notification.alert(appRequiresWiFi, function() {});
				 var responseJson = $.parseJSON(data);
				 //alert(w+' '+t+' '+f);
				 //console.log(data+' '+t+' '+f);
				 if(responseJson.status==404){
					 navigator.notification.alert(appRequiresWiFi, function() {});
				 }
			   }
			});
		}
		else{
			navigator.notification.alert(appRequiresWiFi, function() {});
		}
		$("#submitButton").removeAttr("disabled");
	}
	else{
		navigator.notification.alert("You must enter a username and password", function() {});
		$("#submitButton").removeAttr("disabled");
	}
	return false;
}

//jsonDataObjGlobal 
function getDataList(){
   alert("getDataList");
	var grnUserData={"id":"1","fullname":"1","aadharno":"1"}; // Testing Data
	var getData={"id":window.localStorage.getItem("id"),"fullname":window.localStorage.getItem("fullname"),"aadharno":window.localStorage.getItem("aadharno")};
	var grnUserObj=JSON.stringify(dataObj);
	
	if(grnUserObj != '') {
		var connectionType=checkConnection();
		//var connectionType="WiFi connection";//For Testing
		
		if(connectionType=="Unknown connection" || connectionType=="No network connection"){
			$.mobile.changePage('#view-all-data','slide');
			navigator.notification.alert(appRequiresWiFi, function() {});
		}
		else if(connectionType=="WiFi connection" || connectionType=="Cell 4G connection" || connectionType=="Cell 3G connection" || connectionType=="Cell 2G connection"){
			showModal();
			$.mobile.changePage('#view-all-data','slide');
			navigator.notification.alert(appRequiresWiFi, function() {});
			else if(window.localStorage["solocal"] == 0){
			
				$.ajax({
					type : 'POST',
				   url:appUrl,
				   data:{action:'BASEAPP',id:dataObj},
				   success:function(data){
				   		
				   		var responseJson = $.parseJSON(data);
				   		$('#AllDataMainDiv').html('');
				   		
				   		var tbodyObj='<tbody>';
				   		var time_cats_arr=[];
				   		jQuery.each(time_cats_arr, function(index,value) {
				        	var jsonObj=value;
				        	var id=jsonObj["id"];
				        	var fullname=jsonObj["fullname"];
				        	var title=jsonObj["title"];
				        	var grn_roles_id=jsonObj["grn_roles_id"];
				        	var revision=jsonObj["revision"];
				        	var status=jsonObj["status"];
				        	
				        	tbodyObj+='<tr>'+
						                 '<td class="order-p-icon">'+
						                     '<span class="process-icon cm-10">'+
						                         '<img class="icon-img" src="img/'+timeCats+'.png" id="timer_img_spOrderIdReplace_'+timeCats+'" data-order="spOrderIdReplace" data-timecat="'+timeCats+'" data-action="clock" onclick="logTimer(this);return false;">'+
						                     '</span>'+
						                 '</td>'+
						                 '<td>'+
						                     '<span id="orderId_spOrderIdReplace" class="timer">--:-- hrs</span>'+
						                 '</td>'+
						                 '<td class="order-t-icon">'+
						                     '<a class="timer timer-icon clock" id="timer_spOrderIdReplace_'+timeCats+'" data-icon="flat-time" data-order="spOrderIdReplace" data-timecat="'+timeCats+'" data-action="clock" onclick="logTimer(this);return false;">'+
											 '</a>'+
						                 '</td>'+
						             '</tr>';
				   		});
				   		tbodyObj+='</tbody>';
				   		
				   		salse_orders_arr=responseJson.sales_orders;
				   		jQuery.each(salse_orders_arr, function(index,value) {
				        	var jsonObj=value;
				        	var id=jsonObj["id"];
				        	var grn_companies_id=jsonObj["grn_companies_id"];
				        	var sp_manager=jsonObj["sp_manager"];
				        	var sp_salesorderNumber=jsonObj["sp_salesorderNumber"];
				        	var sp_jobName=jsonObj["sp_jobName"];
				        	var grn_colors_id=jsonObj["grn_colors_id"];
				        	//var time_running_status=jsonObj["time_running_status"];
				        	//var grn_status_id=jsonObj["grn_status_id"];
				        	var HexColor=jsonObj["HexColor"];
				        	//var tbodyObjCurr = tbodyObj.replace("spOrderIdReplace", id);
				        	var tbodyObjCurr = tbodyObj.replace(/spOrderIdReplace/g,id);
				        	
				        	var divObj='<div id="sales-table-div_'+id+'" class="sales-table-div">'+
					                		'<table id="sp_order_'+id+'"  class="order-box ui-table" style="border: 1px solid #EEE8E8;" data-role="table" data-mode="" class="ui-responsive table-stroke sales-table">'+
										     '<thead onclick="showHideTable(this);">'+
										         '<tr>'+
										             '<th class="sp-order " colspan="3" id="sp_order_name_'+id+'">'+
										             		
										             	'<div id="so_details_box" class="so-details-box" style="border-color: #'+HexColor+';">'+
									                    	'<div class="so-color-box" style="background-color: #'+HexColor+';">'+
									                    		'<span style="">&nbsp;</span>'+
									                        '</div>'+
									                        '<div class="so-name-box" >'+
									                        	'<span class="" id="so_name">'+sp_jobName+' #'+sp_salesorderNumber+'</span>'+
									                        	'<a href="#" onclick="getLogTimeListOfOrder(this); return false;" class="process-report pull-right" data-order="'
									                        		+id+'" data-oname="'+sp_jobName+' #'+sp_salesorderNumber+'" data-hexcolor="#'+HexColor+'" >Report'+
												                 '</a>'+
									                        '</div>'+
									                    '</div>'+	
										             '</th>'+
										         '</tr>'+
										     '</thead>'+
										     tbodyObjCurr+
										     '</tbody>'+
										     '<tfoot>'+
										         '<tr>'+
										             '<td colspan="3" class="td-danger">'+
										             	'<a href="#" class="order-close" data-order="'+sp_salesorderNumber+'" data-id="'+id+'" onclick="closeSalesOrder(this)"><span>CLOSE</span></a>'+
										             '</td>'+ 
										         '</tr>'+
										     '</tfoot>'+
										 '</table>'+
									 '</div>';
				        	
				        	$('#salesOrderMainDiv').append(divObj);
				   		});
				   		hideAllTablesData();
				   		hideModal();
				   		
				   		if(salse_orders_arr.length <= 0){
				   			navigator.notification.alert("No sales order to show or try again after sometime.", function() {});	
				   		}
				   		
				   		window.localStorage["solocal"] = 1;
				   		//getSalesOrderList();
				   		$.mobile.changePage('#view-all-data','slide');
					},
					error:function(data,t,f){
						hideModal();
						navigator.notification.alert(appRequiresWiFi, function() {});	
					}
				});
			
			}
		}
		
	}
	else{
		logout();
		navigator.notification.alert("Please login again.", function() {});
	}
}

function showModal(){
  $('body').append("<div class='ui-loader-background'> </div>");
  $.mobile.loading( "show" );
}

function hideModal(){
	 $(".ui-loader-background").remove();
	 $.mobile.loading( "hide" );
}

function showHideTable(thiss){
	var currTableObj = $(thiss).parent();
	currTableObj.find('tbody').toggle();
	currTableObj.find('tfoot').toggle();
}

function  hideAllTablesData(){
	//var allTableObj = $('.sales-table');
	 $('table').find('tbody').hide();
	 $('table').find('tfoot').hide();
}


/** 
 * Convert seconds to hh-mm-ss format.
 * @param {number} totalSeconds - the total seconds to convert to hh- mm-ss
**/
function secondsTohhmm(totalSeconds) {
  var hours   = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
  //var seconds = totalSeconds - (hours * 3600) - (minutes * 60);
  // round seconds
  //seconds = Math.round(seconds * 100) / 100

  var result = (hours < 10 ? "0" + hours : hours);
      result += ":" + (minutes < 10 ? "0" + minutes : minutes);
      //result += ":" + (seconds  < 10 ? "0" + seconds : seconds);
  return result;
}

function insertTestData(){
	db.transaction(insertBaseappData, successCB , errorCB);
}

// for submitData
var jsonDataObjGlobal={};
function submitData(){
	console.log('gdfg');
	
	var validFlag=$('#addLogTimeForm').valid();
	if(validFlag){
		var fullname = document.getElementById('fullname').value;
		var elecconnno = document.getElementById('elecconnno').value;
		var aadharno = document.getElementById('aadharno').value;
		var address = document.getElementById('address').value;
		var taluka = document.getElementById('taluka').value;
		var district = document.getElementById('district').value;
		var pincode = document.getElementById('pincode').value;
		var mobile = document.getElementById('mobile').value;
		var spouse = document.getElementById('spouse').value;
		var noOfChildren = document.getElementById('noOfChildren').value;
		var gender = document.getElementById('gender').value;
		var age = document.getElementById('age').value;
		var qualification = document.getElementById('qualification').value;
		var noOfLedIssued = document.getElementById('noOfLedIssued').value;
		var recieptNumber = document.getElementById('recieptNumber').value;
		var optedForMonthlyPayment;
		
		jsonDataObjGlobal.fullname=fullname;
		jsonDataObjGlobal.elecconnno=elecconnno;
		jsonDataObjGlobal.aadharno=aadharno;
		jsonDataObjGlobal.address=address;
		jsonDataObjGlobal.taluka=taluka;
		jsonDataObjGlobal.district=district;
		jsonDataObjGlobal.pincode=pincode;
		jsonDataObjGlobal.mobile=mobile;
		jsonDataObjGlobal.spouse=spouse;
		jsonDataObjGlobal.noOfChildren=noOfChildren;
		jsonDataObjGlobal.gender=gender;
		jsonDataObjGlobal.age=age;
		jsonDataObjGlobal.qualification=qualification;
		jsonDataObjGlobal.noOfLedIssued=noOfLedIssued;
		jsonDataObjGlobal.recieptNumber=recieptNumber;
		jsonDataObjGlobal.optedForMonthlyPayment=optedForMonthlyPayment;
		jsonDataObjGlobal.myImage=myImage;
		
		db.transaction(insertBaseappData, errorCB, successCB);
		
		if ( ( addLogTimeForm.gender[1].checked  )){ 
			optedForMonthlyPayment= document.getElementById('yy').value;
		}
		if(( addLogTimeForm.gender[2].checked  )){
			optedForMonthlyPayment= document.getElementById('nn').value;
		}
		var myImage=document.getElementById('myImage').src;
		//alert("optedForMonthlyPayment :" +optedForMonthlyPayment + "the image" +myImage+ "taluka" +taluka );
	}else{
		if ( document.getElementsByName('taluka')[0].value == '' )
		    alert('Please Select taluka !');
		else if ( document.getElementsByName('district')[0].value == '' )
		    alert('Please Select district !');
		else if ( document.getElementsByName('gender')[0].value == '' )
		    alert('Please Select gender !');
	}
}
// end of submitData

/* ************* Database Code Starts   -------------------------  */

// Open Database
function openDatabase() {
   db.transaction(initializeDB, errorCB, successCB);
}

//Close Database
function closeDatabase() {
}

//Populate the database 
function initializeDB(tx) {
	alert("initializeDB...");
	//tx.executeSql('CREATE TABLE IF NOT EXISTS BASEAPP (id integer primary key autoincrement,pid integer,grn_companies_id integer,sp_manager text,sp_salesorderNumber integer,sp_jobName text,grn_colors_id integer,HexColor text )');
	tx.executeSql('CREATE TABLE IF NOT EXISTS BASEAPP (id integer primary key autoincrement, fullname text,elecconnno text,aadharno text,address text,taluka text,district text,pincode integer,mobile integer,spouse text, noOfChildren integer, gender text,age  integer, qualification text, noOfLedIssued integer, recieptNumber text,optedForMonthlyPayment text, myImage text)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS BASEAPPTEST (id integer primary key autoincrement, fullname text,elecconnno text,aadharno text)');

}

function insertBaseappData(tx) {
	alert("insertBaseappData...");
	var insertBaseappDataSql ='CREATE TABLE IF NOT EXISTS BASEAPP (id integer primary key autoincrement, fullname text,elecconnno text,aadharno text,address text,taluka text,district text,pincode integer,mobile integer,spouse text, noOfChildren integer, gender text,age  integer, qualification text, noOfLedIssued integer, recieptNumber text,optedForMonthlyPayment text, myImage text)';
	//var insertBaseappDataSql ='CREATE TABLE IF NOT EXISTS BASEAPPTEST (id integer primary key autoincrement, fullname text,elecconnno text,aadharno text)';
	
	tx.executeSql(insertBaseappDataSql,[], function (tx, results) {
   	    	//var jsonObj=value;
   	    	//var id=jsonObj["id"];
		var fullname = document.getElementById('fullname').value;
		var elecconnno = document.getElementById('elecconnno').value;
		var aadharno = document.getElementById('aadharno').value;
		var address = document.getElementById('address').value;
		var taluka = document.getElementById('taluka').value;
		var district = document.getElementById('district').value;
		var pincode = document.getElementById('pincode').value;
		var mobile = document.getElementById('mobile').value;
		var spouse = document.getElementById('spouse').value;
		var noOfChildren = document.getElementById('noOfChildren').value;
		var gender = document.getElementById('gender').value;
		var age = document.getElementById('age').value;
		var qualification = document.getElementById('qualification').value;
		var noOfLedIssued = document.getElementById('noOfLedIssued').value;
		var recieptNumber = document.getElementById('recieptNumber').value;
		var optedForMonthlyPayment;
		
		if ( ( addLogTimeForm.gender[1].checked  )){ 
			optedForMonthlyPayment= document.getElementById('yy').value;
			//alert ("Opted For Monthly Payment :" +optedForMonthlyPayment );
		}
		if(( addLogTimeForm.gender[2].checked  )){
			optedForMonthlyPayment= document.getElementById('nn').value;
			//alert ("Opted For Monthly Payment :" +optedForMonthlyPayment );
		}
		var myImage=document.getElementById('myImage').src;
   	    	
   			/*
   			tx.executeSql('INSERT INTO BASEAPPTEST(fullname, elecconnno, aadharno) VALUES (?, ?, ?)',
   	    			[fullname, elecconnno, aadharno], function(tx, res) {
	   	       
   	    	   	alert("insertId: " + res.insertId + " -- res.rowsAffected 1"+res.rowsAffected);
	    	});
   			*/
   			
   	    	tx.executeSql('INSERT INTO BASEAPP(fullname, elecconnno, aadharno, address, taluka, district, pincode, mobile, spouse, noOfChildren,gender, age, qualification, noOfLedIssued, recieptNumber,optedForMonthlyPayment,myImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?,?,?)',
   	    			[fullname, elecconnno, aadharno, address, taluka, district, pincode, mobile, spouse, noOfChildren,gender, age, qualification, noOfLedIssued, recieptNumber,optedForMonthlyPayment,myImage], function(tx, res) {
	   	    	   	alert("insertId: " + res.insertId + " -- res.rowsAffected 1"+res.rowsAffected);
  	    	});
   	  //window.localStorage["tclocal"]=1;
   	  //alert("timeCategoryCreateSql");
    });
}

/*function insertBaseappDataTest(tx) {
	alert("insertBaseappData...");
	var insertBaseappDataSql ='CREATE TABLE IF NOT EXISTS BASEAPP (id integer primary key autoincrement, fullname text,elecconnno text,aadharno text,address text,taluka text,district text,pincode integer,mobile integer,spouse text, noOfChildren integer, gender text,age  integer, qualification text, noOfLedIssued integer, recieptNumber text,optedForMonthlyPayment text, myImage text)';
	//var insertBaseappDataSql ='CREATE TABLE IF NOT EXISTS BASEAPPTEST (id integer primary key autoincrement, fullname text,elecconnno text,aadharno text)';
	
	tx.executeSql(insertBaseappDataSql,[], function (tx, results) {
   	    	//var jsonObj=value;
   	    	//var id=jsonObj["id"];
   	    	var fullname = document.getElementById('fullname').value;
   			var elecconnno = document.getElementById('elecconnno').value;
   			var aadharno = document.getElementById('aadharno').value;
   			var address = document.getElementById('address').value;
   			var taluka = document.getElementById('taluka').value;
   			var district = document.getElementById('district').value;
   			var pincode = document.getElementById('pincode').value;
   			var mobile = document.getElementById('mobile').value;
   			var spouse = document.getElementById('spouse').value;
   			var noOfChildren document.getElementById('noOfChildren').value;
   			var gender = document.getElementById('gender').value;
   			var age = document.getElementById('age').value;
   			var qualification = document.getElementById('qualification').value;
   			var noOfLedIssued = document.getElementById('noOfLedIssued').value;
   			var recieptNumber = document.getElementById('recieptNumber').value;
   			var optedForMonthlyPayment;
   			//var optedForMonthlyPayment= document.getElementById('radio-choice-h-2a').value;
   			if ( ( addLogTimeForm.gender[1].checked  )){ 
   				optedForMonthlyPayment= document.getElementById('yy').value;
   			}
   			if(( addLogTimeForm.gender[2].checked  )){
   				optedForMonthlyPayment= document.getElementById('nn').value;
   			}
   			var myImage=document.getElementById('myImage').src;
   	    	
   			
   			tx.executeSql('INSERT INTO BASEAPPTEST(fullname, elecconnno, aadharno) VALUES (?, ?, ?)',
   	    			[fullname, elecconnno, aadharno], function(tx, res) {
	   	       
   	    	   	alert("insertId: " + res.insertId + " -- res.rowsAffected 1"+res.rowsAffected);
	    	});
   			
   			
   	    	tx.executeSql('INSERT INTO BASEAPP(fullname, elecconnno, aadharno, address, taluka, district, pincode, mobile, spouse, noOfChildren,gender, age, qualification, noOfLedIssued, recieptNumber,optedForMonthlyPayment,myImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?,?,?)',
   	    			[fullname, elecconnno, aadharno, address, taluka, district, pincode, mobile, spouse, noOfChildren,gender, age, qualification, noOfLedIssued, recieptNumber,optedForMonthlyPayment,myImage], function(tx, res) {
	   	    	   	alert("insertId: " + res.insertId + " -- res.rowsAffected 1"+res.rowsAffected);
  	    	});
   	  //window.localStorage["tclocal"]=1;
   	  //alert("timeCategoryCreateSql");
    });
}*/

//Multiple records
function getBaseappDataList(){
	//alert("getBaseappDataList");
  db.transaction
  (
       function (tx){
            /*tx.executeSql('SELECT fullname,aadharno,address FROM BASEAPP',[],function(tx,results){
            */
    	   tx.executeSql('SELECT fullname, elecconnno, aadharno, address, taluka, district, pincode, mobile, spouse, noOfChildren,gender, age, qualification, noOfLedIssued, recieptNumber,optedForMonthlyPayment,myImage FROM BASEAPP',[],function(tx,results){
    	   var len = results.rows.length;
    	   alert("len--"+len);
                    if(len>0){
                        for (var i = 0; i < len; i++) {
                         //   alert(results.rows.item(i)['fullname']+"aadharno"+results.rows.item(i)['aadharno']+"taluka"+results.rows.item(i)['taluka']+"noOfChildren"+results.rows.item(i)['noOfChildren']+"optedForMonthlyPayment"+results.rows.item(i)['optedForMonthlyPayment']);
                           // $('#resultList').append('<li><a href="#">' + results.rows.item(i)['timeCats']+ results.rows.item(i)['pid'] + '</a></li>');
                        }
                        //$('#resultList').listview();
                    }
                }, errorCB
            );
       },errorCB,successCB
   );
}

//Transaction success callback
function successCB() {
	alert('db transcation success');
}

//Transaction error callback
function errorCB(err) {
	alert("Error processing SQL: "+err.code);
	//console.log("Error processing SQL: "+err.code);
}

function deleteTimeTrackerRow(id){
	/*db.transaction(function(tx) {
		alert("deleteTimeTrackerRow..."+id);
		var deleteTTQuery="DELETE FROM TIMETRACKER WHERE id=' "+id+" '";
		tx.executeSql(deleteTTQuery, successCB, errorCB);
		//ctx.executeSql('DELETE FROM TIMETRACKER WHERE id =?', [ currid ],errorCB);
	});*/
	
	/*db.transaction(function(tx) {
		alert("deleteTimeTrackerRow..."+id);
		var deleteTTQuery="DELETE FROM TIMETRACKER WHERE id=' "+id+" '";
		tx.executeSql(deleteTTQuery,errorCB);
		//ctx.executeSql('DELETE FROM TIMETRACKER WHERE id =?', [ currid ],errorCB);
	});*/
	
	/*db.transaction(function deleteRow(tx) {
		  tx.executeSql('DELETE FROM TIMETRACKER WHERE id = ' + id, [], successCB, errorCB);
	}, errorCB);*/
	
	db.transaction
	  (
	       function (tx){
	            tx.executeSql
	            (
	                'DELETE FROM TIMETRACKER WHERE id=?',[id], errorCB
	            );
	       }, successCB, errorCB
	   );

}

function insertTimeCategory(tx) {
	var timeCategoryCreateSql ='CREATE TABLE IF NOT EXISTS TIMECATEGORY (id integer primary key autoincrement,pid integer,timeCats text,title text,spjobname text,grnrolesid integer,revision integer,status integer )';
	
	tx.executeSql(timeCategoryCreateSql,[], function (tx, results) {
		var el = $('#timeCat');
   		el.find('option').remove().end();
   	     jQuery.each(time_cats_arr, function(index,value) {
   	    	var jsonObj=value;
   	    	var id=jsonObj["id"];
   	    	var timeCats=jsonObj["timeCats"];
   	    	var title=jsonObj["title"];
   	    	var spJobName=jsonObj["sp_jobName"];
   	    	var grnRolesId=jsonObj["grn_roles_id"];
   	    	var revision=jsonObj["revision"];
   	    	var status=jsonObj["status"];
   	    	
	   		el.append('<option value="'+timeCats+'">'+title+'</option>').val(timeCats);
   	    	
   	    	tx.executeSql('INSERT INTO TIMECATEGORY(pid, timeCats, title, spjobname, grnrolesid, revision, status) VALUES (?,?,?,?,?,?,?)',
   	    			[id,timeCats,title,spJobName,grnRolesId,revision,status], function(tx, res) {
	   	         //alert("insertId: " + res.insertId + " -- res.rowsAffected 1"+res.rowsAffected);
  	    	});
   		});
   	  el.selectmenu();
   	  el.selectmenu("refresh", true);
   	  window.localStorage["tclocal"]=1;
   	  //alert("timeCategoryCreateSql");
    });
}

function insertSalesOrder(tx) {
	var insertSalesOrderSql = 'CREATE TABLE IF NOT EXISTS SALESORDER (id integer primary key autoincrement,pid integer,grn_companies_id integer,sp_manager text,sp_salesorderNumber integer,sp_jobName text,grn_colors_id integer,HexColor text )';
		
	tx.executeSql(insertSalesOrderSql,[], function (tx, results) {
       
   		jQuery.each(salse_orders_arr, function(index,value) {
        	var jsonObj=value;
        	var id=parseInt(jsonObj["id"]);
        	var grn_companies_id=parseInt( jsonObj["grn_companies_id"]);
        	var sp_manager=jsonObj["sp_manager"];
        	var sp_salesorderNumber= parseInt( jsonObj["sp_salesorderNumber"] );
        	var sp_jobName=jsonObj["sp_jobName"];
        	var grn_colors_id=parseInt( jsonObj["grn_colors_id"] );
        	//var time_running_status=jsonObj["time_running_status"];
        	//var grn_status_id=jsonObj["grn_status_id"];
        	var HexColor=jsonObj["HexColor"];
        	//var tbodyObjCurr = tbodyObj.replace("spOrderIdReplace", id);
        	var tbodyObjCurr = tbodyObj.replace(/spOrderIdReplace/g,id);
   	    	
   	    	tx.executeSql('INSERT INTO SALESORDER(pid,grn_companies_id,sp_manager,sp_salesorderNumber,sp_jobName,grn_colors_id,HexColor) VALUES (?,?,?,?,?,?,?)',
   	    			[id,grn_companies_id,sp_manager,sp_salesorderNumber,sp_jobName,grn_colors_id,HexColor], function(tx, res) {
	   	         	//alert("insertId: " + res.insertId + " -- res.rowsAffected 1"+res.rowsAffected);
  	    	});
   		});
   		//alert("insertSalesOrderSql");
   		window.localStorage["solocal"] = 1;
    });
}

//Single row
function getSingleRow(id){
  db.transaction
  (
       function (tx){
            tx.executeSql
            (
                'SELECT timeCats FROM TIMECATEGORY WHERE id=?',[id],function(tx,results){
                    var len = results.rows.length;
                    if(len>0){
                        //alert(results.rows.item(0)['timeCats']);
                    }
                }, errorCB
            );
       },errorCB,successCB
   );
}

//Multiple records
function getTimeCategoryList(){
  db.transaction
  (
       function (tx){
            tx.executeSql('SELECT timeCats,pid FROM TIMECATEGORY',[],function(tx,results){
                    var len = results.rows.length;
                    if(len>0){
                        for (var i = 0; i < len; i++) {
                            //alert(results.rows.item(i)['timeCats']);
                            //$('#resultList').append('<li><a href="#">' + results.rows.item(i)['timeCats']+ results.rows.item(i)['pid'] + '</a></li>');
                        }
                        //$('#resultList').listview();
                    }
                }, errorCB
            );
       },errorCB,successCB
   );
}
       
 //Multiple Sales Order
   function getSalesOrderList(){
     db.transaction
     (
          function (tx){
               tx.executeSql('SELECT pid,grn_companies_id,sp_manager,sp_salesorderNumber,sp_jobName,grn_colors_id,HexColor FROM SALESORDER',[],function(tx,results){
                       var len = results.rows.length;
                       salse_orders_arr=[];
                       if(len>0){
                    	   
                           for (var i = 0; i < len; i++) {
                               //alert(results.rows.item(i)['pid']);
	                           	var jsonObj={};
	                           	jsonObj["id"]=results.rows.item(i)["pid"];
	                           	jsonObj["grn_companies_id"]=results.rows.item(i)["grn_companies_id"];
	                           	jsonObj["sp_manager"]=results.rows.item(i)["sp_manager"];
	                           	jsonObj["sp_salesorderNumber"]=results.rows.item(i)["sp_salesorderNumber"];
	                           	jsonObj["sp_jobName"]=results.rows.item(i)["sp_jobName"];
	                           	jsonObj["grn_colors_id"]=results.rows.item(i)["grn_colors_id"];
	                           	jsonObj["HexColor"]=results.rows.item(i)["HexColor"];
	                           	salse_orders_arr.push(jsonObj);
                           }
                           //alert("sales order tabel list count "+len+"---"+salse_orders_arr.length);
                       }
                   }, errorCB
               );
          },errorCB,successCB
      );
   }

function getTimeTrackerList(){
  db.transaction
  (
       function (tx){
            tx.executeSql('SELECT localStatus,time FROM TIMETRACKER',[],function(tx,results){
                    var len = results.rows.length;
                    if(len>0){
                        for (var i = 0; i < len; i++) {
                            //alert(results.rows.item(i)['timeCats']);
                            //$('#resultList').append('<li><a href="#">' + results.rows.item(i)['localStatus']+"--"+ results.rows.item(i)['time'] + '</a></li>');
                        }
                       // $('#resultList').listview();
                    }
                }, errorCB
            );
       },errorCB,successCB
   );
}

/* ************* Database Code Ends   -------------------------  */
/* ===============  Code Reusable ========================  */

function getTodayDate(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;//January is 0, so always add + 1

	var yyyy = today.getFullYear();
	if(dd<10){dd='0'+dd}
	if(mm<10){mm='0'+mm}
	today = dd+'/'+mm+'/'+yyyy;
	return today;
}

function getPicture(){
	navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
	    destinationType: Camera.DestinationType.DATA_URL
	});
	
	function onSuccess(imageData) {
		var image = document.getElementById('myImage');
	    image.src = "data:image/jpeg;base64," + imageData;
	    image.css('height', '200px');
	    image.css('width', '200px');
	    
	    var myImageUrl = document.getElementById('myImageUrl');
	     myImageUrl.value="data:image/jpeg;base64," + imageData;
	}
	
	function onFail(message) {
	    alert('Failed because: ' + message);
	}
}
