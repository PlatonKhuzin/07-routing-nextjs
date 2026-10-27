# 07-routing-nextjs — NoteHub

Next.js App Router, TypeScript, Axios, TanStack Query, Formik, Yup and CSS Modules.

## Запуск

1. Откройте папку, в которой лежит package.json.
2. Выполните `npm install`.
3. Создайте `.env.local` рядом с package.json:

```dotenv
NEXT_PUBLIC_NOTEHUB_TOKEN=ваш_токен_NoteHub
```

Используйте тот же токен, что и для шестого задания, без слова Bearer.

4. Выполните `npm run dev` и откройте http://localhost:3000.

## Маршруты

- `/` — главная страница.
- `/notes/filter/all` — все заметки; параметр tag в API не передается.
- `/notes/filter/Work` — фильтр; доступны также Todo, Personal, Meeting, Shopping.
- `/notes/[id]` — отдельная страница заметки при прямом открытии или обновлении.
- Ссылка View details из списка открывает перехваченный маршрут в модальном окне. Escape, Close и клик по фону вызывают router.back(), сохраняя список, фильтр, поиск и страницу. Кнопки Back/Forward браузера позволяют закрыть и снова открыть превью.
- Несуществующие маршруты и неверные фильтры показывают страницу 404.

Фильтрация использует catch-all `[...slug]` и параллельный слот `@sidebar`. Превью использует корневой слот `@modal` и `(.)notes/[id]`. Серверные страницы заранее загружают данные и гидратируют кеш; ключ списка включает тег, поиск и страницу. API-функции находятся в `lib/api/index.ts`.

## Проверка

```bash
npm run build
npm run format:check
```

Вручную проверьте смену всех тегов, поиск, пагинацию, создание и удаление, View details, закрытие превью через Escape/фон/Close, Back/Forward, обновление открытой заметки и неизвестный URL. Проверьте работу с вашим токеном перед сдачей.

## Vercel

Импортируйте репозиторий `07-routing-nextjs`, оставьте настройки Next.js по умолчанию. Добавьте переменную `NEXT_PUBLIC_NOTEHUB_TOKEN` со значением токена до Deploy. При изменении токена выполните Redeploy. `.env.local` не загружается в GitHub.

Для сдачи нужны ссылка на GitHub и постоянный production URL из Domains на Vercel.

Стили предоставлены GoIT: https://github.com/goitacademy/react-notehub-styles/tree/hw-07. Лицензия: STYLES-LICENSE.
