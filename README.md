# Quiz Application

## Description

A web-based quiz application where users can create and attempt quizzes based on
topics. Admins can create, update, and delete topics, while regular users can
log in, view topics, and attempt quizzes.

## Live Application
You can access the live version of the application here: `https://quiz-application-diiv.onrender.com`.



## Features

# Admin functionalities:
Admin can create new topics.
Admin can delete existing topics.
Admin can make questions for quiz.
Admin can manage questions under each topic.

# User functionalities:
Users can log in.
Users can view available topics.
User can make questions for quiz.
Users can take quizzes related to each topic.

# Question creation:
Admin can add topics.

# Responsive UI:
The application is built to work well on different devices (desktop, tablet, mobile).

## Prerequisites

To run this application, you need the following software installed:

Deno PostgreSQL (for the database) A code editor such as VS Code

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/farsanau/quiz-application.git
   ```

2. Navigate into the project directory:
   ```bash
   cd quiz-application
   ```

3. Install dependencies: If you're using Deno, there's no need for a package
   manager like npm, but you can specify necessary libraries in a `deps.js`
   file.
4. Setup PostgreSQL database: Make sure PostgreSQL is running and create the
   required database tables. Flyway will create the database tables when we run
   the application. Put the SQL statement below for creating database table in
   the flyway.

CREATE TABLE users ( id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE, admin
BOOLEAN DEFAULT FALSE, password CHAR(60) );

CREATE TABLE topics ( id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES
users(id), name VARCHAR(255) UNIQUE );

CREATE TABLE questions ( id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES
users(id), topic_id INTEGER REFERENCES topics(id), question_text TEXT NOT NULL
);

CREATE TABLE question_answer_options ( id SERIAL PRIMARY KEY, question_id
INTEGER REFERENCES questions(id), option_text TEXT NOT NULL, is_correct BOOLEAN
DEFAULT FALSE );

CREATE TABLE question_answers ( id SERIAL PRIMARY KEY, user_id INTEGER
REFERENCES users(id), question_id INTEGER REFERENCES questions(id),
question_answer_option_id INTEGER REFERENCES question_answer_options(id) );

CREATE UNIQUE INDEX ON users((lower(email))); 5. Run the app:

`docker compose up --build`

## Database

When the Quiz Application is up and running, you can access the PostgreSQL
database from the terminal using the following command:

```
docker exec -it database-server psql -U username database
```

This opens up `psql` console, where you can write SQL commands

## Usage

Once the app is running, open your browser and navigate to
`http://localhost:7777`.



# Login:

Use the default credentials: Email: admin@admin.com Password: 123456

# Admin Panel:

Once logged in as an admin, you can manage topics and questions. You can create
new topics and add questions to each topic. Taking Quizzes:

After logging in, you can navigate to the topics page and select a topic. You
will be redirected to a page with questions related to the selected topic.

## Testing

This project uses Playwright for end-to-end testing.

# Run tests:

Ensure that your application is running on http://localhost:7777.

Run the following command to execute the tests:

bash Copy code `npm test` This will run all the Playwright tests and show the
results in the console.
