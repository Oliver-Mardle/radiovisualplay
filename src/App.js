import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography';
import BBCNews from './BBC_News_Linear_World_Service_LR_RGB.jpg'
import sample from  './wsrv.webm';
import defaultImg from './default.png';

const config = require('./config');

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
let counter = 0;
let counter2 = 0;
var scheduleItemCount = 0;
var downloadSchedule = true;
let schedule = [];

function NowNextSchedule({now, next, later}) {
  let nowTitle;
  let nowEpisode;
  let nowSynopsis;
  let nowStart;
  let nowImage;

  let nextTitle;
  let nextEpisode;
  let nextSynopsis;
  let nextStart;
  let nextImage;

  let laterTitle;
  let laterEpisode;
  let laterSynopsis;
  let laterStart;
  let laterImage;

  try {
    nowTitle = now.title;
    nowEpisode = now.episode;
    nowSynopsis = now.synopsis;
    if (nowSynopsis != null) {
      nowSynopsis = nowSynopsis.short;
    }
    let nowDateTime = (now.start.replace("Z", "")).split("T");
    let nowDay = daysOfWeek[new Date(nowDateTime[0]).getDay()];
    nowStart = nowDay + " at " + nowDateTime[1] + " GMT";
    if (now.thumbnail != null) {
      nowImage = now.thumbnail;
    }
    
  } catch {
    console.log("No Now Schedule Data");
  }

  try {
    nextTitle = next.title;
    nextEpisode = next.episode;
    nextSynopsis = next.synopsis;
    if (nextSynopsis != null) {
      nextSynopsis = nextSynopsis.short;
    }
    let nextDateTime = (next.start.replace("Z", "")).split("T");
    let nextDay = daysOfWeek[new Date(nextDateTime[0]).getDay()];
    nextStart = nextDay + " at " + nextDateTime[1] + " GMT";
    if (next.thumbnail != null) {
      nextImage = next.thumbnail;
    }

  } catch {
    console.log("No Next Schedule Data");
  }

  try {
    laterTitle = later.title;
    laterEpisode = later.episode;
    laterSynopsis = later.synopsis;
    if (laterSynopsis != null) {
      laterSynopsis = laterSynopsis.short;
    }
    let laterDateTime = (later.start.replace("Z", "")).split("T");
    let laterDay = daysOfWeek[new Date(laterDateTime[0]).getDay()];
    laterStart = laterDay + " at " + laterDateTime[1] + " GMT";
    //laterDuration = later.duration;
    if (later.thumbnail != null) {
      laterImage = later.thumbnail;
    }

  } catch {
    console.log("No Later Schedule Data");
  }

  return (
    <Box sx={{ display: 'grid', width: '1045px', gridTemplateRows: '1fr 1fr 1fr',  marginTop: '0px', marginRight: '55px'}}>
      <Box sx={{display: 'grid', gridTemplateColumns: '360px 685px', height: '200px', width: '1045px', color: 'white', background: "rgba(187, 24, 25, 0.6)", marginBottom: "55px"}}>
        <img alt="" src={nowImage} height='200px'/>
        <Box sx={{display: 'grid', gridTemplateRows: '1fr 1fr 1fr 1fr', height: '200px', width: '685px'}}>
          <Typography dir='auto' marginLeft={'10px'} marginRight={'10px'} fontFamily={'BBCReithSans_W_Md'} fontSize={'3rem'}>{nowTitle}</Typography>
          <Typography dir='auto' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithSans_W_Md'} fontSize={'2rem'}>{nowEpisode}</Typography>
          <Typography dir='auto' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithSans_W_Md'} fontSize={'2rem'}>{nowSynopsis}</Typography>
          <Typography dir='auto' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithSans_W_Md'} fontSize={'2rem'}>{nowStart}</Typography>
        </Box>
      </Box>
      <Box sx={{display: 'grid', gridTemplateColumns: '360px 685px', height: '200px', width: '1045px', color: 'white', background: "rgba(187, 24, 25, 0.6 )", marginBottom: "55px"}}>
        <img alt="" src={nextImage} height='200px'/>
        <Box sx={{display: 'grid', gridTemplateRows: '1fr 1fr 1fr 1fr', height: '200px', width: '685px'}}>
          <Typography dir='auto' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithSans_W_Md'} fontSize={'3rem'}>{nextTitle}</Typography>
          <Typography dir='auto' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithSans_W_Md'} fontSize={'2rem'}>{nextEpisode}</Typography>
          <Typography dir='auto' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithSans_W_Md'} fontSize={'2rem'}>{nextSynopsis}</Typography>
          <Typography dir='auto' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithSans_W_Md'} fontSize={'2rem'}>{nextStart}</Typography>
        </Box>
      </Box>
      <Box alt="" sx={{display: 'grid', gridTemplateColumns: '360px 685px', height: '200px', width: '1045px', color: 'white', background: "rgba(187, 24, 25, 0.6 )"}}>
        <img alt="" src={laterImage} height='200px'/>
        <Box sx={{display: 'grid', gridTemplateRows: '1fr 1fr 1fr 1fr', height: '200px', width: '685px'}}>
          <Typography dir='auto' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithSans_W_Md'} fontSize={'3rem'}>{laterTitle}</Typography>
          <Typography dir='auto' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithSans_W_Md'} fontSize={'2rem'}>{laterEpisode}</Typography>
          <Typography dir='auto' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithSans_W_Md'} fontSize={'2rem'}>{laterSynopsis}</Typography>
          <Typography dir='auto' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithSans_W_Md'} fontSize={'2rem'}>{laterStart}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

function ScheduleSection({ params }) {
  const [on, setOn] = useState(false);
  const [now, setNow] = useState();
  const [next, setNext] = useState();
  const [later, setLater] = useState();
  let eventTime;
  const FALSE = true;

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      (async () => {
        const sOfm = (eventTime) ;
        if ((sOfm) > 1) {
          setOn(true);
        } else {
          setOn(FALSE);
        }
        console.log(on);
        
        if (downloadSchedule === true) {
          const date = new Date();
          const datetimeNOW = (date.getFullYear() + "-" + ("0" + (date.getMonth()+1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":00Z");
          const datetimeTMW = (date.getFullYear() + "-" + ("0" + (date.getMonth()+1)).slice(-2) + "-" + ("0" + (date.getDate() + 1)).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":00Z");
          const url = "https://ws-syndication.api.bbci.co.uk/api/broadcasts?page_size=100&api-key=" + config.app.schedulesKey + "&sid=" + config.app.sid + "&start_from=" + datetimeNOW + "&end_to=" + datetimeTMW;

          const r2 = await fetch(url);
          if (r2.ok) {
          const data = await r2.json();
          const items = data["ws_syndication"]["results"]["items"];
          scheduleItemCount = items.length;
          schedule = [];
          for (let i = 0; i < items.length; i++) {
            let title = items[i]["brand"]["title"];
            let episode = items[i]["episode"]["title"];
            let synopsis = items[i]["episode"]["synopsis"];
            let start = items[i]["broadcast"]["published_time"]["attr"]["start"];
            let duration = items[i]["version"]["duration"];
            let thumbnail = items[i]["broadcast"]["image"]["attr"]["template_url"];
            try {
              thumbnail = thumbnail.replace("{recipe}", "960x540");
            } catch {
              thumbnail = "NO IMAGE"
            }

            let programme = {'title': title, 'episode': episode, 'synopsis': synopsis, 'start': start, 'duration': duration, 'thumbnail': thumbnail};
            schedule.push(programme);
          }
          downloadSchedule = false;
          }
        }
        if (counter2 === scheduleItemCount) {
          console.log("Download a new schedule!");
          downloadSchedule = true;
          counter2 = 0;          
        }
        try{
          setNow(schedule[counter2]);
          setNext(schedule[counter2 + 1]);
          if (counter2 +1 <= scheduleItemCount) {
            setLater(schedule[counter2 + 2]);
          } else {
            setLater([]);
          }
          counter2 = counter2 + 1;
        } catch (error) {
          console.log(error);
          console.log("No Schedule Has Been Downloaded Yet");
        }
            
      })();
    }, 10000);
    return () => clearInterval(interval);
  });

  return (
    <NowNextSchedule now={now} next={next} later={later} />
  );
}

function NowNext({ headline, styling }) {
  let brand;
  let seriesEpisode;
  //let eventTime;
  let picture;

  try{
    brand = headline.headline;
    seriesEpisode = headline.description;
    //eventTime = headline.date;
    if (headline.image === false) {
      picture = defaultImg;
    } else {
      picture = headline.image;
    }
    
  } catch {
    console.log("No Data Yet")
  }

  /*
      <Box>
        <Fade in={true} timeout={500}>
          <Typography fontFamily={'BBCReithSans_W_Md'} fontSize={'1.5rem'} paddingLeft={'10px'} paddingBottom={'5px'}>Published: {eventTime}</Typography>
        </Fade>
      </Box>
  */

  return (
    <Box sx={{
      width: '600px', height: '710px',
      display: 'grid', gridTemplateRows: '340px 370px'
    }}>
      <img alt="" src={picture} width='600px' height='340px'/>
      
      <Box sx={{display: 'grid', gridTemplateRows: 'min-content 1fr', direction: 'rtl', paddingLeft: '10px', paddingRight: '10px', height: '370px'}}>
        <Box sx={{height: 'fit-content'}}>
          <Fade in={true} timeout={500}>
            <Typography fontFamily={'BBCReithSans_W_Bd'} fontSize={'3rem'}>{brand}</Typography>
          </Fade>
        </Box>
        <Box sx={{height: 'fit-content'}}>
          <Fade in={true} timeout={500}>
            <Typography fontFamily={'BBCReithSans_W_Md'} fontSize={'2rem'}>{seriesEpisode}</Typography>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
}

function Bottom({ params }) {
  const styling = params.styling || 'grownup';

  const [on, setOn] = useState(false);
  const [headline, setHeadline] = useState();
  const [steady, setSteady] = useState(false);
  const containerRef = React.useRef(null);
  let eventTime;

  const FALSE = true;
  console.log(steady);

  // 5 second timer
  useEffect(() => {
    let interval = null;
    let newsItemCount = 0;
    interval = setInterval(() => {
      (async () => {
        const sOfm = (eventTime) ;
        if ((sOfm) > 1) {
          setOn(true);
        } else {
          setOn(FALSE);
        }
        console.log(sOfm);

        let news = [];
        const url = "https://information-syndication.api.bbc.com/articles?api_key=" + config.app.headlinesKey + "&feed=" + config.app.feed + "&mixins=summary,thumbnail_images";
        let Data = "";

        fetch(url)
          .then((response) => response.text())
          .then((RSSFeed) => {
            Data = RSSFeed;
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(Data,"text/xml");

            const item = xmlDoc.getElementsByTagName('item');
            let headline = "";
            let description = "";
            let date = "";
            let image = "";
            newsItemCount = item.length;
            for (let i = 0; i < item.length; i++) {
              headline = (item[i].childNodes[1].childNodes[0].nodeValue);
              if (item[i].childNodes[7].nodeName === 'description') {
                description = (item[i].childNodes[7].childNodes[0].nodeValue);
                date = (item[i].childNodes[9].childNodes[0].nodeValue);
              } else {
                description = ("No Summary!");
                date = (item[i].childNodes[7].childNodes[0].nodeValue);
              }

              date = (item[i].getElementsByTagName('pubDate')[0].childNodes[0].nodeValue)
              headline = (item[i].getElementsByTagName('title')[0].childNodes[0].nodeValue);
              try{
                description = (item[i].getElementsByTagName('description')[0].childNodes[0].nodeValue);
              } catch {
                description = false;
              }  
              try{
                image = (item[i].getElementsByTagName('media:thumbnail')[0].attributes[0].nodeValue);
              } catch {
                image = false;
              }

              news.push({'headline': headline, 'description': description, 'date': date, 'image': image});
            }
            
            if (counter === newsItemCount) {
              counter = 0;
            }

            setHeadline(news[counter]);
            counter = counter + 1;
          });
        }
      )();
    }, 10000);
    return () => clearInterval(interval);
  });

  console.log(`styling log ${styling}`);
  return (
    <Box sx={{ overflow: 'hidden' }} ref={containerRef}>
      <Slide direction="up"
        in={on} mountOnEnter unmountOnExit
        container={containerRef.current}
        onEntered={() => console.log('entered')}
        addEndListener={() => setSteady(FALSE)}
        timeout={500}>
        <Box sx={styling === 'grownup' ?
          {
            height: '710px', width: '600px', color: 'white',
            background: 'rgba(187, 24, 25, 0.6)',
            display: 'grid', gridTemplateColumns: '1fr'
          }
          : {
            height: '710px', width: '600px', color: 'black',
            background: 'linear-gradient(to right, rgba(255, 255, 255, .9), rgba(255, 255, 255, .9))',
            display: 'grid', gridTemplateColumns: '1fr'
          }}>
          <Box display='flex' alignItems='center'>
            <NowNext headline={headline} styling={styling} />
          </Box>
        </Box>
      </Slide>
    </Box>
  );
}

function TopLeft({ show }) {
  const [on, setOn] = useState(false);
  const [TimeDateString, setTimeDate] = useState();
  let eventTime;
  const FALSE = true;
  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      (async () => {
        const sOfm = (eventTime) ;
        if ((sOfm) > 1) {
          setOn(true);
        } else {
          setOn(FALSE);
        }
        console.log(on);
        let TimeDate = new Date();
        let TimeDateString = ("0" + TimeDate.getHours()).slice(-2) + ":" + ("0" + TimeDate.getMinutes()).slice(-2) + " - " + daysOfWeek[TimeDate.getDay()] + " " + TimeDate.getDate() + " " + months[TimeDate.getMonth()] + " " + TimeDate.getFullYear();
        setTimeDate(TimeDateString); 
      })();
      }, 5000);
    return () => clearInterval(interval);
  });
  return (
    <Box>
      <Typography fontFamily={'BBCReithSans_W_Bd'} fontSize={'2.2rem'}>{TimeDateString}</Typography>
    </Box>
  );
}

function TopRight({ show }) {
  return <img alt='BBC News' src={BBCNews}/>;
}

/*
*/

export default function App(params) {
  return (
    <Paper>
      <Box sx={{
        width: 'auto', height: '100vh',
        display: 'grid', gridTemplateRows: '110px 150px 710px'
      }}>
        <Box>
          <video className='videoTag' autoPlay loop width='1920'
            height='1080'muted>
            <source src={sample} type='video/webm'/>
          </video>
        </Box>
        <Box sx={{ display: 'grid', width: '1700px', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr',  marginTop: '0px', marginLeft: '110px', marginRight: '110px'}}>
          <TopLeft show={params.tl}/>
          <Box></Box>
          <Box sx={{ display: 'block', marginLeft: 'auto' }}><TopRight show={params.tr} /></Box>
          <Box><Typography fontFamily={'BBCReithSans_W_Md'} fontSize={'2.2rem'}>BBC World Service Radio Vision - Afghan</Typography></Box>
          <Box></Box>
          <Box></Box>
        </Box>
        <Box sx={{ display: 'grid', width: '1700px', gridTemplateColumns: '1fr 1fr',  marginTop: '0px', marginLeft: '110px', marginRight: '110px'}}>
          <ScheduleSection params={params} />
          <Bottom params={params} />
        </Box>
      </Box>
    </Paper>
  );
}