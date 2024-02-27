package com.company.favorite.news.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RequestDTO {
    private Long externalId;
    private String title;
    private String description;
    @Column(length = 1000)
    private String summary;
    private Date publishedAt;
    private Date favoriteAt;
    private Long userId;

}
