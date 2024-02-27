package com.company.favorite.news.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class News {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long externalId;
    private String title;
    private String description;
    private String summary;
    private Date publishedAt;
    private Date favoriteAt;
    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "favoriteNews")
    private List<User> usersMarkFavorite;
}
