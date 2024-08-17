// accountSetting.js
parkSmart.pageRedirects = function () {
	if (document.querySelector("#loginPage")) {
		console.log("You are on loginPage");
		if (parkSmart.authManager.isSignedIn) {
			console.log("You are Signed IN");
			window.location.href = "/account/myAccount.html";
		}
	} else {
		if (!parkSmart.authManager.isSignedIn) {
			console.log("You are NOT Signed in");
			window.location.href = "/account/login.html";
		}
	}
}

parkSmart.AccountPageManager = class {
	constructor() {
		console.log("AccountPageManager Created");

		document.querySelector("#logout").onclick = (event) => {
			parkSmart.authManager.signOut();
		}

	}

	updateView() {
		if (parkSmart.userInfo) {
			document.querySelector("#name").innerHTML = parkSmart.userInfo[parkSmart.FB_Key_name];
			document.querySelector("#email").innerHTML = parkSmart.userInfo[parkSmart.FB_Key_email];
			document.querySelector("#userPhoto").src = parkSmart.userInfo[parkSmart.FB_Key_photo] || "/pic/Rose-Hulman-ParkSmart.png";
		}
	}

	pageRedirects() {
		if (document.querySelector("#loginPage")) {
			console.log("You are on loginPage");
			if (parkSmart.authManager.isSignedIn) {
				console.log("You are Signed IN");
				window.location.href = "/account/myAccount.html";
			}
		} else {
			if (!parkSmart.authManager.isSignedIn) {
				console.log("You are NOT Signed in");
				window.location.href = "/account/login.html";
			}
		}
	}
}

parkSmart.EditAccountPageManager = class {
	constructor() {
		console.log("AccountPageManager Created");
		
	}

	updateView() {
		if (parkSmart.userInfo) {
			document.querySelector("#name").innerHTML = parkSmart.userInfo[parkSmart.FB_Key_name];
			document.querySelector("#email").innerHTML = parkSmart.userInfo[parkSmart.FB_Key_email];
			document.querySelector("#userPhoto").src = parkSmart.userInfo[parkSmart.FB_Key_photo] || "/pic/Rose-Hulman-ParkSmart.png";
		}
	}


}