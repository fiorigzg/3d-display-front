const axios = require("axios");

export const getClients = () => {
  let newClients = [];
  return axios.get("http://0.0.0.0:8000/clients").then((res) => {
    for (let client of res.data.clients) {
      newClients.push({
        id: client.id,
        name: client.name,
        lastProductId: 1,
        products: [
          {
            id: 1,
            object: { value: "", files: [] },
            frontalProjection: { value: "", files: [] },
            sideProjection: { value: "", files: [] },
            isMade: false,
          },
        ],
      });
    }
    return newClients;
  });
};

export const updateClient = (clientId, param, value) => {
  axios.put(`http://0.0.0.0:8000/client_${clientId}`, {
    [param]: value,
  });
};

export const createClient = () => {
  axios.post("http://0.0.0.0:8000/create_client", {
    name: "",
  });
};

export const deleteClient = (clientId) => {
  console.log(clientId);
};
