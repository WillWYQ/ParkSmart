// main.js
var parkSmart = parkSmart || {};

parkSmart.AuthManager = class {
	constructor() {
		console.log("AuthManager created");
		this._user = null;
	}

	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			changeListener();
		});
	}

	signOut() {
		firebase.auth().signOut().catch((error) => {
			console.log(error);
		});
	}
	get uid() { return this._user.uid; }
	get isSignedIn() { return !(!this._user); }
}

parkSmart.main = function () {
	console.log("Ready");

	parkSmart.authManager = new parkSmart.AuthManager();


	parkSmart.authManager.beginListening(() => {
		console.log("isSignedIn = ", parkSmart.authManager.isSignedIn);

	});
};

parkSmart.main();