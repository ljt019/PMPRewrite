import axios from "axios";

export function turnOnLights() {
  axios.get("http://192.168.1.199:8080/walkInOn").then((response) => {
    console.log(response);
  });
}

export function turnOffLights() {
  axios.get("http://192.168.1.199:8080/walkInOff").then((response) => {
    console.log(response);
  });
}
