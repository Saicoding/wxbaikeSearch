<?php
header('Content-Type:application/json; charset=utf-8');
//引入数据库类
require 'mysql.php';


$PageSize = $_POST['PageSize'];
$PageIndex = $_POST['PageIndex'];
$where = $_POST['Where'];



//实例化并创建对象
$Mysql = Mysql::mysql('baike');

//多选模式
$objects = $Mysql->fields('*')->limit(($PageIndex-1)*$PageSize,$PageIndex*$PageSize)->where($where)->order('id desc')->select();


$res['Data'] = $objects;
$res['PageIndex'] = $PageIndex;


//count打印有几条
exit(json_encode($res));