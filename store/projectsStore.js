"use client";

import { create } from 'zustand'

export const useProjectsStore = create(set => ({
	projectNameFilter: "",
	clientNameFilter: "",
	clientIdsFilter: [],
	lastProjectId: 1,
	projects: [
		{
			id: 1,
			name: "Project 1",
			clientId: 2,
			lastStandId: 1,
			stands: [
				{
					id: 1,
					name: "Stand 1",
					width: "1000",
					height: "200",
					depth: "400",
					shelfNumber: "3",
					isMade: false
				}
			]
		}
	],
	addToClientIdsFilter: (value) => set(state => ({ clientIdsFilter: [...state.clientIdsFilter, value] })),
	removeFromClientIdsFilter: (value) => set(state => ({ clientIdsFilter: state.clientIdsFilter.filter(el => el != value) })),
	setClientNameFilter: (value) => set({ clientNameFilter: value }),
	setProjectNameFilter: (value) => set({ projectNameFilter: value }),
	setProjectValue: (projectId, param, value) => set(state => {
		console.log(projectId, param, value)
		let newProjects = state.projects;
		newProjects.find(project => project.id == projectId)[param] = value;
		return ({
			projects: newProjects
		});
	}),
	addProject: () => set(state => {
		let newProjects = state.projects;
		let newProjectId = state.lastProjectId + 1;
		newProjects.unshift({
			id: newProjectId,
			name: "",
			clientId: -1,
			lastStandId: 0,
			stands: []
		})
		return ({
			projects: newProjects,
			lastProjectId: newProjectId
		});
	}),
	deleteProject: (projectId) => set(state => {
		let newProjects = state.projects;
		newProjects = newProjects.filter(project => project.id != projectId);
		return ({
			projects: newProjects
		});
	}),
	setStandValue: (projectId, standId, param, value) => set(state => {
		let newProjects = state.projects;
		console.log(newProjects.find(project => project.id == projectId).stands.find(stand => stand.id == standId)[param], value)
		newProjects.find(project => project.id == projectId).stands.find(stand => stand.id == standId)[param] = value;
		return ({
			projects: newProjects
		});
	}),
	addStand: (projectId) => set(state => {
		let newProjects = state.projects;
		let newStandId = newProjects.find(project => project.id == projectId).lastStandId + 1;
		newProjects.find(project => project.id == projectId).stands.push({
			id: newStandId,
			name: "",
			width: "",
			height: "",
			depth: "",
			shelfNumber: "",
			isMade: false
		});
		newProjects.find(project => project.id == projectId).lastStandId = newStandId;
		
		return ({
			projects: newProjects
		});
	}),
	deleteStand: (projectId, standId) => set(state => {
		let newProjects = state.projects;
		newProjects.find(project => project.id == projectId).stands = newProjects.find(project => project.id == projectId).stands.filter(stand => stand.id != standId);
		return ({
			project: newProjects
		});
	})
}));