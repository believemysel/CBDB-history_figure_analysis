var dom = document.getElementById('china-map-left_down');
var myChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
});

var categories = [
    '0-4', '5-9', '10-14', '15-19',
    '20-24', '25-29', '30-34', '35-39', '40-44',
    '45-49', '50-54', '55-59', '60-64', '65-69',
    '70-74', '75-79', '80-84', '85-89', '90-94',
    '95-99', '100 + '
];

var maleData = [
    14, 4, 10, 66,
    54, 98, 116, 144,
    210, 358, 484, 562,
    706, 671, 566, 345,
    200, 92, 24, 12,
    0.0
];

var femaleData = [
    0, 0, 0, 15, 19,
    29, 30, 25, 27, 34,
    36, 48, 36, 56, 60,
    48, 36, 12, 8, 0,
    0.0
];

var maleTotal = maleData.map(function(x) {
    return Math.abs(x);
}).reduce(function(a, b) {
    return a + b;
});

var femaleTotal = femaleData.map(function(x) {
    return Math.abs(x);
}).reduce(function(a, b) {
    return a + b;
});

var malePercentage = maleData.map(function(x){
    return -(x / maleTotal * 100); 
});

var femalePercentage = femaleData.map(function(x){
    return x / femaleTotal * 100;
});

var option = {
    title: {
        text: '唐朝人口金字塔',
        left: 'center',
        top: '6%',
        textStyle: {
            color: '#333', 
            fontSize: 16, 
            fontWeight: 'bold', 
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        formatter: function (params) {
            return params[0].name + '<br/>' +
                params[0].seriesName + ': ' + Math.abs(maleData[params[0].dataIndex]) + ' (' + Math.abs(params[0].data).toFixed(2) + '%)' + '<br/>' +
                params[1].seriesName + ': ' + Math.abs(femaleData[params[0].dataIndex]) + ' (' + Math.abs(params[1].data).toFixed(2) + '%)';
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    legend: {
        data: ['男性', '女性'],
        align: 'left',
        top: '15%',
        right: -5
    },
    xAxis: {
        type: 'value',
        axisLabel: {
            formatter: function (value) {
                return Math.abs(value)+'%';
            }
        }
    },
    yAxis: {
        type: 'category',
        data: categories
    },
    series: [
        {
            name: '男性',
            type: 'bar',
            stack: 'total',
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#3d8e86' },
                    { offset: 0.5, color: '#5da39d' },
                    { offset: 1, color: '#88bfb8' }
                ])
            },
            emphasis: {
                focus: 'series'
            },
            data: malePercentage
        },
        {
            name: '女性',
            type: 'bar',
            stack: 'total',
            emphasis: {
                focus: 'series'
            },
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#d2a36c' },
                    { offset: 0.5, color: '#d5c8a0' },
                    { offset: 1, color: '#dfd6b8' }
                ])
            },
            data: femalePercentage
        }
    ]
};

if (option && typeof option === 'object') {
    myChart.setOption(option);
}
window.addEventListener('resize', myChart.resize);
