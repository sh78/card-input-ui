import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(1),
    '& .MuiFormControl-root': {
      marginBottom: theme.spacing(2),
    }
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function PaymentForm() {
  const classes = useStyles();
  return (
    <>
      <form className={classes.form}>
        <Typography component="h1" variant="h4" align="center">
          Enter your credit card information
        </Typography>
        <TextField id="card-name" fullWidth label="Full name" variant="outlined" />
        <TextField
          id="card-number"
          fullWidth
          label="Card number"
          helperText="Last three digits on signature strip"
          variant="outlined"
        />
        <TextField
          id="card-expiration"
          fullWidth
          label="Expiration Date"
          variant="outlined"
        />
        <TextField
          id="card-cvv"
          fullWidth
          label="CVV2"
          helperText="Last three digits on signature strip"
          variant="outlined"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Pay Now
        </Button>
      </form>
    </>
  );
}

export default PaymentForm;
