function drawNodeOne(data) {
    var myChart = echarts.init(document.getElementById('node1'));
    // data = [
    //     ["18:20:11", 21],
    //     ["18:20:41", 21],
    //     ["18:20:41", 21],
    //     ["18:21:11", 21],
    //     ["18:21:41", 21],
    //     ["18:22:11", 26],
    //     ["18:22:41", 26],
    //     ["18:23:11", 23],

    // ];


    var dateList = data.map(function(item) {
        return item[0];
    });
    var valueList = data.map(function(item) {
        return item[1];
    });

    option = {
        // Make gradient line here
        visualMap: [{
            show: false,
            type: 'continuous',
            seriesIndex: 0,
            min: 0,
            max: 400
        }],
        title: [{
            left: 'center',
            text: '近12小时历史数据'
        }],
        tooltip: {
            trigger: 'axis'
        },
        xAxis: [{
            data: dateList,
            splitLine: {
                show: true
            }
        }],
        yAxis: {
            splitLine: {
                show: true
            }
        },
        grid: [{
            bottom: '15%'
        }, {
            top: '15%'
        }],
        series: [{
            type: 'line',
            showSymbol: false,
            data: valueList,
            areaStyle: {}
        }]
    };
    myChart.setOption(option);
}

function check(data, upLimit) {
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < num; j++) {
            if (data[i][1] >= upLimit) {
                alert("温度过高，请注意！")
            }
        }
    }
}