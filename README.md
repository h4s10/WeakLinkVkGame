# WeakLink vk game

WeakLink game, based on signalR


## Запуск
Запуск можно сделать одной командой:

    docker-compose up

Если были какие-то изменения, то нужно сделать билд образов командой:

    docker-compose build

## Примечания
- База данных хранится в папке ./db
- Вопросы хранятся в ./WeakLinkGame/WeakLinkGame.API/questions.txt
- Настройки бэкенда лежат в ./WeakLinkGame/WeakLinkGame.API/appsettings.json