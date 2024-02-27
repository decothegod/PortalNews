# README

## Instrucciones de Construcción y Ejecución del Proyecto

### 1. Crear el archivo Jar

Para construir el archivo JAR del proyecto, ejecuta el siguiente comando en la línea de comandos:

```
mvn clean install
```

El archivo JAR generado estará en el directorio **_target_** con un nombre similar a news-[VERSION].jar.

### 2. Despliegue en el Servidor

Para Deplegar el servicio, ejecuta el siguente comando en la línea de comandos:

```
java -jar target/news-[VERSION].jar
```

**_Ejemplo:_**

```
java -jar target/news-0.0.1-SNAPSHOT.jar
```

### 3. Acceder a la Aplicación

EL servicio corre en la siguiente ruta: **_[http://localhost:8080/v1/](http://localhost:8080/v1/)_**.

### 4. Endpoints Disponibles

Los endpoints disponibles son:

- auth:
    - newsFavorite (GET)
    - newsFavorite (POST)
    - newsFavorite/ByUser (GET) 
    - newsFavorite/ByTitle (GET)
    - newsFavorite (DELETE)

Los endpoints antes mencionados están detallados en el siguente
swagger: [Swagger](http://localhost:8080/swagger-ui/index.html#/) y/o en
siguente [yaml](src/main/resources/api-docs.yaml)

## Sobre la Aplicacion:

### Base de Datos

Al momento de correr la aplicación, se crea una base de datos en memoria [h2](http://localhost:8080/h2-console), cuya
credenciales son:

```
username=sa
password=
```

Las tablas de esta aplicación son:

- **USER**
  ~~~
  id (KEY)
  username
  ~~~
  
- **NEWS**
  ~~~
   id (KEY)
   externalId;
   title;
   description;
   summary;
   publishedAt;
   favoriteAt;
  ~~~

  Tabla que contiene las noticas favorita de los usuarios.


- **USERS_FAVORITE_NEWS**
  ~~~
  favoriteNews (ManyToMany)
  usersMarkFavorite (ManyToMany)
  ~~~  

  Tabla que springboot genera automaticamente y solo contiene la claves foráneas de la las tablas **USER** y **NEWS**
  para reflejar la relacion mucho a muchos que tiene el modelo.


### Diagramas de la Solución

## Notas Adicionales

* SpringBoot está diseñado para ejecutar aplicaciones en forma autónoma, incluye un servidor Tomcat embebido. Se puede
  ejecutar la aplicación directamente, sin necesidad de un servidor Tomcat externo.
* La documentación Swagger se genera una vez que se ejecuta la aplicacion (Despliegue de la aplicación).
* La base de datos se pre-cargan con estos [datos](src/main/resources/data.sql) para la tabla **USER**
* Revisa la documentación detallada de cada endpoint para comprender mejor su funcionamiento y contratos de entrada.
* Por efecto de esta Demo, la version de este es **0.0.1-SNAPSHOT**.
* La version de spring boot **3.2.2** presenta Vulnerabilidad en una
  dependencia ([CVE-2023-51074](https://devhub.checkmarx.com/cve-details/CVE-2023-51074/)), recomiendan simpre utilizar
  la versión más reciente de Spring Boot para evitar ataques maliciosos.
* La capa de Front-End esta desarrollado con Angular 17. y Bootstrap v5.3
