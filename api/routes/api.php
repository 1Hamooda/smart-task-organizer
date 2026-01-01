<?php
require_once '../controllers/TaskController.php';

$taskController = new TaskController();

header('Content-Type: application/json');

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
        echo json_encode(['message' => 'Method Not Allowed']);
        break;
}