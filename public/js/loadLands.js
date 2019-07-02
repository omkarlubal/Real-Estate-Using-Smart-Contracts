//update land records from current selected account..
window.onload = loadLand;

document.querySelector('#updateLandsButtonID').addEventListener('click',loadLand);

function sellProperty(){
    console.log("Sell");
    if(isOkToCall){
        console.log("Selling")
        firebase.database().ref('sales/'+ethWeb3.eth.defaultAccount+'-'+this.dataset.landid).set(this.dataset)
        document.querySelector('#land-'+this.dataset.landid).style.display = 'none';
    }
}

function loadLand(){
    console.log("Loading lands");
    document.querySelector('.landsPanel').innerHTML = '';
    if (isOkToCall){
        //get the contract hook and call the function
        realEstateContractHook.getNoOfLands.call(ethWeb3.eth.defaultAccount, (error, noOfLandsOfCurrentAccount) => {
                console.log("No of lands of Current Account: " + noOfLandsOfCurrentAccount);
                for (index=0; index<noOfLandsOfCurrentAccount;index++){
                    realEstateContractHook.getLand.call(ethWeb3.eth.defaultAccount, index, (error, land) => {
                            if (land[3] != 0){
                                firebase.database().ref('sales/'+ethWeb3.eth.defaultAccount+'-'+land[3]).once('value',function(snapshot){
                                    if(!snapshot.val()){
                                        console.log("Land ID: " + land[3] + ":");
                                        console.log("Location: " + land[0]);
                                        console.log("Cost: " + land[1]);
                                        console.log("Owner: " + land[2]);  
                                        updateListDisplay(land);  
                                    }else{
                                        console.log("VALUEEE")
                                    }
                                })
                                
                             
                            }
                        }
                    );
                }
                   
            }
        );        

    }    
    else
    {
        console.log("web3 init not ok. please ensure that before this operation");
    }
}


function updateListDisplay(land)
{
    document.querySelector('.landsPanel').innerHTML += `
    <div id="land-${land[3]}" class="w3-third">
        <div class="w3-card-4 property">
            <table>
                <tr><td><span class="fa fa-info"></span>&nbsp; LandID</td><td>${land[3]}</td></tr>
                <tr><td><span class="fa fa-user"></span>&nbsp; Owner</td><td title="${land[2]}">${land[2].slice(0,10)}...${land[2].slice(-10)}</td></tr>
                <tr><td><span class="fa fa-money"></span> Price</td><td>${land[1]}</td></tr>
                <tr><td><span class="fa fa-map-marker"></span>&nbsp;&nbsp;Location</td><td>${land[0]}</td></tr>
            </table>
            <div style="text-align:center;padding-top:20px;">
                <button data-landid="${land[3]}" data-owner="${land[2]}" data-cost="${land[1]}" data-location="${land[0]}" class="w3-btn sell-property-button-${land[3]}" style="background-color:#09f;color:#fff;">Sell Property</button>
            </div>
        </div>
    </div>
    `;

    console.log("Selling property");

    setTimeout(() => document.querySelector('.sell-property-button-'+land[3]).addEventListener('click', sellProperty),100);
}

