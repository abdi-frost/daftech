export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    username: string;
    gender: string;
    email: string;
    password: string;
    address: string;
    phoneNumber: string;
    dateOfBirth: string;
    profilePicture?: string;
    spouseFirstName?: string;
    spouseLastName?: string;
    relationshipStartDate?: string;
}