<?php

 $connection = null;


// this function is called everytime this class is instantiated
$dbhost = "localhost"; $dbname = "quiz"; $username = "root"; $password = "";
try{
    $connection = new PDO("mysql:host={$dbhost};dbname={$dbname};", $username, $password);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

}catch(Exception $e){
    throw new Exception($e->getMessage());
}
//function __construct( $dbhost = "localhost", $dbname = "quiz", $username = "root", $password = ""){
//
//
//}

function executeStatement($query,$params = ''){
    try{
        global $database;
        global $connection;
        $stmt = $connection->prepare($query);
        if(is_array($params)){
            foreach($params as $key => $value){
                $value = trim($value);
                $value = htmlentities($value, ENT_QUOTES);
                $stmt->bindValue(":$key", $value);
            }
            $stmt->execute();
            return $stmt;
        } else {
            $stmt->execute();
            return $stmt;
        }
    }catch(Exception $e){
        throw new Exception($e->getMessage());
    }

}
     function matchKeys($array){
        $keys_params = [];

        foreach ($array as $key => $value){
            $keys_params[] = $key;
        }
        return implode(",", $keys_params);

    }
     function matchValues($array){

        $values = [];
        foreach ($array as $key => $value){
            $new = ":".$key;
            $values[] = $new;
        }
        return implode(",", $values);
    }

function insert( $query ,array $params){
    try{
        global $database;
        global $connection;
        executeStatement( $query , $params );
        return $connection->lastInsertId();

    }catch(Exception $e){
        throw new Exception($e->getMessage());
    }
}
$params = [
                    "name" => 'Alex',"score" =>'100'
                ];

$query = "INSERT INTO quiz (" . matchKeys($params). ") VALUES (". matchValues($params) .")";
if(insert($query,$params)){
    echo "working";
}

?>











