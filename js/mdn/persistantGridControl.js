var persistantGridControl = Class.create();
persistantGridControl.prototype = {

    //**********************************************************************************************************************************
    //initialize object
    initialize: function(grid, targetInputId, mainFieldPrefix, restoreValueCallback){

        this.grid = grid;
        this.grid.persistantObject = this;
        this.targetInputId = targetInputId;
        this.mainFieldPrefix = mainFieldPrefix;
        this.changes = new Array();
        this.restoreValueCallBack = restoreValueCallback;
        this.barcodeDigitCount = 0;
        
        grid.initCallback = this.initGrid;

        this.initGrid(this.grid);
    },

    //**********************************************************************************************************************************
    //log change for control
    logChange: function(fieldId, initialValue){
        var elt = document.getElementById(fieldId);
        var value = "";
        switch(elt.type)
        {
            case 'checkbox':
                value = (elt.checked ? 1 : 0);            
                break;
            default:
               value = elt.value;
                break;
        }
        this.changes[this.changes.length] = new Array(fieldId, value);        
    },

    waitForScan: function(fieldValue, scannerBox, updateBox, equateBox)
    {
        this.scannerData = new Array(fieldValue, scannerBox, updateBox, equateBox);
        enableCatchKeys(null, null, 'this.updateScannedQty();'); //, 'objScannerDelivery.barcodeDigitScanned();');

    },

    //**********************************************************************************************************************************
    //update scanned quantity
    updateScannedQty: function(fieldValue, rowId, sku,trans_type) {
        if(fieldValue) {
            this.barcodeDigitCount = fieldValue.length;
        }
        
       
        //alert(trans_type);
        var scannerBox = $('scanbox_'+rowId);
        var updateBox = $('add_qty_'+rowId);
        var equateBox = $('base_product_'+rowId);
        var qty = (updateBox.value) ? updateBox.value : 0;
        var equateValue = sku ? sku : equateBox.value;
     
        if(scannerBox.value != ''){
            
            if(scannerBox.value == equateValue) {
                if(trans_type=='pack_one' && scannerBox.value.indexOf("_") < 0){
                    scannerBox.value = '';
                alert('SKU not allowed for pack to piece transfer');}
                else{
                qty++;
                scannerBox.value = '';            
                updateBox.value =qty;   
                persistantAddProductGrid.logChange(updateBox.id, ''); 
                if(document.getElementById('total_numberof_scanned_qty'))
                    document.getElementById('total_numberof_scanned_qty').value = parseInt(document.getElementById('total_numberof_scanned_qty').value) + 1; 
                if(document.getElementById('total_stocktransfernumberof_scanned_qty'))
                    document.getElementById('total_stocktransfernumberof_scanned_qty').value = parseInt(document.getElementById('total_stocktransfernumberof_scanned_qty').value) + 1;
                    }  
             } else {
                scannerBox.value = '';
                alert('SKU not matched.');
            
            }
           
        }
    },
  
    reduceScannedQty: function(fieldValue, rowId, sku) {
        
        var updateBox = $('add_qty_'+rowId);
        var qty = (updateBox.value) ? updateBox.value : 0;
        if(qty == 0){
            return false;
        }
        qty--  ;
        updateBox.value = qty;  
        persistantAddProductGrid.logChange(updateBox.id, '');
        if(document.getElementById('total_numberof_scanned_qty'))
            document.getElementById('total_numberof_scanned_qty').value = parseInt(document.getElementById('total_numberof_scanned_qty').value) - 1; 
        if(document.getElementById('total_stocktransfernumberof_scanned_qty'))
            document.getElementById('total_stocktransfernumberof_scanned_qty').value = parseInt(document.getElementById('total_stocktransfernumberof_scanned_qty').value) - 1;  
    },
  
    reduceMarkedQty: function(fieldValue, rowId, sku) {
        
        var updateBox = $('add_qty_'+rowId);
        var qty = (updateBox.value) ? updateBox.value : 0;
        if(qty == 0){
            return false;
        }
        qty--  ;
//        if(qty == 0){
//            updateBox.value = '';
//        }else{
//            updateBox.value = qty;
//        }
        updateBox.value = qty;
     
        persistantProductGrid.logChange(updateBox.id, '');
        document.getElementById('total_numberof_scanned_qty').value = parseInt(document.getElementById('total_numberof_scanned_qty').value) - 1; 
    },
	
    //**********************************************************************************************************************************
    //update scanned quantity
    markScannedQty: function(fieldValue, rowId, sku) {
        if(fieldValue) {
            this.barcodeDigitCount = fieldValue.length;
        }
        
        if(this.barcodeDigitCount != 13) {
            return;
        }
        
        var scannerBox = $('scanbox_'+rowId);
        var updateBox = $('add_qty_'+rowId);
        var qty = (updateBox.value) ? updateBox.value : 0;
        
        if(scannerBox.value != ''){
            if(scannerBox.value == sku) {
                qty++;
                scannerBox.value = '';
                updateBox.value =qty;
                this.logChange(updateBox.id, '');
              document.getElementById('total_numberof_scanned_qty').value = parseInt(document.getElementById('total_numberof_scanned_qty').value) + 1; 
            } else {
                scannerBox.value = '';
                alert('SKU not matched.');
            }
        }
    },
    
    //**********************************************************************************************************************************
    //programmatically change value for control
    forceChange: function(fieldId, newValue){
        var value = newValue;
        this.changes[this.changes.length] = new Array(fieldId, value);
    },

    //**********************************************************************************************************************************
    //restore logged changes
    restoreChanges: function(){
        for(i=0;i<this.changes.length ;i++)
        {
            if (document.getElementById(this.changes[i][0]))
            {
                var elt = document.getElementById(this.changes[i][0]);
                switch(elt.type)
                {
                    case 'checkbox':
                        elt.checked = (this.changes[i][1] == 1);
                        break;
                    default:
                        elt.value = this.changes[i][1];
                        break;
                }
                
                
            }
        }
    },
		
    //**********************************************************************************************************************************
    //Store changes in target input for form submit
    storeLogInTargetInput: function(){
	
        document.getElementById(this.targetInputId).value = '';

        for (var i=0; i < this.changes.length; i++)
        {
            var key = this.changes[i][0];
            var value = this.changes[i][1];
            document.getElementById(this.targetInputId).value += key + '=' + value + ';';
        }
		
    },
	
    //**********************************************************************************************************************************
    //Init grid (when updated)
    initGrid: function(grid){
	
        var pgc = grid.persistantObject;
	
        pgc.restoreChanges();
		
        //call callback for each item
        var ids = pgc.getIds();
        var id;
        for (var i=0; i < ids.length; i++)
        {
            id =  ids[i];
            if (pgc.restoreValueCallBack)
                pgc.restoreValueCallBack(id);
        }
		
    },
	
    //**********************************************************************************************************************************
    //return displayed ids
    getIds: function(){
        var ids = new Array();
        var inputs = document.getElementsByTagName('input');
        for (i=0; i < inputs.length; i++)
        {
            if (inputs[i] && inputs[i].id != null)
            {
                if (inputs[i].id.indexOf(this.mainFieldPrefix) != -1)
                {
                    var id = inputs[i].id.replace(this.mainFieldPrefix, '');
                    ids[ids.length] = id;
                }
            }
        }
		
        return ids;
    }
	
}
