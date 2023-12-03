let publicUrl = 'https://geo.datav.aliyun.com/areas_v2/bound/';
async function initChart() {
    let chart = echarts.init(document.getElementById('china-map'));
    let alladcode = await getGeoJson('all.json')
    let chinaGeoJson = await getGeoJson('100000_full.json')
    initEcharts(chinaGeoJson, '唐朝历史人物分布', chart, alladcode)
}
initChart();

// 每个地区的数据
let mapData = [
    {
        name: "河南省",
        value: 14827
    },
    {
        name: "陕西省",
        value: 10333
    },
    {
        name: "河北省",
        value: 4490
    },
    {
        name: "山西省",
        value: 4165
    },
    {
        name: "甘肃省",
        value: 2147
    },
    {
        name: "江苏省",
        value: 2102
    },
    {
        name: "山东省",
        value: 1774
    },
    {
        name: "浙江省",
        value: 1266
    },
    {
        name: "湖北省",
        value: 615
    },
    {
        name: "四川省",
        value: 579
    },
    {
        name: "安徽省",
        value: 558
    },
    {
        name: "广东省",
        value: 540
    },
    {
        name: "江西省",
        value: 372
    },
    {
        name: "湖南省",
        value: 345
    },
    {
        name: "北京市",
        value: 315
    },
    {
        name: "广西壮族自治区",
        value: 258
    },
    {
        name: "福建省",
        value: 188
    },
    {
        name: "内蒙古自治区",
        value: 97
    },
    {
        name: "天津市",
        value: 75
    },
    {
        name: "新疆维吾尔自治区",
        value: 67
    },
    {
        name: "上海市",
        value: 45
    },
    {
        name: "重庆市",
        value: 42
    },
    {
        name: "宁夏回族自治区",
        value: 26
    },
    {
        name: "海南省",
        value: 10
    },
    {
        name: "辽宁省",
        value: 8
    },
    {
        name: "云南省",
        value: 6
    },
    {
        name: "贵州省",
        value: 2
    },
    {
        name: "台湾省",
        value: 0
    },
    {
        name: "西藏自治区",
        value: 0
    },
    {
        name: "青海省",
        value: 0
    },
    {
        name: "吉林省",
        value: 0
    },
    {
        name: "黑龙江省",
        value: 0
    },
    {
        name: "香港特别行政区",
        value: 0
    },
    {
        name: "澳门特别行政区",
        value: 0
    },
]

//echarts绘图
function initEcharts(geoJson, name, chart, alladcode) {
    //获取当前显示地图下方地市的坐标点数据； 用于气泡显示
    let geoCoordMap = {};
    // 获取地区详细信息
    let mapFeatures = geoJson.features;
    // 遍历获取每个地区的经纬度
    mapFeatures.forEach(function (v, i) {
        // 获取当前地区名
        let name = v.properties.name;
        if (name) {
            // 获取当前地区的经纬度
            geoCoordMap[name] = v.properties.center;
        }
    });
    //将data数据进入方法，取需要的参数； 用于气泡显示
    let convertData = function (data) {
        var res = [];
        data.forEach(item => {
            // 获取当前省份的经纬度坐标
            let geoCoord = geoCoordMap[item.name];
            if (geoCoord) {
                res.push({
                    name: item.name,
                    value: geoCoord.concat(item.value)
                });
            }
        })
        return res;
    };
    echarts.registerMap(name, geoJson);
    var option = {
        title: {
            text: name,
            left: 'center',
            top: '6%',
        },
        //鼠标经过展示数据方法
        tooltip: {
            triggerOn: "mousemove",
            formatter: function (params) {
                if (isNaN(params.value)) {
                    params.value = 0
                }
                var html = '<span>' + params.name + '：</span><br/>'
                html += '<span>值：' + params.value + '</span><br/>'
                return html
            },
            backgroundColor: 'rgba(29, 38, 71)',
            // 额外附加的阴影
            extraCssText: 'box-shadow:0 0 4px rgba(11, 19, 43,0.8)',
        },
        geo: {
            show: true,
            top: '10%',
            map: name,
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true,
                    color: "#31322c",
                }
            },
            roam: false,
            itemStyle: {
                normal: {
                    areaColor: '#fff',
                    borderColor: '#686a67',
                },
                emphasis: {
                    areaColor: '#00828B',
                }
            },
        },
        //进行气泡标点
        series: [
            {
                type: 'map',
                map: mapData,
                geoIndex: 0,
                aspectScale: 0.75, //长宽比
                animation: true,
                data: mapData
            },
        ],
        // 添加色块指示
        visualMap: {
            min: 0,
            max: 15000,
            right: '65%',
            bottom: '1%',
            showLabel: true,
            text: ['High', 'Low'],
            seriesIndex: [0],
            itemHeight: 10,
            itemWidth: 10,
            orient: 'vertical',
            align: 'auto',
            show: true,
            borderWidth: 1,
            borderColor: '#ccc',
            textStyle: {
                color: '#333'
            },
            // 设置颜色标注
            pieces: [
                {gt: 12000, color: '#b0112f'}, 
                {gt: 10000, lte: 12000, color: '#c34654'}, 
                {gt: 4000, lte: 10000, color: '#ca5860'}, 
                {gt: 2000, lte: 4000, color: '#df928a'}, 
                {gt: 1000, lte: 2000, color: '#e3a89a'}, 
                {gt: 600, lte: 1000, color: '#eabdaa'}, 
                {gt: 300, lte: 600, color: '#f3dabc'},
                {gt: 50, lte: 300, color: '#f8ecd1'},
                {gt: 1, lte: 50, color: '#fcf9e5'}
            ],
            
        }
    };
    if (option && typeof option === 'object') {
        chart.setOption(option);
    }
    window.addEventListener('resize', chart.resize);
    // chart.setOption(option);
}
//获取地图json数据
async function getGeoJson(jsonName) {
    return await $.get(publicUrl + jsonName)
}