<?php
require_once 'models/Task.php';

class TaskController {
    private $db;
    private $task;

    public function __construct($db) {
        $this->db = $db;
        $this->task = new Task($db);
        header('Content-Type: application/json');
    }

    // Get all tasks or filtered/sorted
    public function getTasks() {
        $filter = isset($_GET['filter']) ? $_GET['filter'] : null;
        $sortBy = isset($_GET['sort']) ? $_GET['sort'] : null;

        $result = $this->task->getTasks($filter, $sortBy);

        if ($result->num_rows > 0) {
            $tasks = [];
            while ($row = $result->fetch_assoc()) {
                $tasks[] = $row;
            }
            http_response_code(200);
            echo json_encode(["status" => "success", "data" => $tasks]);
        } else {
            http_response_code(200);
            echo json_encode(["status" => "success", "data" => []]);
        }
    }

    // Get single task
    public function getTask($id) {
        $result = $this->task->getTaskById($id);

        if ($result->num_rows > 0) {
            http_response_code(200);
            echo json_encode(["status" => "success", "data" => $result->fetch_assoc()]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Task not found"]);
        }
    }

    // Create task
    public function createTask() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data || !isset($data['title'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Title is required"]);
            return;
        }

        $this->task->title = $data['title'];
        $this->task->description = $data['description'] ?? '';
        $this->task->deadline = $data['deadline'] ?? null;
        $this->task->priority = $data['priority'] ?? 'Medium';

        if ($this->task->createTask()) {
            http_response_code(201);
            echo json_encode(["status" => "success", "message" => "Task created"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to create task"]);
        }
    }

    // Update task
    public function updateTask() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data || !isset($data['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID is required"]);
            return;
        }

        $this->task->title = $data['title'] ?? '';
        $this->task->description = $data['description'] ?? '';
        $this->task->deadline = $data['deadline'] ?? null;
        $this->task->priority = $data['priority'] ?? 'Medium';
        $this->task->status = $data['status'] ?? 'ToDo';

        if ($this->task->updateTask($data['id'])) {
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Task updated"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to update task"]);
        }
    }

    // Delete task
    public function deleteTask() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data || !isset($data['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID is required"]);
            return;
        }

        if ($this->task->deleteTask($data['id'])) {
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Task deleted"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to delete task"]);
        }
    }
}
?>