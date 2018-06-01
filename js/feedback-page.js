(function(mui, window, document, undefined) {
	mui.init();
	var get = function(id) {
		return document.getElementById(id);
	};
	var qsa = function(sel) {
		return [].slice.call(document.querySelectorAll(sel));
	};
	var ui = {
		question: get('question'),
		contact: get('contact'),
		imageList: get('image-list'),
		submit: get('submit')
	};
	ui.clearForm = function() {
		ui.question.value = '';
		ui.contact.value = '';
		ui.imageList.innerHTML = '';
		ui.newPlaceholder();
	};
	ui.getFileInputArray = function() {
		return [].slice.call(ui.imageList.querySelectorAll('input[type="file"]'));
	};
	ui.getFileInputIdArray = function() {
		var fileInputArray = ui.getFileInputArray();
		var idArray = [];
		fileInputArray.forEach(function(fileInput) {
			if(fileInput.value != '') {
				idArray.push(fileInput.getAttribute('id'));
			}
		});
		return idArray;
	};
	var imageIndexIdNum = 0;
	ui.newPlaceholder = function() {
		var fileInputArray = ui.getFileInputArray();
		if(fileInputArray &&
			fileInputArray.length > 0 &&
			fileInputArray[fileInputArray.length - 1].parentNode.classList.contains('space')) {
			return;
		}
		imageIndexIdNum++;
		var placeholder = document.createElement('div');
		placeholder.setAttribute('class', 'image-item space');
		placeholder.setAttribute('id', 'image-item');
		var closeButton = document.createElement('div');
		closeButton.setAttribute('class', 'image-close');
		closeButton.innerHTML = 'X';
		closeButton.addEventListener('click', function(event) {
			event.stopPropagation();
			event.cancelBubble = true;
			setTimeout(function() {
				ui.imageList.removeChild(placeholder);
			}, 0);
			return false;
		}, false);
		var fileInput = document.createElement('input');
		fileInput.setAttribute('type', 'file');
		fileInput.setAttribute('accept', 'image/*');
		fileInput.setAttribute('id', 'image-' + imageIndexIdNum);
		fileInput.addEventListener('change', function(event) {
			var file = fileInput.files[0];
			if(file) {
				var reader = new FileReader();
//				reader.onload = function() {
//					
//					//处理 android 4.1 兼容问题
//					var base64 = reader.result.split(',')[1];
//					var dataUrl = 'data:image/png;base64,' + base64;
//					//
//					placeholder.style.backgroundImage = 'url(' + dataUrl + ')';
//				}
				reader.onload = (function() {
					return function(e) {
						var img = new Image();
						img.src = e.target.result;
						img.onload = (function() {

							var canvas = document.createElement('canvas');
							canvas.width = 800;
							canvas.height = 800/(img.width/img.height);

							var ctx = canvas.getContext("2d");

							ctx.clearRect(0, 0, canvas.width, canvas.height); // canvas清屏  

							//重置canvans宽高 canvas.width = img.width; canvas.height = img.height;  
							
							ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // 将图像绘制到canvas上   

							var base64 = canvas.toDataURL("image/jpeg"); //必须等压缩完才读取canvas值，否则canvas内容是黑帆布  

							//处理 android 4.1 兼容问题
							var b64 = base64.split(',')[1];
							var dataUrl = 'data:image/png;base64,' + b64;
							//
							placeholder.style.backgroundImage = 'url(' + dataUrl + ')';
						});
					}
				})(file);
				reader.readAsDataURL(file);
				placeholder.classList.remove('space');
				ui.newPlaceholder();
			}
		}, false);
		placeholder.appendChild(closeButton);
		placeholder.appendChild(fileInput);
		ui.imageList.appendChild(placeholder);
	};
	ui.newPlaceholder();
	ui.submit.addEventListener('tap', function(event) {
		if(ui.question.value == '' ||
			(ui.contact.value != '' &&
				ui.contact.value.search(/^(\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+)|([1-9]\d{4,9})$/) != 0)) {
			return mui.toast('信息填写不符合规范');
		}
		plus.nativeUI.showWaiting();
		feedback.send({
			question: ui.question.value,
			contact: ui.contact.value,
			images: ui.getFileInputIdArray()
		}, function() {
			plus.nativeUI.closeWaiting();
			mui.toast('感谢您的建议~');
			ui.clearForm();
			mui.back();
		});
	}, false);
})(mui, window, document, undefined);