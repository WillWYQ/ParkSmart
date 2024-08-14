// main.js
var parkSmart = parkSmart || {};


const db = firebase.firestore();

parkSmart.FB_Collection_user = "User";
parkSmart.FB_Key_email = "email";
parkSmart.FB_Key_username = "username";
parkSmart.FB_Key_group = "group";
parkSmart.FB_Key_name = "name";
parkSmart.FB_Key_photo = "photo";
parkSmart.userInfo = null;

parkSmart.FB_Collection_ParkLot_Info = "ParkingLotsInfo";
parkSmart.FB_Key_ParkLot_Info_map = "Google Map Link";
parkSmart.FB_Key_ParkLot_Info_name = "Name";
parkSmart.FB_Key_ParkLot_Info_location = "Location";
parkSmart.FB_Key_ParkLot_Info_status = "Status";
parkSmart.FB_Key_ParkLot_Info_total = "Total Space";
parkSmart.FB_Key_ParkLot_Info_type = "Type";
parkSmart.parkingLotsList = [];

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

    get uid() {
        return this._user.uid;
    }
    get isSignedIn() {
        return !(!this._user);
    }

}
parkSmart.ParkLotManager = class {
    constructor() {
        console.log("ParkLotManager Created");
        parkSmart.parkingLotsList = [];
        this.updateParkingLots();
    }

    async updateParkingLots() {
        try {
            const snapshot = await db.collection(parkSmart.FB_Collection_ParkLot_Info).get();
            snapshot.forEach((doc) => {
                const data = doc.data();
                parkSmart.parkingLotsList.push({
                    googleMapLink: data[parkSmart.FB_Key_ParkLot_Info_map],
                    name: data[parkSmart.FB_Key_ParkLot_Info_name],
                    location: data[parkSmart.FB_Key_ParkLot_Info_location],
                    status: data[parkSmart.FB_Key_ParkLot_Info_status],
                    totalSpace: data[parkSmart.FB_Key_ParkLot_Info_total],
                    type: data[parkSmart.FB_Key_ParkLot_Info_type]
                });
                console.log(`Get Lot Item ${data[parkSmart.FB_Key_ParkLot_Info_name]}`);
            });

            new parkSmart.ParkNowManager();
        } catch (error) {
            console.error("Error updating parking lots: ", error);
        }
    }
};

parkSmart.main = function () {
    console.log("Ready");

    parkSmart.authManager = parkSmart.authManager ||  new parkSmart.AuthManager() ;

    parkSmart.authManager.beginListening(() => {
        console.log("isSignedIn = ", parkSmart.authManager.isSignedIn);

    });

    parkSmart.parkLotManager = parkSmart.parkLotManager || new parkSmart.ParkLotManager();
};


parkSmart.main();

