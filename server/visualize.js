var scene, camera, renderer;
var geometry, material, mesh;
var drawData;
var currentLine = 0;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    geometry = new THREE.BoxGeometry( 500, 100, 200 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    //renderer.setSize( window.innerWidth, window.innerHeight );

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


    init();
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
