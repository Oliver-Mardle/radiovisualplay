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

  if (TimePassed > 59) {
    TimePassed = Math.round(TimePassed / 60);
    if (TimePassed > 24){
      TimePassed = Math.round(TimePassed / 24);
      if (TimePassed === 1){
        TimePassedString = published[4].replace("XX", Translate(TimePassed, numbers));
      } else {
        TimePassedString = published[5].replace("XX", Translate(TimePassed, numbers));
      }
    } else {
      if (TimePassed === 1){
        TimePassedString = published[2].replace("XX", Translate(TimePassed, numbers));
      } else {
        TimePassedString = published[3].replace("XX", Translate(TimePassed, numbers));
      }
    }
  } else {
    if (TimePassed === 1){
      TimePassedString = published[0].replace("XX", Translate(TimePassed, numbers));
    } else {
      TimePassedString = published[1].replace("XX", Translate(TimePassed, numbers));
    }
  }
  return TimePassedString;
}

function resizeFonts ({lengthBeforeCut, maxSize, length, cutPerCharacter}) {
  let fontSize;
  let overflow;
  if (length <= lengthBeforeCut) {
    fontSize = maxSize;
  } else {
    overflow = length - lengthBeforeCut;
    fontSize = maxSize - ((overflow / 10) * cutPerCharacter);
  }
  return (fontSize)
}

function BuildScheduleBox({scheduleData}) {
  let title;
  let brand;
  let synopsis;
  let start;
  let image;
  let day;
  let titleSize = 42;
  let synopsisSize = 24;

  try {
    title = scheduleData.title;
    brand = scheduleData.brand;
    synopsis = scheduleData.synopsis;
    if (synopsis != null) {
      synopsis = synopsis.short;
    }
    let dateTime = (scheduleData.start.replace("Z", "")).split("T");
    let time = dateTime[1].split(":");
    let hours = Translate(time[0], numbers);
    let minutes = Translate(time[1], numbers);
    try {
      let days = config[lang][brand];
      day = days[new Date(dateTime[0]).getDay()];
    } catch {
      day = daysOfWeek[new Date(dateTime[0]).getDay()];
    }
    try {
      start = day + " " + config[lang][brand+"connectors"][1] + " " + hours + ":" + minutes + " " + config[lang][brand+"connectors"][0];
    } catch {
      start = day + " " + connectors[1] + " " + hours + ":" + minutes + " " + connectors[0];
    }
    
    if (scheduleData.thumbnail !== 'NO IMAGE') {
      image = scheduleData.thumbnail;
    } else {
      image = schedule_default;
    }
    titleSize = resizeFonts ({
      lengthBeforeCut: 20,
      maxSize: titleSize,
      length: title.length,
      cutPerCharacter: 7
    }) + 'px';

    synopsisSize = resizeFonts ({
      lengthBeforeCut: 100,
      maxSize: synopsisSize,
      length: synopsis.length,
      cutPerCharacter: 3.5
    }) + 'px';

  } catch {
    console.log("No Schedule Data");
  }

  return (
    <Box sx={{display: 'grid', gridTemplateColumns: '583px 327px', height: '184px', width: '910px', color: 'black', background: "#EBEBEB", marginBottom: "50px", borderRadius: '10px', overflow: 'hidden'}}>
        <TextTransition springConfig={presets.stiff}>
          <Box sx={{display: 'grid', gridTemplateRows: '67px 87px 30px', height: '184px', width: '583px'}}>
          <Box sx={{height: '67px', width: '583px'}}>
            <Typography style={{fontSize: titleSize}} id='name' dir='auto' color='red' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithQalam_W_Bd'}>{title}</Typography>
          </Box>
          <Box sx={{height: '87px', width: '583px'}}>
            <Typography style={{fontSize: synopsisSize}} id='synopsis' dir='auto' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithQalam_W_Bd'}>{synopsis}</Typography>
          </Box>
            <Typography dir='auto' marginLeft={'10px'} marginRight={'10px'}fontFamily={'BBCReithQalam_W_Rg'} fontSize={'20px'}>{start}</Typography>
          </Box>
        </TextTransition>
      <TextTransition springConfig={presets.stiff}><img alt="" src={image} height='184' borderRadius='10px'/></TextTransition>  
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
    <Box sx={{ display: 'grid', fontFamily: 'BBCReithSans_W_Md', width: '910pxpx', gridTemplateRows: '1fr 1fr 1fr',  marginTop: '0px', marginRight: '50px'}}>
      <BuildScheduleBox scheduleData={now} />
      <BuildScheduleBox scheduleData={next} />
      <BuildScheduleBox scheduleData={later} />
    </Box>
  );
}

function News({ headline, styling }) {
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

function NewsHeadlines({ params }) {
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
            <News headline={headline} styling={styling} />
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
      }, 500);
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
          <NewsHeadlines params={params} />
        </Box>
      </Box>
    </Paper>
  );
}