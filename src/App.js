import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography';
import BBCNews from './BBC_News_Afghanistan.png'
import BBCNews2 from './BBC_News_EN.png'
import schedule_default from './schedules_holding_image.jpg'
import sample from './BBCReithLoop.webm';
import audioloop from './AudioWave.webm';
import defaultImg from './default.png';
import speakerImg from './speaker.png';
import speakerBKImg from './speaker-bk.png';
import DariQR from './DariQR.png';
import PashtoQR from './PashtoQR.png';
import TextTransition, { presets } from 'react-text-transition';

const config = require('./config');

let counter = 0;
let counter2 = 0;
var scheduleItemCount = 0;
var newsItemCount = 0;
var downloadSchedule = true;
var downloadNews = true;
let schedule = [];
let feedAStories = [];
let feedBStories = [];
var lang = "";
var daysOfWeek = "";
var numbers = "";
var connectors = "";
let qrcodes = {'DariQR': DariQR, 'PashtoQR': PashtoQR};

function Translate(num, charSet) {
  const number = num;
  const characterSet = charSet;
  let splitNumber = Array.from(number.toString()).map(Number);
  let newNumber = "";
  for (let i = 0; i < splitNumber.length; i++) {
    newNumber = newNumber + characterSet[splitNumber[i]].toString();
  }
  return newNumber;
}

function calculateTimePassed(dateAndTime, published) {
  let eventTime = Date.parse(dateAndTime);
  let TimeDate = new Date();
  let TimePassed = Math.round((TimeDate - eventTime) / 60000);
  let TimePassedString = "";

  if (TimePassed > 59) {
    TimePassed = Math.round(TimePassed / 60);
    if (TimePassed > 24) {
      TimePassed = Math.round(TimePassed / 24);
      if (TimePassed === 1) {
        TimePassedString = published[4].replace("XX", Translate(TimePassed, numbers));
      } else {
        TimePassedString = published[5].replace("XX", Translate(TimePassed, numbers));
      }
    } else {
      if (TimePassed === 1) {
        TimePassedString = published[2].replace("XX", Translate(TimePassed, numbers));
      } else {
        TimePassedString = published[3].replace("XX", Translate(TimePassed, numbers));
      }
    }
  } else {
    if (TimePassed === 1) {
      TimePassedString = published[0].replace("XX", Translate(TimePassed, numbers));
    } else {
      TimePassedString = published[1].replace("XX", Translate(TimePassed, numbers));
    }
  }
  return TimePassedString;
}

function resizeFonts({ lengthBeforeCut, maxSize, length, cutPerCharacter }) {
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

function BuildScheduleBox({ scheduleData }) {
  let title;
  let brand;
  let synopsis;
  let start;
  let image;
  let day;
  let titleSize = 42;
  let synopsisSize = 24;
  let pid;

  let col1 = "1091px";
  let col2 = "327px";
  let direction = "auto";
  let titleColour = "red";

  try {
    if (scheduleData.type === 0) {
      title = scheduleData.title;
      brand = scheduleData.brand;
      synopsis = scheduleData.synopsis;
      if (synopsis != null) {
        synopsis = synopsis.short;
      }
      pid = scheduleData.pid;
      console.log(pid);
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
        start = day + " " + config[lang][brand + "connectors"][1] + " " + hours + ":" + minutes + " " + config[lang][brand + "connectors"][0]; // + " (" + pid + " - " + brand + ")";
      } catch {
        start = day + " " + connectors[1] + " " + hours + ":" + minutes + " " + connectors[0]; // + " (" + pid + " - " + brand + ")";
      }
  
      if (scheduleData.thumbnail !== 'NO IMAGE') {
        image = scheduleData.thumbnail;
      } else {
        image = schedule_default;
      }
  
    } else {
      col1 = '1234px';
      col2 = '184px';
      direction = scheduleData.dir;
      titleColour = "black";
      title = scheduleData.title;
      synopsis = scheduleData.subtitle;
      start = scheduleData.link;
      let link = scheduleData.qrcode;
      //console.log(link);
      image = qrcodes[link];
    }
  } catch {
    console.log("No Schedule Data");
  }

  let columns = col1 + ' ' + col2;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: columns, height: '184px', width: '1418px', color: 'black', background: "#EBEBEB", marginBottom: "50px", borderRadius: '10px', overflow: 'hidden' }}>
      <TextTransition springConfig={presets.stiff}>
        <Box sx={{ display: 'grid', gridTemplateRows: '67px 87px 30px', height: '184px', width: col1 }}>
          <Box sx={{ height: '67px', width: col1 }}>
            <Typography style={{ fontSize: titleSize }} id='name' dir={direction} color={titleColour} marginLeft={'10px'} marginRight={'10px'} fontFamily={'BBCReithQalam_W_Bd'}>{title}</Typography>
          </Box>
          <Box sx={{ height: '87px', width: col1 }}>
            <Typography style={{ fontSize: synopsisSize }} id='synopsis' dir={direction} marginLeft={'10px'} marginRight={'10px'} fontFamily={'BBCReithQalam_W_Bd'}>{synopsis}</Typography>
          </Box>
          <Typography dir={direction} marginLeft={'10px'} marginRight={'10px'} fontFamily={'BBCReithQalam_W_Rg'} fontSize={'20px'}>{start}</Typography>
        </Box>
      </TextTransition>
      <TextTransition springConfig={presets.stiff}><img alt="" src={image} height='184' borderRadius='10px' /></TextTransition>
    </Box>
  )
}

function ScheduleSection({ params }) {
  const sid = params.sid || config.app.sid;
  const [on, setOn] = useState(false);
  const [now, setNow] = useState();
  let eventTime;
  const FALSE = true;

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      (async () => {
        const sOfm = (eventTime);
        if ((sOfm) > 1) {
          setOn(true);
        } else {
          setOn(FALSE);
        }
        console.log(on);

        if (downloadSchedule === true) {
          const date = new Date();
          const datetimeNOW = (date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":00Z");
          const datetimeTMW = (date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate() + 1)).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":00Z");
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
              let synopsis = items[i]["brand"]["synopsis"];
              let start = items[i]["broadcast"]["published_time"]["attr"]["start"];
              let duration = items[i]["version"]["duration"];
              let thumbnail = items[i]["broadcast"]["image"]["attr"]["template_url"];
              let pid = items[i]["episode"]["pid"];
              let language = ""

              const r3 = await fetch("https://ws-syndication.api.bbci.co.uk/api/episodes?pid=" + pid + "&page_size=100&api-key=" + config.app.schedulesKey);
              if (r3.ok) {
                const data3 = await r3.json();
                try {
                  language = data3["ws_syndication"]["results"]["items"][0]["language"];
                } catch {
                  language = config["app"]["language"];
                }
                brand = config["languageCodes"][language];
              } else {
                language = config["app"]["language"];
                console.log("API Fault, unable to get language code - defaulting to " + language)
              }

              try {
                thumbnail = thumbnail.replace("{recipe}", "960x540");
              } catch {
                thumbnail = "NO IMAGE"
              }

              let programme = { 'title': title, 'brand': brand, 'episode': episode, 'synopsis': synopsis, 'start': start, 'duration': duration, 'thumbnail': thumbnail, 'pid': pid, 'type': 0 };
              let excludedProgrammes = config.excludedProgrammes['programmes'];
              console.log(excludedProgrammes);
              if (excludedProgrammes.includes(programme.title)) {
                console.log("Ignore " + programme.title)
              } else {
                //console.log(programme);
                schedule.push(programme);
              }
            }
            for (let i = 0; i < config.infoSlides.slides.length; i++) {
              //console.log(config.infoSlides.slides[i])
              schedule.push(config.infoSlides.slides[i])
            }
            scheduleItemCount = schedule.length;
            downloadSchedule = false;
          } else {
            console.log("Network Error - reusing old schedule!")
            downloadSchedule = false;
          }
        }
        if (counter2 === scheduleItemCount) {
          console.log("Download a new schedule!");
          downloadSchedule = true;
          counter2 = 0;
        }
        try {
          setNow(schedule[counter2]);
          counter2 = counter2 + 1;
        } catch (error) {
          console.log(error);
          console.log("No Schedule Has Been Downloaded Yet");
        }
      })();
    }, 15000);
    return () => clearInterval(interval);
  });
  return (
    <Box sx={{ display: 'grid', fontFamily: 'BBCReithQalam_W_Rg', width: '910pxpx', gridTemplateRows: '1fr', marginTop: '0px', marginRight: '50px' }}>
      <BuildScheduleBox scheduleData={now} />
    </Box>
  );
}

function News({ headline, styling }) {
  let newsHeadline;
  //let seriesEpisode;
  let eventTime;
  let picture;
  let language;
  let newsIndex;
  let published;
  let headlineSize = 38;
  published = config[lang]["published"];

  try {
    newsHeadline = headline.headline;
    headlineSize = resizeFonts({
      lengthBeforeCut: 100,
      maxSize: headlineSize,
      length: newsHeadline.length,
      cutPerCharacter: 2.4
    }) + 'px';
    eventTime = calculateTimePassed(headline.date, published);
    if (headline.image === false) {
      picture = defaultImg;
    } else {
      picture = headline.image;
    }
    newsIndex = headline.index;
    console.log(newsIndex);

  } catch {
    console.log(headline);
    console.log("No Data Yet");
  }

  try {
    language = config["languageCodes"][headline.languageCode];
    published = config[lang][language + "published"];
    eventTime = calculateTimePassed(headline.date, published);
  } catch {
    console.log("No language translation available - using " + lang);
  }

  return (
    <Box sx={{
      width: '665px', height: '585px', borderRadius: '10px', backgroundColor: '#D8D8D8', overflow: 'hidden'
    }}>
      <TextTransition springConfig={presets.stiff}>
        <Box sx={{
          height: '585px', width: '665px', display: 'grid', gridTemplateRows: '375px 210px', direction: 'rtl', color: 'black', backgroundColor: '#D8D8D8', overflow: 'hidden'
        }}>
          <Box><img alt="" src={picture} width='665px' borderRadius='10px' /></Box>
          <Box sx={{ height: '585px', width: '665px', display: 'grid', gridTemplateRows: '168px 42px', direction: 'rtl', color: 'black', backgroundColor: '#D8D8D8' }}>
            <Box sx={{ height: 'fit-content', paddingLeft: '10px', paddingRight: '10px' }}>
              <Typography dir='auto' fontFamily={'BBCReithQalam_W_Bd'} fontSize={headlineSize}>{newsHeadline}</Typography>
            </Box>
            <Box sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
              <Typography dir='auto' fontFamily={'BBCReithQalam_W_Rg'} fontSize={'28px'}>{eventTime}</Typography>
            </Box>
          </Box>
        </Box>
      </TextTransition>
    </Box>
  );
}

function unpackISAPIResponse(newsItems) {
  const parser = new DOMParser();
  newsItems = parser.parseFromString(newsItems, "text/xml");
  let stories = newsItems.getElementsByTagName('item');
  let allStories = []
  let headline = "";
  let description = "";
  let date = "";
  let image = "";
  let languageCode = "";
  for (let i = 0; i < stories.length; i++) {
    headline = (stories[i].childNodes[1].childNodes[0].nodeValue);
    if (stories[i].childNodes[7].nodeName === 'description') {
      description = (stories[i].childNodes[7].childNodes[0].nodeValue);
      date = (stories[i].childNodes[9].childNodes[0].nodeValue);
    } else {
      description = ("No Summary!");
      date = (stories[i].childNodes[7].childNodes[0].nodeValue);
    }

    date = (stories[i].getElementsByTagName('pubDate')[0].childNodes[0].nodeValue)
    headline = (stories[i].getElementsByTagName('title')[0].childNodes[0].nodeValue);
    try {
      description = (stories[i].getElementsByTagName('description')[0].childNodes[0].nodeValue);
    } catch {
      description = false;
    }
    try {
      image = (stories[i].getElementsByTagName('media:thumbnail')[0].attributes[0].nodeValue);
    } catch {
      image = false;
    }
    try {
      languageCode = newsItems.getElementsByTagName('language')[0].childNodes[0].nodeValue;
    } catch {
      languageCode = false;
    }

    allStories.push({ 'headline': headline, 'description': description, 'date': date, 'image': image, 'languageCode': languageCode, 'index': i });
  }
  return allStories
}

function NewsHeadlines({ params }) {
  let feeds = [];
  const feed = params.feed || [config.app.feedA, config.app.feedB];
  console.log(feed)

  try {
    feeds = feed.split(",");
  } catch {
    feeds.push(feed);
  }
  const [headlineA, setHeadlineA] = useState();
  const [headlineB, setHeadlineB] = useState();
  let eventTime;

  const [on, setOn] = useState(false);
  const containerRef = React.useRef(null);
  const styling = params.styling || 'grownup';
  const FALSE = true;

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      (async () => {
        const sOfm = (eventTime);
        if ((sOfm) > 1) {
          setOn(true);
        } else {
          setOn(FALSE);
        }
        console.log(on);

        if (downloadNews === true) {
          try {
            const r1 = await fetch("https://information-syndication.api.bbc.com/articles?api_key=" + config.app.headlinesKey + "&feed=" + feeds[0] + "&mixins=summary,thumbnail_images&sort=date_desc&number_of_items=5");
            if (r1.ok) {
              let newsItems = await r1.text();
              feedAStories = unpackISAPIResponse(newsItems)
            }
            const r2 = await fetch("https://information-syndication.api.bbc.com/articles?api_key=" + config.app.headlinesKey + "&feed=" + feeds[1] + "&mixins=summary,thumbnail_images&sort=date_desc&number_of_items=5");
            if (r2.ok) {
              let newsItems = await r2.text();
              feedBStories = unpackISAPIResponse(newsItems)
            }
          } catch {
            console.log("Network Error - reusing old stories!")
            downloadNews = false;
          }
          downloadNews = false;
          newsItemCount = feedAStories.length;
        }

        if (counter === newsItemCount) {
          console.log("Download new Stories!");
          downloadNews = true;
          counter = 0;
        }
        try {
          setHeadlineA(feedAStories[counter]);
          setHeadlineB(feedBStories[counter]);
          counter = counter + 1;
        } catch (error) {
          console.log(error);
          console.log("No News Has Been Downloaded Yet");
        }
      })();
    }, 20000);
    return () => clearInterval(interval);
  });

  return (
    <Box sx={{ overflow: 'hidden' }} ref={containerRef}>
      <Slide direction="up"
        in={on} mountOnEnter unmountOnExit
        container={containerRef.current}
        onEntered={() => console.log('entered')}
        timeout={500}>
        <Box sx={{
          height: '585px', width: '1418px',
          display: 'grid', gridTemplateColumns: '665px 88px 665px', borderRadius: '10px', overflow: 'hidden'
        }}>
          <Box display='flex' alignItems='center'>
            <News headline={headlineA} styling={styling} />            
          </Box>
          <Box></Box>
          <Box display='flex' alignItems='center'>
            <News headline={headlineB} styling={styling} />            
          </Box>
        </Box>
      </Slide>
    </Box>
  );
}

function TopRight({ params }) {
  lang = params.language || "pashto";
  daysOfWeek = config[lang].day;
  numbers = config[lang].numbers;
  connectors = config[lang].connectors;
  console.log(params.language);
  
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '440px 195px 70px'}}>
      <Box sx={{marginTop: '-18px'}}>
        <video className='videoTag' autoPlay loop width='440' height='247.5' muted><source src={audioloop} type='video/webm' /></video>
      </Box>
      <Box sx={{marginTop: '36px', marginRight: '35px'}}>
        <Typography dir='rtl' fontFamily={'BBCReithQalam_W_Bd'} fontSize={'75px'}>رادیو</Typography>
      </Box>
      <Box sx={{marginTop: '78px'}}>
        <img alt='Speaker' height='56px' src={speakerImg} />
      </Box>
    </Box>
  );
}

function TopLeft({ region }) {
  let icon = '';
  if (region === 'en') {
    icon = BBCNews2;
  } else {
    icon = BBCNews;
  }
  return <img alt='BBC News' height='68px' src={icon} />;
}

function UpperLayoutSwitch({ params }) {
  let mode = params.mode || '0';
  if (mode === '0') {
    return (
      <Box sx={{ display: 'grid', width: '1559px', height: '150px', gridTemplateColumns: '854px 1fr', marginTop: '0px', marginLeft: '110px', marginRight: '251px' }}>
        <Box sx={{ display: 'block', marginTop: '78px'}}><TopLeft region={params.region} /></Box>
        <Box sx={{ display: 'block'}}><TopRight params={params} /></Box>
      </Box>
    )
  } else {
    return (
      <Box sx={{ display: 'grid', width: '1559px', height: '150px', gridTemplateColumns: '854px 1fr', marginTop: '0px', marginLeft: '110px', marginRight: '251px' }}>
        <Box sx={{ display: 'block', marginTop: '123px'}}><TopLeft region={params.region} /></Box>
        <Box></Box>
      </Box>
    )
  }
}

function LowerLayoutSwitch({ params }) {
  let mode = params.mode || '0';
  let preset = params.preset || '0';
  let link = config.infoSlides.slides[preset].link
  let qrcode = qrcodes[config.infoSlides.slides[preset].qrcode]
  if (mode === '0') {
    return (
      <Box sx={{ display: 'grid', width: '1418px', gridTemplateRows: '585px 44px 184px', marginTop: '0px', marginLeft: '251px', marginRight: '251px' }}>
          <NewsHeadlines params={params} />
          <Box></Box>
          <ScheduleSection params={params} />
      </Box>
    )
  } else {
    return (
      <Box sx={{ display: 'grid', width: '1700px', height: '659px', gridTemplateColumns: '1fr 740px', marginTop: '43px', marginLeft: '110px', marginRight: '110px', borderRadius: '10px', overflow: 'hidden'}}>
        <Box sx={{display: 'grid', gridTemplateRows: '304px 73.5px 244px', background: '#EBEBEB'}}>
          <Box sx={{marginLeft: '370px', marginTop: '84px'}}><img alt="" src={qrcode} height='220'/></Box>
          <Box sx={{width: '960px', marginTop: '30px'}}><Typography dir='auto' color={'black'} textAlign={'center'} fontFamily={'BBCReithQalam_W_Rg'} fontSize={'29px'}>{link}</Typography></Box>
          <Box sx={{display: 'grid', gridTemplateColumns: '780px 180px'}}>
            <Box sx={{marginLeft: '52px', marginTop: '-88.5px'}}>
              <video className='videoTag' autoPlay loop width='728' height='410' muted><source src={audioloop} type='video/webm' /></video>
            </Box>
            <Box sx={{marginLeft: '-25px', marginTop: '77.5px'}}>
              <img alt='Speaker' height='78px' src={speakerBKImg} />
            </Box>
          </Box>
        </Box>
        <Box sx={{background: 'black', borderRadius: '10px'}}></Box>
      </Box>
    )
  }
}

export default function App(params) {
  return (
    <Paper>
      <Box sx={{
        width: 'auto', height: '100vh',
        display: 'grid', gridTemplateRows: '10px 185px 1fr'
      }}>
        <Box>
          <video className='videoTag' autoPlay loop width='1920'
            height='1080' muted>
            <source src={sample} type='video/webm' />
          </video>
        </Box>
        <UpperLayoutSwitch params={params}/>
        <LowerLayoutSwitch params={params}/>
      </Box>
    </Paper>
  );
}