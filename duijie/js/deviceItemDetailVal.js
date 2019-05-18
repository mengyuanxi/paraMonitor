/**
 * 获取该设备此参数的实时数据(渲染在表格中)
 * - 测试时出错- 后台返回格式不佳，解析错误
 */
function getCurDataOtem(tokenValue, deviceid, itemid) {
    $.ajax({
        type: "get",
        url: basePath + "/currentdata",
        contentType: "application/json",
        dataType: "json",
        data: {
            "token": tokenValue,
            "hash": "test",
            "deviceid": deviceid,
            "itemids": itemid,
        },
        success: function(response) {
            console.log(response);
            if (response.status != 100) {
                alert(response.msg);
                return;
            }
            if (response.data.length == 0) {
                $('#alarmInfo').val("暂无实时数据");
                // return;  // 测试时隐藏
            }
            // --- 测试样例，生成实时数据对象 ---
            var testArray = [];
            for (let index = 0; index < 1; index++) {
                var jsonString =
                    `{"datatype":"a","datatypeName":"数值","devName":"ra-device","devid":"1435066367","htime":"2019-04-12 14:09:06.838","itemid":"1","itemname":"COOLING WATER TEM0.","quality":"b","readOnly":true,"timestamp":1555049346838,"val":"24"}`;
                var test = JSON.parse(jsonString);
                testArray.push(test);
            }

            response.data = testArray;

            // 展示不同情况下的参数情况
            const element = response.data[0];
            var $tr = $('<tr> </tr>');
            var $td1 = `<td data-label="数据项id" class=" layui-badge">${element.itemid}</td>`;
            if (element.quality == "g") {
                $td1 = `<td data-label="数据项id" class=" layui-badge layui-bg-green">${element.itemid}</td>`;
            }

            var $td2 = `<td data-label="数据项名称">${element.itemname}</td>`;
            var $td3 = `<td data-label="数据类型">${element.datatypeName}</td>`;
            var $td4 = `<td data-label="数值">${element.val}</td>`;
            var $td5 = `<td data-label="采集时间">${element.htime}</td>`;
            var $td6 = `<td><button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-primary
                                        textACenter">可写</button> </td>`;
            if (element.readOnly == true) {
                $td6 = `<td><button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-normal
                                        textACenter">只读</button> </td>`;
            }
            $tr.append($td1 + $td2 + $td3 + $td4 + $td5 + $td6);
            $('#tbody').append($tr);
            $('#titleBtn').text("参数查看详情：" + element.itemname);
        }
    });
}

/**
 * （运用于首次） 获取单个数据项的历史数据（ 测试样例未配置历史信息）
 */
function getOldDataOneItem(tokenValue, deviceid, itemid) {
    $.ajax({
        type: "get",
        url: basePath + "/historydata",
        contentType: "application/json",
        dataType: "json",
        data: {
            "token": tokenValue,
            "hash": "test",
            "deviceid": deviceid,
            "dataitemid": itemid,
        },
        success: function(response) {
            if (response.status != 100) {
                alert(response.msg);
                return;
            }

            // --- 测试样例，生成历史数据数组 ---
            var testArray = [];
            for (let index = 0; index < 5; index++) {
                var jsonString = `{"alias":"COOLING WATER TEM0.",
                        "datatype":"a",
                        "datatypeName":"数值",
                        "devid":"1536008193",
                        "htime":"2019-04-12 1${index}:09:06.838", "itemid":"1",
                        "itemname":"COOLING WATER TEM0.",
                        "readOnly":true,
                        "val":"2${index}" }`;
                var test = JSON.parse(jsonString);
                testArray.push(test);
            }
            response.data = testArray;

            // 获取历史数据的有用信息，放入oldData数组
            var oldData = [];
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i];
                var oneData = [element.htime, element.val];
                oldData.push(oneData);
            }
            drawOldNode(oldData);
        }
    })
}

/**
 * （运用于动态） 每隔一段时间获取一次实时数据， 并且渲染在页面上
 */
function getCurDuringTime(tokenValue, deviceid, itemid) {
    $(document).ready(function() {
        var currentData = [];
        var testFlag = 0;
        setInterval(function() {
            $.ajax({
                type: "get",
                url: basePath + "/currentdata",
                contentType: "application/json",
                dataType: "json",
                data: {
                    "token": tokenValue,
                    "hash": "test",
                    "deviceid": deviceid,
                    "itemids": itemid,
                },
                success: function(response) {
                    if (response.status != 100) {
                        alert(response.msg);
                        return;
                    }
                    if (response.data.length == 0) {
                        $('#alarmInfo').val("暂无实时数据");
                        return;
                    }
                    // --- 测试样例，生成实时数据对象 ---
                    var testArray = [];
                    for (let index = 0; index < 1; index++) {
                        var date = new Date();
                        var timeStr = date.getHours + date.getMinutes + date.getSeconds;
                        var jsonString = `{"datatype":"a","datatypeName":"数值","devName":"ra-device","devid":"1435066367","htime":"1","itemid":"1","itemname":"COOLING WATER TEM0.","quality":"b","readOnly":true,"timestamp":1555049346838,"val":"${testFlag}"}`;
                        var test = JSON.parse(jsonString);
                        testArray.push(test);
                    }
                    response.data = testArray; // 展示不同情况下的参数情况
                    const element = response.data[0];
                    // 获取实时数据的有用信息，放入currentData数组

                    for (let i = 0; i < response.data.length; i++) {
                        const element = response.data[i];
                        var oneData = [element.htime, element.val];
                        currentData.push(oneData);
                    }
                }
            });
            var chooseData = getTopSixData(currentData);
            // console.log(chooseData)
            drawCurrentNode(chooseData);
            testFlag = testFlag + 0.01;
            // check(obj);
        }, 1000);
    });
}


// --- 以下与数据的图表显示有关 ---

// 历史数据的图表显示
function drawOldNode(data) {
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

/**
 * 显示实时数据
 * @param {*} data 
 */
function drawCurrentNode(data) {
    var myChart = echarts.init(document.getElementById('node2'));
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
            text: '实时数据动态获取'
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

/**
 * 获取当前数据数组的前6个
 * @param {} currentData 
 */
function getTopSixData(currentData) {
    // 如果当前数组的个数小于6个，直接返回该数组
    var length = currentData.length;
    if (length <= 6) {
        return currentData;
    }
    // 如果大于6个，选择最新6个组成一个新数组返回
    var newArray = [];
    for (let index = 6; index > 0; index--) {
        const element = currentData[length - index];
        newArray.push(element);
    }
    return newArray;
}