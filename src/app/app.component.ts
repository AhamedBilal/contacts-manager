import {Component, OnInit} from '@angular/core';
import * as XLSX from 'xlsx';

// // @ts-ignore
// import connect from '../api/sequelize';
//
// // @ts-ignore
// import User from '../api/models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'contacts-manager';

  ngOnInit(): void {
    // connect();
    const frame = document.getElementById('my-frame') as HTMLIFrameElement;
    // frame.setAttribute('src', 'youtube.com/embed/' + 'DgcOzh8MIoI' + '?modestbranding=1&;showinfo=0&;autohide=1&;rel=0;');

    this.test();
  }

  async test(): Promise<void> {
    // const jane = await User.create({userName: 'Jane'});
    // console.log('Jane\'s auto-generated ID:', jane.id);
    // const users = await User.findAll();
    // console.log('All users:', JSON.stringify(users, null, 2));
  }

  onChanged(event: any): void {
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(event.target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, {type: 'binary'});

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
      console.log(data); // Data will be logged in array format containing objects
    };
  }
}
