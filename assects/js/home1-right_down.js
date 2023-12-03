var dom = document.getElementById('china-map-right_down');
var myChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
});
var app = {};
var option;
let xAxisData = ['618年-668年','668年至718年', '718年至768年', '768年至818年', '818年至868年', '868年至907年'];
let data1 = [1693, 1813, 2568, 2739, 908, 26];
let data2 = [6258, 9623, 15296, 16672, 17191, 7581];
var emphasisStyle = {
    itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.3)'
    }
};
option = {
    title: {
        text: '唐朝历年出生死亡人数统计', 
        left: '15%',
        top: '0.5%',
        textStyle: {
            color: '#333', 
            fontSize: 16, 
            fontWeight: 'bold', 
        }
    },
    legend: {
        data: ['出生', '死亡'],
        left: 'center',
        top: '12%'
    },
    brush: {
        toolbox: ['rect', 'clear'],
        xAxisIndex: 0
    },
    toolbox: {
        feature: {
            magicType: {
                type: ['stack', 'tiled'] 
            }
        }
    },
    tooltip: {},
    xAxis: {
        data: xAxisData,
        name: '年份',
        axisLine: { 
            lineStyle: {
                color: '#151d29',
                width: 2
            },
        },
        axisLabel: {
            textStyle: {
                color: '#333', 
                fontSize: 8
            },
            rotate: 15,  
        }
    },
    yAxis: {
        name: '人数',
        axisLine: {
            lineStyle: {
                color: '#151d29',
                width: 2
            }
        },
        axisLabel: {
            textStyle: {
                color: '#333', 
                fontSize: 10
            }
        }
    },
    grid: {
        bottom: 50
    },
    series: [
        {
            name: '出生',
            type: 'bar',
            barWidth : '35%',
            barCategoryGap: '0', // 设置柱体无间隔
            stack: 'one',
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#3d8e86' },
                    { offset: 0.5, color: '#5da39d' },
                    { offset: 1, color: '#88bfb8' }
                ])
            },
            emphasis: emphasisStyle,
            data: data1
        },
        {
            name: '死亡',
            type: 'bar',
            barWidth : '35%',
            barCategoryGap: '0', // 设置柱体无间隔
            stack: 'one',
            showBackground: true,
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#d2a36c' },
                    { offset: 0.5, color: '#d5c8a0' },
                    { offset: 1, color: '#dfd6b8' }
                ])
            },
            emphasis: emphasisStyle,
            emphasis: emphasisStyle,
            data: data2 
        }
    ]
};
if (option && typeof option === 'object') {
    myChart.setOption(option);
}
window.addEventListener('resize', myChart.resize);