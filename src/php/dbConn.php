<?php
header("Content-Type: application/json; charset=UTF-8");
$obj = json_decode($_GET["params"], false);
$mysqli = new mysqli("localhost:3306", "root", "password", "josie");
// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}
if ($obj->table == "josieimages") {
    $stmt = $mysqli->prepare("SELECT * FROM josieimages");
}
$stmt->execute();
$result = $stmt->get_result();
$outp = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($outp);
