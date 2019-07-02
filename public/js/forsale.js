//update land records from current selected account..
window.onload = loadOwnedLands;

document.querySelector('#updateOwnLandsButtonID').addEventListener('click',loadOwnedLands);



function loadOwnedLands(){
    console.log("Loading lands");
    const doneListing = [];
    let i = 0;
    let dbVals;
    if (isOkToCall){
        document.querySelector('.ownLandsPanel').innerHTML = '';
        firebase.database().ref('sales').once('value',function(snapshot){
            dbVals = Object.values(snapshot.val());
            Object.keys(snapshot.val())
                .map(keys => keys.split('-')[0])
                .forEach(addr => {
                    console.log(addr);
                    realEstateContractHook.getNoOfLands.call(addr, (error, noOfLandsOfCurrentAccount) => {
                        console.log("No of lands of Current Account: " + noOfLandsOfCurrentAccount);
                        for (index=0; index<noOfLandsOfCurrentAccount;index++){
                            realEstateContractHook.getLand.call(ethWeb3.eth.defaultAccount, index, (error, land) => {
                                if(Object.keys(snapshot.val()).map(keys => Number(keys.split('-')[1])).includes(Number(land[3]))){
                                    if(land[3] != 0 && !doneListing.includes(Number(land[3]))){
                                        console.log("Land ID: " + land[3]);
                                        console.log("Location: " + land[0]);
                                        console.log("Cost: " + land[1]);
                                        console.log("Owner: " + land[2]);  
                                        doneListing.push(Number(land[3]));
                                        console.log(doneListing)
                                        updateOwnListDisplay(land);
                                    }
                                }
                                i++;
                            })
                        }
                    });  
                })
        })
    }else{
        console.log("web3 init not ok. please ensure that before this operation");
    }
}

function buyProperty(){
    let isConfirm = confirm(`Initiating transaction with ${this.dataset.owner} for land id ${this.dataset.landid}, Sure you want to proceed?`);
    if(!isConfirm) return;
    console.log(isConfirm);
    realEstateContractHook.transferLand(ethWeb3.eth.defaultAccount, this.dataset.landid, (err, ack) => {
        console.log(ack)
        if(err) throw err;
        alert("Property has been bought!");
    })
}

function updateOwnListDisplay(land){
    document.querySelector('.ownLandsPanel').innerHTML += `
    <div class="w3-third">
        <div class="w3-card-4 property">
            <table>
                <tr><td><span class="fa fa-info"></span>&nbsp; LandID</td><td>${land[3]}</td></tr>
                <tr><td><span class="fa fa-user"></span>&nbsp; Owner</td><td title="${land[2]}">${land[2].slice(0,10)}...${land[2].slice(-10)}</td></tr>
                <tr><td><span class="fa fa-money"></span> Price</td><td>${land[1]}</td></tr>
                <tr><td><span class="fa fa-map-marker"></span>&nbsp;&nbsp;Location</td><td>${land[0]}</td></tr>
            </table>
            <div style="text-align:center;padding-top:20px;">
                <button data-landid="${land[3]}" data-owner="${land[2]}" data-price="${land[1]}" data-location="${land[0]}" class="w3-btn buy-property-button" style="background-color:#09f;color:#fff;">Buy</button>
            </div>
        </div>
    </div>
    `

    document.querySelector('.buy-property-button').addEventListener('click',buyProperty);
};