"use client";

import { initMember } from "constants/initValues";
import { createMember, deleteMember, changeMember } from "api/staffApi";

import { create } from "zustand";

export const useStaffStore = create((set) => ({
    members: [{...initMember}],
    createMember: () => {
        set((state) => {
            let members = state.members;
            let member = { ...initMember };

            member = createMember(member);
            members.push(member);

            return {
                members: members,
            };
        });
    },
    deleteMember: (id) => {
        set((state) => {
            let members = state.members;

            members = members.filter((member) => member.id != id);
            deleteMember(id);

            return {
                members: members,
            };
        });
    },
    changeMember: (id, param, value, type) => {
        set((state) => {
            const reg = /^-?\d*(\.\d*)?$/;
            let members = state.members;
            let member = members.find((member) => member.id === id);

            if (!member) {
                console.error(`No member found with id: ${id}`);
                return state;  // Maintain state unchanged if member is not found.
            }

            let realValue = member[param];

            if (type === "number" && reg.test(value)) realValue = Number(value);
            if (["text", "select", "file"].includes(type)) realValue = value;

            member[param] = realValue;
            changeMember(id, member);

            return {
                members: members,
            };
        });
    },
}));
