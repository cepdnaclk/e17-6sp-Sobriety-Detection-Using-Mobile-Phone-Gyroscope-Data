1. Backend Server. 
- Complete building the API. 
- Read and save from mobile phones, the bare minimum amount of gyroscopic data required to run the classifier. 
- Read data from multiple mobile phone (2 or 3) simultaneously. 

2. Mobile Application. 
- Read and publish actual gyro data to the MQTT broker in real time. 
- Create a simple UI for the mobile app.

3. ML Classifier. 

- Try an ensemble of various classifiers.
- evaluate and analyze each classifier model. 
- Compare and select the best performed classifier. 

- The following 2 are last resorts if we cannot find a proper labelled gyro dataset.
    - Try to collect a set of sober data and try to train the model using only that, and use the variation from sober data as a measurement of being drunk.

    - make a mobile application and give it to our friends so that we can collect sober gyro data and
