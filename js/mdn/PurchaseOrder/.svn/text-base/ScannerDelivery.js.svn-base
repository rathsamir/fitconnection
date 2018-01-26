var scannerDelivery = Class.create();
scannerDelivery.prototype = {

    //**********************************************************************************************************************************
    //initialize object
    initialize: function(jsonData, poId, scanLocation){
        this.products = jsonData;
        this.poId = poId;
        this.scanLocation = scanLocation;
        this.currentProduct = null;
        this.currentBarcode = null;
        this.barcodeDigitCount = 0;
    },

    //**********************************************************************************************************************************
    //
    waitForScan: function()
    {
        objScannerDelivery.showInstruction('Scan product barcode', false);

        document.onkeypress = handleKey;
        enableCatchKeys(null, null, 'objScannerDelivery.scanProductBarcode();'); //, 'objScannerDelivery.barcodeDigitScanned();');

    },

    //**********************************************************************************************************************************
    //
    waitForLocationScan: function()
    {
        objScannerDelivery.showInstruction('Scan location', false);

        document.onkeypress = handleKey;
        enableCatchKeys(null, null, 'objScannerDelivery.scanLocationBarcode();');//, 'objScannerDelivery.barcodeDigitScanned();');

        document.getElementById('btn_skip_location').style.display = '';
    },

    //**********************************************************************************************************************************
    //
    skipLocation: function()
    {
        document.getElementById('btn_skip_location').style.display = 'none';
        objScannerDelivery.waitForScan();
    },

    //**********************************************************************************************************************************
    //
    barcodeDigitScanned:function()
    {
        objScannerDelivery.showMessage(KC_value);
    },

    //**********************************************************************************************************************************
    //
    scanProductBarcode: function()
    {
        objScannerDelivery.barcodeDigitScanned();
        
        //process on full barcode scan
        this.barcodeDigitCount++;
        if(this.barcodeDigitCount < 13)
            return false;
        else 
            this.barcodeDigitCount = 0;
        
        //init vars
        var barcode = KC_value;
        
        //find product with barcode
        var product = objScannerDelivery.findProduct(barcode);
        if (product == null)
        {
            /*objScannerDelivery.showInstruction('Affect barcode to product', false);

            objScannerDelivery.showMessage('Unknown barcode : ' + barcode, true);
            objScannerDelivery.currentProduct = null;
            objScannerDelivery.currentBarcode = barcode;
            objScannerDelivery.showAffectBarcode();
            */
           alert('Scanned product does not match any of the products in the order.');
        }
        else
        {            
            objScannerDelivery.showMessage(product.name + ' scanned');
            objScannerDelivery.currentProduct = product;

            product.scanned_qty++;

            //Location scan if enabled
            if (objScannerDelivery.scanLocation)
            {
                objScannerDelivery.waitForLocationScan();

            }
        }

        //objScannerDelivery.showScannedProducts();
        if(objScannerDelivery.showScannedProducts()){
            objScannerDelivery.showProductInformation();
        }
        
        
        //reset
        KC_value='';
    },

    //**********************************************************************************************************************************
    //scan location for current product
    scanLocationBarcode: function()
    {
        //init vars
        objScannerDelivery.barcodeDigitScanned();
        var location = KC_value;
        var product = objScannerDelivery.currentProduct;
        product.new_location = location;
        
        objScannerDelivery.showMessage('Location affected');
        objScannerDelivery.showScannedProducts();
        objScannerDelivery.waitForScan();
    },

    //**********************************************************************************************************************************
    //
    commit: function()
    {
        //ask for confirmation
        if (!confirm('Do you confirm ?'))
            return false;

        //store serialized datas
        document.getElementById('data').value = objScannerDelivery.serializeData();

        //submit form
        document.getElementById('form_delivery').submit();

    },

    //******************************************************************************
    //
    showMessage: function(text, error)
    {
        if (text == '')
            text = '&nbsp;';

        if (error)
            text = '<font color="red">' + text + '</font>';
        else
            text = '<font color="green">' + text + '</font>';

        document.getElementById('div_message').innerHTML = text;
        document.getElementById('div_message').style.display = '';
    },

    //******************************************************************************
    //
    hideMessage: function()
    {
        document.getElementById('div_message').style.display = 'none';
    },


    //******************************************************************************
    //display instruction for current
    showInstruction: function(text)
    {
        document.getElementById('div_instruction').innerHTML = text;
        document.getElementById('div_instruction').style.display = '';
    },

    //******************************************************************************
    //
    hideInstruction: function()
    {
        document.getElementById('div_instruction').style.display = 'none';
    },

    //******************************************************************************
    //
    findProduct: function(barcode)
    {
        for(i=0;i<objScannerDelivery.products.length;i++)
        {
            if ((objScannerDelivery.products[i].barcode == barcode) || (objScannerDelivery.products[i].new_barcode == barcode))
            {
                return objScannerDelivery.products[i];
            }
        }

        return null;
    },
    
    //******************************************************************************
    //
    showScannedProducts: function()
    {
        
        
        
        var html = '<table border="1" width="100%" cellspacing="0">';
        html += '<tr>';
        html += '<td class="po_th">Barcode</th>';
        html += '<td class="po_th">StyleCode</th>';
        html += '<td class="po_th">Size</th>';
        html += '<td class="po_th">Sku</th>';
        html += '<td class="po_th">Name</th>';
        html += '<td class="po_th">Scanned Qty</th>';
        html += '<td class="po_th">Missing Qty</th>';
        html += '<td class="po_th">Location</th>';
        html += '</tr>';
        
         // Checking if all the products have already been scanned
        
        var showAlert = false;
        for(i=0;i<objScannerDelivery.products.length;i++)
        {
            var product = objScannerDelivery.products[i];
            if (product.scanned_qty > 0)
            {
                var scan_type;
                if(document.getElementById('scan_type')){
                    scan_type = document.getElementById('scan_type').value;    
                }
                //scan_type = document.getElementById('scan_type').value;    
                
                if(scan_type == 'return'){
                    var alreadyScanned = document.getElementById('div_main_qty').innerHTML.trim();    
                    if(alreadyScanned != ''){
                        //var alreadyScanned = document.getElementById('div_main_qty').innerHTML.trim();
                        alreadyScanned = alreadyScanned.split(' / ');
                        if(parseInt(product.scanned_qty) > parseInt(alreadyScanned[1])){

                            /* Since value of scanned product is more then alreadyscanned we reduce the value */
                            product.scanned_qty-- ;
                            alert('Number of products returned cannot be more then number of products delivered.');
                            return false;
                        }
                    }else{

                        if(parseInt(objScannerDelivery.currentProduct.scanned_qty) > parseInt(objScannerDelivery.currentProduct.expected_qty)){
                            product.scanned_qty-- ;
                            showAlert = true;
                        }
                    }
                }
                
                
                html += '<tr>';
                html += '<td class="po_td">' + (product.barcode != null ? product.barcode : '') + ' ' + product.new_barcode + '</td>';
                html += '<td class="po_td">' + product.style_code + '</td>';
                html += '<td class="po_td">' + product.size + '</td>';
                html += '<td class="po_td">' + product.sku + '</td>';
                html += '<td class="po_td">' + product.name + '</td>';
                html += '<td class="po_td"><input type="button" value=" - " onclick="objScannerDelivery.decreaseQty(' + product.pop_id + ')"> ' + product.scanned_qty + ' <!--<input type="button" value=" + " onclick="objScannerDelivery.increaseQty(' + product.pop_id + ')">--></td>';
                html += '<td class="po_td">' + (product.expected_qty - product.scanned_qty) + '</td>';
                html += '<td class="po_td">' + (product.new_location ? product.new_location : product.location) + '</td>';
                html += '</tr>';
            }
        }
        var totalScannedQty = 0;
        for(i=0;i<objScannerDelivery.products.length;i++)
        {
            var product = objScannerDelivery.products[i];
            if (product.scanned_qty > 0)
            {
               totalScannedQty +=  product.scanned_qty;
            }
        }
        html += '<tr>';
        html += '<td colspan="8" class="po_th">Total Scanned Qty: '+totalScannedQty+' </th>';
        html += '</tr>';
        html += '</table>';
        
        //update current product qty & location
        if (objScannerDelivery.currentProduct)
        {
            document.getElementById('div_main_qty').innerHTML = objScannerDelivery.currentProduct.scanned_qty + ' / ' + objScannerDelivery.currentProduct.expected_qty;
            document.getElementById('div_main_location').innerHTML = 'Location : ' + (objScannerDelivery.currentProduct.new_location ? objScannerDelivery.currentProduct.new_location : objScannerDelivery.currentProduct.location);
        }
        
        if(showAlert){
            showAlert = false;
            alert('Number of products returned cannot be more then number of products delivered.');
        }

        document.getElementById('div_summary').innerHTML = html;
        return true
    },

    //******************************************************************************
    //
    showProductInformation: function()
    {
        
        if (objScannerDelivery.currentProduct != null)
        {
            document.getElementById('div_affect_barcode').style.display = 'none';

            document.getElementById('div_main').style.display = '';
            document.getElementById('div_main_name').innerHTML = objScannerDelivery.currentProduct.name;
            document.getElementById('div_main_sku').innerHTML = objScannerDelivery.currentProduct.sku;
            document.getElementById('div_main_location').innerHTML = 'Location : ' + (objScannerDelivery.currentProduct.new_location ? objScannerDelivery.currentProduct.new_location : objScannerDelivery.currentProduct.location);
            document.getElementById('div_main_barcode').innerHTML = objScannerDelivery.currentProduct.barcode + ' ' + objScannerDelivery.currentProduct.new_barcode;

            document.getElementById('img_main_picture').style.display = '';
            if (objScannerDelivery.currentProduct.image_url)
                document.getElementById('img_main_picture').src = objScannerDelivery.currentProduct.image_url;
            else
                document.getElementById('img_main_picture').style.display = 'none';
            
            document.getElementById('div_main_qty').innerHTML = objScannerDelivery.currentProduct.scanned_qty + ' / ' + objScannerDelivery.currentProduct.expected_qty;

            //document.getElementById('btn_increase').style.display = '';
            document.getElementById('btn_decrease').style.display = '';
        }
        else
        {
            //document.getElementById('btn_increase').style.display = 'none';
            document.getElementById('btn_decrease').style.display = 'none';

            document.getElementById('div_main').style.display = 'none';
        }
    },

    //******************************************************************************
    //
    showAffectBarcode: function()
    {
        document.getElementById('div_affect_barcode').style.display = '';

        var html = '<p class="po_scanner_h1">Barcode ' + objScannerDelivery.currentBarcode + ' is unknown, do you want to affect it to a product :</p>';

        html += '<table border="1" width="100%" cellspacing="0">';
        html += '<tr>';
        html += '<td class="po_th">Barcode</th>';
        html += '<td class="po_th">Sku</th>';
        html += '<td class="po_th">Name</th>';
        html += '<td class="po_th">Expected Qty</th>';
        html += '<td class="po_th">Location</th>';
        html += '<td class="po_th">Select</th>';
        html += '</tr>';

        for(i=0;i<objScannerDelivery.products.length;i++)
        {
            var product = objScannerDelivery.products[i];
            
            html += '<tr>';
            html += '<td class="po_td">' + (product.barcode != null ? product.barcode : '') + ' ' + product.new_barcode + '</td>';
            html += '<td class="po_td">' + product.sku + '</td>';
            html += '<td class="po_td">' + product.name + '</td>';
            html += '<td class="po_td">' + (product.expected_qty) + '</td>';
            html += '<td class="po_td">' + product.location + '</td>';
            html += '<td class="po_td"><input type="button" value="Affect" onclick="objScannerDelivery.affectCurrentBarcode(' + product.pop_id + ')"></td>';
            html += '</tr>';

        }

        html += '</table>';

        document.getElementById('div_affect_barcode').innerHTML = html;
        document.getElementById('div_affect_barcode').style.display = '';
    },

    //******************************************************************************
    //
    affectCurrentBarcode: function(popId)
    {
        for(i=0;i<objScannerDelivery.products.length;i++)
        {
            var product = objScannerDelivery.products[i];
            if (product.pop_id == popId)
            {
                product.new_barcode = objScannerDelivery.currentBarcode;
                KC_value = objScannerDelivery.currentBarcode;
                objScannerDelivery.scanProductBarcode();
            }
        }

        KC_value = '';

    },

    //******************************************************************************
    //
    decreaseQty: function(popId)
    {
        for(i=0;i<objScannerDelivery.products.length;i++)
        {
            var product = objScannerDelivery.products[i];
            if (product.pop_id == popId)
            {
                if (product.scanned_qty > 0)
                {
                    product.scanned_qty -= 1;
                    objScannerDelivery.showScannedProducts();
                }
            }
        }
    },

    //******************************************************************************
    //
    increaseQty: function(popId)
    {
        for(i=0;i<objScannerDelivery.products.length;i++)
        {
            var product = objScannerDelivery.products[i];
            if (product.pop_id == popId)
            {
                product.scanned_qty += 1;
                objScannerDelivery.showScannedProducts();
            }
        }

    },

    //******************************************************************************
    //serialize products data
    serializeData: function()
    {
        var string = '';

        for(i=0;i<objScannerDelivery.products.length;i++)
        {
            var product = objScannerDelivery.products[i];
            if (product.scanned_qty > 0)
            {
                string += 'pop_id=' + product.pop_id + ';';
                string += 'scanned_qty=' + product.scanned_qty + ';';
                string += 'new_location=' + product.new_location + ';';
                string += 'new_barcode=' + product.new_barcode + ';';
                if ($('add_povoucher_id_supply') != null && $('add_povoucher_id_supply') != 'undefined' )
                    {
                        string += 'povoucher_id=' + $('add_povoucher_id_supply').value + ';';
                    }
                if ($('add_povoucher_id_returnsupply') != null && $('add_povoucher_id_returnsupply') != 'undefined' )
                    {
                        string += 'povoucher_id=' + $('add_povoucher_id_returnsupply').value + ';';
                    }
                string += '#';
            }
        }

        return string;
    }

}