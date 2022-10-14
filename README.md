# WeakLink vk game

WeakLink game, based on signalR

## Подготовка

Если были какие-то изменения, то нужно сделать билд образов командой:

```    docker-compose build```


## Запуск

Запуск можно сделать одной командой:

```    docker-compose up```

После этого нужно открыть [http://localhost](http://localhost)

Чтобы остановить запущенный проект, нажмите command + C


## Примечания
- База данных хранится в папке ./db
- Вопросы хранятся в ./WeakLinkGame/WeakLinkGame.API/questions.txt
- Настройки бэкенда лежат в ./WeakLinkGame/WeakLinkGame.API/appsettings.json
- длительности раундов и количества игроков хранятся в ./WeakLinkGame/www/src/lib/settings.ts
