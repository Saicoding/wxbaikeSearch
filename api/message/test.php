<?php

class Request
{
    public function getAccessToken($appid, $appsecret)
    {
        $url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' . $appid . '&secret=' . $appsecret;
        $html = file_get_contents($url);
        $output = json_decode($html, true);
        $access_token = $output['access_token'];
        return $access_token;
    }
    /*
        *   php访问url路径，post请求
        *
        *   durl   路径url
        *   post_data   array()   post参数数据
        */
    public function curl_file_post_contents($durl, $post_data){
        // header传送格式
        $headers = array("Content-type: application/json;charset=UTF-8", "Accept: application/json", "Cache-Control: no-cache", "Pragma: no-cache");
        //初始化
        $curl = curl_init();
        //设置抓取的url
        curl_setopt($curl, CURLOPT_URL, $durl);
        //设置头文件的信息作为数据流输出
        curl_setopt($curl, CURLOPT_HEADER, false);
        //设置获取的信息以文件流的形式返回，而不是直接输出。
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        //设置post方式提交
        curl_setopt($curl, CURLOPT_POST, true);
        // 设置post请求参数

        $post_data = json_encode($post_data);

        curl_setopt($curl, CURLOPT_POSTFIELDS, $post_data);
        // 添加头信息
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
        // CURLINFO_HEADER_OUT选项可以拿到请求头信息
        curl_setopt($curl, CURLINFO_HEADER_OUT, true);
        // 不验证SSL
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
        //执行命令
        $data = curl_exec($curl);
        // 打印请求头信息
//        echo curl_getinfo($curl, CURLINFO_HEADER_OUT);
        //关闭URL请求
        curl_close($curl);
        //显示获得的数据
        return $data;
    }
}

$Request = new Request();

$post_data = array(
    "touser"=>"onU2I5BPZcB3664ePZydctJIsISQ",
    "template_id"=>"cghFs7Vc5etuAGpDsWLHs2coRiqbWmprV5AnrCLt5iU",
    "page"=>"/pages/index/index",
    "data"=>[
        'thing1'=>['value'=>'面试通知','color'=>'#173177'],
        'thing2'=>['value'=>'前往面试','color'=>'#173177'],
        'number3'=>['value'=>10],
        'thing4'=>['value'=>'提示说明只说一次']
    ]
);

$access_token = $Request->getAccessToken('wx31bb8b5bd62d6251','638037514566d37ee6ba7873842e7818');

$data = $Request->curl_file_post_contents('https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token='.$access_token,$post_data);

echo $data;
?>
