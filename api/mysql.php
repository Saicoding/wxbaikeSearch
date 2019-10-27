<?php
//数据库类
class Mysql
{
    //将PDO对象保存至属性
    private $pdo;
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
        try {

            //引入配置文件
            $config = require('config.php');

            //连接MySQL数据库
            $pdo = new PDO('mysql:host='.$config['DB_HOST'].';dbname='.$config['DB_NAME'], $config['DB_USER'], $config['DB_PASS']);

            //设置UTF8字符编码
            $pdo->query('SET NAMES UTF8');

            //保存PDO对象为属性
            $this->pdo = $pdo;

            //保存数据表名
            $this->table = '`'.$table.'`';

        } catch (PDOException $e) {
            //输出错误信息
            echo $e->getMessage();
        }
    }
    //内部自我实例化，静态方法
    public static function mysql($table)
    {
        return new self($table);
    }

    ///多查询方法
    public function select()
    {

        //重组SQL语句
        $sql = "SELECT $this->fields FROM $this->table $this->where $this->order $this->limit ";
        file_put_contents("sql.txt",$sql.'\n');

        //得到准备对象
        $stmt = $this->pdo->prepare($sql);

        //执行SQL语句
        $stmt->execute();

        //初始化列表对象
        $objects = [];

        //组装数据列表
        while ($rows = $stmt->fetchObject()) {
            $objects[] = $rows;
        }

        //将查询的记录数保存到count属性里
        $this->count = $stmt->rowCount();

        //返回数据对象数组
        return $objects;

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