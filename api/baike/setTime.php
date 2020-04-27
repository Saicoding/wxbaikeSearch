<?php
header('Content-Type:application/json; charset=utf-8');
//ini_set("display_errors", "On");
//error_reporting(E_ALL | E_STRICT);
//引入数据库类
require '../common/mysql.php';

$openid = $_POST['openid'];
$hasview = $_POST['hasview'];

date_default_timezone_set('PRC'); //设为中国时区

//实例化并创建对象
$Mysql = Mysql::mysql('user');

$res['Data'] = null;

$arr = array(
    "hasview" => $hasview,
    "vdate" =>  date("Y-m-d H:i:s")
);

$Mysql->updateUser($arr, $openid);
$res['Data'] = '更新';


exit(json_encode($res));

