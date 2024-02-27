package com.company.favorite.news.repository;

import com.company.favorite.news.model.News;
import com.company.favorite.news.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NewsRepository extends JpaRepository<News, Long> {
    Optional<News> findByExternalId(Long id);

    List<News> findByUsersMarkFavorite(Optional<User> userId);

    Optional<News> findByTitle(String title);

    boolean existsByExternalId(Long externalId);
}
