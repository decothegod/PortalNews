import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import {
  CommonModule,
  AsyncPipe,
  DecimalPipe,
  DatePipe,
} from '@angular/common';
import { News } from '../interfaces/news.interfaces';
import { NewsService } from '../services/news.service';
import {
  NgbdSortableHeader,
  SortEvent,
} from '../directives/sorteable.directive';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FavoriteNewsService } from '../services/favorite-news.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    DatePipe,
    FormsModule,
    AsyncPipe,
    NgbHighlight,
    NgbPaginationModule,
    NgbdSortableHeader,
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
  providers: [
    NewsService,
    DecimalPipe,
    DatePipe,
    FavoriteNewsService,
    UserService,
  ],
})
export class NewsComponent implements OnInit {
  newsList$: Observable<News[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    public service: NewsService,
    private datePipe: DatePipe,
    public favoriteService: FavoriteNewsService,
    public userService: UserService
  ) {
    this.newsList$ = service.newsList$;
    this.total$ = service.total$;
    this.headers = new QueryList<NgbdSortableHeader>();
  }

  ngOnInit(): void {
    this.service.loadNews();
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd MMM yyyy') || '';
  }

  addFavorite(news: News) {
    console.log(news);

    this.favoriteService
      .addFavoriteNews(news)
      .pipe(
        catchError((error) => {
          console.error('Ocurrió un error al agregar la noticia:', error);
          alert('Ocurrió un error al agregar la noticia');
          return throwError(error);
        })
      )
      .subscribe((news) => {
        alert('Noticia : ' + news.externalId + ' agregada exitosamente');
      });
  }

  getUserId() {
    this.service.setUserId(this.userService.getUserId());
    this.favoriteService.setUserId(this.userService.getUserId());
  }
}
