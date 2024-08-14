// accountSetting.js

parkSmart.pageRedirects = function () {
	if (document.querySelector("#loginPage")) {
        console.log("You are on loginPage");
		if (parkSmart.authManager.isSignedIn) {
			console.log("You are Signed IN");
			window.location.href = "/account/myAccount.html";
		}
	}
	else {
		if (!parkSmart.authManager.isSignedIn) {
			console.log("You are NOT Signed in");
			window.location.href = "/account/login.html";
		}
	}
}
