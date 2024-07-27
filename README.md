# The Matrix

Welcome to **The Matrix**, an application that empowers athletes and their coaches to track and analyze their workouts with precision and ease. 

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [Technologies Used](#technologies-used)

## Introduction

As a Division I track and field athlete, I tracked my fair share of running data. My high school coach, a very influential figure in my life, tracked all of my workouts in high school with an elaborate spreadsheet he called **The Matrix**. As a Software Engineering student now, I was inspired to build a web-app that advances the idea of **The Matrix**, making it a comprehensive web-app designed to enhance the analysis of distance runners' training logs. Whether  logging distance runs or structured workouts, this app allows distance runners to track their training and aggregate their data on an easily digestible user interface. It’s designed for athletes who are committed to understanding and improving their performance through detailed and organized data tracking, reflecting the same passion and dedication that my coach instilled in me.


## Features

- **Calendar View**: Visualize your monthly workouts with total weekly statistics.
- **Level Sheet**: Access detailed workout plans and progression levels.
- **Log Workouts**: Easily record your workouts, including specific sets and reps.
- **Distance Runs**: Track your long runs with detailed minute and mile records.
- **Custom Error Handling**: User-friendly error pages ensure smooth navigation.
- **Stylish UI**: Clean, intuitive interface for an enhanced user experience.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [XAMPP](https://www.apachefriends.org/index.html) (or another local server solution)
- [MySQL](https://www.mysql.com/)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/alexawenger/326-petition.git
    cd 326-petition
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Set up the MySQL database:
    - Start your XAMPP server and open phpMyAdmin.
    - Create a database named `petition`.
    - Import the database schema (provided in the `schema.sql` file).

4. Configure the database connection in `server.js`:
    ```js
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'petition'
    });
    ```

5. Start the server:
    ```sh
    node server.js
    ```

## Technologies Used

- **Frontend**: React, CSS
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Tools**: XAMPP, phpMyAdmin
