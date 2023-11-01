import { makeAutoObservable } from 'mobx';

interface IUser {
    username: string;
    token: string;
}

class State {
    constructor() {
        makeAutoObservable(this);
        this._loadFromLocalStorage();
    }

    private _user: IUser = { username: '', token: '' }

    public getUser(): IUser {
        return this._user
    }

    public setUser(user: IUser): void {
        this._user = user
        this._saveToLocalStorage();
    }

    private _saveToLocalStorage() {
        localStorage.setItem("user", JSON.stringify(this._user));
    }

    private _loadFromLocalStorage() {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            this._user = JSON.parse(storedUser);
        }
    }

}

export default new State();