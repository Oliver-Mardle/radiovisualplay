import React from 'react';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';
import { SequenceAnimator } from 'react-sequence-animator';
import BBCBoxes from './BBCBlocks';
import IPlayerLogo from './IPlayerLogo';

export default function IPlayerLowerThird({ on, onReady, onLeave, children }) {
    return (
        <Slide direction="up"
            in={on} mountOnEnter unmountOnExit
            onEntered={() => console.log('entered')}
            addEndListener={onReady}>
            <Box sx={{
                height: 120, width: 'auto', color: 'white',
                background: 'linear-gradient(to right, rgba(15, 15, 15, .7), rgba(245, 73, 151, .7))',
                display: 'grid', gridTemplateColumns: '1fr 4fr 1fr'
            }}>
                <Box>{on ? <Fade in={true} timeout={1000}><IPlayerLogo /></Fade>
                    : <SequenceAnimator duration={3000} onSequenceEnd={onLeave}>
                        <BBCBoxes />
                    </SequenceAnimator>
                }

                </Box>
                <Box>
                    {children}
                </Box>
                <Box></Box>
            </Box>
        </Slide>
    );
}
