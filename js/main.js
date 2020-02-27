/**
 * @description main javscript
 * @date 2020.2.21
 * @author 杯c咔+
 */


/**
 * @description main javscript init function 
 * @main
 *      it will be do some functions
 */
function mainJavascirptInit() {
    renderGisContainer();
    fullscreenToCancas();
    hiddenMacines();
    toWuxIshengMa();
    createPieCharts();
    create3dPie();
    createZhuzhuangtu();
    createWvglEnviroment1();
    createWvglEnviroment2();
    createWvglEnviroment3();
    createWvglEnviroment4();
    createWvglEnviroment5();
    createWvglEnviroment6();
    createWvglEnviroment7();
}




mainJavascirptInit();

/**
 *  @description render gis container,dom id like view
 */
var viewer;
function renderGisContainer() {
    viewer = new Cesium.Viewer('cesiumCanvas1', {
        imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
            url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
        }),
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        animation: false,    //左下角的动画控件的显示
        shouldAnimate: false,   //控制模型动画
        timeline: false,
        fullscreenButton: false,
    });
    viewer.cesiumWidget.creditContainer.style.display = "none";



       /**
     * 点击获取坐标
     */

    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (movement) {
        var ellipsoid=viewer.scene.globe.ellipsoid;
        /**
         * 屏幕坐标转世界
         */
        var pick1= new Cesium.Cartesian2(movement.position.x,movement.position.y)
        var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick1),viewer.scene);
        if (!cartesian){return}
        var cartographic=ellipsoid.cartesianToCartographic(cartesian);
        var lat=Cesium.Math.toDegrees(cartographic.latitude);
        var lng=Cesium.Math.toDegrees(cartographic.longitude);
        drawPoint(lng,lat)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    /**
     * 传入经纬度回执点
     */
    function drawPoint(x,y){
        return;
        console.log("x="+x,"y="+y);
        viewer.entities.add({
            position: new Cesium.Cartesian3.fromDegrees(x,y,0),
            point: {
                color: Cesium.Color.RED,
                pixelSize: 15,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
    }


    /**
     * 禁止陷入
     */
    viewer.clock.onTick.addEventListener(function () {        
                if(viewer.camera.pitch > 0){
                    viewer.scene.screenSpaceCameraController.enableTilt = false;
                }
            }); 
            
            var mousePosition,startMousePosition;
            var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
            handler.setInputAction(function(movement) { 
                mousePosition=startMousePosition= Cesium.Cartesian3.clone(movement.position);
                handler.setInputAction(function(movement) {
                    mousePosition = movement.endPosition;
                    var y = mousePosition.y - startMousePosition.y;
                    if(y>0){
                        viewer.scene.screenSpaceCameraController.enableTilt = true;
                    }
                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);

    /**
     * 点击失去地理坐标
     */


    // clickGetPositon();

    importModelByJson();

    function importModelByJson() {
        let xml = new XMLHttpRequest();
        xml.open('GET', "./assets/json/model.json");
        xml.send();
        xml.addEventListener("readystatechange", function () {
            if (xml.readyState == 4) {
                let models = JSON.parse(xml.response);
                models.features.map(e => {
                    let position = e.geometry.coordinates;
                    let src = e.properties.style.modelUrl;
                    let scale = e.properties.style.scale;
                    let heading = e.properties.style.heading;
                    var model = viewer.scene.primitives.add(Cesium.Model.fromGltf({
                        url: src,
                        modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
                            Cesium.Cartesian3.fromDegrees(position[0], position[1], 0),
                            new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(heading), 0, 0)
                        ),
                        scale: scale,
                    }));

                    let x = 90;

                })
            }
        })
    }


 
    /**
     * 搜索
     */
    AMap.plugin('AMap.Autocomplete', function () {
        // 实例化Autocomplete
        var autoOptions = {
            // input 为绑定输入提示功能的input的DOM ID
            input: 'words'
        }
        function setFly(X, Y) {
            X*=1
            Y*=1
            X-=0.004748053202632718;
            Y+=0.0020407433426115063
            drawPoint(X,Y)
            document.getElementById("resulis").innerHTML = ``

            /**
             * 绘制一点
             */



            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(X,Y,200),
            })

        }
        AMap.plugin('AMap.Autocomplete', function () {
            // 实例化Autocomplete
            var autoOptions = {
                //city 限定城市，默认全国
                city: '全国'
            }
            var autoComplete = new AMap.Autocomplete(autoOptions);
            document.getElementById("words").oninput = function () {
                document.getElementById("resulis").innerHTML = ``;
                autoComplete.search(this.value, function (status, result) {
                    if (result.tips) {
                        result.tips.map((e, i) => {
                            if (e.location) {
                                document.getElementById("resulis").innerHTML += `<div x="${e.location.lng}" y="${e.location.lat}" class="resuliItem">${e.name}</di>`

                            }
                        })

                        for (let i = 0; i < document.getElementsByClassName("resuliItem").length; i++) {
                            document.getElementsByClassName("resuliItem")[i].addEventListener("click", function () {
                                setFly(this.getAttribute("x"), this.getAttribute("y"))
                            })
                        }
                    }

                })
            }

        })
    })



}




/**
 * @description create wvglenviroment functions 
 */
function createWvglEnviroment1() {

    let engine = new WVGL.Engine(document.getElementById("buttomCanvas1"), true, { preserveDrawingBuffer: true, stencil: true });
    let scene = new WVGL.Scene(engine);
    let camera = new WVGL.ArcRotateCamera("Camera", 0, Math.PI / 2, 200, new WVGL.Vector3(0, 0, 0), scene);
    camera.wheelPrecision = 1000000;
    camera.attachControl(document.getElementById("buttomCanvas1"), true);
    camera.useAutoRotationBehavior = true;
    camera.autoRotationBehavior.idleRotationSpeed = 0.5; //自动旋转速度
    camera.autoRotationBehavior.idleRotationWaitTime = 1000; //用户交互后多少时间开启自动旋转（毫秒）
    camera.autoRotationBehavior.idleRotationSpinupTime = 1000; //从开始自动旋转到设置的旋转速度所需要的时间（毫秒）
    camera.autoRotationBehavior.zoomStopsAnimation = true; //
    scene.clearColor =new WVGL.Color4(0,0,0,0);
    WVGL.SceneLoader.ImportMesh("", "./assets/model/hezi/", "a001.wvgl", scene, function (models) {
        models[0].scaling = new WVGL.Vector3(models[0].scaling.x * 0.1, models[0].scaling.y * 0.1, models[0].scaling.z * 0.1)
    })
    light = new WVGL.HemisphericLight("Dir0", new WVGL.Vector3(5, -5, -10), scene);
    engine.runRenderLoop(function () {
        if (scene) {
            scene.render();
        }
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });

}
function createWvglEnviroment2() {
    let engine = new WVGL.Engine(document.getElementById("buttomCanvas2"), true, { preserveDrawingBuffer: true, stencil: true });
    let scene = new WVGL.Scene(engine);
    let camera = new WVGL.ArcRotateCamera("Camera", 0, Math.PI / 2, 200, new WVGL.Vector3(0, 0, 0), scene);
    camera.wheelPrecision = 1000000;
    camera.attachControl(document.getElementById("buttomCanvas2"), true);
    camera.useAutoRotationBehavior = true;
    camera.autoRotationBehavior.idleRotationSpeed = 0.5; //自动旋转速度
    camera.autoRotationBehavior.idleRotationWaitTime = 1000; //用户交互后多少时间开启自动旋转（毫秒）
    camera.autoRotationBehavior.idleRotationSpinupTime = 1000; //从开始自动旋转到设置的旋转速度所需要的时间（毫秒）
    camera.autoRotationBehavior.zoomStopsAnimation = true; //
    camera.wheelPrecision = 1000000
    scene.clearColor =new WVGL.Color4(0,0,0,0);
    WVGL.SceneLoader.ImportMesh("", "./assets/model/hezi/", "a002.wvgl", scene, function (models) {
        models[0].scaling = new WVGL.Vector3(models[0].scaling.x * 0.1, models[0].scaling.y * 0.1, models[0].scaling.z * 0.1)
    })
    light = new WVGL.HemisphericLight("Dir0", new WVGL.Vector3(5, -5, -10), scene);
    engine.runRenderLoop(function () {
        if (scene) {
            scene.render();
        }
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
}
function createWvglEnviroment3() {
    let engine = new WVGL.Engine(document.getElementById("buttomCanvas3"), true, { preserveDrawingBuffer: true, stencil: true });
    let scene = new WVGL.Scene(engine);
    let camera = new WVGL.ArcRotateCamera("Camera", 0, Math.PI / 2, 200, new WVGL.Vector3(0, 0, 0), scene);
    camera.wheelPrecision = 1000000;

    camera.attachControl(document.getElementById("buttomCanvas3"), true);
    camera.useAutoRotationBehavior = true;
    camera.autoRotationBehavior.idleRotationSpeed = 0.5; //自动旋转速度
    camera.autoRotationBehavior.idleRotationWaitTime = 1000; //用户交互后多少时间开启自动旋转（毫秒）
    camera.autoRotationBehavior.idleRotationSpinupTime = 1000; //从开始自动旋转到设置的旋转速度所需要的时间（毫秒）
    camera.autoRotationBehavior.zoomStopsAnimation = true; //
    scene.clearColor =new WVGL.Color4(0,0,0,0);
    WVGL.SceneLoader.ImportMesh("", "./assets/model/hezi/", "a003.wvgl", scene, function (models) {
        models[0].scaling = new WVGL.Vector3(models[0].scaling.x * 0.1, models[0].scaling.y * 0.1, models[0].scaling.z * 0.1)
    })
    light = new WVGL.HemisphericLight("Dir0", new WVGL.Vector3(5, -5, -10), scene);
    engine.runRenderLoop(function () {
        if (scene) {
            scene.render();
        }
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
}
function createWvglEnviroment4() {
    let engine = new WVGL.Engine(document.getElementById("buttomCanvas4"), true, { preserveDrawingBuffer: true, stencil: true });
    let scene = new WVGL.Scene(engine);
    let camera = new WVGL.ArcRotateCamera("Camera", 0, Math.PI / 2, 200, new WVGL.Vector3(0, 0, 0), scene);
    camera.wheelPrecision = 1000000;
    camera.useAutoRotationBehavior = true;
    camera.autoRotationBehavior.idleRotationSpeed = 0.5; //自动旋转速度
    camera.autoRotationBehavior.idleRotationWaitTime = 1000; //用户交互后多少时间开启自动旋转（毫秒）
    camera.autoRotationBehavior.idleRotationSpinupTime = 1000; //从开始自动旋转到设置的旋转速度所需要的时间（毫秒）
    camera.autoRotationBehavior.zoomStopsAnimation = true; //

    camera.attachControl(document.getElementById("buttomCanvas4"), true);
    scene.clearColor =new WVGL.Color4(0,0,0,0);
    WVGL.SceneLoader.ImportMesh("", "./assets/model/hezi/", "001.wvgl", scene, function (models) {
        models[0].scaling = new WVGL.Vector3(models[0].scaling.x * 0.05, models[0].scaling.y * 0.05, models[0].scaling.z * 0.05)
    })
    light = new WVGL.HemisphericLight("Dir0", new WVGL.Vector3(5, -5, -10), scene);
    engine.runRenderLoop(function () {
        if (scene) {
            scene.render();
        }
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
}
function createWvglEnviroment5() {
    let engine = new WVGL.Engine(document.getElementById("buttomCanvas5"), true, { preserveDrawingBuffer: true, stencil: true });
    let scene = new WVGL.Scene(engine);
    let camera = new WVGL.ArcRotateCamera("Camera", 0, Math.PI / 2, 200, new WVGL.Vector3(0, 0, 0), scene);
    camera.wheelPrecision = 1000000;
    camera.useAutoRotationBehavior = true;
    camera.autoRotationBehavior.idleRotationSpeed = 0.5; //自动旋转速度
    camera.autoRotationBehavior.idleRotationWaitTime = 1000; //用户交互后多少时间开启自动旋转（毫秒）
    camera.autoRotationBehavior.idleRotationSpinupTime = 1000; //从开始自动旋转到设置的旋转速度所需要的时间（毫秒）
    camera.autoRotationBehavior.zoomStopsAnimation = true; //

    camera.attachControl(document.getElementById("buttomCanvas5"), true);
    scene.clearColor =new WVGL.Color4(0,0,0,0);
    WVGL.SceneLoader.ImportMesh("", "./assets/model/hezi/", "002.wvgl", scene, function (models) {
        models[0].scaling = new WVGL.Vector3(models[0].scaling.x * 0.05, models[0].scaling.y * 0.05, models[0].scaling.z * 0.05)
    })
    light = new WVGL.HemisphericLight("Dir0", new WVGL.Vector3(5, -5, -10), scene);
    engine.runRenderLoop(function () {
        if (scene) {
            scene.render();
        }
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
}
function createWvglEnviroment6() {
    let engine = new WVGL.Engine(document.getElementById("buttomCanvas6"), true, { preserveDrawingBuffer: true, stencil: true });
    let scene = new WVGL.Scene(engine);
    let camera = new WVGL.ArcRotateCamera("Camera", 0, Math.PI / 2, 200, new WVGL.Vector3(0, 0, 0), scene);
    camera.wheelPrecision = 1000000;
    camera.useAutoRotationBehavior = true;
    camera.autoRotationBehavior.idleRotationSpeed = 0.5; //自动旋转速度
    camera.autoRotationBehavior.idleRotationWaitTime = 1000; //用户交互后多少时间开启自动旋转（毫秒）
    camera.autoRotationBehavior.idleRotationSpinupTime = 1000; //从开始自动旋转到设置的旋转速度所需要的时间（毫秒）
    camera.autoRotationBehavior.zoomStopsAnimation = true; //
    camera.attachControl(document.getElementById("buttomCanvas6"), true);
    scene.clearColor =new WVGL.Color4(0,0,0,0);
    WVGL.SceneLoader.ImportMesh("", "./assets/model/hezi/", "default.gltf", scene, function (models) {
        models[0].scaling = new WVGL.Vector3(models[0].scaling.x * 30, models[0].scaling.y * 30, models[0].scaling.z * 30)
        models[0].position.y = -30;
    })
    light = new WVGL.HemisphericLight("Dir0", new WVGL.Vector3(5, -5, -10), scene);
    engine.runRenderLoop(function () {
        if (scene) {
            scene.render();
        }
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
}
function createWvglEnviroment7() {
    let engine = new WVGL.Engine(document.getElementById("buttomCanvas7"), true, { preserveDrawingBuffer: true, stencil: true });
    let scene = new WVGL.Scene(engine);
    let camera = new WVGL.ArcRotateCamera("Camera", 0, Math.PI / 2, 200, new WVGL.Vector3(0, 0, 0), scene);
    camera.attachControl(document.getElementById("buttomCanvas7"), true);
    camera.wheelPrecision = 1000000;
    camera.useAutoRotationBehavior = true;
    camera.autoRotationBehavior.idleRotationSpeed = 0.5; //自动旋转速度
    camera.autoRotationBehavior.idleRotationWaitTime = 1000; //用户交互后多少时间开启自动旋转（毫秒）
    camera.autoRotationBehavior.idleRotationSpinupTime = 1000; //从开始自动旋转到设置的旋转速度所需要的时间（毫秒）
    camera.autoRotationBehavior.zoomStopsAnimation = true; //
    scene.clearColor =new WVGL.Color4(0,0,0,0);
    WVGL.SceneLoader.ImportMesh("", "./assets/model/hezi/", "default.gltf", scene, function (models) {
        models[0].scaling = new WVGL.Vector3(models[0].scaling.x * 30, models[0].scaling.y * 30, models[0].scaling.z * 30)
        models[0].position.y = -30;
    })
    light = new WVGL.HemisphericLight("Dir0", new WVGL.Vector3(5, -5, -10), scene);
    engine.runRenderLoop(function () {
        if (scene) {
            scene.render();
        }
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
}

let s1;
function createWvglEnviroment11() {
    if (s1) {
        s1.dispose();
    }
    let engine = new WVGL.Engine(document.getElementById("botcanvas1"), true, { preserveDrawingBuffer: true, stencil: true });
    let scene = new WVGL.Scene(engine);
    s1 = scene;
    let camera = new WVGL.ArcRotateCamera("Camera", 0, Math.PI / 2, 250, new WVGL.Vector3(0, 0, 0), scene);
    camera.attachControl(document.getElementById("botcanvas1"), true);
    camera.wheelPrecision = 1000000;

    scene.clearColor = new WVGL.Color4(0, 0, 0, 0.7)
    WVGL.SceneLoader.ImportMesh("", "./assets/model/hezi/", "a001.wvgl", scene, function (models) {
        models[0].scaling = new WVGL.Vector3(models[0].scaling.x * 0.1, models[0].scaling.y * 0.1, models[0].scaling.z * 0.1)
    })

    light = new WVGL.HemisphericLight("Dir0", new WVGL.Vector3(5, -5, -10), scene);
    engine.runRenderLoop(function () {
        if (scene) {
            scene.render();
        }
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
}



let s2;
function createWvglEnviroment12() {
    if (s2) {
        s2.dispose();
    }
    let engine = new WVGL.Engine(document.getElementById("botcanvas2"), true, { preserveDrawingBuffer: true, stencil: true });
    let scene = new WVGL.Scene(engine);
    s2 = scene;
    let camera = new WVGL.ArcRotateCamera("Camera", 0, Math.PI / 2, 250, new WVGL.Vector3(0, 0, 0), scene);
    camera.attachControl(document.getElementById("botcanvas2"), true);
    camera.wheelPrecision = 1000000;

    scene.clearColor = new WVGL.Color4(0, 0, 0, 0.7)
   
    WVGL.SceneLoader.ImportMesh("", "./assets/model/hezi/", "a002.wvgl", scene, function (models) {
        models[0].scaling = new WVGL.Vector3(models[0].scaling.x * 0.1, models[0].scaling.y * 0.1, models[0].scaling.z * 0.1)
    })

    light = new WVGL.HemisphericLight("Dir0", new WVGL.Vector3(5, -5, -10), scene);
    engine.runRenderLoop(function () {
        if (scene) {
            scene.render();
        }
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
}

let s3;
function createWvglEnviroment13() {
    if (s3) {
        s3.dispose();
    }
    let engine = new WVGL.Engine(document.getElementById("botcanvas3"), true, { preserveDrawingBuffer: true, stencil: true });
    let scene = new WVGL.Scene(engine);
    s3 = scene;
    let camera = new WVGL.ArcRotateCamera("Camera", 0, Math.PI / 2, 200, new WVGL.Vector3(0, 0, 0), scene);
    camera.wheelPrecision = 1000000;

    camera.attachControl(document.getElementById("botcanvas3"), true);
    scene.clearColor = new WVGL.Color4(0, 0, 0, 0.7)
    WVGL.SceneLoader.ImportMesh("", "./assets/model/hezi/", "a003.wvgl", scene, function (models) {
        models[0].scaling = new WVGL.Vector3(models[0].scaling.x * 0.1, models[0].scaling.y * 0.1, models[0].scaling.z * 0.1)
    })
    light = new WVGL.HemisphericLight("Dir0", new WVGL.Vector3(5, -5, -10), scene);
    engine.runRenderLoop(function () {
        if (scene) {
            scene.render();
        }
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
}

let s4;
function createWvglEnviroment14() {
    if (s4) {
        s4.dispose();
    }
    let engine = new WVGL.Engine(document.getElementById("botcanvas4"), true, { preserveDrawingBuffer: true, stencil: true });
    let scene = new WVGL.Scene(engine);
    s4 = scene;
    let camera = new WVGL.ArcRotateCamera("Camera", 0, Math.PI / 2, 200, new WVGL.Vector3(0, 0, 0), scene);
    camera.wheelPrecision = 1000000;

    camera.attachControl(document.getElementById("botcanvas4"), true);
    scene.clearColor = new WVGL.Color4(0, 0, 0, 0.7)
    WVGL.SceneLoader.ImportMesh("", "./assets/model/hezi/", "001.wvgl", scene, function (models) {
        models[0].scaling = new WVGL.Vector3(models[0].scaling.x * 0.06, models[0].scaling.y * 0.06, models[0].scaling.z * 0.06)
    })
    light = new WVGL.HemisphericLight("Dir0", new WVGL.Vector3(5, -5, -10), scene);
    engine.runRenderLoop(function () {
        if (scene) {
            scene.render();
        }
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
}


let s5;
function createWvglEnviroment15() {
    if (s5) {
        s5.dispose();
    }
    let engine = new WVGL.Engine(document.getElementById("botcanvas5"), true, { preserveDrawingBuffer: true, stencil: true });
    let scene = new WVGL.Scene(engine);
    s5 = scene;
    let camera = new WVGL.ArcRotateCamera("Camera", 0, Math.PI / 2, 200, new WVGL.Vector3(0, 0, 0), scene);
    camera.wheelPrecision = 1000000;

    camera.attachControl(document.getElementById("botcanvas5"), true);
    scene.clearColor = new WVGL.Color4(0, 0, 0, 0.7)
    WVGL.SceneLoader.ImportMesh("", "./assets/model/hezi/", "002.wvgl", scene, function (models) {
        models[0].scaling = new WVGL.Vector3(models[0].scaling.x * 0.06, models[0].scaling.y * 0.06, models[0].scaling.z * 0.06)
    })
    light = new WVGL.HemisphericLight("Dir0", new WVGL.Vector3(5, -5, -10), scene);
    engine.runRenderLoop(function () {
        if (scene) {
            scene.render();
        }
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
}


let s6;
function createWvglEnviroment16() {
    if (s6) {
        s6.dispose();
    }
    let engine = new WVGL.Engine(document.getElementById("botcanvas6"), true, { preserveDrawingBuffer: true, stencil: true });
    let scene = new WVGL.Scene(engine);
    s6 = scene;
    let camera = new WVGL.ArcRotateCamera("Camera", 0, Math.PI / 2, 200, new WVGL.Vector3(0, 0, 0), scene);
    camera.attachControl(document.getElementById("botcanvas6"), true);
    camera.wheelPrecision = 1000000;

    scene.clearColor = new WVGL.Color4(0, 0, 0, 0.7)
    WVGL.SceneLoader.ImportMesh("", "./assets/model/hezi/", "default.gltf", scene, function (models) {
        models[0].scaling = new WVGL.Vector3(models[0].scaling.x * 30, models[0].scaling.y * 30, models[0].scaling.z * 30)
        models[0].position.y = -30;
    })
    light = new WVGL.HemisphericLight("Dir0", new WVGL.Vector3(5, -5, -10), scene);
    engine.runRenderLoop(function () {
        if (scene) {
            scene.render();
        }
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
}

let s7;
function createWvglEnviroment17() {
    if (s7) {
        s7.dispose();
    }
    let engine = new WVGL.Engine(document.getElementById("botcanvas7"), true, { preserveDrawingBuffer: true, stencil: true });
    let scene = new WVGL.Scene(engine);
    s7 = scene;
    let camera = new WVGL.ArcRotateCamera("Camera", 0, Math.PI / 2, 200, new WVGL.Vector3(0, 0, 0), scene);
    camera.wheelPrecision = 1000000;

    camera.attachControl(document.getElementById("botcanvas7"), true);
    scene.clearColor = new WVGL.Color4(0, 0, 0, 0.7)
    WVGL.SceneLoader.ImportMesh("", "./assets/model/hezi/", "default.gltf", scene, function (models) {
        models[0].scaling = new WVGL.Vector3(models[0].scaling.x * 30, models[0].scaling.y * 30, models[0].scaling.z * 30)
        models[0].position.y = -30;
    })
    light = new WVGL.HemisphericLight("Dir0", new WVGL.Vector3(5, -5, -10), scene);
    engine.runRenderLoop(function () {
        if (scene) {
            scene.render();
        }
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
}


/**
 * @description fullscreen canvas
 */
function fullscreenToCancas() {
    document.getElementById("buttomCanvas1").addEventListener("dblclick", function () {
        document.getElementById("bot1").style.display = "block";
        console.log("第一个")
        createWvglEnviroment11();
    })

    document.getElementById("buttomCanvas2").addEventListener("dblclick", function () {
        document.getElementById("bot2").style.display = "block";
        console.log("第二个")
        createWvglEnviroment12();
    })

    document.getElementById("buttomCanvas3").addEventListener("dblclick", function () {
        document.getElementById("bot3").style.display = "block";
        console.log("第三个")
        createWvglEnviroment13();
    })

    document.getElementById("buttomCanvas4").addEventListener("dblclick", function () {
        document.getElementById("bot4").style.display = "block";
        console.log("第四个")
        createWvglEnviroment14();
    })



    let flag5 = false;
    document.getElementById("buttomCanvas5").addEventListener("dblclick", function () {
        document.getElementById("bot5").style.display = "block";
        console.log("第5个")
        createWvglEnviroment15();
    })

    let flag6 = false;
    document.getElementById("buttomCanvas6").addEventListener("dblclick", function () {
        document.getElementById("bot6").style.display = "block";
        console.log("第6个")
        createWvglEnviroment16();
    })

    let flag7 = false;
    document.getElementById("buttomCanvas7").addEventListener("dblclick", function () {
        document.getElementById("bot7").style.display = "block";
        console.log("第七个")
        createWvglEnviroment17();
    })


    document.getElementById("exitfullsceen1").addEventListener("click", function () {
        document.getElementById("bot1").style.display = "none";
        s1.dispose();
        s1 = null;
    })

    document.getElementById("exitfullsceen2").addEventListener("click", function () {
        document.getElementById("bot2").style.display = "none";
        s2.dispose();
        s2 = null;
    })

    document.getElementById("exitfullsceen3").addEventListener("click", function () {
        document.getElementById("bot3").style.display = "none";
        s3.dispose();

        s3 = null;
    })

    document.getElementById("exitfullsceen4").addEventListener("click", function () {
        document.getElementById("bot4").style.display = "none";
        s4.dispose();
        s4 = null;
    })

    document.getElementById("exitfullsceen5").addEventListener("click", function () {
        document.getElementById("bot5").style.display = "none";
        s5.dispose();
        s5 = null;
    })

    document.getElementById("exitfullsceen6").addEventListener("click", function () {
        document.getElementById("bot6").style.display = "none";
        s6.dispose();
        s6 = null;
    })

    document.getElementById("exitfullsceen7").addEventListener("click", function () {
        document.getElementById("bot7").style.display = "none";
        s7.dispose();
        s7 = null;
    })
}


function hiddenMacines() {
    let flag = true;
    document.getElementById("leftMacineCloseButton").addEventListener("click", function () {
        document.getElementById("leftMacine").style.display = "none";
        document.getElementById("seemacine").style.display = "flex";
    })

    document.getElementById("seemacine").addEventListener("click", function () {
        document.getElementById("leftMacine").style.display = "block";
        document.getElementById("seemacine").style.display = "none";
        if (flag) {
            createWvglEnviroment1();
            createWvglEnviroment2();
            createWvglEnviroment3();
            createWvglEnviroment4();
            createWvglEnviroment5();
            createWvglEnviroment6();
            createWvglEnviroment7();
            flag = false;
        }

    })
}


/**
 *to wu xi sheng ma
 */
function toWuxIshengMa() {

   


    document.getElementById("toWuXiShengMa").addEventListener("click", function () {

        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(120.48999999999992, 31.4696, 1200),

        }
        )
      
        setTimeout(() => {
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(120.48749999999992,31.4699, 100),
                orientation: {
                    heading: Cesium.Math.toRadians(108), // 方向
                    pitch: Cesium.Math.toRadians(0.2083128112515195),// 倾斜角度
                    roll: 0.0036184808354713383
                }
            })
        }, 3000);
    })

    let x=120.48999999999992
    let y=31.469
    let heading=108
        window.addEventListener("keydown",function(e){
            return;
        if(e.key=="ArrowLeft"){
            x-=0.0004;
        }
        if(e.key=="ArrowUp"){
            y+=0.0004
        }
        if(e.key=="ArrowDown"){
            y-=0.0004
        }
        if(e.key=="ArrowRight"){
            x+=0.0004
        }
        if(e.key=="a"){
            heading--
        }
        if(e.key=="d"){
            heading++
        }

        console.log(x,y,heading)
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(x, y, 100),
            orientation: {
                heading: Cesium.Math.toRadians(heading), // 方向
                pitch: Cesium.Math.toRadians(0.2083128112515195),// 倾斜角度
                roll: 0.0036184808354713383
            }
        })
        
    })
}






/**
 * function to create two pie charts
 */
function createPieCharts() {
   

    function createPieChart2() {
        Highcharts.chart('piechart2', {
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            credits: {
                enabled: false
            },
            colors:['rgb(144,237,125)','rgb(124,181,236)'],
            chart: {
                backgroundColor: 'rgba(1,1,1,0)',
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    
                    beta: 0
                }
            },
            tooltip: {
                pointFormat: ' <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 15,
                innerSize:"40",

                    dataLabels: {
                        enabled: true,
                        distance: 10,
                        format: '{point.name}',
                        style: {
                            color: "#999",
                            textOutline:"none"
                            },
                    }
                }
            },
            series: [{
                type: 'pie',
                data: [
                    ['入厂',   10],
                    ['出厂',   20]
                ]
            }]
        });
    }
    
    function createPieChart1() {
        Highcharts.chart('piechart1', {
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            credits: {
                enabled: false
            },
            colors:['rgb(144,237,125)','rgb(124,181,236)'],
            chart: {
                backgroundColor: 'rgba(1,1,1,0)',
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    
                    beta: 0
                }
            },
            tooltip: {
                pointFormat: ' <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 15,
                innerSize:"40",

                    dataLabels: {
                        enabled: true,
                        distance: 10,
                        format: '{point.name}',
                        style: {
                            color: "#999",
                            textOutline:"none"
                            },
                    }
                }
            },
            series: [{
                type: 'pie',
                data: [
                    ["在岗",   12],
                    ['不在岗',   30]
                ]
            }]
        });
    }
    createPieChart1();
    createPieChart2();
}



function create3dPie() {
    Highcharts.chart('3dp1', {
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        credits: {
            enabled: false
        },
        colors:['rgb(248,237,105)','rgb(89,121,248),',"rgb(241,92,128)","rgb(247,163,92)"],
        chart: {
            backgroundColor: 'rgba(1,1,1,0)',
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            }
        },
        tooltip: {
            pointFormat: '{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 35,
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    distance: 10,
                    style: {
                        color: "#999",
                        textOutline:"none"
                        },
                }
            }
        },
        series: [{
            type: 'pie',
            name:"再放",
            data: [
                ['1级',   10],
                ['2级',   20],
                ['3级',   10],
                ['4级',   20]
            ]
        }]
    });
    Highcharts.chart('3dp2', {
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        credits: {
        },
        colors:['rgb(248,237,105)','rgb(89,121,248),',"rgb(241,92,128)","rgb(247,163,92)"],
        chart: {
            backgroundColor: 'rgba(1,1,1,0)',
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            }
        },
        tooltip: {
            pointFormat: '{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 35,
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    distance: 10,
                    style: {
                        color: "#999",
                        textOutline:"none"
                        },
                },
              
            }
        },
        series: [{
            type: 'pie',
            name:"再放",
            data: [
                ['1级',   11],
                ['2级',   8],
                ['3级',   14],
                ['4级',   5]
            ]
        }]
    });
}





function createZhuzhuangtu(){
    Highcharts.chart('zhuzhuang3d', {
        chart: {
            backgroundColor:"rgba(0,0,0,0)",
            type: 'cylinder',
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 50,
                viewDistance: 25
            }
        },
        xAxis: {
            categories: ['2020-2-15','2020-2-17','2013-2-21 ']
        },
        yAxis:{
            text:"数量"
        },
        credits: {
            enabled: false
        },
        title: {
            text: ' '
        },
        plotOptions: {
            series: {
                depth: 25,
                colorByPoint: true
            }
        },
        series: [{
            data: [10,20,30],
            name: '报警次数',
            showInLegend: false
        }]
    });
}