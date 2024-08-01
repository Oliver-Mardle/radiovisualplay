return (
  <Box sx={{
    width: '740px', height: '652px'
  }}>
    <TextTransition springConfig={presets.stiff}>
      <Box sx={{height: '652px', width: '740px',
      backgroundImage: 'linear-gradient(to bottom, rgba(45, 45, 45, 0), rgba(45, 45, 45, 0), rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 1), rgba(0, 0, 0, 1)), url('+ picture +')',
      backgroundSize: '741px', display: 'grid', gridTemplateRows: '310px 300px 42px', direction: 'rtl'
      }}>
        <Box></Box>
        <Box sx={{height: 'fit-content', paddingLeft: '10px', paddingRight: '10px'}}>
          <Typography dir='auto' fontFamily={'BBCReithQalam_W_Rg'} fontSize={'48px'}>{newsHeadline}</Typography>
        </Box>
        <Box sx={{paddingLeft: '10px', paddingRight: '10px'}}>
          <Typography dir='auto' fontFamily={'BBCReithQalam_W_Rg'} fontSize={'28px'}>{eventTime}</Typography>
        </Box>
      </Box>
    </TextTransition>
  </Box>
);