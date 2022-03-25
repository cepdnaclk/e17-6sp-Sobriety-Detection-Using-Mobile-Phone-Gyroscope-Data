1. Backend:
- Managed to implement the basic server to publish and receive a data stream using MQTT server
- Didn't completely implement the server API, will have to push the following incompleted tasks to sprint 2.
    - Creating the API interface.
    - Read and save the actual gyro data stream from mobile phones in a methodical way to only have the bare minimum amount of data at a given time.


2. Mobile application:
- Considered a stream API, but because of the disadvantages with the architecture decided to move forward with MQTT.
- Implemented a prototype on NodeJS but could not make the application to run on a mobile. Will have to push the following task to sprint 2.
    - Read gyroscopic data and publish the data stream to the MQTT broker so it can be read by the server.

