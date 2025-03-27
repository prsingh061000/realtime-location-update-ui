let isScriptLoaded = false;
let isCallbackExecuted = false;
let callbacks = [];

export const loadGoogleMapsScript = (callback) => {
  if (isScriptLoaded) {
    if (isCallbackExecuted) {
      callback();
    } else {
      callbacks.push(callback);
    }
    return;
  }

  isScriptLoaded = true;
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCmhBDdD9MnSwNstWlRR8dcgNZUMsTep70&libraries=places`;
  script.async = true;

  script.onload = () => {
    isCallbackExecuted = true;
    callbacks.forEach((cb) => cb());
    callbacks = [];
    callback();
  };

  script.onerror = () => {
    console.error('Error loading Google Maps API');
  };

  document.body.appendChild(script);
};
