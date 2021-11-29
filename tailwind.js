module.exports = {
    prefix     : '',
    important  : false,
    separator  : ':',
    theme      : {
        extend: {
            spacing           : {
                'xs'  : '32rem',
                'sm'  : '48rem',
                'md'  : '64rem',
                'lg'  : '80rem',
                'xl'  : '96rem',
                '2xl' : '112rem',
                '3xl' : '128rem',
                '4xl' : '144rem',
                '5xl' : '160rem',
                'auto': 'auto',
                'px'  : '1px',
                '0'   : '0',
                '4'   : '0.4rem',
                '6'   : '0.6rem',
                '8'   : '0.8rem',
                '12'  : '1.2rem',
                '16'  : '1.6rem',
                '20'  : '2rem',
                '24'  : '2.4rem',
                '28'  : '2.8rem',
                '32'  : '3.2rem',
                '36'  : '3.6rem',
                '40'  : '4rem',
                '44'  : '4.4rem',
                '48'  : '4.8rem',
                '52'  : '5.2rem',
                '56'  : '5.6rem',
                '60'  : '6rem',
                '64'  : '6.4rem',
                '68'  : '6.8rem',
                '72'  : '7.2rem',
                '76'  : '7.6rem',
                '80'  : '8rem',
                '84'  : '8.4rem',
                '88'  : '8.8rem',
                '92'  : '9.2rem',
                '96'  : '9.6rem',
                '128' : '12.8rem',
                '136' : '13.6rem',
                '160' : '16rem',
                '192' : '19.2rem',
                '200' : '20rem',
                '208' : '20.8rem',
                '216' : '21.6rem',
                '224' : '22.4rem',
                '256' : '25.6rem',
                '288' : '28.8rem',
                '320' : '32rem',
                '360' : '36rem',
                '384' : '38.4rem',
                '400' : '40rem',
                '512' : '51.2rem',
                '640' : '64rem',
                '960' : '96rem',
            },
            colors            : {
                'transparent'  : 'transparent',
                'black'        : '#22292F',
                'grey-darkest' : '#3D4852',
                'grey-darker'  : '#606F7B',
                'grey-dark'    : '#8795A1',
                'grey'         : '#B8C2CC',
                'grey-light'   : '#DAE1E7',
                'grey-lighter' : '#F1F5F8',
                'grey-lightest': '#F8FAFC',
                'white'        : '#FFFFFF',

                'red-darkest' : '#3B0D0C',
                'red-darker'  : '#621B18',
                'red-dark'    : '#CC1F1A',
                'red'         : '#E3342F',
                'red-light'   : '#EF5753',
                'red-lighter' : '#F9ACAA',
                'red-lightest': '#FCEBEA',

                'orange-darkest' : '#462A16',
                'orange-darker'  : '#613B1F',
                'orange-dark'    : '#DE751F',
                'orange'         : '#F6993F',
                'orange-light'   : '#FAAD63',
                'orange-lighter' : '#FCD9B6',
                'orange-lightest': '#FFF5EB',

                'yellow-darkest' : '#453411',
                'yellow-darker'  : '#684F1D',
                'yellow-dark'    : '#F2D024',
                'yellow'         : '#FFED4A',
                'yellow-light'   : '#FFF382',
                'yellow-lighter' : '#FFF9C2',
                'yellow-lightest': '#FCFBEB',

                'green-darkest' : '#0F2F21',
                'green-darker'  : '#1A4731',
                'green-dark'    : '#1F9D55',
                'green'         : '#38C172',
                'green-light'   : '#51D88A',
                'green-lighter' : '#A2F5BF',
                'green-lightest': '#E3FCEC',

                'teal-darkest' : '#0D3331',
                'teal-darker'  : '#20504F',
                'teal-dark'    : '#38A89D',
                'teal'         : '#4DC0B5',
                'teal-light'   : '#64D5CA',
                'teal-lighter' : '#A0F0ED',
                'teal-lightest': '#E8FFFE',

                'blue-darkest' : '#12283A',
                'blue-darker'  : '#1C3D5A',
                'blue-dark'    : '#2779BD',
                'blue'         : '#3490DC',
                'blue-light'   : '#6CB2EB',
                'blue-lighter' : '#BCDEFA',
                'blue-lightest': '#EFF8FF',

                'indigo-darkest' : '#191E38',
                'indigo-darker'  : '#2F365F',
                'indigo-dark'    : '#5661B3',
                'indigo'         : '#6574CD',
                'indigo-light'   : '#7886D7',
                'indigo-lighter' : '#B2B7FF',
                'indigo-lightest': '#E6E8FF',

                'purple-darkest' : '#21183C',
                'purple-darker'  : '#382B5F',
                'purple-dark'    : '#794ACF',
                'purple'         : '#9561E2',
                'purple-light'   : '#A779E9',
                'purple-lighter' : '#D6BBFC',
                'purple-lightest': '#F3EBFF',

                'pink-darkest' : '#451225',
                'pink-darker'  : '#6F213F',
                'pink-dark'    : '#EB5286',
                'pink'         : '#F66D9B',
                'pink-light'   : '#FA7EA8',
                'pink-lighter' : '#FFBBCA',
                'pink-lightest': '#FFEBEF'
            },
            screens           : {
                sm   : '600px',
                md   : '960px',
                lg   : '1280px',
                xl   : '1920px',
                print: {'raw': 'print'}
            },
            fontFamily        : {
                sans : [
                    'Muli',
                    'Roboto',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Oxygen',
                    'Ubuntu',
                    'Cantarell',
                    'Fira Sans',
                    'Droid Sans',
                    'Helvetica Neue',
                    'sans-serif'
                ],
                serif: [
                    'Constantia',
                    'Lucida Bright',
                    'Lucidabright',
                    'Lucida Serif',
                    'Lucida',
                    'DejaVu Serif',
                    'Bitstream Vera Serif',
                    'Liberation Serif',
                    'Georgia',
                    'serif'
                ],
                mono : [
                    'Menlo',
                    'Monaco',
                    'Consolas',
                    'Liberation Mono',
                    'Courier New',
                    'monospace'
                ]
            },
            fontSize          : {
                xs   : '1.2rem',     // 12px
                sm   : '2.4rem',     // 24px
                base : '1.6rem',     // 16px
                lg   : '1.8rem',     // 18px
                xl   : '2rem',       // 20px
                '2xl': '2.4rem',     // 24px
                '3xl': '3rem',       // 30px
                '4xl': '3.6rem',     // 36px
                '5xl': '4.8rem',      // 48px,
                '10' : '1rem',
                '11' : '1.1rem',
                '12' : '1.2rem',
                '13' : '1.3rem',
                '14' : '1.4rem',
                '15' : '1.5rem',
                '16' : '1.6rem',
                '17' : '1.7rem',
                '18' : '1.8rem',
                '19' : '1.9rem',
                '20' : '2rem',
                '24' : '2.4rem',
                '28' : '2.8rem',
                '32' : '3.2rem',
                '36' : '3.6rem',
                '40' : '4rem',
                '44' : '4.4rem',
                '48' : '4.8rem',
                '52' : '5.2rem',
                '56' : '5.6rem',
                '60' : '6rem',
                '64' : '6.4rem',
                '68' : '6.8rem',
                '72' : '7.2rem',
                '96' : '9.6rem',
                '128': '12.8rem'
            },
            fontWeight        : {
                hairline : '100',
                thin     : '200',
                light    : '300',
                normal   : '400',
                medium   : '500',
                semibold : '600',
                bold     : '700',
                extrabold: '800',
                black    : '900',
                '100'    : '100',
                '200'    : '200',
                '300'    : '300',
                '400'    : '400',
                '500'    : '500',
                '600'    : '600',
                '700'    : '700',
                '800'    : '800',
                '900'    : '900'
            },
            lineHeight        : {
                none   : '1',
                tight  : '1.25',
                snug   : '1.375',
                normal : '1.5',
                relaxed: '1.625',
                loose  : '2',
            },
            letterSpacing     : {
                tighter: '-0.05em',
                tight  : '-0.025em',
                normal : '0',
                wide   : '0.025em',
                wider  : '0.05em',
                widest : '0.1em',
            },
            textColor         : theme => theme('colors'),
            backgroundColor   : theme => theme('colors'),
            backgroundPosition: {
                bottom        : 'bottom',
                center        : 'center',
                left          : 'left',
                'left-bottom' : 'left bottom',
                'left-top'    : 'left top',
                right         : 'right',
                'right-bottom': 'right bottom',
                'right-top'   : 'right top',
                top           : 'top',
            },
            backgroundSize    : {
                auto   : 'auto',
                cover  : 'cover',
                contain: 'contain',
            },
            borderWidth       : {
                default: '1px',
                '0'    : '0',
                '1'    : '1px',
                '2'    : '2px',
                '3'    : '3px',
                '4'    : '4px',
                '8'    : '8px'
            },
            borderColor       : theme => ({
                ...theme('colors'),
                default: theme('colors.gray.300', 'currentColor'),
            }),
            borderRadius      : {
                none   : '0',
                sm     : '.2rem',
                default: '.4rem',
                lg     : '.8rem',
                full   : '9999px',
                '2'    : '.2rem',
                '4'    : '.4rem',
                '6'    : '.6rem',
                '8'    : '.8rem',
                '12'   : '1.2rem',
                '16'   : '1.6rem',
                '20'   : '2rem',
                '24'   : '2.4rem',
                '28'   : '2.8rem',
                '32'   : '3.2rem'
            },
            cursor            : {
                auto         : 'auto',
                default      : 'default',
                pointer      : 'pointer',
                wait         : 'wait',
                text         : 'text',
                move         : 'move',
                'not-allowed': 'not-allowed',
            },
            width             : theme => ({
                auto   : 'auto',
                ...theme('spacing'),
                '1/2'  : '50%',
                '1/3'  : '33.33333%',
                '2/3'  : '66.66667%',
                '1/4'  : '25%',
                '2/4'  : '50%',
                '3/4'  : '75%',
                '1/5'  : '20%',
                '2/5'  : '40%',
                '3/5'  : '60%',
                '4/5'  : '80%',
                '1/6'  : '16.66667%',
                '2/6'  : '33.33333%',
                '3/6'  : '50%',
                '4/6'  : '66.66667%',
                '5/6'  : '83.33333%',
                '1/12' : '8.33333%',
                '2/12' : '16.66667%',
                '3/12' : '25%',
                '4/12' : '33.33333%',
                '5/12' : '41.66667%',
                '6/12' : '50%',
                '7/12' : '58.33333%',
                '8/12' : '66.66667%',
                '9/12' : '75%',
                '10/12': '83.33333%',
                '11/12': '91.66667%',
                full   : '100%',
                screen : '100vw',
            }),
            height            : theme => ({
                auto  : 'auto',
                ...theme('spacing'),
                full  : '100%',
                screen: '100vh'
            }),
            minWidth          : theme => ({
                ...theme('spacing'),
                full  : '100%',
                screen: '100vw'
            }),
            minHeight         : theme => ({
                'auto': 'auto',
                ...theme('spacing'),
                full  : '100%',
                screen: '100vh'
            }),
            maxWidth          : theme => ({
                ...theme('spacing'),
                full  : '100%',
                screen: '100vw'
            }),
            maxHeight         : theme => ({
                'auto': 'auto',
                ...theme('spacing'),
                full  : '100%',
                screen: '100vh'
            }),
            padding           : theme => theme('spacing'),
            margin            : (theme, {negative}) => ({
                auto: 'auto',
                ...theme('spacing'),
                ...negative(theme('spacing')),
            }),
            objectPosition    : {
                bottom        : 'bottom',
                center        : 'center',
                left          : 'left',
                'left-bottom' : 'left bottom',
                'left-top'    : 'left top',
                right         : 'right',
                'right-bottom': 'right bottom',
                'right-top'   : 'right top',
                top           : 'top',
            },
            boxShadow         : {
                default: '0 2px 4px 0 rgba(0,0,0,0.10)',
                md     : '0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)',
                lg     : '0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08)',
                inner  : 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
                none   : 'none',
                '0'    : "none",
                '1'    : "0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12)",
                '2'    : "0px 1px 5px 0px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 3px 1px -2px rgba(0,0,0,0.12)",
                '3'    : "0px 1px 8px 0px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 3px 3px -2px rgba(0,0,0,0.12)",
                '4'    : "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
                '5'    : "0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)",
                '6'    : "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
                '7'    : "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)",
                '8'    : "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
                '9'    : "0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)",
                '10'   : "0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)",
                '11'   : "0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)",
                '12'   : "0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)",
                '13'   : "0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)",
                '14'   : "0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)",
                '15'   : "0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)",
                '16'   : "0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)",
                '17'   : "0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)",
                '18'   : "0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)",
                '19'   : "0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)",
                '20'   : "0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)",
                '21'   : "0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)",
                '22'   : "0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)",
                '23'   : "0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)",
                '24'   : "0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)",
            },
            zIndex            : {
                auto  : 'auto',
                '0'   : '0',
                '10'  : '10',
                '20'  : '20',
                '30'  : '30',
                '40'  : '40',
                '50'  : '50',
                '99'  : '99',
                '999' : '999',
                '9999': '9999'
            },
            opacity           : {
                '0'  : '0',
                '25' : '0.25',
                '50' : '0.5',
                '75' : '0.75',
                '100': '1'
            },
            fill              : {
                current: 'currentColor',
            },
            stroke            : {
                current: 'currentColor',
            },
            flex              : {
                '1'    : '1 1 0%',
                auto   : '1 1 auto',
                initial: '0 1 auto',
                none   : 'none',
            },
            flexGrow          : {
                '0'    : '0',
                default: '1',
            },
            flexShrink        : {
                '0'    : '0',
                default: '1',
            },
            order             : {
                first: '-9999',
                last : '9999',
                none : '0',
                '1'  : '1',
                '2'  : '2',
                '3'  : '3',
                '4'  : '4',
                '5'  : '5',
                '6'  : '6',
                '7'  : '7',
                '8'  : '8',
                '9'  : '9',
                '10' : '10',
                '11' : '11',
                '12' : '12',
            },
            listStyleType     : {
                none   : 'none',
                disc   : 'disc',
                decimal: 'decimal',
            },
            inset             : {
                '0' : '0',
                auto: 'auto',
            },
            container         : {}
        },
    },
    variants   : {
        appearance          : ['responsive'],
        backgroundAttachment: ['responsive'],
        backgroundColor     : ['responsive', 'hover', 'focus'],
        backgroundPosition  : ['responsive'],
        backgroundRepeat    : ['responsive'],
        backgroundSize      : ['responsive'],
        borderCollapse      : ['responsive'],
        borderColor         : ['responsive', 'hover', 'focus'],
        borderRadius        : ['responsive'],
        borderStyle         : ['responsive'],
        borderWidth         : ['responsive'],
        cursor              : ['responsive'],
        display             : ['responsive', 'hover', 'focus'],
        flexDirection       : ['responsive'],
        flexWrap            : ['responsive'],
        alignItems          : ['responsive'],
        alignSelf           : ['responsive'],
        justifyContent      : ['responsive'],
        alignContent        : ['responsive'],
        flex                : ['responsive'],
        flexGrow            : ['responsive'],
        flexShrink          : ['responsive'],
        order               : ['responsive'],
        float               : ['responsive'],
        fontFamily          : ['responsive'],
        fontWeight          : ['responsive', 'hover', 'focus'],
        height              : ['responsive'],
        lineHeight          : ['responsive'],
        listStylePosition   : ['responsive'],
        listStyleType       : ['responsive'],
        margin              : ['responsive'],
        maxHeight           : ['responsive'],
        maxWidth            : ['responsive'],
        minHeight           : ['responsive'],
        minWidth            : ['responsive'],
        objectFit           : ['responsive'],
        objectPosition      : ['responsive'],
        opacity             : ['responsive'],
        outline             : ['responsive', 'focus'],
        overflow            : ['responsive'],
        padding             : ['responsive'],
        pointerEvents       : ['responsive'],
        position            : ['responsive'],
        inset               : ['responsive'],
        resize              : ['responsive'],
        boxShadow           : ['responsive', 'hover', 'focus'],
        fill                : ['responsive'],
        stroke              : ['responsive'],
        tableLayout         : ['responsive'],
        textAlign           : ['responsive'],
        textColor           : ['responsive', 'hover', 'focus'],
        fontSize            : ['responsive'],
        fontStyle           : ['responsive', 'hover', 'focus'],
        textTransform       : ['responsive'],
        textDecoration      : ['responsive', 'hover', 'focus'],
        fontSmoothing       : ['responsive'],
        letterSpacing       : ['responsive'],
        userSelect          : ['responsive'],
        verticalAlign       : ['responsive'],
        visibility          : ['responsive'],
        whitespace          : ['responsive'],
        wordBreak           : ['responsive'],
        width               : ['responsive'],
        zIndex              : ['responsive']
    },
    corePlugins: {},
    plugins    : [],
};
