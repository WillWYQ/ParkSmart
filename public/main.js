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
parkSmart.Key_ParkLot_Info_type_student = "Student";
parkSmart.Key_ParkLot_Info_type_FS = "Faculty/Staff";
parkSmart.Key_ParkLot_Info_type_student_Total = "studentTotal";
parkSmart.Key_ParkLot_Info_type_FS_Total = "fsTotal";

parkSmart.parkingLotsList = [];

parkSmart.FB_Collection_ParkLot_Status = "ParkingLotsStatus";
parkSmart.FB_Key_ParkLot_Status_name = "Name";
parkSmart.FB_Key_ParkLot_Status_status = "Status";
parkSmart.FB_Key_ParkLot_Status_status_availability = "Availability";
parkSmart.FB_Key_ParkLot_Status_status_report_time = "Report_time";
parkSmart.FB_Key_ParkLot_Status_status_report_reportor = "Reportor";


parkSmart.parkLotManager = null;
parkSmart.authManager = null;

parkSmart.statusError = {
    [parkSmart.FB_Key_ParkLot_Status_status_availability]: "Error",
    [parkSmart.FB_Key_ParkLot_Status_status_report_time]: "Error",
    [parkSmart.FB_Key_ParkLot_Status_status_report_reportor]: "Error"
};

//online reseouce
function convertTimestampToReadableTime(timestamp) {
    console.log("converting", timestamp, "To Readable Time");
    // Convert seconds to milliseconds
    const millisecondsFromSeconds = timestamp.seconds * 1000;
    // Convert nanoseconds to milliseconds
    const millisecondsFromNanoseconds = timestamp.nanoseconds / 1000000;
    // Get total milliseconds
    const totalMilliseconds = millisecondsFromSeconds + millisecondsFromNanoseconds;
    // Create a new Date object
    const date = new Date(totalMilliseconds);
    // Convert to readable time
    return date.toLocaleString();
}

function getServerTime() {
    return db.collection('serverTime').doc('time').set({
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        return db.collection('serverTime').doc('time').get();
    }).then((doc) => {
        return doc.data().timestamp;
    }).catch((error) => {
        console.error("Error getting server time: ", error);
        return null;
    });
}

parkSmart.updateRule = function () {
    getServerTime().then(
        (serverTime) => {
            if (serverTime) {

                const date = serverTime.toDate();

                const estTimeString = date.toLocaleString("en-US", {
                    timeZone: "America/New_York"
                });

                const estDate = new Date(estTimeString);

                const day = estDate.getDay();
                const hour = estDate.getHours();

                document.querySelector("#timeNow").textContent = estDate.toLocaleString();

                var parkingLotElement = document.querySelector("#parkLotRule");

                if (day >= 1 && day <= 5 && hour >= 8 && hour < 17) {
                    parkingLotElement.textContent = "Student Parking Lot";
                } else {
                    parkingLotElement.textContent = "Any Parking Lot";
                }

            }
        }).catch((error) => {
        console.error("Error updating rule based on server time: ", error);
    });
}

parkSmart.basicPageUpdateView = function () {
    const bodyId = document.body.id;
    console.log("bodyId", bodyId);
    const linkMap = {
        noticePage: 'noticeLink',
        parkNowPage: 'parkNowLink',
        homePage: 'homeLink',
        historyTrendPage: 'historyTrendLink',
        accountPage: 'accountLink'
    };

    const subPageMap = {
        parkNowSubPage: 'parkNowLink',
    }

    const activeLinkId = linkMap[bodyId];
    if (activeLinkId) {
        document.getElementById(activeLinkId).classList.add('active');
    }
}

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
                        parkSmart.userInfo = doc.data();
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

    updateProfilePic(profilePicUrl) {
        const userDocRef = db.collection(parkSmart.FB_Collection_user).doc(this._user.uid);
        return userDocRef.update({
                [parkSmart.FB_Key_photo]: profilePicUrl
            })
            .catch((error) => {
                console.error("Error updating profile picture: ", error);
                alert("Failed to update profile picture. Please try again.");
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
        this.loadParkingLotsFromSession()
            .then(() => {
                if (parkSmart.parkingLotsList.length === 0) {
                    console.log("Parking lots list is empty, updating from Firestore...");
                    this._studentTotalSpots = 0;
                    this._fsTotalSpots = 0;
                    this.totalSpots = 0;
                    this.updateParkingLots();
                }
            })
            .catch(() => {
                console.log("No stored lots found, updating from Firestore...");
                this.updateParkingLots();
            });
    }

    updateParkingLots() {
        return new Promise((resolve, reject) => {
            console.log("Updating ParkingLots from Firebase");
            parkSmart.parkingLotsList = [];
            this._studentTotalSpots = 0;
            this._fsTotalSpots = 0;
            db.collection(parkSmart.FB_Collection_ParkLot_Info).get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        parkSmart.parkingLotsList.push({
                            [parkSmart.FB_Key_ParkLot_Info_map]: data[parkSmart.FB_Key_ParkLot_Info_map],
                            [parkSmart.FB_Key_ParkLot_Info_name]: data[parkSmart.FB_Key_ParkLot_Info_name],
                            [parkSmart.FB_Key_ParkLot_Info_location]: data[parkSmart.FB_Key_ParkLot_Info_location],
                            [parkSmart.FB_Key_ParkLot_Info_status]: data[parkSmart.FB_Key_ParkLot_Info_status],
                            [parkSmart.FB_Key_ParkLot_Info_total]: data[parkSmart.FB_Key_ParkLot_Info_total],
                            [parkSmart.FB_Key_ParkLot_Info_type]: data[parkSmart.FB_Key_ParkLot_Info_type],
                            [parkSmart.FB_Key_ParkLot_Status_status_report_time]: 0,
                            [parkSmart.FB_Key_ParkLot_Status_status_report_reportor]: 0,
                            [parkSmart.FB_Key_ParkLot_Status_status_availability]: 0
                        });
                        console.log(`Get Lot Item ${data[parkSmart.FB_Key_ParkLot_Info_name]}`);

                        if (data[parkSmart.FB_Key_ParkLot_Info_type] == parkSmart.Key_ParkLot_Info_type_student) {
                            this._studentTotalSpots += data[parkSmart.FB_Key_ParkLot_Info_total];
                        }
                        if (data[parkSmart.FB_Key_ParkLot_Info_type] == parkSmart.Key_ParkLot_Info_type_FS) {
                            this._fsTotalSpots += data[parkSmart.FB_Key_ParkLot_Info_total];
                        }
                    });
                    this.saveParkingLotsToSession();
                    resolve();
                })
                .catch((error) => {
                    console.error("Error updating parking lots: ", error);
                    reject(error);
                });
        });
    }


    loadParkingLotsFromSession() {
        return new Promise((resolve, reject) => {
            try {
                const storedLots = sessionStorage.getItem('parkingLotsList');
                if (storedLots) {
                    parkSmart.parkingLotsList = JSON.parse(storedLots);
                    console.log("Loaded parking lots from session storage");
                    resolve();
                } else {
                    this.updateParkingLots()
                        .then(() => {
                            resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        });
                }
                const avaStuLitstStore = sessionStorage.getItem(parkSmart.Key_ParkLot_Info_type_student_Total);
                const avaFSLitstStore = sessionStorage.getItem(parkSmart.Key_ParkLot_Info_type_FS_Total);
                if (avaStuLitstStore) {
                    this._studentTotalSpots = JSON.parse(avaStuLitstStore);
                }
                if (avaFSLitstStore) {
                    this._fsTotalSpots = JSON.parse(avaFSLitstStore);
                }
                this._totalSpots = this._fsTotalSpots + this._studentTotalSpots;
            } catch (error) {
                console.error("Error loading parking lots from session storage: ", error);
                reject(error);
            }
        });
    }


    saveParkingLotsToSession() {
        sessionStorage.setItem('parkingLotsList', JSON.stringify(parkSmart.parkingLotsList));
        sessionStorage.setItem(parkSmart.Key_ParkLot_Info_type_student_Total, JSON.stringify(this._studentTotalSpots));
        sessionStorage.setItem(parkSmart.Key_ParkLot_Info_type_FS_Total, JSON.stringify(this._fsTotalSpots));
        console.log("Saved parking lots to session storage");
    }

    getInfoForParkNow(changeListener) {
        this.loadParkingLotsFromSession().then(() => {
            const promises = parkSmart.parkingLotsList.map(lot => {
                return this.getLatestStatus(lot).then(() => {
                    console.log("Got Latest Status for", lot[parkSmart.FB_Key_ParkLot_Info_name]);
                }).catch(error => {
                    console.error("Error getting status for lot:", lot[parkSmart.FB_Key_ParkLot_Info_name], error);
                });
            });

            Promise.all(promises).then(() => {
                console.log("Got Latest Status for all lots");
                changeListener(); // Call the callback only after all promises are resolved
            }).catch(error => {
                console.error("Error in getting the latest status for all lots:", error);
            });
        }).catch(error => {
            console.error("Error loading parking lots from session: ", error);
        });
    }

    getInfoForMain(changeListener) {
        this.loadParkingLotsFromSession().then(() => {
            const promises = parkSmart.parkingLotsList.map(lot => {
                return this.getLatestStatus(lot).then(() => {
                    console.log("Got Latest Status for", lot[parkSmart.FB_Key_ParkLot_Info_name]);
                }).catch(error => {
                    console.error("Error getting status for lot:", lot[parkSmart.FB_Key_ParkLot_Info_name], error);
                });
            });

            Promise.all(promises).then(() => {
                console.log("Got Latest Status for all lots");
                this.findLotsWithAvailability();
                this.findStudentLotsWithAvailability();
                this.findFSLotsWithAvailability();
                changeListener();
            }).catch(error => {
                console.error("Error in getting the latest status for all lots:", error);
            });
        }).catch(error => {
            console.error("Error loading parking lots from session: ", error);
        });
    }

    updateParkingLotStatus(lotName, availability, reportor, changeListener) {
        console.log(`Updating ${lotName} with ${availability} available by ${reportor}`);

        // Set the server timestamp
        db.collection('serverTime').doc('time').set({
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            return db.collection('serverTime').doc('time').get();
        }).then((doc) => {
            const serverTimestamp = doc.data().timestamp;
            const statusUpdate = {
                [parkSmart.FB_Key_ParkLot_Status_status_availability]: availability,
                [parkSmart.FB_Key_ParkLot_Status_status_report_time]: serverTimestamp,
                [parkSmart.FB_Key_ParkLot_Status_status_report_reportor]: reportor
            };

            const docRef = db.collection(parkSmart.FB_Collection_ParkLot_Status).doc(lotName);

            return docRef.update({
                [parkSmart.FB_Key_ParkLot_Status_status]: firebase.firestore.FieldValue.arrayUnion(statusUpdate),
            });
        }).then(() => {
            console.log(`Updated ${lotName} with new status.`);
            const lot = parkSmart.parkingLotsList.find(lot => lot[parkSmart.FB_Key_ParkLot_Info_name] === lotName);
            if (lot) {
                return this.getLatestStatus(lot).then(() => {
                    console.log("Got Latest Status for", lotName);
                }).catch(error => {
                    console.error("Error getting status for lot:", lotName, error);
                });
            } else {
                console.error("Lot not found:", lotName);
                return Promise.reject("Lot not found");
            }
        }).then(() => {
            console.log("Saving updated lot information to session");
            this.saveParkingLotsToSession();
            if (changeListener) {
                changeListener();
            }
        }).catch((error) => {
            console.error("Error updating document or getting latest status:", error);
        });
    }

    getLatestStatus(lot) {
        return new Promise((resolve, reject) => {
            const docRef = db.collection(parkSmart.FB_Collection_ParkLot_Status).doc(lot[parkSmart.FB_Key_ParkLot_Info_name]);
            docRef.get().then((doc) => {
                    if (doc.exists) {
                        const data = doc.data();
                        const status = data[parkSmart.FB_Key_ParkLot_Status_status];
                        const latestStatus = status && status.length > 0 ? status[(status.length - 1)] : parkSmart.statusError;
                        // console.log(latestStatus);
                        if (latestStatus) {
                            console.log(`Latest status for ${lot[parkSmart.FB_Key_ParkLot_Info_name]}:`, latestStatus);
                            lot[parkSmart.FB_Key_ParkLot_Status_status_report_time] = latestStatus[parkSmart.FB_Key_ParkLot_Status_status_report_time];
                            lot[parkSmart.FB_Key_ParkLot_Status_status_report_reportor] = latestStatus[parkSmart.FB_Key_ParkLot_Status_status_report_reportor];
                            lot[parkSmart.FB_Key_ParkLot_Status_status_availability] = latestStatus[parkSmart.FB_Key_ParkLot_Status_status_availability];
                        } else {
                            console.log(`No status found for ${lot[parkSmart.FB_Key_ParkLot_Info_name]}.`);

                        }
                    } else {
                        console.log(`No document found for ${lot[parkSmart.FB_Key_ParkLot_Info_name]}.`);

                    }
                }).catch((error) => {
                    console.error("Error getting document:", error);

                }).then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    console.error("Error fetching status:", error);
                    reject(error);
                });
        });



    }

    findLotsWithAvailability() {
        this._availableLots = parkSmart.parkingLotsList.filter(lot => {
            return lot[parkSmart.FB_Key_ParkLot_Status_status_availability] > 0;
        });
    }
    findStudentLotsWithAvailability() {
        this.findLotsWithAvailability();
        this._availableStudentLots = this._availableLots.filter(lot => lot[parkSmart.FB_Key_ParkLot_Info_type] === parkSmart.Key_ParkLot_Info_type_student);
    }

    findFSLotsWithAvailability() {
        this.findLotsWithAvailability();
        this._availableFSLots = this._availableLots.filter(lot => lot[parkSmart.FB_Key_ParkLot_Info_type] === parkSmart.Key_ParkLot_Info_type_FS);
    }

    get lotsWithAvailability() {
        return this._availableLots;
    }
    get studentLotsWithAvailability() {
        return this._availableStudentLots;
    }
    get fslotsWithAvailability() {
        return this._availableFSLots;
    }


    get studentTotalSpots() {
        console.log("Student total spot", this._studentTotalSpots);
        return this._studentTotalSpots;
    }

    get fsTotalSpots() {

        console.log("fs total spot", this._fsTotalSpots);
        return this._fsTotalSpots;
    }

    get totalSpots() {
        return this._studentTotalSpots + this._fsTotalSpots;
    }

};

parkSmart.main = function () {
    console.log("Ready");

    parkSmart.authManager = parkSmart.authManager || new parkSmart.AuthManager();

    parkSmart.authManager.beginListening(() => {
        console.log("isSignedIn = ", parkSmart.authManager.isSignedIn);

    });

    parkSmart.parkLotManager = parkSmart.parkLotManager || new parkSmart.ParkLotManager();

    fetch('/bottomNav.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
        }).then(() => {
            parkSmart.basicPageUpdateView();
        })

};

parkSmart.main();