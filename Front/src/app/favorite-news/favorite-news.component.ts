import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FavoriteNews } from '../interfaces/news.interfaces';
import {
  NgbdSortableHeader,
  SortEvent,
} from '../directives/sortrable-favorite.directive';
import { FavoriteNewsService } from '../services/favorite-news.service';
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  DecimalPipe,
} from '@angular/common';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-favorite-news',
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
  providers: [FavoriteNewsService, DecimalPipe, DatePipe],
  templateUrl: './favorite-news.component.html',
  styleUrl: './favorite-news.component.css',
})
export class FavoriteNewsComponent implements OnInit {
  newsList$: Observable<FavoriteNews[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    public service: FavoriteNewsService,
    private datePipe: DatePipe,
    public favoriteService: FavoriteNewsService
  ) {
    this.newsList$ = service.newsList$;
    this.total$ = service.total$;
    this.headers = new QueryList<NgbdSortableHeader>();
  }

  ngOnInit(): void {
    this.service.loadFavoriteNews();
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    console.log(column);
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd MMM yyyy') || '';
  }
}
