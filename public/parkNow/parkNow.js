// parkNow.js
parkSmart.ParkNowManager = class {
    constructor(showStudent, showFS) {
        console.log("ParkNowManager Created");
        parkSmart.parkLotManager.getInfoForParkNow(this.populateParkingLots.bind(this));
        this.showStudent = showStudent;
        this.showFS = showFS;
        parkSmart.updateRule();
        this.lotList = parkSmart.parkingLotsList;
    }

    populateParkingLots() {
        console.log("Create Lists");
        const parkingLotsContainer = document.querySelector('.parking-lots');

        parkingLotsContainer.innerHTML = '';

        const studentLots = this.lotList.filter(lot => lot[parkSmart.FB_Key_ParkLot_Info_type] === parkSmart.Key_ParkLot_Info_type_student);
        const facultyLots = this.lotList.filter(lot => lot[parkSmart.FB_Key_ParkLot_Info_type] === parkSmart.Key_ParkLot_Info_type_FS);

        const createLotItem = (lot) => {
            console.log(lot);
            console.log(Object.keys(lot));

            console.log(lot[parkSmart.FB_Key_ParkLot_Status_status_availability]);

            const pre = (lot[parkSmart.FB_Key_ParkLot_Status_status_availability] / lot[parkSmart.FB_Key_ParkLot_Info_total] * 100).toFixed(2);
            console.log("pre =", pre);

            return `<div class="lot-item" onclick="window.open('/parkNow/detail.html?id=${lot[parkSmart.FB_Key_ParkLot_Info_name]}','_self')">
                        <span>${lot[parkSmart.FB_Key_ParkLot_Info_name]}</span>
                        <span>${lot[parkSmart.FB_Key_ParkLot_Info_status]} ${pre}% <i class="fas fa-chevron-right lot-arrow"></i></span>
                    </div>`;
        };

        // Append Student Lots
        if ((studentLots.length > 0) && this.showStudent) {
            const studentHeader = `<div class="lot-type h3">Student Parking Lots</div>`;
            parkingLotsContainer.innerHTML += studentHeader;
            studentLots.forEach(lot => {
                parkingLotsContainer.innerHTML += createLotItem(lot);
                console.log(`Created Lot Item ${lot[parkSmart.FB_Key_ParkLot_Info_name]}`);
            });
        }

        // Append Faculty/Staff Lots
        if ((facultyLots.length > 0) && this.showFS) {
            const facultyHeader = `<div class="lot-type h3">Faculty/Staff Parking Lots</div>`;
            parkingLotsContainer.innerHTML += facultyHeader;
            facultyLots.forEach(lot => {
                parkingLotsContainer.innerHTML += createLotItem(lot);
                console.log(`Created Lot Item ${lot[parkSmart.FB_Key_ParkLot_Info_name]}`);
            });
        }
    }

    

    filterParkingLotsBySearch(query) {
        console.log("Filting ", query);
        if (query.trim() === "") {
            this.lotList = parkSmart.parkingLotsList;
        } else {
            this.lotList = parkSmart.parkingLotsList.filter(lot => {
                return lot[parkSmart.FB_Key_ParkLot_Info_name].toLowerCase().includes(query);
            });


        }
        this.populateParkingLots();
    }
}


parkSmart.ParkNowDetailManager = class {
    constructor(id) {
        console.clear();
        this.lot = null;
        this.id = id;
        console.log(this.id);
        parkSmart.parkLotManager.getInfoForParkNow(() => {
            this.setAndDisplayLot();
        });
        this.feelingProbabilities;
    }

    setAndDisplayLot() {
        // console.log("Available Parking Lots:", parkSmart.parkingLotsList);

        this.lot = parkSmart.parkingLotsList.find(lot => {
            console.log(`Comparing lot name: ${lot[parkSmart.FB_Key_ParkLot_Info_name]} with id: ${this.id}`);
            return lot[parkSmart.FB_Key_ParkLot_Info_name] === this.id;
        });

        if (this.lot) {
            console.log("Found this lot:", this.lot, "total Space is", this.lot[parkSmart.FB_Key_ParkLot_Info_total], "availability is ", this.lot[parkSmart.FB_Key_ParkLot_Status_status_availability]);
            this.feelingProbabilities = {
                'Empty': this.lot[parkSmart.FB_Key_ParkLot_Info_total],
                'Some Car Parked': parseInt(this.lot[parkSmart.FB_Key_ParkLot_Info_total] * 0.75),
                'Half and Half': parseInt(this.lot[parkSmart.FB_Key_ParkLot_Info_total] * 0.55),
                'Almost Full...': parseInt(this.lot[parkSmart.FB_Key_ParkLot_Info_total] * 0.25),
                'Maybe 1': 1,
                'No Spot': 0
            };
        } else {
            console.error("No matching parking lot found.");
        }

        this.updateView();
    }

    updateStatusHelper() {
        const selectedFeeling = document.getElementById("feelings").value;
        const detailNumber = document.getElementById("detailNumber").value;

        if (!selectedFeeling && !detailNumber) {
            this.triggerAlert("Please select a feeling or enter a detail number.", "danger");
            return;
        }

        let availability;
        if (detailNumber) {
            availability = detailNumber;

        } else {
            availability = this.feelingProbabilities[selectedFeeling];
        }

        if (parkSmart.authManager.isSignedIn) {
            parkSmart.parkLotManager.updateParkingLotStatus(this.id, availability, parkSmart.userInfo.name, this.updateView.bind(this));

        } else {
            this.triggerAlert("You must be signed in to update the parking lot status.", "warning");
        }
    }

    triggerAlert(message, type) {
        const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
        const appendAlert = (message, type) => {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = [
                `<div class="alert alert-${type} alert-dismissible" role="alert">`,
                `   <div>${message}</div>`,
                '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                '</div>'
            ].join('');

            alertPlaceholder.append(wrapper);
        }

        appendAlert(message, type);
    }

    updateView() {
        if (this.lot) {
            document.querySelector("#parkingLotTitle").innerHTML = this.lot[parkSmart.FB_Key_ParkLot_Info_name];
            document.querySelector("#mapFrame").src = this.lot[parkSmart.FB_Key_ParkLot_Info_map];
            document.querySelector("#availability").innerHTML = `${this.lot[parkSmart.FB_Key_ParkLot_Status_status_availability]} / ${this.lot[parkSmart.FB_Key_ParkLot_Info_total]}`;


            console.log(this.lot[parkSmart.FB_Key_ParkLot_Status_status_availability], this.lot[parkSmart.FB_Key_ParkLot_Info_total]); // Debugging
            if (this.lot[parkSmart.FB_Key_ParkLot_Info_total] > 0) {
                const occupancePercentage = ((this.lot[parkSmart.FB_Key_ParkLot_Info_total] - this.lot[parkSmart.FB_Key_ParkLot_Status_status_availability]) / this.lot[parkSmart.FB_Key_ParkLot_Info_total]) * 100;
                console.log(`Occupance Percentage: ${occupancePercentage}%`);
                document.querySelector("#bar").style.width = `${occupancePercentage}%`;
            } else {
                console.warn("Total space is zero or undefined, cannot calculate availability percentage.");
                document.querySelector("#bar").style.width = '0%';
            }
            document.querySelector("#reportInfo").innerHTML = `Reported by ${this.lot[parkSmart.FB_Key_ParkLot_Status_status_report_reportor]} at ${convertTimestampToReadableTime(this.lot[parkSmart.FB_Key_ParkLot_Status_status_report_time])}`

        } else {
            console.error("Parking lot details not found.");
        }
    }



    get lotAvailability() {
        return this.lot[parkSmart.FB_Key_ParkLot_Status_status_availability];
    }

    get lotName() {
        return this.lot ? this.lot[parkSmart.FB_Key_ParkLot_Info_name] : null;
    }

    get mapLink() {
        return this.lot ? this.lot[parkSmart.FB_Key_ParkLot_Info_map] : null;
    }
};