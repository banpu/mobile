

	// 保存按钮点击事件
	function toSaleStockList(){
			var arr = new Array();
			$('.stock-list-ul').find('li').each(function(){
				var skuId = $(this).attr('skuId');
				var stock_type = $(this).attr('stock_type');// 新增
				console.log(stock_type);
				$(this).find('input').each(function(_i,_e){
					var flag = "";
					if($(_e).siblings('span').hasClass('ico-stock')){
						flag = "D00001";
					}else if($(_e).siblings('span').hasClass('ico-stock2')){
						flag = "D00002";
					}
					var params = {};
					var channelId = $(_e).attr('channelType');
					var status = $(_e).attr('status');
					var stock = $(_e).val();
					console.log("渠道==="+channelId+"数量==="+stock);
					params.FK_CHANNEL_ID = channelId;
					params.FK_SKU_ID = skuId;
					params.STOCK = stock;
					params.FLAG = flag;
					params.STATUS = status;
					params.stock_type = stock_type;
					arr.push(params);
				});
			});
			var json =  JSON.stringify(arr);
			console.log(json);
			
			if(json.length > 2){
				businessExec('storeOutOfStockServiceImpl', {
					method : 'setSkuStock',
					DATA : json,
				}, function (rspData){
					if ('1' == rspData.RESULT){
						mui.alert('设置商品可售数量', '设置成功', function() {});
					}else{
						mui.alert('设置商品可售数量', '设置失败', function() {});
					}
				});
			}else{
					 	mui.alert('没有要设置的商品', '设置失败', function() {});
				return;
			}
	 }

	/**
	 *最左边 div 点击事件 菜品分类按钮点击事件 
	 */
	function showEstimateCargo(){
	    $('.estimateClass').on('click', function(event){
	       	refreshChildTemplate('pad_store_estimate_cargo', {
	            CLASS_ID: $(this).attr('classId')
	        }, null, function(){
	            $('#gq_cargo-init').remove();
	        });
	        event.stopPropagation();
	    });
	}
	
	/**
	 *中间部分div 商品点击事件绑定
	 */
	 function showGqCargoClickEvent(){
	 	$('#stockCheck2').on('click', 'li.estimate_cargo', function(event){
	        // 添加商品
	        var cargoId = $(this).find('div.btn-dish-title').attr('cargoid');
            console.log(cargoId);
	        businessExec('storeOutOfStockServiceImpl', {
	            //method : 'addStockSku',
	            method : 'estimateAddStockSku',
	            CARGO_ID : cargoId,
	        }, function (rspData){
	            if ('1' == rspData.RESULT){
	            	console.log("111:");
	           		console.log(rspData);
	           		refreshChildTemplate('pad_store_estimate_sku',null,null,function(){
            			$('#stock-list').remove();
            		});
	            }else{
	            	var err = rspData.ERROR;
		            	if(err == '' ){
		            		err = "添加失败";
		            	}
		            	console.log(err);
		              mui.alert(err, '添加失败', function() {});  
		              return;
	            }
	        });
	        event.stopPropagation();
	    });
	}
	 
	 /**
	  * pad 删除设置可售数量页面商品
	  *
	  */
	 function padDelCache(obj){
		 
		 	var index = $(obj).attr("index");
		 	var id = "del_pic_" + index;
		 	var $id = $('#'+id);
		 	var skuId = $(obj).attr("delskuid");
		 	businessExec('storeOutOfStockServiceImpl', {
		        // method : 'delStockSkuCacheByCargoId',
		         method : 'estimateDelStockSkuByCargoId',
		         FK_SKU_ID : skuId
		     }, function (rspData){
		         if ('1' == rspData.RESULT){
		         	/*refreshChildTemplate('store_guqing_stockSku',null,null,function(){
		         		$('#stock-list').remove();
		         	});*/
	        	 refreshChildTemplate('pad_store_estimate_sku',null,null,function(){
		         		$('#stock-list').remove();
		         	});
		         }else{
		             mui.alert('删除商品可售数量页面缓存失败', '失败', function() {
		            	 return;
		             }); 
		             return;
		         }
		     });
	 }
	 /**
	  * pad  设置线上可售数量是否可持续
	  * @param obj
	  * @returns
	  */
	 function pad_online_image(obj){
		 //alert("come");
		 var index = $(obj).attr("index");
			var id = "online_image_btn_" + index;
			var $id = $('#'+id);
			if($id.hasClass('ico-stock')){
				$id.removeClass('ico-stock');
				$id.addClass('ico-stock2');
			}else if($id.hasClass('ico-stock2')){
				$id.removeClass('ico-stock2');
				$id.addClass('ico-stock');
			}
		$("#online_input_btn_"+index).attr("status","D00002");
	 } 
	 
	 
	$(function(){
		showEstimateCargo();
        showGqCargoClickEvent();
    });
	
	
