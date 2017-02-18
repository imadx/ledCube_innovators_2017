var simulatorWidth = $("#threeJS_Simulator").width();
var simulatorHeight = $("#threeJS_Simulator").height();

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, (simulatorWidth/simulatorHeight), 0.1, 1000 );
var renderer;
// if(simulatorMode == 1){
// 	renderer = new THREE.WebGLRenderer();
// }
renderer = new THREE.WebGLRenderer( { alpha: true } );




var spacing = 2;
var sphereScale = 0.6;
var timerCount = 0;
var timerInterval = 0.1; // seconds
var idleRotationAmount = 0.005;

// to track mouse movements
var mouseX = 1, mouseY = 1;
var last_mouseX = 1, last_mouseY = 1;
var xDif = 1, yDif = 1;

// to design patterns
var light_i = 1, light_j = 0, light_k = 0;
var currentIteration = 0;			// pattern iteration

var transformObject = new THREE.Group();
var circles = new THREE.Group();
var geometry = new THREE.SphereGeometry(sphereScale,7,7);

// UI controls
var mouseMove_enabled = true;

renderer.setSize( simulatorWidth, simulatorHeight );
document.getElementById('threeJS_Simulator').appendChild( renderer.domElement );

scene.fog = new THREE.Fog( 0x000000, 5, spacing * 5 + 10 );

for(var i=0; i<5; i++){
	for(var j=0; j<5; j++){
		for(var k=0; k<5; k++){
			var circle = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x333333 } ) );
			circle.position.x = i * spacing - spacing * 2;
			circle.position.y = -j * spacing + spacing * 2;
			circle.position.z = k * spacing - spacing * 2;
			circles.add(circle);
		}
	}
}

geometry_wireframe = new THREE.BoxGeometry( 8, 8, 8 );
material_wireframe = new THREE.MeshBasicMaterial( { color: 0xff0000} );

object_wireframe = new THREE.Mesh( geometry_wireframe, material_wireframe );
edges_wireframe = new THREE.EdgesHelper( object_wireframe, 0x224422 );


// circles.add( object_wireframe );
circles.add( edges_wireframe );

transformObject.add( circles );
scene.add( transformObject );


camera.position.z = 15;

// console.log(transformObject.children[0].children[0].material.color.getHex());

// direction = { 0:i , 1:j , 2:k }; id = {0,1,2}
// sample usage::  turnOnRow(0,2);
var turnOnRow = function(direction, id){	
	turnOffAll();

	for(var i=0; i<5; i++){
		for(var j=0; j<5; j++){
			for(var k=0; k<5; k++){
				var idx;
				if(direction == 0) idx = i*9 + j*5 + k;
				if(direction == 1) idx = j*9 + i*5 + j;
				if(direction == 2) idx = k*9 + j*5 + i;
				if(direction == 0 && ((idx%5)%id)==0) transformObject.children[0].children[idx].material.color.setHex(0xff3344);
				if(direction == 1 && ((idx%5)%id)==0) transformObject.children[0].children[idx].material.color.setHex(0xff3344);
				if(direction == 2 && ((idx%5)%id)==0) transformObject.children[0].children[idx].material.color.setHex(0xff3344);
			}
		}
	}
}
var turnOffAll = function(){
	for(var i=0; i<5; i++){
		for(var j=0; j<5; j++){
			for(var k=0; k<5; k++){
				var idx = i*25 + j*5 + k;
				transformObject.children[0].children[idx].material.color.setHex(0x333333);
			}
		}
	}
}
var turnOnAll = function(){
	for(var i=0; i<5; i++){
		for(var j=0; j<5; j++){
			for(var k=0; k<5; k++){
				var idx = i*25 + j*5 + k;
				transformObject.children[0].children[idx].material.color.setHex(0xff3344);
			}
		}
	}
}

	// get patterns from file saved as patternName.json
	var setPattern = function (id){
		if(id==0) {
			$("#patternId").text("Pattern 10");
			$(".patternItem").removeClass("active");
			$(".patternItem.pattern10").addClass("active");
			getJsonPattern("pattern" + 10);

		} else {
			$("#patternId").text("Pattern " + id);
			$(".patternItem").removeClass("active");
			$(".patternItem.pattern" + id).addClass("active");
			getJsonPattern("pattern" + id);
			// console.log("creating JSON pattern..");
		}

	}
var getJsonPattern = function(patternName){
	if(!_.isNil(app) && !_.isEmpty(app.world.patterns)){
		prepareJSONdata(app.world.patterns[_.replace(patternName,'pattern','')]);
		return;
	}
	$.getJSON("/patterns/"+patternName+".json", function(json) {
	// $.getJSON("pattern3.json", function(json) {
	    prepareJSONdata(json);
	});
}

var current_jsonPattern = [];
var current_jsonPattern_id = 0;
var jsonFile;

var playCurrentJsonPattern = function(){
	if(current_jsonPattern == undefined) {
		prepareJSONdata(jsonFile);
		return;
	}
	for(var i=0; i<125; i++){
		// console.log(current_jsonPattern[i]);
		if(current_jsonPattern[i+1] == 1) {
			transformObject.children[0].children[i].material.color.setHex(0xff3344);
		}
	}
	prepareJSONForNextIteration();
}

var prepareJSONdata = function(json){

	current_jsonPattern = json.pattern[current_jsonPattern_id++]
	if(current_jsonPattern_id >= json.length){
		current_jsonPattern_id = 0;
	}
	jsonFile = json;
}

var prepareJSONForNextIteration = function(){
	current_jsonPattern = Object.values(jsonFile.pattern)[current_jsonPattern_id++];
	if(current_jsonPattern_id >= jsonFile.length){
		current_jsonPattern_id = 0;
	}
}

var changeColor = function (){

	for(var i=0; i<5; i++){
		for(var j=0; j<5; j++){
			for(var k=0; k<5; k++){
				var idx = i*25 + j*5 + k;
				transformObject.children[0].children[idx].material.color.setHex(0x333333);
			}
		}
	}

	for(var i=0; i<5; i++){
		for(var j=0; j<5; j++){
			for(var k=0; k<5; k++){
				var idx = i*25 + j*5 + k;
				if(light_i == 1 && ((idx%5)==currentIteration)) transformObject.children[0].children[idx].material.color.setHex(0xff3344);
			}
		}
	}
	currentIteration++;
	if(currentIteration == 5){
		currentIteration = 0;
	}
}

var render = function () { 

	requestAnimationFrame( render );
	if(mouseMove_enabled){
		transformObject.children[0].rotation.x += idleRotationAmount + (last_mouseY - transformObject.children[0].rotation.x) * 0.2;
		transformObject.children[0].rotation.y += idleRotationAmount + (last_mouseX - transformObject.children[0].rotation.y) * 0.1;
	} else {
		transformObject.children[0].rotation.x += idleRotationAmount;
		transformObject.children[0].rotation.y += idleRotationAmount;
	}
	renderer.render(scene, camera);
	timerCount++;
	if(timerCount == timerInterval * 60){
		timerCount = 0;
		turnOffAll();
		playCurrentJsonPattern(); ///changeColor();
	}
	xDif = Math.abs((mouseX - last_mouseX));
	yDif = Math.abs((mouseY - last_mouseY));
	last_mouseX = mouseX * 0.005;
	last_mouseY = mouseY * 0.005;

};
render();
getJsonPattern("pattern1");

$(document).mousemove( function(e){
	mouseX = e.clientX;
	mouseY = e.clientY;
});
$(document).keyup( function(e){
	// console.log(e.keyCode);
	if(e.keyCode == 32){
		mouseMove_enabled = !mouseMove_enabled;
	} else if (e.keyCode >= 48 && e.keyCode <= 57){
		app.display_setPattern(e.keyCode - 48);
		setPattern(e.keyCode - 48);
	}
});