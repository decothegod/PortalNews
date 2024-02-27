package com.company.favorite.news.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NewsDTO {
    private Long externalId;
    private String title;
    private String description;
    private String summary;
    private Date publishedAt;
    private Date favoriteAt;
    private List<UserDTO> usersMarkFavorite;
}
