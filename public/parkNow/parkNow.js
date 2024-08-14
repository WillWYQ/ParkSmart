// parkNow.js
parkSmart.ParkNowManager = class {
    constructor() {
        console.log("ParkNowManager Created");
        this.init();
    }

    async init() {
        await this.populateParkingLots();
    }

    async populateParkingLots() {
        console.log("Create Lists");
        const parkingLotsContainer = document.querySelector('.parking-lots');

        // Clear existing entries
        parkingLotsContainer.innerHTML = '';

        // Check type and segregate data
        const studentLots = parkSmart.parkingLotsList.filter(lot => lot.type === "Student");
        const facultyLots = parkSmart.parkingLotsList.filter(lot => lot.type === "Faculty/Staff");

        console.log(parkSmart.parkingLotsList);

        // Function to create lot items
        const createLotItem = (lot) => {
            return `<div class="lot-item">
                        <span>${lot.name}</span>
                        <span>${lot.status} <i class="fas fa-chevron-right lot-arrow"></i></span>
                    </div>`;
        };

        // Append Student Lots
        if (studentLots.length > 0) {
            const studentHeader = `<div class="lot-type h3">Student Parking Lots</div>`;
            parkingLotsContainer.innerHTML += studentHeader;
            studentLots.forEach(lot => {
                parkingLotsContainer.innerHTML += createLotItem(lot);
                console.log(`Created Lot Item ${lot.name}`);
            });
        }

        // Append Faculty/Staff Lots
        if (facultyLots.length > 0) {
            const facultyHeader = `<div class="lot-type h3">Faculty/Staff Parking Lots</div>`;
            parkingLotsContainer.innerHTML += facultyHeader;
            facultyLots.forEach(lot => {
                parkingLotsContainer.innerHTML += createLotItem(lot);
                console.log(`Created Lot Item ${lot.name}`);
            });
        }
    }
};
