# Solution

## Requirements

- nodejs
- npm

## Run

```
npm install
npm start
```

## Libraries

- axios: basic requests
- fs: write to filesystem

## Methods

### Request

Method that does the heavylifting when it comes to requests. It handles reattempting failed requests in a way that it becomes a black box for anyone calling this method.

Uses promises for everything to take advange of JS asynchronous capabilites.

```
request(request-identifier, request-factory, retries-left) {
    - create request-instance using request-factory
    - perform request-instance
    - if request fails:
        retry calling same method using same param with one less retry (retries-left--)
      else:
        return result
}
```

### requestPage

Uses the `request` method to call the API and maps its response to the data that we need (houses array).

Uses promises for everything to take advange of JS asynchronous capabilites.

### getHousePhoto

Uses the `request` method to request the photoURL of a house and stores its response in the filesystem.

Uses promises for everything to take advange of JS asynchronous capabilites.

### main

Main method that calls getPage for each required page and getHousePhoto for each result of the former.

Uses promises for everything to take advange of JS asynchronous capabilites.


### Config

Config values are store in json format on `config.json`.

| Variable          | Description                                                                          |
| ----------------- | ------------------------------------------------------------------------------------ |
| pages             | Number of pages to be requested                                                      |
| api.endpoit       | Request API URL                                                                      |
| api.maxRetries    | Max number of retries for API requests, set value less than 0 for infinite retries   |
| photos.dir        | Directory to store photos obtained, must exists and have write permissions           |
| photos.maxRetries | Max number of retries for photo requests, set value less than 0 for infinite retries |
