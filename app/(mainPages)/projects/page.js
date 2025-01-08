"use client";

import { useEffect } from "react";
import { useProjectsStore } from "store/projectsStore";
import { useCliensStore } from "store/clientsStore";

import styles from "./page.module.scss";

import {
  createProject,
  deleteProject,
  updateProject,
  getProjects,
} from "api/projects";
import { getClients } from "api/clients";
import VInput from "components/VInput";
import HInput from "components/HInput";
import VSelect from "components/VSelect";
import SelectList from "components/SelectList";
import Block from "components/Block";
import Subblock from "components/Subblock";
import ColorBtn from "components/ColorBtn";

export default function Home() {
  const projectsStore = useProjectsStore();
  const clientsStore = useCliensStore();

  // TODO: change to more proper structure
  useEffect(() => {
    getClients().then((newClients) => {
      clientsStore.setClients(newClients);
      getProjects().then((newProjects) => {
        projectsStore.setProjects(newProjects);
      });
    });
  }, []);

  let clients = [];
  for (let client of clientsStore.clients) {
    clients.push({ value: client.name, id: client.id });
  }

  let filtredProjects = projectsStore.projects.filter((project) =>
    project.name.includes(projectsStore.projectNameFilter),
  );
  if (projectsStore.clientIdsFilter.length != 0)
    filtredProjects = filtredProjects.filter((project) =>
      projectsStore.clientIdsFilter.includes(project.clientId),
    );

  let projectsArr = [];
  for (const project of filtredProjects) {
    let standsArr = [];
    for (const stand of project.stands) {
      standsArr.push(
        <Subblock key={stand.id}>
          <VInput
            value={stand.name}
            onChange={(value) =>
              projectsStore.setStandValue(project.id, stand.id, "name", value)
            }
            text="Название стойки"
            placeholder="Введите название"
            disabled={stand.isMade}
          />
          <HInput
            value={stand.width}
            onChange={(value) =>
              projectsStore.setStandValue(project.id, stand.id, "width", value)
            }
            text="Ширина"
            disabled={stand.isMade}
          />
          <HInput
            value={stand.height}
            onChange={(value) =>
              projectsStore.setStandValue(project.id, stand.id, "height", value)
            }
            text="Высота"
            disabled={stand.isMade}
          />
          <HInput
            value={stand.depth}
            onChange={(value) =>
              projectsStore.setStandValue(project.id, stand.id, "depth", value)
            }
            text="Глубина"
            disabled={stand.isMade}
          />
          <HInput
            value={stand.shelfNumber}
            onChange={(value) =>
              projectsStore.setStandValue(
                project.id,
                stand.id,
                "shelfNumber",
                value,
              )
            }
            twoLines={true}
            unit="штук"
            text="Кол-во полок"
            disabled={stand.isMade}
          />
          <div className={styles.subblockEndBtns}>
            <ColorBtn
              text="Спроектировать"
              disabledText="Спроектировано"
              icon="/rightArrow.svg"
              className={styles.makeStandBtn}
              onClick={() =>
                projectsStore.setStandValue(
                  project.id,
                  stand.id,
                  "isMade",
                  true,
                )
              }
              disabled={stand.isMade}
            />
            <ColorBtn
              text="Удалить"
              color="#e16c6c"
              icon="/trash.svg"
              onClick={() => projectsStore.deleteStand(project.id, stand.id)}
            />
          </div>
        </Subblock>,
      );
    }

    projectsArr.push(
      <Block key={project.id}>
        <VInput
          value={project.name}
          onChange={(value) =>
            projectsStore.setProjectValue(project.id, "name", value)
          }
          onEnter={(value) => updateProject(project.id, "name", value)}
          text="Название проекта"
          placeholder="Введите название"
          className={styles.blockStartInput}
        />
        <VSelect
          text="Клиент проекта"
          placeholder="Выберите клиента"
          optionIcon="/client.svg"
          options={clients}
          selectedOptionId={project.clientId}
          className={styles.blockStartInput}
          onSelect={(value) => {
            updateProject(project.id, "client_id", value);
            projectsStore.setProjectValue(project.id, "clientId", value);
          }}
        />
        {standsArr}
        <ColorBtn
          text="Добавить"
          icon="/plus.svg"
          onClick={() => projectsStore.addStand(project.id)}
        />
        <div className={styles.blockEndBtns}>
          <ColorBtn
            text="Удалить"
            color="#e16c6c"
            icon="/trash.svg"
            onClick={() => {
              deleteProject(project.id);
              projectsStore.deleteProject(project.id);
            }}
          />
        </div>
      </Block>,
    );
  }

  return (
    <main>
      <div className={styles.menu}>
        <div className={styles.projectFindMenu}>
          <VInput
            value={projectsStore.projectNameFilter}
            onChange={(value) => projectsStore.setProjectNameFilter(value)}
            text="Поиск по названию проекта"
            placeholder="Поиск проекта"
          />
        </div>
        <div className={styles.clientFindMenu}>
          <VInput
            value={projectsStore.clientNameFilter}
            onChange={(value) => projectsStore.setClientNameFilter(value)}
            text="Поиск по клиенту"
            placeholder="Поиск клиента"
          />
          <div className={styles.clients}>
            <SelectList
              onSelect={(id) => {
                if (projectsStore.clientIdsFilter.includes(id))
                  projectsStore.removeFromClientIdsFilter(id);
                else projectsStore.addToClientIdsFilter(id);
              }}
              options={clients.filter((option) =>
                option.value.includes(projectsStore.clientNameFilter),
              )}
              selectedOptionIds={projectsStore.clientIdsFilter}
              optionIcon="/client.svg"
            />
          </div>
        </div>
      </div>
      <div className={styles.workingSpace}>
        <div className={styles.title}>
          <h1 className={styles.titleText}>Проекты и стойки</h1>
          <ColorBtn
            text="Добавить"
            icon="/plus.svg"
            onClick={() => {
              createProject();
              projectsStore.addProject();
            }}
          />
        </div>
        {projectsArr}
      </div>
    </main>
  );
}
