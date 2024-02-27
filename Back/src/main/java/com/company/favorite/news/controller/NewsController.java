package com.company.favorite.news.controller;

import com.company.favorite.news.dto.NewsDTO;
import com.company.favorite.news.dto.RequestDTO;
import com.company.favorite.news.service.NewsService;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:4200"})
@RestController
@RequestMapping("/v1/newsFavorite")
@OpenAPIDefinition(info = @Info(title = "News Favorite API", version = "${app.version}"))
public class NewsController {
    @Autowired
    private NewsService newsService;

    @GetMapping()
    @Operation(summary = "Get all Favorite News", description = "Retrieves the complete list of Favorite News.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success, returns the list of Favorite News. If there are no Favorite News, it returns an empty list."),
            @ApiResponse(responseCode = "500", description = "Internal Server Error.")
    })
    public ResponseEntity<List<NewsDTO>> getAllFavoriteNews() {
        return ResponseEntity.ok(newsService.getAllNews());
    }

    @GetMapping("/{externalId}")
    @Operation(summary = "Get all Favorite News by External ID", description = "Retrieves a Favorite News by its External ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success, return the Favorite News."),
            @ApiResponse(responseCode = "404", description = "Not found, Favorite News not found."),
            @ApiResponse(responseCode = "500", description = "Internal Server Error.")
    })
    public ResponseEntity<NewsDTO> getNewsByID(
            @Parameter(description = "The external identifier code, provide https://api.spaceflightnewsapi.net/v4/articles api",
                    required = true, example = "22698")
            @PathVariable Long externalId) {
        return ResponseEntity.ok(newsService.getNewsByID(externalId));
    }

    @GetMapping("/ByUser/{userId}")
    @Operation(summary = "Get all Favorite News by User ID", description = "Retrieves a Favorite News by its User ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success, return the Favorite News."),
            @ApiResponse(responseCode = "404", description = "Not found, User not found."),
            @ApiResponse(responseCode = "500", description = "Internal Server Error.")
    })
    public ResponseEntity<List<NewsDTO>> getNewsByUser(
            @Parameter(description = "The user identifier code", required = true, example = "1")
            @PathVariable Long userId) {
        return ResponseEntity.ok(newsService.getNewsFavoriteByUser(userId));
    }

    @GetMapping("/ByTitle/{title}")
    @Operation(summary = "Get all Favorite News by Title", description = "Retrieves a Favorite News by its Title.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success, return the Favorite News."),
            @ApiResponse(responseCode = "404", description = "Not found, Favorite News not found."),
            @ApiResponse(responseCode = "500", description = "Internal Server Error.")
    })
    public ResponseEntity<NewsDTO> getNewsByUser(
            @Parameter(description = "The News' Title ", required = true, example = "Lorem ipsum")
            @PathVariable String title) {
        return ResponseEntity.ok(newsService.getNewsByTitle(title));
    }

    @PostMapping()
    @Operation(summary = "Add a new Favorite News", description = "Register a new Favorite News with the information provided." +
            "if the Favorite News already register, only add the User")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success, returns the registered Favorite News."),
            @ApiResponse(responseCode = "400", description = "Bad Request."),
            @ApiResponse(responseCode = "404", description = "Not found, User not found."),
            @ApiResponse(responseCode = "500", description = "Internal Server Error.")
    })
    public ResponseEntity<NewsDTO> addFavoriteNews(@RequestBody RequestDTO requestDTO) {
        return ResponseEntity.ok(newsService.addFavoriteNews(requestDTO));
    }

    @DeleteMapping("/{externalId}&{userId}")
    @Operation(summary = "Delete User of a Favorite News", description = "Delete a User of Favorite News with the information provided.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success, returns the delete Favorite News."),
            @ApiResponse(responseCode = "404", description = "Not found, User or Favorite News  not found."),
            @ApiResponse(responseCode = "500", description = "Internal Server Error.")
    })
    public ResponseEntity<NewsDTO> deleteFavorite(
            @Parameter(description = "The external identifier code, provide https://api.spaceflightnewsapi.net/v4/articles api",
                    required = true, example = "22698")
            @PathVariable Long externalId,
            @Parameter(description = "The user identifier code", required = true, example = "1")
            @PathVariable Long userId) {
        return ResponseEntity.ok(newsService.deleteFavorite(externalId, userId));
    }

}
