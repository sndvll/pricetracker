import Dexie from 'dexie';
import {from, Observable} from 'rxjs';
import {take} from 'rxjs/operators';

export abstract class AbstractDbService<T> {

  protected constructor(public table: Dexie.Table<T, string>,
                        public keys = '') {}

  public findAll():  Observable<T[] | undefined> {
    return from(this.table.toArray()).pipe(take(1));
  }

  public find(id: string): Observable<T | undefined> {
    return from(this.table.get(id)).pipe(take(1));
  }

  public delete(id: string): void {
    this.table.delete(id);
  }

  public create(t: T, key?: string) {
    this.table.put(t, key);
  }

  public update(t: T, key?: string) {
    this.table.put(t, key);
  }

  public count(): Observable<number> {
    return from(this.table.toCollection().count())
      .pipe(take(1));
  }

  public bulkAdd(data: T[]) {
    this.table.bulkAdd(data)
      .catch(err => {
        console.log(err);
      });
  }

  public bulkPut(data: T[]) {
    this.table.bulkPut(data);
  }
}
