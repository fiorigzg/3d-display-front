import axios from 'axios';

import { serverUrl } from 'constants/main';

export async function getMembers() {
    const res = await axios.get(`${serverUrl}/employees`);

    let members = [];
    const serverMembers = res.data.employees;
    
    for (let serverMember of serverMembers) {
        members.push({ id: serverMember.id, name: serverMember.full_name });
    }
    
    return members;
}

export async function createMember(member) {
    const res = await axios.post(`${serverUrl}/create_employee`, { full_name: member.name });

    member.id = res.data.employee_id;
    console.log(`Member ${member.id} created`);

    return member;
}

export async function deleteMember(id) {
    await axios.delete(`${serverUrl}/employee_${id}`);

    console.log(`Member ${id} deleted`);
}

export async function changeMember(id, changes) {
    let realChanges = {}
    
    if ('name' in changes)
        realChanges['full_name'] = changes['name']

    console.log(realChanges)

    await axios.put(`${serverUrl}/employee_${id}`, realChanges);
}

