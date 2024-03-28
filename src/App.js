import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography';
import BBCNews from './BBC_News_Afghanistan.png'
import BBCNews2 from './BBC_News_EN.png'
import schedule_default from './schedules_holding_image.jpg'
//import sample from  './ReithLoop1min.mp4';
import sample from  './ReithBackingLoop.webm';
import defaultImg from './default.png';
import TextTransition, { presets } from 'react-text-transition';
//import ScaleText from 'react-scale-text';

const config = require('./config');

let counter = 0;
let counter2 = 0;
var scheduleItemCount = 0;
var downloadSchedule = true;
let schedule = [];
var lang = "";
var daysOfWeek = "";
var months = "";
var numbers = "";
var connectors = "";
var published = "";

function Translate( num, charSet ) {
  const number = num;
  const characterSet = charSet;
  let splitNumber = Array.from(number.toString()).map(Number);
  let newNumber = "";
  for (let i = 0; i < splitNumber.length; i++) {
    newNumber = newNumber + characterSet[splitNumber[i]].toString();
  }
  return newNumber;
}

function calculateTimePassed( dateAndTime ) {
  let eventTime = Date.parse(dateAndTime);
  let TimeDate = new Date();
  let TimePassed = Math.round((TimeDate - eventTime) / 60000);
  let TimePassedString = "";

  console.log("Event Time: " + eventTime);
  console.log("Current Time: " + TimeDate);
  if (TimePassed > 59) {
    TimePassed = Math.round(TimePassed / 60);
    if (TimePassed > 24){
      TimePassed = Math.round(TimePassed / 24);
      if (TimePassed === 1){
        console.log("Published " + TimePassed + " Day Ago");
        TimePassedString = published[4].replace("XX", Translate(TimePassed, numbers));
        //TimePassedString = "Published " + TimePassed + " Day Ago";
      } else {
        console.log("Published " + TimePassed + " Days Ago");
        TimePassedString = published[5].replace("XX", Translate(TimePassed, numbers));
        //TimePassedString = "Published " + TimePassed + " Days Ago";
      }
    } else {
      if (TimePassed === 1){
        console.log("Published " + TimePassed + " Hour Ago");
        TimePassedString = published[2].replace("XX", Translate(TimePassed, numbers));
        //TimePassedString = "Published " + TimePassed + " Hour Ago";
      } else {
        console.log("Published " + TimePassed + " Hours Ago");
        TimePassedString = published[3].replace("XX", Translate(TimePassed, numbers));
        //TimePassedString = "Published " + TimePassed + " Hours Ago";
      }
    }
  } else {
    if (TimePassed === 1){
      console.log("Published " + TimePassed + " Minute Ago");
      TimePassedString = published[0].replace("XX", Translate(TimePassed, numbers));
      //TimePassedString = "Published " + TimePassed + " Minute Ago";
    } else {
      console.log("Published " + TimePassed + " Minutes Ago");
      TimePassedString = published[1].replace("XX", Translate(TimePassed, numbers));
      //TimePassedString = "Published " + TimePassed + " Minutes Ago";
    }
  }
  return TimePassedString;
}

function NowNextSchedule({now, next, later}) {
  let nowTitle;
  let nowBrand;
  let nowSynopsis;
  let nowStart;
  let nowImage;
  let nowDay;

  let nextTitle;
  let nextBrand;
  let nextSynopsis;
  let nextStart;
  let nextImage;
  let nextDay;

  let laterTitle;
  let laterBrand;
  let laterSynopsis;
  let laterStart;
  let laterImage;
  let laterDay;

  try {
    nowTitle = now.title;
    nowBrand = now.brand;
    nowSynopsis = now.synopsis;
    if (nowSynopsis != null) {
      nowSynopsis = nowSynopsis.short;
    }
    let nowDateTime = (now.start.replace("Z", "")).split("T");
    let nowTime = nowDateTime[1].split(":");
    let nowHours = Translate(nowTime[0], numbers);
    let nowMinutes = Translate(nowTime[1], numbers);
    try {
      let days = config[lang][nowBrand];
      nowDay = days[new Date(nowDateTime[0]).getDay()];
    } catch {
      nowDay = daysOfWeek[new Date(nowDateTime[0]).getDay()];
    }
    nowStart = nowDay + " " + connectors[1] + " " + nowHours + ":" + nowMinutes + " " + connectors[0] + " " + nowBrand;
    if (now.thumbnail !== 'NO IMAGE') {
      nowImage = now.thumbnail;
    } else {
      nowImage = schedule_default;
    }
    
  } catch {
    console.log("No Now Schedule Data");
  }

  try {
    nextTitle = next.title;
    nextBrand = next.brand;
    nextSynopsis = next.synopsis;
    if (nextSynopsis != null) {
      nextSynopsis = nextSynopsis.short;
    }
    let nextDateTime = (next.start.replace("Z", "")).split("T");
    let nextTime = nextDateTime[1].split(":");
    let nextHours = Translate(nextTime[0], numbers);
    let nextMinutes = Translate(nextTime[1], numbers);
    try {
      let days = config[lang][nextBrand];
      nextDay = days[new Date(nextDateTime[0]).getDay()];
    } catch {
      nextDay = daysOfWeek[new Date(nextDateTime[0]).getDay()];
    }
    nextStart = nextDay + " " + connectors[1] + " " + nextHours + ":" + nextMinutes + " " + connectors[0] + " " + nextBrand;
    if (next.thumbnail !== 'NO IMAGE') {
      nextImage = next.thumbnail;
    } else {
      nextImage = schedule_default;
    }

  } catch {
    console.log("No Next Schedule Data");
  }

  try {
    laterTitle = later.title;
    laterBrand = later.brand;
    laterSynopsis = later.synopsis;
    if (laterSynopsis != null) {
      laterSynopsis = laterSynopsis.short;
    }
    let laterDateTime = (later.start.replace("Z", "")).split("T");
    let laterTime = laterDateTime[1].split(":");
    let laterHours = Translate(laterTime[0], numbers);
    let laterMinutes = Translate(laterTime[1], numbers);
    try {
      let days = config[lang][laterBrand];
      laterDay = days[new Date(laterDateTime[0]).getDay()];
    } catch {
      laterDay = daysOfWeek[new Date(laterDateTime[0]).getDay()];
    }
    laterStart = laterDay + " " + connectors[1] + " " + laterHours + ":" + laterMinutes + " " + connectors[0] + " " + laterBrand;
    if (later.thumbnail !== 'NO IMAGE') {
      laterImage = later.thumbnail;
    } else {
      laterImage = schedule_default;
    }

  } catch {
    console.log("No Later Schedule Data");
  }

  return (
    <Box sx={{ display: 'grid', fontFamily: 'BBCReithSans_W_Md', width: '910pxpx', gridTemplateRows: '1fr 1fr 1fr',  marginTop: '0px', marginRight: '50px'}}>
      <Box sx={{display: 'grid', gridTemplateColumns: '583px 327px', height: '184px', width: '910px', color: 'black', background: "#EBEBEB", marginBottom: "50px", borderRadius: '10px', overflow: 'hidden'}}>
        <TextTransition springConfig={presets.stiff}>
          <Box sx={{height: '154px', width: '583px'}}>
            <Typography dir='auto' color='red' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithQalam_W_Bd'} fontSize={'42px'}>{nowTitle}</Typography>
            <Typography dir='auto' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithQalam_W_Bd'} fontSize={'24px'}>{nowSynopsis}</Typography>        
          </Box>
          <Typography dir='auto' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithQalam_W_Rg'} fontSize={'20px'}>{nowStart}</Typography>
        </TextTransition>
        <TextTransition springConfig={presets.stiff}><img alt="" src={nowImage} height='184' borderRadius='10px'/></TextTransition>  
      </Box>
      <Box sx={{display: 'grid', gridTemplateColumns: '583px 327px', height: '184px', width: '910px', color: 'black', background: "#EBEBEB", marginBottom: "50px", borderRadius: '10px', overflow: 'hidden'}}>
        <TextTransition springConfig={presets.stiff}>
          <Box sx={{height: '154px', width: '583px'}}>
            <Typography dir='auto' color='red' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithQalam_W_Bd'} fontSize={'42px'}>{nextTitle}</Typography>
            <Typography dir='auto' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithQalam_W_Bd'} fontSize={'24px'}>{nextSynopsis}</Typography>
          </Box>
          <Typography dir='auto' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithQalam_W_Rg'} fontSize={'20px'}>{nextStart}</Typography>
        </TextTransition>
        <TextTransition springConfig={presets.stiff}><img alt="" src={nextImage} height='184px' borderRadius='10px'/></TextTransition>
      </Box>
      <Box sx={{display: 'grid', gridTemplateColumns: '583px 327px', height: '184px', width: '910px', color: 'black', background: "#EBEBEB", borderRadius: '10px', overflow: 'hidden'}}>
        <TextTransition springConfig={presets.stiff}>
          <Box sx={{height: '154px', width: '583px'}}>
            <Typography dir='auto' color='red' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithQalam_W_Bd'} fontSize={'42px'}>{laterTitle}</Typography>
            <Typography dir='auto' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithQalam_W_Bd'} fontSize={'24px'}>{laterSynopsis}</Typography>
          </Box>
          <Typography dir='auto' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithQalam_W_Rg'} fontSize={'20px'}>{laterStart}</Typography>
        </TextTransition>
        <TextTransition springConfig={presets.stiff}><img alt="" src={laterImage} height='184px' borderRadius='10px'/></TextTransition>
      </Box>
    </Box>
  )
}

function ScheduleSection({ params }) {
  const sid = params.sid || config.app.sid;
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
          const url = "https://ws-syndication.api.bbci.co.uk/api/broadcasts?page_size=100&api-key=" + config.app.schedulesKey + "&sid=" + sid + "&start_from=" + datetimeNOW + "&end_to=" + datetimeTMW;
          //const url = "http://programmes.api.bbc.com/nitro/api/broadcasts?api_key=" + config.app.schedulesKey2 + "&start_from=" + datetimeNOW + "&end_to=" + datetimeTMW + "&sid=" + config.app.sid;

          const r2 = await fetch(url);
          if (r2.ok) {
          const data = await r2.json();
          const items = data["ws_syndication"]["results"]["items"];
          scheduleItemCount = items.length;
          schedule = [];
          for (let i = 0; i < items.length; i++) {
            let title = items[i]["brand"]["title"];
            let brand = items[i]["brand"]["master_brand"].replace("bbc_", "").replace("_tv", "");
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

            let programme = {'title': title, 'brand': brand, 'episode': episode, 'synopsis': synopsis, 'start': start, 'duration': duration, 'thumbnail': thumbnail};
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
    <NowNextSchedule now={now} next={next} later={later}/>
  );
}

function NowNext({ headline, styling }) {
  let brand;
  //let seriesEpisode;
  let eventTime;
  let picture;

  try{
    brand = headline.headline;
    //seriesEpisode = headline.description;
    eventTime = calculateTimePassed(headline.date);
    if (headline.image === false) {
      picture = defaultImg;
    } else {
      picture = headline.image;
    }
    
  } catch {
    console.log("No Data Yet")
  }

  return (
    <Box sx={{
      width: '740px', height: '652px'
    }}>
      <TextTransition springConfig={presets.stiff}>
        <Box sx={{height: '652px', width: '740px',
        backgroundImage: 'linear-gradient(to bottom, rgba(45, 45, 45, 0), rgba(45, 45, 45, 0), rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 1), rgba(0, 0, 0, 1)), url('+ picture +')',
        backgroundSize: '741px', display: 'grid', gridTemplateRows: '275px 335px 42px', direction: 'rtl'
        }}>
          <Box></Box>
          <Box sx={{height: 'fit-content', paddingLeft: '10px', paddingRight: '10px'}}>
            <Typography dir='auto' fontFamily={'BBCReithQalam_W_Rg'} fontSize={'48px'}>{brand}</Typography>
          </Box>
          <Box sx={{paddingLeft: '10px', paddingRight: '10px'}}>
            <Typography dir='auto' fontFamily={'BBCReithQalam_W_Rg'} fontSize={'28px'}>{eventTime}</Typography>
          </Box>
        </Box>
      </TextTransition>
    </Box>
  );
}

function Bottom({ params }) {
  const feed = params.feed || config.app.feed;
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
        const url = "https://information-syndication.api.bbc.com/articles?api_key=" + config.app.headlinesKey + "&feed=" + feed + "&mixins=summary,thumbnail_images";
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
        <Box sx={{
            height: '652px', width: '740px', color: 'white',
            background: 'black',
            display: 'grid', gridTemplateColumns: '1fr', borderRadius: '10px', overflow: 'hidden'
          }}>
          <Box display='flex' alignItems='center'>
            <NowNext headline={headline} styling={styling} />
          </Box>
        </Box>
      </Slide>
    </Box>
  );
}

function TopRight({ params }) {
  lang = params.language || "pashto";
  daysOfWeek = config[lang].day;
  months = config[lang].month;
  numbers = config[lang].numbers;
  connectors = config[lang].connectors;
  published = config[lang].published;
  let showFullTime = params.fullTime || false;
  console.log(params.language);
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
        let Hours = Translate((("0" + TimeDate.getHours()).slice(-2)), numbers);
        let Minutes = Translate((("0" + TimeDate.getMinutes()).slice(-2)), numbers);
        let TodayDate = Translate(TimeDate.getDate(), numbers)
        let Year = Translate(TimeDate.getFullYear(), numbers)
        if (showFullTime === true) {
          let TimeDateStr = Hours + ":" + Minutes + " - " + daysOfWeek[TimeDate.getDay()] + " " + TodayDate + " " + months[TimeDate.getMonth()] + " " + Year;
          setTimeDate(TimeDateStr); 
        } else {
          let TimeDateStr = Hours + ":" + Minutes + " - " + daysOfWeek[TimeDate.getDay()];
          setTimeDate(TimeDateStr); 
        }
      })();
      }, 5000);
    return () => clearInterval(interval);
  });
  return (
    <Box>
      <Typography dir='rtl' fontFamily={'BBCReithQalam_W_Bd'} fontSize={'26px'}>{TimeDateString}</Typography>
      <Typography dir='rtl' fontFamily={'BBCReithQalam_W_Bd'} fontSize={'26px'}>{config[lang].heading}</Typography>
    </Box>
  );
}

function TopLeft({region}) {
  let icon = '';
  if (region === 'en'){
    icon = BBCNews2;
  } else {
    icon = BBCNews;
  }
  return <img alt='BBC News' height='68px' src={icon}/>;
}

/*
*/

export default function App(params) {
  return (
    <Paper>
      <Box sx={{
        width: 'auto', height: '100vh',
        display: 'grid', gridTemplateRows: '110px 134px 659px'
      }}>
        <Box>
          <video className='videoTag' autoPlay loop width='1920'
            height='1080'muted>
            <source src={sample} type='video/webm'/>
          </video>
        </Box>
        <Box sx={{ display: 'grid', width: '1700px', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr',  marginTop: '0px', marginLeft: '110px', marginRight: '110px'}}>
          <Box sx={{ display: 'block', marginTop: '13px' }}><TopLeft region={params.region}/></Box>
          <Box sx={{ display: 'block', marginTop: '14px' }}><TopRight params={params} /></Box>
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