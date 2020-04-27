<?php
//数据库类
class Mysql
{
    //将PDO对象保存至属性
    private $con;
    //将表名保存至属性
    private $table;
    //条件属性
    private $where;
    //字段属性
    private $fields = '*';
    //limit属性
    private $limit;
    //order属性
    private $order;
    //count属性
    private $count;

    //构造方法，自动PDO连接数据库
    public function __construct($table)
    {
        // try {

            //引入配置文件
            $config = require('config.php');

            //连接MySQL数据库
            // $pdo = new PDO('mysql:host='.$config['DB_HOST'].';dbname='.$config['DB_NAME'], $config['DB_USER'], $config['DB_PASS']);
            $con = mysqli_connect($config['DB_HOST'],$config['DB_USER'],$config['DB_PASS'],$config['DB_NAME']);

            if (!$con )
                {
                    die("连接错误: " . mysqli_connect_error());
                }

            //设置UTF8字符编码
            $con ->query('SET NAMES UTF8MB4');

            //保存PDO对象为属性
            $this->con = $con;

            //保存数据表名
            $this->table = '`'.$table.'`';

        // } catch (PDOException $e) {
        //     //输出错误信息
        //     echo $e->getMessage();
        // }
    }
    //内部自我实例化，静态方法
    public static function mysql($table)
    {
        return new self($table);
    }

    //给一个数组，数组键名为列，数组值为列值
    public function insertUser($arr){
   //file_put_contents('user.txt',$sql);
        $keys = '';
        $values = '';

        foreach ($arr as $key => $value) {
            $keys .= $key . ',';
            $values .= '"' . $value . '"' . ',';
        }
        $keys = substr($keys,0,(strlen($keys) - 1));
        $values = substr($values,0,(strlen($values) - 1));

        $sql = "insert into user ( $keys ) values ( $values );";

        //file_put_contents('sqlUser.txt',$sql);

        //得到准备对象
        $stmt = $this->query($sql);
    }

    public function updateUser($arr,$openid){
        $set = "";
        foreach ($arr as $key => $value) {
            $set .= $key . '="' .$value. '",';
        }

        $set = substr($set,0,(strlen($set) - 1));

        $sql = "update user set ".$set."where openid='".$openid."'";

        //得到准备对象
        $stmt = $this->query($sql);
    }

    //执行sql语句的方法
    public function query($sql){
        $res=mysqli_query($this->con,$sql);
        if(!$res){
            echo "sql语句执行失败<br>";
            echo "错误编码是".mysqli_errno($this->con)."<br>";
            echo "错误信息是".mysqli_error($this->con)."<br>";
        }
        return $res;
    }

    //获取一条记录,前置条件通过资源获取一条记录
    public function getFormSource($query,$type="assoc"){
        if(!in_array($type,array("assoc","array","row")))
        {
        die("mysqli_query error");
        }
        $funcname="mysqli_fetch_".$type;
        return $funcname($query);
    }

    ///多查询方法
    public function select()
    {
        //重组SQL语句
        $sql = "SELECT $this->fields FROM $this->table $this->where $this->order $this->limit ";

        //得到准备对象
        $query=$this->query($sql);
        $list=array();

        while ($r=$this->getFormSource($query)) {
            file_put_contents('User.txt',$r);
         $list[]=$r;
        }


        return $list;
    }

    //所有的where条件都在这里
    public function where($param)
    {


        //合并成判断条件，保存到属性里去
//        "WHERE (`$key`$sign'$value')";
        $this->where = $param;

        //返回当前Mysql对象
        return $this;
    }

    //所有的字段设置都在这里
    public function fields($fields)
    {

        //给fields 加上`符号
        $fields = explode(',', $fields);

        //将字段数组加上防止冲突的`符号
        foreach ($fields as $key=>$value) {
            $fields[$key] = "`$value`";
        }

        //得到值字符串
        $this->fields = implode(',', $fields);

        //Mysql对象
        return $this;
    }

    //所有的limit 设置都在这里
    public function limit($start, $end)
    {
        //得到Limit 字符串
        $this->limit = "LIMIT $start, $end";
        //返回当前Mysql 对象
        return $this;
    }

    //所有的order设置都在这里
    public function order($param)
    {

        //分割字符和排序关键字
        $order = explode(' ', $param);

        //组装排序SQL
        $this->order = "ORDER BY `$order[0]` ".strtoupper($order[1]);

        //返回Mysql对象
        return $this;
    }

    //返回count
    public function count()
    {
        //返回记录数
        return $this->count;
    }
}