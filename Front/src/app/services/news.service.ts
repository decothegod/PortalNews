import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, map } from 'rxjs';
import { FetchAllNewsResponse, News } from '../interfaces/news.interfaces';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from '../directives/sorteable.directive';
import { HttpClient } from '@angular/common/http';

interface SearchResult {
  newsList: News[];
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

function sort(newsList: News[], column: SortColumn, direction: string): News[] {
  if (direction === '' || column === '') {
    return newsList;
  } else {
    return [...newsList].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(news: News, term: string, pipe: PipeTransform) {
  return (
    news.title.toLowerCase().includes(term.toLowerCase()) ||
    news.summary.toLowerCase().includes(term.toLowerCase()) ||
    news.published_at.toLowerCase().includes(term.toLowerCase()) ||
    pipe.transform(news.id).includes(term)
  );
}

@Injectable({ providedIn: 'root' })
export class NewsService {
  private apiUrl = 'https://api.spaceflightnewsapi.net/v4/articles/?limit=10';
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _newsList$ = new BehaviorSubject<News[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private news: News[] = [];
  userId = 0;

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  constructor(private pipe: DecimalPipe, private httpClient: HttpClient) {
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

  getNews(): Observable<News[]> {
    return this.httpClient
      .get<FetchAllNewsResponse>(this.apiUrl)
      .pipe(map(this.transformToNews));
  }

  private transformToNews(resp: FetchAllNewsResponse): News[] {
    const newsList: News[] = resp.results.map((news) => {
      return {
        id: news.id,
        title: news.title,
        url: news.url,
        summary: news.summary,
        published_at: news.published_at,
      };
    });

    return newsList;
  }

  loadNews() {
    this.getNews().subscribe((newsList) => {
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
