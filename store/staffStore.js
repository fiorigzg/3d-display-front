"use member";

import { initMember } from "constants/initValues";
import { memberFields } from "constants/fields";
import { getAll, checkValueType } from "api/commonApi";
import { useSaveStore } from "./saveStore";

import { create } from "zustand";

export const useStaffStore = create((set, get) => ({
    isLoading: true,
    members: {},
    newMemberId: 0,

    initMembers: async () => {
        const members = await getAll("/employees", "employees", memberFields);

        set((state) => {
            return { members: members, isLoading: false };
        });
    },

    createMember: async () => {
        let member = { ...initMember };
        const newMemberId = get().newMemberId + 1;
        await useSaveStore
            .getState()
            .createOne("member", "$" + newMemberId, member, memberFields);

        set((state) => {
            let members = state.members;
            members["$" + newMemberId] = member;
            return {
                newMemberId: newMemberId,
                members: members,
            };
        });
    },
    copyMember: async (id) => {
        const newMemberId = get().newMemberId + 1;
        await useSaveStore
            .getState()
            .copyOne("member", id, { [`member-${id}`]: "$" + newMemberId });

        set((state) => {
            let members = state.members;
            members["$" + newMemberId] = { ...members[id] };
            return {
                members: members,
                newMemberId: newMemberId,
            };
        });
    },
    deleteMember: async (id) => {
        await useSaveStore.getState().deleteOne("member", id);

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
                await useSaveStore
                    .getState()
                    .changeOne(
                        "member",
                        id,
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
