import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {Observable, of} from 'rxjs';
import {User} from '../dtos/user';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private electron: ElectronService) {
  }

  getUsers(): Observable<User[]> {
    return of(this.electron.ipcRenderer.sendSync('get-users')).pipe(
      catchError((error: any) => Observable.throw(error.json))
    );
  }

  addUser(user: User): Observable<User> {
    return of(
      this.electron.ipcRenderer.sendSync('add-user', user)
    ).pipe(catchError((error: any) => Observable.throw(error.json)));
  }

  updateUser(user: User | any): Observable<User> {
    return of(
      this.electron.ipcRenderer.sendSync('update-user', user)
    ).pipe(catchError((error: any) => Observable.throw(error.json)));
  }

  deleteUser(num: number): Observable<User[]> {
    return of(
      this.electron.ipcRenderer.sendSync('delete-user', num)
    ).pipe(catchError((error: any) => Observable.throw(error.json)));
  }

  findUser(data: string): Observable<User[]> {
    return of(this.electron.ipcRenderer.sendSync('find-user', data)).pipe(
      catchError((error: any) => Observable.throw(error.json))
    );
  }

  generateText(count: number, startWith: any, out = 1, format = 'text') {
    return of(this.electron.ipcRenderer.sendSync('generate', count, startWith, out, format)).pipe(
      catchError((error: any) => Observable.throw(error.json))
    );
  }
  addDoc(): Observable<any> {
    return of(this.electron.ipcRenderer.sendSync('google-doc')).pipe(
      catchError((error: any) => Observable.throw(error.json))
    );
  }
}
