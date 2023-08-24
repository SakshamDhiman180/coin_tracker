import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Button, ButtonGroup, CircularProgress, ThemeProvider, createTheme, makeStyles } from '@material-ui/core';
import { Line } from 'react-chartjs-2';

import { CryptoState } from '../CryptoCotext';
import { HistoricalChart } from '../config/api';
import { Chart, registerables } from 'chart.js';
import { chartDays } from '../config/data.js';
import SelectButton from './SelectButton';
import { useNavigate } from 'react-router-dom';
//import 'chartjs-adapter-date-fns';

const useStyles = makeStyles((theme) => ({
    container: {
        width: "75%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 25,
        padding: 40,
        [theme.breakpoints.down("md")]: {
            width: "100%",
            marginTop: 0,
            padding: 20,
            paddingTop: 0,
        },
        selectbutton: {
            border: "1px solid gold",
            borderRadius: 5,
            padding: 10,
            paddingLeft: 20,
            paddingRight: 20,
            fontFamily: "Montserrat",
            cursor: "pointer",
            // backgroundColor: selected ? "gold" : "",
            // color: selected ? "black" : "",
            // fontWeight: selected ? 700 : 500,
            "&:hover": {
              backgroundColor: "gold",
              color: "black",
            },
            width: "22%",
            //   margin: 5,
          },
    },
}));

const CoinInfo = ({ coin }) => {
    const [historicalData, setHistoricalData] = useState(null);
    const [days, setDays] = useState(1);
    const [flag, setflag] = useState(false);
    const { currency } = CryptoState();
    const chartRef = useRef(null);
    const navigate = useNavigate();

    const fetchHistoricalData = async () => {
        const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
        setflag(true);
        setHistoricalData(data.prices);
    };

    Chart.register(...registerables);

    useEffect(() => {
        fetchHistoricalData();
    }, [currency, days]);

    useEffect(() => {
        // Destroy existing chart instance before creating a new one
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        // Create a new chart
        if (historicalData) {
            Chart.register(...registerables);
            const ctx = document.getElementById('chart').getContext('2d');
            chartRef.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: historicalData.map((coin) => {
                        let date = new Date(coin[0]);
                        let time =
                            date.getHours() > 12
                                ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                                : `${date.getHours()}:${date.getMinutes()} AM`;
                        return days === 1 ? time : date.toLocaleDateString();
                    }),
                    datasets: [
                        {
                            data: historicalData.map((coin) => coin[1]),
                            label: `Price (Past ${days} Days) in ${currency}`,
                            borderColor: "#EEBC1D",
                        },
                    ],
                },
                options: {
                    elements: {
                        point: {
                            radius: 1,
                        },
                    },
                },
            });
        }
    }, [historicalData]);

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#fff",
            },
            type: "dark",
        },
    });

    const classes = useStyles();

    if (!historicalData) {
        return (
            <ThemeProvider theme={darkTheme}>
                <div className={classes.container}>
                    <CircularProgress style={{ color: "gold" }} size={250} thickness={1} />
                </div>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <div className={classes.container}>
                {!historicalData ? (
                    <CircularProgress style={{ color: 'gold' }} size={250} thickness={1} />
                ) : (
                    <canvas id="chart" />
                )}

                {/* btn */}
                <div
                    style={{
                        display: "flex",
                        marginTop: 20,
                        justifyContent: "space-around",
                        width: "100%",
                    }}
                >
                    {chartDays.map((day) => (
                        <SelectButton
                            key={day.value}
                            onClick={() => {
                                setDays(day.value);
                                setflag(false);
                            }}
                            selected={day.value === days}
                        >
                            {day.label}
                        </SelectButton>
                    ))}
                    <Button className={classes.selectbutton} variant="outlined" color='gold' onClick={()=>navigate(`/coins/live/${coin.id}`)}>
                        Live
                    </Button>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default CoinInfo;
