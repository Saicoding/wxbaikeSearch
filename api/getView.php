<?php
header('Content-Type:application/json; charset=utf-8');
//ini_set("display_errors", "On");
//error_reporting(E_ALL | E_STRICT);
//引入数据库类
require 'mysql.php';

$openid = $_POST['openid'];
$name = $_POST['name'];
$sex = $_POST['sex'];
$avatar = $_POST['avatar'];
$city = $_POST['city'];
$province = $_POST['province'];

date_default_timezone_set('PRC'); //设为中国时区

//实例化并创建对象
$Mysql = Mysql::mysql('user');

$where = "where openid = '".$openid."'";

//多选模式
$objects = $Mysql->fields('*')->where($where)->select();

//说明用户不存在,就插入表
file_put_contents('test.txt',$openid);

$res['Data'] = null;

$name = UnicodeEncode($name);

if(count($objects) ==0){
    $arr = array(
        "openid" => $openid,
        "canview" => 900,
        "hasview" => 0,
        "cdate" => date("Y-m-d H:i:s")
    );

    $Mysql->insertUser($arr);
    $res['Data'] = '注册';
}else{
    if($name){
        $arr = array(
            "name" => $name,
            "sex" => $sex,
            "avatar" => $avatar,
            "city" => $city,
            "province" => $province
        );
        $Mysql->updateUser($arr, $openid);
        $res['Data'] = $objects;
    }else{
        $res['Data'] = $objects;
    }
}

exit(json_encode($res));

// 编码
function UnicodeEncode($str){
    //split word
    preg_match_all('/./u',$str,$matches);

    $unicodeStr = "";
    foreach($matches[0] as $m){
        //拼接
        $unicodeStr .= "&#".base_convert(bin2hex(iconv('UTF-8',"UCS-4",$m)),16,10);
    }
    return $unicodeStr;
}

// 解码
function unicodeDecode($unicode_str){
    $json = '{"str":"'.$unicode_str.'"}';
    $arr = json_decode($json,true);
    if(empty($arr)) return '';
    return $arr['str'];
}


