// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('china-map-left_up'));
 
// 指定图表的配置项和数据
var option = {
    title: {
        text: '唐朝历年人数统计', 
        left: 'center',
        top: '6%',
        textStyle: {
            color: '#333', 
            fontSize: 16, 
            fontWeight: 'bold', 

        }
    },
    tooltip: {
        trigger:'axis',
        formatter: function (params) {
            if (params[0].dataIndex === 2) { // Check for the year 650
                return params[0].name + '年: ' + params[0].value + '（人）<br>公元649年，李治继位';
            }else if (params[0].dataIndex === 6) { // Check for the year 690
                return params[0].name + '年: ' + params[0].value + '（人）<br>公元690年，武则天继位';
            }else if (params[0].dataIndex === 8) { 
                return params[0].name + '年: ' + params[0].value + '（人）<br>公元712年，李隆基继位';
            }else if (params[0].dataIndex === 12) { 
                return params[0].name + '年: ' + params[0].value + '（人）<br>公元755年，安史之乱开始';
            }else if (params[0].dataIndex === 13) { 
                return params[0].name + '年: ' + params[0].value + '（人）<br>公元763年，安史之乱结束';
            }else if (params[0].dataIndex === 20) { 
                return params[0].name + '年: ' + params[0].value + '（人）<br>公元835年，甘露之变';
            }else {
                return params[0].name + '年: ' + params[0].value + '（人）';
            }
        }
    },
    xAxis: {
        name:'年份',
        data: ["630","640","650","660","670","680","690","700","710","720","730","740","750","760","770","780","790","800","810","820","830","840","850","860","870","880","890","900"],
        axisLine: {
            lineStyle: {
                color: '#151d29',
                width: 2
            }
        }
    },
    yAxis: [ {
        type: 'value',
        max: 2000,
        name: '数量统计',
        show:true,
        interval: 400,
        axisLine: {
            lineStyle: {
                color: '#151d29',
                width: 2
            }
        }
    }
],
    series: [{
        name: '数量统计',
        type: 'bar',
        barWidth : '70%',
        showBackground: true,
        itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#d2a36c' },
            { offset: 0.5, color: '#d5c8a0' },
            { offset: 1, color: '#dfd6b8' }
            ])
        },
        emphasis: {
            itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#ba5b49' },
                { offset: 0.7, color: '#d2a36c' },
                { offset: 1, color: '#dfd6b8' }
            ])
            }
        },
        data: [1357, 969, 1063, 1355, 1444, 1350, 1438, 1412, 1760, 1508, 1451, 1817, 1532, 1431, 1811, 1780, 1830, 1530, 1509, 1401, 1204, 1053, 380, 76, 36, 19, 12, 6],
        yAxisIndex: 0
    },{
        type: 'line',
        smooth:true,
        data: [1357, 969, 1063, 1355, 1444, 1350, 1438, 1412, 1760, 1508, 1451, 1817, 1532, 1431, 1811, 1780, 1830, 1530, 1509, 1401, 1204, 1053, 380, 76, 36, 19, 12, 6],
        yAxisIndex: 0
    }],
    dataZoom: [
        {
            show: true,
            start: 0,
            end: 100
        },
        {
            type: 'inside',
            start: 0,
            end: 100
        }
    ]
};

// 使用刚指定的配置项和数据显示图表。
if (option && typeof option === 'object') {
    myChart.setOption(option);
}
window.addEventListener('resize', myChart.resize);