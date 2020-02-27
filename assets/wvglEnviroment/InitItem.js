/**
 * Created by msi on 2019/7/26.
 */
function InitItem(scene, StockManager)
{
    //加载物料模型，计算物料颜色，读取物料位置

    //数据初始化
    //StockManager = new StockManager(scene);
    StockManager.Init();

    //根据数据在场景中生成对应的模型，设置指定的颜色
    var MaterialRed = new BABYLON.StandardMaterial("MaterialRed", scene);
    MaterialRed.diffuseColor = new BABYLON.Color3(0.5, 0, 0);
    //MaterialRed.backFaceCulling = false;
    //MaterialRed.alpha = 1.0;
    //MaterialRed.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    //MaterialRed.emissiveColor = new BABYLON.Color3(0,0,0);??
    var MaterialGreen = new BABYLON.StandardMaterial("MaterialGreen", scene);
    MaterialGreen.diffuseColor = new BABYLON.Color3(0, 0.5, 0);
    var MaterialYellow = new BABYLON.StandardMaterial("MaterialYellow", scene);
    MaterialYellow.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0);

/*    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    // Add the highlight layer.
    var hl = new BABYLON.HighlightLayer("hl1", scene);
    hl.addMesh(sphere, BABYLON.Color3.Green());*/

	//console.log(val1);
	
	arr=[];
    //console.log(StockManager.StockInfos);
    BABYLON.SceneLoader.ImportMesh("", "huojialow/", "huojia.gltf", scene, function(HuojiaMeshes, particleSystems, skeletons)
    {
        StockManager.StockInfos.forEach(function(StockInfo,i)
        {
            let ItemID = StockInfo["ItemID"];
            StockManager.ItemInfos.forEach(function(ItemInfo,i)
            {
                if(ItemID === ItemInfo["ID"])
                {
                    BABYLON.SceneLoader.ImportMesh("", "huojialow/", ItemInfo.Model, scene, function (newMeshes, particleSystems, skeletons)
                    {
                        //填充结构体成员
                        StockInfo.Meshes = newMeshes;
                        //相对移动
                        newMeshes[0].position.x += StockInfo.PositionX + HuojiaMeshes[0].position.x;
                        newMeshes[0].position.y += StockInfo.PositionY + HuojiaMeshes[0].position.y;
                        newMeshes[0].position.z += StockInfo.PositionZ + HuojiaMeshes[0].position.z;
                        //改变材质
                        for (var i = 0; i < newMeshes.length; i++)
                        {
                            if (StockInfo.Color == "Yellow")
                            {
                                newMeshes[i].material = MaterialYellow;
                            }
                            else if (StockInfo.Color == "Red")
                            {
                                newMeshes[i].material = MaterialRed;
                            }
                            else if (StockInfo.Color == "Green")
                            {
                                //newMeshes[i].material = MaterialGreen;
                            }
                        }
                        //接口调用示例
                        //StockManager.SetHighlightByItemID(arr[0]);
						//console.log(val1);
						//StockManager.SetHighlightByItemID("5");
                        //StockManager.SetHighlightByItemID("14");
                        //StockManager.SetHighlightBySupplierID("1");
                    });
                }
            });
        });
    });
}