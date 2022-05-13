//______________________________________________________________________

/*
          Smooth Gold Material

          Useage: myMaterial = goldMaterial();
*/

function goldMaterial() {
  var data  = {};
  data.materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
  data.materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0);
  data.materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
  data.materialShininess = 100.0;
  return data;
}

//______________________________________________________________________

/*
          Very Smooth Red plastic material

          Useage: myMaterial = verySmoothRedPlasticMaterial();
*/

function verySmoothRedPlasticMaterial() {
    var data = {};
    data.materialAmbient = vec4(0.8, 0.0, 0.0, 1.0);
    data.materialDiffuse = vec4(0.8, 0.0, 0.0, 1.0);
    data.materialSpecular = vec4(0.8, 0.8, 0.8, 1.0);
    data.materialShininess = 512.0;
    return data;
}

//______________________________________________________________________

/*
          Very Smooth Green plastic material

          Useage: myMaterial = verySmoothGreenPlasticMaterial();
*/

function verySmoothGreenPlasticMaterial() {
    var data = {};
    data.materialAmbient = vec4(0.0, 0.8, 0.0, 1.0);
    data.materialDiffuse = vec4(0.0, 0.8, 0.0, 1.0);
    data.materialSpecular = vec4(0.8, 0.8, 0.8, 1.0);
    data.materialShininess = 512.0;
    return data;
}

//______________________________________________________________________

/*
          Black Plastic Material

          Useage: myMaterial = blackPlasticMaterial();
*/

function blackPlasticMaterial() {
  var data = {};
  data.materialAmbient = vec4(0.0, 0.0, 0.0, 1.0);
  data.materialDiffuse = vec4(0.01, 0.01, 0.01, 1.0);
  data.materialSpecular = vec4(0.50, 0.50, 0.50, 1.0);
  data.materialShininess = 32.0;
  return data;
}

//______________________________________________________________________

/*
          Pearl Material

          Useage: myMaterial = pearlMaterial();
*/

function pearlMaterial() {
  var data = {};
  data.materialAmbient = vec4(0.25, 0.20725, 0.20725, 0.922);
  data.materialDiffuse = vec4(1.0, 0.829, 0.829, 0.922);
  data.materialSpecular = vec4(0.296648, 0.296648, 0.296648, 0.922);
  data.materialShininess = 11.264;
  return data;
}

//_________________________________________________________________________________

/*
          White Light 

          Usage: var myLight = whiteLight()

          Point light with ambient, diffuse and specular components
*/
function whiteLight() {
  var data = {};
  data.lightPosition = vec4(0.0, 10.0, 0.5, 1.0);
  data.lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
  data.lightDiffuse = vec4(0.8, 0.8, 0.8, 1.0);
  data.lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
  data.lightShineness = 10;
  return data;
}

//_________________________________________________________________________________

/*
      Checkerboard texture

      Usage: var myTexture = checkerboardTexture(size, rows, columns)

      creates a size x size texture with a checkerboard of nrows x ncolumns

      default: checkerboard(128, 8 8)
*/

function checkerboardTexture(size, rows, columns)
{
  var texSize = 128;
  if(size)  texSize = size;

  var nrows = 8;
  if(rows) nrows = rows;
  var ncolumns = nrows;
  if(columns) ncolumns = columns;

  // Create a checkerboard pattern using floats

  var image = new Uint8Array(4*texSize*texSize);

  for ( var i = 0; i < texSize; i++ )
    for ( var j = 0; j < texSize; j++ ) {
        var patchx = Math.floor(i/(texSize/ncolumns));
        var patchy = Math.floor(j/(texSize/nrows));

        var c = (patchx%2 !== patchy%2 ? 255 : 0);

        image[4*i*texSize+4*j] = c;
        image[4*i*texSize+4*j+1] = c;
        image[4*i*texSize+4*j+2] = c;
        image[4*i*texSize+4*j+3] = 255;
  }

  var texture = gl.createTexture();
  gl.activeTexture( gl.TEXTURE0 );
  gl.bindTexture( gl.TEXTURE_2D, texture );
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0,
  gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap( gl.TEXTURE_2D );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
          gl.NEAREST_MIPMAP_LINEAR );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

  return texture;
}