// main.js
var parkSmart = parkSmart || {};

parkSmart.FB_Collection_user = "User";
parkSmart.FB_Key_email = "email";
parkSmart.FB_Key_username = "username";
parkSmart.FB_Key_group = "group";
parkSmart.FB_Key_name = "name";
parkSmart.FB_Key_photo = "photo";
parkSmart.userInfo = null;


parkSmart.AuthManager = class {
	constructor() {
		console.log("AuthManager created");
		this._user = null;
		parkSmart.userInfo = null;
	}

	beginListening(changeListener) {
        firebase.auth().onAuthStateChanged((user) => {
            this._user = user;
            if (user) {
                const userDocRef = db.collection(parkSmart.FB_Collection_user).doc(this._user.uid);
                userDocRef.get().then((doc) => {
                    if (doc.exists) {
                        parkSmart.userInfo = doc.data(); // Store the user data
                        changeListener();
                    } else {
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });
            } else {
                changeListener();
            }
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