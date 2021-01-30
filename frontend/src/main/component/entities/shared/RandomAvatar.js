import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple, amber, blue, blueGrey, brown, green, grey, indigo, lightBlue } from '@material-ui/core/colors';
import { sample } from "lodash";

const useStyles = makeStyles((theme) => ({

    orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
    },
    purple: {
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
    },
    amber: {
        color: theme.palette.getContrastText(amber[500]),
        backgroundColor: amber[500],
    },
    blue: {
        color: theme.palette.getContrastText(blue[500]),
        backgroundColor: blue[500],
    },
    blueGrey: {
        color: theme.palette.getContrastText(blueGrey[500]),
        backgroundColor: blueGrey[500],
    },
    brown: {
        color: theme.palette.getContrastText(brown[500]),
        backgroundColor: brown[500],
    },

    grey: {
        color: theme.palette.getContrastText(grey[500]),
        backgroundColor: grey[500],
    },
    indigo: {
        color: theme.palette.getContrastText(green[500]),
        backgroundColor: green[500],
    },
    lightBlue: {
        color: theme.palette.getContrastText(indigo[500]),
        backgroundColor: indigo[500],
    },
    lightGreen: {
        color: theme.palette.getContrastText(lightBlue[500]),
        backgroundColor: lightBlue[500],
    }
}));

const RandomAvatar = ({ letter }) => {
    const classes = useStyles();
    const colorArray = ["orange", "purple", "amber", "blue", "blueGrey", "brown", "grey", "indigo", "lightBlue", "lightGreen"]
    return (
        <div>
            <Avatar className={classes[sample(colorArray)]}>{letter}</Avatar>
        </div>
    );
}

export default RandomAvatar;