import { HttpClient } from '@angular/common/http';
import { Injectable, PipeTransform } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  debounceTime,
  delay,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { FavoriteNews, News } from '../interfaces/news.interfaces';
import { DatePipe, DecimalPipe } from '@angular/common';
import {
  SortColumn,
  SortDirection,
} from '../directives/sortrable-favorite.directive';

interface SearchResult {
  newsList: FavoriteNews[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(
  newsList: FavoriteNews[],
  column: SortColumn,
  direction: string
): FavoriteNews[] {
  if (direction === '' || column === '') {
    return newsList;
  } else {
    return [...newsList].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(news: FavoriteNews, term: string, pipe: PipeTransform) {
  return (
    news.title.toLowerCase().includes(term.toLowerCase()) ||
    news.summary.toLowerCase().includes(term.toLowerCase()) ||
    news.publishedAt.toLowerCase().includes(term.toLowerCase()) ||
    news.favoriteAt.toLowerCase().includes(term.toLowerCase()) ||
    pipe.transform(news.externalId).includes(term)
  );
}

@Injectable({
  providedIn: 'root',
})
export class FavoriteNewsService {
  private url = 'http://localhost:8080/v1/newsFavorite';
  private byUser = '/ByUser/';
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _newsList$ = new BehaviorSubject<FavoriteNews[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private news: FavoriteNews[] = [];
  userId = 1;

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  constructor(
    private httpClient: HttpClient,
    private datePipe: DatePipe,
    private pipe: DecimalPipe
  ) {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._newsList$.next(result.newsList);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get newsList$() {
    return this._newsList$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } =
      this._state;

    // 1. sort
    let newsList = sort(this.news, sortColumn, sortDirection);

    // 2. filter
    newsList = newsList.filter((news) => matches(news, searchTerm, this.pipe));
    const total = newsList.length;

    // 3. paginate
    newsList = newsList.slice(
      (page - 1) * pageSize,
      (page - 1) * pageSize + pageSize
    );
    return of({ newsList, total });
  }

  private _refresh(): Observable<any> {
    return this._search();
  }

  getFavoriteNews(userId: string): Observable<FavoriteNews[]> {
    return this.httpClient.get<FavoriteNews[]>(this.url + this.byUser + userId);
  }

  addFavoriteNews(request: News): Observable<FavoriteNews> {
    const newsRequest: FavoriteNews = this.transformToFavorite(request);

    return this.httpClient.post<FavoriteNews>(this.url, newsRequest);
  }

  private transformToFavorite(resp: News): FavoriteNews {
    const currentTime = new Date();
    const favoriteNews: FavoriteNews = {
      externalId: resp.id,
      title: resp.title,
      description: resp.url,
      summary: resp.summary,
      publishedAt: resp.published_at,
      favoriteAt:
        this.datePipe.transform(currentTime, 'yyyy-MM-ddTHH:mm:ssZ') || '',
      userId: this.userId,
    };
    return favoriteNews;
  }

  loadFavoriteNews() {
    this.getFavoriteNews(this.userId.toString()).subscribe((newsList) => {
      this._newsList$.next(newsList);
      this._total$.next(newsList.length);
      this.news = newsList;
      this.pageSize = 10;
    });
  }

  setUserId(userId: number) {
    this.userId = userId;
  }
}
