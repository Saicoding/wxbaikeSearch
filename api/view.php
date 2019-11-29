<?php
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);


$name = $_GET['name'];
$num = $_GET['num'];
$url = $_GET['url'];

file_put_contents('text.txt',$url);

if($name){
    $url = 'https://baike.baidu.com/item/'.$name.'/'.$num;
}

$html = file_get_contents($url);

$preg = "/<script[\s\S]*?<\/script>/i";

$html = preg_replace($preg,"",$html);    //第四个参数中的3表示替换3次，默认是-1，替换全部

$myfile = fopen("view.html", "w");

fwrite($myfile, $html);

fclose($myfile);

$res['Data'] = $name;

exit(json_encode($res));

