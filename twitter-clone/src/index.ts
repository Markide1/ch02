interface User {
    id:number,
    name: string,
    username: string,
    email: string,
    address: string,
    company: string,
    website: string,
    phone: string
}

interface Post {
    id: number,
    userId: number,
    title: string,
    body: string
}

interface Comment {
    id: number,
    postId: number,
    name: string,
    email: string,
    body: string
}

