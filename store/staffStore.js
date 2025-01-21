"use member";

import { initMember } from "constants/initValues";
import { memberFields } from "constants/fields";
import {
    getAll,
    createOne,
    deleteOne,
    checkValueType,
    changeOne,
} from "api/common";

import { create } from "zustand";

export const useStaffStore = create((set) => ({
    members: {},

    initMembers: async () => {
        const members = await getAll("/employees", "employees", memberFields);

        set((state) => {
            return { members: members };
        });
    },

    createMember: async () => {
        let member = { ...initMember };
        let id = await createOne(
            "/create_employee",
            "employee_id",
            member,
            memberFields,
        );

        set((state) => {
            let members = state.members;
            members[id] = member;
            return {
                members: members,
            };
        });
    },
    deleteMember: async (id) => {
        await deleteOne(`/employee_${id}`);

        set((state) => {
            let members = state.members;
            delete members[id];
            return {
                members: members,
            };
        });
    },
    changeMember: async (id, param, value, type, isReq) => {
        let realValue = checkValueType(value, type);
        if (realValue != null) {
            if (isReq)
                await changeOne(
                    `/employee_${id}`,
                    { [param]: realValue },
                    memberFields,
                );

            set((state) => {
                let members = state.members;
                let member = members[id];
                member[param] = realValue;
                return {
                    members: members,
                };
            });
        }
    },
}));
