var T = {
    n: null,
    s: new Date,
    f: 1,
    t: new Date,
    Timer: function () {
        T.t = new Date(T.t.getTime() + T.f * ((new Date).getTime() - T.s.getTime()));
	var minutsecond = T.t.toLocaleTimeString().split(':');
	
        document.getElementById('time').innerHTML = minutsecond[1]+':'+minutsecond[2];
	if (minutsecond[1]=="00" && minutsecond[2]=="00")   return;
  
        T.s = new Date;
        T.n = setTimeout(function () {
            T.Timer()
        }, 500)
    },
    Pause: function () {
        T.s ? (clearTimeout(T.n), T.s = "") : (T.s = new Date, T.Timer())
    },
    BackTimer: function () {
        clearTimeout(T.n);
        T.f = -T.f;
        T.s = new Date;
        T.Timer()
    },
    Set: function () {
	var c = document.getElementById("time").innerHTML,
  	    b = c.split(':'),
            a = (b[0]*60+b[1]*1);
        T.t.setHours(0, 0, a, 0);
	
	var minutsecond = T.t.toLocaleTimeString().split(':');
        document.getElementById('time').innerHTML = minutsecond[1]+':'+minutsecond[2];
	
    }
}

var myGamePiece;
var myBackground;
var masplayer =[],masplayerleft=[],masplayerright=[];
var framesa = 0;
var animframe ="standart";
var spacekey=false,bulfly=true;
document.addEventListener("keydown", checkKeyDown);
document.addEventListener("keyup", checkKeyUp);
var bulet = [];
var masrokcs =[[],[],[],[]];
var rocksobj=[];
var lives = 5,score=0;
function loadgame(imag)
{
if (imag=="player")
{
	for (var i=0;i<16;i++)
		masplayer.push("Player/player00"+(i<10?"0"+i:i)+".png");
	for (var i=16;i<32;i++)
		masplayerleft.push("Player/player00"+i+".png");	
	for (var i=32;i<48;i++)
		masplayerright.push("Player/player00"+i+".png");
	for (var i=0;i<16;i++){
		masrokcs[0][i]="Rocks/rock_type_A00"+(i<10?"0"+i:i)+".png";
		masrokcs[1][i]="Rocks/rock_type_B00"+(i<10?"0"+i:i)+".png";
		masrokcs[2][i]="Rocks/rock_type_C00"+(i<10?"0"+i:i)+".png";
		masrokcs[3][i]="Rocks/rock_type_D00"+(i<10?"0"+i:i)+".png";
	}	
}	
}
var maximageh = getmaximageheight();
var maximagew = getmaximagewidth();
function getmaximageheight(){
	var max=0;
	var img=new Image();
	for (var i=0;i<masrokcs.length;i++){
	img.src="Rocks/rock_type_"+String.fromCharCode('A'.charCodeAt(0)+i)+"0000.png";
	if (max<img.height) max=img.height;
	}
	maximageh = max;
}
function getmaximagewidth(){
	var max=0;
	var img=new Image();
	for (var i=0;i<masrokcs.length;i++){
	img.src="Rocks/rock_type_"+String.fromCharCode('A'.charCodeAt(0)+i)+"0000.png";
	if (max<img.width) max=img.width;
	}
	maximagew = max;
}

function getimageanimate(imag,i)
{
var img = new Image();
if (imag=="player")
{
	switch (animframe)
	{
	case "standart":
		img.src = masplayer[i];
		break;
	case "up":
		img.src = masplayer[i];
		break;
	case "down":
		img.src = masplayer[i];
		break;
	case "left":
		img.src = masplayerleft[i];	
		break;
	case "right":
		img.src = masplayerright[i];
		break;
	}
} 
	
	return img;
}

function startGame() {
	loadgame("player");
	getmaximageheight();
	getmaximagewidth();
    myGamePiece = new component(100, 100, "Player/player0000.png", 10, 120, "image");
    myBackground = new component(800, 600, "background.jpg", 0, 0, "background");
    myGameArea.start();
	generaterocks();
	
	
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
		this.canvas.setAttribute('id', 'canvgame');
        document.body.insertBefore(this.canvas, document.body.childNodes[6]);//
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}


function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
		 this.image.src = color;
		
		}
    
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
	
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image" || type == "background") {	
		if (type == "image") {framesa==15 ? framesa=0 : framesa++;
		//стрельба
		if (spacekey && bulfly)
		{
		bulet.unshift({x:this.x,y:this.y,shipw:this.width,shiph:this.height,shipx:0,shipy:0});
		bulet[0].shipx=bulet[0].x+bulet[0].shipw;
	    bulet[0].shipy=bulet[0].y+bulet[0].shiph/2;	
		bulfly=false;
		var timerr=setTimeout(function(){bulfly=true;
		clearTimeout(timerr);},1000);
		}
		//проверка на столкновение с астеройдом
		var middlex = this.x+this.width;
		for (var k3=0;k3<rocksobj.length;k3++)
		{
		if (rocksobj[k3]!=null){
				if (middlex>rocksobj[k3].x-10 && middlex<(rocksobj[k3].x+maximagew))
				{
				if (
				(this.y>rocksobj[k3].y && this.y<(rocksobj[k3].y+maximageh))||
				((this.y+Math.round(this.height/2))>rocksobj[k3].y && (this.y+Math.round(this.height/2))<(rocksobj[k3].y+maximageh))||
				((this.y+this.height)>rocksobj[k3].y && (this.y+this.height)<(rocksobj[k3].y+maximageh))
				)
				{
						delete rocksobj[k3];
						lives--;
						//alert(lives);
						break;
					}
		}
		}
		}
		
		};	
            ctx.drawImage((type=="image"?(this.image = getimageanimate("player",framesa)):this.image), 
                this.x, 
                this.y,
			this.width, this.height);
		
        if (type == "background") {
            ctx.drawImage(this.image, 
                this.x + this.width, 
                this.y,
                this.width, this.height);
        }
        } else {
			
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
	
    this.newPos = function() {
		if (this.type == "background" ||((this.x < document.getElementById("canvgame").width-90 || animframe =="down") && (this.x>0 || animframe =="up")))
        this.x += this.speedX;
		if ((this.y < document.getElementById("canvgame").height-90 || animframe =="left") && (this.y>0 || animframe =="right"))
        this.y += this.speedY;
        if (this.type == "background") {
            if (this.x == -(this.width)) {
                this.x = 0;
            }
        }
    }    
}

function fbullet(){
	var canvas = document.getElementById("canvgame"),
		ctx=canvas.getContext("2d");
	for (var i=0;i<bulet.length;i++)
	{
	if (bulet[i] !=null) {
	ctx.beginPath();
	ctx.fillStyle = "rgb(255,0,0)";	
	bulet[i].shipx+=8;
	ctx.arc(bulet[i].shipx,bulet[i].shipy,3,0,2*Math.PI,false);
	ctx.fill();
	if (bulet[i].shipx>canvas.width) bulet.pop();
	} else if (i==0) bulet.shift();
	}
	}
function updateGameArea() {
    myGameArea.clear();
	
    myBackground.speedX = -1;
    myBackground.newPos();    
    myBackground.update();
	rocks();
    myGamePiece.newPos();    
    myGamePiece.update();
	if (bulet.length >0) {fbullet();collision();}
	
}
var rocksi = 0;
var timerrocks = setInterval(function(){rocksi<15?rocksi++:rocksi=0},200);

var timegenerate =setInterval(function(){
	generaterocks();
	},1500);	
function generaterocks(){
	var canvas = document.getElementById("canvgame"),
		ctx=canvas.getContext("2d");
	var countrocks = new Array(Math.floor(canvas.height/(maximageh+10)));
	
	for (var i=0;i<countrocks.length;i++)
		countrocks[i]=Math.floor(Math.random() * 5);

	var xx = canvas.width + maximagew*2;
	var img = new Image();
	for (var i=0;i<countrocks.length;i++){
	if (countrocks[i]==1){
	var randnumb=Math.floor(Math.random() * masrokcs.length);	
	rocksobj.push({x: xx,y: (i+1)*maximageh,framee:randnumb});
	}
	}
}

var speedx = 20;
var timemove =setInterval(function(){
	for (var k=0;k<rocksobj.length;k++){
		if (rocksobj[k]!=null)
		{
	rocksobj[k].x -= speedx;
	if (rocksobj[k].x<0) rocksobj.shift();
	
	
		}
	}
	},300);

function collision(){
	top2:
	for (var k=0;k<rocksobj.length;k++){
			for (var k2=0;k2<bulet.length;k2++){
				if (bulet[k2]!=null && rocksobj[k]!=null){
				if (bulet[k2].shipx>rocksobj[k].x && bulet[k2].shipx<rocksobj[k].x+maximagew){
				if (bulet[k2].shipy>rocksobj[k].y && bulet[k2].shipy<rocksobj[k].y+maximageh)
					{
						delete bulet[k2];
						delete rocksobj[k];
						score+=7;
						break top2;
					}
		}
		}
			}
		}
}
function rocks(){
	var canvas = document.getElementById("canvgame"),
		ctx=canvas.getContext("2d");
		var img = new Image();
		
		
		
		for (var i=0;i<rocksobj.length;i++)
		{
		if (rocksobj[i] != null)
			{
		img.src = masrokcs[rocksobj[i].framee][rocksi];
		ctx.drawImage(img,rocksobj[i].x,rocksobj[i].y,64,64);
			} else if (i==0) rocksobj.shift(); 
		
		}
}
function checkKeyDown(e) {
	var keyChar = String.fromCharCode(e.keyCode || e.which);

			if (keyChar == "W" )
			{
				animframe ="left";
				myGamePiece.speedY = -6; 
				e.preventDefault();
			}
			if (keyChar == "S" )
			{
				animframe ="right";
				myGamePiece.speedY = 6; 
				e.preventDefault();	
			}
			if (keyChar == "D")
			{
				animframe ="up";
				myGamePiece.speedX = 6; 
				e.preventDefault();	
			}
			if (keyChar == "A")
			{
				animframe ="down";
				myGamePiece.speedX = -6; 
				e.preventDefault();	
			}
			if (e.keyCode == 32)
			{
			spacekey = true;
				e.preventDefault();	
			}
			
}
function checkKeyUp(e)
		{
			  var  keyChar = String.fromCharCode(e.keyCode || e.which);

			if (keyChar == "W" || keyChar == "S" || keyChar == "D" || keyChar == "A")
			{
				animframe ="standart";
				clearmove();
				e.preventDefault();
			}
			if (e.keyCode == 32)
			{
				spacekey = false;
				e.preventDefault();	
			}
			
		}
function clearmove() {
    myGamePiece.speedX = 0; 
    myGamePiece.speedY = 0; 
}

