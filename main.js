const permissionsNames = [
  "geolocation",
  "notifications",
  "push",
  "midi",
  "camera",
  "microphone",
  "speaker",
  "device-info",
  "background-fetch",
  "background-sync",
  "bluetooth",
  "persistent-storage",
  "ambient-light-sensor",
  "accelerometer",
  "gyroscope",
  "magnetometer",
  "clipboard",
  "display-capture",
  "nfc"
]
const outputtable = document.querySelector('.output-table');
const entrytemplate = document.querySelector('#entry-template');

const btnclipboard = document.querySelector('#btnclipboard');
const btntextbox = document.querySelector('#btntextbox');

const txtAccOutput = document.getElementById("acc-datain");
const txtMagOutput = document.getElementById("mag-datain");
const txtOtherOutput = document.getElementById("other-datain");
const txtTextOutput = document.getElementById("text-datain");

const txtTest = document.getElementById("test");

let id = 1;

// alert(poo);

const leh = document.getElementsByTagName("h3")[0];
// alert(leh.id);

btnclipboard.addEventListener('click', async () => {

  let t = await navigator.clipboard.readText().then(text => {return text});
  txtOtherOutput.value = t;
  txtOtherOutput.style.height = "";
  txtOtherOutput.style.height = txtOutput.scrollHeight + "px";
  addTask();

});

function addTask() {
  const entryElement = document.importNode(entrytemplate.content, true);

  const tr = entryElement.querySelector('tr');
  tr.id = id;


  const reciept = entryElement.querySelector('.reciept');
  reciept.append("12/03/1221");

  const closed = entryElement.querySelector('.closed');
  
  closed.append("12/04/1221");
  const fos = entryElement.querySelector('.fos');
  fos.append(id);

  outputtable.appendChild(entryElement);
  id++;

}

let accy = new LinearAccelerationSensor();
console.log("Starting acc: ")
accy.start();
//console.log(accy.x);

let maggy = new Magnetometer();
maggy.start();

maggy.onreading = () => {
  txtMagOutput.value = "Magnetic field along the X-axis " + maggy.x;
  txtMagOutput.value += "\nMagnetic field along the Y-axis " + maggy.y;
  txtMagOutput.value += "\nMagnetic field along the Z-axis " + maggy.z;
};

maggy.one

//https://wiki.dfrobot.com/How_to_Use_a_Three-Axis_Accelerometer_for_Tilt_Sensing#target_4
accy.onreading = () => {
  
  txtTest.innerText = "herro2";
  let x,y,z;
  let roll,pitch,yaw;

  x = accy.x;
  y = accy.y;
  z = accy.z;

  txtAccOutput.value = "x: " + x;
  txtAccOutput.value += "\ny: " + y;
  txtAccOutput.value += "\nz: " + z;

  roll = Math.atan2(y, x) * 57.3;
  pitch = Math.atan2(y, z) * 57.3;
  yaw = Math.atan2(x, z) * 57.3;

  let h,s;

  h = Math.round(roll*(360/180));
  s = Math.round(pitch * (100/180)) + "%";
  txtOtherOutput.value = h;
  txtOtherOutput.value += '\n' + s;

  // yaw = Math.atan2((-y) , Math.sqrt(x * x + z * z)) * 57.3;
  //alert(s);
  // txtTextOutput.value = "x: " + x;
  // txtTextOutput.value += "\ny: " + y;
  // txtTextOutput.value += "\nz: " + z;
  txtTextOutput.value = "roll: " + roll;
  txtTextOutput.value += "\npitch: " + pitch;
  txtTextOutput.value += "\nyaw: " + yaw;
  
  const bdy = document.getElementsByTagName("body")[0]
  bdy.style.backgroundColor = "hsl(" + h +  ", " + s + ", 50%)"; //"hsl(" + h + "," + s +",30%)";
  // bdy.style.backgroundColor = "hsl(" + h +", " + s + "%, 50%)"; 
  //"hsl(" + h + "," + s +",30%)";

}

accy.onerror = event => console.log(event.error.name, event.error.message);

async function CheckPermissions(){
  // alert("click");
  navigator.permissions.query({name:'magnetometer'}).then(function(permissionStatus) {
    txtTextOutput.value = 'magnetometer permission status is ' + permissionStatus.state;
    
    permissionStatus.onchange = function() {
      txtTextOutput.value = 'magnetometer permission status has changed to ' + this.state;
    };
  });
}

const getAllPermissions = async () => {
  const allPermissions = []
  // We use Promise.all to wait until all the permission queries are resolved
  await Promise.all(
    permissionsNames.map(async permissionName => {
        try {
          let permission
          switch (permissionName) {
            case 'push':
              // Not necessary but right now Chrome only supports push messages with  notifications
              permission = await navigator.permissions.query({name: permissionName, userVisibleOnly: true})
              break
            default:
              permission = await navigator.permissions.query({name: permissionName})
          }
          console.log(permission)
          allPermissions.push({permissionName, state: permission.state})
        }
        catch(e){
          allPermissions.push({permissionName, state: 'error', errorMessage: e.toString()})
        }
    })
  )
  return allPermissions
}

btntextbox.addEventListener('click',
async () => {
  
  (async function () {
    const allPermissions = await getAllPermissions()
    console.log(allPermissions)
  })()

});


txtTest.innerText = "herro2";