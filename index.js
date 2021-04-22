const axios = require("axios");
const fs = require("fs");
const config = require("./config.json");

function request(identifier, factory, retriesLeft) {
  return factory()
    .then((response) => {
      console.log(`DEBUG: request - ${identifier} - ✅ (${retriesLeft} retries left)`);
      return response;
    })
    .catch(() => {
      if (retriesLeft === 0) {
        throw new Error("Ran out of retries");
      } else {
        console.log(`DEBUG: request - ${identifier} - ❌ (${retriesLeft} retries left)`);
        return request(identifier, factory, retriesLeft - 1);
      }
    });
}

function requestPage(pageNumber) {
  const { endpoint, maxRetries } = config.api;
  const requestFactory = () => axios.get(endpoint, { params: { page: pageNumber } });
  return request(`api page ${pageNumber}`, requestFactory, maxRetries).then((response) => {
    return response.data.houses;
  });
}

function getExtension(url) {
  return url.split(/[#?]/)[0].split(".").pop().trim();
}

function getHousePhoto(house) {
  const { maxRetries, dir } = config.photos;
  const { id, address, photoURL } = house;
  const factory = () => axios.get(photoURL);
  const filename = `id-${id}-${address.replace(/\s/gi, "_")}.${getExtension(photoURL)}`;

  return request(filename, factory, maxRetries)
    .then((response) => {
      fs.writeFile(`${dir}/${filename}`, response.data, () => {
        console.log("😸 Got photo for house", house);
      });
    })
    .catch((e) => {
      console.error("Error obtaining photo 😿", e);
    });
}

function main() {
  if (config.api.maxRetries < 0) {
    console.warn(
      `❗️ Current config indicates that API calls will be retried indifinately (api.maxRetries=${config.api.maxRetries})`
    );
  }

  if (config.photos.maxRetries < 0) {
    console.warn(
      `❗️ Current config indicates that photo requests will be retried indifinately (photos.maxRetries=${config.photos.maxRetries})`
    );
  }

  const arr = [];
  for (let i = 1; i <= config.pages; i++) {
    arr.push(i);
  }

  Promise.all(
    arr.map((page) => {
      return requestPage(page).then((houses) => {
        return Promise.all(houses.map(getHousePhoto));
      });
    })
  );
}

main();
