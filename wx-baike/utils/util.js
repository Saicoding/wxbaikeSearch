/**
 * 获取当前时间
 */
function getCurrentDate() {
  let mydate = new Date();
  let y = mydate.getFullYear();
  let m = mydate.getMonth() + 1;
  m = m < 10 ? '0' + m : m

  let d = mydate.getDate(); //获取当前日(1-31)
  d = d < 10 ? '0' + d : d;

  var hour = mydate.getHours();
  hour = hour < 10 ? '0' + hour : hour

  var minute = mydate.getMinutes();
  minute = minute < 10 ? '0' + minute : minute
  var second = mydate.getSeconds();
  second = second < 10 ? '0' + second : second;

  let date = y + '-' + m + '-' + d + ' ' + hour+':'+minute+':'+second;
  return date
}

function getCurrentDate1() {
  let mydate = new Date();
  let y = mydate.getFullYear();
  let m = mydate.getMonth() + 1;
  m = m < 10 ? '0' + m : m

  let d = mydate.getDate(); //获取当前日(1-31)
  d = d < 10 ? '0' + d : d;

  let date = y + '-' + m + '-' + d 
  return date
}

/**
 * 词条类型列表
 */

// 词条类型
const flags = [{
    type: '人物',
    items: [{
        Text: "不限"
      },
      {
        Text: "人物"
      },
      {
        Text: "演员"
      },
      {
        Text: "官员"
      },
      {
        Text: "导演"
      },
      {
        Text: "编剧"
      },
      {
        Text: "音乐人物"
      },
      {
        Text: "其他娱乐人物"
      },
      {
        Text: "政治人物"
      },
      {
        Text: "企业人物"
      },
      {
        Text: "体育人物"
      },
      {
        Text: "历史人物"
      },
      {
        Text: "文化人物"
      },
      {
        Text: "科学家"
      },
      {
        Text: "虚拟人物"
      },
      {
        Text: "医生"
      },
      {
        Text: "教师"
      },
      {
        Text: "其他行业人物"
      },
      {
        Text: "话题人物"
      },
      {
        Text: "电竞人物"
      },
      {
        Text: "其他人物"
      }
    ]
  },

  {
    type: '生活',
    items: [{
        Text: "不限"
      },
      {
        Text: "品牌"
      },
      {
        Text: "生活用品"
      },
      {
        Text: "菜品"
      },
      {
        Text: "其他食品"
      },
      {
        Text: "其他生活相关"
      }
    ]
  },
  {
    type: '自然',
    items: [{
        Text: "不限"
      },
      {
        Text: "动物"
      },
      {
        Text: "植物"
      },
      {
        Text: "微生物"
      },
      {
        Text: "其他生物"
      },
      {
        Text: "自然资源"
      },
      {
        Text: "自然现象"
      },
      {
        Text: "星体"
      },
      {
        Text: "其他自然相关"
      }
    ]
  },
  {
    type: '文化',
    items: [{
        Text: "不限"
      },
      {
        Text: "文学作品"
      },
      {
        Text: "艺术品"
      },
      {
        Text: "书籍"
      },
      {
        Text: "期刊"
      },
      {
        Text: "其他出版物"
      },
      {
        Text: "古诗文"
      },
      {
        Text: "论文"
      },
      {
        Text: "节日"
      },
      {
        Text: "其他民俗"
      },
      {
        Text: "字词"
      },
      {
        Text: "文具"
      },
      {
        Text: "文化活动"
      },
      {
        Text: "文化术语"
      },
      {
        Text: "森林公园"
      },
      {
        Text: "自然保护区"
      },
      {
        Text: "其他景观景点"
      },
      {
        Text: "其他文化相关"
      }
    ]
  },
  {
    type: '体育',
    items: [{
        Text: "不限"
      },
      {
        Text: "体育赛事"
      },
      {
        Text: "体育项目"
      },
      {
        Text: "体育设施"
      },
      {
        Text: "运动队"
      },
      {
        Text: "俱乐部"
      },
      {
        Text: "体育人物"
      },
      {
        Text: "其他体育相关"
      }
    ]
  },
  {
    type: '社会',
    items: [{
        Text: "不限"
      },
      {
        Text: "教育机构"
      },
      {
        Text: "企业"
      },
      {
        Text: "医院"
      },
      {
        Text: "博物馆"
      },
      {
        Text: "科研机构"
      },
      {
        Text: "团队"
      },
      {
        Text: "其他组织机构"
      },
      {
        Text: "奖项"
      },
      {
        Text: "社会事件"
      },
      {
        Text: "社会活动"
      },
      {
        Text: "武器装备"
      },
      {
        Text: "法律法规"
      },
      {
        Text: "交通工具"
      },
      {
        Text: "城市轨道交通"
      },
      {
        Text: "民用机场"
      },
      {
        Text: "火车站"
      },
      {
        Text: "城市公交"
      },
      {
        Text: "其他社会相关"
      }
    ]
  },
  {
    type: '历史',
    items: [{
        Text: "不限"
      },
      {
        Text: "战役"
      },
      {
        Text: "其他历史事件"
      },
      {
        Text: "历史机构"
      },
      {
        Text: "历史著作"
      },
      {
        Text: "文物考古"
      },
      {
        Text: "年代"
      },
      {
        Text: "历史人物"
      },
      {
        Text: "其他历史相关"
      }
    ]
  },
  {
    type: '地理',
    items: [{
        Text: "不限"
      },
      {
        Text: "森林公园"
      },
      {
        Text: "自然保护区"
      },
      {
        Text: "其他景观景点"
      },
      {
        Text: "国家"
      },
      {
        Text: "行政区划"
      },
      {
        Text: "河流"
      },
      {
        Text: "山脉"
      },
      {
        Text: "其他地形地貌"
      },
      {
        Text: "营业场所"
      },
      {
        Text: "街区路"
      },
      {
        Text: "楼盘"
      },
      {
        Text: "其他地点"
      },
      {
        Text: "其他地理相关"
      }
    ]
  },
  {
    type: '科学',
    items: [{
        Text: "不限"
      },
      {
        Text: "定理定律"
      },
      {
        Text: "定义概念"
      },
      {
        Text: "装备仪器"
      },
      {
        Text: "论文"
      },
      {
        Text: "化学品"
      },
      {
        Text: "其他学科相关"
      },
      {
        Text: "疾病症状"
      },
      {
        Text: "检查项目"
      },
      {
        Text: "疗法"
      },
      {
        Text: "手术"
      },
      {
        Text: "药品"
      },
      {
        Text: "保健品"
      },
      {
        Text: "其他医学相关"
      },
      {
        Text: "电子产品"
      },
      {
        Text: "工业产品"
      },
      {
        Text: "网站"
      },
      {
        Text: "软件"
      },
      {
        Text: "其他科技产品"
      },
      {
        Text: "科学术语"
      },
      {
        Text: "技术"
      },
      {
        Text: "其他科技相关"
      }
    ]
  },
  {
    type: '娱乐',
    items: [{
        Text: "不限"
      },
      {
        Text: "电视节目"
      },
      {
        Text: "漫画作品"
      },
      {
        Text: "动画作品"
      },
      {
        Text: "游戏作品"
      },
      {
        Text: "单曲"
      },
      {
        Text: "专辑"
      },
      {
        Text: "电影作品"
      },
      {
        Text: "电视剧作品"
      },
      {
        Text: "小说作品"
      },
      {
        Text: "轻小说作品"
      },
      {
        Text: "演出"
      },
      {
        Text: "其他娱乐作品"
      },
      {
        Text: "娱乐活动"
      },
      {
        Text: "电子产品"
      },
      {
        Text: "工业产品"
      },
      {
        Text: "其他娱乐相关"
      }
    ]
  },

  {
    type: '其他',
    items: [{
      Text: "其他"
    }]
  },
]

/**
 * 根据选中数组设置词条类型弹窗
 */
function setTypeSelect(flags, arr, params){
  let selArr =[];
  for(let i =0;i<flags.length;i++){
    let flag = flags[i];
    for(let j =0;j<flag.items.length;j++){
      if (arr.indexOf(flag.items[j].Text) !=-1){
        flag.items[j].selected = true
        selArr.push(flag.items[j].Text);
      }
    }
  }
  if (selArr.length > 0){
    params.WhereObj.Type = selArr
  }
}



module.exports = {
  getCurrentDate,
  getCurrentDate1,
  flags,
  setTypeSelect
}