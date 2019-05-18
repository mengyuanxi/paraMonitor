// 用户权限设备数组，按照设备类型分类，为对象数组
var authorDevices = new Array();
var devModelArray = new Array();

/**
 * 获取用户权限下的所有deviceid
 */

function getAuthDeviceList(tokenValue) {
    $.ajax({
        type: "get",
        url: basePath + "/devicelist/getDeviceID",
        contentType: "application/json",
        dataType: "json",
        data: {
            "token": tokenValue,
            "hash": "test",
        },
        success: function(response) {
            // 是否响应成功
            if (response.status != '100') {
                alert(response.msg);
                return;
            }

            /**
             *--- 这一块和文档里面有冲突！！ 文档是数组，这里是字符串 ---
             *-- 生成测试数据 使数据格式统一 -- 
             */
            var test = new Array();
            test.push(response.data);
            response.data = test;


            // 数据长度
            var dataLength = response.data.length;

            if (dataLength == undefined) {
                // -- 此处应该改为直接显示“用户没有权限设备”才是
                // 但是为了能够测试该用户，在没有数组长度（返回不是数组）时直接将内容放入权限设备中
                authorDevices.push(response.data);
            } else {
                for (let index = 0; index < response.data.length; index++) {
                    // 循环得到每个权限设备,使用小写统一和接口的风格
                    const deviceid = response.data[index];
                    // 查找该设备的基本信息，并且按照设备类型进行分类
                    $.ajax({
                        type: "get",
                        url: basePath + "/device/" + deviceid,
                        contentType: "application/json",
                        dataType: "json",
                        async: false,
                        data: {
                            "token": tokenValue,
                            "hash": "test",
                        },
                        success: function(response) {
                            console.log(response.data)
                            if (response.status != 100) {
                                alert(response.msg);
                                return;
                            }
                            // 检测对应的设备模型是否在设备模型数组中
                            // 如果不在则创建新的设备模型并把该设备信息（id和name）对象填充到对应的data中
                            // 否则找到下标直接在data中push进去设备信息
                            var xiabiao = modelInArray(response.data.deviceModel.id);
                            if (xiabiao == -1) {
                                // 生成新的设备模型
                                var jsonString = `{"id":${response.data.deviceModel.id},"name":"${response.data.deviceModel.name}","data": null}`;
                                var jsonOne = JSON.parse(jsonString);
                                // 将设备号填充到这个模型中
                                jsonOne.data = new Array();
                                var deviceStr = `{"id":${response.data.id},"name":"${response.data.name}"}`;
                                var deviceJson = JSON.parse(deviceStr);

                                jsonOne.data.push(deviceJson);
                                devModelArray.push(jsonOne);
                            } else {
                                devModelArray[xiabiao].data.push(deviceid);
                            }
                        }
                    });
                    console.log(devModelArray);
                }
            }
        },
        // 完成后执行该函数，进行渲染
        complete: function() {
            showDevModelAndDevices(tokenValue)
        }
    });
}


/**
 * 分设备类型渲染显示对应设备
 */
function showDevModelAndDevices(tokenValue) {
    for (let i = 0; i < devModelArray.length; i++) {
        const deviceModel = devModelArray[i];
        const chooseStation = $('#chooseStation');

        // 生成设备类型框架与对应的名称
        var $fieldset = $('<fieldset></fieldset>');
        $fieldset.addClass("layui-elem-field layui-field-title");
        var $legend = ` <legend>"${deviceModel.id}号：${deviceModel.name}类型"</legend>`;
        $fieldset.append($legend);

        // 循环显示其对应的设备，查看其状态与报警情况。同时在列表渲染该设备按钮、以及按需显示报警信息
        for (let j = 0; j < deviceModel.data.length; j++) {
            const singleDevice = deviceModel.data[j];
            $.ajax({
                type: "get",
                url: basePath + "/alarm",
                contentType: "application/json",
                dataType: "json",
                data: {
                    "token": tokenValue,
                    "hash": "test",
                    "devid": singleDevice.id,
                },
                success: function(response) {
                    if (response.status != 100) {
                        alert(response.msg);
                        return;
                    }
                    /** 
                     *生成测试样例，测试有报警的情况（生成某设备的报警列表json对象数组） 
                     */
                    response.data.list = [];
                    for (let index = 0; index < 3; index++) {
                        var testJsonStr = `{"active": true, "alarmdesc" : "冷却水温度过高" ,"alarmid":209, "alarmname" :"alarm", "deviceid"
    :1435066367, "happentime" :1532658207189, "htime" :1532657631003, "ruleid" :6, "severity" :12, "thisDataItemName"
    :"COOLING WATER TEMP${index}.","thisDataItemValue":"7229.307812${index}"}`;
                        var testJson = JSON.parse(testJsonStr);
                        response.data.list.push(testJson);
                    }

                    // 添加设备按钮放入列表；同时显示此设备的报警情况，放入文本框中 
                    var $colDiv = $('<div></div>');
                    $colDiv.addClass("layui-col-xs6 layui-col-md4");
                    var $devButton = $('<button></button>');
                    var $devNameP = `<p>${singleDevice.id}号设备 - ${singleDevice.name}</p>`;
                    // - 先统一设置为绿色按钮（无报警），如果有报警在之后修改为红色
                    $devButton.addClass("layui-btn");
                    // - 动态绑定 点击查看设备具体信息 的功能
                    $devButton.bind('click', function() {
                        window.location.href = "deviceDetail.html?deviceid=" + singleDevice.id;
                    })

                    // - 如果查找到的报警信息不为空且未恢复，则修改为红色报警按钮
                    for (let k = 0; k < response.data.list.length; k++) {
                        const oneAlarm = response.data.list[k]; // 显示报警状态的告警信息 
                        if (oneAlarm.active == true) {
                            $('#alarmInfo').append(oneAlarm.deviceid + "号设备：" + oneAlarm.alarmdesc + ",值为：" +
                                oneAlarm.thisDataItemValue + "\n");
                            $devButton.addClass("layui-btn-danger")
                        }
                    } // - 添加该项进入设备列表
                    $colDiv.append($devButton);
                    $colDiv.append($devNameP);
                    $fieldset.append($colDiv);

                }
            });
        }
        // 循环完所有对应的设备之后，将类型渲染到chooseStation下面
        chooseStation.append($fieldset);
    }
}
/**
 * 检测模型id（modelId ）是否在设备模型数组中
 */
function modelInArray(modelId) {
    for (let i = 0; i < devModelArray.length; i++) {
        const element = devModelArray[i];
        if (element == modelId) {
            return i;
        }
    }
    return -1;
}