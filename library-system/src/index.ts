// Book model
interface Book {
    id: string,
    title: string,
    author: string,
    isBorrowed: boolean,
    borrowedByMemberId: string
}

// Member model
interface Member {
    id: string,
    name: string,
    email: string
}

