import axios from "axios";

function getSettingsFromLocalStorage() {
  const settings = localStorage.getItem("appSettings");
  return settings ? JSON.parse(settings) : null;
}

function getLightEndpoint(
  endpointKey: "LightsOnEndpoint" | "LightsOffEndpoint"
) {
  const settings = getSettingsFromLocalStorage();
  return settings ? settings[endpointKey] : null;
}

export function turnOnLights() {
  const lightsOnEndpoint = getLightEndpoint("LightsOnEndpoint");
  if (lightsOnEndpoint) {
    axios
      .get(lightsOnEndpoint)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error turning on lights:", error);
      });
  } else {
    console.error("Lights on endpoint is not set.");
  }
}

export function turnOffLights() {
  const lightsOffEndpoint = getLightEndpoint("LightsOffEndpoint");
  if (lightsOffEndpoint) {
    axios
      .get(lightsOffEndpoint)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error turning off lights:", error);
      });
  } else {
    console.error("Lights off endpoint is not set.");
  }
}
