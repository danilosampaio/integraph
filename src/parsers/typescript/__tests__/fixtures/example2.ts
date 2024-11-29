export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
}

export interface IRepository {
    insert<R>(model: R): boolean;
}

export default class CustomerService {
    repository: IRepository;

    constructor(repository: IRepository) {
        this.repository = repository;
    }

    createUser(user: IUser) {
        this.repository.insert<IUser>(user);
    }
}