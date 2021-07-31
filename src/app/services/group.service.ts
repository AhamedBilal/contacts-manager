import { Injectable } from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {Observable, of} from 'rxjs';
import {User} from '../dtos/user';
import {catchError} from 'rxjs/operators';
import {Group} from '../dtos/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private electron: ElectronService) {
  }

  getGroups(): Observable<Group[]> {
    return of(this.electron.ipcRenderer.sendSync('get-groups')).pipe(
      catchError((error: any) => Observable.throw(error.json))
    );
  }

  addGroup(group: Group): Observable<Group> {
    return of(
      this.electron.ipcRenderer.sendSync('add-group', group)
    ).pipe(catchError((error: any) => Observable.throw(error.json)));
  }

  updateGroup(group: Group | any): Observable<Group> {
    return of(
      this.electron.ipcRenderer.sendSync('update-group', group)
    ).pipe(catchError((error: any) => Observable.throw(error.json)));
  }

  deleteGroup(num: number): Observable<Group[]> {
    return of(
      this.electron.ipcRenderer.sendSync('delete-group', num)
    ).pipe(catchError((error: any) => Observable.throw(error.json)));
  }
}
