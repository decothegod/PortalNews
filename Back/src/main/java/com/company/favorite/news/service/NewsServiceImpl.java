package com.company.favorite.news.service;

import com.company.favorite.news.dto.NewsDTO;
import com.company.favorite.news.dto.RequestDTO;
import com.company.favorite.news.exception.ServiceExceptionNotFound;
import com.company.favorite.news.model.News;
import com.company.favorite.news.model.User;
import com.company.favorite.news.repository.NewsRepository;
import com.company.favorite.news.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static com.company.favorite.news.util.Constants.NEWS_NOT_FOUND_MSG;
import static com.company.favorite.news.util.Constants.USER_NOT_FOUND_MSG;

@Slf4j
@Service
public class NewsServiceImpl implements NewsService {

    @Autowired
    NewsRepository newsRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<NewsDTO> getAllNews() {
        List<News> news = newsRepository.findAll();
        return news.stream().map(this::convertToDTO).toList();
    }

    @Override
    public NewsDTO getNewsByID(Long id) {
        News news = newsRepository.findByExternalId(id)
                .orElseThrow(() -> new ServiceExceptionNotFound(NEWS_NOT_FOUND_MSG));
        return convertToDTO(news);
    }

    @Override
    public List<NewsDTO> getNewsFavoriteByUser(Long userId) {
        checkExistUser(userId);
        List<News> newsList = newsRepository.findByUsersMarkFavorite(userRepository.findById(userId));
        return newsList.stream().map(this::convertToDTO).toList();
    }

    @Override
    public NewsDTO getNewsByTitle(String title) {
        News news = newsRepository.findByTitle(title)
                .orElseThrow(() -> new ServiceExceptionNotFound(NEWS_NOT_FOUND_MSG));
        return convertToDTO(news);
    }

    @Override
    @Transactional
    public NewsDTO addFavoriteNews(RequestDTO requestDTO) {
        User user = getUser(requestDTO.getUserId());
        News news = getNews(requestDTO.getExternalId(), requestDTO);

        user.getFavoriteNews().add(news);
        news.getUsersMarkFavorite().add(user);

        newsRepository.save(news);

        return convertToDTO(news);
    }

    @Override
    @Transactional
    public NewsDTO deleteFavorite(Long externalId, Long userId) {
        User user = getUser(userId);
        News news = getNews(externalId);

        user.getFavoriteNews().remove(news);
        news.getUsersMarkFavorite().remove(user);

        newsRepository.save(news);

        return convertToDTO(news);
    }

    private NewsDTO convertToDTO(News news) {
        return modelMapper.map(news, NewsDTO.class);
    }

    private void checkExistUser(Long userId) {
        if (Boolean.FALSE.equals(userRepository.existsById(userId))) {
            throw new ServiceExceptionNotFound(USER_NOT_FOUND_MSG);
        }
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ServiceExceptionNotFound(USER_NOT_FOUND_MSG));
    }

    private News getNews(Long externalId) {
        return newsRepository.findByExternalId(externalId)
                .orElseThrow(() -> new ServiceExceptionNotFound(NEWS_NOT_FOUND_MSG));
    }

    private News getNews(Long externalId, RequestDTO requestDTO) {
        return newsRepository.findByExternalId(externalId)
                .orElse(createNews(requestDTO));
    }

    private News createNews(RequestDTO requestDTO) {

        return News.builder()
                .externalId(requestDTO.getExternalId())
                .title(requestDTO.getTitle())
                .description(requestDTO.getDescription())
                .summary(requestDTO.getSummary())
                .publishedAt(requestDTO.getPublishedAt())
                .favoriteAt(requestDTO.getFavoriteAt())
                .usersMarkFavorite(new ArrayList<>())
                .build();
    }
}
