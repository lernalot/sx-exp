h5实现动画：
   实现动画此处用了easel.js框架先上index代码：
   <!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <script src="easeljs-0.8.1.min.js"></script>
</head>
<body>
    <canvas id="canvas" width="1300px" height="800px" style="background-color:#ffbfc7"></canvas>
    <script src="app.js"></script>
</body>
</html>

代码中可以看到，引用了easel.js文件，然后引入的app.js文件记录了动画的过程以及行为。

先上spp.js代码：

/**
 * Created by hzaoyou on 2015/6/10.
 */
var canvas;
var stage;
var img = new Image();
var sprite;

window.onload = function(){
    canvas = document.getElementById("canvas");
    stage =new createjs.Stage(canvas);

    stage.addEventListener("stagemousedown",clickCanvas);
    stage.addEventListener("stagemousemove",moveCanvas);

    var data={
        images:["2.png"],
        frames:{width:20,height:20,regX:10,regY:10}
    }

        sprite = new createjs.Sprite(new createjs.SpriteSheet(data));//可以用animation实现动画
       //Ticker类，另一种使得动画动起来的机制，
       //Ticker的几个关键方法，setFPS、getFPS设置和获取帧频，setInterval、getInterval设置和获取时间间隔
       // 当我们使用 Ticker.addListener  方法时，节拍器会有节奏的触发第一个参数的  tick  函数(默认是20帧/秒)，而 stage  对象刚好有一个默认函数  Stage.prototype.tick ，会把舞台中的所有动画元素向前播放一帧。
        createjs.Ticker.addEventListener("tick",tick); //
        createjs.Ticker.setFPS(20);
}

function tick(e){
    var t = stage.getNumChildren();
    for(var i = t-1;i>0;i--){
        var s = stage.getChildAt(i);

        s.vY +=2;
        s.vX +=1;
        s.x += s.vX;
        s.y += s.vY;

        s.scaleX = s.scaleY =s.scaleX+ s.vS;
        s.alpha += s.vA;

        if(s.alpha <= 0 || s.y >canvas.height){
            stage.removeChildAt(i);
        }
    }
    stage.update(e);
}

function clickCanvas(e){
    addS(Math.random()*200 +100,stage.mouseX,stage.mouseY,2);
}
function moveCanvas(e){
    addS(Math.random()*2 +1,stage.mouseX,stage.mouseY,1);
}
function addS(count,x,y,speed){
    for(i=0;i<count;i++){
        var s = sprite.clone();//得到sprite的每一个实例对象（散列的图片）
        s.x=x;
        s.y=y;
        s.alpha=Math.random()*0.5+0.5;
        s.scaleX=s.scaleY=Math.random() +0.5;
        var a =Math.PI*2*Math.random();
        var v = (Math.random()-0.5)*30*speed;//speed决定鼠标是移动时候的speed还是点击事件触发的speed
        s.vX = Math.cos(a)*v;
        s.vY = Math.sin(a)*v;
        s.vS = (Math.random()-0.5)*0.2;//scale
        s.vA = -Math.random() *0.05 -0.01;//alpha
        stage.addChild(s);
    }
}


    动画过程相当于一帧帧图片组成的，sprite类可以调用sprite sheet函数，而如代码40行可以看到调用方法，动画是
一帧帧图片组成的，data里定义了动画的图片和图片的宽度，regx代表下一帧图片相对于原始位置的x方向偏移，regy以此
类推，然而easel.js提供了ticker class接口，45行代码定义动画帧频，44行代码采用事件监听，tick函数里记录了动画的
过程，比如图片的大小速度透明度的变化。
   我们的用户行为有两种，鼠标滑过，鼠标点击，于是给用户行为绑定了两个监听事件，事件函数调用了addS的函数，add
函数定义了图片的速度，位移，图片变化的scale和透明度，注意到76行，这里的clone方法，表示把sprite里面的每一个组成
动画的过程中的图片对象调用在addS函数里，代表每一帧的图片对象，接下来看tick函数，函数里写了动画的变化过程，用到
了addS函数里面定义的参数，函数定义了图片坐标的变化，速度透明度范围的变化。
