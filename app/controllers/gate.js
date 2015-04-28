var gate = require('gate');

(function constructor(args) {

	showStatus();

	// Optionally override settings
	gate.locked = true; // Lock/Unlock gate
	gate.from = 1; // Minimum for random 'x'
	gate.to = 10; // Maximum for random 'y'

	// Optionally override texts (also via i18n)
	gate.title = 'Checking your IQ'; // gate_title
	gate.message = 'How much is %s ?'; // gate_message
	gate.button = 'Try'; // gate_button
	gate.error_title = 'You failed big time!'; // gate_error_title
	gate.error_message = 'No, you stupid! It was %s !'; // gate_error_message
	gate.error_button = 'OK'; // gate_error_button

})(arguments[0] || {});

function onKeeperClick() {

	gate.keeper(function (success) {

		// Returns TRUE if the gate was unlocked or question was answered OK
		if (success) {
			alert('This alert is something for adults only.');
		}

		// On FALSE an error dialog will be shown
		// No further action needed in most cases
	});

}

function onToggleClick() {

	gate.toggle(function (locked) {
		// Returns TRUE if gate is now locked
		// Presents question only to unlock, not to lock

		showStatus(locked);
	});
}

function showStatus(locked) {

	if (arguments.length === 0) {
		locked = gate.locked;
	}

	$.statusLabel.text = locked ? 'Locked' : 'Unlocked';
}
