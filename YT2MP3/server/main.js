const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const pathToFfmpeg = require('ffmpeg-static'); // wtf even is this shit man

const app = express();
//remove ffmpeg
app.use(cors());

app.listen(4000, () => {
    console.log('Server On...');
});

app.get('/download', async (req, res) => {
    var URL = req.query.URL;

    if(!ytdl.validateURL(URL)) return res.status(400).send("The submitted link is not a valid Youtube URL.");

    try {
        let videoID = ytdl.getURLVideoID(URL);
        let info = await ytdl.getInfo(videoID);

        res.setHeader('Content-Disposition', 'attachment; filename="' + info.videoDetails.title + '.mp3"');  // semocolon at end?
        res.setHeader('Content-type', 'audio/mpeg');
        // res.setHeader('Access-Control-Allow-Origin', 'http://mysite.ca/blahblah');
        //the above code will make is so only MY site can recieve responses from this server
        // Content-Disposition is not sent to client unless explicitly exposed
        res.setHeader('Access-Control-Expose-Headers','Content-Disposition'); 

        let stream = ytdl(URL); 
        //format?
        // style button disable
        var proc = new ffmpeg(stream);

        proc.setFfmpegPath(pathToFfmpeg);
        proc.withAudioCodec('libmp3lame')
        .toFormat('mp3')
        .output(res)
        .run();

    } catch(e) {
        return res.status(e.code).send(e.msg);
    }
});

async function blahblah(ID, res, URL){
    let info = retrieveInfo();
    console.log(JSON.stringify(info));
    // let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    // let format = ytdl.chooseFormat(audioFormats, { quality: 'highest' });

    //"audioBitrate":128
    
    res.setHeader('Content-Disposition', 'attachment; filename="' + info.videoDetails.title + '.mp3"');  // semocolon at end?
    res.setHeader('Content-type', 'audio/mpeg'); // figure this header shit out
    res.setHeader('Access-Control-Expose-Headers','Content-Disposition'); // content-diposition is not sent unless explicitly exposed

    try { 
        // creates a readable stream to the mp4 file of the video (no options)
        var stream = ytdl(URL); //{format:format}

        // creates a ffmpeg process from the stream
        var proc = new ffmpeg(stream);

        // sets the binary path to the fluent-ffmpeg binary
        proc.setFfmpegPath(pathToFfmpeg);
        proc.withAudioCodec('libmp3lame').toFormat('mp3').output(res).run();
        
    } catch (e) {
        console.log(e.code);
        console.log(e.msg);
    }

}