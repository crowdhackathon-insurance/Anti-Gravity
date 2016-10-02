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

    var directionalLight = new THREE.DirectionalLight( 0xb8b8b8 );
    directionalLight.position.set( 1, 1, 1 ).normalize();
    directionalLight.intensity = 1.0;
    scene.add( directionalLight );
    directionalLight = new THREE.DirectionalLight( 0xb8b8b8 );
    directionalLight.position.set( - 1, 0.6, 0.5 ).normalize();
    directionalLight.intensity = 0.5;
    scene.add( directionalLight );
    directionalLight = new THREE.DirectionalLight();
    directionalLight.position.set( - 0.3, 0.6, - 0.8 ).normalize( 0xb8b8b8 );
    directionalLight.intensity = 0.45;
    scene.add( directionalLight );

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
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );
				// camera
				camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.set( 15, 20, 30 );
				scene.add( camera );
				// controls
				controls = new THREE.OrbitControls( camera, renderer.domElement );
				controls.minDistance = 20;
				controls.maxDistance = 50;
				controls.maxPolarAngle = Math.PI / 2;
				scene.add( new THREE.AmbientLight( 0x222222 ) );
				var light = new THREE.PointLight( 0xffffff, 1 );
				camera.add( light );
				scene.add( new THREE.AxisHelper( 20 ) );
				//
				var loader = new THREE.TextureLoader();
				var texture = loader.load( 'textures/sprites/disc.png' );
				group = new THREE.Group();
				scene.add( group );
				// points
				var pointsGeometry = new THREE.DodecahedronGeometry( 10 );
				for ( var i = 0; i < pointsGeometry.vertices.length; i ++ ) {
					//pointsGeometry.vertices[ i ].add( randomPoint().multiplyScalar( 2 ) ); // wiggle the points
				}
				var pointsMaterial = new THREE.PointsMaterial( {
					color: 0x0080ff,
					map: texture,
					size: 1,
					alphaTest: 0.5
				} );
				var points = new THREE.Points( pointsGeometry, pointsMaterial );
				group.add( points );
				// convex hull
				var meshMaterial = new THREE.MeshLambertMaterial( {
					color: 0xffffff,
					opacity: 0.5,
					transparent: true
				} );
				var meshGeometry = new THREE.ConvexGeometry( pointsGeometry.vertices );
				mesh = new THREE.Mesh( meshGeometry, meshMaterial );
				mesh.material.side = THREE.BackSide; // back faces
				mesh.renderOrder = 0;
				group.add( mesh );
				mesh = new THREE.Mesh( meshGeometry, meshMaterial.clone() );
				mesh.material.side = THREE.FrontSide; // front faces
				mesh.renderOrder = 1;
				group.add( mesh );
				//
				window.addEventListener( 'resize', onWindowResize, false );

}
