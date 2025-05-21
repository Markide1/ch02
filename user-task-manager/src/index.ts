interface Member {
  id: number;
  name: string;
  email: string;
}

class Member implements Member {
  id: number;
  name: string;
  email: string;

  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  getMemberInfo(): string {
    return `ID: ${this.id}, Name: ${this.name}, Email: ${this.email}`;
  }
}

const newMember = new Member(1, "Markide One", "markide@outlook.com");

console.log(newMember.getMemberInfo());