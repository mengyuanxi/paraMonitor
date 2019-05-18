var errorItem = []; // 引发报警的数据项

/**
 * 查看该设备的报警情况
 */
function getOneDeviceAlarm(tokenValue, deviceid) {
    $.ajax({
        type: "get",
        url: basePath + "/alarm",
        contentType: "application/json",
        dataType: "json",
        async: false,
        data: {
            "token": tokenValue,
            "hash": "test",
            "devid": deviceid,
        },
        success: function(response) {
            if (response.status != 100) {
                alert(response.msg);
                return;
            }
            /**
             * 生成测试样例
             * 测试有报警的情况（生成某设备的报警列表json对象数组）
             */
            response.data.list = [];
            for (let index = 0; index < 2; index++) {
                var testJsonStr = `{"active": true, "alarmdesc" : "冷却水温度过高"
                        ,"alarmid":209, "alarmname" :"alarm", "deviceid" :1435066367, "happentime"
                        :1532658207189, "htime" :1532657631003, "ruleid" :6, "severity" :12, "thisDataItemName"
                        :"COOLING WATER TEM${index}.","thisDataItemValue":"7229.30781${index}${index}${index}"}`;
                var
                    testJson = JSON.parse(testJsonStr);
                response.data.list.push(testJson);
            }

            // - 如果查找到的报警信息数组不为空且未恢复，则将相应的引发报警的信息存入errorItem数组
            for (let j = 0; j < response.data.list.length; j++) {
                const oneAlarm = response.data.list[j];
                //显示报警状态的告警信息 
                if (oneAlarm.active == true) {
                    $('#alarmInfo').append(oneAlarm.deviceid + "号设备：" +
                        oneAlarm.alarmdesc + "。错误数据项为：" + oneAlarm.thisDataItemName + "，对应值为：" +
                        oneAlarm.thisDataItemValue + "\n");
                    errorItem.push(oneAlarm.thisDataItemName);
                }
            }
            console.log(errorItem)
        }
    })
}

/*
 * 动态渲染表格 - 显示设备所有参数列表（ 所有数据项）
 */
function showAllDevItems(tokenValue, deviceid) {
    $.ajax({
        type: "get",
        url: basePath + "/dataitemlist/getDataItemList",
        contentType: "application/json",
        dataType: "json",
        data: {
            "token": tokenValue,
            "hash": "test",
            "deviceid": deviceid,
        },
        success: function(response) {
            console.log(response)
            if (response.status != '100') {
                alert(response.msg);
                return;
            }

            /**
             * 生成测试样例（重构参数列表数组）
             */
            response.data = [];
            // 测试数值类型
            for (let index = 0; index < 3; index++) {
                var jsonString = `{"devid":1435066367,"deviceName":"ra-device","itemid":${index+1},"config":"","datatype":"a","datatypeName":"数值","driverid":29,"driverName":"libtremoteplc","did":0,"itemname":"COOLING WATER TEM${index}.","itemalias":null,"readonly":0,"frequency":120000,"dataAddress":null,"hex":null,"precision":null}`;
                var obj = JSON.parse(jsonString); // 将上述字符串转成json
                response.data.push(obj); // 添加到数组中
            }
            // 测试开关类型
            for (let index = 0; index < 2; index++) {
                var jsonString = `{"devid":1435066367,"deviceName":"ra-device","itemid":${index+4},"config":"","datatype":"b","datatypeName":"开关量","driverid":29,"driverName":"libtremoteplc","did":0,"itemname":"开关量${index}.","itemalias":"测试开关量${index}","readonly":0,"frequency":120000,"dataAddress":null,"hex":null,"precision":null}`;
                var obj = JSON.parse(jsonString); // 将上述字符串转成json
                response.data.push(obj); // 添加到数组中
            }



            // 动态渲染参数列表，并且判断是否报警而显示不同颜色
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i];
                var $tr = $('<tr> </tr>');

                var $td2 = `<td data-label="数据项id" class="layui-badge layui-bg-green">${element.itemid}</td>`;
                var $td3 = `<td data-label="数据项名称" class="layui-badge  layui-bg-green">${element.itemname}</td>`;
                // 如果该数据项属于出错数据项数组，则显示为红色,并设该项的errorFlag为1
                if (errorItemContains(element.itemname, errorItem)) {
                    $td2 = `<td data-label="数据项id" class="layui-badge">${element.itemid}</td>`;
                    $td3 = `<td data-label="数据项名称" class="layui-badge">${element.itemname}</td>`;
                }
                var $td4 = `<td data-label="数据项别名">${element.itemalias}</td>`;
                if (element.itemalias == null) {
                    $td4 = `<td data-label="数据项别名">暂无记录</td>`;
                }
                var $td5 = `<td data-label="数据类型名称">${element.datatypeName}</td>`;
                var $td6 = `<td data-label="驱动名称">${element.driverName}</td>`;
                var $td7 =
                    `<td data-label="数据采集频率(ms)">${element.frequency}</td>`;
                var $td8 = `<td><button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-primary
                                        textACenter">可写</button> </td>`;
                if (element.readonly == 0) {
                    $td8 = `<td><button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-normal
                                        textACenter">只读</button> </td>`;
                }
                // 绑定点击查看具体信息事件
                $tr.bind('click', function() {
                    // 如果是数值这一类数据项 - a，则跳转到deviceItemDetail.html页面
                    // 如果是开关量这一类数据项 - b，则跳转到deviceItemDetail2.html页面
                    if (element.datatype == 'a') {
                        window.location.href = "deviceItemDetailVal.html?deviceid=" + deviceid + "&itemid=" +
                            element.itemid + "&itemname=" + element.itemname;
                    } else if (element.datatype == 'b') {
                        window.location.href = "deviceItemDetailOnOff.html?deviceid=" + deviceid + "&itemid=" +
                            element.itemid + "&itemname=" + element.itemname;
                    }


                })
                $tr.append($td2 + $td3 + $td4 + $td5 + $td6 + $td7 + $td8);
                $('#tbody').append($tr);
            }
        }
    });
}

/**
 * 判断errorItem数组是否包含该数据项名称（通过名称而不是id）
 */
function errorItemContains(itemname, list) {
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        if (element == itemname) {
            return true;
        }
    }
    return false;
}