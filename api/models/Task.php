<?php
class Task {
    private $conn;
    private $table = 'tasks';

    public $id;
    public $title;
    public $description;
    public $deadline;
    public $priority;
    public $status;
    public $created_at;#this is auto generated

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all tasks
    public function getTasks($filter = null, $sortBy = null) {
        $query = "SELECT * FROM " . $this->table;

        // Apply filters
        if ($filter) {
            if ($filter === 'completed') {
                $query .= " WHERE status = 'Completed'";
            } elseif ($filter === 'notcompleted') {
                $query .= " WHERE status = 'ToDo'";
            } elseif ($filter === 'highpriority') {
                $query .= " WHERE priority = 'High'";
            }
        }

        // Apply sorting
        if ($sortBy) {
            if ($sortBy === 'deadline') {
                $query .= " ORDER BY deadline ASC";
            } elseif ($sortBy === 'priority') {
                $query .= " ORDER BY FIELD(priority, 'High', 'Medium', 'Low')";
            }
        } else {
            $query .= " ORDER BY created_at DESC";
        }

        $result = $this->conn->query($query);
        return $result;
    }

    // Get single task
    public function getTaskById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->get_result();
    }

    // Create task
    public function createTask() {
        $query = "INSERT INTO " . $this->table . "
                  (title, description, deadline, priority, status)
                  VALUES (?, ?, ?, ?, 'ToDo')";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssss", $this->title, $this->description, $this->deadline, $this->priority);

        return $stmt->execute();
    }

    // Update task
    public function updateTask($id) {
        $query = "UPDATE " . $this->table . "
                  SET title = ?, description = ?, deadline = ?, priority = ?, status = ?
                  WHERE id = ?";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sssssi", $this->title, $this->description, $this->deadline, $this->priority, $this->status, $id);

        return $stmt->execute();
    }

    // Delete task
    public function deleteTask($id) {
        $query = "DELETE FROM " . $this->table . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
?>