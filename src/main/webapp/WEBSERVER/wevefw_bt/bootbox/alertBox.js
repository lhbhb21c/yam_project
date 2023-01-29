// 알림톡전송 확인
function alertSNS() {

	var dialog  = bootbox.dialog({
		message: '<p class="text-center">알림톡전송 되었습니다.</p>',
		size: 'small',
		closeButton: false
		//backdrop: true
	});

	dialog.init(function() {
		setTimeout(function() {
			dialog.modal('hide');
		}, 1500);
	});
	
}

// 저장 등 처리 건수 확인
function alertDoneCount(value) {

	var dialog  = bootbox.dialog({
		message: '<p class="text-center">' + value + '건 처리하였습니다.</p>',
		size: 'small',
		closeButton: false
		//backdrop: true
	});

	dialog.init(function() {
		setTimeout(function() {
			dialog.modal('hide');
		}, 1500);
	});
	
}

// 단순메시지 확인
function alertMessage(value) {

	var dialog  = bootbox.dialog({
		message: '<p class="text-center">' + value + '</p>',
		size: 'small',
		closeButton: false
	});

	dialog.init(function() {
		setTimeout(function() {
			dialog.modal('hide');
		}, 1500);
	});
}


// 메시지 확인 및 콜백함수 실행
function alertMessageToFunc(title, value, callbackFunc) {
	
	var dialog = bootbox.dialog({
	    title: title,
	    message: value,
	    size: 'large',
	    buttons: {
	        ok: {
	            label: "확인",
	            className: 'btn-info',
	            callback: callbackFunc
	        }
	    }
	});
	
}
