// Gregory Zacharko
// Intro to Computer Graphics
// Professor Rabbitz
// Spring 2022 Semester
// 5/4/2022
// Project 5: Final Project

// Some Global Variables
var program;
var canvas;
var gl;

// Arrays
var boardCubesBlack = [];
var pointsArray_BoardBlack = [];
var normalsArray_BoardBlack = [];

var boardCubesWhite = [];
var pointsArray_BoardWhite = [];
var normalsArray_BoardWhite = [];

var greenCheckers = [];
var pointsArray_CheckGreen = [];
var normalsArray_CheckGreen = [];

var redCheckers = [];
var pointsArray_CheckRed = [];
var normalsArray_CheckRed = [];
//                        0            3
//                          __________
//                        /|         /|                      
//                       / |        / |                      
//                      /  |     2 /  |
//                   1 /___|______/   |                   y
//                     |   |      |   |                   |
//                     |   | 4    |   |                   |
//                     |   /------|---| 7                 |
//                     |  /       |  /                    |_______ x
//                     | /        | /                    /
//                     |/_________|/                    /
//                    5             6                  /
//                                                    z
//

// View Projection Variables
var aspect = 1.0;
var near = -5;
var far = 5;
var yaw = 0.0;
var pitch = 0.0;
var eyeRange = 12.0;
var dr = 0.5;          // Degree Step

var modelViewMatrix, projectionMatrix, normalMatrix;
var modelViewMatrixLoc, projectionMatrixLoc, normalMatrixLoc;

const at = vec3(0.0, 0.0, -2.0);
const up = vec3(0.0, 1.0, 0.0);

// Define Callback Function for window.onload
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );     // Get HTML Canvas
    gl = canvas.getContext('webgl2');                    // Get a WebGL 2.0 context
    if ( !gl ) { alert( "WebGL isn't available" ); }     // Error Message

    gl.viewport(0, 0, canvas.width, canvas.height);
    aspect = canvas.width / canvas.height;               // Get the Aspect Ratio of the Canvas
    gl.clearColor( 0.4, 0.4, 0.8, 1.0 );                 // Set Background Color of Viewport (Clear Color)

    gl.enable(gl.DEPTH_TEST);   // Hidden Surface Removal via the z-buffer

    // Load Shaders and Initialize Attribute Buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    // Construct the Checkerboard and Pieces
    constructCheckerboardBlack();           // Black Spaces
    constructCheckerboardWhite();           // White Spaces
    constructGreenPieces();                 // Green Pieces
    constructRedPieces();                   // Red Pieces

    // Get Uniform Matrix Locations
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    invProjectionMatrixLoc = gl.getUniformLocation( program, "invProjectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );

    render();
};

// Controls the Green Pieces Menu
var m1 = document.getElementById("greenMenu");

// Controls the Red Pieces Menu
var m2 = document.getElementById("redMenu");

// Callback Function for Keydown Events; Registers Function dealWithKeyboard
window.addEventListener("keydown", dealWithKeyboard, false);

// Function that Gets Called to Parse Keydown Events
function dealWithKeyboard(e) {
    switch (e.keyCode) {
        case 37: // Left Arrow; Sweep Left
            { yaw += dr * 20; }
        break;
        case 39: // Right Arrow; Sweep Right
            { yaw -= dr * 20; }
        break;
        case 38: // Up Arrow; Sweep Up
            { pitch += dr * 20; }
        break;
        case 40: // Down Arrow; Sweep Down
            { pitch -= dr * 20; }
        break;
        case 65: // 'A' Key; Move Selected Green Piece Left 1 Space
            {
                if(m1.selectedIndex >= 0 && m1.selectedIndex <= 11)
                {
                    greenCheckers[m1.selectedIndex].translate(-1.1, 0.0, 0.0);
                }
                else    // Don't Move if the "Stop Movement" Menu Item is Selected
                {
                    greenCheckers[m1.selectedIndex].translate(0.0, 0.0, 0.0);
                }
            }
        break;
        case 68: // 'D' Key; Move Selected Green Piece Right 1 Space
            {
                if(m1.selectedIndex >= 0 && m1.selectedIndex <= 11)
                {
                    greenCheckers[m1.selectedIndex].translate(1.1, 0.0, 0.0);
                }
                else    // Don't Move if the "Stop Movement" Menu Item is Selected
                {
                    greenCheckers[m1.selectedIndex].translate(0.0, 0.0, 0.0);
                }
            }
        break;
        case 87: // 'W' Key; Move Selected Green Piece Up 1 Space
            {
                if(m1.selectedIndex >= 0 && m1.selectedIndex <= 11)
                {
                    greenCheckers[m1.selectedIndex].translate(0.0, 0.0, -1.1);
                }
                else    // Don't Move if the "Stop Movement" Menu Item is Selected
                {
                    greenCheckers[m1.selectedIndex].translate(0.0, 0.0, 0.0);
                }
            }
        break;
        case 83: // 'S' Key; Move Selected Green Piece Down 1 Space
            {
                if(m1.selectedIndex >= 0 && m1.selectedIndex <= 11)
                {
                    greenCheckers[m1.selectedIndex].translate(0.0, 0.0, 1.1);
                }
                else    // Don't Move if the "Stop Movement" Menu Item is Selected
                {
                    greenCheckers[m1.selectedIndex].translate(0.0, 0.0, 0.0);
                }
            }
        break;
        case 81: // 'Q' Key; Move Selected Green Piece Diagonally NW 1 Space
            {
                if(m1.selectedIndex >= 0 && m1.selectedIndex <= 11)
                {
                    greenCheckers[m1.selectedIndex].translate(-1.1, 0.0, -1.1);
                }
                else    // Don't Move if the "Stop Movement" Menu Item is Selected
                {
                    greenCheckers[m1.selectedIndex].translate(0.0, 0.0, 0.0);
                }
            }
        break;
        case 69: // 'E' Key; Move Selected Green Piece Diagonally NE 1 Space
            {
                if(m1.selectedIndex >= 0 && m1.selectedIndex <= 11)
                {
                    greenCheckers[m1.selectedIndex].translate(1.1, 0.0, -1.1);
                }
                else    // Don't Move if the "Stop Movement" Menu Item is Selected
                {
                    greenCheckers[m1.selectedIndex].translate(0.0, 0.0, 0.0);
                }
            }
        break;
        case 90: // 'Z' Key; Move Selected Green Piece Diagonally SW 1 Space
            {
                if(m1.selectedIndex >= 0 && m1.selectedIndex <= 11)
                {
                    greenCheckers[m1.selectedIndex].translate(-1.1, 0.0, 1.1);
                }
                else    // Don't Move if the "Stop Movement" Menu Item is Selected
                {
                    greenCheckers[m1.selectedIndex].translate(0.0, 0.0, 0.0);
                }
            }
        break;
        case 67: // 'C' Key; Move Selected Green Piece Diagonally SE 1 Space
            {
                if(m1.selectedIndex >= 0 && m1.selectedIndex <= 11)
                {
                    greenCheckers[m1.selectedIndex].translate(1.1, 0.0, 1.1);
                }
                else    // Don't Move if the "Stop Movement" Menu Item is Selected
                {
                    greenCheckers[m1.selectedIndex].translate(0.0, 0.0, 0.0);
                }
            }
        break;
        case 74: // 'J' Key; Move Selected Red Piece Left 1 Space
            {
                if(m2.selectedIndex >= 0 && m2.selectedIndex <= 11)
                {
                    redCheckers[m2.selectedIndex].translate(1.1, 0.0, 0.0);
                }
                else    // Don't Move if the "Stop Movement" Menu Item is Selected
                {
                    redCheckers[m2.selectedIndex].translate(0.0, 0.0, 0.0);
                }
            }
        break;
        case 76: // 'L' Key; Move Selected Red Piece Right 1 Space
            {
                if(m2.selectedIndex >= 0 && m2.selectedIndex <= 11)
                {
                    redCheckers[m2.selectedIndex].translate(-1.1, 0.0, 0.0);
                }
                else    // Don't Move if the "Stop Movement" Menu Item is Selected
                {
                    redCheckers[m2.selectedIndex].translate(0.0, 0.0, 0.0);
                }
            }
        break;
        case 73: // 'I' Key; Move Selected Red Piece Up 1 Space
            {
                if(m2.selectedIndex >= 0 && m2.selectedIndex <= 11)
                {
                    redCheckers[m2.selectedIndex].translate(0.0, 0.0, 1.1);
                }
                else    // Don't Move if the "Stop Movement" Menu Item is Selected
                {
                    redCheckers[m2.selectedIndex].translate(0.0, 0.0, 0.0);
                }
            }
        break;
        case 75: // 'K' Key; Move Selected Red Piece Down 1 Space
            {
                if(m2.selectedIndex >= 0 && m2.selectedIndex <= 11)
                {
                    redCheckers[m2.selectedIndex].translate(0.0, 0.0, -1.1);
                }
                else    // Don't Move if the "Stop Movement" Menu Item is Selected
                {
                    redCheckers[m2.selectedIndex].translate(0.0, 0.0, 0.0);
                }
            }
        break;
        case 85: // 'U' Key; Move Selected Red Piece Diagonally NW 1 Space
            {
                if(m2.selectedIndex >= 0 && m2.selectedIndex <= 11)
                {
                    redCheckers[m2.selectedIndex].translate(1.1, 0.0, 1.1);
                }
                else    // Don't Move if the "Stop Movement" Menu Item is Selected
                {
                    redCheckers[m2.selectedIndex].translate(0.0, 0.0, 0.0);
                }
            }
        break;
        case 79: // 'O' Key; Move Selected Red Piece Diagonally NE 1 Space
            {
                if(m2.selectedIndex >= 0 && m2.selectedIndex <= 11)
                {
                    redCheckers[m2.selectedIndex].translate(-1.1, 0.0, 1.1);
                }
                else    // Don't Move if the "Stop Movement" Menu Item is Selected
                {
                    redCheckers[m2.selectedIndex].translate(0.0, 0.0, 0.0);
                }
            }
        break;
        case 78: // 'N' Key; Move Selected Red Piece Diagonally SW 1 Space
            {
                if(m2.selectedIndex >= 0 && m2.selectedIndex <= 11)
                {
                    redCheckers[m2.selectedIndex].translate(1.1, 0.0, -1.1);
                }
                else    // Don't Move if the "Stop Movement" Menu Item is Selected
                {
                    redCheckers[m2.selectedIndex].translate(0.0, 0.0, 0.0);
                }
            }
        break;
        case 77: // 'M' Key; Move Selected Red Piece Diagonally SE 1 Space
            {
                if(m2.selectedIndex >= 0 && m2.selectedIndex <= 11)
                {
                    redCheckers[m2.selectedIndex].translate(-1.1, 0.0, -1.1);
                }
                else    // Don't Move if the "Stop Movement" Menu Item is Selected
                {
                    redCheckers[m2.selectedIndex].translate(0.0, 0.0, 0.0);
                }
            }
        break;
    }
};

// Buttons to Change Viewing Parameters
document.getElementById("SweepUp").onclick = function () { pitch += dr; };     // Sweep Up
document.getElementById("SweepDown").onclick = function() { pitch -= dr; };    // Sweep Down
document.getElementById("SweepRight").onclick = function() { yaw -= dr; };     // Sweep Right
document.getElementById("SweepLeft").onclick = function() { yaw += dr; };      // Sweep Left
document.getElementById("DollyOut").onclick = function() { eyeRange += dr; };  // Dolly Out

// Dolly In
document.getElementById("DollyIn").onclick = function ()
{
    if(eyeRange < 2.5)
    {
        eyeRange -= 0.1;
        eyeRange = (eyeRange < 0.1) ? 0.1 : eyeRange;
    }
    else
    {
        eyeRange -= 2.0;
    }
};

// Render Function
var render = function()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    v = vec4(0.0, 12.0, eyeRange, 1.0);        // Default Eye Vector
    R1 = rotate(pitch, vec3(1.0, 0.0, 0.0));  // Pitch About x-axis
    R2 = rotate(yaw, vec3(0.0, 1.0, 0.0));    // Yaw About y-axis
    R = mult(R1, R2);                         // Combine View Rotation Matricies Into One Matrix
    v = mult(R, v);                           // Multiply by the Default Eye Position to Get the Current Eye Position

    // Create Normal Matrix (Take Transpose of the Inverse of modelView 3 x 3 Sub-Matrix)
    // Inverse of R
    R1 = rotate(-pitch, vec3(1.0, 0.0, 0.0));   // Pitch About x-axis
    R2 = rotate(-yaw, vec3(0.0, 1.0, 0.0));     // Yaw About y-axis
    normalMatrix = mult(R2, R1);                // Inverse of 3 x 3 V-Matrix
    normalMatrix = transpose(normalMatrix);     // Followed by the Transpose
    
    modelViewMatrix = lookAt(vec3(v[0], v[1], v[2]), at , up);  // Call lookAt with Eye Postion
    projectionMatrix = perspective(45.0, aspect, 1, 1000);    // Set Up a Perspective Projection

    // Update modelView and Projection Matrices in Vertex Shader
    var invProjectionMatrix = inverse4(projectionMatrix);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(invProjectionMatrixLoc, false, flatten(invProjectionMatrix));
    gl.uniformMatrix4fv(normalMatrixLoc, false, flatten(normalMatrix));

    gl.uniform1f( gl.getUniformLocation( program, 'yaw' ),   -(yaw * 0.017453292) );
    gl.uniform1f( gl.getUniformLocation( program, 'pitch' ), -(pitch * 0.017453292) );

    // Light and Materials
    var myLight = whiteLight();
    var checkerboardMaterialBlack = blackPlasticMaterial();
    var checkerboardMaterialWhite = pearlMaterial();
    var greenCheckersMaterial = verySmoothGreenPlasticMaterial();
    var redCheckersMaterial = verySmoothRedPlasticMaterial();


    // Build the Black Spaces of the Checkerboard
    // Material Uniforms for the Black Checkerboard Spaces
    var ambientProductBoardBlack = mult(myLight.lightAmbient, checkerboardMaterialBlack.materialAmbient);
    var diffuseProductBoardBlack = mult(myLight.lightDiffuse, checkerboardMaterialBlack.materialDiffuse);
    var specularProductBoardBlack = mult(myLight.lightSpecular, checkerboardMaterialBlack.materialSpecular);
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), checkerboardMaterialBlack.materialShininess);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProductBoardBlack));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProductBoardBlack));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProductBoardBlack));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(myLight.lightPosition));
    
    // Push Normals to GPU
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray_BoardBlack), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vNormal);

    // Push Verticies to GPU
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray_BoardBlack), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vPosition);

    // Render the Black Checkerboard Spaces
    gl.drawArrays(gl.TRIANGLES, 0, pointsArray_BoardBlack.length);


    // Build the White Spaces of the Checkerboard
    // Material Uniforms for the White Checkerboard Spaces
    var ambientProductBoardWhite = mult(myLight.lightAmbient, checkerboardMaterialWhite.materialAmbient);
    var diffuseProductBoardWhite = mult(myLight.lightDiffuse, checkerboardMaterialWhite.materialDiffuse);
    var specularProductBoardWhite = mult(myLight.lightSpecular, checkerboardMaterialWhite.materialSpecular);
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), checkerboardMaterialWhite.materialShininess);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProductBoardWhite));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProductBoardWhite));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProductBoardWhite));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(myLight.lightPosition));

    // Push Normals to GPU
    var nBufferBW = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBufferBW );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray_BoardWhite), gl.STATIC_DRAW );

    var vNormalBW = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormalBW, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vNormalBW);

    // Push Verticies to GPU
    var vBufferBW = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferBW );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray_BoardWhite), gl.STATIC_DRAW );
    
    var vPositionBW = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPositionBW, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vPositionBW);

    // Render the White Checkerboard Spaces
    gl.drawArrays(gl.TRIANGLES, 0, pointsArray_BoardWhite.length);


    // Build the Green Checker Piece Objects
    // Material Uniforms for the Green Checker Piece Objects
    var ambientProductGreen = mult(myLight.lightAmbient, greenCheckersMaterial.materialAmbient);
    var diffuseProductGreen = mult(myLight.lightDiffuse, greenCheckersMaterial.materialDiffuse);
    var specularProductGreen = mult(myLight.lightSpecular, greenCheckersMaterial.materialSpecular);
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), greenCheckersMaterial.materialShininess);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProductGreen));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProductGreen));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProductGreen));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(myLight.lightPosition));

    // Push Normals to GPU
    var nBufferGP = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBufferGP );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray_CheckGreen), gl.STATIC_DRAW );

    var vNormalGP = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormalGP, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vNormalGP);

    // Push Verticies to GPU
    var vBufferGP = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferGP );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray_CheckGreen), gl.STATIC_DRAW );
    
    var vPositionGP = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPositionGP, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vPositionGP);

    // Render the Green Checker Piece Objects
    gl.drawArrays(gl.TRIANGLES, 0, pointsArray_CheckGreen.length);


    // Build the Red Checker Piece Objects
    // Material Uniforms for the Red Checker Piece Objects
    var ambientProductRed = mult(myLight.lightAmbient, redCheckersMaterial.materialAmbient);
    var diffuseProductRed = mult(myLight.lightDiffuse, redCheckersMaterial.materialDiffuse);
    var specularProductRed = mult(myLight.lightSpecular, redCheckersMaterial.materialSpecular);
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), redCheckersMaterial.materialShininess);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProductRed));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProductRed));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProductRed));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(myLight.lightPosition));

    // Push Normals to GPU
    var nBufferRP = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBufferRP );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray_CheckRed), gl.STATIC_DRAW );

    var vNormalRP = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormalRP, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vNormalRP);

    // Push Verticies to GPU
    var vBufferRP = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferRP );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray_CheckRed), gl.STATIC_DRAW );
    
    var vPositionRP = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPositionRP, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vPositionRP);

    // Render the Red Checker Piece Objects
    gl.drawArrays(gl.TRIANGLES, 0, pointsArray_CheckRed.length);
    

    requestAnimationFrame(render);
};

// Construct Black Checkerboard Spaces Function
function constructCheckerboardBlack()
{
    // Black Spaces
    // First Row
    // 0
    boardCubesBlack[0] = cube();
    boardCubesBlack[0].translate(-4.0, -2.0, 2.0);
    boardCubesBlack[0].scale(1.1, 1.1, 1.1);
    // 1
    boardCubesBlack[1] = cube();
    boardCubesBlack[1].translate(-2.0, -2.0, 2.0);
    boardCubesBlack[1].scale(1.1, 1.1, 1.1);
    // 2
    boardCubesBlack[2] = cube();
    boardCubesBlack[2].translate(0.0, -2.0, 2.0);
    boardCubesBlack[2].scale(1.1, 1.1, 1.1);
    // 3
    boardCubesBlack[3] = cube();
    boardCubesBlack[3].translate(2.0, -2.0, 2.0);
    boardCubesBlack[3].scale(1.1, 1.1, 1.1);
    // Second Row
    // 4
    boardCubesBlack[4] = cube();
    boardCubesBlack[4].translate(-3.0, -2.0, 1.0);
    boardCubesBlack[4].scale(1.1, 1.1, 1.1);
    // 5
    boardCubesBlack[5] = cube();
    boardCubesBlack[5].translate(-1.0, -2.0, 1.0);
    boardCubesBlack[5].scale(1.1, 1.1, 1.1);
    // 6
    boardCubesBlack[6] = cube();
    boardCubesBlack[6].translate(1.0, -2.0, 1.0);
    boardCubesBlack[6].scale(1.1, 1.1, 1.1);
    // 7
    boardCubesBlack[7] = cube();
    boardCubesBlack[7].translate(3.0, -2.0, 1.0);
    boardCubesBlack[7].scale(1.1, 1.1, 1.1);
    // Third Row
    // 8
    boardCubesBlack[8] = cube();
    boardCubesBlack[8].translate(-4.0, -2.0, 0.0);
    boardCubesBlack[8].scale(1.1, 1.1, 1.1);
    // 9
    boardCubesBlack[9] = cube();
    boardCubesBlack[9].translate(-2.0, -2.0, 0.0);
    boardCubesBlack[9].scale(1.1, 1.1, 1.1);
    // 10
    boardCubesBlack[10] = cube();
    boardCubesBlack[10].translate(0.0, -2.0, 0.0);
    boardCubesBlack[10].scale(1.1, 1.1, 1.1);
    // 11
    boardCubesBlack[11] = cube();
    boardCubesBlack[11].translate(2.0, -2.0, 0.0);
    boardCubesBlack[11].scale(1.1, 1.1, 1.1);
    // Fourth Row
    // 12
    boardCubesBlack[12] = cube();
    boardCubesBlack[12].translate(-3.0, -2.0, -1.0);
    boardCubesBlack[12].scale(1.1, 1.1, 1.1);
    // 13
    boardCubesBlack[13] = cube();
    boardCubesBlack[13].translate(-1.0, -2.0, -1.0);
    boardCubesBlack[13].scale(1.1, 1.1, 1.1);
    // 14
    boardCubesBlack[14] = cube();
    boardCubesBlack[14].translate(1.0, -2.0, -1.0);
    boardCubesBlack[14].scale(1.1, 1.1, 1.1);
    // 15
    boardCubesBlack[15] = cube();
    boardCubesBlack[15].translate(3.0, -2.0, -1.0);
    boardCubesBlack[15].scale(1.1, 1.1, 1.1);
    // Fifth Row
    // 16
    boardCubesBlack[16] = cube();
    boardCubesBlack[16].translate(-4.0, -2.0, -2.0);
    boardCubesBlack[16].scale(1.1, 1.1, 1.1);
    // 17
    boardCubesBlack[17] = cube();
    boardCubesBlack[17].translate(-2.0, -2.0, -2.0);
    boardCubesBlack[17].scale(1.1, 1.1, 1.1);
    // 18
    boardCubesBlack[18] = cube();
    boardCubesBlack[18].translate(0.0, -2.0, -2.0);
    boardCubesBlack[18].scale(1.1, 1.1, 1.1);
    // 19
    boardCubesBlack[19] = cube();
    boardCubesBlack[19].translate(2.0, -2.0, -2.0);
    boardCubesBlack[19].scale(1.1, 1.1, 1.1);
    // Sixth Row
    // 20
    boardCubesBlack[20] = cube();
    boardCubesBlack[20].translate(-3.0, -2.0, -3.0);
    boardCubesBlack[20].scale(1.1, 1.1, 1.1);
    // 21
    boardCubesBlack[21] = cube();
    boardCubesBlack[21].translate(-1.0, -2.0, -3.0);
    boardCubesBlack[21].scale(1.1, 1.1, 1.1);
    // 22
    boardCubesBlack[22] = cube();
    boardCubesBlack[22].translate(1.0, -2.0, -3.0);
    boardCubesBlack[22].scale(1.1, 1.1, 1.1);
    // 23
    boardCubesBlack[23] = cube();
    boardCubesBlack[23].translate(3.0, -2.0, -3.0);
    boardCubesBlack[23].scale(1.1, 1.1, 1.1);
    // Seventh Row
    // 24
    boardCubesBlack[24] = cube();
    boardCubesBlack[24].translate(-4.0, -2.0, -4.0);
    boardCubesBlack[24].scale(1.1, 1.1, 1.1);
    // 25
    boardCubesBlack[25] = cube();
    boardCubesBlack[25].translate(-2.0, -2.0, -4.0);
    boardCubesBlack[25].scale(1.1, 1.1, 1.1);
    // 26
    boardCubesBlack[26] = cube();
    boardCubesBlack[26].translate(0.0, -2.0, -4.0);
    boardCubesBlack[26].scale(1.1, 1.1, 1.1);
    // 27
    boardCubesBlack[27] = cube();
    boardCubesBlack[27].translate(2.0, -2.0, -4.0);
    boardCubesBlack[27].scale(1.1, 1.1, 1.1);
    // Eighth Row
    // 28
    boardCubesBlack[28] = cube();
    boardCubesBlack[28].translate(-3.0, -2.0, -5.0);
    boardCubesBlack[28].scale(1.1, 1.1, 1.1);
    // 29
    boardCubesBlack[29] = cube();
    boardCubesBlack[29].translate(-1.0, -2.0, -5.0);
    boardCubesBlack[29].scale(1.1, 1.1, 1.1);
    // 30
    boardCubesBlack[30] = cube();
    boardCubesBlack[30].translate(1.0, -2.0, -5.0);
    boardCubesBlack[30].scale(1.1, 1.1, 1.1);
    // 31
    boardCubesBlack[31] = cube();
    boardCubesBlack[31].translate(3.0, -2.0, -5.0);
    boardCubesBlack[31].scale(1.1, 1.1, 1.1);

    for (i = 0; i < boardCubesBlack.length; i++)
    {
        pointsArray_BoardBlack = pointsArray_BoardBlack.concat(boardCubesBlack[i].TriangleVertices);
        normalsArray_BoardBlack = normalsArray_BoardBlack.concat(boardCubesBlack[i].TriangleNormals);
    }
};

// Construct White Checkerboard Spaces Function
function constructCheckerboardWhite()
{
    // White Spaces
    // First Row
    // 0
    boardCubesWhite[0] = cube();
    boardCubesWhite[0].translate(-3.0, -2.0, 2.0);
    boardCubesWhite[0].scale(1.1, 1.1, 1.1);
    // 1
    boardCubesWhite[1] = cube();
    boardCubesWhite[1].translate(-1.0, -2.0, 2.0);
    boardCubesWhite[1].scale(1.1, 1.1, 1.1);
    // 2
    boardCubesWhite[2] = cube();
    boardCubesWhite[2].translate(1.0, -2.0, 2.0);
    boardCubesWhite[2].scale(1.1, 1.1, 1.1);
    // 3
    boardCubesWhite[3] = cube();
    boardCubesWhite[3].translate(3.0, -2.0, 2.0);
    boardCubesWhite[3].scale(1.1, 1.1, 1.1);
    // Second Row
    // 4
    boardCubesWhite[4] = cube();
    boardCubesWhite[4].translate(-4.0, -2.0, 1.0);
    boardCubesWhite[4].scale(1.1, 1.1, 1.1);
    // 5
    boardCubesWhite[5] = cube();
    boardCubesWhite[5].translate(-2.0, -2.0, 1.0);
    boardCubesWhite[5].scale(1.1, 1.1, 1.1);
    // 6
    boardCubesWhite[6] = cube();
    boardCubesWhite[6].translate(0.0, -2.0, 1.0);
    boardCubesWhite[6].scale(1.1, 1.1, 1.1);
    // 7
    boardCubesWhite[7] = cube();
    boardCubesWhite[7].translate(2.0, -2.0, 1.0);
    boardCubesWhite[7].scale(1.1, 1.1, 1.1);
    // Third Row
    // 8
    boardCubesWhite[8] = cube();
    boardCubesWhite[8].translate(-3.0, -2.0, 0.0);
    boardCubesWhite[8].scale(1.1, 1.1, 1.1);
    // 9
    boardCubesWhite[9] = cube();
    boardCubesWhite[9].translate(-1.0, -2.0, 0.0);
    boardCubesWhite[9].scale(1.1, 1.1, 1.1);
    // 10
    boardCubesWhite[10] = cube();
    boardCubesWhite[10].translate(1.0, -2.0, 0.0);
    boardCubesWhite[10].scale(1.1, 1.1, 1.1);
    // 11
    boardCubesWhite[11] = cube();
    boardCubesWhite[11].translate(3.0, -2.0, 0.0);
    boardCubesWhite[11].scale(1.1, 1.1, 1.1);
    // Fourth Row
    // 12
    boardCubesWhite[12] = cube();
    boardCubesWhite[12].translate(-4.0, -2.0, -1.0);
    boardCubesWhite[12].scale(1.1, 1.1, 1.1);
    // 13
    boardCubesWhite[13] = cube();
    boardCubesWhite[13].translate(-2.0, -2.0, -1.0);
    boardCubesWhite[13].scale(1.1, 1.1, 1.1);
    // 14
    boardCubesWhite[14] = cube();
    boardCubesWhite[14].translate(0.0, -2.0, -1.0);
    boardCubesWhite[14].scale(1.1, 1.1, 1.1);
    // 15
    boardCubesWhite[15] = cube();
    boardCubesWhite[15].translate(2.0, -2.0, -1.0);
    boardCubesWhite[15].scale(1.1, 1.1, 1.1);
    // Fifth Row
    // 16
    boardCubesWhite[16] = cube();
    boardCubesWhite[16].translate(-3.0, -2.0, -2.0);
    boardCubesWhite[16].scale(1.1, 1.1, 1.1);
    // 17
    boardCubesWhite[17] = cube();
    boardCubesWhite[17].translate(-1.0, -2.0, -2.0);
    boardCubesWhite[17].scale(1.1, 1.1, 1.1);
    // 18
    boardCubesWhite[18] = cube();
    boardCubesWhite[18].translate(1.0, -2.0, -2.0);
    boardCubesWhite[18].scale(1.1, 1.1, 1.1);
    // 19
    boardCubesWhite[19] = cube();
    boardCubesWhite[19].translate(3.0, -2.0, -2.0);
    boardCubesWhite[19].scale(1.1, 1.1, 1.1);
    // Sixth Row
    // 20
    boardCubesWhite[20] = cube();
    boardCubesWhite[20].translate(-4.0, -2.0, -3.0);
    boardCubesWhite[20].scale(1.1, 1.1, 1.1);
    // 21
    boardCubesWhite[21] = cube();
    boardCubesWhite[21].translate(-2.0, -2.0, -3.0);
    boardCubesWhite[21].scale(1.1, 1.1, 1.1);
    // 22
    boardCubesWhite[22] = cube();
    boardCubesWhite[22].translate(0.0, -2.0, -3.0);
    boardCubesWhite[22].scale(1.1, 1.1, 1.1);
    // 23
    boardCubesWhite[23] = cube();
    boardCubesWhite[23].translate(2.0, -2.0, -3.0);
    boardCubesWhite[23].scale(1.1, 1.1, 1.1);
    // Seventh Row
    // 24
    boardCubesWhite[24] = cube();
    boardCubesWhite[24].translate(-3.0, -2.0, -4.0);
    boardCubesWhite[24].scale(1.1, 1.1, 1.1);
    // 25
    boardCubesWhite[25] = cube();
    boardCubesWhite[25].translate(-1.0, -2.0, -4.0);
    boardCubesWhite[25].scale(1.1, 1.1, 1.1);
    // 26
    boardCubesWhite[26] = cube();
    boardCubesWhite[26].translate(1.0, -2.0, -4.0);
    boardCubesWhite[26].scale(1.1, 1.1, 1.1);
    // 27
    boardCubesWhite[27] = cube();
    boardCubesWhite[27].translate(3.0, -2.0, -4.0);
    boardCubesWhite[27].scale(1.1, 1.1, 1.1);
    // Eighth Row
    // 28
    boardCubesWhite[28] = cube();
    boardCubesWhite[28].translate(-4.0, -2.0, -5.0);
    boardCubesWhite[28].scale(1.1, 1.1, 1.1);
    // 29
    boardCubesWhite[29] = cube();
    boardCubesWhite[29].translate(-2.0, -2.0, -5.0);
    boardCubesWhite[29].scale(1.1, 1.1, 1.1);
    // 30
    boardCubesWhite[30] = cube();
    boardCubesWhite[30].translate(0.0, -2.0, -5.0);
    boardCubesWhite[30].scale(1.1, 1.1, 1.1);
    // 31
    boardCubesWhite[31] = cube();
    boardCubesWhite[31].translate(2.0, -2.0, -5.0);
    boardCubesWhite[31].scale(1.1, 1.1, 1.1);

    for (i = 0; i < boardCubesWhite.length; i++)
    {
        pointsArray_BoardWhite = pointsArray_BoardWhite.concat(boardCubesWhite[i].TriangleVertices);
        normalsArray_BoardWhite = normalsArray_BoardWhite.concat(boardCubesWhite[i].TriangleNormals);
    }
};

// Construct Green Checkerbaord Pieces Function
function constructGreenPieces()
{
    // Construct the Green Checker Piece Objects (Cylinders)
    // First Row
    // 0
    greenCheckers[0] = cylinder(72, 1.0, true);
    greenCheckers[0].translate(-4.4, -3.0, 2.2);
    greenCheckers[0].scale(1.0, 0.5, 1.0);          // Shrink Cylinder to Half-Size
    // 1
    greenCheckers[1] = cylinder(72, 1.0, true);
    greenCheckers[1].translate(-2.2, -3.0, 2.2);
    greenCheckers[1].scale(1.0, 0.5, 1.0);          // Shrink Cylinder to Half-Size
    // 2
    greenCheckers[2] = cylinder(72, 1.0, true);
    greenCheckers[2].translate(0.0, -3.0, 2.2);
    greenCheckers[2].scale(1.0, 0.5, 1.0);          // Shrink Cylinder to Half-Size
    // 3
    greenCheckers[3] = cylinder(72, 1.0, true);
    greenCheckers[3].translate(2.2, -3.0, 2.2);
    greenCheckers[3].scale(1.0, 0.5, 1.0);          // Shrink Cylinder to Half-Size
    // Second Row
    // 4
    greenCheckers[4] = cylinder(72, 1.0, true);
    greenCheckers[4].translate(-3.3, -3.0, 1.1);
    greenCheckers[4].scale(1.0, 0.5, 1.0);          // Shrink Cylinder to Half-Size
    // 5
    greenCheckers[5] = cylinder(72, 1.0, true);
    greenCheckers[5].translate(-1.1, -3.0, 1.1);
    greenCheckers[5].scale(1.0, 0.5, 1.0);          // Shrink Cylinder to Half-Size
    // 6
    greenCheckers[6] = cylinder(72, 1.0, true);
    greenCheckers[6].translate(1.1, -3.0, 1.1);
    greenCheckers[6].scale(1.0, 0.5, 1.0);          // Shrink Cylinder to Half-Size
    // 7
    greenCheckers[7] = cylinder(72, 1.0, true);
    greenCheckers[7].translate(3.3, -3.0, 1.1);
    greenCheckers[7].scale(1.0, 0.5, 1.0);          // Shrink Cylinder to Half-Size
    // Third Row
    // 8
    greenCheckers[8] = cylinder(72, 1.0, true);
    greenCheckers[8].translate(-4.4, -3.0, 0.0);
    greenCheckers[8].scale(1.0, 0.5, 1.0);          // Shrink Cylinder to Half-Size
    // 9
    greenCheckers[9] = cylinder(72, 1.0, true);
    greenCheckers[9].translate(-2.2, -3.0, 0.0);
    greenCheckers[9].scale(1.0, 0.5, 1.0);          // Shrink Cylinder to Half-Size
    // 10
    greenCheckers[10] = cylinder(72, 1.0, true);
    greenCheckers[10].translate(0.0, -3.0, 0.0);
    greenCheckers[10].scale(1.0, 0.5, 1.0);         // Shrink Cylinder to Half-Size
    // 11
    greenCheckers[11] = cylinder(72, 1.0, true);
    greenCheckers[11].translate(2.2, -3.0, 0.0);
    greenCheckers[11].scale(1.0, 0.5, 1.0);         // Shrink Cylinder to Half-Size

    for (i = 0; i < greenCheckers.length; i++)
    {
        pointsArray_CheckGreen = pointsArray_CheckGreen.concat(greenCheckers[i].TriangleVertices);
        normalsArray_CheckGreen = normalsArray_CheckGreen.concat(greenCheckers[i].TriangleNormals);
    }
};

// Construct Red Checkerboard Pieces Function
function constructRedPieces()
{
    // Construct the Red Checker Piece Objects (Cylinders)
    // First Row
    // 0
    redCheckers[0] = cylinder(72, 1.0, true);
    redCheckers[0].translate(-3.3, -3.0, -5.5);
    redCheckers[0].scale(1.0, 0.5, 1.0);          // Shrink Cylinder to Half-Size
    // 1
    redCheckers[1] = cylinder(72, 1.0, true);
    redCheckers[1].translate(-1.1, -3.0, -5.5);
    redCheckers[1].scale(1.0, 0.5, 1.0);          // Shrink Cylinder to Half-Size
    // 2
    redCheckers[2] = cylinder(72, 1.0, true);
    redCheckers[2].translate(1.1, -3.0, -5.5);
    redCheckers[2].scale(1.0, 0.5, 1.0);          // Shrink Cylinder to Half-Size
    // 3
    redCheckers[3] = cylinder(72, 1.0, true);
    redCheckers[3].translate(3.3, -3.0, -5.5);
    redCheckers[3].scale(1.0, 0.5, 1.0);          // Shrink Cylinder to Half-Size
    // Second Row
    // 4
    redCheckers[4] = cylinder(72, 1.0, true);
    redCheckers[4].translate(-4.4, -3.0, -4.4);
    redCheckers[4].scale(1.0, 0.5, 1.0);          // Shrink Cylinder to Half-Size
    // 5
    redCheckers[5] = cylinder(72, 1.0, true);
    redCheckers[5].translate(-2.2, -3.0, -4.4);
    redCheckers[5].scale(1.0, 0.5, 1.0);          // Shrink Cylinder to Half-Size
    // 6
    redCheckers[6] = cylinder(72, 1.0, true);
    redCheckers[6].translate(0.0, -3.0, -4.4);
    redCheckers[6].scale(1.0, 0.5, 1.0);          // Shrink Cylinder to Half-Size
    // 7
    redCheckers[7] = cylinder(72, 1.0, true);
    redCheckers[7].translate(2.2, -3.0, -4.4);
    redCheckers[7].scale(1.0, 0.5, 1.0);          // Shrink Cylinder to Half-Size
    // Third Row
    // 8
    redCheckers[8] = cylinder(72, 1.0, true);
    redCheckers[8].translate(-3.3, -3.0, -3.3);
    redCheckers[8].scale(1.0, 0.5, 1.0);          // Shrink Cylinder to Half-Size
    // 9
    redCheckers[9] = cylinder(72, 1.0, true);
    redCheckers[9].translate(-1.1, -3.0, -3.3);
    redCheckers[9].scale(1.0, 0.5, 1.0);          // Shrink Cylinder to Half-Size
    // 10
    redCheckers[10] = cylinder(72, 1.0, true);
    redCheckers[10].translate(1.1, -3.0, -3.3);
    redCheckers[10].scale(1.0, 0.5, 1.0);         // Shrink Cylinder to Half-Size
    // 11
    redCheckers[11] = cylinder(72, 1.0, true);
    redCheckers[11].translate(3.3, -3.0, -3.3);
    redCheckers[11].scale(1.0, 0.5, 1.0);         // Shrink Cylinder to Half-Size

    for (i = 0; i < redCheckers.length; i++)
    {
        pointsArray_CheckRed = pointsArray_CheckRed.concat(redCheckers[i].TriangleVertices);
        normalsArray_CheckRed = normalsArray_CheckRed.concat(redCheckers[i].TriangleNormals);
    }
};