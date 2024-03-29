import { createEffect, createStore } from 'effector-logger';
import { CreateUserRequest, request, RestTask, User } from '../api';

export const users = createStore<User[]>([], {
  name: 'Known users',
  updateFilter: (newUsers, oldUsers) => newUsers.length !== oldUsers.length || newUsers.some((s, i) => s.id !== oldUsers[i].id)
});

export const refresh = createEffect({
  name: 'Refresh users',
  handler: () => request<User[], void>('GET', RestTask.Users),
});

export const create = createEffect({
  name: 'Create user',
  handler: (name: string) => request<void, CreateUserRequest>('POST', RestTask.Users, { Name: name }),
})

users.on(refresh.doneData, (prevUsers, newUsers) => newUsers);
create.finally.watch(() => refresh());

(window as any).debug = {
  ...(window as any).debug ?? {},
  createUser: create,
  refreshUsers: refresh,
  populateUsers: (set = Math.floor(Math.random() * 4)) =>
    [
      ['Лиза Кудроу', 'Илон Маск', 'Павел Дуров', 'Иван Дорн', 'Юрий Дудь', 'Билли Айлиш'],
      ['Дмитрий', 'Степан', 'Анна', 'Олег', 'Станислав', 'Елена'],
      ['Спотти', 'Персик', 'Сеня', 'Дигги', 'Лис', 'Спаркс'],
      ['Аяк', 'Серси', 'Икарис', 'Кинго', 'Спрайт', 'Фастос', 'Маккари', 'Друиг', 'Гильгамеш', 'Фина' ]
    ][set].map(create),
}

