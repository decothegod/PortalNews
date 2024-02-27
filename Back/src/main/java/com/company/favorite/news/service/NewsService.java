package com.company.favorite.news.service;

import com.company.favorite.news.dto.NewsDTO;
import com.company.favorite.news.dto.RequestDTO;

import java.util.List;

public interface NewsService {

    List<NewsDTO> getAllNews();

    NewsDTO getNewsByID(Long externalId);

    List<NewsDTO> getNewsFavoriteByUser(Long userId);

    NewsDTO getNewsByTitle(String title);

    NewsDTO addFavoriteNews(RequestDTO requestDTO);

    NewsDTO deleteFavorite(Long externalId, Long userId);


}
