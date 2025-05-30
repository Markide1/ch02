
interface Contact {
    mobile: string,
}

interface User extends Contact {
  id: number;
  name: string;
  email: string;
}

