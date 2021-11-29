import { fuseDark } from '@fuse/fuse-colors';
import lightBlue from '@material-ui/core/colors/lightBlue';
import red from '@material-ui/core/colors/red';

const themesConfig = {
    default: {
        palette: {
            type: 'light',
            primary: {
                light: '#ffcfb3',
                main: '#bd1874',
                // dark: '#ac1900',
                dark: '#004d6c',
                contrastText: '#fff'
            },
            secondary: {
                light: '#3a4d60',
                main: '#102536',
                dark: '#000010',
                contrastText: '#fff'
            },
            error: red
        },
        status: {
            danger: 'orange'
        }
    },
    light1: {
        palette: {
            type: 'light',
            primary: {
                light: '#459393',
                main: '#046565',
                dark: '#003a3b'
            },
            secondary: {
                light: '#fff061',
                main: '#ffbe2b',
                dark: '#c78e00',
                contrastText: '#000'
            },
            error: red
        },
        status: {
            danger: 'orange'
        }
    },
    light2: {
        palette: {
            type: 'light',
            primary: {
                light: '#ffffb4',
                main: '#f8d683',
                dark: '#c3a555'
            },
            secondary: {
                light: '#fff061',
                main: '#ffbe2b',
                dark: '#c78e00',
                contrastText: '#000000'
            },
            error: red
        },
        status: {
            danger: 'orange'
        }
    },
    light3: {
        palette: {
            type: 'light',
            primary: {
                light: '#b17588',
                main: '#80485b',
                dark: '#521e32',
                contrastText: '#000'
            },
            secondary: {
                light: '#ffe279',
                main: '#ffb049',
                dark: '#c88114',
                contrastText: '#000'
            }
        }
    },
    light4: {
        palette: {
            type: 'light',
            primary: {
                light: '#8a81e4',
                main: '#5854b1',
                dark: '#232b81',
                contrastText: '#fff'
            },
            secondary: {
                light: '#fff0ff',
                main: '#e7bdd3',
                dark: '#b58da2'
            }
        }
    },
    light5: {
        palette: {
            type: 'light',
            primary: {
                light: '#746fff',
                main: '#3543d0',
                dark: '#001c9e',
                contrastText: '#fff'
            },
            secondary: {
                light: '#6bffff',
                main: '#01cffd',
                dark: '#009eca'
            }
        }
    },
    light6: {
        palette: {
            type: 'light',
            primary: {
                light: '#5bd0b5',
                main: '#1a9e85',
                dark: '#006f58'
            },
            secondary: {
                light: '#ff945f',
                main: '#ff6232',
                dark: '#c52e00',
                contrastText: '#000'
            }
        }
    },
    light7: {
        palette: {
            type: 'light',
            primary: {
                light: '#6665de',
                main: '#2b3bab',
                dark: '#00157b',
                contrastText: '#fff'
            },
            secondary: {
                light: '#73f4ff',
                main: '#33c1cd',
                dark: '#00909c',
                contrastText: '#000'
            }
        }
    },
    light8: {
        palette: {
            type: 'light',
            primary: {
                light: '#ffffff',
                main: '#ffede2',
                dark: '#ccbbb0'
            },
            secondary: {
                light: '#bbabff',
                main: '#887ce3',
                dark: '#5650b0',
                contrastText: '#000'
            }
        }
    },
    light9: {
        palette: {
            type: 'light',
            primary: {
                light: '#86fff7',
                main: '#4ecdc4',
                dark: '#009b94'
            },
            secondary: {
                light: '#ff9d99',
                main: '#ff6b6b',
                dark: '#c73840',
                contrastText: '#000'
            }
        }
    },
    light10: {
        palette: {
            type: 'light',
            primary: {
                light: '#9cfbff',
                main: '#68c8d5',
                dark: '#2f97a4'
            },
            secondary: {
                light: '#ffff75',
                main: '#fed441',
                dark: '#c7a300',
                contrastText: '#000'
            }
        }
    },
    defaultDark: {
        palette: {
            type: 'dark',
            primary: fuseDark,
            secondary: {
                light: lightBlue[400],
                main: lightBlue[600],
                dark: lightBlue[700]
            },
            error: red
        },
        status: {
            danger: 'orange'
        }
    },
};

export default themesConfig;
