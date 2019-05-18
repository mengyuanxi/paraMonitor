$(document).ready(function() {
    //    setInterval(function () {
    //     htmlobj = $.ajax({url:"../Data/getdata",async:false});
    //     dataobj = htmlobj.responseText; 
    //     var obj = eval('('+dataobj+')');
    //     console.log(dataobj);
    //     console.log(obj);
    //     var data1 = obj['data'][0];
    //     var data2 = obj['data'][1];
    //     var data3 = obj['data'][2];
    //     console.log(data1);
    data1 = [];
    data2 = [];
    data3 = [];
    drawNodeOne(data1);
    drawNodeTwo(data2);
    drawNodeThree(data3);
    //      // check(obj);
    //    },500);
});

function check(obj) {
    alert("14312s");
    var num = obj['data'][0].length;
    for (var j = 0; j < 3; j++) {
        for (var i = 0; i < num; i++) {
            if (obj['data'][j][i] >= 20) {
                alert("节点" + j + "温度过高，请注意！")
            }
        }
    }
}

function drawNodeOne(data) {
    var myChart = echarts.init(document.getElementById('node1'));
    data = [
        ["18:20:11", 21],
        ["18:20:41", 21],
        ["18:20:41", 21],
        ["18:21:11", 21],
        ["18:21:41", 21],
        ["18:22:11", 26],
        ["18:22:41", 26],
        ["18:23:11", 23],

    ];

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
            text: '1号节点温度变化曲线'
        }],
        tooltip: {
            trigger: 'axis'
        },
        xAxis: [{
            data: dateList,
            splitLine: { show: true }
        }],
        yAxis: {
            splitLine: { show: true }
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

function drawNodeTwo(data) {
    var myChart = echarts.init(document.getElementById('node2'));
    data = [
        ["18:19:43", 20.5],
        ["18:20:13", 20.5],
        ["18:20:43", 20.5],
        ["18:21:13", 20.5],
        ["18:21:43", 20.5],
        ["18:22:13", 26],
        ["18:22:43", 26],
        ["18:23:13", 24.5],

    ];

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
            text: '2号节点温度变化曲线'
        }],
        tooltip: {
            trigger: 'axis'
        },
        xAxis: [{
            data: dateList,
            splitLine: { show: true }
        }],
        yAxis: {
            splitLine: { show: true }
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

function drawNodeThree(data) {
    var myChart = echarts.init(document.getElementById('node3'));
    // data = [["2000-06-05",116],["2000-06-06",129],["2000-06-07",135],["2000-06-08",86],["2000-06-09",73],["2000-06-10",85],["2000-06-11",73],["2000-06-12",68],["2000-06-13",92],["2000-06-14",130],["2000-06-15",245],["2000-06-16",139],["2000-06-17",115],["2000-06-18",111],["2000-06-19",309],["2000-06-20",206],["2000-06-21",137],["2000-06-22",128],["2000-06-23",85],["2000-06-24",94],["2000-06-25",71],["2000-06-26",106],["2000-06-27",84],["2000-06-28",93],["2000-06-29",85],["2000-06-30",73],["2000-07-01",83],["2000-07-02",125],["2000-07-03",107],["2000-07-04",82],["2000-07-05",44],["2000-07-06",72],["2000-07-07",106],["2000-07-08",107],["2000-07-09",66],["2000-07-10",91],["2000-07-11",92],["2000-07-12",113],["2000-07-13",107],["2000-07-14",131],["2000-07-15",111],["2000-07-16",64],["2000-07-17",69],["2000-07-18",88],["2000-07-19",77],["2000-07-20",83],["2000-07-21",111],["2000-07-22",57],["2000-07-23",55],["2000-07-24",60]];
    data = [
        ["18:19:23", 21],
        ["18:19:53", 21],
        ["18:20:23", 21],
        ["18:20:53", 21],
        ["18:21:23", 21],
        ["18:21:53", 21],
        ["18:22:23", 24.5],
        ["18:22:53", 24.5],

    ];
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
            text: '3号节点温度变化曲线'
        }],
        tooltip: {
            trigger: 'axis'
        },
        xAxis: [{
            data: dateList,
            splitLine: { show: true }
        }],
        yAxis: {
            splitLine: { show: true }
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