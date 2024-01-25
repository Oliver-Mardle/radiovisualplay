import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography';
import { Temporal } from 'temporal-polyfill'
import Image from './newsbackground.png';
import sample from  './aarabicloop.mp4';
const iplayerPink = '#f54996';

const urls = {
  test: 'https://jfayiszondlcqngo5vavioz6bq0ibxen.lambda-url.eu-west-1.on.aws/',
  live: 'https://ypdjc6zbc5cnvth24lk3mm45sm0qtgps.lambda-url.eu-west-1.on.aws',
  ISAPI: 'https://information-syndication.api.bbc.com/articles?api_key=NDmFB0HOF7oBoq6gj7KfGiaQLW7ccoYp&feed=pashto-front-page&mixins=summary,thumbnail_images'
};

function titlefor(o, rel) {
  return o.title_hierarchy?.titles?.find((t) => t.inherited_from?.link?.rel === `pips-meta:${rel}`)?.title?.$;
}

function gettitles(item) {
  const b = titlefor(item, 'brand');
  const s = titlefor(item, 'series');
  const e = item.title_hierarchy?.titles?.find((t) => !t.inherited_from)?.title?.$;
  const t = b ? `${b}` : '';
  if (s) {
    return {
      episodeTitle: `${e}`,
      brandTitle: `${t}`,
      seriesTitle: `${s}`,
    };
  }
  return {
    episodeTitle: `${e}`,
    brandTitle: `${t}`,
    seriesTitle: '',
  };
}

function chooseNext(next, minDuration) {
  const ok = (next || []).filter((e) => {
    if (e?.duration && e?.title) {
      return Temporal.Duration.compare(minDuration, Temporal.Duration.from(e.duration)) < 0;
    }
    return false;
  });
  if (ok.length > 0) {
    return ok[0];
  }
  return { title: '' };
}

function NowNext({ now, next, previewMinutes, styling }) {

  let r;
  let brand;
  let seriesEpisode;
  let eventTitle;
  let eventTime;

  if (next) {
    const start = Date.parse(next.start);
    const minutesToNext = Math.round((start - (new Date())) / 1000 / 60);
    console.log('minutes  to next start', minutesToNext, ' previewMinutes', previewMinutes);
    if (minutesToNext <= 0) {
      r = '';
    }
    if (minutesToNext < previewMinutes) {
      const to = gettitles(next)
      r = `${to.brandTitle}`;
      seriesEpisode = to.seriesTitle ? `${to.seriesTitle}: ${to.episodeTitle}` : to.episodeTitle;
      eventTitle = 'ON NEXT';
      eventTime = `|  Starting in ${minutesToNext} mins`;
    }
  }
  console.log(`Are we going to show 'ON NEXT'? ${eventTitle} ${r}`);
  if (r) {
    brand = r;
  } else {
    if (now) {
      const end = Temporal.Instant.from(now.start).add(Temporal.Duration.from(now.duration));
      console.log(`start ${now.start} end ${end}`);
      const durationleft = Math.round(Temporal.Duration.from(Temporal.Now.instant().until(end)).seconds / 60);
      console.log(`Minutes left of Now playing? ${durationleft}`);
      const to = gettitles(now)
      brand = ` ${to.brandTitle}`;
      seriesEpisode = to.seriesTitle ? `${to.seriesTitle}: ${to.episodeTitle}` : to.episodeTitle;
      eventTitle = 'ON NOW';
      eventTime = `|  ${durationleft} mins left `;
    } else {
      brand = '';
    }
  }
  return (
    <Box sx={{
      width: 'auto', height: '153px',
      display: 'grid', gridTemplateRows: '1fr 1fr 1fr', paddingLeft: '5%', paddingbottom: '5%'
    }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'flex-end',
        }}
      >
        <Typography
          fontSize={'1.7rem'}>
          <span
            style={{
              fontFamily: 'BBCReithSans_W_ExBd',
              color: iplayerPink
            }}>
            {eventTitle}
          </span>
          &nbsp;&nbsp;{eventTime}</Typography>
      </Box>
      <Box>
        <Fade in={true} timeout={500}>
          <Typography
            fontFamily={'BBCReithSans_W_Bd'}
            fontSize={'2.6667rem'}>{brand}</Typography>
        </Fade>
      </Box>
      {styling === 'grownup' ?
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
          }}
        >
          <Fade in={true} timeout={500}>
            <Typography
              fontFamily={'BBCReithSans_W_Md'}
              fontSize={'2.2rem'}>{seriesEpisode}</Typography>
          </Fade>
        </Box>
        :
        ''
      }
    </Box>
  );
}

function Bottom({ params }) {

  const minDuration = Temporal.Duration.from(params.minDuration || 'PT2M');
  const previewMinutes = params.next ? parseInt(params.next) : 2;
  
  const env = params.env || 'live';
  const sid = params.sid || 'History_Channel';
  const region = params.region || 'eu-west-2';
  const styling = params.styling || 'grownup';

  const [on, setOn] = useState(false);
  const [now, setNow] = useState();
  const [next, setNext] = useState();
  const [steady, setSteady] = useState(false);
  const containerRef = React.useRef(null);
  let eventTime;

  const FALSE = true;
  console.log(steady);

  // 5 second timer
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
        console.log(sOfm);

        const r = await fetch(`${urls[env]}/${sid}/${region}`);
        
        function reqListener() {
          console.log(this.responseText);
        }
        
        const req = new XMLHttpRequest();
        req.addEventListener("load", reqListener);
        req.open("GET", "https://information-syndication.api.bbc.com/articles?api_key=NDmFB0HOF7oBoq6gj7KfGiaQLW7ccoYp&feed=pashto-front-page");
        req.send();

        if (r.ok) {
          const data = await r.json()
          setNext(chooseNext(data.next, minDuration));
          setNow(data.now);
        }
      })();
    }, 5000);
    return () => clearInterval(interval);
  });
  /*        <Box>{steady ? <Fade in={true} timeout={1000}>
              <Typography fontSize={'4rem'} color={iplayerPink} marginLeft={5} marginTop={3}>iPLAYER</Typography>
            </Fade>
            : <SequenceAnimator duration={3000} onSequenceEnd={() => setSteady(true)}>
              {introImages.map((im, index) => (<img key={index} src={im} alt='BBC' />))}
            </SequenceAnimator>
          }
          </Box
  */
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
            height: '153px', width: 'auto', color: 'black',
            background: 'linear-gradient(to right, rgba(15, 15, 15, .01), rgba(245, 73, 151, .01))',
            display: 'grid', gridTemplateColumns: '1fr', marginbottom: '100px'
          }
          : {
            height: '153px', width: 'auto', color: 'black',
            background: 'linear-gradient(to right, rgba(255, 255, 255, .9), rgba(255, 255, 255, .9))',
            display: 'grid', gridTemplateColumns: '1fr', marginbottom: '100px'
          }}>
          <Box display='flex' alignItems='center'>
            <NowNext now={now} next={next} previewMinutes={previewMinutes} styling={styling} />
          </Box>
        </Box>
      </Slide>
    </Box>
  );
}

function TopLeft({ show }) {
  if (show) {
    return '';//<img src={logo} alt='CBeebies' />;
  }
  return '';
}

function TopRight({ show }) {
  if (show) {
    return <img alt='bounce' src='https://upload.wikimedia.org/wikipedia/commons/1/14/Animated_PNG_example_bouncing_beach_ball.png' />;
  }
  return '';
}
export default function App(params) {
  const demo = true;
  return (
    <Paper sx={
      demo === true ?

      
        { backgroundImage: `url(${Image})`, backgroundRepeat: 'round' }
        : { backgroundColor: 'transparent' }}>
      <Box sx={{
        width: 'auto', height: '100vh',
        display: 'grid', gridTemplateRows: '0px 543px 153px 24px'
      }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
          <Box><TopLeft show={params.tl} /></Box>
          <Box></Box>
          <Box sx={{ display: 'block', marginLeft: 'auto' }}><TopRight show={params.tr} /></Box>
        </Box>
        <Box>
        <video className='videoTag' autoPlay loop width='1920'
        height='1080'muted>
    <source src={sample} type='video/mp4'        />
</video>

        </Box>
        <Bottom params={params} />
        <Box>
        </Box>
      </Box>
    </Paper>
  );
}