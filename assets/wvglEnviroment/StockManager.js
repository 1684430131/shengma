/**
 * Created by msi on 2019/7/25.
 */
function StockManager(scene)
{
    //�����Ϣ
    this.StockInfos = {};
    //������Ϣ
    this.ItemInfos = {};
    //������Ϣ
    this.SupplierInfos = {};
    //������Ϣ
    this.ShelfInfos = {};
    // ����������Ϣ
    this.TotalQuantityMap = new Map();
    //��һ�������ݴ����ڶ���������ģ��
	
    this.Init = function ()
    {
        //
        this.StockInfos = LoadJson("json/StockInfos.json");
        this.ItemInfos = LoadJson("json/ItemInfos.json");
        this.SupplierInfos = LoadJson("json/SupplierInfos.json");
        this.ShelfInfos = LoadJson("json/ShelfInfos.json");
        this.TotalQuantityMap = new Map();

        //���㵥����������
        for(var index = 0; index < this.StockInfos.length; index++)
        {
            if(this.TotalQuantityMap.has(this.StockInfos[index].ItemID) == false)
            {
                this.TotalQuantityMap.set(this.StockInfos[index].ItemID, 0);
            }
            this.TotalQuantityMap[this.StockInfos[index].ItemID] = (this.TotalQuantityMap[this.StockInfos[index].ItemID] || 0) + this.StockInfos[index].Quantity;
            //console.log(this.StockInfos[index].Quantity);
        }
        //������ɫ
        //for(StockInfo in this.StockInfos)
        for(var index = 0; index < this.StockInfos.length; index++)
        {
            if(this.TotalQuantityMap[this.StockInfos[index].ItemID] < this.ItemInfos[this.StockInfos[index].ItemID - 1].ErrorLess)
            {
                this.StockInfos[index].Color = "Red";
            }
            else if(this.TotalQuantityMap[this.StockInfos[index].ItemID] < this.ItemInfos[this.StockInfos[index].ItemID - 1].WarningLess)
            {
                this.StockInfos[index].Color = "Yellow";
            }
            else if(this.TotalQuantityMap[this.StockInfos[index].ItemID] < this.ItemInfos[this.StockInfos[index].ItemID - 1].WarningMore)
            {
                this.StockInfos[index].Color = "Green";
            }
            else if(this.TotalQuantityMap[this.StockInfos[index].ItemID] < this.ItemInfos[this.StockInfos[index].ItemID - 1].ErrorMore)
            {
                this.StockInfos[index].Color = "Yellow";
            }
            else
            {
                this.StockInfos[index].Color = "Red";
            }
        }
        //console.log(this.StockInfos);
        //console.log(this.ItemInfos);
        //console.log(this.SupplierInfos);
        //console.log(this.ShelfInfos);
    }

    //�������ϱ��ɸѡ
    this.GetIDsByItemID = function (ItemID)
    {
        var StockIDs = {};
        for(Stockinfo in this.StockInfos)
        {
            if(Stockinfo.ItemID == ItemID)
                StockIDs.push(ItemID);
        }
        return StockIDs;
    }
    //���ݹ���ɸѡ
    this.GetIDsBySupplierID = function (SupplierID)
    {
        var StockIDs = {};
        var ItemID = -1;
        for(ItemInfo in ItemInfos)
        {
            if(ItemInfo.SupplierID == SupplierID)
                ItemID = ItemInfo.ID;
        }
        for(Stockinfo in this.StockInfos)
        {
            if(Stockinfo.ItemID == ItemID)
                StockIDs.push(ItemID);
        }
        return StockIDs;
    }
    //���ݻ���ɸѡ
    this.GetIDsByShelfID = function (ShelfID)
    {
        var StockIDs = {};
        for(Stockinfo in this.StockInfos)
        {
            if(Stockinfo.ShelfID == ShelfID)
                StockIDs.push(ShelfID);
        }
        return StockIDs;
    }
	//�������ϱ�Ÿ���
    this.SetHighlightByItemID = function (ItemID)
    {
        var HighlightLayer1 = new BABYLON.HighlightLayer("hl1", scene);
        var HighlightLayer2 = new BABYLON.HighlightLayer("hl2", scene);

        this.StockInfos.forEach(function(StockInfo,i)
        {
            for(Mesh of StockInfo.Meshes)
            {
                HighlightLayer2.addMesh(Mesh, BABYLON.Color3.Green());
                HighlightLayer2.blurHorizontalSize = 0;
                HighlightLayer2.blurVerticalSize = 0;
                HighlightLayer2.innerGlow = false;
                HighlightLayer2.outerGlow = false;
            }
        });
        this.StockInfos.forEach(function(StockInfo,i)
        {
            if(StockInfo.ItemID === ItemID)
            {
				//console.log(ItemID);
                if(StockInfo.Meshes.length > 0)
                {
					//console.log("buganga");
                    StockInfo.Meshes.forEach(function(Mesh,i)
                    {
                        HighlightLayer1.addMesh(Mesh, BABYLON.Color3.Green());
                        HighlightLayer1.blurHorizontalSize = 0.5;
                        HighlightLayer1.blurVerticalSize = 0.5;
                        HighlightLayer1.outerGlow = false;
                        HighlightLayer1.innerGlow = true;
                    });
                }
				else
				{
					//console.log("ganga");
				}
            }
        });
    }

    //����Ӧ�̱�Ÿ���
    this.SetHighlightBySupplierID = function (SupplierID)
    {
        var HighlightLayer1 = new BABYLON.HighlightLayer("hl1", scene);
        var HighlightLayer2 = new BABYLON.HighlightLayer("hl2", scene);

        this.StockInfos.forEach(function(StockInfo,i)
        {
            for(Mesh of StockInfo.Meshes)
            {
                HighlightLayer2.addMesh(Mesh, BABYLON.Color3.Green());
                HighlightLayer2.blurHorizontalSize = 0;
                HighlightLayer2.blurVerticalSize = 0;
                HighlightLayer2.innerGlow = false;
                HighlightLayer2.outerGlow = false;
            }
        });
        for(let i = 0;i < this.StockInfos.length; i++)
        {
            let StockInfo = this.StockInfos[i];
            for(let j = 0; j < this.ItemInfos.length; j++)
            {
                let ItemInfo = this.ItemInfos[j];
                if(StockInfo.ItemID === ItemInfo.ID && ItemInfo.SupplierID === SupplierID)
                {
                    if(StockInfo.Meshes.length > 0)
                    {
                        StockInfo.Meshes.forEach(function(Mesh,i)
                        {
                            HighlightLayer1.addMesh(Mesh, BABYLON.Color3.Green());
                            HighlightLayer1.blurHorizontalSize = 0.5;
                            HighlightLayer1.blurVerticalSize = 0.5;
                            HighlightLayer1.outerGlow = false;
                            HighlightLayer1.innerGlow = true;
                        });
                    }
                }
            }
        }
    }
    //����ItemID��ȡType
    this.GetTypeByItemID = function (ItemID)
    {
        for(var index = 0; index < this.ItemInfos.length; index++)
        {
            if(this.ItemInfos[index].ID == ItemID)
                return this.ItemInfos[index].Type;
        }
        return -1;
    }
}
