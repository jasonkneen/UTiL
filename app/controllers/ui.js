(function constructor(args) {

	$.singleBtn.addEventListenerSingle(onSingleClick);
	$.onceBtn.addEventListenerOnce('click', onOnceClick);

})(arguments[0] || {});

function onSingleClick(e) {
	alert('I will now block for a while');

	for (var i = 0; i < 1000000; i++) {
		Ti.Platform.createUUID();
	}

	alert('You can now click me again');
}

function onOnceClick(e) {
	alert('You can not click me again');
}
