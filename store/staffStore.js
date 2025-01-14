"use client";

import { initMember } from "constants/initValues";
import { getMembers, createMember, deleteMember, changeMember } from "api/staffApi";

import { create } from "zustand";

export const useStaffStore = create((set) => ({
    members: [],

    initMembers: async () => {
        const members = await getMembers();
        set({ members: members });
    },

    createMember: async () => {
        let member = { ...initMember };
        member = await createMember(member);

        set((state) => {
            let members = state.members;

            members.push(member);

            return {
                members: members,
            };
        });
    },
    deleteMember: async (id) => {
        await deleteMember(id);

        set((state) => {
            let members = state.members;

            members = members.filter((member) => member.id != id);

            return {
                members: members,
            };
        });
    },
    changeMember: async (id, param, value, type) => {
        const reg = /^-?\d*(\.\d*)?$/;
        let realValue = null;
        if (type == "number" && reg.test(value)) realValue = Number(value);
        if (type == "text" || type == "select" || type == "file")
            realValue = value;

        if (realValue != null)
            changeMember(id, { [param]: realValue })

        set((state) => {
            let members = state.members;
            let member = members.find((member) => member.id === id);

            if (realValue != null)
                member[param] = realValue;

            return {
                members: members,
            };
        });
    },
}));
