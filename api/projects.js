const axios = require("axios");

export const getProjects = () => {
  let newProjects = [];
  return axios.get("http://0.0.0.0:8000/projects").then((res) => {
    for (let project of res.data.projects) {
      newProjects.push({
        id: project.id,
        name: project.name,
        clientId: project.client_id,
        lastStandId: 1,
        stands: [
          {
            id: 1,
            name: "Stand 1",
            width: "1000",
            height: "200",
            depth: "400",
            shelfNumber: "3",
            isMade: false,
          },
        ],
      });
    }
    return newProjects;
  });
};

export const updateProject = (projectId, param, value) => {
  axios.put(`http://0.0.0.0:8000/project_${projectId}`, {
    [param]: value,
  });
};

export const createProject = () => {
  axios.post("http://0.0.0.0:8000/create_project", {
    name: "",
    client_id: 1,
  });
};

export const deleteProject = (projectId) => {
  console.log(projectId);
};
