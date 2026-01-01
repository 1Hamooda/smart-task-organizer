<?php
class Database {
    private $host = 'localhost';
    private $db_name = 'smart_tasks';
    private $user = 'root';
    private $password = '';
    private $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new mysqli(
                $this->host,
                $this->user,
                $this->password,
                $this->db_name
            );

            if ($this->conn->connect_error) {
                throw new Exception("Connection failed: " . $this->conn->connect_error);
            }
        } catch (Exception $e) {
            echo json_encode(["error" => $e->getMessage()]);
            exit();
        }

        return $this->conn;#that just for show that i do something
    }
}
?>