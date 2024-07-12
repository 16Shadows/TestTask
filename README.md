# Описание
Веб-приложение простого менеджера паролей, реализован в качестве тестового задания.
## Стэк бекэнда
* ASP.NET Core 7
* Entity Framework
* PostgreSQL
* +Swagger в режиме разработки
## Структура бекэнда
Бекэнд реализован в виде ASP.NET Core 7 WebApi (контроллеры).

Для доступа к БД используется EntityFramework (DbContext).

В роли посредника между контроллером и контекстом БД выступает репозиторий.
## Стек фронтэнда
* Angular 18
* NgxBootstrap
## Структура фронтэнда
На фронтэнде интерфейс реализован с помощью standalone angular-компонентов.

Для доступа к данным компоненты используют репозитории (репозиторий представлен абстрактным классом как замена интерфейса, которая существует в рантайме; репозиторий реализуется конкретным классом, который предоставляется компонентам через DI).

Для совершения запросов к бекэнду репозиторий использует сервис, который в свою очередь использует HttpClient.

Такое разделение позволяет отделить HTTP-запросы от бизнес-логики (хотя в данном случае репозиторий практически полностью переправляет запросы к сервису).
# Инструкция по запуску
Для запуска необходимо использовать docker-compose.
При запуске контейнер веб-сервера занимает стандартный HTTP-порт (80).
Шаги для запуска через docker-compose:
1. Создать файл `.env` в корневой директории проекта со следующим содержанием:
    ````
    POSTGRES_DATABASE=название_базы
    POSTGRES_PASSWORD=пароль_базы
    POSTGRES_USER=пользователь_базы
    ````
    Эти параметры будут использованы при создании и подключении к БД.
2. Запустить систему из корневой директории командой `docker-compose up`.
3. После запуска всех контейнеров перейти на http://localhost:80.
