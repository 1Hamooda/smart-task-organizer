<?php
// Load configuration
require_once 'config/Database.php';
require_once 'controllers/TaskController.php';

// Initialize database connection
$database = new Database();
$db = $database->getConnection();

// Initialize the TaskController
$taskController = new TaskController($db);

// Handle incoming requests and route them
$requestMethod = $_SERVER['REQUEST_METHOD'];
switch ($requestMethod) {
    case 'GET':
        if (isset($_GET['id'])) {
            $taskController->getTask($_GET['id']);
        } else {
            $taskController->getTasks();
        }
        break;
    case 'POST':
        $taskController->createTask();
        break;
    case 'PUT':
        $taskController->updateTask();
        break;
    case 'DELETE':
        $taskController->deleteTask();
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}
?>