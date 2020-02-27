/**
 * @description web page interactive
 * @date 2020.2.21
 * @author 杯c咔+
 */


/**
 * @description init function for web page interative
 * @main
 *     it will be go to do some functions
 */

function interactiveInit() {
    oneKeyExpansionMenuBar();
    rendertimewrap();
    setFulButton();
}
interactiveInit();

/**
 * @description One key expansion menu bar
 * @main
 *     if the menu bar was show it will be hide
 *     else it will be shown
 *     and it will be changed the expansionButton backgroundImage depend on the statuis of menu bar 
 */
function oneKeyExpansionMenuBar() {
    document.getElementById("TelescopicButton").addEventListener("click", function () {
        if (document.getElementById("menu")) {
            if (document.getElementById("menu").style.width == "240px") {
                document.getElementById("menu").style.width = "60px";
                document.getElementById("TelescopicButton").setAttribute('src', "./assets/img/展开 (1).png");
            } else {
                document.getElementById("menu").style.width = "240px";
                document.getElementById("TelescopicButton").setAttribute('src', "./assets/img/收缩.png");

            }
        }

    })
}


/**
 * render time wrap
 */
function rendertimewrap(){
    let date=new Date();
    document.getElementById("dateTop").innerHTML=date.getFullYear()+"  /  "+(1+date.getMonth())+"  /  "+date.getDate();
    document.getElementById("dateButtom").innerHTML=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    setInterval(() => {
        let date=new Date();  
        document.getElementById("dateButtom").innerHTML=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    }, 1000);
}


/**
 * setfullScreen
 */
function setFullScreen(){
    document.getElementById("buttomButtom").style.display="none";
    document.getElementById("buttomTopLeft").style.display="none";
    document.getElementById("buttomTopRight").style.display="none";
    document.getElementById("ceisumMenuMain").style.display="flex";
}

/**
 * exitfullscreen
 */
function exitfullscreen(){
    document.getElementById("buttomButtom").style.display="flex";
    document.getElementById("buttomTopLeft").style.display="block";
    document.getElementById("buttomTopRight").style.display="block";
    document.getElementById("ceisumMenuMain").style.display="none";
}



function setFulButton(){
    let flag=false;
    document.getElementById("selectModel").addEventListener("click",function(){
        if(flag){
            setFullScreen();
            document.getElementById("selectModel").innerHTML="地图模式"

        }else{
            exitfullscreen()
            document.getElementById("selectModel").innerHTML="数据模式"

        }
        flag=!flag;
    })




    document.getElementById('TelescopicButton').addEventListener("click",function(){
        if(flag){
            layer.tips('我是另外一个tips，只不过我长得跟之前那位稍有些不一样。', '吸附元素选择器', {
                tips: [1, '#3595CC'],
                time: 4000
              });
            setFullScreen()
            setTimeout(() => {
            
            exitfullscreen();
                
            }, 400);
        }
        
    })


}



setFullScreen();