/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';

let color = 'rgba(255, 255, 255, 0.1)';
const boundingBoxColor = 'transparent'; //'rgba(255, 255, 255, 0.2)' white & almost transparent
const lineWidth = 10;

function toTuple({
  y,
  x
}) {
  return [y, x];
}

export function drawPoint(ctx, y, x, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

/**
 * Draws a line on a canvas, i.e. a joint
 */
export function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
  // ax > bx
  // ay > by

  ctx.beginPath();
  ctx.setLineDash([5, 15]);
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = 'rgba(200, 200, 0, 0.3)';
  ctx.stroke();

  // ctx.beginPath();
  // ctx.ellipse((ax+bx)/2, (ay+by)/2, 50, 100, 0, 0, Math.PI * 4);
  // ctx.fillStyle = 'green';
  // ctx.fill();
  //
  // ctx.beginPath();
  // ctx.arc((ax+bx)/2, (ay+by)/2, 10, 0, 2 * Math.PI);
  // ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
  // ctx.fill();

}


/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
export function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
  const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
    keypoints, minConfidence);

  adjacentKeyPoints.forEach((keypoints) => {
    drawSegment(toTuple(keypoints[0].position),
      toTuple(keypoints[1].position), color, scale, ctx);
  });
}

let left = ["leftElbow"];
let right = ["rightElbow"];
/**
 * Draw pose keypoints onto a canvas
 */
export function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
  //save five to a text file
  // five[i][0] == nose
  // nose 끼리 비교해서 가까운 애들이 10px 안에 있으면 색깔 체인지
  // nose 비교 loop가 끝나면 five 다시 empty
  for (let i = keypoints.length - 1; i >= 0; i--) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const {
      y,
      x
    } = keypoint.position;
    if (i == 0) {  // nose
      if (adjacentBool == false) {
        drawPoint(ctx, y * scale, x * scale, 50, 'rgba(255, 255, 255, 0.3)');
      } else {
        let img = new Image();
        img.src = "9gag_Face.png";
        ctx.drawImage(img, x-50, y-50, 200, 200);
      }
    } else if (i == 1 || i == 2 || i == 3 || i == 4) {
    } else {
      drawPoint(ctx, y * scale, x * scale, 50, color);
    }
  }
}

/**
 * Draw the bounding box of a pose. For example, for a whole person standing
 * in an image, the bounding box will begin at the nose and extend to one of
 * ankles
 */

let leftSide = [];
let rightSide = [];
let adjacentBool;
let htmlVal;
var ele = document.getElementById('boolean');

export function drawBoundingBox(keypoints, ctx) {
  const boundingBox = posenet.getBoundingBox(keypoints);
  ctx.rect(boundingBox.minX, boundingBox.minY,
    boundingBox.maxX - boundingBox.minX, boundingBox.maxY - boundingBox.minY);

  // console.log("=======DRAW BOUNDING BOX========");
  // BOXCOORD[X]
  // X = 0: left top, 1: right top, 2: right bottom, 3: left bottom

  // 1. adding COORDINATES the array
  let boxCoord = posenet.getBoundingBoxPoints(keypoints);
  if (leftSide.length < 20) {
    leftSide.push(boxCoord[0].x);
    // console.log(leftSide);
  } if (rightSide.length < 20) {
    rightSide.push(boxCoord[1].x);
    // console.log(rightSide);
  }

  // 2. WHEN ARRAY IS FULL
  if (leftSide.length == 20 && rightSide.length == 20) {
    leftSide = leftSide.sort((a,b) => a-b);
    rightSide = rightSide.sort((a,b) => a-b);

    // 3. COMPARE FULL ARRAYS
    compareArrays(leftSide, rightSide);

    // 4. if adjacentBool is TRUE, don't change to false until
    // compareArrays show nothing overlaps..
  }

  ctx.strokeStyle = boundingBoxColor;
  ctx.stroke();
}

async function compareArrays(a, b) {
  let count = 0;

  // MAKE B RANGE ARRAYS
  let largeB = b.map(n=>n+5);
  let smallB = b.map(n=>n-5);
  // console.log("=====COMPARE ARRAYS=====");

  // COMPARE ALL ITEMS A WITHIN ITEMS B RANGE
  for (let i=0; i < b.length; i++){
    for(let j=0; j < a.length;j++) {
      // a 값이 b range 내에 있으면 count + 1
      (smallB[i] <= a[j] && a[j] <= largeB[i]) ? count++ : count;
    }
  }

  // 3번 이상 범주 안에 들어오면 겹쳤다고 판단. TRUE로 변경
  adjacentBool = (count > 3) ? true : false;

  (adjacentBool === true) ? (color = "rgba(0, 255, 0, 0.3)") : (color = "rgba(255, 255, 255, 0.3)");

  // RESET. count 끝나면 원상복귀.
  leftSide = [];
  rightSide = [];

  if (adjacentBool === true) {
    htmlVal = 'adjacent';
  } else {
    htmlVal = 'notAdjacent';
  }
  boolValue(htmlVal);
}


export async function boolValue(htmlValue) {
  ele.innerHTML = htmlValue;
  console.log(htmlValue);
  console.log(ele.innerHTML);
}
/**
 * Converts an arary of pixel data into an ImageData object
 */
export async function renderToCanvas(a, ctx) {
  const [height, width] = a.shape;
  const imageData = new ImageData(width, height);

  const data = await a.data();

  for (let i = 0; i < height * width; ++i) {
    const j = i * 4;
    const k = i * 3;

    imageData.data[j + 0] = data[k + 0];
    imageData.data[j + 1] = data[k + 1];
    imageData.data[j + 2] = data[k + 2];
    imageData.data[j + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Draw an image on a canvas
 */
export function renderImageToCanvas(image, size, canvas) {
  canvas.width = size[0];
  canvas.height = size[1];
  const ctx = canvas.getContext('2d');

  ctx.drawImage(image, 0, 0);
}

/**
 * Draw heatmap values, one of the model outputs, on to the canvas
 * Read our blog post for a description of PoseNet's heatmap outputs
 * https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5
 */
export function drawHeatMapValues(heatMapValues, outputStride, canvas) {
  const ctx = canvas.getContext('2d');
  const radius = 5;
  const scaledValues = heatMapValues.mul(tf.scalar(outputStride, 'int32'));

  drawPoints(ctx, scaledValues, radius, color);
}

/**
 * Used by the drawHeatMapValues method to draw heatmap points on to
 * the canvas
 */
function drawPoints(ctx, points, radius, color) {
  const data = points.buffer().values;
  for (let i = 0; i < data.length; i += 2) {
    const pointY = data[i];
    const pointX = data[i + 1];

    if (pointX !== 0 && pointY !== 0) {
      ctx.beginPath();
      ctx.arc(pointX, pointY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }
}

/**
 * Draw offset vector values, one of the model outputs, on to the canvas
 * Read our blog post for a description of PoseNet's offset vector outputs
 * https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5
 */
export function drawOffsetVectors(
  heatMapValues, offsets, outputStride, scale = 1, ctx) {
  const offsetPoints = posenet.singlePose.getOffsetPoints(
    heatMapValues, outputStride, offsets);

  const heatmapData = heatMapValues.buffer().values;
  const offsetPointsData = offsetPoints.buffer().values;

  for (let i = 0; i < heatmapData.length; i += 2) {
    const heatmapY = heatmapData[i] * outputStride;
    const heatmapX = heatmapData[i + 1] * outputStride;
    const offsetPointY = offsetPointsData[i];
    const offsetPointX = offsetPointsData[i + 1];

    drawSegment([heatmapY, heatmapX], [offsetPointY, offsetPointX],
      color, scale, ctx);
  }
}
