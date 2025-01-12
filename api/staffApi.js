let memberId = 300;

export function createMember(member) {
    member.id = memberId;
    console.log(`Member ${memberId} created`);
    memberId++;
    return member;
}

export function deleteMember(id) {
    console.log(`Member ${id} deleted`);
}

export function changeMember(id, member) {
    console.log(`Member ${id} changed`);
}

