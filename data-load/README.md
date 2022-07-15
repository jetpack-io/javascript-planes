Jetpack.io Planes
-----------------

This is a Node app written in TypeScript that reads data from the OpenSky api and writes it to Redis.


## Usage

1. Edit `.env` if necessary to point to your Redis instance.

2. run `npm run start` to launch the Node app.

3. Every minute it'll download fresh data from the API.  Open Sky Network caches their data for 10 seconds for free accounts.


## License

MIT
