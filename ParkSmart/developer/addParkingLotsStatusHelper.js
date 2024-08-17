parkSmart.FB_Collection_ParkLot_Status = "ParkingLotsStatus";
parkSmart.FB_Key_ParkLot_Status_name = "name";
parkSmart.FB_Key_ParkLot_Status_status = "status";
parkSmart.FB_Key_ParkLot_Status_status_availability = "availability";
parkSmart.FB_Key_ParkLot_Status_status_report_time = "report_time";
parkSmart.FB_Key_ParkLot_Status_status_report_reportor = "reportor";

const parkingLots = [{
    name: "Percopo Lot",
    status: [{
        availability: 0,
        report_time: firebase.firestore.FieldValue.serverTimestamp(),
        reportor: "ParkSmartTest"
    }]
},
{
    name: "Lakeside Lot",
    status: [{
        availability: 0,
        report_time: firebase.firestore.FieldValue.serverTimestamp(),
        reportor: "ParkSmartTest"
    }]
},
{
    name: "Apartment Lot",
    status: [{
        availability: 0,
        report_time: firebase.firestore.FieldValue.serverTimestamp(),
        reportor: "ParkSmartTest"
    }]
},
{
    name: "SRC West Lot",
    status: [{
        availability: 0,
        report_time: firebase.firestore.FieldValue.serverTimestamp(),
        reportor: "ParkSmartTest"
    }]
},
{
    name: "Cook Lot",
    status: [{
        availability: 0,
        report_time: firebase.firestore.FieldValue.serverTimestamp(),
        reportor: "ParkSmartTest"
    }]
},
{
    name: "Lower Moench Lot",
    status: [{
        availability: 0,
        report_time: firebase.firestore.FieldValue.serverTimestamp(),
        reportor: "ParkSmartTest"
    }]
},
{
    name: "Commuter Lot",
    status: [{
        availability: 0,
        report_time: firebase.firestore.FieldValue.serverTimestamp(),
        reportor: "ParkSmartTest"
    }]
},
{
    name: "Skinner Lot",
    status: [{
        availability: 0,
        report_time: firebase.firestore.FieldValue.serverTimestamp(),
        reportor: "ParkSmartTest"
    }]
},
{
    name: "Hatfield Lot Student",
    status: [{
        availability: 0,
        report_time: firebase.firestore.FieldValue.serverTimestamp(),
        reportor: "ParkSmartTest"
    }]
},
{
    name: "Hatfield Lot FacultyStaff",
    status: [{
        availability: 0,
        report_time: firebase.firestore.FieldValue.serverTimestamp(),
        reportor: "ParkSmartTest"
    }]
},
{
    name: "BSB Lot",
    status: [{
        availability: 0,
        report_time: firebase.firestore.FieldValue.serverTimestamp(),
        reportor: "ParkSmartTest"
    }]
},
{
    name: "Union Lot",
    status: [{
        availability: 0,
        report_time: firebase.firestore.FieldValue.serverTimestamp(),
        reportor: "ParkSmartTest"
    }]
},
{
    name: "Moench Lot",
    status: [{
        availability: 0,
        report_time: firebase.firestore.FieldValue.serverTimestamp(),
        reportor: "ParkSmartTest"
    }]
},
{
    name: "Facilities Lot",
    status: [{
        availability: 0,
        report_time: firebase.firestore.FieldValue.serverTimestamp(),
        reportor: "ParkSmartTest"
    }]
},
{
    name: "Myers Lot",
    status: [{
        availability: 0,
        report_time: firebase.firestore.FieldValue.serverTimestamp(),
        reportor: "ParkSmartTest"
    }]
}
];



var parkSmart = parkSmart || {};

const db = firebase.firestore();

function addParkingLotsStatus() {
    db.collection('serverTime').doc('time').set({
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        return db.collection('serverTime').doc('time').get();
    }).then((doc) => {
        const time = doc.data().timestamp;
        console.log(time);
        for (const lot of parkingLots) {

            const statusArray = lot.status.map(status => ({
                [parkSmart.FB_Key_ParkLot_Status_status_availability]: status.availability,
                [parkSmart.FB_Key_ParkLot_Status_status_report_time]: time,
                [parkSmart.FB_Key_ParkLot_Status_status_report_reportor]: status.reportor
            }));

            db.collection(parkSmart.FB_Collection_ParkLot_Status).doc(lot.name).set({
                    [parkSmart.FB_Key_ParkLot_Status_name]: lot.name,
                    [parkSmart.FB_Key_ParkLot_Status_status]: statusArray
                })
                .then(() => {
                    console.log(`Added ${lot.name} with initial status`);
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        }
    });
}
