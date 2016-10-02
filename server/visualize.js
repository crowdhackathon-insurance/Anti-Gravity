var scene, camera, renderer;
var geometry, material, mesh;
var drawData;
var currentLine = 0;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 7, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 100;

    geometry = new THREE.BoxGeometry( 500, 100, 200 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    var planeW = 50; // pixels
    var planeH = 50; // pixels
    var numW = 50; // how many wide (50*50 = 2500 pixels wide)
    var numH = 50; // how many tall (50*50 = 2500 pixels tall)
    var plane = new THREE.Mesh(
        new THREE.PlaneGeometry( planeW*numW, planeH*numH, planeW, planeH ),
        new THREE.MeshBasicMaterial( {
            color: 0x000000,
            wireframe: true
        } )
    );

    scene.add(plane);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( 500, 500 );

    $("#webgl-cointainer").append( renderer.domElement );
}

function animate() {
    setTimeout( function() {
            requestAnimationFrame( animate );
        }, 10000 / 30 );

    if (currentLine < drawData.length - 1) {
        currentLine++;
        mesh.rotation.x = drawData[currentLine][0];
        mesh.rotation.y = drawData[currentLine][1];
        mesh.rotation.z = drawData[currentLine][2];
    }
    renderer.render( scene, camera );
}

getData();
function getData() {
    readTextFile("output");

    //Hide loading bar


    init2();
    animate();
}

function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if(rawFile.status === 200 || rawFile.status == 0) {

                var str = rawFile.responseText;
                var res = str.split("\n");
                var allDataArray = [];
                for (row in res) {
                    var rowData = res[row].split(":");
                    allDataArray[row] = rowData;
                }
                drawData = allDataArray;
                console.log(allDataArray);
                return rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
}

function init2() {
    scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(500, 500);

    $("#webgl-cointainer").append( renderer.domElement );

	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 15, 20, 30 );
	scene.add( camera );
				// controls
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.minDistance = 20;
	controls.maxDistance = 150;
	controls.maxPolarAngle = Math.PI / 2;
	scene.add( new THREE.AmbientLight( 0x222222 ) );
	var light = new THREE.PointLight( 0xffffff, 1 );
	camera.add( light );
	scene.add( new THREE.AxisHelper( 20 ) );

    //group = new THREE.Group();
	//scene.add( group );
    geometry = new THREE.BoxGeometry( 5, 2, 2 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    mesh = new THREE.Mesh( geometry, material );
    scene.add(mesh);


}
