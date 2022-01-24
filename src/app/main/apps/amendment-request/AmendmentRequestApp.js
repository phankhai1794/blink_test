import React from 'react';
import { FusePageCarded } from '@fuse';
import { makeStyles } from '@material-ui/styles';
import AmendmentRequestHeader from './AmendmentRequestHeader';
import AmendmentRequestTable from './AmendmentRequestTable';
const useStyles = makeStyles((theme) => ({
  content: {
    '& canvas': {
      maxHeight: '100%'
    }
  },
  selectedProject: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: '8px 0 0 0'
  },
  projectMenuButton: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: '0 8px 0 0',
    marginLeft: 1
  }
}));
function AmendmentRequestApp(props) {
  const classes = useStyles(props);
  return (
    <FusePageCarded
      classes={{
        header: 'min-h-160 h-160',
        toolbar: 'min-h-48 h-48',
        rightSidebar: 'w-288',
        content: classes.content
      }}
      header={<AmendmentRequestHeader className="mr-8" />}
      // contentToolbar={
      //     <MonitorToolbar />
      // }
      content={<AmendmentRequestTable />}
    />
  );
}

export default AmendmentRequestApp;

// <Box>
//     {/* Search Bar */}
//     <Box sx={{ mt: "120px" }}>
//         <Box display="flex">
//             <Box sx={{ ml: "290px" }}>
//                 <TextField fullWidth />
//             </Box>
//             <Button color>
//                 create workspace
//             </Button>
//         </Box>
//     </Box>
//     {/*  */}
// </Box>