//*********************************************************************************************************
//method to store current tab in a hidden field
function beforeSaveTransferProduction()
{
	
	//submit form
	editForm.submit();
}

//method to set status according to the current clicked send to approve button
function beforeSendForApproveTransferProduction()
{

        document.getElementById('st_status').disabled = "";
	document.getElementById('st_status').value = "jout_sent_for_Approval";
        document.getElementById('customaction').value = "sendforapproval";

	//submit form
	editForm.submit();
}
//method to set status according to the current clicked send to approve button
function beforeCancelTransferProduction()
{
	
        document.getElementById('st_status').disabled = "";
	document.getElementById('st_status').value = "cancel";
        document.getElementById('customaction').value = "cancel";

	//submit form
	editForm.submit();
}

function beforepoutTransferProduction()
{
    
        document.getElementById('st_status').disabled = "";
	    document.getElementById('st_status').value = "complete";
        document.getElementById('customaction').value = "completepout";

	//submit form
	editForm.submit();
}
