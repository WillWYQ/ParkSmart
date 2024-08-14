const parkingLots = [{
        name: "Percopo Lot",
        type: "Student",
        location: new firebase.firestore.GeoPoint(39.481658928727136, -87.32874920894037),
        status: "Open",
        totalSpace: 150,
        googleMapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1539.7289000306298!2d-87.32976308392502!3d39.48157612050148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886d6e4680f749e5%3A0x4a90ff6065d7224d!2sParking%20lot%2C%20Rose%20Hulman%20Institute%20Rd%2C%20Terre%20Haute%2C%20IN%2047803!5e0!3m2!1szh-CN!2sus!4v1723668065982!5m2!1szh-CN!2sus"
    },
    {
        name: "Lakeside Lot",
        type: "Student",
        location: new firebase.firestore.GeoPoint(39.48221016315105, -87.3307890128089),
        status: "Open",
        totalSpace: 100,
        googleMapLink: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1216.4354297476475!2d-87.3305813453331!3d39.482376987423066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1szh-CN!2sus!4v1723668107117!5m2!1szh-CN!2sus"
    },
    {
        name: "Apartment Lot",
        type: "Student",
        location: new firebase.firestore.GeoPoint(39.483381195665, -87.33090344182617),
        status: "Open",
        totalSpace: 200,
        googleMapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1216.4354297476475!2d-87.3305813453331!3d39.482376987423066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886d6e458df90949%3A0x4ae319e59d135df!2sStudent%20Parking%2C%20Rose%20Hulman%20Institute%20Rd%2C%20Terre%20Haute%2C%20IN%2047803!5e0!3m2!1szh-CN!2sus!4v1723668198462!5m2!1szh-CN!2sus"
    },
    {
        name: "SRC West Lot",
        type: "Student",
        location: new firebase.firestore.GeoPoint(39.48488911635312, -87.32910224429983),
        status: "Open",
        totalSpace: 180,
        googleMapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1216.3982416664571!2d-87.3291573397526!3d39.484503144116665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886d6e4503987f7b%3A0x23c5b1a9b6215b7e!2sParking%20lot%2C%20National%20Rd%20Heritage%20Trail%20(Terre%20Haute)%2C%20Terre%20Haute%2C%20IN%2047803!5e0!3m2!1szh-CN!2sus!4v1723668248552!5m2!1szh-CN!2sus"
    },
    {
        name: "Cook Lot",
        type: "Student",
        location: new firebase.firestore.GeoPoint(39.48472568922449, -87.32529096589627),
        status: "Open",
        totalSpace: 120,
        googleMapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1216.396752030168!2d-87.32682092423838!3d39.48458830919863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886d6e430dbb4d77%3A0xd91fcc55fd683fd5!2sParking%20lot%2C%20Terre%20Haute%2C%20IN%2047803!5e0!3m2!1szh-CN!2sus!4v1723668358474!5m2!1szh-CN!2sus"
    },
    {
        name: "Lower Moench Lot",
        type: "Student",
        location: new firebase.firestore.GeoPoint(39.48485979803976, -87.32326514842522),
        status: "Open",
        totalSpace: 90,
        googleMapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1216.39320482918!2d-87.32443486726851!3d39.48479110819321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886d6e42f03b7835%3A0x941cdfc7373841a!2sBranam%20Innovation%20Center%20Parking%2C%20Terre%20Haute%2C%20IN%2047803!5e0!3m2!1szh-CN!2sus!4v1723668410763!5m2!1szh-CN!2sus"
    },
    {
        name: "Commuter Lot",
        type: "Student",
        location: new firebase.firestore.GeoPoint(39.48503863451619, -87.31735868383271),
        status: "Open",
        totalSpace: 300,
        googleMapLink: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1818.3256684167727!2d-87.31891717713243!3d39.48475015016431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1szh-CN!2sus!4v1723668452702!5m2!1szh-CN!2sus"
    },
    {
        name: "Skinner Lot",
        type: "Student",
        location: new firebase.firestore.GeoPoint(39.48237377590062, -87.32093181485696),
        status: "Open",
        totalSpace: 80,
        googleMapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2432.7948388622117!2d-87.32162282397863!3d39.48456308204464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886d6e69e506c761%3A0xf44a66ef2b7d1895!2sParking%20lot%2C%20US-40%2C%20Terre%20Haute%2C%20IN%2047803!5e0!3m2!1szh-CN!2sus!4v1723668509161!5m2!1szh-CN!2sus"
    },
    {
        name: "Hatfield Lot Student",
        type: "Both",
        location: new firebase.firestore.GeoPoint(39.48250234795946, -87.32133463232599),
        status: "Open",
        totalSpace: 160,
        googleMapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d330.4847911405788!2d-87.32146052697674!3d39.48258229687091!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886d6e69e2604539%3A0x9130942706e09867!2sParking%20lot%2C%20US-40%2C%20Terre%20Haute%2C%20IN%2047803!5e0!3m2!1szh-CN!2sus!4v1723668570921!5m2!1szh-CN!2sus"
    },
    {
        name: "Hatfield Lot FacultyStaff",
        type: "Both",
        location: new firebase.firestore.GeoPoint(39.48250234795946, -87.32133463232599),
        status: "Open",
        totalSpace: 160,
        googleMapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d330.4847911405788!2d-87.32146052697674!3d39.48258229687091!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886d6e69e2604539%3A0x9130942706e09867!2sParking%20lot%2C%20US-40%2C%20Terre%20Haute%2C%20IN%2047803!5e0!3m2!1szh-CN!2sus!4v1723668570921!5m2!1szh-CN!2sus"
    },
    {
        name: "BSB Lot",
        type: "Faculty/Staff",
        location: new firebase.firestore.GeoPoint(39.48154531614755, -87.32569906288602),
        status: "Open",
        totalSpace: 50,
        googleMapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d947.8069318800208!2d-87.32637601126416!3d39.48213152048484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886d6e415ed50963%3A0xce0c40b806f2b659!2sParking%20lot%2C%20Rose%20Hulman%20Institute%20Rd%2C%20Terre%20Haute%2C%20IN%2047803!5e0!3m2!1szh-CN!2sus!4v1723668601898!5m2!1szh-CN!2sus"
    },
    {
        name: "Union Lot",
        type: "Faculty/Staff",
        location: new firebase.firestore.GeoPoint(39.48418348995609, -87.32779123683216),
        status: "Open",
        totalSpace: 7,
        googleMapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d947.7790021764316!2d-87.32795634619268!3d39.48418094132747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886d6e445fcaccb1%3A0x7222e1ba2c17fc10!2sParking%20lot%2C%20Terre%20Haute%2C%20IN%2047803!5e0!3m2!1szh-CN!2sus!4v1723668636355!5m2!1szh-CN!2sus"
    },
    {
        name: "Moench Lot",
        type: "Faculty/Staff",
        location: new firebase.firestore.GeoPoint(39.484349888952266, -87.32359948899516),
        status: "Open",
        totalSpace: 60,
        googleMapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d947.7755187400563!2d-87.32374478523529!3d39.48443654206422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886d6e42f861ea8f%3A0xa94eaa1c16a0d067!2sVisitors%20Tailgate%20Area%2C%20Terre%20Haute%2C%20IN%2047803!5e0!3m2!1szh-CN!2sus!4v1723668673042!5m2!1szh-CN!2sus"
    },
    {
        name: "Facilities Lot",
        type: "Faculty/Staff",
        location: new firebase.firestore.GeoPoint(39.48470414657371, -87.32194839538995),
        status: "Open",
        totalSpace: 40,
        googleMapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d947.7768386229052!2d-87.32361930211842!3d39.48433969446164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886d6e428f484a65%3A0xe330d0ca0c95fc8c!2sFacilities%20Operations%20Parking%2C%20Terre%20Haute%2C%20IN%2047803!5e0!3m2!1szh-CN!2sus!4v1723668753985!5m2!1szh-CN!2sus"
    },
    {
        name: "Myers Lot",
        type: "Faculty/Staff",
        location: new firebase.firestore.GeoPoint(39.48403640768156, -87.32225549880052),
        status: "Open",
        totalSpace: 40,
        googleMapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d947.7768386229052!2d-87.32361930211842!3d39.48433969446164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886d6e4287f7cb1b%3A0xc4a35d1f29b3247c!2sMyers%20Hall%20Parking%2C%20Terre%20Haute%2C%20IN%2047803!5e0!3m2!1szh-CN!2sus!4v1723668773013!5m2!1szh-CN!2sus"
    }
];

var parkSmart = parkSmart || {};

parkSmart.FB_Collection_ParkLot_Info = "ParkingLotsInfo";
const db = firebase.firestore();
// Function to add parking lots to the Firestore database
function addParkingLots() {
    for (const lot of parkingLots) {
        db.collection(parkSmart.FB_Collection_ParkLot_Info).doc(lot.name).set({
                "Google Map Link": lot.googleMapLink,
                "Name": lot.name,
                "Location": lot.location,
                "Status": lot.status,
                "Total Space": lot.totalSpace,
                "Type": lot.type
            })
            .then(() => {
                console.log(`Added ${lot.name}`);
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });

    }
}