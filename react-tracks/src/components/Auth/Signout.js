import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { ApolloConsumer } from 'react-apollo'

const Signout = ({ classes }) => {
  const handaleSignout = client => {

    localStorage.removeItem('AuthToken')
      client.writeData({ data: { isLoggedIn: false } })
      console.log('user signed out', client)
  }

  return (
    <ApolloConsumer>
      {client => (
        <Button onClick={() => handaleSignout(client)}>
          <Typography
            variant="body1"
            className={classes.buttonText}
            color="secondary"
          >
            SignOut
      </Typography>
          <ExitToApp className={classes.buttonIcon} color="secondary" />
        </Button>
      )}
    </ApolloConsumer>


  )
};

const styles = {
  root: {
    cursor: "pointer",
    display: "flex"
  },
  buttonIcon: {
    marginLeft: "5px"
  }
};

export default withStyles(styles)(Signout);
