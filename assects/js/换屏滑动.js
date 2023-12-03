window.onload = function (){
    var content = document.querySelector("#content");
    var cList = document.querySelector("#content .list");
    var cLiNodes = document.querySelectorAll("#content .list > li");
    var head = document.querySelector("#head");
    var nList = document.querySelectorAll("#head .wrap .nav > li");
    var pList = document.querySelectorAll("#content .point > li");
    var now = 0;
    var timer = 0;
    var preIndex = 0;
    var iframe1 = document.getElementById('myIframe1');
    iframe1.contentWindow.location.reload();
    //var iframe = document.getElementById('myIframe');
    // var iframe1 = document.getElementById('myIframe1');
    // var iframe2 = document.getElementById('myIframe2');
    // var iframe3 = document.getElementById('myIframe3');
    //iframe.contentWindow.location.reload();
    // iframe1.contentWindow.location.reload();
    // iframe2.contentWindow.location.reload();
    // iframe3.contentWindow.location.reload();
    //鼠标滚轮
    if(content.addEventListener){
        content.addEventListener("DOMMouseScroll",function(ev){
            clearTimeout(timer);
            timer = setTimeout(function(){
                fn(ev);
            },200)
        });
    }
    content.onmousewheel = function(ev){
        clearTimeout(timer);
            timer=setTimeout(function(){
                    fn(ev);
                },200)
    };
    
    function fn(ev){
        ev = ev||event;
        var flag ="";
        if(ev.detail){
            flag = ev.detail>0?"down":"up";
        }else if(ev.wheelDelta){
            flag = ev.wheelDelta<0?"down":"up";
        }
        if((now==0&&flag=="up")||(now==cLiNodes.length-1&&flag=="down")){
                return;
        }
        preIndex =now;
        
        switch (flag){
            case "up":
                if(now>0){
                    now--;
                }
                move(now);
                break;
            case "down":
                if(now<cLiNodes.length-1){
                    now++;
                }
                move(now);
                break;
        }
        if(ev.preventDefault){
            ev.preventDefault();
        }
        
        return false;
    }
    
    //头部导航
    headBind();
    function headBind(){
        for (var i=0;i<nList.length;i++) {
            nList[i].index = i;
            nList[i].onclick = function(){
                preIndex =now;
                move(this.index);
                now = this.index;
            }
        }
        for (var i=0;i<pList.length;i++) {
            pList[i].index = i;
            pList[i].onclick = function(){
                preIndex =now;
                move(this.index);
                now = this.index;
            }
        }
    }
    
    //同步主导航及侧边导航
    function move(index){
        for(var i=0;i<nList.length;i++){
            nList[i].className = "";
        }
        nList[index].className = "active";
        for(var i=0;i<pList.length;i++){
            pList[i].className = "";
        }
        pList[index].className = "active";
        cList.style.top = -index *(document.documentElement.clientHeight - head.offsetHeight) + "px";
        //出入场逻辑
        if(animationAttr[index]&&animationAttr[index]["inAn"]){
            animationAttr[index]["inAn"]();
        }
        if(animationAttr[preIndex]&&animationAttr[preIndex]["outAn"]){
            animationAttr[preIndex]["outAn"]();
        }
    }
    
    //窗口重置
    window.onresize = function (){
        contentBind();
    }
    //内容区的高度 
    contentBind();
    function contentBind(){
        content.style.height = document.documentElement.clientHeight - head.offsetHeight + "px";
        for(var i=0;i<cLiNodes.length;i++){
            cLiNodes[i].style.height = document.documentElement.clientHeight - head.offsetHeight + "px";
        }
    }
}