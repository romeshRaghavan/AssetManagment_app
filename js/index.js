var j = jQuery.noConflict();
var defaultPagePath='app/pages/';
var headerMsg = "Expenzing";
var urlPath;
var WebServicePath = 'http://1.255.255.188:8088/NexstepWebService/mobileLinkResolver.service';
var clickedFlagCar = false;
var clickedFlagTicket = false;
var clickedFlagHotel = false;
var clickedCarRound = false;
var clickedTicketRound = false;
var clickedHotelRound = false;
var perUnitDetailsJSON= new Object();
var ismodeCategoryJSON=new Object();
var exceptionStatus = 'N';
var exceptionMessage='';
var expenseClaimDates=new Object();
var successMessage;
var pictureSource,destinationType;
var camerastatus;
var voucherType;
var fileTempCameraBE ="";
var fileTempCameraTS ="";
var fileTempGalleryBE ="";
var fileTempGalleryTS ="";
var mapToCalcERAmt = new Map();

function login()
   {

   	if(document.getElementById("userName")!=null){
    var userName = document.getElementById("userName");
	}else if(document.getElementById("userName")!=null){
		var userName = document.getElementById("userNameId");
	}
	var password = document.getElementById("pass");
    
    var jsonToBeSend=new Object();
    jsonToBeSend["user"] = userName.value;
    jsonToBeSend["pass"] = password.value;
   	var headerBackBtn=defaultPagePath+'categoryMsgPage.html';
	var pageRef=defaultPagePath+'category.html';
	urlPath=window.localStorage.getItem("urlPath");
	j('#loading').show();
    j.ajax({
         url: urlPath+"LoginWebService",
         type: 'POST',
         dataType: 'json',
         crossDomain: true,
         data: JSON.stringify(jsonToBeSend),
         success: function(data) {
         	if (data.Status == 'Success'){
        	 j('#mainHeader').load(headerBackBtn);
             j('#mainContainer').load(pageRef);
              appPageHistory.push(pageRef);
			  //addEmployeeDetails(data);
			  setUserStatusInLocalStorage("Valid");
			  setUserSessionDetails(data,jsonToBeSend);
			}else if(data.Status == 'Failure'){
 			   successMessage = data.Message;
			   if(successMessage.length == 0){
					successMessage = "Wrong UserName or Password";
				}
				document.getElementById("loginErrorMsg").innerHTML = successMessage;
 			   j('#loginErrorMsg').hide().fadeIn('slow').delay(2000).fadeOut('slow');
 			   j('#loading').hide();
           }else{
			    j('#loading').hide();
             alert("Please enter correct username or password");
           }

         },
         error:function(data) {
		   j('#loading').hide();
         }
   });

 }
 
function commanLogin(){
 	var userName = document.getElementById("userName");
 	var userNameValue = userName.value; 
 	var domainName = userNameValue.split('@')[1];
	var jsonToDomainNameSend = new Object();
	jsonToDomainNameSend["userName"] = domainName;
	//jsonToDomainNameSend["mobilePlatform"] = device.platform;
	jsonToDomainNameSend["mobilePlatform"] = "Android";
  	//var res=JSON.stringify(jsonToDomainNameSend);
	var requestPath = WebServicePath;
	j.ajax({
         url: requestPath,
         type: 'POST',
         contentType : "application/json",
         dataType: 'json',
         crossDomain: true,
         data: JSON.stringify(jsonToDomainNameSend),
		 success: function(data) {
         	if (data.status == 'Success'){
         		urlPath = data.message;
         		setUrlPathLocalStorage(urlPath);
         		login();
        	}else if(data.status == 'Failure'){
				successMessage = data.message;
				document.getElementById("loginErrorMsg").innerHTML = successMessage;
 			   j('#loginErrorMsg').hide().fadeIn('slow').delay(2000).fadeOut('slow');
 			}else{
 				successMessage = data.message;
 				if(successMessage == "" || successMessage == null){
				alert("Please enter correct username or password");				
				}else{
 				alert(successMessage);	
 				}	
 			}
		},
         error:function(data) {
		   
         }
   });
}

 function init() {
	 var pgRef;
	var headerBackBtn;
	if(window.localStorage.getItem("EmployeeId")!= null){
		if(window.localStorage.getItem("UserStatus")=='ResetPswd'){
			headerBackBtn=defaultPagePath+'expenzingImagePage.html';
			pgRef=defaultPagePath+'loginPageResetPswd.html';
		}else if(window.localStorage.getItem("UserStatus")=='Valid'){
			pgRef=defaultPagePath+'category.html';
			headerBackBtn=defaultPagePath+'categoryMsgPage.html';
		}else{
			headerBackBtn=defaultPagePath+'expenzingImagePage.html';
		pgRef=defaultPagePath+'loginPage.html';
		}

	}else{
		headerBackBtn=defaultPagePath+'expenzingImagePage.html';
		pgRef=defaultPagePath+'loginPage.html';
	}
	
	j(document).ready(function() {
		j('#mainHeader').load(headerBackBtn);
			j('#mainContainer').load(pgRef);
			j('#mainContainer').load(pgRef,function() {
  						if(window.localStorage.getItem("UserStatus")!=null
  							&& window.localStorage.getItem("UserStatus")=='ResetPswd'){
  							document.getElementById("userNameLabel").innerHTML=window.localStorage.getItem("UserName");
  							document.getElementById("userName").value=window.localStorage.getItem("UserName");
  						}
		 			  
					});
			j('#mainContainer').swipe({
				swipe:function(event,direction,distance,duration,fingercount){
					switch (direction) {
						case "right":
								goBack();
								break;
						default:

					}
				},
				 threshold:200,
				allowPageScroll:"auto"
			});
	});
	appPageHistory.push(pgRef);
 }
 
  function loaddate(){
	j(function(){
		window.prettyPrint && prettyPrint();
		j('.dp1').datepicker({
			format: 'dd-mm-yyyy'
		});		
	});

	j('.dp1').on('changeDate', function(ev){
		j(this).datepicker('hide');
	});

}
 

function isJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}
				

function goBack() {
	var currentUser=getUserID();
	
	var loginPath=defaultPagePath+'loginPage.html';
	var headerBackBtn=defaultPagePath+'backbtnPage.html';
	var headerCatMsg=defaultPagePath+'categoryMsgPage.html';
	
	if(currentUser==''){
		j('#mainContainer').load(loginPath);
	}else{
		//To check if the page that needs to be displayed is login page. So 'historylength-2'
		var historylength=appPageHistory.length;
		var goToPage=appPageHistory[historylength-2];

		if(goToPage!==null && goToPage==loginPath){
			return 0;
		}else{
			appPageHistory.pop();
			var len=appPageHistory.length;
			var pg=appPageHistory[len-1];
			if(pg=="app/pages/addAnExpense.html" 
				|| pg=="app/pages/addTravelSettlement.html"){
				
				j('#mainHeader').load(headerBackBtn);
			}else if(pg=="app/pages/category.html"){
				
				j('#mainHeader').load(headerCatMsg);
			}
			if(!(pg==null)){ 
				j('#mainContainer').load(pg);
			}
		}
	}
	}
 
function goBackEvent() {
	var currentUser=getUserID();
	var loginPath=defaultPagePath+'loginPage.html';
	var headerBackBtn=defaultPagePath+'backbtnPage.html';
	var headerCatMsg=defaultPagePath+'categoryMsgPage.html';
	
	if(currentUser==''){
		j('#mainContainer').load(loginPath);
	}else{
		//To check if the page that needs to be displayed is login page. So 'historylength-2'
		var historylength=appPageHistory.length;
		var goToPage=appPageHistory[historylength-2];

		if(goToPage!==null && goToPage==loginPath){
			return 0;
		}else{
			appPageHistory.pop();
			var len=appPageHistory.length;
			if(len == 0){
				navigator.app.exitApp();
				//navigator.notification.confirm("Are you sure want to exit from App?", onConfirmExit, "Confirmation", "Yes,No");
			}else{
				var pg=appPageHistory[len-1];
				if(pg=="app/pages/addAnExpense.html"){ 
					
					j('#mainHeader').load(headerBackBtn);
				}else if(pg=="app/pages/category.html"){
					
					j('#mainHeader').load(headerCatMsg);
					forceCloseDropdown();
				}
				if(!(pg==null)){ 
					j('#mainContainer').load(pg);
				}
			}
		}
	}
}