# Smart Task Organizer

## Overview
The Smart Task Organizer is a simple application designed to help users manage their daily tasks efficiently. It allows users to create, edit, delete, and organize tasks based on various criteria such as deadline and priority.

## Features
- Create new tasks with a title, description, deadline, and priority.
- Edit existing tasks.
- Delete tasks.
- View a list of all tasks.
- Mark tasks as completed.
- Sort tasks by deadline and priority.
- Filter tasks to show completed, not-completed, or high-priority tasks.
- Automatically save tasks to a local file upon closing the application.
- Load saved tasks automatically when the application starts.
- Export all tasks to a text file.

## Technologies Used
- PHP for backend development.
- MySQL for database management.
- JavaScript for frontend interactivity.
- HTML and CSS for the user interface.

## Project Structure
```
smart-task-organizer
├── api
│   ├── config
│   │   └── Database.php
│   ├── controllers
│   │   └── TaskController.php
│   ├── models
│   │   └── Task.php
│   ├── routes
│   │   └── api.php
│   └── index.php
├── public
│   ├── css
│   │   └── style.css
│   ├── js
│   │   └── app.js
│   └── index.html
├── exports
│   └── .gitkeep
├── .htaccess
└── README.md
```

## Setup Instructions
1. Clone the repository to your local machine.
2. Ensure you have XAMPP installed and running.
3. Place the project folder in the `htdocs` directory of your XAMPP installation.
4. Create a MySQL database and run the provided SQL script to set up the `tasks` table.
5. Update the database connection settings in `api/config/Database.php` as needed.
6. Access the application via your web browser at `http://localhost/smart-task-organizer/public/index.html`.

## Usage
- Open the application in your web browser.
- Use the interface to add, edit, delete, and manage your tasks.
- Tasks will be saved automatically, and you can export them as needed.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License
This project is open-source and available under the MIT License.