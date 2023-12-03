var dom = document.getElementById('china-map-right_up');
var myChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
});
var app = {};
var option;
const data = [
[
    [2, 1],
    [3, 1],
    [4, 2],
    [5, 4],
    [6, 2],
    [7, 1],
    [8, 2],
    [9, 5],
    [10, 3],
    [11, 4],
    [12, 6],
    [13, 9],
    [14, 5],
    [15, 9],
    [16, 25],
    [17, 26],
    [18, 18],
    [19, 31],
    [20, 33],
    [21, 31],
    [22, 29],
    [23, 39],
    [24, 31],
    [25, 33],
    [26, 31],
    [27, 39],
    [28, 33],
    [29, 28],
    [30, 40],
    [31, 37],
    [32, 47],
    [33, 36],
    [34, 54],
    [35, 46],
    [36, 42],
    [37, 48],
    [38, 47],
    [39, 50],
    [40, 50],
    [41, 45],
    [42, 60],
    [43, 56],
    [44, 71],
    [45, 57],
    [46, 64],
    [47, 79],
    [48, 72],
    [49, 99],
    [50, 102],
    [51, 89],
    [52, 120],
    [53, 117],
    [54, 103],
    [55, 164],
    [56, 115],
    [57, 152],
    [58, 137],
    [59, 137],
    [60, 160],
    [61, 158],
    [62, 157],
    [63, 144],
    [64, 139],
    [65, 162],
    [66, 147],
    [67, 149],
    [68, 128],
    [69, 139],
    [70, 129],
    [71, 119],
    [72, 141],
    [73, 118],
    [74, 125],
    [75, 120],
    [76, 92],
    [77, 88],
    [78, 70],
    [79, 80],
    [80, 62],
    [81, 76],
    [82, 46],
    [83, 51],
    [84, 40],
    [85, 34],
    [86, 21],
    [87, 22],
    [88, 21],
    [89, 16],
    [90, 13],
    [91, 4],
    [92, 7],
    [93, 12],
    [94, 4],
    [95, 4],
    [96, 4],
    [97, 3],
    [99, 4],
    [101, 2],
    [103, 1],
    [107, 1],
    [108, 1],
    [112, 1],
    [120, 1]
]
];
option = {
    title: {
        text: '唐代人物享年数据分布',
        left: 'center',
        top: '1%',
        textStyle: {
            color: '#333', 
            fontSize: 16, 
            fontWeight: 'bold', 
        }
    },
    tooltip: {
        trigger:'axis',
        formatter: function (params) {
            return params[0].value[0] + '岁:' + params[0].value[1] + '（人）';
        }
    },
    grid: {
        left: '8%',
        top: '10%'
    },
    xAxis: {
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    yAxis: {
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        },
        scale: true
    },
    series: [
        {
            name: '人数',
            data: data[0],
            type: 'scatter',
            symbolSize: function (data) {
                return Math.sqrt(data[1]) * 1.6;
            },
            itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(190, 210, 187, 0.6)',
                shadowOffsetY: 5,
                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
                    {
                        offset: 0,
                        color: '#3d8e86' 
                    },
                    {
                        offset: 1,
                        color: '#88bfb8'
                    }
                ]),
                emphasis: {
                    color: 'rgba(200, 107, 55, 0.6)' 
                }
            },
            markLine: {
                data: [
                    {type: 'average', name: '平均值'}
                ],
                lineStyle: {
                    color: '#a04c3b' // 指定平均线的颜色
                }
            }
        }
    ]
};

if (option && typeof option === 'object') {
    myChart.setOption(option);
}
window.addEventListener('resize', myChart.resize);