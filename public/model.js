var statuses;
const URL = "https://teachablemachine.withgoogle.com/models/ZnBUgiBeq/";
let model, webcam, ctx, labelContainer, maxPredictions;
var named = 'mtho';
(async() => {
    var status = await axios.get('http://localhost:5000/getuser/mtho');
    console.log(status.data)
    localStorage.setItem('name', named);

    localStorage.setItem('score', status.data.data.player_score)
    var elem = document.querySelector('.title');
    var levels = await axios.get('http://localhost:5000/getlevel')
    if (localStorage.getItem('score') == 0) {
        elem.innerHTML = levels.data.data[0].level_name;
        statuses = levels.data.data[0].level_name
    } else if (localStorage.getItem('score') == 10) {
        elem.innerHTML = levels.data.data[1].level_name;
        statuses = levels.data.data[1].level_name
    } else if (localStorage.getItem('score') == 20) {
        elem.innerHTML = levels.data.data[2].level_name;
        statuses = levels.data.data[2].level_name
    }

})()
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    const size = 200;
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);
    const canvas = document.getElementById("canvas");
    canvas.width = size;
    canvas.height = size;
    ctx = canvas.getContext("2d");
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop(timestamp) {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const {
        pose,
        posenetOutput
    } = await model.estimatePose(webcam.canvas);
    const prediction = await model.predict(posenetOutput);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
    /*
        var name = req.body.name;
       var level = req.body.levelName;
       var score = Number(req.body.score);
       */


    async function start() {
        console.log(statuses)

        if (prediction[0].className === statuses) {
            var number = prediction[0].probability.toFixed(2) * 100;
            if (number === 100) {
                await axios.post('http://localhost:5000/submit', { name: named, levelName: status, player_score: 10 });
                console.log(prediction[0].className, prediction[0].probability.toFixed(2) * 100);
                location.reload()

            }

        } else if (prediction[1].className == statuses) {
            var number = prediction[1].probability.toFixed(2) * 100;
            if (number === 100) {
                await axios.post('http://localhost:5000/submit', { name: named, levelName: status, player_score: 10 });
                console.log(prediction[1].className, prediction[1].probability.toFixed(2) * 100)
                location.reload()
            }

        } else if (prediction[2].className == statuses) {
            var number = prediction[2].probability.toFixed(2) * 100
            if (number === 100) {
                await axios.post('http://localhost:5000/submit', { name: named, levelName: status, player_score: 10 })
                console.log(prediction[2].className, prediction[2].probability.toFixed(2) * 100)
                location.reload()
            }
        } else if (prediction[3].className == statuses) {
            var number = prediction[3].probability.toFixed(2) * 100;
            if (number === 100) {
                await axios.post('http://localhost:5000/submit', { name: named, levelName: status, player_score: 10 });
                console.log(prediction[3].className, prediction[3].probability.toFixed(2) * 100)
                location.reload()
            }

        } else if (prediction[4].className == statuses) {
            var number = prediction[4].probability.toFixed(2) * 100;
            if (number === 100) {
                await axios.post('http://localhost:5000/submit', { name: named, levelName: status, player_score: 10 })
                console.log(prediction[4].className, prediction[4].probability.toFixed(2) * 100)
                location.reload()
            }

        }
    }
    start()
    drawPose(pose);
}

function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0);
        // draw the keypoints and skeleton
        if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
    }
}